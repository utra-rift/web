// RIFT design tokens, from the design handoff (design/tokens.json).
// Kept as a TS module rather than JSON: the dev server doesn't serve .json imports.
const tokens = {
	name: "RIFT",
	version: 1,
	color: {
		themes: [
			{
				id: "light",
				name: "Light",
			},
			{
				id: "dark",
				name: "Arena (dark)",
			},
		],
		tokens: [
			{
				name: "ice",
				value: "#F4FBFC",
				usage:
					"Brand ice. The light ground of the identity; page background in light.",
			},
			{
				name: "navy",
				value: "#002554",
				usage:
					"Brand navy. The primary identity colour: headings and body ink in light, large panels, the primary button fill. Ice or white text on it (14.4:1).",
			},
			{
				name: "cyan",
				value: "#4DC6E2",
				usage:
					"Brand cyan. Accent fills (accent button, highlight blocks, chart series 1). Never text on ice or white (1.9:1); put navy text on it (7.5:1). As text it passes only on dark grounds.",
			},
			{
				name: "violet",
				value: "#7B61FF",
				usage:
					"Brand violet. Secondary accent for highlights, focus rings and graphic shapes. White on it is 4.2:1, so only large or bold 19px+ text may sit on a violet fill; use violet-text for small violet type.",
			},
			{
				name: "surface",
				value: {
					light: "{ice}",
					dark: "#07101F",
				},
				usage: "Page background.",
			},
			{
				name: "surface-raised",
				value: {
					light: "#FFFFFF",
					dark: "#0E1A2E",
				},
				usage: "Cards, menus and anything that sits on surface.",
			},
			{
				name: "surface-brand",
				value: {
					light: "{navy}",
					dark: "#002554",
				},
				usage:
					"Navy panels and hero bands in both themes. Text on it is on-navy.",
			},
			{
				name: "line",
				value: {
					light: "#D3E4EA",
					dark: "#22324A",
				},
				usage:
					"Hairline dividers and card outlines. Decorative only; never the only boundary of a control.",
			},
			{
				name: "ink",
				value: {
					light: "{navy}",
					dark: "#F4FBFC",
				},
				usage:
					"Primary text on surface and surface-raised (14.4:1 light, 18.2:1 dark). Also outline button borders.",
			},
			{
				name: "ink-muted",
				value: {
					light: "#4A5B73",
					dark: "#9FB0C6",
				},
				usage:
					"Secondary text, captions and metadata on surface and surface-raised (6.6:1 light, 8.6:1 dark).",
			},
			{
				name: "on-navy",
				value: "#F4FBFC",
				usage: "Text and icons on navy and surface-brand fills.",
			},
			{
				name: "on-cyan",
				value: "#002554",
				usage:
					"Text and icons on cyan fills, such as the accent button label (7.5:1).",
			},
			{
				name: "on-violet",
				value: "#FFFFFF",
				usage: "Text on a violet fill. 4.2:1: large or bold 19px+ text only.",
			},
			{
				name: "cyan-text",
				value: {
					light: "#006E88",
					dark: "#4DC6E2",
				},
				usage:
					"Cyan as text and links, on surface, surface-raised and cyan-soft (5.3:1 or better in both themes).",
			},
			{
				name: "cyan-soft",
				value: {
					light: "#E4F6FA",
					dark: "#0D2A38",
				},
				usage: "Tinted background behind cyan-text (tags, callouts).",
			},
			{
				name: "violet-text",
				value: {
					light: "#5A3FE0",
					dark: "#A897FF",
				},
				usage:
					"Violet as text on surface, surface-raised and violet-soft (5.5:1 or better in both themes).",
			},
			{
				name: "violet-soft",
				value: {
					light: "#EEEAFF",
					dark: "#1C1640",
				},
				usage: "Tinted background behind violet-text.",
			},
			{
				name: "focus",
				value: "{violet}",
				usage:
					"Focus ring, 2px solid with 2px offset. 4.0:1 or better on every surface in both themes.",
			},
			{
				name: "link",
				value: "{cyan-text}",
				usage: "Inline links. Alias of cyan-text.",
			},
		],
	},
	type: {
		fonts: [
			{
				family: "Widescreen Ex",
				file: "fonts/WidescreenEx_Trial_Rg.ttf",
				weight: "400",
				style: "normal",
			},
			{
				family: "Widescreen Ex",
				file: "fonts/WidescreenEx_Trial_Md.ttf",
				weight: "500",
				style: "normal",
			},
			{
				family: "Widescreen Ex",
				file: "fonts/WidescreenEx_Trial_SBd.ttf",
				weight: "600",
				style: "normal",
			},
			{
				family: "Widescreen Ex",
				file: "fonts/WidescreenEx_Trial_Bd.ttf",
				weight: "700",
				style: "normal",
			},
			{
				family: "Widescreen",
				file: "fonts/Widescreen_Trial_Md.ttf",
				weight: "500",
				style: "normal",
			},
			{
				family: "Widescreen",
				file: "fonts/Widescreen_Trial_SBd.ttf",
				weight: "600",
				style: "normal",
			},
		],
		families: {
			display: '"Widescreen Ex", "Lexend Giga", system-ui, sans-serif',
			"display-wide":
				'"Widescreen UEx", "Widescreen Ex", "Lexend Giga", system-ui, sans-serif',
			wide: '"Widescreen", "Lexend", system-ui, sans-serif',
			sans: '"Lexend", system-ui, sans-serif',
			mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
		},
		groups: [
			{
				name: "Display",
				family: "display",
				styles: [
					{
						name: "display-xl",
						fontSize: "72px",
						lineHeight: "72px",
						fontWeight: 700,
						letterSpacing: "0",
						sample: "RIFT",
						usage: "Poster and hero headlines. Always uppercase, 1 to 3 words.",
					},
					{
						name: "display-lg",
						fontSize: "40px",
						lineHeight: "44px",
						fontWeight: 600,
						letterSpacing: "0",
						sample: "KICKOFF",
						usage: "Section openers and event titles. Uppercase.",
					},
					{
						name: "display-sm",
						fontSize: "24px",
						lineHeight: "30px",
						fontWeight: 500,
						letterSpacing: "0",
						sample: "OCT 2 | 7-8 PM",
						usage:
							"Event details (date, room, time) stacked under a display headline. Uppercase.",
					},
				],
			},
			{
				name: "Text",
				family: "sans",
				styles: [
					{
						name: "title",
						fontSize: "20px",
						lineHeight: "28px",
						fontWeight: 600,
						sample: "Build a robot that fights back",
						usage: "Card and panel titles, sentence case.",
					},
					{
						name: "body",
						fontSize: "16px",
						lineHeight: "24px",
						fontWeight: 400,
						sample:
							"We design, build and drive robots for the ARC Championships.",
						usage: "Default copy.",
					},
					{
						name: "body-sm",
						fontSize: "14px",
						lineHeight: "20px",
						fontWeight: 400,
						sample: "Open to all U of T students. No experience needed.",
						usage: "Captions, metadata, dense UI.",
					},
					{
						name: "label",
						fontSize: "12px",
						lineHeight: "16px",
						fontWeight: 600,
						letterSpacing: "0.04em",
						sample: "PAINTBALL FOR ROBOTS",
						usage:
							"Eyebrows, tags and button labels, in Widescreen. Uppercase.",
						family: "wide",
					},
				],
			},
			{
				name: "Mono",
				family: "mono",
				styles: [
					{
						name: "data",
						fontSize: "13px",
						lineHeight: "20px",
						fontWeight: 500,
						sample: "BA1130 · 24V · 600 RPM",
						usage: "Specs, room codes, telemetry and handles like @utra_rift.",
					},
				],
			},
		],
	},
	spacing: {
		tokens: [
			{
				name: "space-1",
				value: "4px",
				usage: "Icon to label gap.",
			},
			{
				name: "space-2",
				value: "8px",
				usage: "Tag padding, tight stacks.",
			},
			{
				name: "space-3",
				value: "12px",
				usage: "Button vertical padding x1, list gaps.",
			},
			{
				name: "space-4",
				value: "16px",
				usage: "Card inner gap, page gutter on mobile.",
			},
			{
				name: "space-6",
				value: "24px",
				usage: "Card padding.",
			},
			{
				name: "space-8",
				value: "32px",
				usage: "Between cards; page gutter on desktop.",
			},
			{
				name: "space-12",
				value: "48px",
				usage: "Between sections.",
			},
			{
				name: "space-16",
				value: "64px",
				usage: "Hero and poster margins.",
			},
		],
	},
	radius: {
		tokens: [
			{
				name: "radius-none",
				value: "0",
				usage:
					"Panels, hero bands, poster blocks. The brand is sharp by default.",
			},
			{
				name: "radius-sm",
				value: "2px",
				usage: "Buttons and inputs.",
			},
			{
				name: "radius-md",
				value: "4px",
				usage: "Cards.",
			},
			{
				name: "radius-pill",
				value: "999px",
				usage: "Tags only.",
			},
		],
	},
	shadow: {
		note: "Flat by default. The one signature effect is the spark glow from the logo artboard.",
		tokens: [
			{
				name: "shadow-card",
				value: {
					light: "0 1px 2px rgba(0,37,84,0.08)",
					dark: "none",
				},
				usage:
					"Cards on surface in light. Dark relies on surface-raised instead.",
			},
			{
				name: "glow-spark",
				value: {
					light: "0 0 26px rgba(77,198,226,0.45)",
					dark: "0 0 26px rgba(255,255,255,0.35)",
				},
				usage:
					"Halo behind the mark or a hero element on navy or dark grounds, echoing the logo's outer glow. Once per view at most.",
			},
		],
	},
};

export default tokens;
