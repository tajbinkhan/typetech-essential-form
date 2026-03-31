export const DAILY_STANDUP_FORM_TITLE = "Daily Standup Meeting Update";

export const DAILY_STANDUP_FORM_DESCRIPTION =
	"Fill in the fields to generate a ready-to-send WhatsApp update.";

export const DAILY_STANDUP_PREVIEW_TITLE = "WhatsApp Preview";

export const DAILY_STANDUP_PREVIEW_DESCRIPTION =
	"Preserves the exact spacing, emojis, and line breaks.";

export const DAILY_STANDUP_DEFAULT_PRESENT_MEMBERS =
	"Hasan, Remo, Joshio, Tonmoy, Sohag, Sangram, Evan, Jayedi, Rifat";

export const DAILY_STANDUP_DEFAULT_VALUES = {
	date: new Date().toISOString().slice(0, 10),
	host: "Saifur Rahman",
	lead: "Sangram",
	presentMembers: DAILY_STANDUP_DEFAULT_PRESENT_MEMBERS,
	absentMembers: "",
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

export const DAILY_STANDUP_FIELD_LABELS = {
	date: "Date",
	host: "Host",
	lead: "Lead",
	presentMembers: "Present members",
	absentMembers: "Absent members",
} as const;

export const DAILY_STANDUP_PLACEHOLDERS = {
	host: "Saifur Rahman",
	lead: "Sangram",
	presentMembers: "Hasan, Remo, Joshio",
	absentMembers: "Optional",
} as const;

export const DAILY_STANDUP_COPY_LABELS = {
	idle: "Copy to clipboard",
	copied: "Copied",
	error: "Clipboard access failed. Please copy manually.",
} as const;
