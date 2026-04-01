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

export const DAILY_STANDUP_DEFAULT_PRESENT_MEMBERS = [
	...DAILY_STANDUP_TEAM_MEMBERS,
];

export const DAILY_STANDUP_DEFAULT_VALUES = {
	date: new Date(),
	host: "Hasan",
	lead: "Sangram",
	presentMembers: DAILY_STANDUP_DEFAULT_PRESENT_MEMBERS,
};

export const DAILY_STANDUP_TEMPLATE = {
	heading: "📢 DAILY STANDUP MEETING UPDATE",
	dateLabel: "📅 Date:",
	hostLabel: "👤 Host:",
	leadLabel: "🧑‍💼 Lead:",
	separator: "———————————————————————————",
	presentLabel: "✅ Present:",
	absentLabel: "❌ Absent:",
} as const;

export const DAILY_STANDUP_FORM_STORAGE_KEY = "daily-standup-form-values-v1";
