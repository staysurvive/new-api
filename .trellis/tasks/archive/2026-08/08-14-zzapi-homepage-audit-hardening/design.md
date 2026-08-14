# Technical Design

## Scope

Follow the `/` route into `web/src/features/home/`, the shared landing
stylesheet, home assets and locale keys, plus existing home tests and build
configuration only when needed to reproduce a finding.

## Review lanes

1. Lifecycle and state: opening phases, timers, animation/transition events,
   cleanup, skip/reduced-motion behavior, focus, pointer events, and route
   completion.
2. Visual/runtime: stacking contexts, responsive layout, theme tokens,
   overflow, SVG/canvas cost, and browser console behavior.
3. Contract and quality: i18n, accessibility semantics, unsafe DOM/API usage,
   dependency boundaries, tests, type safety, and build/lint behavior.

## Fix strategy

- Reproduce each candidate finding in the smallest available test or browser
  check before editing.
- Prefer local, declarative fixes matching existing CSS/React patterns.
- Add a regression test at the affected home module boundary for every
  confirmed behavior change.
- Keep animation work on transform/opacity/visibility where possible and retain
  `prefers-reduced-motion` behavior.
- Re-run the full affected check set after each priority batch.

## Rollback

Each coherent fix batch is committed separately from Trellis archive/journal
bookkeeping so a finding can be reverted independently.
