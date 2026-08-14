# Research: V4.1 verification and regression risk

- Query: Define V4.1 regression, accessibility, performance, i18n, and test requirements by inspecting current homepage tests, package scripts, reduced-motion CSS/JS, hidden model controls, image decode behavior, custom-home gating, theme behavior, and quality commands.
- Scope: internal, with authoritative browser/accessibility references
- Date: 2026-08-14

## Findings

### Files found

- `.trellis/tasks/08-14-zzapi-landing-v4-1/prd.md` - source requirements and acceptance criteria, especially R2, R7-R10, and the required verification gate.
- `.trellis/tasks/08-14-zzapi-landing-v4-1/research/motion-timeline.md` - exact current phase conflicts and the proposed causal timeline/settlement ownership.
- `.trellis/tasks/08-14-zzapi-landing-v4-1/research/visual-topology.md` - measured Logo, desktop contrast, mobile topology, and viewport targets.
- `web/src/features/home/index.tsx` - owns custom-home branching, the opening phase, root opening data attributes, iframe theme/language messages, and the default-page mount.
- `web/src/features/home/types.ts` - owns the ordered opening phases and `shouldRenderCustomHome()`.
- `web/src/features/home/hooks/use-home-page-content.ts` - cache-first custom-home loading, API replacement/clear behavior, and failure behavior.
- `web/src/features/home/components/landing-entrance.tsx` - owns phase scheduling, skip/reduced-motion behavior, target measurement, settlement, and completion watchdogs.
- `web/src/features/home/components/infrastructure-map.tsx` - owns all provider buttons, desktop/mobile SVG topology, active route state, and the real handoff anchors.
- `web/src/features/home/components/sections/hero.tsx` - owns the localized Hero, auth-aware primary CTA destination, docs destination, and infrastructure-map mount.
- `web/src/features/home/lib/opening-focus.ts` - moves focus to the primary CTA after a keyboard-driven skip.
- `web/src/features/home/__tests__/custom-home-gating.test.ts` - current pure regression coverage for cached, delayed, and empty custom content.
- `web/src/features/home/__tests__/opening-focus.test.ts` - current pure regression coverage for deferred CTA focus with `preventScroll`.
- `web/src/styles/index.css` - V4 phase visibility, desktop/mobile topology, reduced-motion, forced-colors, and interactive route styling.
- `web/src/context/theme-provider.tsx` - resolves stored/system theme and applies the root `light`/`dark` class in an effect.
- `web/src/components/theme-switch.tsx` - public theme control and theme-color meta update.
- `web/src/i18n/config.ts` and `web/src/i18n/locales/*.json` - seven supported UI locales and English fallback.
- `web/scripts/sync-i18n.mjs` - mutating locale synchronization/report command; it is not a read-only validation command.
- `web/package.json` - authoritative frontend scripts.
- `.github/workflows/ci.yml` - pins Bun 1.3.14 and runs `bun run typecheck` plus `bun test` for frontend CI.
- `web/rsbuild.config.ts` - production route splitting and output configuration.
- `web/public/landing-brand-core.png` - unchanged 256x256 PNG, 58,290 bytes.
- `web/AGENTS.md` - project frontend requirements for i18n, accessibility, behavior-focused tests, Bun, typecheck, and affected-file lint.

No frontend-specific `.trellis/spec/` package exists. The relevant Trellis guidance is `.trellis/spec/guides/index.md`, `code-reuse-thinking-guide.md`, and `cross-layer-thinking-guide.md`; `web/AGENTS.md` is the operative frontend specification.

### Current executable baseline

