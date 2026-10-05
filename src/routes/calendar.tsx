import { createFileRoute, redirect } from "@tanstack/react-router";

const CALENDAR_URL =
	"https://calendar.google.com/calendar/?cid=Y18zMjM5YjNjZTYxMDRlYjJkZjQ4OGVmZjc1ODgyZmQ5OTk4MTMyNWI0OGM3NTYzZmIyYjdkMWM5NWM0OTEwNjcwQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20";

export const Route = createFileRoute("/calendar")({
	beforeLoad: () => {
		throw redirect({ href: CALENDAR_URL });
	},
});
