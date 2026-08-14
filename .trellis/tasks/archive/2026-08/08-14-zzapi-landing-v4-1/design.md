# zzapi V4.1 technical design

## Design intent

V4.1 keeps the approved V4 page and makes its existing opening causal. The
official mark is assembled, the Z aperture completes, the full `[Logo] zzapi`
lockup is held for 200ms, and the same mark lands in the existing Gateway Core.
The real Hero and Gateway remain mounted throughout; V4.1 changes when they are
revealed and how their existing topology reads, not what the homepage is.

The product boundary is the default `/` landing experience. Cached and delayed
custom URL/HTML/Markdown homes, authenticated CTA routing, docs navigation,
theme behavior, and every non-home route retain their current contracts.

## Existing architecture retained

```text
Home
  openingPhase
    -> root opening data attributes
    -> LandingEntrance overlay
    -> Hero
         -> InfrastructureMap

LandingEntrance proxy mark --------> existing Core anchor
LandingEntrance proxy wordmark ----> existing brand anchor
```

- `Home` remains the semantic phase owner and continues to gate delayed custom
  content until `ambient`.
- `LandingEntrance` remains the only opening scheduler, measurement owner, and
  skip/reduced-motion owner.
- `Hero` remains mounted below the overlay with unchanged copy and CTA logic.
- `InfrastructureMap` remains the Gateway renderer and continues to own model
  selection, hover/focus response, and both handoff anchors.
- `OpeningPhase` keeps the current values and ordering. No `hold` phase is
  added; the stationary hold is part of `lockup`.
- `web/src/styles/index.css` retains the V4 token system and animation language.
  Changes are limited to timing, optical Logo scale, route hierarchy, mobile
  topology, and lifecycle selectors.

## Opening lifecycle

### Normal-motion sequence

Normal progress uses the end of the visible work where the browser provides a
reliable event. Each event also has a bounded fallback so a missing transition
or animation event cannot trap the page.

| Milestone | Nominal time | Owner and completion rule |
| --- | ---: | --- |
| Signal | `0-180ms` | Entrance mounts after bounded Logo readiness; existing glint/signal plays. |
| Assemble | `180-520ms` | Existing slices assemble. The bottom slice completion advances to focus; timeout is fallback. |
| Focus | `520-730ms` | Final mark replaces slices and the focus field resolves; a short owned timer starts aperture only after the crossfade. |
| Ignite / aperture | `730-980ms` | Existing 250ms aperture runs to `animationend`; it is never canceled by expand. |
| Expand + lockup | `980-1260ms` | Spatial planes/routes open, then the existing wordmark completes its 260ms reveal. |
| Brand hold | `1260-1460ms` | Complete `[Logo] zzapi` stays stationary for 200ms with no travel, scale, fade, or Hero competition. |
| Handoff | `1460-1820ms` | Mark and wordmark proxies travel independently to the existing Core and brand anchors. Both filtered `animationend` events are required. |
| Settlement | `1820-2240ms` | Real Core, routes, nodes, header, and Hero settle. Overlay may fade visually, but semantic phase remains `settle` for the full 420ms child budget. |
| Ambient | `~2240ms` | `onComplete` runs once, opening attributes are removed, and the existing interactive homepage owns the screen. |

These are nominal paint times after Logo readiness. Browser event order, not an
absolute `2240ms` stopwatch, is the correctness contract. Visual tuning may
move a boundary by one frame or shorten a non-critical transition, but must not
violate the order or the 180-220ms hold.

### Event and fallback contract

- Assembly cannot advance before the final slice transform completes.
- Expand cannot replace the aperture until aperture `animationend`.
- Handoff cannot start before wordmark reveal completion plus the 200ms hold.
- Settlement cannot start until both handoff proxies land.
- `ambient` cannot start until the 420ms settlement budget completes.
- Per-milestone fallbacks sit beyond their normal CSS duration. A global
  watchdog sits beyond the full opening and resolves to the complete static
  homepage, never a partially assembled overlay.
- All timers, frames, observers, event listeners, and pending readiness work are
  retained by the component and canceled on skip, fallback, or unmount.
- Completion is idempotent. Racing animation events, skip input, and watchdogs
  can call the same completion path without double callbacks.

### Logo readiness and failure

`LandingEntrance` owns one `Image` readiness attempt for
`/landing-brand-core.png` before normal spatial motion begins. Cached/complete
images proceed immediately; otherwise `decode()` is awaited behind a short,
bounded timeout. Rejection or timeout bypasses the decorative sequence and
reveals the stable homepage. It does not retry, block custom-home content, or
change the asset pipeline.

Reduced motion and user skip bypass the normal decode/timeline budget. They use
the fast completion path and reach the static homepage within 200ms.

## Brand lockup and handoff

The existing opening Logo and `zzapi` wordmark form the only large entrance
lockup. During the 200ms hold:

- the mark and wordmark use their completed lockup transforms;
- aperture/plane motion has completed or is visually subordinate;
- Hero copy and model controls remain unavailable;
- no handoff transform has started.

