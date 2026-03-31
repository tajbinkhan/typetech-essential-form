import {
	DAILY_STANDUP_DATE_SUFFIX,
	DAILY_STANDUP_MONTH_NAMES,
	DAILY_STANDUP_TEMPLATE,
} from "@/features/daily-standup/utils/daily-standup-form.constants";
import type { DailyStandupFormValues } from "@/features/daily-standup/types/daily-standup-form.types";

export function normalizeMembersList(value: string): string {
	return value
		.split(",")
		.map((name) => name.trim())
		.filter(Boolean)
		.join(", ");
}

export function formatDailyStandupDate(value: string): string {
	if (!value) {
		return "";
	}

	const [year, month, day] = value.split("-").map(Number);

	if (!year || !month || !day) {
		return "";
	}

	const monthName = DAILY_STANDUP_MONTH_NAMES[month - 1];

	if (!monthName) {
		return "";
	}

	return `${day}${DAILY_STANDUP_DATE_SUFFIX} ${monthName}, ${year}`;
}

export function buildDailyStandupMessage(
	values: DailyStandupFormValues,
): string {
	const presentMembers = normalizeMembersList(values.presentMembers);
	const absentMembers = normalizeMembersList(values.absentMembers);

	return [
		DAILY_STANDUP_TEMPLATE.heading,
		`${DAILY_STANDUP_TEMPLATE.dateLabel} ${formatDailyStandupDate(values.date)}`,
		`${DAILY_STANDUP_TEMPLATE.hostLabel} ${values.host.trim()}`,
		`${DAILY_STANDUP_TEMPLATE.leadLabel} ${values.lead.trim()}`,
		DAILY_STANDUP_TEMPLATE.separator,
		`${DAILY_STANDUP_TEMPLATE.presentLabel} ${presentMembers}`,
		`${DAILY_STANDUP_TEMPLATE.absentLabel} ${absentMembers}`,
	].join("\n");
}
