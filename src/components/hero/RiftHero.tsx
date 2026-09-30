import { MenuIcon } from "lucide-react";
import {
	Fragment,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Lockup from "#/components/brand/Lockup";
import { Button } from "#/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";
import type { RiftRenderer } from "./rift-scene";

/**
 * What draws the rift behind the hero. "webgl" renders it live with Three.js
 * (rift-scene.ts); "video" plays the pre-rendered files in public/video/, which
 * are kept as a fallback option but not served while this is "webgl".
 */
const HERO_MEDIA: "webgl" | "video" = "webgl";

/** Video only: the tear finishes opening at ~2.33 s; the settled electricity loops from here. */
const LOOP_START = 3.467;
/** Intro timings in hero.css are relative to this point (video time 0). */
const LETTERS_AT = 2.2;
/** How long the intro waits for the WebGL rift before running without it. */
const RIFT_WAIT_MS = 2500;

// TODO: link destinations are not decided yet.
const NAV_LINKS = [
	{ label: "ROBOTS", href: "#" },
	{ label: "TEAM", href: "#" },
	{ label: "SPONSORS", href: "#" },
];
const JOIN_HREF = "#";

const EMBERS = [
	{ left: 12, top: 91, delay: 0 },
	{ left: 18, top: 84, delay: 4.5, tone: "ice" },
	{ left: 24, top: 97, delay: 6.8 },
	{ left: 33, top: 89, delay: 3.7, tone: "violet" },
	{ left: 39, top: 96, delay: 8.6, tone: "ice" },
	{ left: 45, top: 87, delay: 5.7 },
	{ left: 55, top: 95, delay: 7.5, tone: "ice" },
	{ left: 61, top: 91, delay: 3.2 },
	{ left: 69, top: 98, delay: 9.6, tone: "violet" },
	{ left: 75, top: 88, delay: 5.2, tone: "ice" },
	{ left: 81, top: 94, delay: 7.3 },
	{ left: 88, top: 97, delay: 4.1, tone: "ice" },
];

const KICKOFF_FACTS = ["BA1130", "OCT 2", "7-8 PM"];

type IntroMode = "play" | "still";
/** WebGL only: "loading" holds the intro, "slow" gave up waiting and shows the still underneath. */
type RiftState = "loading" | "ready" | "slow";

/** Seconds the CSS intro has run (the letters' animation clock). */
function introElapsed(hero: HTMLElement) {
	const [letterIn] = hero.querySelector(".hero-letter")?.getAnimations() ?? [];
	return Number(letterIn?.currentTime ?? 0) / 1000;
}

/** Delays the intro so the letters land LETTERS_AT seconds after the media's time 0. */
function shiftIntro(hero: HTMLElement, lag: number) {
	if (Math.abs(lag) > 0.02) hero.style.setProperty("--intro-shift", `${lag}s`);
}

export default function RiftHero() {
	const heroRef = useRef<HTMLDivElement>(null);
	const [mode, setMode] = useState<IntroMode>("play");
	const [riftState, setRiftState] = useState<RiftState | undefined>();
	const showStill = useCallback(() => setMode("still"), []);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setMode("still");
		}
	}, []);

	return (
		<div
			ref={heroRef}
			className="hero"
			data-theme="dark"
			data-intro={mode}
			data-rift={mode === "play" ? riftState : undefined}
		>
			<div className="hero-frame" data-media={HERO_MEDIA} aria-hidden="true">
				<div className="hero-still" />
				{mode === "play" &&
					(HERO_MEDIA === "webgl" ? (
						<RiftCanvas
							heroRef={heroRef}
							onState={setRiftState}
							onFail={showStill}
						/>
					) : (
						<RiftVideo heroRef={heroRef} onFail={showStill} />
					))}
			</div>

			<div className="hero-dots" aria-hidden="true" />

			<div aria-hidden="true">
				{EMBERS.map((ember) => (
					<div
						key={`${ember.left}-${ember.top}`}
						className="hero-ember"
						data-tone={ember.tone}
						style={{
							left: `${ember.left}%`,
							top: `${ember.top}%`,
							animationDelay: ember.delay ? `${ember.delay}s` : undefined,
						}}
					/>
				))}
			</div>

			<div className="hero-letters" aria-hidden="true">
				<div>
					<span className="hero-letter">R</span>
				</div>
				<div>
					<span className="hero-letter">FT</span>
				</div>
			</div>

			<header className="hero-header hero-ui">
				<Lockup />

				<nav aria-label="Primary" className="hero-nav flex items-center gap-10">
					{NAV_LINKS.map((link) => (
						<a key={link.label} href={link.href} className="hero-nav-link">
							{link.label}
						</a>
					))}
					<Button asChild variant="outline">
						<a href={JOIN_HREF}>Join</a>
					</Button>
				</nav>

				<MobileMenu />
			</header>

			<main className="hero-main">
				<h1 className="sr-only">UTRA RIFT</h1>

				<div className="hero-copy hero-ui is-late">
					<p className="hero-tagline">PAINTBALL FOR ROBOTS</p>
					<p className="hero-body">
						Become a founding member for UTRA's newest team, competing at the
						ARC Championships.
					</p>
				</div>

				<div className="hero-kick hero-ui is-late">
					<p className="hero-when">
						<b>KICKOFF</b>
						{KICKOFF_FACTS.map((fact, i) => (
							<Fragment key={fact}>
								{i > 0 && (
									<>
										<span aria-hidden="true"> | </span>
										<span className="sr-only">, </span>
									</>
								)}
								{fact}
							</Fragment>
						))}
					</p>
					<Button asChild variant="accent">
						<a href={JOIN_HREF}>Join the team</a>
					</Button>
				</div>
			</main>

			<div className="hero-cue hero-ui is-late" aria-hidden="true" />
		</div>
	);
}

