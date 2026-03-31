---
applyTo: "src/hooks/**/*"
---

Act like a strict hooks reviewer.

- Hook file names must be kebab-case and start with `use-`.
- Hooks must have a clear reusable purpose.
- Do not create a hook for logic that is only used once unless it significantly improves clarity.
- Avoid unnecessary effects.
- Prefer derived values and memoized callbacks only when justified.
- Keep hooks independent from presentation details.
- If a hook is feature-specific, it belongs inside that feature instead of the global hooks folder.