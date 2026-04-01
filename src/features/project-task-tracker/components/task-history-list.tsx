import { Badge } from "@/components/ui/badge";
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
	formatDuration,
	formatDurationDelta,
	formatEstimatedMinutes,
	getEstimateDeltaSeconds,
	getTaskDurationSeconds,
} from "@/features/project-task-tracker/utils/task-tracker.helpers";

interface TaskHistoryListProps {
	tasks: TaskEntry[];
	nowMs: number;
}

export function TaskHistoryList({ tasks, nowMs }: TaskHistoryListProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Task History</CardTitle>
				<CardDescription>
					Recent entries, newest first. Use filters above to narrow the view.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{tasks.length === 0 ? (
					<div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
						No tasks match this filter yet. Start a task to build history.
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-215 border-separate border-spacing-0 text-sm">
							<thead>
								<tr className="text-left text-xs text-muted-foreground">
									<th className="border-b px-3 py-2 font-medium">Project</th>
									<th className="border-b px-3 py-2 font-medium">Task</th>
									<th className="border-b px-3 py-2 font-medium">Started</th>
									<th className="border-b px-3 py-2 font-medium">Ended</th>
									<th className="border-b px-3 py-2 font-medium">Estimate</th>
									<th className="border-b px-3 py-2 font-medium">Actual</th>
									<th className="border-b px-3 py-2 font-medium">Status</th>
								</tr>
							</thead>
							<tbody>
								{tasks.map((task) => {
									const actualSeconds = getTaskDurationSeconds(task, nowMs);
									const deltaSeconds = getEstimateDeltaSeconds(
										actualSeconds,
										task.estimatedMinutes,
									);

									return (
										<tr key={task.id} className="align-top">
											<td className="border-b px-3 py-3">{task.projectName}</td>
											<td className="border-b px-3 py-3">{task.title}</td>
											<td className="border-b px-3 py-3">
												{formatDateTime(task.startedAt)}
											</td>
											<td className="border-b px-3 py-3">
												{formatDateTime(task.endedAt)}
											</td>
											<td className="border-b px-3 py-3">
												{formatEstimatedMinutes(task.estimatedMinutes)}
											</td>
											<td className="border-b px-3 py-3">
												<div className="flex flex-col gap-0.5">
													<span>{formatDuration(actualSeconds)}</span>
													<span className="text-xs text-muted-foreground">
														Delta {formatDurationDelta(deltaSeconds)}
													</span>
												</div>
											</td>
											<td className="border-b px-3 py-3">
												<Badge
													variant={
														task.status === "running" ? "default" : "secondary"
													}
												>
													{task.status}
												</Badge>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