type MediaProps = {
	heroRef: RefObject<HTMLDivElement | null>;
	onFail: () => void;
};

function RiftCanvas({
	heroRef,
	onState,
	onFail,
}: MediaProps & { onState: (state: RiftState) => void }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const hero = heroRef.current;
		const canvas = canvasRef.current;
		// This effect runs before RiftHero's own, so check reduced motion here too.
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (!hero || !canvas || reduce) return;

		let disposed = false;
		let renderer: RiftRenderer | undefined;
		let observer: IntersectionObserver | undefined;

		// Hold the intro while the rift loads, unless it is already well under way.
		let waiting = introElapsed(hero) < LETTERS_AT - 0.4;
		onState(waiting ? "loading" : "slow");
		const giveUp = window.setTimeout(() => {
			waiting = false;
			onState("slow");
		}, RIFT_WAIT_MS);

		import("./rift-scene")
			.then(async ({ createRiftRenderer, RIFT_START, RIFT_VIDEO_OFFSET }) => {
				const created = await createRiftRenderer(canvas);
				if (disposed) {
					created.dispose();
					return;
				}
				renderer = created;
				window.clearTimeout(giveUp);

				const elapsed = introElapsed(hero);
				if (waiting || elapsed < LETTERS_AT) {
					// Start the opening now and let the letters follow it. The intro is
					// timed in video time, and the rift starts `lead` seconds into that.
					const lead = RIFT_START - RIFT_VIDEO_OFFSET;
					shiftIntro(hero, elapsed - lead);
					renderer.start(RIFT_START);
				} else {
					// The intro already ran: join the rift at the same point in time.
					renderer.start(RIFT_VIDEO_OFFSET + elapsed);
				}
				onState("ready");
				setVisible(true);
				if (import.meta.env.DEV) Object.assign(window, { __rift: renderer });

				observer = new IntersectionObserver(([entry]) =>
					renderer?.setVisible(entry.isIntersecting),
				);
				observer.observe(canvas);
			})
			.catch((error: unknown) => {
				console.error("WebGL rift failed, showing the still frame.", error);
				if (!disposed) onFail();
			});

		return () => {
			disposed = true;
			window.clearTimeout(giveUp);
			observer?.disconnect();
			renderer?.dispose();
		};
	}, [heroRef, onState, onFail]);

	return (
		<canvas ref={canvasRef} data-visible={visible || undefined} tabIndex={-1} />
	);
}

function RiftVideo({ heroRef, onFail }: MediaProps) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		const hero = heroRef.current;
		if (!video || !hero) return;

		const play = () =>
			video.play().catch((error: DOMException) => {
				// Autoplay blocked (e.g. iOS Low Power Mode): show the settled frame.
				if (error.name === "NotAllowedError") onFail();
			});

		// The letters and UI are timed from page load. If the video starts late
		// (slow network), push them back so they still land as the tear opens.
		const syncIntro = () => {
			const elapsed = introElapsed(hero);
			if (elapsed < LETTERS_AT) shiftIntro(hero, elapsed - video.currentTime);
		};

		const onEnded = () => {
			video.currentTime = LOOP_START;
			play();
		};

		video.muted = true;
		video.addEventListener("ended", onEnded);
		video.addEventListener("playing", syncIntro, { once: true });
		play();

		return () => {
			video.removeEventListener("ended", onEnded);
			video.removeEventListener("playing", syncIntro);
		};
	}, [heroRef, onFail]);

	return (
		<video
			ref={videoRef}
			autoPlay
			muted
			playsInline
			preload="auto"
			poster="/video/rift-hero-poster.jpg"
			disablePictureInPicture
			tabIndex={-1}
		>
			{/* AV1 10-bit (Chrome, Firefox, Edge), HEVC 10-bit (Safari), H.264. */}
			<source
				src="/video/rift-hero.webm"
				type='video/webm; codecs="av01.0.08M.10"'
			/>
			<source
				src="/video/rift-hero-hevc.mp4"
				type='video/mp4; codecs="hvc1.2.4.L120.B0"'
			/>
			<source src="/video/rift-hero.mp4" type="video/mp4" />
		</video>
	);
}

function MobileMenu() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="hero-menu-trigger -mr-2.5"
				>
					<MenuIcon className="size-6" strokeWidth={1.5} />
					<span className="sr-only">Open menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				data-theme="dark"
				className="w-full px-4 pt-20 pb-8 sm:max-w-sm"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Site navigation</SheetDescription>
				<nav aria-label="Primary" className="flex flex-col">
					{NAV_LINKS.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="border-b py-4 font-wide text-lg font-medium tracking-[0.06em] text-ink transition-colors hover:text-cyan"
						>
							{link.label}
						</a>
					))}
				</nav>
				<Button asChild variant="outline" className="mt-auto w-full">
					<a href={JOIN_HREF}>Join</a>
				</Button>
			</SheetContent>
		</Sheet>
	);
}
