import {
	DAILY_STANDUP_DEFAULT_VALUES,
	DAILY_STANDUP_TEAM_MEMBERS,
	DAILY_STANDUP_TEMPLATE,
} from "@/features/daily-standup/utils/daily-standup-form.constants";
import { dailyStandupFormSchema } from "@/features/daily-standup/schemas/daily-standup-form.schema";
import type { DailyStandupFormValues } from "@/features/daily-standup/types/daily-standup-form.types";

type PersistedDailyStandupFormValues = Omit<DailyStandupFormValues, "date"> & {
	date: string;
};

function isKnownTeamMember(value: string): boolean {
	return DAILY_STANDUP_TEAM_MEMBERS.includes(
		value as (typeof DAILY_STANDUP_TEAM_MEMBERS)[number],
	);
}

export function normalizeDailyStandupFormValues(
	values: DailyStandupFormValues,
): DailyStandupFormValues {
	const normalizedHost = values.host.trim();
	const normalizedLead = values.lead.trim();
	const normalizedPresentMembers = values.presentMembers.filter((member) =>
		isKnownTeamMember(member.trim()),
	);

	return {
		date: values.date,
		host: isKnownTeamMember(normalizedHost)
			? normalizedHost
			: DAILY_STANDUP_DEFAULT_VALUES.host,
		lead: isKnownTeamMember(normalizedLead)
			? normalizedLead
			: DAILY_STANDUP_DEFAULT_VALUES.lead,
		presentMembers:
			normalizedPresentMembers.length > 0
				? normalizedPresentMembers
				: [...DAILY_STANDUP_DEFAULT_VALUES.presentMembers],
	};
}

function getOrdinalSuffix(day: number): string {
	if (day >= 11 && day <= 13) {
		return "th";
	}

	const remainder = day % 10;
	if (remainder === 1) {
		return "st";
	}
	if (remainder === 2) {
		return "nd";
	}
	if (remainder === 3) {
		return "rd";
	}

	return "th";
}

export function formatDailyStandupDate(date: Date): string {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
		return "";
	}

	const day = date.getDate();
	const monthName = new Intl.DateTimeFormat("en-US", {
		month: "long",
	}).format(date);

	return `${day}${getOrdinalSuffix(day)} ${monthName}, ${date.getFullYear()}`;
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

export function serializeDailyStandupFormValues(
	values: DailyStandupFormValues,
): string {
	const payload: PersistedDailyStandupFormValues = {
		...values,
		date: values.date.toISOString(),
	};

	return JSON.stringify(payload);
}

export function parseDailyStandupFormValues(
	rawValue: string,
): DailyStandupFormValues | null {
	try {
		const parsed = JSON.parse(
			rawValue,
		) as Partial<PersistedDailyStandupFormValues>;
		if (!parsed || typeof parsed.date !== "string") {
			return null;
		}

		const candidate = {
			...parsed,
			date: new Date(parsed.date),
		};

		const result = dailyStandupFormSchema.safeParse(candidate);
		return result.success ? result.data : null;
	} catch {
		return null;
	}
}
