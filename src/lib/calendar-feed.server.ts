import { MAX_ICS_BYTES } from "./calendar.ts";

export function publicGoogleCalendarUrl(value: string) {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new Error("The team calendar feed is not configured correctly.");
	}
	if (
		url.protocol !== "https:" ||
		url.hostname !== "calendar.google.com" ||
		url.port ||
		url.username ||
		url.password ||
		url.search ||
		url.hash ||
		!/^\/calendar\/ical\/[^/]+\/public\/basic\.ics$/.test(url.pathname)
	) {
		throw new Error(
			"Use Google Calendar’s public iCal address for the team calendar.",
		);
	}
	return url.href;
}

export async function readCalendarFeed() {
	const configuredUrl = process.env.GOOGLE_CALENDAR_ICS_URL?.trim();
	if (!configuredUrl) return null;
	const url = publicGoogleCalendarUrl(configuredUrl);
	try {
		const response = await fetch(url, {
			headers: { Accept: "text/calendar" },
			signal: AbortSignal.timeout(10_000),
			redirect: "error",
		});
		if (!response.ok || !response.body) throw new Error("Feed unavailable");
		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let size = 0;
		let ics = "";
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				size += value.byteLength;
				if (size > MAX_ICS_BYTES) {
					await reader.cancel();
					throw new Error("Feed too large");
				}
				ics += decoder.decode(value, { stream: true });
			}
		} finally {
			reader.releaseLock();
		}
		ics += decoder.decode();
		return { ics, subscriptionUrl: url };
	} catch {
		throw new Error(
			"The team calendar is temporarily unavailable. Try refreshing.",
		);
	}
}
