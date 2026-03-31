"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { MultiSelect } from "@/components/ui/multi-select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { dailyStandupFormResolver } from "@/features/daily-standup/schemas/daily-standup-form.schema";
import type {
	DailyStandupCopyState,
	DailyStandupFormValues,
} from "@/features/daily-standup/types/daily-standup-form.types";
import {
	DAILY_STANDUP_COPY_LABELS,
	DAILY_STANDUP_DEFAULT_VALUES,
	DAILY_STANDUP_FORM_DESCRIPTION,
	DAILY_STANDUP_FORM_TITLE,
	DAILY_STANDUP_HOSTS,
	DAILY_STANDUP_LEADS,
	DAILY_STANDUP_PLACEHOLDERS,
	DAILY_STANDUP_PREVIEW_DESCRIPTION,
	DAILY_STANDUP_PREVIEW_TITLE,
	DAILY_STANDUP_TEAM_MEMBERS,
} from "@/features/daily-standup/utils/daily-standup-form.constants";
import { buildDailyStandupMessage } from "@/features/daily-standup/utils/daily-standup-form.helpers";

export function DailyStandupForm() {
	const [copyState, setCopyState] = useState<DailyStandupCopyState>("idle");

	const { control } = useForm<DailyStandupFormValues>({
		resolver: dailyStandupFormResolver,
		defaultValues: DAILY_STANDUP_DEFAULT_VALUES,
		mode: "onChange",
	});

	const [date, host, lead, presentMembers] = useWatch({
		control,
		name: ["date", "host", "lead", "presentMembers"],
	});

	const teamMemberOptions = useMemo(
		() =>
			DAILY_STANDUP_TEAM_MEMBERS.map((member) => ({
				label: member,
				value: member,
			})),
		[],
	);

	const absentMembers = useMemo(() => {
		if (!presentMembers || presentMembers.length === 0) {
			return [...DAILY_STANDUP_TEAM_MEMBERS];
		}
		return DAILY_STANDUP_TEAM_MEMBERS.filter(
			(member) => !presentMembers.includes(member),
		);
	}, [presentMembers]);

	const previewMessage = useMemo(
		() =>
			buildDailyStandupMessage(
				{
					date,
					host,
					lead,
					presentMembers,
				},
				absentMembers,
			),
		[absentMembers, date, host, lead, presentMembers],
	);

	async function handleCopyToClipboard() {
		try {
			await navigator.clipboard.writeText(previewMessage);
			setCopyState("copied");
			setTimeout(() => setCopyState("idle"), 1800);
		} catch {
			setCopyState("error");
		}
	}

	return (
		<section className="w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{DAILY_STANDUP_FORM_TITLE}</CardTitle>
						<CardDescription>{DAILY_STANDUP_FORM_DESCRIPTION}</CardDescription>
					</CardHeader>
					<CardContent>
						<form noValidate>
							<FieldGroup>
								<Controller
									control={control}
									name="date"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Date</FieldLabel>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-start text-left font-normal"
														aria-invalid={fieldState.invalid}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value ? (
															field.value.toLocaleDateString("en-US", {
																weekday: "long",
																year: "numeric",
																month: "long",
																day: "numeric",
															})
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														captionLayout="dropdown"
													/>
												</PopoverContent>
											</Popover>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									control={control}
									name="host"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Host</FieldLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger aria-invalid={fieldState.invalid}>
													<SelectValue
														placeholder={DAILY_STANDUP_PLACEHOLDERS.host}
													/>
												</SelectTrigger>
												<SelectContent>
													{DAILY_STANDUP_HOSTS.map((host) => (
														<SelectItem key={host} value={host}>
															{host}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									control={control}
									name="lead"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Lead</FieldLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger aria-invalid={fieldState.invalid}>
													<SelectValue
														placeholder={DAILY_STANDUP_PLACEHOLDERS.lead}
													/>
												</SelectTrigger>
												<SelectContent>
													{DAILY_STANDUP_LEADS.map((lead) => (
														<SelectItem key={lead} value={lead}>
															{lead}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									control={control}
									name="presentMembers"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Present members</FieldLabel>
											<MultiSelect
												options={teamMemberOptions}
												onValueChange={field.onChange}
												defaultValue={field.value}
												placeholder={DAILY_STANDUP_PLACEHOLDERS.presentMembers}
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{DAILY_STANDUP_PREVIEW_TITLE}</CardTitle>
						<CardDescription>
							{DAILY_STANDUP_PREVIEW_DESCRIPTION}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="rounded-lg border bg-muted/30 p-4">
							<pre className="whitespace-pre-wrap wrap-break-word font-mono text-sm leading-6">
								{previewMessage}
							</pre>
						</div>
						<Separator />
						<Button
							type="button"
							className="w-full sm:w-auto"
							onClick={handleCopyToClipboard}
						>
							{copyState === "copied"
								? DAILY_STANDUP_COPY_LABELS.copied
								: DAILY_STANDUP_COPY_LABELS.idle}
						</Button>
						{copyState === "error" ? (
							<p className="text-sm text-destructive">
								{DAILY_STANDUP_COPY_LABELS.error}
							</p>
						) : null}
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
