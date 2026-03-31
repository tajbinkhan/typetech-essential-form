import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const dailyStandupFormSchema = z.object({
	date: z.date({
		message: "Date is required.",
	}),
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
		.array(z.string())
		.min(1, "Select at least one present member."),
});

export const dailyStandupFormResolver = zodResolver(dailyStandupFormSchema);
