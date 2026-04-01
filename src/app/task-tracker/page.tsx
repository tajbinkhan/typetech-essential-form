import { ProjectTaskTrackerDashboard } from "@/features/project-task-tracker/components/project-task-tracker-dashboard";

export default function TaskTrackerPage() {
	return (
		<main className="flex flex-1 justify-center bg-muted/20">
			<ProjectTaskTrackerDashboard />
		</main>
	);
}
