"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { startTaskFormResolver } from "@/features/project-task-tracker/schemas/start-task-form.schema";
import type { StartTaskFormValues } from "@/features/project-task-tracker/types/start-task-form.types";
import type { Project } from "@/features/project-task-tracker/types/task-tracker.types";
import type { StartTaskResult } from "@/features/project-task-tracker/hooks/use-task-tracker-store";

interface StartTaskDialogFormProps {
	projects: Project[];
	defaultProjectId: string | null;
	isTaskRunning: boolean;
	onStartTask: (values: StartTaskFormValues) => StartTaskResult;
}

export function StartTaskDialogForm({
	projects,
	defaultProjectId,
	isTaskRunning,
	onStartTask,
}: StartTaskDialogFormProps) {
	const [open, setOpen] = useState(false);
	const hasProjects = projects.length > 0;

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<StartTaskFormValues>({
		resolver: startTaskFormResolver,
		defaultValues: {
			title: "",
			projectId: defaultProjectId ?? projects[0]?.id ?? "",
			estimatedMinutes: undefined,
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (!open) {
			return;
		}

		reset({
			title: "",
			projectId: defaultProjectId ?? projects[0]?.id ?? "",
			estimatedMinutes: undefined,
		});
	}, [defaultProjectId, open, projects, reset]);

	const triggerLabel = isTaskRunning
		? "Task Running"
		: hasProjects
			? "Start My Task"
			: "Create a Project First";

	const handleStartTask = handleSubmit((values) => {
		const result = onStartTask(values);

		if (result.status === "started" && result.task) {
			toast.success("Task started", {
				description: `${result.task.projectName} • ${result.task.title}`,
			});
			setOpen(false);
			reset({
				title: "",
				projectId: values.projectId,
				estimatedMinutes: undefined,
			});
			return;
		}

		if (result.status === "active-task-exists") {
			toast.error("A task is already running", {
				description: "End the active task before starting a new one.",
			});
			return;
		}

		toast.error("Project not found", {
			description: "Select a valid project and try again.",
		});
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button type="button" disabled={isTaskRunning || !hasProjects}>
					<PlayIcon data-icon="inline-start" aria-hidden="true" />
					{triggerLabel}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Start My Task</DialogTitle>
					<DialogDescription>
						Capture what you are working on and start tracking instantly.
					</DialogDescription>
				</DialogHeader>

				<form
					noValidate
					className="flex flex-col gap-4"
					onSubmit={handleStartTask}
				>
					<FieldGroup>
						<Controller
							control={control}
							name="title"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="start-task-title">Task title</FieldLabel>
									<Input
										id="start-task-title"
										placeholder="Write release notes"
										{...field}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid ? (
										<FieldError errors={[fieldState.error]} />
									) : null}
								</Field>
							)}
						/>

						<Controller
							control={control}
							name="projectId"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="start-task-project">Project</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											id="start-task-project"
											aria-invalid={fieldState.invalid}
										>
											<SelectValue placeholder="Select project" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{projects.map((project) => (
													<SelectItem key={project.id} value={project.id}>
														{project.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{fieldState.invalid ? (
										<FieldError errors={[fieldState.error]} />
									) : null}
								</Field>
							)}
						/>

						<Controller
							control={control}
							name="estimatedMinutes"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="start-task-estimated-minutes">
										Estimated minutes (optional)
									</FieldLabel>
									<Input
										id="start-task-estimated-minutes"
										type="number"
										inputMode="numeric"
										min={1}
										step={1}
										placeholder="45"
										value={field.value ?? ""}
										onChange={(event) => {
											const value = event.target.value;
											field.onChange(value === "" ? undefined : Number(value));
										}}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid ? (
										<FieldError errors={[fieldState.error]} />
									) : null}
								</Field>
							)}
						/>
					</FieldGroup>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							Start Task
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
