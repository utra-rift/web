import type { ReactNode } from "react";
import Lockup from "#/components/brand/Lockup";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import {
	CARRY_OVER,
	EXEC_TEAM,
	type Exec,
	GAME_FACTS,
	INSTAGRAM_HANDLE,
	INSTAGRAM_HREF,
	JOIN_HREF,
	KICKOFF,
	LEAGUES,
	LEVEL_UP,
	NAV_LINKS,
	PHOTOS,
	type Phase,
	RIVALS,
	ROBOT_SPECS,
	SEASON,
	TEAM_PRINCIPLES,
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
			className={cn("scroll-mt-4 py-24 md:py-32", className)}
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
		<div className={cn("reveal flex max-w-2xl flex-col gap-5", className)}>
			<p className="type-label text-cyan-text">{eyebrow}</p>
			<h2
				id={`${id}-title`}
				className="type-display-lg text-balance max-sm:text-[32px] max-sm:leading-9 md:type-display-xl"
			>
				{title}
			</h2>
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
						eyebrow="Paintball for robots"
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

					<dl className="reveal grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6">
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
							className="col-span-2 aspect-[16/10] w-full rounded-md object-cover"
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
								className="aspect-[3/2] w-full rounded-md object-cover"
							/>
						))}
					</div>
					<figcaption className="type-body-sm text-ink-muted">
						Robots from past RoboMaster North America events. Other teams in the
						league include {RIVALS.slice(0, -1).join(", ")} and {RIVALS.at(-1)}.
					</figcaption>
				</figure>
			</div>

			<div className="mt-20">
				<h3 className="reveal type-label text-ink-muted">
					The robot, by ARC's 2026 rules
				</h3>
				<dl className="reveal mt-6 grid grid-cols-2 border-t border-l lg:grid-cols-4">
					{ROBOT_SPECS.map((spec) => (
						<div
							key={spec.value}
							className="flex flex-col-reverse justify-end gap-2 border-r border-b p-5 md:p-6"
						>
							<dt className="type-body-sm text-ink-muted">{spec.label}</dt>
							<dd className="font-display text-[22px] leading-7 font-semibold text-ink sm:type-display-sm md:text-[32px] md:leading-10">
								{spec.value}
							</dd>
						</div>
					))}
				</dl>
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
						them, with or without robotics experience. Each group has a lead who
						assigns the work and teaches you how to do it.
					</p>
				</SectionHeading>
				<Button
					asChild
					variant="accent"
					size="lg"
					className="reveal self-start lg:self-end"
				>
					<a href={JOIN_HREF}>Apply to join</a>
				</Button>
			</div>

			<div className="mt-14 grid gap-4 md:grid-cols-2">
				{TEAMS.map((team, i) => (
					<TeamCard key={team.id} team={team} index={i} />
				))}
			</div>

			<ul className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
				{TEAM_PRINCIPLES.map((principle) => (
					<li
						key={principle.title}
						className="reveal flex flex-col gap-2 border-t-2 border-ink pt-5"
					>
						<h3 className="type-title">{principle.title}</h3>
						<p className="type-body-sm text-pretty text-ink-muted">
							{principle.body}
						</p>
					</li>
				))}
			</ul>
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
				{team.note && (
					<p className="basis-full pt-2 type-body-sm text-cyan-text">
						{team.note}
					</p>
				)}
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
					eyebrow={LEAGUES.join(" | ")}
					title="Your next robot"
				>
					<p>
						You've done build season, drive team and the pit. RIFT is the same
						loop at university, with a robot that fights back. What you learned
						carries straight over and gives you a head start.
					</p>
					<p>
						Your leads came up the same way, through FRC 7520 and VEX 95500A.
					</p>
				</SectionHeading>

				<div className="reveal flex flex-col lg:pt-10">
					<h3 className="type-label text-ink-muted">Where you fit</h3>
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

			<div className="mt-20">
				<h3 className="reveal type-label text-ink-muted">What's new</h3>
				<ul className="mt-6 grid gap-4 md:grid-cols-3">
					{LEVEL_UP.map((item) => (
						<li
							key={item.title}
							className="reveal flex flex-col gap-2 rounded-md border bg-surface p-6"
						>
							<h4 className="type-title">{item.title}</h4>
							<p className="type-body-sm text-pretty text-ink-muted">
								{item.body}
							</p>
						</li>
					))}
				</ul>
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
					One lead for each group. They recruit their group, plan its work and
					train new members.
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
			<div className="flex flex-1 flex-col gap-4 p-6">
				<div className="flex flex-col gap-1">
					<p className="type-label text-cyan-text">{exec.role}</p>
					<h3 className="type-title">{exec.name}</h3>
					<p className="type-data text-ink-muted">{exec.program}</p>
				</div>
				<p className="type-body-sm text-ink">{exec.focus}</p>
				<ul className="flex flex-col gap-2.5 border-t pt-4">
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
					A working robot by March, then testing and qualification in April.
					We're aiming for the championships in late June or early July 2027.
					Event dates and deadlines aren't confirmed yet.
				</p>
			</SectionHeading>

			<ol className="mt-16 grid lg:grid-cols-5">
				{SEASON.map((phase) => {
					const status = phaseStatus(phase, today);
					return (
						<li
							key={phase.label}
							data-status={status}
							className="reveal season-phase relative flex flex-col gap-3 border-l-2 pb-10 pl-6 lg:border-t-2 lg:border-l-0 lg:pt-8 lg:pr-6 lg:pb-0 lg:pl-0"
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
					className="kickoff-mark mx-auto w-40 md:w-56 lg:w-72"
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
						Meet the leads, hear the plan for the season and pick a team. Bring
						a friend. No experience required.
					</p>
					<div className="flex flex-wrap gap-4">
						<Button asChild variant="accent" size="lg">
							<a href={JOIN_HREF}>Join the team</a>
						</Button>
						<Button asChild variant="outline" size="lg">
							<a href={INSTAGRAM_HREF} target="_blank" rel="noreferrer">
								Follow {INSTAGRAM_HANDLE}
							</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
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
								className="type-body-sm text-ink capitalize transition-colors hover:text-cyan"
							>
								{link.label.toLowerCase()}
							</a>
						))}
					</nav>
					<div className="flex flex-col gap-3">
						<h2 className="type-label text-ink-muted">Connect</h2>
						<a
							href={JOIN_HREF}
							className="type-body-sm text-ink transition-colors hover:text-cyan"
						>
							Apply
						</a>
						<a
							href={INSTAGRAM_HREF}
							target="_blank"
							rel="noreferrer"
							className="type-data text-ink transition-colors hover:text-cyan"
						>
							{INSTAGRAM_HANDLE}
						</a>
						<a
							href={UTRA_HREF}
							target="_blank"
							rel="noreferrer"
							className="type-body-sm text-ink transition-colors hover:text-cyan"
						>
							UTRA
						</a>
					</div>
				</div>
			</div>
			<div className={CONTAINER}>
				<p className="border-t py-6 type-body-sm text-ink-muted">
					© {new Date().getFullYear()} University of Toronto Robotics
					Association
				</p>
			</div>
		</footer>
	);
}
