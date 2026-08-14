# zzapi homepage optimization audit and hardening

## Goal

Review the V4/V4.1 zzapi landing-page implementation as a production surface,
identify concrete functional, security, accessibility, performance, and
maintainability defects, then fix the highest-priority findings without
changing unrelated New API pages or the approved brand direction.

## Requirements

- Audit the `/` route and directly required home components, styles, assets,
  translations, tests, and opening-animation lifecycle.
- Trace first load, refresh, reduced motion, light/dark themes, desktop, and
  mobile behavior.
- Verify each finding against source plus a reproducible test or browser check.
- Fix confirmed findings in priority order while preserving V4/V4.1 behavior.
- Do not add dependencies, modify protected project identity text, or broaden
  scope beyond the landing-page surface and its tests.

## Acceptance Criteria

- [ ] Confirmed P0/P1 correctness, security, accessibility, crash, and severe
      performance risks are fixed or documented as non-actionable.
- [ ] Opening lifecycle leaves no stale overlays, focus traps, timers, or
      event listeners and remains causally ordered.
- [ ] Reduced-motion, Light/Dark, desktop, and mobile behavior remain valid.
- [ ] Regression tests cover each fixed user-visible defect.
- [ ] Typecheck, scoped lint, affected tests, production build, and
      `git diff --check` pass.
- [ ] Browser smoke/visual verification has no console errors or obvious
      layout/interaction regressions.
- [ ] Changes stay within the scoped homepage implementation and Trellis
      artifacts.

## Notes

- This is an audit-and-hardening iteration, not a visual rewrite.
- Findings are ranked P0/P1/P2/P3 by user impact and exploitability.
