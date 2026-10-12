import assert from "node:assert/strict";
import { test } from "node:test";
import {
	dateKey,
	eventsOnDate,
	MAX_ICS_BYTES,
	parseCalendar,
	upcomingEvents,
} from "./calendar.ts";

process.env.TZ = "America/Toronto";
const from = new Date("2026-10-01T00:00:00Z");
const until = new Date("2026-12-01T00:00:00Z");
const wrap = (body: string) =>
	`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nX-WR-CALNAME:RIFT\r\n${body.trim()}\r\nEND:VCALENDAR`;
const meeting = (properties: string, uid = "meeting") =>
	`BEGIN:VEVENT\nUID:${uid}\n${properties}\nEND:VEVENT`;

test("parses UTC dates, folded lines and escaped Google Calendar text", () => {
	const result = parseCalendar(
		wrap(
			meeting(
				"DTSTART:20261005T230000Z\nDTEND:20261006T000000Z\nSUMMARY:Robot build and\n  testing\nDESCRIPTION:Bring tools\\nMeet the leads\\, too\nLOCATION:BA1130",
			),
		),
		from,
		until,
	);
	assert.equal(result.name, "RIFT");
	assert.equal(result.events[0].title, "Robot build and testing");
	assert.equal(
		result.events[0].description,
		"Bring tools\nMeet the leads, too",
	);
	assert.equal(
		result.events[0].start.toISOString(),
		"2026-10-05T23:00:00.000Z",
	);
});

test("expands weekly recurrences, exclusions, rescheduling and cancellations", () => {
	const ics = wrap(
		[
			meeting(
				"DTSTART:20261005T230000Z\nDTEND:20261006T000000Z\nSUMMARY:Build\nRRULE:FREQ=WEEKLY;COUNT=5\nEXDATE:20261012T230000Z",
			),
			meeting(
				"RECURRENCE-ID:20261019T230000Z\nDTSTART:20261020T220000Z\nDTEND:20261020T230000Z\nSUMMARY:Moved build",
			),
			meeting(
				"RECURRENCE-ID:20261026T230000Z\nDTSTART:20261026T230000Z\nDTEND:20261027T000000Z\nSTATUS:CANCELLED",
			),
		].join("\n"),
	);
	const events = parseCalendar(ics, from, until).events;
	assert.deepEqual(
		events.map((event) => event.start.toISOString()),
		[
			"2026-10-05T23:00:00.000Z",
			"2026-10-20T22:00:00.000Z",
			"2026-11-02T23:00:00.000Z",
		],
	);
	assert.equal(events[1].title, "Moved build");
});

test("uses named time zones without VTIMEZONE and follows daylight savings", () => {
	const events = parseCalendar(
		wrap(
			meeting(
				"DTSTART;TZID=America/Toronto:20261026T190000\nDTEND;TZID=America/Toronto:20261026T200000\nRRULE:FREQ=WEEKLY;COUNT=2\nSUMMARY:Build",
			),
		),
		from,
		until,
	).events;
	assert.deepEqual(
		events.map((event) => event.start.toISOString()),
		["2026-10-26T23:00:00.000Z", "2026-11-03T00:00:00.000Z"],
	);
	assert.equal(events[1].end.getTime() - events[1].start.getTime(), 3_600_000);
});

test("uses the feed's VTIMEZONE definition", () => {
	const zone =
		"BEGIN:VTIMEZONE\nTZID:Custom/Zone\nBEGIN:STANDARD\nDTSTART:19700101T000000\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0200\nEND:STANDARD\nEND:VTIMEZONE";
	const event = meeting(
		"DTSTART;TZID=Custom/Zone:20261005T190000\nDTEND;TZID=Custom/Zone:20261005T200000\nSUMMARY:Build",
	);
	assert.equal(
		parseCalendar(
			wrap(`${zone}\n${event}`),
			from,
			until,
		).events[0].start.toISOString(),
		"2026-10-05T17:00:00.000Z",
	);
});

