# zzapi V4.1 implementation plan

## Preconditions

- Start from clean product baseline `d0719ebb` with only this Trellis task
  untracked/modified.
- Re-read `prd.md`, `design.md`, all three research files, `AGENTS.md`,
  `web/AGENTS.md`, and the shared Trellis thinking guides before product edits.
- Confirm `web/public/landing-brand-core.png` SHA-256 matches
  `A58D26790A7C571ACE684949255261FE3BB20AD6C3E4242B27ECD40F608DAC2C`.
- Run the current focused homepage tests and affected-file lint to preserve the
  known V4 baseline.

## Ordered implementation

### 1. Protect lifecycle behavior with tests

- Add `web/src/features/home/__tests__/landing-entrance-lifecycle.test.tsx`
  using Bun, Happy DOM, controlled timers/RAF, `matchMedia`, `Image.decode`,
  animation/transition events, and explicit cleanup.
- Cover causal milestone order, 200ms hold, dual-proxy handoff completion,
  complete settlement ownership, one-shot completion, decode rejection,
  decode timeout, unmount cleanup, reduced motion, pointer skip, Escape skip,
  and Tab focus transfer.
- Add `web/src/features/home/__tests__/infrastructure-map-accessibility.test.tsx`
  for pre-settlement inert controls and final provider selection/focus behavior.
- Keep `custom-home-gating.test.ts` and `opening-focus.test.ts` green. Extend them
  only if their production ownership changes.

### 2. Correct the opening scheduler

- In `landing-entrance.tsx`, keep the existing phases and replace conflicting
  absolute progression with owned milestone events plus bounded fallbacks.
- Add one bounded Logo readiness owner for normal motion. Decode failure or
  timeout completes to the static page; reduced motion and skip bypass it.
- Keep mark and wordmark target measurement immediately before handoff.
- Start the 200ms hold only after full wordmark reveal completion.
- Keep the overlay's visual exit state separate from the semantic `settle`
  lifetime so `ambient` is not emitted before the 420ms child budget.
- Retain and cancel every timer, frame, observer, and event listener. Make every
  completion path idempotent.
- Update only the CSS timing/selectors required to complete assembly, aperture,
  lockup, handoff, exit, and settlement in the design timeline.

### 3. Align Logo presence and handoff optics

- Add a landing-scoped internal artwork scale around `1.38x` for opening and
  Core images without changing wrapper dimensions or anchors.
- Include the same factor in handoff landing math and related sheen/mask
  surfaces so the proxy does not land small and pop larger at settlement.
- Confirm the Core anchor, route origin, orbital geometry, and desktop split do
  not move.

### 4. Improve desktop Gateway readability

- In `infrastructure-map.tsx`, tighten existing desktop provider contacts and
  route curves by roughly 15% toward the Core.
- In `index.css`, raise default semantic route contrast/stroke while preserving
  active-route priority and faint calibration geometry.
- Reassess Core wordmark size/spacing only after optical Logo scaling. Keep it a
  label, never a second Hero headline.

### 5. Implement the mobile topology

- Keep Client, Core, OpenAI, and Claude as the visible mobile sequence.
- Add a non-interactive localized `+{{count}} Models` summary for hidden Gemini
  and Qwen.
- Define mobile-specific semantic route geometry and centered positions; keep
  desktop SVG and four-provider behavior unchanged.
- Remove the old mobile radial arrangement, remove hidden providers from focus
  and accessibility exposure, and preserve 44px minimum interactive targets.
- Replace the current full-viewport stage floor with an approximately `88svh`
  first-screen budget at standard portrait sizes; add fit-first fallback rules
  for 320/359px.

### 6. Complete accessibility, i18n, and reduced motion

- Make model controls inert until settlement/ambient and restore them without
  changing existing selection semantics.
- Ensure reduced motion reaches complete static content within 200ms and has no
  spatial travel, pulse, sheen, or delayed node/Hero motion.
