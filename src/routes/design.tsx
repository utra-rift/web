import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import Lockup from "#/components/brand/Lockup";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardEyebrow,
	CardHeader,
	CardMeta,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import {
	colorTokens,
	radiusTokens,
	resolveColor,
	shadowTokens,
	spacingTokens,
	type Theme,
	typeFamilies,
	typeGroups,
} from "#/design/tokens";
import { contrastRatio } from "#/lib/contrast";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/design")({
	head: () => ({ meta: [{ title: "Design system · RIFT" }] }),
	component: DesignSystem,
});

const SECTIONS = [
	{ id: "colour", label: "Colour" },
	{ id: "type", label: "Type" },
	{ id: "spacing", label: "Spacing" },
	{ id: "shape", label: "Shape & depth" },
	{ id: "logos", label: "Logos" },
	{ id: "imagery", label: "Imagery" },
	{ id: "components", label: "Components" },
	{ id: "motion", label: "Motion" },
	{ id: "voice", label: "Voice" },
];

const BRAND_COLOURS = ["ice", "navy", "cyan", "violet"];

// Tailwind only generates classes it can see as literal strings.
const TYPE_CLASS: Record<string, string> = {
	"display-xl": "type-display-xl",
	"display-lg": "type-display-lg",
	"display-sm": "type-display-sm",
	title: "type-title",
	body: "type-body",
	"body-sm": "type-body-sm",
	label: "type-label",
	data: "type-data",
};

const FAMILY_SAMPLES: Record<string, { className: string; sample: string }> = {
	display: { className: "font-display font-bold uppercase", sample: "R ✦ FT" },
	wide: {
		className: "font-wide font-semibold uppercase",
		sample: "Paintball for robots",
	},
	sans: {
		className: "font-sans",
		sample: "We design, build and drive robots.",
	},
	mono: { className: "font-mono", sample: "BA1130 · 24V · @utra_rift" },
};

const TEXT_PAIRS = [
	{ fg: "ink", bg: "surface" },
	{ fg: "ink-muted", bg: "surface" },
	{ fg: "ink", bg: "surface-raised" },
	{ fg: "ink-muted", bg: "surface-raised" },
	{ fg: "on-navy", bg: "surface-brand" },
	{ fg: "on-cyan", bg: "cyan" },
	{ fg: "on-violet", bg: "violet", note: "Large or bold 19px+ only" },
	{ fg: "cyan-text", bg: "surface" },
	{ fg: "cyan-text", bg: "cyan-soft" },
	{ fg: "violet-text", bg: "surface" },
	{ fg: "violet-text", bg: "violet-soft" },
	{ fg: "focus", bg: "surface", note: "Focus ring, needs 3:1" },
];

const HERO_TIMELINE = [
	{
		at: "0s",
		what: "The WebGL rift starts at Blender frame 46, as soon as it has loaded. The intro waits for it, up to 2.5s.",
	},
	{ at: "0.03s", what: "First ignition sparks; the tear starts at 0.13s." },
	{
		at: "1.87s",
		what: "R and FT slide in from the sides with a blur-in (1.3s, ease-out-expo).",
	},
	{ at: "2.0s", what: "The tear finishes opening." },
	{ at: "2.57s", what: "Header fades up 14px (0.9s)." },
	{ at: "2.77s", what: "Copy, kickoff details and CTA fade up." },
	{
		at: "7.13s",
		what: "The opening ends; frames 106-260 loop at 0.4x speed, with the opening settled.",
	},
];

