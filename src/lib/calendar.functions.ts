import { createServerFn } from "@tanstack/react-start";
import { readCalendarFeed } from "./calendar-feed.server";

export const getCalendarFeed = createServerFn({ method: "GET" }).handler(() =>
	readCalendarFeed(),
);
