import { format, isSameDay, isSameWeek, parseISO } from "date-fns";

import type {
	TaskEntry,
	TaskFilterOptions,
	TaskHistoryRange,
	TaskSummaryMetrics,
} from "@/features/project-task-tracker/types/task-tracker.types";

function parseIsoDate(value: string | null | undefined): Date | null {
	if (!value) {
		return null;
	}

	const parsed = parseISO(value);
	if (isNaN(parsed.getTime())) {
		return null;
	}

	return parsed;
}

function isTaskWithinRange(
	task: TaskEntry,
	range: TaskHistoryRange,
	now: Date,
): boolean {
	const startedAt = parseIsoDate(task.startedAt);
	if (!startedAt) {
		return false;
	}

	if (range === "today") {
		return isSameDay(startedAt, now);
	}

	return isSameWeek(startedAt, now, { weekStartsOn: 1 });
}

export function calculateElapsedSeconds(
	startedAt: string,
	nowMs: number = Date.now(),
): number {
	const startedAtDate = parseIsoDate(startedAt);
	if (!startedAtDate) {
		return 0;
	}

	return Math.max(0, Math.floor((nowMs - startedAtDate.getTime()) / 1000));
}

export function getTaskDurationSeconds(
	task: TaskEntry,
	nowMs: number = Date.now(),
): number {
	if (task.status === "completed") {
		if (typeof task.actualSeconds === "number") {
			return Math.max(0, task.actualSeconds);
		}

		const endedAtDate = parseIsoDate(task.endedAt);
		if (!endedAtDate) {
			return 0;
		}

		return calculateElapsedSeconds(task.startedAt, endedAtDate.getTime());
	}

	return calculateElapsedSeconds(task.startedAt, nowMs);
}

export function formatDuration(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds <= 0) {
		return "0s";
	}

	const totalSeconds = Math.floor(seconds);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const remainingSeconds = totalSeconds % 60;

	const parts: string[] = [];

	if (hours > 0) {
		parts.push(`${hours}h`);
	}

	if (minutes > 0 || hours > 0) {
		parts.push(`${minutes}m`);
	}

	parts.push(`${remainingSeconds}s`);

	return parts.join(" ");
}

export function formatDateTime(value: string | null): string {
	const date = parseIsoDate(value);
	if (!date) {
		return "—";
	}

	return format(date, "MMM d, yyyy h:mm:ss a");
}

export function formatEstimatedMinutes(minutes: number | null): string {
	if (minutes === null) {
		return "—";
	}

	return formatDuration(minutes * 60);
}

export function getEstimateDeltaSeconds(
	actualSeconds: number,
	estimatedMinutes: number | null,
): number | null {
	if (estimatedMinutes === null) {
		return null;
	}

	return actualSeconds - estimatedMinutes * 60;
}

export function formatDurationDelta(deltaSeconds: number | null): string {
	if (deltaSeconds === null) {
		return "—";
	}

	if (deltaSeconds === 0) {
		return "On estimate";
	}

	const prefix = deltaSeconds > 0 ? "+" : "-";
	return `${prefix}${formatDuration(Math.abs(deltaSeconds))}`;
}

export function getEstimateProgressPercent(
	elapsedSeconds: number,
	estimatedMinutes: number | null,
): number | null {
	if (estimatedMinutes === null || estimatedMinutes <= 0) {
		return null;
	}

	const estimatedSeconds = estimatedMinutes * 60;
	return Math.min(100, Math.round((elapsedSeconds / estimatedSeconds) * 100));
}

export function sortTasksNewestFirst(tasks: TaskEntry[]): TaskEntry[] {
	return [...tasks].sort((a, b) => {
		const bTime = parseIsoDate(b.startedAt)?.getTime() ?? 0;
		const aTime = parseIsoDate(a.startedAt)?.getTime() ?? 0;
		return bTime - aTime;
	});
}

export function filterTaskHistory(
	tasks: TaskEntry[],
	options: TaskFilterOptions,
	nowMs: number = Date.now(),
): TaskEntry[] {
	const now = new Date(nowMs);

	return tasks.filter((task) => {
		if (options.projectId && task.projectId !== options.projectId) {
			return false;
		}

		return isTaskWithinRange(task, options.range, now);
	});
}

export function getSummaryMetrics(
	tasks: TaskEntry[],
	nowMs: number = Date.now(),
): TaskSummaryMetrics {
	const now = new Date(nowMs);

	const activeTaskCount = tasks.filter(
		(task) => task.status === "running",
	).length;

	const completedTasksToday = tasks.filter((task) => {
		if (task.status !== "completed") {
			return false;
		}

		const endedAt = parseIsoDate(task.endedAt);
		if (!endedAt) {
			return false;
		}

		return isSameDay(endedAt, now);
	}).length;

	const trackedSecondsToday = tasks.reduce((total, task) => {
		if (!isTaskWithinRange(task, "today", now)) {
			return total;
		}

		return total + getTaskDurationSeconds(task, nowMs);
	}, 0);

	const trackedSecondsWeek = tasks.reduce((total, task) => {
		if (!isTaskWithinRange(task, "week", now)) {
			return total;
		}

		return total + getTaskDurationSeconds(task, nowMs);
	}, 0);

	return {
		activeTaskCount,
		completedTasksToday,
		trackedSecondsToday,
		trackedSecondsWeek,
	};
}
