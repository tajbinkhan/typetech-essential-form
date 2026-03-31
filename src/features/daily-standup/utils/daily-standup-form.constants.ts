export const DAILY_STANDUP_TEAM_MEMBERS = [
	"Hasan",
	"Remo",
	"Joshio",
	"Tonmoy",
	"Sohag",
	"Sangram",
	"Evan",
	"Jayedi",
	"Rifat",
] as const;

export const DAILY_STANDUP_HOSTS = [
	"Saifur Rahman",
	"Hasan",
	"Remo",
	"Joshio",
] as const;

export const DAILY_STANDUP_LEADS = [
	"Sangram",
	"Evan",
	"Tonmoy",
	"Hasan",
] as const;

export const DAILY_STANDUP_FORM_TITLE = "Daily Standup Meeting Update";

export const DAILY_STANDUP_FORM_DESCRIPTION =
	"Fill in the fields to generate a ready-to-send WhatsApp update.";

export const DAILY_STANDUP_PREVIEW_TITLE = "WhatsApp Preview";

export const DAILY_STANDUP_PREVIEW_DESCRIPTION =
	"Preserves the exact spacing, emojis, and line breaks.";

export const DAILY_STANDUP_DEFAULT_PRESENT_MEMBERS = [
	"Hasan",
	"Remo",
	"Joshio",
	"Tonmoy",
	"Sohag",
	"Sangram",
	"Evan",
	"Jayedi",
	"Rifat",
];

export const DAILY_STANDUP_DEFAULT_VALUES = {
	date: new Date(),
	host: "Saifur Rahman",
	lead: "Sangram",
	presentMembers: DAILY_STANDUP_DEFAULT_PRESENT_MEMBERS,
};

export const DAILY_STANDUP_MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;

export const DAILY_STANDUP_DATE_SUFFIX = "th";

export const DAILY_STANDUP_TEMPLATE = {
	heading: "📢 DAILY STANDUP MEETING UPDATE",
	dateLabel: "📅 Date:",
	hostLabel: "👤 Host:",
	leadLabel: "🧑‍💼 Lead:",
	separator: "———————————————————————————",
	presentLabel: "✅ Present:",
	absentLabel: "❌ Absent:",
} as const;

export const DAILY_STANDUP_PLACEHOLDERS = {
	host: "Select host",
	lead: "Select lead",
	presentMembers: "Select present members",
} as const;

export const DAILY_STANDUP_COPY_LABELS = {
	idle: "Copy to clipboard",
	copied: "Copied",
	error: "Clipboard access failed. Please copy manually.",
} as const;
