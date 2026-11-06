import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import {
	publicGoogleCalendarUrl,
	readCalendarFeed,
} from "./calendar-feed.server.ts";

const feedUrl =
	"https://calendar.google.com/calendar/ical/rift%40group.calendar.google.com/public/basic.ics";
const originalUrl = process.env.GOOGLE_CALENDAR_ICS_URL;
beforeEach(() => {
	delete process.env.GOOGLE_CALENDAR_ICS_URL;
});
afterEach(() => {
	mock.restoreAll();
	if (originalUrl === undefined) delete process.env.GOOGLE_CALENDAR_ICS_URL;
	else process.env.GOOGLE_CALENDAR_ICS_URL = originalUrl;
});

test("unconfigured calendar returns null without a network request", async () => {
	const request = mock.method(globalThis, "fetch");
	assert.equal(await readCalendarFeed(), null);
	assert.equal(request.mock.callCount(), 0);
});

test("allows only Google's public calendar URL", () => {
	assert.equal(publicGoogleCalendarUrl(feedUrl), feedUrl);
	for (const url of [
		"https://localhost/calendar.ics",
		"http://calendar.google.com/calendar/ical/id/public/basic.ics",
		"https://calendar.google.com/calendar/ical/id/private-secret/basic.ics",
		"https://calendar.google.com.evil.test/calendar/ical/id/public/basic.ics",
		`${feedUrl}?secret=1`,
	]) {
		assert.throws(() => publicGoogleCalendarUrl(url));
	}
});

test("returns ICS and subscription URL with bounded server fetch options", async () => {
	process.env.GOOGLE_CALENDAR_ICS_URL = feedUrl;
	const ics = "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR";
	const request = mock.method(
		globalThis,
		"fetch",
		async () => new Response(ics),
	);
	assert.deepEqual(await readCalendarFeed(), { ics, subscriptionUrl: feedUrl });
	assert.equal(request.mock.calls[0].arguments[0], feedUrl);
	assert.equal(request.mock.calls[0].arguments[1]?.redirect, "error");
	assert.ok(request.mock.calls[0].arguments[1]?.signal instanceof AbortSignal);
});

test("network and HTTP errors return a useful message without leaking the feed URL", async () => {
	process.env.GOOGLE_CALENDAR_ICS_URL = feedUrl;
	mock.method(
		globalThis,
		"fetch",
		async () => new Response("Not found", { status: 404 }),
	);
	await assert.rejects(readCalendarFeed(), /temporarily unavailable/);
});

test("enforces the size limit on streamed responses", async () => {
	process.env.GOOGLE_CALENDAR_ICS_URL = feedUrl;
	mock.method(
		globalThis,
		"fetch",
		async () => new Response("x".repeat(2 * 1024 * 1024 + 1)),
	);
	await assert.rejects(readCalendarFeed(), /temporarily unavailable/);
});