| Surface | Current result | Consequence |
| --- | --- | --- |
| Focused homepage tests | `bun test src/features/home/__tests__` passes 14/14 on Bun 1.3.14. | Preserve these tests and use Bun as the runner. |
| Raw Node runner | `node --test src/features/home/__tests__/*.test.ts` fails because Node cannot resolve extensionless TypeScript imports such as `../types`. | Do not document raw `node --test` as a valid project command. |
| Component test stack | Existing tests use `node:test`, `node:assert/strict`, `happy-dom`, `react-dom/client`, and `act`; React Testing Library, axe, Vitest, and Playwright are not installed. | Add no dependency for V4.1. Follow the existing Happy DOM pattern for component contracts, then use browser review for rendering/timing. |
| Scoped V4 lint | Direct oxlint over the active V4 source/test files passes. | An affected-file lint command is a usable task gate. |
| Full lint | `bun run lint` currently fails on unrelated repository debt and legacy/unused home files, including `hero-terminal-demo.tsx`, `gateway-card.tsx`, `scrolling-icons.tsx`, and `constants.ts`. | Do not claim V4.1 introduced the full baseline. Require zero errors in every changed file and record the pre-existing full-lint failure separately. |
| Typecheck/build | Package scripts are `bun run typecheck`, `bun run build`, and combined `bun run build:check`. They were not run in this research pass because they write build/cache artifacts. | The implement/check phase must run the latest commands after all edits. |
| i18n | All 13 existing homepage keys checked are present and non-empty in `en`, `fr`, `ja`, `ru`, `vi`, `zh-TW`, and `zh`. | Only the new mobile aggregation label should require locale changes. Structural sync is not proof of translation quality. |
| Existing production output | The current, not freshly rebuilt `dist` has a 34,452-byte raw / 9,989-byte gzip home async chunk, 58,290-byte PNG, 435,228-byte raw / 64,552-byte gzip global CSS, and a 3,441,470-byte raw / 975,960-byte gzip entry chunk. | Treat these as a diagnostic baseline, not a clean CI budget. Compare the fresh V4.1 build, especially the home chunk and asset request list. |

### Prioritized risk table

