# Research: V4 opening timeline and component/CSS lifecycle

- Query: Establish the exact current V4 opening timeline, identify phase/CSS lifecycle conflicts, and propose the smallest V4.1 timing and settlement correction with rollback and verification checkpoints.
- Scope: internal (source, user-supplied brief, and local audit captures)
- Date: 2026-08-14

## Findings

### Files found

- `web/src/features/home/index.tsx` - owns `openingPhase`, root document data attributes, entrance mount/unmount, and the shared phase passed to the hero.
- `web/src/features/home/types.ts` - defines the ordered/cumulative `OpeningPhase` contract and custom-home gating.
- `web/src/features/home/components/landing-entrance.tsx` - owns phase timers, target measurement, handoff completion events, skip/reduced-motion paths, overlay exit, and watchdogs.
- `web/src/features/home/components/sections/hero.tsx` - keeps the real homepage mounted under the overlay and forwards the phase into the infrastructure map.
- `web/src/features/home/components/infrastructure-map.tsx` - renders the real Core and brand anchors that the overlay proxies measure and land on.
- `web/src/styles/index.css` - owns every opening transition/animation plus header, hero, Core, node, route, responsive, and reduced-motion phase behavior.
- `web/src/features/home/lib/opening-focus.ts` and `web/src/features/home/__tests__/opening-focus.test.ts` - deferred CTA focus after a keyboard-driven skip.
- `web/src/features/home/__tests__/custom-home-gating.test.ts` - verifies delayed custom content cannot replace the default homepage until `ambient`.
- `C:/Users/npp_c/.codex/attachments/e02a8324-f8dd-4250-aa75-3767866955f7/pasted-text.txt` - V4.1 requirements and target timing budget.
- `C:/Users/npp_c/AppData/Local/Temp/zzapi-v4-audit-20260814/*.png` - local V4 audit captures; four opening frames were inspected.

No frontend-specific `.trellis/spec/` package exists. The only relevant Trellis guidance is `.trellis/spec/guides/index.md` and its code-reuse guide: search all timing consumers before changing a value and keep constants/state transitions auditable. `web/AGENTS.md` supplies the actual frontend rules (Bun, TypeScript/lint checks, reduced-motion/accessibility, and regression tests for focus/responsive behavior).

### Runtime ownership and dependency chain

```text
Home.openingPhase
  |-- documentElement[data-zzapi-opening][data-zzapi-opening-phase]
  |     |-- header visibility/reveal
  |     |-- below-fold visibility
  |     `-- real Core mark visibility
  |-- LandingEntrance (mounted for every phase except ambient)
  |     |-- cumulative milestone classes via openingPhaseReached()
  |     |-- mark proxy -> [data-zzapi-core-anchor]
  |     `-- wordmark proxy -> [data-zzapi-brand-anchor]
  `-- Hero[data-opening-phase]
        `-- InfrastructureMap[data-opening-phase]
              `-- route/Core/node settlement CSS
