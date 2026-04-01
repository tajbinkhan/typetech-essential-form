import { z } from "zod";

import { startTaskFormSchema } from "@/features/project-task-tracker/schemas/start-task-form.schema";

export type StartTaskFormValues = z.infer<typeof startTaskFormSchema>;
