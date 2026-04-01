export type TaskEntryStatus = "running" | "completed";

export type TaskHistoryRange = "today" | "week";

export interface Project {
	id: string;
	name: string;
	createdAt: string;
}

export interface TaskEntry {
	id: string;
	projectId: string;
	projectName: string;
	title: string;
	estimatedMinutes: number | null;
	startedAt: string;
	endedAt: string | null;
	actualSeconds: number | null;
	status: TaskEntryStatus;
	createdAt: string;
	updatedAt: string;
}

export interface TaskTrackerState {
	projects: Project[];
	tasks: TaskEntry[];
	selectedProjectId: string | null;
	historyRange: TaskHistoryRange;
}

export interface TaskSummaryMetrics {
	activeTaskCount: number;
	completedTasksToday: number;
	trackedSecondsToday: number;
	trackedSecondsWeek: number;
}

export interface TaskFilterOptions {
	projectId: string | null;
	range: TaskHistoryRange;
}
