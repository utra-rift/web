import { createFileRoute } from "@tanstack/react-router";
import RiftHero from "#/components/hero/RiftHero";
import { HomeSections, SiteFooter } from "#/components/home/HomeSections";

const DESCRIPTION =
	"Paintball for robots. Become a founding member for UTRA's newest team, competing at the ARC Championships.";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ name: "description", content: DESCRIPTION },
			{ property: "og:title", content: "RIFT · UTRA" },
			{ property: "og:description", content: DESCRIPTION },
			// TODO: make absolute once the production domain is known.
			{ property: "og:image", content: "/og-image.jpg" },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "675" },
			{ name: "twitter:card", content: "summary_large_image" },
		],
		// Start the WebGL rift's downloads before hydration (skipped with reduced motion).
		links: ["/rift/rift.glb.gz", "/rift/rift-effect-curves.json"].map(
			(href) => ({
				rel: "preload",
				href,
				as: "fetch",
				crossOrigin: "anonymous" as const,
				media: "(prefers-reduced-motion: no-preference)",
			}),
		),
	}),
	component: Home,
});

function Home() {
	return (
		<>
			<main>
				<RiftHero />
				<HomeSections />
			</main>
			<SiteFooter />
		</>
	);
}
