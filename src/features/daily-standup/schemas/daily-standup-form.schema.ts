import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { normalizeMembersList } from "@/features/daily-standup/utils/daily-standup-form.helpers";

export const dailyStandupFormSchema = z.object({
	date: z.string().min(1, "Date is required."),
	host: z
		.string()
		.min(1, "Host is required.")
		.refine((value) => value.trim().length > 0, {
			message: "Host is required.",
		}),
	lead: z
		.string()
		.min(1, "Lead is required.")
		.refine((value) => value.trim().length > 0, {
			message: "Lead is required.",
		}),
	presentMembers: z
		.string()
		.min(1, "Present members are required.")
		.refine((value) => normalizeMembersList(value).length > 0, {
			message: "Add at least one present member.",
		}),
	absentMembers: z.string(),
});

export const dailyStandupFormResolver = zodResolver(dailyStandupFormSchema);
