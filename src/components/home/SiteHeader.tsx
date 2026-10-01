import Lockup from "#/components/brand/Lockup";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { JOIN_HREF, NAV_LINKS } from "./content";

/** Header for pages other than home: links back to the home page's sections. */
export function SiteHeader({ className }: { className?: string }) {
	return (
		<header
			className={cn(
				"mx-auto flex w-full max-w-[1440px] items-center justify-between gap-8 px-4 py-4 sm:px-8 sm:py-8 min-[68.75rem]:px-16",
				className,
			)}
		>
			<Lockup className="max-sm:[--lockup-rift:42px] max-sm:[--lockup-utra:28px]" />
			<nav aria-label="Primary" className="flex items-center gap-6 lg:gap-10">
				{NAV_LINKS.map((link) => (
					<a
						key={link.label}
						href={`/${link.href}`}
						className="hero-nav-link max-lg:hidden"
					>
						{link.label}
					</a>
				))}
				<Button asChild variant="outline">
					<a href={JOIN_HREF}>Join</a>
				</Button>
			</nav>
		</header>
	);
}
