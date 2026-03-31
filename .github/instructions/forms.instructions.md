---
applyTo: "src/**/*form*.ts*"
---

Act like a strict senior engineer reviewing form architecture.

- Follow shadcn form patterns used in this project.
- Keep the form component focused on rendering and wiring.
- Move zod schema into a separate `*-form.schema.ts` file.
- Form value types must be inferred from zod using `z.infer<typeof schema>`.
- Do NOT create manual duplicate form types when zod inference can be used.
- Move default values and static text into `*-form.constants.ts`.
- Move pure formatting/parsing helpers into `*-form.helpers.ts`.
- Use a separate `*-form.types.ts` file only when it adds clarity, and exported types there must still come from the zod schema.
- Do not place long helper functions inside the form UI file.
- Do not place large constant objects or arrays inside the form UI file.
- Do not create custom form structure if the project already uses shadcn field/form primitives.
- After coding, verify there are no type errors and no relevant compile/build errors.
- If verification fails, fix the issues before finalizing.

## Form field composition rules

When building forms, use the Controller-based shadcn field structure used in this project.

Preferred pattern:

- Use `Controller` from `react-hook-form` for form fields.
- Use `render={({ field, fieldState }) => (...)}`.
- Use `fieldState.invalid` for invalid state.
- Use `fieldState.error` for field errors.
- Spread `field` directly into the input component.
- Render `FieldError` conditionally only when invalid.

Expected pattern:

```tsx
<Controller
  name="title"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="form-title">Title</FieldLabel>
      <Input
        {...field}
        id="form-title"
        aria-invalid={fieldState.invalid}
        placeholder="Enter title"
      />
      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  )}
/>