| Priority | Risk and affected acceptance criteria | Current evidence | Required proof |
| --- | --- | --- | --- |
| P0 | A Logo decode wait can deadlock or delay both the normal opening and the <=200ms reduced-motion path (R2, R8, R9; AC decode failure/timeout). | The opening starts timers immediately in `landing-entrance.tsx:157-183`; no home code calls `HTMLImageElement.decode()`. Five opening/Core `<img>` elements reuse the same URL (`landing-entrance.tsx:280-288`, `infrastructure-map.tsx:262-266`) without readiness ownership. | One bounded readiness owner; resolve, reject, never-resolve/timeout, unmount, and reduced-motion tests. Failure/timeout must complete into the usable static page exactly once. Reduced motion and user skip must not wait for the normal decode budget. |
| P0 | Visually hidden provider buttons remain keyboard/assistive-technology controls during the opening (R8; AC hidden controls inert). | Early phases set provider nodes to `opacity: 0` only (`index.css:1529-1577`, `1600-1625`). Buttons remain mounted with normal tab behavior (`infrastructure-map.tsx:236-254`). | Before visual availability, the provider group must be inert/unmounted/disabled in a way that removes it from tab order and the accessibility tree. At settlement/ambient, all visible controls regain `aria-pressed`, focus, hover, and click behavior. |
| P0 | The new 420ms settlement or decode preparation can leak into reduced-motion, pointer, Escape, or Tab skip paths (R7-R9; AC <=200ms and focus transfer). | Current reduced motion requests settle on a frame and uses a 210ms watchdog (`landing-entrance.tsx:157-169`). Pointer/keyboard skip shares `settleOpening()` (`140-144`, `185-191`). | Separate fast completion contract for reduced/skip. Real-browser duration from navigation/interaction to ambient must be <=200ms for reduced motion. Tab must focus the primary CTA after completion with no scroll; Escape/pointer must not steal focus. |
| P0 | Event/timer drift can still overlap assembly, aperture, hold, handoff, and settlement (R2, R3, R7; AC timing sequence). | JS timers and CSS durations are independent sources of truth. Current tests cover neither boundary. See `motion-timeline.md` for confirmed overlaps. | Component tests assert event order, one-shot completion, watchdog fallback, and cleanup. Browser timestamp captures prove visual completion and the 180-220ms stationary hold; unit tests alone cannot prove CSS animation completion. |
| P1 | Mobile aggregation may hide Gemini/Qwen only visually, leaving two extra focus targets, or make a non-interactive `+2 Models` label look interactive (R6, R8, R10). | All four buttons are currently always mounted; mobile CSS only repositions them (`index.css:1915-1944`). | At 375/390/430px, only OpenAI and Claude are in the accessibility/tab sequence. The localized aggregate is text, not a button, unless an actual interaction is implemented. Desktop still exposes all four buttons. |
| P1 | Custom URL/HTML/Markdown content may wait for Logo preparation or flash the default opening after the V4.1 refactor (R10; AC custom-home gating). | Cached content initializes `ambient` and renders immediately (`index.tsx:53-62`, `101-151`). Delayed content remains gated until ambient (`types.ts:62-67`). Current pure test covers this contract but not the rendered branch. | Keep the existing 14 tests green. If readiness/phase ownership moves into `Home`, add a render-level test showing cached URL/HTML/Markdown bypass the opening and delayed content cannot replace it before ambient. |
| P1 | Theme changes or cold dark reload can produce wrong V4 colors during the longer opening (R10; AC themes). | V4 tokens have explicit light/dark scopes (`index.css:457-485`). `ThemeProvider` applies the root class in `useEffect` (`theme-provider.tsx:91-107`), so there is no pre-paint inline theme bootstrap in `index.html`. Home sends resolved theme to a custom iframe on effect and load (`index.tsx:64-83`, `113-120`). | Cold-load and in-place switch screenshots in Light/Dark/System. Confirm no newly visible light flash, opening and settled colors agree, and custom URL homes still receive the resolved theme after load and on changes. Do not expand scope into a global theme rewrite unless the V4.1 change worsens the flash. |
| P1 | The new aggregation copy can be structurally present but untranslated or grammatically wrong (R10). | Seven locales are loaded with English fallback (`i18n/config.ts:32-49`). Existing `{{count}} models` translations do not preserve a leading `+`, while `+{{count}} more` does not express Models in every language. `sync-i18n` can fill missing values with a fallback and still finish successfully. | Use one `t()` interpolation key for the visible aggregate, supply deliberate translations in all seven locale files, run sync, review the report/diff, and visually inspect long translations at 375px. Do not concatenate `+` with the existing `{{count}} models` translation. |
| P1 | CSS-only responsive regressions can cause overlap, horizontal overflow, or fail the 10-18% next-section reveal (R6; AC viewport matrix). | Current mobile hero/stage minimums consume almost the full viewport (`index.css:1819-1828`), and Bun/Happy DOM cannot validate actual SVG/text geometry. | Fresh browser screenshots and `scrollWidth === clientWidth` at 375x812, 390x844, and 430x932 in both themes. Measure the next-section reveal; also check 320/359px as a fit fallback, without enforcing the percentage there. |
| P1 | New animation work can regress main-thread/compositor cost or bundle/asset weight (R9). | The current design mostly animates transform/opacity/SVG stroke, but includes masks, clip-path, filters, a large fixed overlay, and repeated Logo surfaces. No Lighthouse/Playwright budget exists. | Fresh production build size comparison, one Logo network transfer, no new dependency/media, no perpetual JS loop, no repeated layout reads per animation frame, and a production Performance/Lighthouse recording under mobile throttling. Investigate any >5 KiB gzip home-chunk increase or new long task >50ms. |
| P1 | Final semantics can pass visually without a page main landmark or correct document language. | `PublicLayout` omits `<main>` whenever `showMainContainer={false}` (`public-layout.tsx:49-55`), which is the default V4 path. `index.html` fixes `<html lang="en">`; no runtime `documentElement.lang` update was found. | Record these as existing global accessibility gaps. Do not silently widen V4.1 beyond R1, but ensure the change introduces no additional landmark/language regression and that the new label has a meaningful accessible reading. |
| P2 | CSS reduced-motion coverage may be weakened while JS still takes the fast branch. | The landing-specific reduced-motion block disables opening/settlement animations, route pulse, CTA travel, and Core response (`index.css:2029-2097`). | Static CSS review plus browser animation inspection: no spatial travel, route pulse, sheen, node settle, or CTA transform when reduced motion is active. A JS-only test is insufficient. |
| P2 | Full-lint baseline or stale `dist` can be mistaken for the V4.1 result. | Full lint currently fails; existing `dist` predates the final implementation. | Capture commands and timestamps in check results. Use affected-file lint as the scoped gate and rebuild before measuring output. Never report stale `dist` sizes as final. |