function DesignSystem() {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		const root = document.documentElement;
		root.dataset.theme = theme;
		return () => {
			root.dataset.theme = "dark";
		};
	}, [theme]);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
				<div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-8">
					<Link to="/" aria-label="RIFT home" className="shrink-0">
						<img
							src="/logos/rift-wordmark.svg"
							alt=""
							width={194}
							height={160}
							className="h-10 w-auto dark:hidden"
						/>
						<img
							src="/logos/rift-wordmark-white.svg"
							alt=""
							width={194}
							height={160}
							className="hidden h-10 w-auto dark:block"
						/>
					</Link>
					<span className="type-label text-muted-foreground">
						Design system
					</span>
					<ToggleGroup
						type="single"
						variant="outline"
						size="sm"
						value={theme}
						onValueChange={(value) => value && setTheme(value as Theme)}
						aria-label="Theme"
						className="ml-auto"
					>
						<ToggleGroupItem value="light">Light</ToggleGroupItem>
						<ToggleGroupItem value="dark">Arena</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<nav
					aria-label="Sections"
					className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 pb-3 md:px-8"
				>
					{SECTIONS.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							className="shrink-0 type-body-sm text-muted-foreground transition-colors hover:text-ink"
						>
							{section.label}
						</a>
					))}
				</nav>
			</header>

			<main className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
				<div className="py-12 md:py-16">
					<h1 className="type-display-lg md:type-display-xl">Design system</h1>
					<p className="mt-4 max-w-2xl type-body text-muted-foreground">
						RIFT is the University of Toronto Robotics Association team
						competing in the ARC Championships. The identity is a torn
						four-point spark on navy and ice, wide geometric capitals and hard
						edges: an arena at night, one bright shape, very few words.
					</p>
					<p className="mt-4 type-data text-muted-foreground">
						Source: src/design/tokens.data.ts · src/design/tokens.css
					</p>
				</div>

				<ColourSection theme={theme} />
				<TypeSection />
				<SpacingSection />
				<ShapeSection />
				<LogosSection />
				<ImagerySection />
				<ComponentsSection />
				<MotionSection />
				<VoiceSection />
			</main>
		</div>
	);
}

function Section({
	id,
	title,
	intro,
	children,
}: {
	id: string;
	title: string;
	intro?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section
			id={id}
			aria-labelledby={`${id}-title`}
			className="scroll-mt-32 border-t py-12"
		>
			<h2 id={`${id}-title`} className="type-display-sm">
				{title}
			</h2>
			{intro && (
				<p className="mt-3 max-w-2xl type-body text-muted-foreground">
					{intro}
				</p>
			)}
			<div className="mt-8">{children}</div>
		</section>
	);
}

function SubHeading({ children }: { children: ReactNode }) {
	return <h3 className="mb-4 type-label text-muted-foreground">{children}</h3>;
}