- Add the aggregation key with deliberate translations for `en`, `zh`,
  `zh-TW`, `fr`, `ja`, `ru`, and `vi` using
  `web/scripts/add-missing-keys.mjs`, then run `bun run i18n:sync` and inspect
  `_reports/_sync-report.json`.
- Check forced-colors focus and selected-state visibility.

### 7. Run automated quality gates

From `web/`, using `D:\DevTools\Bun\bin\bun.exe` if Bun is not on `PATH`:

```powershell
bun test src/features/home/__tests__
bun run oxlint -c .oxlintrc.json <every-changed-ts-or-tsx-file>
bun run i18n:sync
bun test
bun run build:check
bun run format:check
bun run copyright:check
```

Full `bun run lint` currently has unrelated baseline errors. Run it for
visibility, but the task gate is zero lint errors in every changed file; record
baseline-only failures separately.

From repository root:

```powershell
git diff --check
git diff --exit-code d0719ebb -- web/public/landing-brand-core.png
git diff -- web/package.json web/bun.lock
```

The asset diff must be empty and package/lock files must show no new dependency.

### 8. Browser verification and tuning

- Run the production preview on a free localhost port.
- Capture phase/timestamp evidence, not screenshots named only by arbitrary
  post-navigation waits.
- Desktop 1430x894 Light/Dark: initial signal, assembly complete, aperture
  complete, lockup complete, hold start/end, handoff landing, settlement end,
  ambient, static route comprehension, and provider interactions.
- Mobile 375x812, 390x844, and 430x932 Light/Dark: Client above Core, two named
  models, localized aggregate, no overlap/overflow, and 10-18% next-section
  reveal where height permits.
- Mobile 320x568 and 359px: usable fit, no horizontal overflow, no forced reveal
  percentage.
- Reduced motion desktop/mobile: stable ambient within 200ms and no spatial
  motion.
- Skip at assembly, hold, and handoff using pointer, Escape, and Tab; confirm Tab
  focuses the primary CTA without scroll and invisible providers never receive
  focus.
- Block/slow the Logo request to verify decode failure/timeout fallback.
- Verify cached/delayed URL, HTML, and Markdown custom homes; logged-out/logged-in
  CTA routing; internal/external docs routing; live/cold theme switching; all
  seven locales; forced colors; and provider hover/focus/click semantics.
- Record production Network/Performance evidence: one Logo transfer, no new
  media, no perpetual JS loop, no Logo layout shift, and no task-added >50ms
  long task. Compare the home chunk and asset sizes with the V4 diagnostic
  baseline.

### 9. Final review and rollback commit

- Review the complete diff against every PRD acceptance criterion and the V4
  preservation list.
- Confirm Hero copy, CTA strategy, navigation, section order, backend, APIs,
  package dependencies, protected metadata, and official Logo bytes are
  unchanged.
- Have an independent check pass inspect source, automated results, and browser
  captures. Fix all P0/P1 findings and rerun affected gates.
- Commit the verified V4.1 result as a dedicated rollback point after the user
  has already authorized implementation and commit scope.

## Expected product files

- `web/src/features/home/components/landing-entrance.tsx`
- `web/src/features/home/components/infrastructure-map.tsx`
- `web/src/styles/index.css`
- `web/src/features/home/__tests__/landing-entrance-lifecycle.test.tsx`
- `web/src/features/home/__tests__/infrastructure-map-accessibility.test.tsx`
- Locale JSON/report files only if produced by the required i18n workflow

`web/src/features/home/index.tsx`, `types.ts`, `sections/hero.tsx`, and
`lib/opening-focus.ts` should remain unchanged unless a verified lifecycle
contract cannot be implemented at the existing boundary.

## Stop conditions

- Stop and return to planning if implementation requires a new dependency,
  official asset edit, page/section recomposition, giant brand headline,
  backend/API change, or altered custom-home product behavior.
- Do not accept a shorter runtime by overlapping assembly, aperture, hold,
  handoff, or settlement.
- Do not commit while automated gates, required browser states, asset identity,
  or independent P0/P1 review are unresolved.