```

`Home` initializes to `signal` only when no cached custom-home content is present; cached custom content initializes directly to `ambient` and never mounts the entrance (`web/src/features/home/index.tsx:53-57`, `web/src/features/home/index.tsx:101-151`). Delayed custom content remains gated until `ambient` (`web/src/features/home/types.ts:62-67`).

While opening, a layout effect mirrors the phase to root data attributes (`web/src/features/home/index.tsx:85-99`). The overlay is a sibling of the always-mounted hero, not its parent (`web/src/features/home/index.tsx:165-177`). Therefore unmounting the overlay does not directly remove hero children, but changing the shared phase from `settle` to `ambient` removes the CSS selectors that run their settlement animations.

The phase ordering is cumulative: at `settle`, the entrance still owns every class from `--assembled` through `--handoff` (`web/src/features/home/types.ts:41-60`, `web/src/features/home/components/landing-entrance.tsx:246-260`). Reordering or inserting a phase changes every `openingPhaseReached()` comparison.

Target measurement is cross-component but local: a layout effect measures the real, already-mounted Core/wordmark anchors and keeps them updated with `ResizeObserver`; `startHandoff()` measures once more before scheduling `handoff` on the next animation frame (`web/src/features/home/components/landing-entrance.tsx:83-138`, `web/src/features/home/components/landing-entrance.tsx:146-155`). The anchors are in `InfrastructureMap` (`web/src/features/home/components/infrastructure-map.tsx:257-283`). Hidden elements remain measurable because opening CSS uses `visibility`/`opacity`, not `display:none` (`web/src/styles/index.css:1627-1636`).

### Exact current normal-motion timing math

All times below are relative to the `LandingEntrance` effect starting. Browser timer/render scheduling adds roughly 0-1 frame to a state becoming painted, so `H` denotes the actual painted handoff start.

| Time / phase | Trigger and current CSS work | Nominal completion |
|---|---|---|
| `0ms signal` | Initial React state. Glint has a real 160ms keyframe animation. Axis visibility is selected by the initial `data-opening-phase='signal'`; because the element mounts already in this state, its declared transition is not a reliable entrance animation. | Glint `160ms`; axis is initially at its selected state. |
| `240ms assemble` | Timer applies `--assembled`. Slice transform is 260ms, with middle/bottom delays of 40/80ms. | Top `500ms`, middle `540ms`, bottom `580ms`. |
| `520ms focus` | Timer applies `--focused`; final logo fades in over 80ms, slices fade out over 130ms while retaining their 0/40/80ms delays, focus ring uses 150/190ms, light field uses 240/420ms. | Logo `600ms`; slice fade completes top `650ms`, middle `690ms`, bottom `730ms`; focus ring transform `710ms`; light transform would reach `940ms` if not retargeted. |
| `590ms ignite` | Timer starts 250ms aperture and 190ms logo sheen; focus/light transitions are retargeted. | Aperture should end `840ms`; sheen `780ms`. |
| `650ms expand` | Timer applies `--expanded`. This sets `animation:none` on the aperture after only 60ms, starts 420ms plane opening, restarts light-field transform, and starts 360ms route drawing. | Aperture is canceled at `+60ms`; routes `1010ms`; planes/light transform `1070ms`. |
| `700ms lockup` | Timer applies `--locked`. Wordmark opacity is 120ms; clip/transform are 260ms. | Opacity `820ms`; full lockup geometry `960ms`. |
| `960ms handoff request` | Timer calls `measureTargets()`, then requests a frame that applies `handoff`. | Actual start `H ~= 960-977ms`; there is only about 0-1 frame after full lockup. |
| `H + 320/360ms` | Mark/wordmark proxy keyframes land. Their filtered `animationend` events set two flags; the second event calls `settleOpening()`. | Mark `H+320`; wordmark and normal settle `S=H+360 ~= 1320-1337ms`. |
| `S settle` | Phase exposes the real Core, starts header 240ms, hero copy 320ms, and nodes 300ms with up to 120ms delay. `settleOpening()` immediately requests a frame that adds `--exiting`. | Header `S+240`; copy `S+320`; latest node (Qwen) `S+420`. |
| `S + ~140-157ms ambient` | Overlay opacity transition is 140ms; its `transitionend` calls `onComplete()`. A 180ms timeout after the exit frame is fallback. `Home` sets `ambient`, unmounts the overlay, and removes root opening data attributes. | Normal completion around `1460-1494ms`; timeout fallback around `1500-1517ms`. |

The phase timers are at `web/src/features/home/components/landing-entrance.tsx:171-183`. The conflicting CSS durations are at `web/src/styles/index.css:1101`, `web/src/styles/index.css:1278-1291`, `web/src/styles/index.css:1315-1337`, `web/src/styles/index.css:1345-1404`, and `web/src/styles/index.css:1406-1413`.

### Confirmed conflicts

1. **Focus starts before assembly finishes.** The bottom slice transform completes at `240 + 80 + 260 = 580ms`, but `focus` starts at `520ms`, a 60ms overlap. Its fade-out then remains visible as late as `730ms` because the bottom slice keeps its 80ms transition delay.

2. **The aperture is canceled, not completed.** `ignite` starts its 250ms keyframe at `590ms`; `expand` matches at `650ms` and explicitly replaces it with `animation:none` (`web/src/styles/index.css:1278-1287`). Only 60/250ms (24%) of the intended aperture animation can run.

3. **There is no usable brand hold.** Full wordmark clip/transform nominally completes at `700 + 260 = 960ms`; the handoff timer fires at exactly `960ms` and applies the phase next frame. Hold is approximately 0-17ms, not 180-220ms.

4. **The aperture planes and handoff overlap.** Plane expansion begins at `650ms`, ends at `1070ms`, while handoff begins around `960-977ms`; their final approximately 93-110ms run concurrently.

5. **Settlement is deterministically cut short.** The overlay normally completes about 140-157ms after `settle`, but header/copy/nodes need 240/320/300-420ms (`web/src/styles/index.css:494-498`, `web/src/styles/index.css:1511-1513`, `web/src/styles/index.css:1638-1659`). Approximate work still remaining when `ambient` removes the selectors is:

   - header: 83-100ms;
   - hero copy: 163-180ms;
   - undelayed nodes/Core lockup: 143-160ms;
   - Qwen node: 263-280ms.

6. **The absolute watchdogs encode the same premature lifecycle.** The settle watchdog is `1600ms` and global completion watchdog is `1800ms` (`web/src/features/home/components/landing-entrance.tsx:181-183`). Retiming only the phase schedule without moving these can bypass the new handoff/settlement budget.

7. **CSS and JS timing are separate sources of truth.** JS decides when phase selectors change; CSS decides when work under a phase is actually done. No test currently covers their boundary. The two existing home tests cover CTA focus and delayed custom-home gating, not the timeline.

8. **Route drawing has a separate minimum.** The 360ms route draw is selected during `expand`, `lockup`, and `handoff`, then removed at `settle` (`web/src/styles/index.css:1580-1592`). Any retime must leave at least 360ms from first `expand` paint to `settle`, or routes snap to their fully drawn base state.

### Current exit, skip, and reduced-motion behavior

- Pointer down anywhere on the aria-hidden overlay skips immediately (`web/src/features/home/components/landing-entrance.tsx:140-144`, `web/src/features/home/components/landing-entrance.tsx:261-263`).
- Captured `Tab` and `Escape` prevent their default action and skip. `Tab` requests primary CTA focus only after `onComplete`, on a further animation frame (`web/src/features/home/components/landing-entrance.tsx:185-191`, `web/src/features/home/lib/opening-focus.ts:19-24`).
- Reduced motion requests `settle` on the next frame and has a 210ms completion watchdog (`web/src/features/home/components/landing-entrance.tsx:157-169`). The reduced CSS disables hero/node animation and transitions, and disables route pulse (`web/src/styles/index.css:2029-2097`). It therefore reaches the final information structure without the full intro, as required.
- Nested exit `requestAnimationFrame` and its 180ms completion timeout are not retained for cleanup. This is low risk in the current parent-controlled lifecycle but should not be multiplied during the retime.

### Minimal V4.1 state/timer/settlement proposal

Keep the existing `OpeningPhase` values and component boundaries. A new `hold` phase is unnecessary: `lockup` can own both the 260ms wordmark reveal and the subsequent 200ms stable hold. This avoids touching `OPENING_PHASES`, custom-home gating tests, all cumulative class comparisons, and phase-specific selectors.

The following is a conservative initial budget that preserves every current CSS duration instead of making them race:

| Event | Proposed time | Derivation / invariant |
|---|---:|---|
| `signal` | `0ms` | Existing initial state. |
| `assemble` | `240ms` | Preserve the V4 signal prelude. |
| Assembly transform complete | `580ms` | `240 + 80 bottom delay + 260 transform`. |
| `focus` | `580ms` | Never earlier than assembly completion. |
| Focused logo/slice crossfade complete | `790ms` | `580 + 80 bottom delay + 130 opacity`; logo itself finishes at 660ms. |
| `ignite` | `800ms` | 10ms buffer after the final slice is gone. |
| Aperture complete | `1050ms` | `800 + 250 keyframe`. |
| `expand` | `1060ms` | 10ms buffer; `animation:none` now occurs after completion. |
| `lockup` | `1080ms` | Brand reveal follows aperture completion; it may coexist with the already-open spatial field. |
| Full `[Logo] zzapi` lockup | `1340ms` | `1080 + 260 clip/transform`. |
| `handoff` | `1540ms` | Exact 200ms stable brand hold after full lockup. Plane opening also finished at `1060 + 420 = 1480ms`. |
| Handoff animations complete | `1900ms` | Max of current 320/360ms proxy animations. Primary transition remains their `animationend`, not this nominal clock. |
| `settle` | about `1900ms` | After both proxy animation-end flags. A fallback may fire at about 1980ms. |
| Settlement complete | about `2320ms` | `max(header 240, copy 320, node 300 + 120 delay) = 420ms`. |
| Overlay fade / `ambient` | about `2320-2460ms` | Start exit only after 420ms; 140ms opacity transition completes the handoff. |

This is intentionally a safety-first first pass. The user brief says its 1950ms target is a budget, not a fixed rule. If visual review finds approximately 2.46s too long, reduce deliberate CSS durations/staggers and recompute downstream starts; do not recover time by overlapping phases whose completion is an acceptance criterion.

Implementation shape inside `LandingEntrance`:

1. Keep one cumulative phase machine; update the normal phase schedule and handoff time only.
2. Keep both proxy `animationend` events as the primary handoff-complete signal. Background-tab timer clamping makes pure absolute choreography less reliable.
3. Change normal `settleOpening()` so it sets phase `settle`, waits 420ms, then adds `isExiting`; let opacity `transitionend` remain the primary `onComplete` signal.
4. Preserve an immediate settlement/exit option for pointer skip, `Tab`/`Escape`, and reduced motion. These paths must not inherit the new 420ms wait.
5. Move the settle watchdog to after `handoff + 360ms` with a small margin (for the table above, approximately 1980ms), and put the final completion watchdog after the fallback settlement window and fade (approximately 2580ms). A watchdog must never become the normal path.
6. Retain/cancel any newly introduced settlement/exit timer or animation frame during cleanup. Avoid a second independent phase scheduler.
7. Do not change hero, gateway, or page structure for the timing fix. No animation library or dependency is needed.

The 420ms wait also lets the 240ms header reveal finish before root data attributes disappear. Because the landed overlay proxies remain at the real Core/brand coordinates with `forwards`, they can act as the stable handoff bridge while the underlying Core lockup settles. Verify that this does not visibly double the glyph weight; add proxy-specific settle opacity only if the actual pixels show overdraw.

### Rollback and regression risks

- **Do not add/reorder phases casually.** `openingPhaseReached()` is index-based and every later phase inherits earlier classes. A new value affects CSS class accumulation and custom-home gating even if no selector mentions it.
- **Watchdog drift is the highest implementation risk.** The current early `1800ms` global completion would defeat a correct longer sequence. Derive watchdog positions from the longest normal phase rather than editing only `phaseSchedule`.
- **Longer overlay lifetime delays navigation/header/below-fold interaction.** Retain the current pointer and keyboard skips and verify they remain immediate.
- **Delayed custom content stays behind the opening longer.** This is correct by the existing contract, but it must still replace the default home at `ambient` and never mid-settlement.
- **Landed proxy overdraw is possible during the new settlement window.** The real Core mark becomes visible immediately at `settle`; the real wordmark/node lockup animates in. Inspect both light/dark pixels before adding any extra fade.
- **Timer throttling/background tabs can reorder wall-clock expectations.** Handoff completion should remain event-driven with watchdogs only for missing/canceled animation events.
- **Resize during the extended sequence can move transfer anchors.** The existing observer and pre-handoff measurement should remain intact; verify a responsive resize immediately before handoff does not jump to stale coordinates.
- **Changing CSS duration without updating the schedule recreates the bug.** Search all occurrences of the affected value/keyframe first. Handoff names are also hard-coded in the React event filter (`web/src/features/home/components/landing-entrance.tsx:202-217`).
- **Removing the overlay before settlement ends causes the original regression.** The visible symptom may be a snap rather than disappearance because ambient base styles are already final; event timestamps are needed in addition to final screenshots.
- **Reduced motion and skip must bypass normal settlement delay.** Applying a blanket 420ms wait to all paths would regress AC-09 and keyboard escape behavior.

### Exact verification checkpoints

Instrument phase attribute mutations plus `animationstart`, `animationend`, and root overlay `transitionend` using `performance.now()`. Audit screenshot filenames are not a sufficiently exact clock because navigation/load time is outside the React effect timeline.

Normal-motion desktop checkpoints:

1. Phase order is exactly `signal -> assemble -> focus -> ignite -> expand -> lockup -> handoff -> settle -> ambient`; no phase is skipped in the normal path.
2. Bottom slice `transform` transition has ended before the first painted `focus` frame. At `ignite`, all slices are at opacity 0 and the final logo is at opacity 1.
3. `zzapi-aperture-ignite` emits `animationend` before the phase changes to `expand`; measured duration is approximately 250ms, not approximately 60ms.
4. Wordmark clip-path/transform completes before the hold clock begins. Measure 180-220ms with unchanged mark and wordmark geometry before the first `zzapi-mark-handoff`/`zzapi-wordmark-handoff` animation start.
5. Plane transform has completed before handoff starts. No plane transform and proxy handoff overlap remains.
6. Both handoff animation-end events occur before normal `settle`. Suppress those events once and verify the settle watchdog works only after the full handoff budget.
7. At `settle`, `.zzapi-opening` remains connected for at least 420ms. Observe `zzapi-header-reveal`, `zzapi-copy-settle`, and the delayed Qwen `zzapi-node-settle` all ending before `--exiting` is applied.
8. Overlay opacity `transitionend` happens only after settlement completion; `ambient` and overlay removal follow it. The 140ms fade itself must not be used as settlement time.
9. Header, hero copy, Core lockup, client, network meta, and all model nodes are at their stable computed styles on the first `ambient` frame; no snap between the last settle frame and ambient.
10. Light and dark screenshots at full lockup, end of 200ms hold, mid-handoff, final settle, and ambient show a continuous brand anchor and no doubled/bolder proxy glyph.

Skip and accessibility checkpoints:

11. Pointer down and `Escape` reach ambient promptly without waiting the normal 420ms settlement budget.
12. `Tab` is intercepted only during the opening, reaches ambient promptly, and focuses `.zzapi-primary-cta` on the post-completion frame with `preventScroll:true`.
13. With `prefers-reduced-motion: reduce`, the final hero/gateway structure is visible and interactive within the existing approximately 210ms upper bound; no handoff or route pulse runs.
14. No hidden overlay child is a tab stop; the overlay remains `aria-hidden` and has no interactive control added merely for timing.

Robustness and project checks:

15. Resize across the 767px breakpoint before handoff; the proxy lands on the newly measured real anchors without a jump.
16. Verify normal event path, missing-animation-event watchdog path, and component cleanup path with controlled timers/events. Do not assert only final class strings.
17. Run from `web/`: `bun test`, `bun run typecheck`, `bun run lint`, and `bun run build`. The CI workflow already uses `bun test`; there is no dedicated `test` script in `web/package.json`.
18. Browser review must cover initial load and the five timestamped states above on desktop light/dark, plus reduced motion. Final screenshots alone do not prove AC-01/02/03/08.

### Audit-capture caveat

The local files named `03-opening-320ms-expand.png`, `04-opening-560ms-handoff.png`, `05-opening-760ms-handoff.png`, and `06-opening-980ms-removed.png` visually confirm the rushed lockup/handoff/removal, but their filename delays do not match the absolute timers in the current source (for example, source cannot enter handoff before about 960ms). They are likely waits measured around navigation/page-load boundaries, not from the entrance effect start. Use them as visual evidence only and collect a phase-event trace for the V4.1 report.

## External references

- No third-party API or animation-library research is needed. The implementation uses React state/timers and native CSS transitions/animations.
- User V4.1 brief: `C:/Users/npp_c/.codex/attachments/e02a8324-f8dd-4250-aa75-3767866955f7/pasted-text.txt` (AC-01, AC-02, AC-03, AC-08, and AC-09 are the direct motion/lifecycle contracts).

## Related specs

- `AGENTS.md` - preserve protected branding; keep changes direct/minimal.
- `web/AGENTS.md` - Bun commands, TypeScript/lint checks, accessibility/reduced motion, and user-visible regression testing.
- `.trellis/spec/guides/index.md` - search all consumers before changing timing/config values.
- `.trellis/spec/guides/code-reuse-thinking-guide.md` - keep repeated constants/state transitions in one auditable owner; do not introduce an abstraction unless it removes real timing drift.

## Caveats / Not Found

- No existing automated test asserts phase timestamps, CSS animation completion, overlay lifetime, or reduced-motion completion.
- No Playwright/Vitest configuration was found in `web/`; browser timeline verification will need the available browser tooling or a temporary external harness, while repository tests continue through `bun test`.
- Research was read-only except for this research artifact. No product code was edited and no test/build command was run.