function ColourSection({ theme }: { theme: Theme }) {
	const semantic = colorTokens.filter(
		(token) => !BRAND_COLOURS.includes(token.name),
	);

	return (
		<Section
			id="colour"
			title="Colour"
			intro="Four brand colours, in this order of weight: navy is the identity, ice the light ground, cyan the accent for fills, violet the rare second accent (under 10% of any layout)."
		>
			<SubHeading>Brand</SubHeading>
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{BRAND_COLOURS.map((name) => {
					const token = colorTokens.find((t) => t.name === name);
					return (
						<div key={name} className="flex flex-col gap-3">
							<div
								className="h-28 rounded-md border"
								style={{ background: `var(--${name})` }}
							/>
							<div className="flex items-baseline justify-between gap-2">
								<span className="type-label">{name}</span>
								<span className="type-data text-muted-foreground">
									{resolveColor(name, theme)}
								</span>
							</div>
							<p className="type-body-sm text-muted-foreground">
								{token?.usage}
							</p>
						</div>
					);
				})}
			</div>

			<div className="mt-12">
				<SubHeading>Semantic tokens</SubHeading>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[720px] border-collapse text-left">
						<thead>
							<tr className="border-b type-label text-muted-foreground">
								<th scope="col" className="py-3 pr-4 font-semibold">
									Token
								</th>
								<th scope="col" className="py-3 pr-4 font-semibold">
									Light
								</th>
								<th scope="col" className="py-3 pr-4 font-semibold">
									Arena
								</th>
								<th scope="col" className="py-3 font-semibold">
									Usage
								</th>
							</tr>
						</thead>
						<tbody>
							{semantic.map((token) => (
								<tr key={token.name} className="border-b align-top">
									<th scope="row" className="py-3 pr-4 font-normal">
										<span className="flex items-center gap-3">
											<span
												className="size-6 shrink-0 rounded-sm border border-input"
												style={{ background: `var(--${token.name})` }}
											/>
											<span className="type-data">{token.name}</span>
										</span>
									</th>
									<td className="py-3 pr-4 type-data text-muted-foreground">
										{resolveColor(token.name, "light")}
									</td>
									<td className="py-3 pr-4 type-data text-muted-foreground">
										{resolveColor(token.name, "dark")}
									</td>
									<td className="py-3 type-body-sm text-muted-foreground">
										{token.usage}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className="mt-12">
				<SubHeading>
					Text pairs ({theme === "dark" ? "Arena" : "Light"})
				</SubHeading>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{TEXT_PAIRS.map(({ fg, bg, note }) => {
						const ratio = contrastRatio(
							resolveColor(fg, theme),
							resolveColor(bg, theme),
						);
						const passes = note ? ratio >= 3 : ratio >= 4.5;
						return (
							<div
								key={`${fg}-${bg}`}
								className="overflow-hidden rounded-md border"
							>
								<div
									className="flex h-20 items-center px-4 type-title"
									style={{ color: `var(--${fg})`, background: `var(--${bg})` }}
								>
									Build a robot that fights back
								</div>
								<div className="flex items-center justify-between gap-2 px-4 py-3">
									<span className="type-data">
										{fg} / {bg}
									</span>
									<Badge variant={passes ? "cyan" : "neutral"}>
										{ratio.toFixed(1)}:1
									</Badge>
								</div>
								{note && (
									<p className="px-4 pb-3 type-body-sm text-muted-foreground">
										{note}
									</p>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</Section>
	);
}

function TypeSection() {
	return (
		<Section
			id="type"
			title="Type"
			intro="Widescreen Ex for display, always uppercase. Widescreen for labels and buttons. Lexend carries everything else; JetBrains Mono is for data. Don't mix in other faces."
		>
			<SubHeading>Families</SubHeading>
			<div className="divide-y border-y">
				{Object.entries(typeFamilies).map(([name, stack]) => (
					<div
						key={name}
						className="grid gap-2 py-5 md:grid-cols-[200px_1fr] md:gap-8"
					>
						<div>
							<div className="type-label">{name}</div>
							<div className="mt-1 type-data break-words text-muted-foreground">
								{stack}
							</div>
						</div>
						<div
							className={cn(
								"text-3xl leading-tight",
								FAMILY_SAMPLES[name]?.className,
							)}
						>
							{FAMILY_SAMPLES[name]?.sample}
						</div>
					</div>
				))}
			</div>

			<div className="mt-12">
				<SubHeading>Scale</SubHeading>
				<div className="divide-y border-y">
					{typeGroups.flatMap((group) =>
						group.styles.map((style) => (
							<div
								key={style.name}
								className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8"
							>
								<div>
									<div className="type-data">{style.name}</div>
									<div className="mt-1 type-data text-muted-foreground">
										{style.fontSize} / {style.lineHeight} · {style.fontWeight}
									</div>
									<p className="mt-2 type-body-sm text-muted-foreground">
										{style.usage}
									</p>
								</div>
								<div
									className={cn("min-w-0 break-words", TYPE_CLASS[style.name])}
								>
									{style.sample}
								</div>
							</div>
						)),
					)}
				</div>
			</div>
		</Section>
	);
}

function SpacingSection() {
	return (
		<Section
			id="spacing"
			title="Spacing"
			intro="A 4px base that lines up with Tailwind's spacing scale: space-4 is p-4. Cards pad space-6, sections sit space-12 apart, posters keep space-16 margins."
		>
			<div className="flex flex-col gap-3">
				{spacingTokens.map((token) => (
					<div
						key={token.name}
						className="grid grid-cols-[88px_48px_1fr] items-center gap-4 md:grid-cols-[120px_64px_96px_1fr]"
					>
						<span className="type-data">{token.name}</span>
						<span className="type-data text-muted-foreground">
							{token.value}
						</span>
						<span className="h-4 bg-cyan" style={{ width: token.value }} />
						<span className="col-span-3 type-body-sm text-muted-foreground md:col-span-1">
							{token.usage}
						</span>
					</div>
				))}
			</div>
		</Section>
	);
}

function ShapeSection() {
	return (
		<Section
			id="shape"
			title="Shape & depth"
			intro="Sharp by default; no soft, bubbly corners. Flat surfaces: the one effect is glow-spark, a soft halo behind the mark on dark grounds, once per view."
		>
			<SubHeading>Radius</SubHeading>
			<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
				{radiusTokens.map((token) => (
					<div key={token.name} className="flex flex-col gap-3">
						<div
							className="h-20 border-2 border-ink bg-surface-raised"
							style={{ borderRadius: token.value }}
						/>
						<span className="type-data">
							{token.name} · {token.value}
						</span>
						<p className="type-body-sm text-muted-foreground">{token.usage}</p>
					</div>
				))}
			</div>

			<div className="mt-12">
				<SubHeading>Depth</SubHeading>
				<div className="grid gap-6 md:grid-cols-2">
					<div className="flex flex-col gap-3">
						<div className="flex h-40 items-center justify-center rounded-md bg-surface-raised shadow-(--shadow-card)">
							<span className="type-data text-muted-foreground">
								shadow-card
							</span>
						</div>
						<p className="type-body-sm text-muted-foreground">
							{shadowTokens[0].usage}
						</p>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex h-40 items-center justify-center rounded-md bg-surface-brand">
							<div className="flex size-28 items-center justify-center rounded-full shadow-glow">
								<img
									src="/logos/rift-mark-white-cropped.svg"
									alt=""
									width={500}
									height={850}
									className="h-20 w-auto"
								/>
							</div>
						</div>
						<p className="type-body-sm text-muted-foreground">
							{shadowTokens[1].usage}
						</p>
					</div>
				</div>
			</div>
		</Section>
	);
}

function LogoTile({
	label,
	ground,
	children,
}: {
	label: string;
	ground: "navy" | "ice" | "arena";
	children: ReactNode;
}) {
	return (
		<figure className="flex flex-col gap-3">
			<div
				className={cn(
					"flex h-48 items-center justify-center rounded-md border p-8",
					ground === "navy" && "bg-navy",
					ground === "ice" && "bg-ice",
					ground === "arena" && "bg-[#07101f]",
				)}
			>
				{children}
			</div>
			<figcaption className="type-body-sm text-muted-foreground">
				{label}
			</figcaption>
		</figure>
	);
}

function LogosSection() {
	return (
		<Section
			id="logos"
			title="Logos"
			intro="White on navy or dark photos; black on ice or white. Use the wordmark when the name must read and the mark alone at 48px and below. Keep clear space of at least the wordmark's letter height on every side."
		>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<LogoTile label="rift-mark-white.svg on navy" ground="navy">
					<img
						src="/logos/rift-mark-white-cropped.svg"
						alt="RIFT mark"
						className="h-full w-auto"
					/>
				</LogoTile>
				<LogoTile label="rift-mark.svg on ice" ground="ice">
					<img
						src="/logos/rift-mark.svg"
						alt="RIFT mark"
						className="h-[150%] w-auto"
					/>
				</LogoTile>
				<LogoTile
					label="rift-mark-on-navy.svg, avatars and app icons"
					ground="arena"
				>
					<img
						src="/logos/rift-mark-on-navy.svg"
						alt="RIFT mark on navy"
						className="h-full w-auto"
					/>
				</LogoTile>
				<LogoTile label="rift-wordmark-white.svg on navy" ground="navy">
					<img
						src="/logos/rift-wordmark-white.svg"
						alt="RIFT wordmark"
						className="h-full w-auto"
					/>
				</LogoTile>
				<LogoTile label="rift-wordmark.svg on ice" ground="ice">
					<img
						src="/logos/rift-wordmark.svg"
						alt="RIFT wordmark"
						className="h-full w-auto"
					/>
				</LogoTile>
				<LogoTile
					label="UTRA × RIFT lockup, header use (logos only)"
					ground="arena"
				>
					<Lockup />
				</LogoTile>
			</div>
			<ul className="mt-8 grid gap-2 type-body-sm text-muted-foreground md:grid-cols-2">
				<li>Never recolour the mark into cyan or violet.</li>
				<li>Never stretch it or add effects beyond glow-spark.</li>
				<li>The spark is not an icon; don't shrink it into UI chrome.</li>
				<li>
					Use the black files on light grounds, never an inverted white file.
				</li>
			</ul>
		</Section>
	);
}

const PHOTOS = [
	{
		src: "/images/competition.webp",
		width: 1600,
		height: 1067,
		alt: "Robots with red LED armour facing off on the arena floor, spectators behind the barrier.",
	},
	{
		src: "/images/aruw-standard.webp",
		width: 1600,
		height: 1066,
		alt: "A standard robot numbered 3, red light bar lit, on a floor scattered with projectiles.",
	},
	{
		src: "/images/infantry.webp",
		width: 1000,
		height: 563,
		alt: "A red-lit robot in the foreground with a blue-lit robot behind it in the arena.",
	},
];

function ImagerySection() {
	return (
		<Section
			id="imagery"
			title="Imagery"
			intro="Real hardware on dark: rendered parts floating around the spark, or arena photography with red and blue LEDs. Keep backgrounds near-black so the mark and the LEDs carry the colour. No stock photos, no illustrations of people."
		>
			<div className="grid gap-4 md:grid-cols-3">
				{PHOTOS.map((photo) => (
					<img
						key={photo.src}
						src={photo.src}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						loading="lazy"
						decoding="async"
						className="aspect-[3/2] w-full rounded-md object-cover"
					/>
				))}
			</div>

			<figure className="mt-12 flex flex-col gap-3">
				<img
					src="/images/kickoff-poster.webp"
					alt="Kickoff poster: RIFT, ARC Robotics. Kickoff, BA1130, Oct 2, 7-8 PM. Paintball for robots, ARC Championships, @utra_rift. A robot on the left; the spark surrounded by motors, boards and an omni wheel on the right."
					width={1600}
					height={900}
					loading="lazy"
					decoding="async"
					className="w-full rounded-md border"
				/>
				<figcaption className="type-body-sm text-muted-foreground">
					In use: the kickoff poster. Display headline, event details stacked in
					display-sm with a pipe, rendered parts around the spark.
				</figcaption>
			</figure>
		</Section>
	);
}

function ComponentsSection() {
	return (
		<Section
			id="components"
			title="Components"
			intro="shadcn/ui components restyled to the tokens. Tab through this section: every control gets a 2px violet focus ring with a 2px offset."
		>
			<div className="grid gap-12">
				<div>
					<SubHeading>Button</SubHeading>
					<div className="flex flex-wrap items-center gap-4">
						<Button variant="primary">Primary</Button>
						<Button variant="accent">Join the team</Button>
						<Button variant="outline">Join</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="link">Link</Button>
					</div>
					<div className="mt-4 flex flex-wrap items-center gap-4">
						<Button size="sm" variant="accent">
							Small
						</Button>
						<Button variant="accent">Default</Button>
						<Button size="lg" variant="accent">
							Large
						</Button>
						<Button variant="outline" size="icon" aria-label="Open menu">
							<MenuIcon strokeWidth={1.5} />
						</Button>
						<Button disabled>Disabled</Button>
					</div>
					<p className="mt-4 type-body-sm text-muted-foreground">
						primary, accent and outline are the brand set. Primary is navy in
						light and follows ink (ice) in Arena, where navy would vanish into
						the ground.
					</p>
				</div>

				<div>
					<SubHeading>Tag</SubHeading>
					<div className="flex flex-wrap gap-3">
						<Badge variant="neutral">Arena</Badge>
						<Badge variant="cyan">Kickoff</Badge>
						<Badge variant="violet">New</Badge>
					</div>
				</div>

				<div>
					<SubHeading>Card</SubHeading>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardEyebrow>Kickoff</CardEyebrow>
								<CardTitle>Build a robot that fights back</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									We design, build and drive robots for the ARC Championships.
								</CardDescription>
							</CardContent>
							<CardMeta>BA1130 | OCT 2 | 7-8 PM</CardMeta>
						</Card>
						<Card>
							<CardHeader>
								<CardEyebrow>Robots</CardEyebrow>
								<CardTitle>You'll drive the robot you build</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Open to all U of T students. No experience needed.
								</CardDescription>
							</CardContent>
							<CardMeta>24V · 600 RPM</CardMeta>
						</Card>
					</div>
				</div>

				<div>
					<SubHeading>Input</SubHeading>
					<form
						className="flex max-w-md flex-col gap-2"
						onSubmit={(e) => e.preventDefault()}
					>
						<Label htmlFor="design-email">U of T email</Label>
						<div className="flex gap-3">
							<Input
								id="design-email"
								type="email"
								placeholder="name@mail.utoronto.ca"
								autoComplete="email"
							/>
							<Button type="submit" variant="primary">
								Join
							</Button>
						</div>
						<p className="type-body-sm text-muted-foreground">
							Inputs border in ink-muted: line is decorative and never the only
							boundary of a control.
						</p>
					</form>
				</div>

				<div>
					<SubHeading>Toggle group and sheet</SubHeading>
					<div className="flex flex-wrap items-center gap-4">
						<ToggleGroup
							type="single"
							variant="outline"
							defaultValue="robots"
							aria-label="Example"
						>
							<ToggleGroupItem value="robots">Robots</ToggleGroupItem>
							<ToggleGroupItem value="team">Team</ToggleGroupItem>
							<ToggleGroupItem value="sponsors">Sponsors</ToggleGroupItem>
						</ToggleGroup>
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline">Open sheet</Button>
							</SheetTrigger>
							<SheetContent className="px-6 pt-20">
								<SheetTitle className="type-display-sm">Sheet</SheetTitle>
								<SheetDescription className="type-body">
									Used for the mobile menu on the hero.
								</SheetDescription>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</Section>
	);
}

function MotionSection() {
	return (
		<Section
			id="motion"
			title="Motion"
			intro="The hero intro, timed against the rift's opening. Easing is ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1). With prefers-reduced-motion, or without WebGL, there is no animation: the settled still is shown with all UI in place."
		>
			<ol className="divide-y border-y">
				{HERO_TIMELINE.map((step) => (
					<li key={step.at} className="grid grid-cols-[72px_1fr] gap-4 py-3">
						<span className="type-data text-cyan-text">{step.at}</span>
						<span className="type-body-sm">{step.what}</span>
					</li>
				))}
			</ol>
		</Section>
	);
}

function VoiceSection() {
	const rules = [
		{
			rule: "Say less, in capitals",
			detail: "Headlines are one to three words in display, always uppercase.",
			example: <span className="type-display-sm">Kickoff</span>,
		},
		{
			rule: "Join facts with a pipe",
			detail: "Not a dash. Ranges use a plain hyphen.",
			example: <span className="type-display-sm">Oct 2 | 7-8 PM</span>,
		},
		{
			rule: "Blunt, concrete taglines",
			detail:
				"Set in label. “Paintball for robots” beats any description of competitive robotics.",
			example: (
				<span className="type-label text-cyan-text">Paintball for robots</span>
			),
		},
		{
			rule: "Plain body copy",
			detail:
				"Sentence case, second person. No emoji, no exclamation marks in headlines.",
			example: (
				<span className="type-body">You'll drive the robot you build.</span>
			),
		},
		{
			rule: "Codes and handles in data",
			detail:
				"RIFT is always caps. The competition is the ARC Championships; the club is UTRA.",
			example: <span className="type-data">BA1130 · 24V · @utra_rift</span>,
		},
	];

	return (
		<Section id="voice" title="Voice">
			<div className="divide-y border-y">
				{rules.map((item) => (
					<div
						key={item.rule}
						className="grid gap-3 py-5 md:grid-cols-[1fr_1fr] md:gap-8"
					>
						<div>
							<div className="type-title">{item.rule}</div>
							<p className="mt-1 type-body-sm text-muted-foreground">
								{item.detail}
							</p>
						</div>
						<div className="flex items-center">{item.example}</div>
					</div>
				))}
			</div>
			<Separator className="my-8" />
			<p className="type-body-sm text-muted-foreground">
				Full guidance: src/design/brand-book.md
			</p>
		</Section>
	);
}
