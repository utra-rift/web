import { Link } from "@tanstack/react-router";
import { cn } from "#/lib/utils";

/**
 * UTRA × RIFT lockup: logos only, no text. For dark grounds.
 * Heights can be overridden with --lockup-utra / --lockup-rift.
 */
export default function Lockup({ className }: { className?: string }) {
	return (
		<Link
			to="/"
			aria-label="UTRA x RIFT home"
			className={cn("flex shrink-0 items-center gap-5", className)}
		>
			<img
				src="/logos/utra-mark-white.png"
				alt=""
				width={381}
				height={224}
				className="block h-[var(--lockup-utra,36px)] w-auto"
			/>
			<svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12">
				<path
					d="M1 1L11 11M11 1L1 11"
					stroke="#9FB0C6"
					strokeWidth="1.4"
					strokeLinecap="round"
				/>
			</svg>
			<img
				src="/logos/rift-mark-white-cropped.svg"
				alt=""
				width={500}
				height={850}
				className="block h-[var(--lockup-rift,54px)] w-auto"
			/>
		</Link>
	);
}
