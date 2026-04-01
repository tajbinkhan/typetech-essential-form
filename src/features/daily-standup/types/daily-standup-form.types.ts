import { z } from "zod";

import { dailyStandupFormSchema } from "@/features/daily-standup/schemas/daily-standup-form.schema";

export type DailyStandupFormValues = z.infer<typeof dailyStandupFormSchema>;
