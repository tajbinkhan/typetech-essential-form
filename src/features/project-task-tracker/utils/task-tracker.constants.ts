import type {
	Project,
	TaskHistoryRange,
	TaskTrackerState,
} from "@/features/project-task-tracker/types/task-tracker.types";

export const TASK_TRACKER_STORAGE_KEY = "project-task-tracker-state-v1";

export const TASK_TRACKER_DEFAULT_HISTORY_RANGE: TaskHistoryRange = "today";

export const TASK_TRACKER_MOCK_PROJECTS: Project[] = [
	{
		id: "project-essential-forms",
		name: "Essential Forms",
		createdAt: "2026-03-30T09:00:00.000Z",
	},
	{
		id: "project-client-portal",
		name: "Client Portal",
		createdAt: "2026-03-30T09:05:00.000Z",
	},
	{
		id: "project-internal-ops",
		name: "Internal Ops",
		createdAt: "2026-03-30T09:10:00.000Z",
	},
];

export function createInitialTaskTrackerState(): TaskTrackerState {
	return {
		projects: TASK_TRACKER_MOCK_PROJECTS.map((project) => ({ ...project })),
		tasks: [],
		selectedProjectId: TASK_TRACKER_MOCK_PROJECTS[0]?.id ?? null,
		historyRange: TASK_TRACKER_DEFAULT_HISTORY_RANGE,
	};
}
