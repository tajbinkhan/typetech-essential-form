"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	Project,
	TaskHistoryRange,
} from "@/features/project-task-tracker/types/task-tracker.types";

interface ProjectFilterControlsProps {
	projects: Project[];
	selectedProjectId: string | null;
	historyRange: TaskHistoryRange;
	onProjectFilterChange: (projectId: string | null) => void;
	onHistoryRangeChange: (range: TaskHistoryRange) => void;
	onCreateProject: (projectName: string) => void;
}

export function ProjectFilterControls({
	projects,
	selectedProjectId,
	historyRange,
	onProjectFilterChange,
	onHistoryRangeChange,
	onCreateProject,
}: ProjectFilterControlsProps) {
	const [newProjectName, setNewProjectName] = useState("");

	function handleCreateProject(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmedName = newProjectName.trim();
		if (!trimmedName) {
			return;
		}

		onCreateProject(trimmedName);
		setNewProjectName("");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Projects and Filters</CardTitle>
				<CardDescription>
					Create projects, filter task history, and switch period views.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4 lg:grid-cols-3">
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium" htmlFor="project-filter">
						Project Filter
					</label>
					<Select
						value={selectedProjectId ?? "all-projects"}
						onValueChange={(value) =>
							onProjectFilterChange(value === "all-projects" ? null : value)
						}
					>
						<SelectTrigger id="project-filter">
							<SelectValue placeholder="All projects" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all-projects">All projects</SelectItem>
								{projects.map((project) => (
									<SelectItem key={project.id} value={project.id}>
										{project.name}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<form className="flex flex-col gap-2" onSubmit={handleCreateProject}>
					<label className="text-sm font-medium" htmlFor="new-project-name">
						Create Project
					</label>
					<div className="flex gap-2">
						<Input
							id="new-project-name"
							value={newProjectName}
							onChange={(event) => setNewProjectName(event.target.value)}
							placeholder="Project name"
						/>
						<Button type="submit" variant="outline">
							Create
						</Button>
					</div>
				</form>

				<div className="flex flex-col gap-2">
					<p className="text-sm font-medium">History Range</p>
					<div className="inline-flex w-fit rounded-lg border bg-muted/40 p-1">
						<Button
							type="button"
							size="sm"
							variant={historyRange === "today" ? "secondary" : "ghost"}
							onClick={() => onHistoryRangeChange("today")}
						>
							Today
						</Button>
						<Button
							type="button"
							size="sm"
							variant={historyRange === "week" ? "secondary" : "ghost"}
							onClick={() => onHistoryRangeChange("week")}
						>
							This Week
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