### Exact automated tests to add

Use Bun's existing test stack and place all new tests under `web/src/features/home/__tests__/`. Do not add Vitest, Testing Library, axe, or Playwright for this bounded task.

1. `landing-entrance-lifecycle.test.tsx`

   - When Logo readiness resolves, phases occur in causal order and completion fires once after settlement.
   - The full lockup does not begin handoff until its completion signal and hold have both completed; test the chosen 180-220ms hold contract without sleeping by controlling timers/events.
   - Settlement remains owned long enough for its completion signal/watchdog and does not become ambient on the overlay's earlier opacity transition alone.
   - Decode rejection starts the static failure fallback and calls completion once.
   - A never-settling decode promise reaches the same fallback at the bounded timeout.
   - Unmount before decode/timer completion prevents callbacks and clears all owned timers, animation listeners, frames, and observers.
   - Reduced motion bypasses normal phase/hold/settlement delays, emits no spatial phase sequence, and reaches completion on the fast path.
   - Pointer, Escape, and Tab each skip once. Only Tab requests CTA focus, and focus still uses `{ preventScroll: true }`.

2. `infrastructure-map-accessibility.test.tsx`

   - In every pre-settlement phase, provider controls are not focusable or exposed as active controls through the chosen inert/disabled/unmounted contract.
   - Once visually available, OpenAI/Claude/Gemini/Qwen are buttons with accessible names and `aria-pressed="false"`.
   - Click or keyboard activation toggles only the chosen provider to `aria-pressed="true"`; a second activation clears it.
   - Focus produces the same active-route state as hover without changing the persistent selected state.

3. `mobile-topology.test.tsx` if mobile membership is controlled in JSX; otherwise keep this as a browser-only CSS test.

   - Mobile renders/navigates only OpenAI and Claude controls plus a non-interactive localized aggregate for the remaining count.
   - Desktop retains four controls and no aggregate replacement.
   - The aggregate uses interpolation and is not assembled from an unlocalized `+`, number, and noun.

4. Preserve and extend current contracts only when ownership changes.

   - Keep `custom-home-gating.test.ts` exhaustive over every `OPENING_PHASES` member. If a phase is inserted, the existing loop must continue to allow delayed custom content only at ambient.
   - Keep `opening-focus.test.ts` as the small focus-helper contract even if the lifecycle test also covers Tab skip.
   - Add a render-level cached/delayed custom-home test only if `Home` or readiness ownership changes; avoid duplicating the pure helper test otherwise.

Test mechanics should match `api-key-group-cell.test.tsx`: controlled Happy DOM globals, `act`, `createRoot`, a local i18next instance, explicit fixtures, and cleanup. Stub only browser boundaries (`matchMedia`, `HTMLImageElement.decode`, timers, RAF, `ResizeObserver`); do not mock the component being tested or use real-time sleeps.

### Required browser checks

Automated Bun tests cannot validate CSS animation completion, SVG topology, alpha-mask handoff, contrast, layout, or real focus order. Final review must use a production build and cover:

