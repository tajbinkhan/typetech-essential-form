---
applyTo: "src/features/**/*"
---

# Feature Architecture Rules

Each feature must be self-contained.

Structure:

feature-name/
  components/
  hooks/
  services/
  schemas/
  types/
  utils/

## Rules

- Do NOT import across features unless necessary
- Prefer internal feature modules first

- Business logic MUST stay inside feature
- API calls → services/
- Validation → schemas/
- Types → types/

- Avoid putting feature logic in global folders

## Naming
- Folder names must be kebab-case
- Keep everything scoped to feature