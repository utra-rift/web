/** Site copy and links shared by the hero and the sections below it. */

export const JOIN_HREF = "/apply";
export const INSTAGRAM_HANDLE = "@utra_rift";
export const INSTAGRAM_HREF = "https://www.instagram.com/utra_rift/";
export const GITHUB_HREF = "https://github.com/utra-rift";
export const UTRA_HREF = "https://utra.ca";
export const SPONSOR_EMAIL = "arcrobotics@utra.ca";
export const SPONSOR_HREF = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent("RIFT sponsorship package")}`;
export const COMPLAINTS_HREF =
	"https://skule.github.io/bylaws/policies/policy-on-complaints.html";

export const NAV_LINKS = [
	{ label: "GAME", href: "#game" },
	{ label: "TEAMS", href: "#teams" },
	{ label: "EXEC", href: "#exec" },
	{ label: "SEASON", href: "#season" },
	{ label: "SPONSORS", href: "#sponsors" },
];

export const KICKOFF = {
	room: "BA1130",
	date: "OCT 2",
	time: "7-8 PM",
};

export const GAME_FACTS = [
	{ term: "Format", detail: "1v1 Infantry" },
	{ term: "Rounds", detail: "2 minutes" },
	{ term: "First season", detail: "2026-2027" },
	{ term: "Target", detail: "Summer 2027" },
];

export const RIVALS = [
	"Purdue",
	"NYU",
	"McMaster",
	"Queen's",
	"Ontario Tech",
	"UBC",
];

export const PHOTOS = {
	main: {
		src: "/images/competition.webp",
		width: 1600,
		height: 1067,
		alt: "Robots with red LED armour facing off on the arena floor, spectators behind the barrier.",
	},
	side: [
		{
			src: "/images/aruw-standard.webp",
			width: 1600,
			height: 1066,
			alt: "A robot numbered 3, red light bar lit, on a floor scattered with projectiles.",
		},
		{
			src: "/images/infantry.webp",
			width: 1000,
			height: 563,
			alt: "A red-lit robot in the foreground with a blue-lit robot behind it in the arena.",
		},
	],
};

export type Team = {
	id: string;
	name: string;
	summary: string;
	tasks: string[];
	tags: string[];
};

export const TEAMS: Team[] = [
	{
		id: "design-build",
		name: "Design & build",
		summary:
			"Design and fabricate the chassis, gimbal and feeder, then assemble and test the mechanisms.",
		tasks: [
			"Design the chassis and write the parts list",
			"Build the rolling chassis and test the launcher",
			"Fit the gimbal and feeder, and keep spares ready for repairs",
		],
		tags: ["CAD", "Fabrication", "Mechanisms"],
	},
	{
		id: "electronics",
		name: "Electronics",
		summary:
			"Build the power system and connect the motors, controllers and referee hardware.",
		tasks: [
			"Choose and order the motors and controllers",
			"Bench-test the motors and power system",
			"Wire in the referee system and the power cutoff",
		],
		tags: ["Power", "Wiring", "Testing"],
	},
	{
		id: "software",
		name: "Software",
		summary:
			"Write the code that drives, aims and fires the robot, and connect the controller to its systems.",
		tasks: [
			"Develop and test manual control",
			"Get the robot driving, aiming and firing",
			"Evaluate camera capture and vision, and train the pilots",
		],
		tags: ["Controls", "Comms", "Vision"],
	},
	{
		id: "administration",
		name: "Administration",
		summary:
			"Keep the team funded, supplied and on the road to the championships.",
		tasks: [
			"Reach out to sponsors and fundraise",
			"Purchase parts and track spending",
			"Handle qualification, travel and transport",
		],
		tags: ["Sponsors", "Finance", "Logistics"],
	},
];

export const LEAGUES = ["FRC", "FTC", "VEX"];

/** What high school robotics experience maps to on RIFT. */
export const CARRY_OVER = [
	{ from: "Built the drivetrain or an intake", team: "Design & build" },
	{ from: "Wired the PDH, a Control Hub or a V5 Brain", team: "Electronics" },
	{ from: "Wrote autos in WPILib, the FTC SDK or PROS", team: "Software" },
	{ from: "Ran sponsors, outreach or the pit", team: "Administration" },
];

export type Phase = {
	label: string;
	title: string;
	/** First and last month of the phase, as [year, monthIndex]. */
	from: [number, number];
	to: [number, number];
	milestones: string[];
};

export const SEASON: Phase[] = [
	{
		label: "SEP-OCT",
		title: "Design",
		from: [2026, 8],
		to: [2026, 9],
		milestones: [
			"Chassis design and parts list",
			"Order motors and controllers",
			"Fund the first build",
		],
	},
	{
		label: "NOV-JAN",
		title: "Rolling chassis",
		from: [2026, 10],
		to: [2027, 0],
		milestones: [
			"Rolling chassis and launcher tests",
			"Motor and power bench tests",
			"Validate motor control",
		],
	},
	{
		label: "FEB-MAR",
		title: "Working robot",
		from: [2027, 1],
		to: [2027, 2],
		milestones: [
			"Gimbal, feeder and mounts",
			"Referee system and power cutoff",
			"Drive, aim and fire on the robot",
		],
	},
	{
		label: "APR",
		title: "Qualify",
		from: [2027, 3],
		to: [2027, 3],
		milestones: [
			"Fix faults and finalize the build",
			"Compliance and qualification tests",
			"Submit qualification evidence",
		],
	},
	{
		label: "MAY-JUN",
		title: "Compete",
		from: [2027, 4],
		to: [2027, 5],
		milestones: [
			"Prepare spares and practise repairs",
			"Train the pilots",
			"Travel to the championships",
		],
	},
];

export type Exec = {
	name: string;
	role: string;
	program: string;
	photo: string;
	focus: string;
	highlights: string[];
};

export const EXEC_TEAM: Exec[] = [
	{
		name: "Aaron Huang",
		role: "Design & build lead",
		program: "Engineering Science",
		photo: "/images/exec/aaron-huang.webp",
		focus: "Mechanical design, fabrication and assembly.",
		highlights: [
			"Founding member, chief engineer and captain of FRC 7520. Took the 60-member, 8-subteam program to Worlds two years in a row.",
			"Co-founded YM Robotics (VRC 95500A) and grew it to 30 members.",
			"Designed a portable CoreXY 3D printer and a CNC controller with a hardware emergency stop.",
		],
	},
	{
		name: "Max Ma",
		role: "Electronics lead",
		program: "Electrical & Computer Engineering",
		photo: "/images/exec/max-ma.webp",
		focus: "Power systems, motor control electronics and electrical testing.",
		highlights: [
			"Co-founded YM Robotics and its VEX V5 team, 95500A.",
			"President of the YM Technology Council. Ran its tech events and raised money for robotics fees and equipment.",
			"Builds embedded and IoT projects on Arduino and XIAO boards. Second place at NSBEHacks.",
		],
	},
	{
		name: "Evan Yu",
		role: "Software lead",
		program: "Mathematics",
		photo: "/images/exec/evan-yu.webp",
		focus: "Robot control software, vision assistance and software testing.",
		highlights: [
			"Co-founded YM Robotics, and built and drove its competition robot.",
			"Founding product engineer at The Relationship Company.",
			"First place in Education at Stanford TreeHacks. Works with Raspberry Pi, Arduino and custom PCBs.",
		],
	},
	{
		name: "Aiden Kim",
		role: "Administration lead",
		program: "Rotman Commerce",
		photo: "/images/exec/aiden-kim.webp",
		focus: "Fundraising, budgeting, procurement and competition logistics.",
		highlights: [
			"Business analyst at Avail Risk Management, on partnerships covering over $1B in insurable value.",
			"Early team at Crisis Connect, a seed-stage startup. Landed its University of Chicago partnership.",
			"Co-founded the YM Case Competition and ran finance for YM Robotics.",
		],
	},
];

/** From the 2026-2027 budget in the pitch deck. */
export const BUDGET = [
	{
		amount: "C$5,000",
		label:
			"The robot: motors, electronics, referee hardware, chargers and materials",
	},
	{
		amount: "C$1,024",
		label: "Registration and shipping the robot to competition",
	},
	{ amount: "C$810", label: "Airfare for each member who travels" },
];

export const SPONSOR_ASKS = [
	{ title: "Funding", body: "Pays for parts, registration and travel." },
	{
		title: "Parts and materials",
		body: "Motors, controllers, electronics, sheet metal and stock.",
	},
	{ title: "Fabrication", body: "Laser cutting, forming and machining." },
];