| Matrix | Checks |
| --- | --- |
| Desktop normal motion | 1430x894 Light and Dark. Capture assembly complete, aperture complete, lockup start, hold start/end, handoff land, settlement end, and ambient. Confirm no duplicate/snap/blank frame. |
| Mobile settled | 375x812, 390x844, and 430x932 in Light and Dark. Confirm Client above Core, two named providers, localized aggregate, no radial four-node layout, no overlap/overflow, and 10-18% next-section reveal where height permits. |
| Mobile fallback | 320x568 and 359px width. Fit and usable controls take priority over the reveal percentage. Confirm no horizontal scrolling. |
| Reduced motion | Desktop and 390x844 mobile. From cold navigation to complete static ambient state <=200ms; no spatial travel, route pulse, sheen, or node-settle animation. |
| Input | Trigger pointer, Escape, and Tab during early assembly, brand hold, and handoff. All skip promptly; Tab lands on the primary CTA without scroll. Tab order never enters invisible providers. |
| Provider interaction | Keyboard focus, Enter/Space, pointer hover, click-on/click-off in both themes. Active route, contact, and `aria-pressed` agree. Mobile has only two provider focus stops. |
| Decode failure | Disable cache and block `landing-brand-core.png`, then test a never-completing/slow request. The page must reach usable static content through the bounded fallback, with no blank fixed overlay. |
| Custom home | Cached URL, cached HTML, cached Markdown, delayed URL/HTML/Markdown, empty response, and request failure. Cached content bypasses the opening; delayed content cannot replace it before ambient. URL iframe still receives theme and language on load/change. |
| Routing | Logged-out CTA points to `/sign-up`; authenticated CTA points to `/dashboard`; configured external docs opens safely, and an internal docs path remains router navigation. |
| Theme/i18n | Cold Light/Dark/System reload and live switches. Cycle all seven locales at 375px and desktop; the aggregation label, Hero, Core label, and CTA neither clip nor overlap. |
| Performance | Production Network and Performance/Lighthouse recordings with cache disabled and mobile CPU/network throttling. Confirm one Logo transfer, no new media/dependency, no long animation-frame JS loop, no layout shift from decode, and no task-added long task >50ms. Use Core Web Vitals good thresholds (LCP <=2.5s, CLS <=0.1, INP <=200ms) as diagnostics, not as localhost-only proof of field performance. |
| Forced colors | Windows forced-colors/high-contrast check: focused/selected providers remain distinguishable and route meaning is not carried by color alone. |

### Authoritative commands

Run from `web/` unless stated otherwise. The final check agent should record fresh output, not infer success from an earlier run.

```powershell
bun install --frozen-lockfile
bun test src/features/home/__tests__
bun run oxlint -c .oxlintrc.json src/features/home/index.tsx src/features/home/types.ts src/features/home/components/landing-entrance.tsx src/features/home/components/infrastructure-map.tsx src/features/home/components/sections/hero.tsx src/features/home/lib/opening-focus.ts src/features/home/__tests__/custom-home-gating.test.ts src/features/home/__tests__/opening-focus.test.ts src/features/home/__tests__/landing-entrance-lifecycle.test.tsx src/features/home/__tests__/infrastructure-map-accessibility.test.tsx src/features/home/__tests__/mobile-topology.test.tsx
bun run i18n:sync
bun test
bun run build:check
bun run format:check
bun run copyright:check
bun run preview -- --host 127.0.0.1 --port 4173 --strict-port
```

Omit a named new test path only if that test was correctly classified as browser-only and was not created. Add every other changed TS/TSX file to the oxlint command. `bun run build:check` is the package's combined `tsgo -b && rsbuild build` gate and satisfies both typecheck and production build; running `bun run typecheck` separately is optional duplication unless the task checklist requires distinct logs.

After `bun run i18n:sync`, inspect `_reports/_sync-report.json` and all locale changes. The command rewrites locale files and reports; a zero exit code does not prove that the new label has a human-quality translation.

