import ICAL from "ical.js";

export const MAX_ICS_BYTES = 2 * 1024 * 1024;

export type CalendarEvent = {
	id: string;
	title: string;
	description: string;
	location: string;
	start: Date;
	end: Date;
	allDay: boolean;
	url: string | null;
};

export function dateKey(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function eventsOnDate(events: CalendarEvent[], date: Date) {
	const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
	return events.filter((event) =>
		event.end > event.start
			? event.start < end && event.end > start
			: event.start >= start && event.start < end,
	);
}

export function upcomingEvents(events: CalendarEvent[], now: Date) {
	return events.filter((event) => event.start >= now || event.end > now);
}

function safeEventUrl(value: string) {
	try {
		const url = new URL(value);
		return ["https:", "http:"].includes(url.protocol) ? url.href : null;
	} catch {
		return null;
	}
}

// Google usually supplies VTIMEZONE. Intl covers IANA TZIDs in other exports
// that omit it, rather than silently treating a named zone as local time.
function eventDate(time: ICAL.Time, event: ICAL.Event, property: string) {
	const tzid = event.component.getFirstProperty(property)?.getParameter("tzid");
	if (
		time.isDate ||
		time.zone.tzid !== "floating" ||
		typeof tzid !== "string"
	) {
		return time.toJSDate();
	}
	const format = new Intl.DateTimeFormat("en-CA", {
		timeZone: tzid,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23",
	});
	const wallTime = Date.UTC(
		time.year,
		time.month - 1,
		time.day,
		time.hour,
		time.minute,
		time.second,
	);
	let result = wallTime;
	for (let step = 0; step < 3; step++) {
		const parts = Object.fromEntries(
			format.formatToParts(result).map(({ type, value }) => [type, value]),
		);
		const represented = Date.UTC(
			Number(parts.year),
			Number(parts.month) - 1,
			Number(parts.day),
			Number(parts.hour),
			Number(parts.minute),
			Number(parts.second),
		);
		const offset = represented - wallTime;
		if (offset === 0) break;
		result -= offset;
	}
	return new Date(result);
}

/** Expand only the visible window; never attempt an unbounded recurrence. */
export function parseCalendar(ics: string, rangeStart: Date, rangeEnd: Date) {
	if (new TextEncoder().encode(ics).length > MAX_ICS_BYTES) {
		throw new Error("Choose an ICS file smaller than 2 MB.");
	}
	try {
		const calendar = new ICAL.Component(
			ICAL.parse(ics.replace(/^\uFEFF/, "").trim()),
		);
		if (calendar.name !== "vcalendar") throw new Error("Not a calendar");
		const components = calendar.getAllSubcomponents("vevent");
		const masters = new Set(
			components
				.filter((component) => !component.hasProperty("recurrence-id"))
				.map((component) => component.getFirstPropertyValue("uid")),
		);
		const events = new Map<string, CalendarEvent>();
		let iterations = 0;

		function add(
			event: ICAL.Event,
			startTime: ICAL.Time,
			endTime: ICAL.Time,
			recurrenceId: ICAL.Time,
		) {
			if (event.component.getFirstPropertyValue("status") === "CANCELLED")
				return;
			const start = eventDate(startTime, event, "dtstart");
			const end = eventDate(
				endTime,
				event,
				event.component.hasProperty("dtend") ? "dtend" : "dtstart",
			);
			if (
				!Number.isFinite(start.getTime()) ||
				!Number.isFinite(end.getTime()) ||
				end < start
			)
				throw new Error("Invalid event dates");
			if (
				start >= rangeEnd ||
				(end > start ? end <= rangeStart : start < rangeStart)
			)
				return;
			const id = `${event.uid || event.summary}-${recurrenceId.toString()}`;
			events.set(id, {
				id,
				start,
				end,
				allDay: startTime.isDate,
				title: event.summary || "Untitled event",
				description: event.description || "",
				location: event.location || "",
				url: safeEventUrl(
					String(event.component.getFirstPropertyValue("url") || ""),
				),
			});
		}

		for (const component of components) {
			if (!component.hasProperty("dtstart")) {
				if (component.getFirstPropertyValue("status") === "CANCELLED") continue;
				throw new Error("Missing event start");
			}
			const event = new ICAL.Event(component);
			if (event.isRecurrenceException() && masters.has(event.uid)) continue;
			if (component.getFirstPropertyValue("status") === "CANCELLED") continue;
			if (!event.isRecurring()) {
				add(event, event.startDate, event.endDate, event.startDate);
				continue;
			}
			const iterator = event.iterator();
			for (
				let occurrence = iterator.next();
				occurrence;
				occurrence = iterator.next()
			) {
				if (++iterations > 100_000) throw new Error("Too many recurrences");
				if (eventDate(occurrence, event, "dtstart") >= rangeEnd) break;
				const details = event.getOccurrenceDetails(occurrence);
				add(
					details.item,
					details.startDate,
					details.endDate,
					details.recurrenceId,
				);
			}
			// Include exceptions moved into this window from a later original date.
			for (const exception of Object.values(event.exceptions)) {
				if (exception.component.hasProperty("dtstart")) {
					add(
						exception,
						exception.startDate,
						exception.endDate,
						exception.recurrenceId,
					);
				}
			}
		}
		return {
			name: String(
				calendar.getFirstPropertyValue("x-wr-calname") || "Calendar",
			),
			events: [...events.values()].sort(
				(a, b) =>
					a.start.getTime() - b.start.getTime() ||
					a.title.localeCompare(b.title),
			),
		};
	} catch {
		throw new Error(
			"This calendar could not be read. Export a valid ICS calendar with event dates and time zones, then try again.",
		);
	}
}