test("all-day events cover every day except the exclusive DTEND", () => {
	const events = parseCalendar(
		wrap(
			meeting(
				"DTSTART;VALUE=DATE:20261005\nDTEND;VALUE=DATE:20261008\nSUMMARY:Competition",
			),
		),
		from,
		until,
	).events;
	assert.equal(events[0].allDay, true);
	assert.equal(dateKey(events[0].start), "2026-10-05");
	assert.equal(eventsOnDate(events, new Date(2026, 9, 7)).length, 1);
	assert.equal(eventsOnDate(events, new Date(2026, 9, 8)).length, 0);
});

test("missing DTEND defaults to one day for all-day and an instant for timed events", () => {
	const events = parseCalendar(
		wrap(
			[
				meeting("DTSTART;VALUE=DATE:20261005\nSUMMARY:All day", "day"),
				meeting("DTSTART:20261005T230000Z\nSUMMARY:Reminder", "instant"),
			].join("\n"),
		),
		from,
		until,
	).events;
	assert.equal(dateKey(events[0].end), "2026-10-06");
	assert.equal(eventsOnDate(events, new Date(2026, 9, 5)).length, 2);
	assert.equal(
		upcomingEvents(events, new Date("2026-10-05T23:30:00Z")).length,
		1,
	);
});

test("upcoming list excludes finished events and includes an ongoing overnight event", () => {
	const events = parseCalendar(
		wrap(
			[
				meeting("DTSTART:20261005T220000Z\nDTEND:20261005T230000Z", "past"),
				meeting("DTSTART:20261006T030000Z\nDTEND:20261006T060000Z", "ongoing"),
				meeting("DTSTART:20261006T230000Z\nDTEND:20261007T000000Z", "next"),
			].join("\n"),
		),
		from,
		until,
	).events;
	assert.deepEqual(
		upcomingEvents(events, new Date("2026-10-06T04:00:00Z")).map(
			(event) => event.id.split("-")[0],
		),
		["ongoing", "next"],
	);
	assert.equal(eventsOnDate(events, new Date(2026, 9, 6)).length, 2);
});

test("filters to the requested window and expands old recurring series", () => {
	const events = parseCalendar(
		wrap(
			meeting(
				"DTSTART:20200101T190000Z\nDTEND:20200101T200000Z\nRRULE:FREQ=WEEKLY\nSUMMARY:Build",
			),
		),
		from,
		until,
	).events;
	assert.ok(events.length > 0);
	assert.ok(
		events.every((event) => event.start >= from && event.start < until),
	);
});

test("includes an exception moved into the window from beyond its end", () => {
	const events = parseCalendar(
		wrap(
			[
				meeting(
					"DTSTART:20261005T190000Z\nDTEND:20261005T200000Z\nRRULE:FREQ=MONTHLY;COUNT=4",
				),
				meeting(
					"RECURRENCE-ID:20261205T190000Z\nDTSTART:20261120T190000Z\nDTEND:20261120T200000Z\nSUMMARY:Moved",
				),
			].join("\n"),
		),
		from,
		until,
	).events;
	assert.equal(events.filter((event) => event.title === "Moved").length, 1);
});

test("valid empty feeds work, malformed and oversized files fail clearly", () => {
	assert.deepEqual(parseCalendar(wrap(""), from, until).events, []);
	assert.throws(
		() => parseCalendar("not an ICS file", from, until),
		/could not be read/,
	);
	assert.throws(
		() => parseCalendar(wrap(meeting("SUMMARY:No date")), from, until),
		/could not be read/,
	);
	assert.throws(
		() => parseCalendar("x".repeat(MAX_ICS_BYTES + 1), from, until),
		/smaller than 2 MB/,
	);
});

test("only HTTP(S) event links are retained", () => {
	const events = parseCalendar(
		wrap(
			[
				meeting("DTSTART:20261005T190000Z\nURL:javascript:alert(1)", "bad"),
				meeting(
					"DTSTART:20261006T190000Z\nURL:https://example.com/event",
					"good",
				),
			].join("\n"),
		),
		from,
		until,
	).events;
	assert.equal(events[0].url, null);
	assert.equal(events[1].url, "https://example.com/event");
});
