"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { dailyStandupFormResolver } from "@/features/daily-standup/schemas/daily-standup-form.schema";
import type {
	DailyStandupCopyState,
	DailyStandupFormValues,
} from "@/features/daily-standup/types/daily-standup-form.types";
import {
	DAILY_STANDUP_COPY_LABELS,
	DAILY_STANDUP_DEFAULT_VALUES,
	DAILY_STANDUP_FIELD_LABELS,
	DAILY_STANDUP_FORM_DESCRIPTION,
	DAILY_STANDUP_FORM_TITLE,
	DAILY_STANDUP_PLACEHOLDERS,
	DAILY_STANDUP_PREVIEW_DESCRIPTION,
	DAILY_STANDUP_PREVIEW_TITLE,
} from "@/features/daily-standup/utils/daily-standup-form.constants";
import { buildDailyStandupMessage } from "@/features/daily-standup/utils/daily-standup-form.helpers";

export function DailyStandupForm() {
	const [copyState, setCopyState] = useState<DailyStandupCopyState>("idle");

	const {
		control,
		register,
		formState: { errors },
	} = useForm<DailyStandupFormValues>({
		resolver: dailyStandupFormResolver,
		defaultValues: DAILY_STANDUP_DEFAULT_VALUES,
		mode: "onChange",
	});

	const [date, host, lead, presentMembers, absentMembers] = useWatch({
		control,
		name: ["date", "host", "lead", "presentMembers", "absentMembers"],
	});

	const previewMessage = useMemo(
		() =>
			buildDailyStandupMessage({
				date,
				host,
				lead,
				presentMembers,
				absentMembers,
			}),
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
								<Field data-invalid={Boolean(errors.date)}>
									<FieldLabel htmlFor="date">
										{DAILY_STANDUP_FIELD_LABELS.date}
									</FieldLabel>
									<Input
										id="date"
										type="date"
										aria-invalid={Boolean(errors.date)}
										{...register("date")}
									/>
									<FieldError errors={[errors.date]} />
								</Field>

								<Field data-invalid={Boolean(errors.host)}>
									<FieldLabel htmlFor="host">
										{DAILY_STANDUP_FIELD_LABELS.host}
									</FieldLabel>
									<Input
										id="host"
										placeholder={DAILY_STANDUP_PLACEHOLDERS.host}
										aria-invalid={Boolean(errors.host)}
										{...register("host")}
									/>
									<FieldError errors={[errors.host]} />
								</Field>

								<Field data-invalid={Boolean(errors.lead)}>
									<FieldLabel htmlFor="lead">
										{DAILY_STANDUP_FIELD_LABELS.lead}
									</FieldLabel>
									<Input
										id="lead"
										placeholder={DAILY_STANDUP_PLACEHOLDERS.lead}
										aria-invalid={Boolean(errors.lead)}
										{...register("lead")}
									/>
									<FieldError errors={[errors.lead]} />
								</Field>

								<Field data-invalid={Boolean(errors.presentMembers)}>
									<FieldLabel htmlFor="present-members">
										{DAILY_STANDUP_FIELD_LABELS.presentMembers}
									</FieldLabel>
									<Textarea
										id="present-members"
										placeholder={DAILY_STANDUP_PLACEHOLDERS.presentMembers}
										aria-invalid={Boolean(errors.presentMembers)}
										{...register("presentMembers")}
									/>
									<FieldError errors={[errors.presentMembers]} />
								</Field>

								<Field>
									<FieldLabel htmlFor="absent-members">
										{DAILY_STANDUP_FIELD_LABELS.absentMembers}
									</FieldLabel>
									<Textarea
										id="absent-members"
										placeholder={DAILY_STANDUP_PLACEHOLDERS.absentMembers}
										{...register("absentMembers")}
									/>
								</Field>
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
