"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ActiveTaskSection } from "@/features/project-task-tracker/components/active-task-section";
import { ProjectFilterControls } from "@/features/project-task-tracker/components/project-filter-controls";
import { StartTaskDialogForm } from "@/features/project-task-tracker/components/start-task-dialog-form";
import { TaskHistoryList } from "@/features/project-task-tracker/components/task-history-list";
import { TaskSummaryCards } from "@/features/project-task-tracker/components/task-summary-cards";
import { useTaskTrackerStore } from "@/features/project-task-tracker/hooks/use-task-tracker-store";
import {
	filterTaskHistory,
	getSummaryMetrics,
} from "@/features/project-task-tracker/utils/task-tracker.helpers";

export function ProjectTaskTrackerDashboard() {
	const [nowMs, setNowMs] = useState<number>(() => Date.now());
	const {
		hasHydrated,
		projects,
		tasks,
		activeTask,
		selectedProjectId,
		historyRange,
		createProject,
		startTask,
		endTask,
		setSelectedProjectId,
		setHistoryRange,
	} = useTaskTrackerStore();

	useEffect(() => {
		if (!activeTask) {
			return;
		}

		const timerId = window.setInterval(() => {
			setNowMs(Date.now());
		}, 1000);

		return () => window.clearInterval(timerId);
	}, [activeTask]);

	const summaryMetrics = useMemo(
		() => getSummaryMetrics(tasks, nowMs),
		[tasks, nowMs],
	);

	const filteredHistoryTasks = useMemo(
		() =>
			filterTaskHistory(
				tasks,
				{
					projectId: selectedProjectId,
					range: historyRange,
				},
				nowMs,
			),
		[tasks, selectedProjectId, historyRange, nowMs],
	);

	function handleCreateProject(projectName: string) {
		const result = createProject(projectName);

		if (result.status === "created" && result.project) {
			toast.success("Project created", {
				description: result.project.name,
			});
			return;
		}

		if (result.status === "existing" && result.project) {
			toast.info("Project already exists", {
				description: `${result.project.name} is now selected.`,
			});
			return;
		}

		toast.error("Project name is required");
	}

	function handleEndTask(taskId: string) {
		const result = endTask(taskId);

		if (result.status === "ended" && result.task) {
			toast.success("Task ended", {
				description: result.task.title,
			});
			return;
		}

		toast.error("No running task found");
	}

	if (!hasHydrated) {
		return (
			<section className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Card>
					<CardHeader>
						<CardTitle>Project Task Tracker</CardTitle>
						<CardDescription>Loading saved tracker data…</CardDescription>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Please wait while your projects and tasks are restored.
					</CardContent>
				</Card>
			</section>
		);
	}

	return (
		<section className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-6">
				<header className="rounded-xl bg-linear-to-r from-card via-card to-muted/40 p-6 ring-1 ring-foreground/10">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex flex-col gap-1">
							<h1 className="font-heading text-2xl font-semibold tracking-tight">
								Project Task Tracker
							</h1>
							<p className="text-sm text-muted-foreground">
								Track one active task at a time, compare estimates, and review
								history instantly.
							</p>
						</div>
						<StartTaskDialogForm
							projects={projects}
							defaultProjectId={selectedProjectId}
							isTaskRunning={activeTask !== null}
							onStartTask={startTask}
						/>
					</div>
				</header>

				<TaskSummaryCards metrics={summaryMetrics} />

				<ProjectFilterControls
					projects={projects}
					selectedProjectId={selectedProjectId}
					historyRange={historyRange}
					onProjectFilterChange={setSelectedProjectId}
					onHistoryRangeChange={setHistoryRange}
					onCreateProject={handleCreateProject}
				/>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
					<TaskHistoryList tasks={filteredHistoryTasks} nowMs={nowMs} />
					<ActiveTaskSection
						activeTask={activeTask}
						onEndTask={handleEndTask}
					/>
				</div>
			</div>
		</section>
	);
}
