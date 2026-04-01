import { taskTrackerStateStorageSchema } from "@/features/project-task-tracker/schemas/task-tracker-storage.schema";
import type {
	Project,
	TaskEntry,
	TaskTrackerState,
} from "@/features/project-task-tracker/types/task-tracker.types";
import {
	TASK_TRACKER_STORAGE_KEY,
	createInitialTaskTrackerState,
} from "@/features/project-task-tracker/utils/task-tracker.constants";
import {
	calculateElapsedSeconds,
	sortTasksNewestFirst,
} from "@/features/project-task-tracker/utils/task-tracker.helpers";

export interface TaskTrackerRepository {
	loadState(): TaskTrackerState;
	saveState(state: TaskTrackerState): void;
}

function normalizeProjects(projects: Project[]): Project[] {
	const projectMap = new Map<string, Project>();

	for (const project of projects) {
		const normalizedName = project.name.trim();
		if (!normalizedName) {
			continue;
		}

		projectMap.set(project.id, {
			...project,
			name: normalizedName,
		});
	}

	return [...projectMap.values()];
}

function normalizeTasks(tasks: TaskEntry[]): TaskEntry[] {
	const sortedTasks = sortTasksNewestFirst(tasks);
	const runningTasks = sortedTasks.filter((task) => task.status === "running");
	const activeRunningTaskId = runningTasks[0]?.id;
	const normalizedAt = new Date().toISOString();

	return sortedTasks.map((task) => {
		if (task.status === "running" && task.id !== activeRunningTaskId) {
			return {
				...task,
				endedAt: task.startedAt,
				actualSeconds: 0,
				status: "completed",
				updatedAt: normalizedAt,
			};
		}

		if (task.status === "completed") {
			const endedAt = task.endedAt ?? task.startedAt;
			const actualSeconds =
				typeof task.actualSeconds === "number"
					? Math.max(0, task.actualSeconds)
					: calculateElapsedSeconds(task.startedAt, Date.parse(endedAt));

			return {
				...task,
				endedAt,
				actualSeconds,
			};
		}

		return task;
	});
}

function normalizeState(rawState: TaskTrackerState): TaskTrackerState {
	const projects = normalizeProjects(rawState.projects);
	const tasks = normalizeTasks(rawState.tasks);

	const selectedProjectExists = projects.some(
		(project) => project.id === rawState.selectedProjectId,
	);

	return {
		projects,
		tasks,
		selectedProjectId: selectedProjectExists
			? rawState.selectedProjectId
			: null,
		historyRange: rawState.historyRange,
	};
}

class LocalStorageTaskTrackerRepository implements TaskTrackerRepository {
	loadState(): TaskTrackerState {
		if (typeof window === "undefined") {
			return createInitialTaskTrackerState();
		}

		const stored = window.localStorage.getItem(TASK_TRACKER_STORAGE_KEY);
		if (!stored) {
			return createInitialTaskTrackerState();
		}

		try {
			const parsed = JSON.parse(stored);
			const result = taskTrackerStateStorageSchema.safeParse(parsed);

			if (!result.success) {
				window.localStorage.removeItem(TASK_TRACKER_STORAGE_KEY);
				return createInitialTaskTrackerState();
			}

			return normalizeState(result.data);
		} catch {
			window.localStorage.removeItem(TASK_TRACKER_STORAGE_KEY);
			return createInitialTaskTrackerState();
		}
	}

	saveState(state: TaskTrackerState): void {
		if (typeof window === "undefined") {
			return;
		}

		window.localStorage.setItem(
			TASK_TRACKER_STORAGE_KEY,
			JSON.stringify(state),
		);
	}
}

export function createTaskTrackerRepository(): TaskTrackerRepository {
	return new LocalStorageTaskTrackerRepository();
}
