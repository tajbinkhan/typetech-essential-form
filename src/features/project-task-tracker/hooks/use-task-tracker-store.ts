"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createTaskTrackerRepository } from "@/features/project-task-tracker/services/task-tracker-repository";
import type { StartTaskFormValues } from "@/features/project-task-tracker/types/start-task-form.types";
import type {
	Project,
	TaskEntry,
	TaskHistoryRange,
	TaskTrackerState,
} from "@/features/project-task-tracker/types/task-tracker.types";
import { createInitialTaskTrackerState } from "@/features/project-task-tracker/utils/task-tracker.constants";
import {
	calculateElapsedSeconds,
	sortTasksNewestFirst,
} from "@/features/project-task-tracker/utils/task-tracker.helpers";

export interface CreateProjectResult {
	status: "created" | "existing" | "invalid";
	project: Project | null;
}

export interface StartTaskResult {
	status: "started" | "active-task-exists" | "project-not-found";
	task: TaskEntry | null;
}

export interface EndTaskResult {
	status: "ended" | "not-found";
	task: TaskEntry | null;
}

function createEntityId(prefix: string): string {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `${prefix}-${crypto.randomUUID()}`;
	}

	return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function useTaskTrackerStore() {
	const repositoryRef = useRef(createTaskTrackerRepository());
	const [state, setState] = useState<TaskTrackerState>(() =>
		createInitialTaskTrackerState(),
	);
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setState(repositoryRef.current.loadState());
		setHasHydrated(true);
	}, []);

	useEffect(() => {
		if (!hasHydrated) {
			return;
		}

		repositoryRef.current.saveState(state);
	}, [hasHydrated, state]);

	const projects = useMemo(
		() => [...state.projects].sort((a, b) => a.name.localeCompare(b.name)),
		[state.projects],
	);

	const tasks = useMemo(() => sortTasksNewestFirst(state.tasks), [state.tasks]);

	const activeTask = useMemo(
		() => tasks.find((task) => task.status === "running") ?? null,
		[tasks],
	);

	const createProject = useCallback(
		(projectName: string): CreateProjectResult => {
			const trimmedName = projectName.trim();
			if (!trimmedName) {
				return {
					status: "invalid",
					project: null,
				};
			}

			let result: CreateProjectResult = {
				status: "invalid",
				project: null,
			};

			setState((previousState) => {
				const existing = previousState.projects.find(
					(project) => project.name.toLowerCase() === trimmedName.toLowerCase(),
				);

				if (existing) {
					result = {
						status: "existing",
						project: existing,
					};

					return {
						...previousState,
						selectedProjectId: existing.id,
					};
				}

				const nowIso = new Date().toISOString();
				const nextProject: Project = {
					id: createEntityId("project"),
					name: trimmedName,
					createdAt: nowIso,
				};

				result = {
					status: "created",
					project: nextProject,
				};

				return {
					...previousState,
					projects: [nextProject, ...previousState.projects],
					selectedProjectId: nextProject.id,
				};
			});

			return result;
		},
		[],
	);

	const startTask = useCallback(
		(values: StartTaskFormValues): StartTaskResult => {
			let result: StartTaskResult = {
				status: "project-not-found",
				task: null,
			};

			setState((previousState) => {
				const hasRunningTask = previousState.tasks.some(
					(task) => task.status === "running",
				);
				if (hasRunningTask) {
					result = {
						status: "active-task-exists",
						task: null,
					};
					return previousState;
				}

				const project = previousState.projects.find(
					(item) => item.id === values.projectId,
				);
				if (!project) {
					result = {
						status: "project-not-found",
						task: null,
					};
					return previousState;
				}

				const nowIso = new Date().toISOString();
				const nextTask: TaskEntry = {
					id: createEntityId("task"),
					projectId: project.id,
					projectName: project.name,
					title: values.title.trim(),
					estimatedMinutes: values.estimatedMinutes ?? null,
					startedAt: nowIso,
					endedAt: null,
					actualSeconds: null,
					status: "running",
					createdAt: nowIso,
					updatedAt: nowIso,
				};

				result = {
					status: "started",
					task: nextTask,
				};

				return {
					...previousState,
					tasks: [nextTask, ...previousState.tasks],
					selectedProjectId: project.id,
				};
			});

			return result;
		},
		[],
	);

	const endTask = useCallback((taskId?: string): EndTaskResult => {
		let result: EndTaskResult = {
			status: "not-found",
			task: null,
		};

		setState((previousState) => {
			const runningTask = previousState.tasks.find((task) => {
				if (task.status !== "running") {
					return false;
				}

				if (!taskId) {
					return true;
				}

				return task.id === taskId;
			});

			if (!runningTask) {
				result = {
					status: "not-found",
					task: null,
				};
				return previousState;
			}

			const nowIso = new Date().toISOString();
			const actualSeconds = calculateElapsedSeconds(
				runningTask.startedAt,
				Date.parse(nowIso),
			);

			const completedTask: TaskEntry = {
				...runningTask,
				endedAt: nowIso,
				actualSeconds,
				status: "completed",
				updatedAt: nowIso,
			};

			result = {
				status: "ended",
				task: completedTask,
			};

			return {
				...previousState,
				tasks: previousState.tasks.map((task) =>
					task.id === completedTask.id ? completedTask : task,
				),
			};
		});

		return result;
	}, []);

	const setSelectedProjectId = useCallback((projectId: string | null) => {
		setState((previousState) => {
			if (!projectId) {
				return {
					...previousState,
					selectedProjectId: null,
				};
			}

			const exists = previousState.projects.some(
				(project) => project.id === projectId,
			);

			return {
				...previousState,
				selectedProjectId: exists ? projectId : null,
			};
		});
	}, []);

	const setHistoryRange = useCallback((range: TaskHistoryRange) => {
		setState((previousState) => ({
			...previousState,
			historyRange: range,
		}));
	}, []);

	return {
		hasHydrated,
		projects,
		tasks,
		activeTask,
		selectedProjectId: state.selectedProjectId,
		historyRange: state.historyRange,
		createProject,
		startTask,
		endTask,
		setSelectedProjectId,
		setHistoryRange,
	};
}
