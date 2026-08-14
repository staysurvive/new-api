# Implementation Plan

1. Inventory the route, home components, animation CSS, assets, locales, tests,
   and recent V4/V4.1 history.
2. Run parallel read-only reviews for lifecycle/runtime correctness, motion and
   performance, and accessibility/security/quality.
3. Reconcile findings against source, tests, and browser evidence; reject false
   positives and rank confirmed issues P0-P3.
4. For confirmed P0/P1 findings, add a focused regression test first, then make
   the smallest compatible fix.
5. Run affected tests, scoped lint, typecheck, build, diff checks, and browser
   verification across the viewport/theme/motion matrix.
6. Run the Trellis full-scope quality check, update specs only if a reusable
   contract was revealed, then commit, archive, and journal.

## Validation commands

- affected home tests from `web/package.json`
- `bun run typecheck`
- scoped lint/format command for changed frontend files
- `bun run build`
- `git diff --check`
