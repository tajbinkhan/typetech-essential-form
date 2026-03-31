import {
	DAILY_STANDUP_DATE_SUFFIX,
	DAILY_STANDUP_MONTH_NAMES,
	DAILY_STANDUP_TEMPLATE,
} from "@/features/daily-standup/utils/daily-standup-form.constants";
import type { DailyStandupFormValues } from "@/features/daily-standup/types/daily-standup-form.types";

export function formatDailyStandupDate(date: Date): string {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
		return "";
	}

	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	const monthName = DAILY_STANDUP_MONTH_NAMES[month];

	if (!monthName) {
		return "";
	}

	return `${day}${DAILY_STANDUP_DATE_SUFFIX} ${monthName}, ${year}`;
}

export function buildDailyStandupMessage(
	values: DailyStandupFormValues,
	absentMembers: string[],
): string {
	const presentMembers = values.presentMembers.join(", ");
	const hasAbsentMembers = absentMembers.length > 0;

	const lines = [
		DAILY_STANDUP_TEMPLATE.heading,
		`${DAILY_STANDUP_TEMPLATE.dateLabel} ${formatDailyStandupDate(values.date)}`,
		`${DAILY_STANDUP_TEMPLATE.hostLabel} ${values.host.trim()}`,
		`${DAILY_STANDUP_TEMPLATE.leadLabel} ${values.lead.trim()}`,
		DAILY_STANDUP_TEMPLATE.separator,
		`${DAILY_STANDUP_TEMPLATE.presentLabel} ${presentMembers}`,
	];

	if (hasAbsentMembers) {
		const absentMembersStr = absentMembers.join(", ");
		lines.push(`${DAILY_STANDUP_TEMPLATE.absentLabel} ${absentMembersStr}`);
	}

	return lines.join("\n");
}
