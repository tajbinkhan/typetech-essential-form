---
applyTo: "src/components/**/*.tsx"
---

# Component Rules

- File names must be kebab-case
- Component names must be PascalCase

- Use named exports only

- Keep components:
  - small
  - reusable
  - presentation-focused

- Do NOT:
  - Fetch data directly in UI components
  - Add business logic

- Use:
  - hooks for logic
  - services for API calls

## Folder usage
- ui → design system components
- shared → reusable app components
- layout → layout/navigation components