Run from the repository root after build/review:

```powershell
git diff --check
git diff --exit-code d0719ebb -- web/public/landing-brand-core.png
git diff -- web/package.json web/bun.lock
```

The asset command enforces R4's byte-for-byte baseline. The package/lock diff must show no dependency addition. The researcher did not run git commands due role isolation; these are handoff commands for implementation/check.

For a fresh size diagnostic after build:

```powershell
Get-Item web/dist/landing-brand-core.png | Select-Object FullName,Length
Get-ChildItem -Recurse -File web/dist/static/js -Filter '*.js' | Select-String -SimpleMatch '/landing-brand-core.png' | Select-Object -ExpandProperty Path -Unique | Get-Item | Select-Object FullName,Length
Get-ChildItem -Recurse -File web/dist/static/css -Filter '*.css' | Sort-Object Length -Descending | Select-Object -First 5 FullName,Length
```

### External references

- MDN, `HTMLImageElement.decode()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode - the promise resolves when image data is decoded and ready to render; rejection/fallback must be handled.
- MDN, `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion - user preference applies to non-essential motion, including transform-based travel.
- MDN, HTML `inert`: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert - inert descendants are removed from focus navigation and the accessibility tree, matching the hidden-control requirement.
- W3C WCAG 2.2, Focus Order (2.4.3): https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
- W3C WCAG 2.2, Animation from Interactions (2.3.3): https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- W3C WCAG 2.2, Non-text Contrast (1.4.11): https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- web.dev, Core Web Vitals thresholds: https://web.dev/articles/vitals
- Local tool versions observed: Bun 1.3.14 (also CI-pinned) and Rsbuild 2.1.11.

### Related specs

- `.trellis/tasks/08-14-zzapi-landing-v4-1/prd.md` - R2/R7/R8/R9/R10 and all acceptance checks.
- `.trellis/tasks/08-14-zzapi-landing-v4-1/research/motion-timeline.md` - timing and settlement source of truth; this file does not duplicate its proposed schedule.
- `.trellis/tasks/08-14-zzapi-landing-v4-1/research/visual-topology.md` - Logo scale, contrast, mobile membership, and viewport source of truth.
- `.trellis/workflow.md` - persisted research and phase requirements.
- `.trellis/spec/guides/code-reuse-thinking-guide.md` - keep one readiness/timeline owner and do not duplicate phase constants.
- `.trellis/spec/guides/cross-layer-thinking-guide.md` - trace phase -> DOM attribute -> CSS -> accessibility and custom-home/theme boundaries.
- `web/AGENTS.md` sections 3.1, 3.4, 3.12, 3.14, and 3.16 - i18n, performance, accessibility, tests, and build requirements.

## Caveats / Not Found

- No repository Playwright/Cypress, axe, Lighthouse CI, Vitest config, visual-regression harness, bundle budget, or automated CSS animation test was found. Browser review is therefore an explicit acceptance gate, not optional polish.
- The existing `dist` sizes were read from a local 2026-08-14 build but were not rebuilt after concurrent planning/research changes. They are diagnostic only.
- Full `bun run lint` is not currently clean. The V4-targeted command passed, but final verification must include every actually changed file and must not hide new errors behind the unrelated baseline.
- The current theme is applied after React mounts, and the document language remains statically `en`; both are pre-existing global concerns outside the narrow V4.1 scope. Escalate only if V4.1 makes either behavior worse or the user expands scope.
- Happy DOM can verify DOM contracts and controlled callbacks, but not real media-query layout, CSS transition/animation completion, SVG placement, contrast compositing, image paint timing, or browser focus behavior under `display:none`/`inert`. Those require the browser matrix above.
- Research was read-only except for this artifact. Focused Bun tests and lint were run; typecheck, build, i18n sync, format, copyright, git, and browser checks were intentionally left for implementation/check because they either mutate output or require the final code.
