import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const startTaskFormSchema = z.object({
	title: z
		.string()
		.min(1, "Task title is required.")
		.refine((value) => value.trim().length > 0, {
			message: "Task title is required.",
		}),
	projectId: z
		.string()
		.min(1, "Project is required.")
		.refine((value) => value.trim().length > 0, {
			message: "Project is required.",
		}),
	estimatedMinutes: z
		.number()
		.int("Estimated duration must be a whole number.")
		.positive("Estimated duration must be greater than zero.")
		.optional(),
});

export const startTaskFormResolver = zodResolver(startTaskFormSchema);
