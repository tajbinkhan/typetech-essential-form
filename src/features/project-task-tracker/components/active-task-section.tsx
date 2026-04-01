import { StopCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { TaskEntry } from "@/features/project-task-tracker/types/task-tracker.types";
import {
	formatDateTime,
	formatEstimatedMinutes,
} from "@/features/project-task-tracker/utils/task-tracker.helpers";
import { ActiveTaskTimer } from "@/features/project-task-tracker/components/active-task-timer";

interface ActiveTaskSectionProps {
	activeTask: TaskEntry | null;
	onEndTask: (taskId: string) => void;
}

export function ActiveTaskSection({
	activeTask,
	onEndTask,
}: ActiveTaskSectionProps) {
	if (!activeTask) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Active Task</CardTitle>
					<CardDescription>
						No task is running right now. Start one to begin tracking.
					</CardDescription>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					Your running task will appear here with a live timer and end control.
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="ring-primary/20">
			<CardHeader className="gap-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex flex-col gap-1">
						<CardTitle>{activeTask.title}</CardTitle>
						<CardDescription>{activeTask.projectName}</CardDescription>
					</div>
					<Badge>Running</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				<ActiveTaskTimer
					startedAt={activeTask.startedAt}
					estimatedMinutes={activeTask.estimatedMinutes}
				/>

				<div className="rounded-lg border bg-muted/30 p-3">
					<dl className="flex flex-col gap-2 text-sm">
						<div className="flex items-center justify-between gap-3">
							<dt className="text-muted-foreground">Started</dt>
							<dd>{formatDateTime(activeTask.startedAt)}</dd>
						</div>
						<div className="flex items-center justify-between gap-3">
							<dt className="text-muted-foreground">Ended</dt>
							<dd>Not ended yet</dd>
						</div>
						<div className="flex items-center justify-between gap-3">
							<dt className="text-muted-foreground">Estimated</dt>
							<dd>{formatEstimatedMinutes(activeTask.estimatedMinutes)}</dd>
						</div>
					</dl>
				</div>

				<Button
					type="button"
					variant="destructive"
					onClick={() => onEndTask(activeTask.id)}
				>
					<StopCircleIcon data-icon="inline-start" aria-hidden="true" />
					End Task
				</Button>
			</CardContent>
		</Card>
	);
}
