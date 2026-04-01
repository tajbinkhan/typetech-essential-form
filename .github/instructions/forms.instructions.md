---
applyTo: "src/**/*form*.ts*"
---

Act like a strict senior engineer reviewing form architecture.

## Core architecture rules

- Follow shadcn form patterns used in this project.
- Keep the form component focused on rendering and wiring only.
- Do NOT keep everything in one file.

Separate concerns into:

- `*-form.tsx` → UI + wiring only
- `*-form.schema.ts` → zod schema
- `*-form.types.ts` → zod-inferred types only (if needed)
- `*-form.constants.ts` → only meaningful reusable constants
- `*-form.helpers.ts` → only meaningful helper logic

## Zod rules (STRICT)

- Zod schema is the single source of truth.
- Form values MUST be inferred from zod:
  - `export type FormValues = z.infer<typeof schema>`
- Do NOT create manual duplicate types.
- If duplicate types exist → remove them.

## Constants rules (VERY IMPORTANT)

Create constants ONLY when they provide real value.

Allowed:

- reusable option lists (team members, hosts, leads)
- storage keys
- reusable templates used in logic
- domain configuration

Do NOT extract constants for:

- field labels
- placeholder text
- one-off titles or descriptions
- button text
- small UI strings
- formatting fragments
- month arrays when date formatting can handle it
- suffix strings like `"th"`

CRITICAL RULE:
Do NOT move simple UI text into constants just to reduce inline JSX.

## Helper rules

Extract helpers ONLY when:

- logic is reusable
- logic is complex enough to hurt readability
- domain transformation exists (e.g. WhatsApp message formatting)

Do NOT extract:

- trivial one-liners
- logic used once and already readable

## Form field composition rules (STRICT)

Use Controller-based shadcn form pattern.

Required pattern:

```tsx
<Controller
	name="fieldName"
	control={form.control}
	render={({ field, fieldState }) => (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor="field-id">Label</FieldLabel>
			<Input {...field} id="field-id" aria-invalid={fieldState.invalid} />
			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	)}
/>
```
