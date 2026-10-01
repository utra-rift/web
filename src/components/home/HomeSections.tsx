import type { ReactNode } from "react";
import Lockup from "#/components/brand/Lockup";
import { GitHubIcon, InstagramIcon } from "#/components/brand/SocialIcons";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import {
	CARRY_OVER,
	COMPLAINTS_HREF,
	EXEC_TEAM,
	type Exec,
	GAME_FACTS,
	GITHUB_HREF,
	INSTAGRAM_HANDLE,
	INSTAGRAM_HREF,
	JOIN_HREF,
	KICKOFF,
	LEAGUES,
	NAV_LINKS,
	PHOTOS,
	type Phase,
	RIVALS,
	SEASON,
	SPONSOR_ASKS,
	SPONSOR_EMAIL,
	SPONSOR_HREF,
	TEAMS,
	type Team,
	UTRA_HREF,
} from "./content";

/** Gutters match the hero's header and copy at each width. */
const CONTAINER =
	"mx-auto w-full max-w-[1440px] px-4 sm:px-8 min-[68.75rem]:px-16";

export function HomeSections() {
	return (
		<>
			<GameSection />
			<TeamsSection />
			<LeaguesSection />
			<ExecSection />
			<SeasonSection />
			<KickoffSection />
			<SponsorsSection />
		</>
	);
}

function Section({
	id,
	className,
	children,
}: {
	id: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<section
			id={id}
			aria-labelledby={`${id}-title`}
			className={cn("scroll-mt-4 py-20 md:py-28", className)}
		>
			<div className={CONTAINER}>{children}</div>
		</section>
	);
}

function SectionHeading({
	id,
	eyebrow,
	title,
	children,
	className,
}: {
	id: string;
	eyebrow: string;
	title: string;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("reveal flex max-w-2xl flex-col gap-6", className)}>
			<div className="flex flex-col gap-3">
				<p className="type-label text-cyan-text">{eyebrow}</p>
				<h2
					id={`${id}-title`}
					className="type-display-lg text-balance max-sm:text-[32px] max-sm:leading-9 md:type-display-xl"
				>
					{title}
				</h2>
			</div>
			{children && (
				<div className="flex flex-col gap-4 type-body text-pretty text-ink-muted">
					{children}
				</div>
			)}
		</div>
	);
}

function GameSection() {
	return (
		<Section id="game">
			<div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
				<div className="flex flex-col gap-10">
					<SectionHeading
						id="game"
						eyebrow="ARC Championships"
						title="The game"
					>
						<p>
							ARC, formerly RoboMaster North America, is a university league for
							tactical arena matches. Robots drive, aim and fire projectiles at
							their opponent's armour panels to knock down its hit points.
						</p>
						<p>
							RIFT competes in 1v1 Infantry: one robot, one pilot, two-minute
							rounds. It's our first season, so we're building one complete
							robot from scratch, and you can work on it from day one.
						</p>
					</SectionHeading>

					<dl className="reveal grid grid-cols-2 gap-6">
						{GAME_FACTS.map((fact) => (
							<div key={fact.term} className="flex flex-col gap-1">
								<dt className="type-label text-ink-muted">{fact.term}</dt>
								<dd className="type-title text-ink">{fact.detail}</dd>
							</div>
						))}
					</dl>
				</div>

				<figure className="reveal flex flex-col gap-3 self-start">
					<div className="grid grid-cols-2 gap-3">
						<img
							src={PHOTOS.main.src}
							alt={PHOTOS.main.alt}
							width={PHOTOS.main.width}
							height={PHOTOS.main.height}
							loading="lazy"
							decoding="async"
							className="col-span-2 aspect-[16/10] w-full rounded-md object-cover outline-1 -outline-offset-1 outline-white/10"
						/>
						{PHOTOS.side.map((photo) => (
							<img
								key={photo.src}
								src={photo.src}
								alt={photo.alt}
								width={photo.width}
								height={photo.height}
								loading="lazy"
								decoding="async"
								className="aspect-[3/2] w-full rounded-md object-cover outline-1 -outline-offset-1 outline-white/10"
							/>
						))}
					</div>
					<figcaption className="type-body-sm text-ink-muted">
						Robots from past RoboMaster North America events. Other teams in the
						league include {RIVALS.slice(0, -1).join(", ")} and {RIVALS.at(-1)}.
					</figcaption>
				</figure>
			</div>
		</Section>
	);
}

