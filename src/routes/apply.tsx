import { createFileRoute, redirect } from "@tanstack/react-router";

const APPLICATION_URL =
	"https://utra.notion.site/3d747514ebfe80de97bde8e87b96631c";

export const Route = createFileRoute("/apply")({
	beforeLoad: () => {
		throw redirect({ href: APPLICATION_URL });
	},
});
