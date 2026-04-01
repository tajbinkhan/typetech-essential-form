import { z } from "zod";

export const taskEntryStatusSchema = z.enum(["running", "completed"]);
export const taskHistoryRangeSchema = z.enum(["today", "week"]);

export const projectStorageSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	createdAt: z.string().min(1),
});

export const taskEntryStorageSchema = z
	.object({
		id: z.string().min(1),
		projectId: z.string().min(1),
		projectName: z.string().min(1),
		title: z.string().min(1),
		estimatedMinutes: z.number().int().positive().nullable(),
		startedAt: z.string().min(1),
		endedAt: z.string().min(1).nullable(),
		actualSeconds: z.number().int().nonnegative().nullable(),
		status: taskEntryStatusSchema,
		createdAt: z.string().min(1),
		updatedAt: z.string().min(1),
	})
	.superRefine((task, context) => {
		if (task.status === "running") {
			if (task.endedAt !== null || task.actualSeconds !== null) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Running tasks must not include endedAt or actualSeconds values.",
				});
			}
			return;
		}

		if (task.endedAt === null || task.actualSeconds === null) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Completed tasks must include endedAt and actualSeconds values.",
			});
		}
	});

export const taskTrackerStateStorageSchema = z.object({
	projects: z.array(projectStorageSchema),
	tasks: z.array(taskEntryStorageSchema),
	selectedProjectId: z.string().nullable(),
	historyRange: taskHistoryRangeSchema,
});
