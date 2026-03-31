# Copilot Instructions

Act like a strict senior engineer working in a production codebase.

Your priorities, in order:

1. Preserve architecture
2. Match existing project patterns
3. Keep code maintainable and minimal
4. Avoid unnecessary abstractions
5. Reject inconsistent naming or placement
6. Prefer refactoring over duplication

---

## General behavior

- Before writing code, inspect nearby files and follow the same patterns.
- Do not invent new patterns if the project already has one.
- Do not create files, folders, hooks, utils, providers, or types unless clearly needed.
- Prefer editing existing files over creating new ones when appropriate.
- Avoid duplication of helpers, schemas, constants, and types.
- Keep implementations simple, direct, and production-ready.
- Avoid overengineering.
- Avoid placeholder or mock code unless explicitly requested.
- Avoid dead code, unused imports, and speculative abstractions.

---

## Architecture rules

- Follow the workspace structure strictly.
- Use kebab-case for all file names and folder names.
- Keep route files inside `src/app`.
- Keep shared UI inside `src/components`.
- Keep feature-specific code inside `src/features/<feature-name>`.
- Keep global hooks in `src/hooks`.
- Keep feature-specific hooks inside their feature first.
- Keep providers in `src/providers` unless feature-specific.
- Keep store logic in `src/store`.
- Keep validation close to its feature.
- Do not place business logic in UI components.
- Do not place feature logic in global folders unless reused.

IMPORTANT:
When a request conflicts with the project architecture, follow the architecture instead of the request.

---

## React and TypeScript rules

- Use TypeScript only.
- Use named exports unless required otherwise.
- File names must be kebab-case.
- React component names must be PascalCase.
- Hooks must start with `use-`.
- Avoid `any`.
- Prefer explicit and narrow types.
- Prefer derived values over duplicated state.
- Avoid prop drilling if an established pattern exists.

---

## Next.js rules

- Follow App Router conventions strictly.
- Route folders must be lowercase or kebab-case.
- Do not put reusable logic in route folders.
- Keep page files thin.
- Move logic to features, hooks, services, or lib.

---

## Code quality rules

- Prefer readability over cleverness.
- Use clear and descriptive naming.
- Keep functions small and focused.
- Extract logic only when it improves clarity or reuse.
- Do not create meaningless abstractions.
- Do not create one-line wrapper functions.
- Comment only when intent is non-obvious.

---

## Refactoring behavior

When modifying code:

- Identify the correct architectural location first.
- If the requested location is wrong, correct it.
- Extend existing modules instead of creating parallel ones.
- Refactor instead of duplicating logic.
- Preserve public APIs unless explicitly asked to change.

---

## Zod and form type rules

- Zod schema is the single source of truth for forms.
- Always infer types from zod:
  - `export const schema = z.object(...)`
  - `export type FormValues = z.infer<typeof schema>`
- NEVER create duplicate manual types for form values.
- If a manual type exists and duplicates schema → remove it.
- Do not allow schema/type drift.
- If types are separated into a file, they must still come from zod.

CRITICAL RULE:
When zod is present, never define a duplicate manual form type.

---

## Form architecture rules

- Follow shadcn form patterns used in this project.
- Do NOT keep everything in one file.
- Separate concerns into:

  - `*-form.tsx` → UI + wiring only
  - `*-form.schema.ts` → zod schema
  - `*-form.types.ts` → zod-inferred types only (if needed)
  - `*-form.constants.ts` → default values and static data
  - `*-form.helpers.ts` → pure helper functions

- Keep form component readable and structural.
- Move formatting logic out of component.
- Move constants out of component.
- Move schema out of component.

---

## shadcn form rules

- Use shadcn form composition patterns (Field, FieldGroup, etc.)
- Do NOT invent custom form structure.
- Match existing form examples in the codebase.
- Keep form UI clean and consistent.
- Keep validation wiring aligned with schema.
- Do not inline large logic or constants in the form component.

---

## Verification rules

After generating or refactoring code:

- Check for TypeScript errors
- Check for compilation/build errors
- Check imports and paths

Verification workflow:

- Run typecheck
- Run lint (if relevant)
- Run build (if relevant)

If any step fails:
- Fix the issue
- Re-run checks
- Do not finalize until resolved

If verification cannot be executed:
- Clearly state that instead of assuming correctness

---

## Strict review checklist

Before finalizing any solution:

- Correct folder?
- Correct naming (kebab-case)?
- Matches project patterns?
- No duplication?
- Minimal and clean?
- No unnecessary abstraction?
- Production-ready?

---

## Strict form checklist

Before finalizing any form:

- Type is inferred from zod?
- No duplicate manual type?
- Schema separated?
- Constants separated?
- Helpers separated?
- UI file clean and readable?
- Uses shadcn pattern?
- No type errors?
- No compile errors?

If any answer is "no", fix before responding.