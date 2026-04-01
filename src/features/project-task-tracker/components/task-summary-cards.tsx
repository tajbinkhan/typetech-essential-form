import {
	ActivityIcon,
	CheckCircle2Icon,
	Clock3Icon,
	TimerIcon,
} from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { TaskSummaryMetrics } from "@/features/project-task-tracker/types/task-tracker.types";
import { formatDuration } from "@/features/project-task-tracker/utils/task-tracker.helpers";

interface TaskSummaryCardsProps {
	metrics: TaskSummaryMetrics;
}

export function TaskSummaryCards({ metrics }: TaskSummaryCardsProps) {
	const items = [
		{
			label: "Active Tasks",
			value: String(metrics.activeTaskCount),
			description: "Only one task can run at a time.",
			icon: ActivityIcon,
		},
		{
			label: "Completed Today",
			value: String(metrics.completedTasksToday),
			description: "Tasks finished since midnight.",
			icon: CheckCircle2Icon,
		},
		{
			label: "Tracked Today",
			value: formatDuration(metrics.trackedSecondsToday),
			description: "Total logged duration for today.",
			icon: Clock3Icon,
		},
		{
			label: "Tracked This Week",
			value: formatDuration(metrics.trackedSecondsWeek),
			description: "Total logged duration this week.",
			icon: TimerIcon,
		},
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{items.map((item) => {
				const Icon = item.icon;

				return (
					<Card key={item.label} size="sm">
						<CardHeader className="flex flex-row items-start justify-between gap-3">
							<div className="flex flex-col gap-1">
								<CardDescription>{item.label}</CardDescription>
								<CardTitle>{item.value}</CardTitle>
							</div>
							<Icon className="text-muted-foreground" aria-hidden="true" />
						</CardHeader>
						<CardContent className="pt-0 text-xs text-muted-foreground">
							{item.description}
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
