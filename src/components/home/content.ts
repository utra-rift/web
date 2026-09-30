/** Site copy and links shared by the hero and the sections below it. */

export const JOIN_HREF = "/apply";
export const INSTAGRAM_HANDLE = "@utra_rift";
export const INSTAGRAM_HREF = "https://www.instagram.com/utra_rift/";
export const UTRA_HREF = "https://utra.ca";

export const NAV_LINKS = [
	{ label: "GAME", href: "#game" },
	{ label: "TEAMS", href: "#teams" },
	{ label: "EXEC", href: "#exec" },
	{ label: "SEASON", href: "#season" },
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

/** Limits from ARC's 2026 rules for a 1v1 robot. */
export const ROBOT_SPECS = [
	{ value: "600 MM", label: "Starting cube, 800 mm expanded" },
	{ value: "25 KG", label: "Maximum weight" },
	{ value: "17 MM", label: "Projectiles from one launcher" },
	{ value: "25 M/S", label: "Maximum projectile speed" },
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
	note?: string;
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
		note: "Open to every program. No engineering background needed.",
	},
];

export const TEAM_PRINCIPLES = [
	{
		title: "Start where you are",
		body: "Beginners get scoped tasks to learn on. Experienced members take on whole subsystems.",
	},
	{
		title: "Leads who teach",
		body: "Each group lead assigns tasks and gives technical guidance. Responsibility grows with your skills and commitment.",
	},
	{
		title: "Found the team",
		body: "This is RIFT's first season. The people who join now decide how the team builds, tests and competes.",
	},
	{
		title: "Safe by default",
		body: "Everyone does UTRA safety training before hands-on work. Firing tests happen in a closed box, with goggles on outside it.",
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

export const LEVEL_UP = [
	{
		title: "Robots that shoot back",
		body: "No game pieces to score. You aim at another robot while it aims at you.",
	},
	{
		title: "A gimbal and a launcher",
		body: "Two-axis aiming, a feeder and a launcher, all on a chassis that never stops moving.",
	},
	{
		title: "A referee system",
		body: "Armour panels on every robot register hits and take away hit points. Run out and you're done.",
	},
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
		program: "Engineering Science 3T0 + PEY",
		photo: "/images/exec/aaron-huang.webp",
		focus: "Mechanical design, fabrication and assembly.",
		highlights: [
			"Founding member, chief engineer and captain of FRC 7520: led 60+ members across 8 subteams to two consecutive Worlds appearances.",
			"Co-founded YM Robotics (VRC 95500A) and grew it to 30 members.",
			"Designed a portable CoreXY 3D printer and a CNC controller with a hardware emergency stop.",
		],
	},
	{
		name: "Max Ma",
		role: "Electronics lead",
		program: "Electrical & Computer Engineering 3T0 + PEY",
		photo: "/images/exec/max-ma.webp",
		focus: "Power systems, motor control electronics and electrical testing.",
		highlights: [
			"Co-founded YM Robotics and its VEX V5 team, 95500A.",
			"President of the YM Technology Council, running tech events and fundraising for competition fees and equipment.",
			"Builds embedded and IoT projects on Arduino and XIAO boards. Second place at NSBEHacks.",
		],
	},
	{
		name: "Evan Yu",
		role: "Software lead",
		program: "Mathematics '29 + ASIP",
		photo: "/images/exec/evan-yu.webp",
		focus: "Robot control software, vision assistance and software testing.",
		highlights: [
			"Co-founded YM Robotics, and built and drove its competition robot.",
			"Founding product engineer at The Relationship Company, on an app with 80,000 monthly users.",
			"First place in Education at Stanford TreeHacks. Works with Raspberry Pi, Arduino and custom PCBs.",
		],
	},
	{
		name: "Aiden Kim",
		role: "Administration lead",
		program: "Rotman Commerce '30",
		photo: "/images/exec/aiden-kim.webp",
		focus: "Fundraising, budgeting, procurement and competition logistics.",
		highlights: [
			"Business analyst at Avail Risk Management, supporting partnership outreach worth over $1B in insurable value.",
			"Founding team at Crisis Connect, a seed-stage startup, where outreach secured a University of Chicago partnership.",
			"Co-founded the YM Case Competition and ran finance for YM Robotics.",
		],
	},
];