function TeamsSection() {
	return (
		<Section id="teams">
			<div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
				<SectionHeading
					id="teams"
					eyebrow="No experience required"
					title="Pick a team"
				>
					<p>
						RIFT runs as four groups that build one robot together. Join any of
						them, with or without robotics experience. All four are open to
						every program, no engineering background needed.
					</p>
				</SectionHeading>
				<Button
					asChild
					variant="accent"
					size="lg"
					className="reveal self-start max-sm:w-full lg:self-end"
				>
					<a href={JOIN_HREF}>Apply to join</a>
				</Button>
			</div>

			<div className="mt-14 grid gap-4 md:grid-cols-2">
				{TEAMS.map((team, i) => (
					<TeamCard key={team.id} team={team} index={i} />
				))}
			</div>
		</Section>
	);
}

function TeamCard({ team, index }: { team: Team; index: number }) {
	return (
		<article
			id={`team-${team.id}`}
			aria-labelledby={`team-${team.id}-title`}
			className="reveal flex flex-col gap-6 rounded-md border bg-surface-raised p-6 md:p-8"
		>
			<div className="flex flex-col gap-3">
				<span className="type-data text-cyan-text">
					{String(index + 1).padStart(2, "0")}
				</span>
				<h3
					id={`team-${team.id}-title`}
					className="type-display-sm max-sm:text-xl max-sm:leading-7"
				>
					{team.name}
				</h3>
				<p className="type-body text-pretty text-ink-muted">{team.summary}</p>
			</div>

			<div className="flex flex-col gap-3">
				<h4 className="type-label text-ink-muted">You'll</h4>
				<ul className="flex flex-col gap-2.5">
					{team.tasks.map((task) => (
						<li key={task} className="flex gap-3 type-body-sm text-ink">
							<span
								aria-hidden="true"
								className="mt-[7px] size-1.5 shrink-0 bg-cyan"
							/>
							{task}
						</li>
					))}
				</ul>
			</div>

			<div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
				{team.tags.map((tag) => (
					<Badge key={tag}>{tag}</Badge>
				))}
			</div>
		</article>
	);
}

