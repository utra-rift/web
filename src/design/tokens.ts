import tokens from "./tokens.data";

export type Theme = "light" | "dark";

type ColorValue = string | { light: string; dark: string };

export const colorTokens = tokens.color.tokens as {
	name: string;
	value: ColorValue;
	usage: string;
}[];
export const typeGroups = tokens.type.groups;
export const typeFamilies = tokens.type.families;
export const spacingTokens = tokens.spacing.tokens;
export const radiusTokens = tokens.radius.tokens;
export const shadowTokens = tokens.shadow.tokens;

const byName = new Map(colorTokens.map((token) => [token.name, token]));

/** Resolves a colour token to a hex value for a theme, following {references}. */
export function resolveColor(name: string, theme: Theme): string {
	const token = byName.get(name);
	if (!token) throw new Error(`Unknown colour token: ${name}`);
	const raw =
		typeof token.value === "string" ? token.value : token.value[theme];
	const ref = raw.match(/^\{(.+)\}$/);
	return ref ? resolveColor(ref[1], theme) : raw.toUpperCase();
}
