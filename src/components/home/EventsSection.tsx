import {
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	Clock,
	ExternalLink,
	MapPin,
	RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	type CalendarEvent,
	dateKey,
	eventsOnDate,
	parseCalendar,
	upcomingEvents,
} from "#/lib/calendar";
import { getCalendarFeed } from "#/lib/calendar.functions";
import { cn } from "#/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDate = new Intl.DateTimeFormat("en-CA", {
	weekday: "long",
	month: "long",
	day: "numeric",
	year: "numeric",
});
const monthLabel = new Intl.DateTimeFormat("en-CA", {
	month: "long",
	year: "numeric",
});
const timeLabel = new Intl.DateTimeFormat("en-CA", {
	hour: "numeric",
	minute: "2-digit",
});

function readCalendar(ics: string, subscriptionUrl: string) {
	const now = new Date();
	const rangeStart = new Date(now.getFullYear(), now.getMonth() - 12, 1);
	const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 13, 1);
	return {
		...parseCalendar(ics, rangeStart, rangeEnd),
		rangeStart,
		rangeEnd,
		subscriptionUrl,
	};
}

export function EventsSection() {
	const [calendar, setCalendar] = useState<ReturnType<
		typeof readCalendar
	> | null>(null);
	const [now, setNow] = useState<Date | null>(null);
	const [month, setMonth] = useState<Date | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [visibleCount, setVisibleCount] = useState(6);
	const requestId = useRef(0);

	const loadTeamCalendar = useCallback(async () => {
		const request = ++requestId.current;
		setLoading(true);
		setError(null);
		try {
			const feed = await getCalendarFeed();
			if (request !== requestId.current) return;
			setCalendar(feed ? readCalendar(feed.ics, feed.subscriptionUrl) : null);
			setSelectedDate(null);
			setVisibleCount(6);
		} catch (cause) {
			if (request === requestId.current)
				setError(
					cause instanceof Error
						? cause.message
						: "The calendar could not be loaded. Try again.",
				);
		} finally {
			if (request === requestId.current) setLoading(false);
		}
	}, []);

	useEffect(() => {
		const today = new Date();
		setNow(today);
		setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
		void loadTeamCalendar();
		const timer = window.setInterval(() => setNow(new Date()), 60_000);
		return () => {
			requestId.current++;
			window.clearInterval(timer);
		};
	}, [loadTeamCalendar]);

	const events = calendar?.events ?? [];
	const listedEvents = selectedDate
		? eventsOnDate(events, selectedDate)
		: now
			? upcomingEvents(events, now)
			: [];
	const listTitle = selectedDate
		? fullDate.format(selectedDate)
		: "Upcoming events";
	const firstDay = month
		? new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay())
		: null;
	const days = firstDay
		? Array.from(
				{ length: 42 },
				(_, index) =>
					new Date(
						firstDay.getFullYear(),
						firstDay.getMonth(),
						firstDay.getDate() + index,
					),
			)
		: [];
	const weeks = days.length
		? Array.from({ length: 6 }, (_, row) => days.slice(row * 7, row * 7 + 7))
		: [];
	const previousMonth = month
		? new Date(month.getFullYear(), month.getMonth() - 1, 1)
		: null;
	const nextMonth = month
		? new Date(month.getFullYear(), month.getMonth() + 1, 1)
		: null;

	return (
		<section
			id="events"
			aria-labelledby="events-title"
			className="scroll-mt-4 border-y bg-surface-raised py-20 md:py-28"
		>
			<div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 sm:px-8 min-[68.75rem]:px-16">
				<div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
					<div className="flex max-w-2xl flex-col gap-4">
						<p className="type-label text-cyan-text">Meet. Build. Compete.</p>
						<h2
							id="events-title"
							className="type-display-lg text-balance max-sm:text-[32px] max-sm:leading-9"
						>
							Team calendar
						</h2>
						<p className="type-body text-ink-muted">
							Find our next meetings, build sessions and competitions.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Button asChild variant="outline" size="sm">
							<a href="/calendar" target="_blank" rel="noreferrer">
								Google Calendar <ExternalLink data-icon="inline-end" />
							</a>
						</Button>
						{calendar?.subscriptionUrl && (
							<Button asChild variant="outline" size="sm">
								<a href={calendar.subscriptionUrl}>
									iCal <ExternalLink data-icon="inline-end" />
								</a>
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => void loadTeamCalendar()}
							disabled={loading}
						>
							<RefreshCw data-icon="inline-start" /> Refresh
						</Button>
					</div>
				</div>

				{error && (
					<p role="alert" className="type-body-sm text-destructive">
						{error}
					</p>
				)}
				<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
					<Card>
						<CardHeader>
							<div className="flex flex-wrap items-center justify-between gap-3">
								<CardTitle>
									<h3 aria-live="polite">
										{month ? monthLabel.format(month) : "Calendar"}
									</h3>
								</CardTitle>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="Previous month"
										disabled={
											!previousMonth ||
											(!!calendar && previousMonth < calendar.rangeStart)
										}
										onClick={() => {
											setMonth(previousMonth);
											setSelectedDate(null);
											setVisibleCount(6);
										}}
									>
										<ChevronLeft />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										disabled={!now}
										onClick={() => {
											if (now)
												setMonth(
													new Date(now.getFullYear(), now.getMonth(), 1),
												);
											setSelectedDate(null);
											setVisibleCount(6);
										}}
									>
										Today
									</Button>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="Next month"
										disabled={
											!nextMonth ||
											(!!calendar && nextMonth >= calendar.rangeEnd)
										}
										onClick={() => {
											setMonth(nextMonth);
											setSelectedDate(null);
											setVisibleCount(6);
										}}
									>
										<ChevronRight />
									</Button>
								</div>
							</div>
							<CardDescription>
								Select a day to see what’s happening.
							</CardDescription>
						</CardHeader>
						<CardContent className="max-sm:px-3">
							<table className="w-full table-fixed border-collapse">
								<caption className="sr-only">
									{month ? monthLabel.format(month) : "Monthly calendar"}
								</caption>
								<thead>
									<tr>
										{WEEKDAYS.map((day) => (
											<th
												key={day}
												scope="col"
												className="pb-3 type-data text-ink-muted"
											>
												{day}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{weeks.map((week) => (
										<tr key={dateKey(week[0])}>
											{week.map((day) => {
												const dayEvents = eventsOnDate(events, day);
												const selected =
													!!selectedDate &&
													dateKey(selectedDate) === dateKey(day);
												const today = !!now && dateKey(now) === dateKey(day);
												const outsideRange =
													!!calendar &&
													(day < calendar.rangeStart ||
														day >= calendar.rangeEnd);
												return (
													<td key={dateKey(day)} className="p-0.5">
														<button
															type="button"
															disabled={outsideRange}
															aria-label={`${fullDate.format(day)}, ${dayEvents.length} ${dayEvents.length === 1 ? "event" : "events"}`}
															aria-pressed={selected}
															aria-current={today ? "date" : undefined}
															onClick={() => {
																setSelectedDate(selected ? null : day);
																setVisibleCount(6);
																if (
																	month &&
																	day.getMonth() !== month.getMonth()
																)
																	setMonth(
																		new Date(
																			day.getFullYear(),
																			day.getMonth(),
																			1,
																		),
																	);
															}}
															className={cn(
																"flex min-h-14 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border border-transparent type-data transition-colors disabled:cursor-default disabled:opacity-40 sm:min-h-18",
																day.getMonth() !== month?.getMonth() &&
																	"text-ink-muted",
																today && "border-cyan",
																selected
																	? "bg-cyan text-on-cyan"
																	: "hover:bg-ink/10",
															)}
														>
															<span>{day.getDate()}</span>
															<span
																aria-hidden="true"
																className={cn(
																	"size-1.5 rounded-full",
																	dayEvents.length > 0 &&
																		(selected ? "bg-on-cyan" : "bg-cyan"),
																)}
															/>
														</button>
													</td>
												);
											})}
										</tr>
									))}
								</tbody>
							</table>
						</CardContent>
						<CardFooter className="flex-wrap justify-between gap-3 border-t">
							<p className="flex items-center gap-2 type-data text-ink-muted">
								<span
									aria-hidden="true"
									className="size-1.5 rounded-full bg-cyan"
								/>{" "}
								Event scheduled
							</p>
						</CardFooter>
					</Card>

					<div className="flex min-w-0 flex-col gap-5" aria-busy={loading}>
						<div className="flex flex-wrap items-center justify-between gap-3">
							<h3 className="type-title" aria-live="polite">
								{listTitle}
							</h3>
							{selectedDate && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setSelectedDate(null);
										setVisibleCount(6);
									}}
								>
									All upcoming
								</Button>
							)}
						</div>
						<p className="type-data text-ink-muted">
							{calendar?.name || "RIFT events"}
							{now &&
								` · Times in ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}
						</p>
						{loading ? (
							<output className="block py-10 type-body text-ink-muted">
								Loading calendar…
							</output>
						) : listedEvents.length > 0 ? (
							<>
								<ul className="flex flex-col gap-3">
									{listedEvents.slice(0, visibleCount).map((event) => (
										<EventItem key={event.id} event={event} now={now} />
									))}
								</ul>
								{listedEvents.length > visibleCount && (
									<Button
										variant="outline"
										onClick={() => setVisibleCount((count) => count + 6)}
									>
										Show more events ({listedEvents.length - visibleCount})
									</Button>
								)}
							</>
						) : (
							<Card>
								<CardHeader>
									<CalendarDays
										aria-hidden="true"
										className="mb-2 size-7 text-cyan-text"
									/>
									<CardTitle>
										<h4>
											{selectedDate
												? "No events on this day"
												: calendar
													? "No upcoming events"
													: "See you at the next build"}
										</h4>
									</CardTitle>
									<CardDescription>
										{selectedDate
											? "Choose another date, or return to all upcoming events."
											: calendar
												? "There are no scheduled events in the next twelve months. Check back soon."
												: "Our team events will appear here when the calendar is connected. Check back soon."}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="type-body-sm text-ink-muted">
										{calendar
											? "Meetings, build sessions and competition dates will be listed here."
											: "Open Google Calendar to view the team’s schedule."}
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function EventItem({ event, now }: { event: CalendarEvent; now: Date | null }) {
	const ongoing = !!now && event.start <= now && event.end > now;
	const lastDay = new Date(event.end.getTime() - 1);
	const multiDay =
		event.end > event.start && dateKey(lastDay) !== dateKey(event.start);
	return (
		<li className="flex gap-4 rounded-md border bg-surface p-5">
			<div
				aria-hidden="true"
				className="flex w-12 shrink-0 flex-col items-center gap-1 border-r pr-4"
			>
				<span className="type-label text-cyan-text">
					{event.start.toLocaleDateString("en-CA", { month: "short" })}
				</span>
				<span className="type-title">{event.start.getDate()}</span>
			</div>
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<h4 className="type-body font-semibold text-pretty break-words">
						{event.title}
					</h4>
					{ongoing && <Badge>Happening now</Badge>}
				</div>
				<p className="type-body-sm text-ink-muted">
					<time dateTime={event.start.toISOString()}>
						{fullDate.format(event.start)}
					</time>
					{multiDay && (
						<>
							{" "}
							–{" "}
							<time dateTime={lastDay.toISOString()}>
								{fullDate.format(lastDay)}
							</time>
						</>
					)}
				</p>
				<p className="flex items-start gap-2 type-body-sm text-ink-muted">
					<Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
					{event.allDay
						? "All day"
						: `${timeLabel.format(event.start)}${event.end > event.start ? ` – ${timeLabel.format(event.end)}` : ""}`}
				</p>
				{event.location && (
					<p className="flex items-start gap-2 type-body-sm break-words text-ink-muted">
						<MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
						<span className="min-w-0">{event.location}</span>
					</p>
				)}
				{event.description && (
					<details className="type-body-sm text-ink-muted">
						<summary className="cursor-pointer text-ink">Event details</summary>
						<p className="mt-2 whitespace-pre-wrap break-words">
							{event.description}
						</p>
					</details>
				)}
				{event.url && (
					<Button asChild variant="link" className="self-start">
						<a href={event.url} target="_blank" rel="noreferrer">
							View event <ExternalLink data-icon="inline-end" />
						</a>
					</Button>
				)}
			</div>
		</li>
	);
}
