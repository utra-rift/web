import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { COMPLAINTS_HREF, TEAM_EMAIL } from "#/components/home/content";
import { SiteFooter } from "#/components/home/HomeSections";
import { SiteHeader } from "#/components/home/SiteHeader";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/complaints")({
	head: () => ({
		meta: [
			{ title: "Complaints Policy · RIFT" },
			{
				name: "description",
				content:
					"How to make a complaint to the Engineering Society Ombudsperson, under the EngSoc Policy on Complaints.",
			},
		],
	}),
	component: Complaints,
});

// Text matches utra.ca/complaints. Affiliated clubs must make the Policy on
// Complaints easily accessible to members (Policy on Affiliated Clubs, 0.3.7).

const RESPONSES = [
	"No action (lack of proof / actions not considered misconduct / actions happened outside the time period of their role)",
	"Offer to mediate a solution",
];

const RECOMMENDATIONS = [
	"Recall subject of complaint from their position.",
	"Take steps under the Policy on Affiliated Clubs, section 0.9.",
	"Mandate additional training.",
	"Require subject of complaint to issue an official apology.",
	"Escalate matter to campus police.",
	"Escalate matter to governmental law enforcement.",
	"Escalate matter to the Office of the Faculty Dean.",
	"Escalate matter to the Division of Student Life.",
	"Escalate matter to the Office of the University Provost.",
	"Amend EngSoc Bylaws and/or Policies.",
	"Take some other specific action, with additional justification for such an extraordinary recommendation.",
	"Any combination of the above.",
];

const LINK_CLASS =
	"text-link underline underline-offset-4 transition-[color] hover:text-cyan";

function Complaints() {
	return (
		<>
			<SiteHeader />
			<main className="mx-auto w-full max-w-3xl px-4 pt-12 pb-24 sm:px-8 md:pt-20 md:pb-32">
				<div className="flex flex-col items-start gap-8">
					<div className="flex flex-col gap-3">
						<p className="type-label text-cyan-text">RIFT and EngSoc</p>
						<h1 className="type-display-lg text-balance max-sm:text-[32px] max-sm:leading-9 md:type-display-xl">
							Complaints Policy
						</h1>
					</div>
					<Button asChild variant="outline" size="lg" className="max-sm:w-full">
						<a href={COMPLAINTS_HREF} target="_blank" rel="noreferrer">
							EngSoc Complaints Policy
							<ArrowUpRightIcon strokeWidth={2} />
						</a>
					</Button>
				</div>

				<div className="mt-16 flex flex-col gap-12 type-body text-pretty text-ink-muted">
					<Block className="rounded-md bg-surface-raised p-6 md:p-8">
						<h2 className="type-title text-ink">Handled by RIFT</h2>
						<p>
							For complaints our team can handle, email{" "}
							<a href={`mailto:${TEAM_EMAIL}`} className={LINK_CLASS}>
								{TEAM_EMAIL}
							</a>{" "}
							or talk to any{" "}
							<a href="/#exec" className={LINK_CLASS}>
								member of the exec team
							</a>
							.
						</p>
						<p className="type-body-sm">
							If the complaint is about an executive, or you'd rather go to
							someone outside the team, use the Engineering Society process
							below.
						</p>
					</Block>

					<h2 className="-mb-8 type-display-sm max-sm:text-xl max-sm:leading-7 text-ink">
						Engineering Society
					</h2>

					<Block>
						<p className="text-ink">On behalf of the Ombudsperson:</p>
						<p>
							As a representative of your affiliated club, it is imperative to
							know that the Ombudsperson, according to Bylaw 2 of the
							Engineering Society:
						</p>
						<List
							items={[
								"Receives complaints, feedback, opinions, ideas and haikus about EngSoc (and its affiliated clubs).",
								"Acts as a whistleblowing option to members with concerns.",
								"Mediates conflicts among members of EngSoc.",
							]}
						/>
						<p>
							But most importantly, according to the{" "}
							<a
								href={COMPLAINTS_HREF}
								target="_blank"
								rel="noreferrer"
								className={LINK_CLASS}
							>
								Policy on Complaints
							</a>
							; the Ombudsperson investigates complaints about Project
							Directors, members of Project Directors' teams, or members of an
							Affiliated Club acting in an official capacity for the club.
						</p>
						<p>
							Section 0.3.7 of the Policy on Affiliated Clubs states that
							affiliated clubs must make the Society's Policy on Complaints
							easily accessible to their members.
						</p>
					</Block>

					<Block className="rounded-md bg-surface-raised p-6 md:p-8">
						<p>
							<Label>Complaints go to: </Label>
							<a href="mailto:ombudsperson@g.skule.ca" className={LINK_CLASS}>
								ombudsperson@g.skule.ca
							</a>{" "}
							— Ombudsperson, neutral third party officer.
						</p>
						<p className="type-body-sm">
							(Complaints against Ombudsperson go to{" "}
							<a href="mailto:speaker@g.skule.ca" className={LINK_CLASS}>
								speaker@g.skule.ca
							</a>
							)
						</p>
					</Block>

					<Block>
						<p>
							<Label>Who can you complain about?: </Label>
							Officers, Project Directors (and members of their team), Board of
							Directors members, Affiliated Clubs members
						</p>
						<p>
							<Label>Reasons for complaints: </Label>
							Harassment, sexual violence, defamation, slander, or a failure to
							do their job
						</p>
						<p>
							Or violations of the University of Toronto Code of Student Conduct
							or Standards of Affiliation according to the Policy on Affiliated
							Clubs
						</p>
						<p>
							<Label>Can they be anonymous: </Label>
							Unless your identity as the complainant is necessary for the
							complaint, yes.
						</p>
						<p>
							<Label>Complaints must include: </Label>
							Sufficient detail to begin an investigation.
						</p>
					</Block>

					<Block>
						<h2 className="type-title text-ink">Possible Response:</h2>
						<List
							items={[
								...RESPONSES,
								<>
									A factual recommendation report is created which is executed
									according to the voting of the relevant executive body
									(typically Club Affiliation Committee / Board of Directors)
									with care taken for privacy.{" "}
									<span className="text-ink">
										The investigator cannot take any executive action on their
										own accord.
									</span>
								</>,
							]}
						/>
					</Block>

					<Block>
						<h2 className="type-title text-ink">Possible Recommendations:</h2>
						<List items={RECOMMENDATIONS} />
					</Block>
				</div>
			</main>
			<SiteFooter />
		</>
	);
}

function Block({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<section className={cn("flex flex-col gap-4", className)}>
			{children}
		</section>
	);
}

function Label({ children }: { children: ReactNode }) {
	return <span className="font-semibold text-ink">{children}</span>;
}

function List({ items }: { items: ReactNode[] }) {
	return (
		<ul className="flex flex-col gap-2.5">
			{items.map((item, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static list that never reorders
				<li key={i} className="flex gap-3">
					<span
						aria-hidden="true"
						className="mt-[9px] size-1.5 shrink-0 bg-cyan"
					/>
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}