Handoff continues to measure the real Core and wordmark anchors immediately
before travel. The mark and wordmark remain separate proxies so the Logo becomes
the Core while `zzapi` becomes the stable Core label. The real anchors are made
visible only as their proxies land, preventing duplicate marks or a blank frame.

## Logo optical scale

The official 256x256 PNG is immutable. Its stable visible alpha bounds occupy
about 60% of the canvas, so V4.1 scales the image artwork inside the existing
opening and Core wrappers rather than resizing or moving the wrappers.

- Initial target: `1.38x` internal artwork scale, visually QA-tunable within
  `1.30-1.45x`.
- The same optical factor applies to opening proxy, handoff landing math, final
  Core image, and matching sheen/mask surfaces.
- Core anchor, Core wrapper, orbits, route origin, and surrounding whitespace
  do not scale or translate.
- The source file must remain byte-identical to baseline SHA-256
  `A58D26790A7C571ACE684949255261FE3BB20AD6C3E4242B27ECD40F608DAC2C`.

## Gateway information hierarchy

### Desktop

Desktop preserves the V4 split Hero, Core anchor at `66% / 50%`, four named
providers, and current interaction model.

- Keep the Client-to-Core input as the strongest idle semantic route.
- Raise idle Core-to-model branches to readable neutral contrast in Light and
  Dark, while leaving calibration axes decorative and faint.
- Keep active route blue/weight stronger than idle routes.
- Move the four provider endpoints roughly 15% closer to the Core and recompute
  their existing curves; do not move the Core or add a container.
- Retain the existing Core lockup. Only modest wordmark sizing/spacing may be
  tuned after the internal Logo scale is visible.

### Mobile

At the existing mobile breakpoint, the visual order becomes:

```text
Client
  -> zzapi Core
  -> OpenAI    Claude
  -> +2 Models
```

- Client is centered above the Core.
- OpenAI and Claude retain the existing interactive button behavior.
- Gemini and Qwen are removed from mobile layout, tab order, and accessibility
  exposure with responsive `display: none`; desktop still exposes all four.
- `+{{count}} Models` is localized text, not a button, because V4.1 adds no
  expansion interaction.
- Mobile uses one central input trunk and restrained outgoing branches. The
  diagonal axis remains decorative rather than carrying the semantic reading
  order.
- The Hero targets roughly `88svh` at 375x812, 390x844, and 430x932 so 10-18%
  of the existing next section is visible. At 320/359px, fit and usable controls
  take priority over the reveal percentage.

## Accessibility and interaction contracts

- The model-control group is inert while its opening phase is visually hidden.
  At settlement/ambient it regains its existing accessible buttons,
  `aria-pressed`, hover, focus, click-on, and click-off behavior.
- Mobile-hidden providers use `display: none`, so they are not focus targets or
  accessibility-tree controls.
- The aggregation label is non-interactive and has a natural localized reading.
- Pointer, `Escape`, and `Tab` continue to skip. Only `Tab` transfers focus to
  the primary CTA, using the existing deferred focus helper with
  `preventScroll: true`.
- `prefers-reduced-motion: reduce` disables spatial travel, route pulse, sheen,
  and node/Hero settlement motion while preserving the full final information
  structure.
- Forced-colors rules continue to expose focus/selection without relying only
  on brand color.

## Performance strategy

- Use existing CSS transforms, opacity, masks, and SVG stroke animation.
- Do not animate layout dimensions across the viewport or add a JavaScript
  animation loop.
- Measurements happen at existing anchor boundaries and immediately before
  handoff, not every frame.
- Add no package, video, canvas, WebGL, particle system, or high-radius blur.
- One browser request/decode of the existing Logo URL is expected; repeated DOM
  uses share the browser resource.
- Compare the final production home chunk with the existing diagnostic baseline
  and investigate a task-caused increase above 5 KiB gzip or a new >50ms long
  task during the opening.

## Localization

The only planned new visible copy is `+{{count}} Models` for mobile. It is added
through `useTranslation()` and deliberate translations for all seven locales.
Locale JSON is updated through `web/scripts/add-missing-keys.mjs`, followed by
`bun run i18n:sync`; locale files are not edited manually.

## Compatibility and rollback

- No backend, API, data-model, route, dependency, protected metadata, or
  official asset change is permitted.
- Custom-home selection stays in `Home`; Logo readiness stays inside the
  entrance so cached custom homes never wait for it.
- The clean rollback baseline is commit `d0719ebb`.
- Implementation is split into reviewable checkpoints: lifecycle/tests first,
  topology/styles/i18n second, then browser tuning. If visual tuning regresses
  V4, revert only the tuning checkpoint while retaining verified lifecycle
  fixes.

## Trade-offs

- The nominal stable state is around 2.24s rather than forcing a 1.95s hard
  cutoff. This spends the extra time on the required aperture completion,
  200ms hold, and 420ms settlement instead of overlapping phases. The overlay
  visually clears near the start of settlement, so the page does not feel
  blocked for the full semantic lifecycle.
- Responsive CSS keeps provider membership simple and dependency-free. It is
  verified in real browsers because Happy DOM does not evaluate layout media
  queries.
- Existing global `<main>` and runtime document-language gaps are recorded but
  remain out of scope; V4.1 must not worsen them.
