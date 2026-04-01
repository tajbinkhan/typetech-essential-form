"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
	calculateElapsedSeconds,
	formatDuration,
	formatDurationDelta,
	getEstimateDeltaSeconds,
	getEstimateProgressPercent,
} from "@/features/project-task-tracker/utils/task-tracker.helpers";

interface ActiveTaskTimerProps {
	startedAt: string;
	estimatedMinutes: number | null;
}

export function ActiveTaskTimer({
	startedAt,
	estimatedMinutes,
}: ActiveTaskTimerProps) {
	const [nowMs, setNowMs] = useState<number>(() => Date.now());

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setNowMs(Date.now());
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, []);

	const elapsedSeconds = useMemo(
		() => calculateElapsedSeconds(startedAt, nowMs),
		[startedAt, nowMs],
	);

	const progressPercent = useMemo(
		() => getEstimateProgressPercent(elapsedSeconds, estimatedMinutes),
		[elapsedSeconds, estimatedMinutes],
	);

	const deltaSeconds = useMemo(
		() => getEstimateDeltaSeconds(elapsedSeconds, estimatedMinutes),
		[elapsedSeconds, estimatedMinutes],
	);

	const estimatedSeconds = estimatedMinutes ? estimatedMinutes * 60 : null;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<p className="font-mono text-3xl font-semibold tracking-tight">
					{formatDuration(elapsedSeconds)}
				</p>
				<p className="text-sm text-muted-foreground">Elapsed time</p>
			</div>

			{estimatedSeconds ? (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<span>Estimate {formatDuration(estimatedSeconds)}</span>
						<span>Delta {formatDurationDelta(deltaSeconds)}</span>
					</div>
					<div
						className="h-2 overflow-hidden rounded-full bg-muted"
						role="progressbar"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={progressPercent ?? 0}
					>
						<div
							className={cn(
								"h-full rounded-full transition-all",
								elapsedSeconds > estimatedSeconds
									? "bg-destructive"
									: "bg-primary",
							)}
							style={{ width: `${progressPercent ?? 0}%` }}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}
