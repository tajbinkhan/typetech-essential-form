import { DailyStandupForm } from "@/features/daily-standup/components/daily-standup-form";

export default function Home() {
	return (
		<main className="flex flex-1 justify-center bg-muted/20">
			<DailyStandupForm />
		</main>
	);
}