function LeaguesSection() {
	return (
		<Section id="frc" className="border-y bg-surface-raised">
			<div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
				<SectionHeading
					id="frc"
					eyebrow={`Already competed? ${LEAGUES.join(" | ")}`}
					title="Your next robot"
				>
					<p>
						If you did FRC, FTC or VEX in high school, you've already been
						through build season, drive team and the pit. RIFT runs on the same
						cycle, so that experience counts from the first meeting, and you can
						take on a whole subsystem instead of starter tasks.
					</p>
					<p>
						Your leads came up the same way, through FRC 7520 and VEX 95500A.
					</p>
				</SectionHeading>

				<div className="reveal flex flex-col lg:pt-10">
					<h3 className="type-label text-ink-muted">
						Where your experience fits
					</h3>
					<ul className="mt-4 border-t">
						{CARRY_OVER.map((row) => (
							<li
								key={row.team}
								className="flex flex-col gap-1 border-b py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
							>
								<span className="type-body text-ink">{row.from}</span>
								<span className="shrink-0 type-label text-cyan-text">
									{row.team}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</Section>
	);
}

function ExecSection() {
	return (
		<Section id="exec">
			<SectionHeading
				id="exec"
				eyebrow="Founding team"
				title="Meet the exec team"
			>
				<p>
					We started RIFT, and each of us runs one of the four groups. You'll
					meet all four of us at kickoff.
				</p>
			</SectionHeading>

			<ul className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{EXEC_TEAM.map((exec) => (
					<ExecCard key={exec.name} exec={exec} />
				))}
			</ul>
		</Section>
	);
}

function ExecCard({ exec }: { exec: Exec }) {
	return (
		<li className="reveal flex flex-col overflow-hidden rounded-md border bg-surface-raised">
			<img
				src={exec.photo}
				alt={`Portrait of ${exec.name}`}
				width={640}
				height={640}
				loading="lazy"
				decoding="async"
				className="aspect-square w-full object-cover"
			/>
			<div className="flex flex-1 flex-col gap-5 p-6">
				<div className="flex flex-col gap-1">
					<p className="type-label text-cyan-text">{exec.role}</p>
					<h3 className="type-title">{exec.name}</h3>
					<p className="type-data text-ink-muted">{exec.program}</p>
				</div>
				<p className="type-body-sm text-ink">{exec.focus}</p>
				<ul className="flex flex-col gap-2.5">
					{exec.highlights.map((highlight) => (
						<li
							key={highlight}
							className="type-body-sm text-pretty text-ink-muted"
						>
							{highlight}
						</li>
					))}
				</ul>
			</div>
		</li>
	);
}

type PhaseStatus = "past" | "now" | "next";

function phaseStatus(phase: Phase, today: Date): PhaseStatus {
	const month = today.getFullYear() * 12 + today.getMonth();
	const from = phase.from[0] * 12 + phase.from[1];
	const to = phase.to[0] * 12 + phase.to[1];
	if (month > to) return "past";
	return month >= from ? "now" : "next";
}

function SeasonSection() {
	const today = new Date();

	return (
		<Section id="season">
			<SectionHeading id="season" eyebrow="2026-2027 season" title="The season">
				<p>
					We want the robot driving, aiming and firing by March. April is for
					breaking it in testing and getting it qualified.
				</p>
			</SectionHeading>

			<ol className="mt-16 grid lg:grid-cols-5">
				{SEASON.map((phase) => {
					const status = phaseStatus(phase, today);
					return (
						<li
							key={phase.label}
							data-status={status}
							className="reveal season-phase relative flex flex-col gap-3 border-s-2 ps-6 pb-10 lg:border-s-0 lg:border-t-2 lg:ps-0 lg:pe-6 lg:pt-8 lg:pb-0"
						>
							<span aria-hidden="true" className="season-dot" />
							<div className="flex h-6 items-center gap-3">
								<span className="type-data text-ink-muted">{phase.label}</span>
								{status === "now" && <Badge variant="cyan">Now</Badge>}
							</div>
							<h3 className="type-title">{phase.title}</h3>
							<ul className="flex flex-col gap-2">
								{phase.milestones.map((milestone) => (
									<li
										key={milestone}
										className="type-body-sm text-pretty text-ink-muted"
									>
										{milestone}
									</li>
								))}
							</ul>
						</li>
					);
				})}
			</ol>
		</Section>
	);
}

function KickoffSection() {
	return (
		<section
			id="kickoff"
			aria-labelledby="kickoff-title"
			className="kickoff relative scroll-mt-4 overflow-hidden bg-surface-brand text-on-navy"
		>
			<div
				className={cn(
					CONTAINER,
					"relative grid items-center gap-12 py-24 md:py-32 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-24",
				)}
			>
				<img
					src="/logos/rift-mark-white.svg"
					alt=""
					width={1080}
					height={1080}
					loading="lazy"
					className="kickoff-mark w-24 md:w-40 lg:w-72"
				/>
				<div className="reveal flex flex-col gap-8">
					<div className="flex flex-col gap-4">
						<p className="type-label text-cyan">First meeting</p>
						<h2
							id="kickoff-title"
							className="type-display-lg max-sm:text-[32px] max-sm:leading-9 md:type-display-xl"
						>
							Kickoff
						</h2>
						<p className="flex flex-col font-display text-xl leading-7 font-medium uppercase sm:type-display-sm">
							<span>{KICKOFF.room}</span>
							<span>
								{KICKOFF.date}
								<span aria-hidden="true"> | </span>
								<span className="sr-only">, </span>
								{KICKOFF.time}
							</span>
						</p>
					</div>
					<p className="max-w-lg type-body text-pretty text-on-navy/80">
						Come meet the leads and hear how the season will run. Bring a
						friend. No experience required.
					</p>
					<div className="grid gap-3 sm:flex sm:flex-wrap">
						<Button asChild variant="accent" size="lg">
							<a href={JOIN_HREF}>Join the team</a>
						</Button>
						<Button asChild variant="outline" size="lg">
							<a href={INSTAGRAM_HREF} target="_blank" rel="noreferrer">
								<InstagramIcon className="size-[18px]" />
								Follow {INSTAGRAM_HANDLE}
							</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

function SponsorsSection() {
	return (
		<Section id="sponsors">
			<div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
				<div className="flex flex-col gap-10">
					<SectionHeading
						id="sponsors"
						eyebrow="Support the team"
						title="Sponsors"
					>
						<p>
							RIFT raises its own money. We don't draw on UTRA's existing funds,
							so what you give goes into this robot and getting it to
							competition.
						</p>
						<p>
							The referee hardware, chargers and vision gear outlast one season.
							They'll train new members and power the next robot too.
						</p>
					</SectionHeading>
					<div className="reveal flex flex-col gap-3">
						<Button
							asChild
							variant="accent"
							size="lg"
							className="self-start max-sm:w-full"
						>
							<a href={SPONSOR_HREF}>Email for the sponsorship package</a>
						</Button>
						<p className="type-data text-ink-muted">{SPONSOR_EMAIL}</p>
					</div>
				</div>

				<div className="reveal flex flex-col gap-4 lg:pt-10">
					<h3 className="type-label text-ink-muted">Ways to help</h3>
					<ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
						{SPONSOR_ASKS.map((ask) => (
							<li
								key={ask.title}
								className="flex flex-col gap-1 rounded-md bg-surface-raised p-5"
							>
								<h4 className="type-title">{ask.title}</h4>
								<p className="type-body-sm text-pretty text-ink-muted">
									{ask.body}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</Section>
	);
}

export function SiteFooter() {
	return (
		<footer className="border-t">
			<div
				className={cn(
					CONTAINER,
					"flex flex-col gap-12 py-12 md:flex-row md:items-start md:justify-between",
				)}
			>
				<div className="flex max-w-sm flex-col gap-5">
					<Lockup className="self-start [--lockup-rift:44px] [--lockup-utra:30px]" />
					<p className="type-body-sm text-ink-muted">
						RIFT is the University of Toronto Robotics Association's ARC
						Championships team.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-x-16 gap-y-8">
					<nav aria-label="Footer" className="flex flex-col gap-3">
						<h2 className="type-label text-ink-muted">Site</h2>
						{NAV_LINKS.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="type-body-sm text-ink capitalize transition-[color] hover:text-cyan"
							>
								{link.label.toLowerCase()}
							</a>
						))}
					</nav>
					<div className="flex flex-col gap-3">
						<h2 className="type-label text-ink-muted">Connect</h2>
						<a
							href={JOIN_HREF}
							className="type-body-sm text-ink transition-[color] hover:text-cyan"
						>
							Apply
						</a>
						<a
							href={INSTAGRAM_HREF}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-2 type-body-sm text-ink transition-[color] hover:text-cyan"
						>
							<InstagramIcon className="size-4" />
							Instagram
						</a>
						<a
							href={GITHUB_HREF}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-2 type-body-sm text-ink transition-[color] hover:text-cyan"
						>
							<GitHubIcon className="size-4" />
							GitHub
						</a>
						<a
							href={SPONSOR_HREF}
							className="type-body-sm text-ink transition-[color] hover:text-cyan"
						>
							Sponsor us
						</a>
						<a
							href={UTRA_HREF}
							target="_blank"
							rel="noreferrer"
							className="type-body-sm text-ink transition-[color] hover:text-cyan"
						>
							UTRA
						</a>
					</div>
				</div>
			</div>
			<div className={CONTAINER}>
				<div className="flex flex-col gap-3 border-t py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
					<p className="type-body-sm text-ink-muted">
						© {new Date().getFullYear()} University of Toronto Robotics
						Association
					</p>
					<a
						href={COMPLAINTS_HREF}
						target="_blank"
						rel="noreferrer"
						className="type-body-sm text-ink-muted underline underline-offset-4 transition-[color] hover:text-cyan"
					>
						EngSoc Complaints Policy
					</a>
				</div>
			</div>
		</footer>
	);
}
