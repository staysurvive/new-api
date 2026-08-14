# zzapi V4.1 precision polish

## Goal

Refine the approved V4 homepage so the official zzapi mark is fully formed,
held as a readable brand lockup, and then becomes the live Gateway Core through
one continuous opening sequence. Improve the static Gateway hierarchy and the
mobile reading order without changing the V4 page structure, content strategy,
or visual language.

## Background

The clean baseline is commit `d0719ebb` (`feat(web): build zzapi spatial core
entrance`). The current `/` implementation already contains the approved V4
Hero, CTA placement, neutral canvas, diagonal opening geometry, Gateway Core,
provider interactions, theme support, reduced-motion branch, and custom-home
gating.

The V4 audit identified four concrete defects:

- phase timers advance before Logo assembly, aperture, and wordmark transitions
  finish;
- the complete `Logo + zzapi` lockup has no readable hold before handoff;
- transparent padding makes the official mark optically smaller than its CSS
  box, while static routes and provider ownership are too faint;
- the mobile four-node radial topology obscures the intended
  `Client -> zzapi Core -> Models` reading order and consumes the viewport.

The official asset is `web/public/landing-brand-core.png`. It remains
byte-for-byte unchanged; transparent padding is handled within stable wrappers.

## Requirements

### R1 - Preserve V4

- Keep the existing homepage sections, Hero copy, CTA content and destination
  logic, navigation, Gateway concept, and overall geometry.
- Preserve the current component boundaries unless a minimal contract change is
  required for phase ownership or accessibility.
- Limit product changes to `/` and its landing-specific components, styles,
  tests, and translations.

### R2 - Causal opening timeline

- Enforce this order: assembly complete -> aperture complete -> full brand
  lockup -> 180-220ms stationary hold -> handoff -> Gateway/Hero settlement ->
  ambient interaction.
- Do not let a later phase override an active assembly, aperture, lockup, or
  settlement animation.
- Keep the overall opening fast enough for a landing experience; target idle at
  roughly 1950ms, with a bounded fallback for stalled events or asset failure.

### R3 - Brand lockup and handoff

- Show a complete, readable `[Logo] zzapi` lockup without moving, scaling, or
  fading it during the brand hold.
- Move the Logo to the existing Gateway Core anchor and the wordmark to a stable
  final brand anchor without introducing a second Hero headline.
- Preserve the visual statement `Gateway Core = zzapi` after the proxy handoff.
- Avoid duplicate marks, snapping, blank interstitials, or a detached Hero fade.

### R4 - Official Logo presence

- Keep `web/public/landing-brand-core.png` unchanged.
- Increase the visible mark artwork by approximately 30-45% inside the existing
  opening/Core anchor boxes.
- Do not shift the Core anchor, enlarge the entire Gateway by the same ratio, or
  compromise surrounding whitespace.

### R5 - Desktop Gateway readability

- Preserve the desktop topology and Hero layout.
- Make the static `Client -> zzapi Core -> Models` relationship understandable
  without hover or animation.
- Strengthen the input/output route hierarchy and Core lockup with restrained
  contrast; do not add neon or new effects.
- Tighten the provider cluster enough that nodes read as Core-owned endpoints,
  not unrelated decoration.

### R6 - Mobile Gateway

- Replace the four-node radial reading order with a compact
  `Client -> Core -> two named models -> +N` composition.
- Place Client above the Core, keep the Core dominant, and keep all labels and
  routes free of overlap at 375px, 390px, and 430px widths.
- Reveal approximately 10-18% of the next section on common mobile heights
  without adding a scroll prompt.
- Preserve restrained route and label contrast in Light and Dark themes.

### R7 - Complete settlement

- Keep the overlay lifecycle independent from the shared semantic phase long
  enough for the longest Gateway and Hero settlement animation to finish.
- The final homepage must feel like the opening settled into place, not like a
  new page appeared after the overlay disappeared.

### R8 - Accessibility and input

- Reduced-motion users must reach the stable final homepage within roughly
  160-200ms without spatial travel or waiting for the full sequence.
- Preserve pointer skip, `Escape` skip, and `Tab` skip with focus transfer to
  the primary CTA.
- Model controls hidden during the opening must not be keyboard-focusable or
  exposed as interactive controls before settlement.
- Preserve provider `aria-pressed`, hover, focus, and click behavior once the
  Gateway is interactive.

### R9 - Performance and failure behavior

- Prefer transform, opacity, masks, and SVG stroke animation; do not animate
  full-width layout properties or add a perpetual JavaScript loop.
- Bound Logo decode preparation and fall back to the complete static homepage
  on decode failure or timeout.
- Do not add a dependency, video, WebGL, particle system, or large blur field.

### R10 - Compatibility and localization

- Preserve cached and delayed custom URL/HTML/Markdown homepage behavior.
- Preserve authentication-aware CTA destinations, docs routing, theme switching,
  and all non-home routes.
- Route any new visible aggregation label through i18n and keep all seven locale
  files synchronized.
- Preserve protected New API and QuantumNous metadata and attribution.

## Acceptance Criteria

- [ ] Assembly visibly completes before aperture or handoff begins.
- [ ] Aperture reaches its intended visual end state before expansion replaces
      it.
- [ ] The complete `[Logo] zzapi` lockup remains stationary and readable for
      180-220ms.
- [ ] Logo and wordmark land on stable final anchors without duplicate, snap, or
      brand disappearance.
- [ ] Gateway and Hero settlement finish before the shared phase becomes
      ambient.
- [ ] Visible Logo artwork is 30-45% larger while the Core anchor and desktop
      composition remain stable.
- [ ] A static desktop screenshot communicates
      `Client -> zzapi Core -> Models` in Light and Dark themes.
- [ ] Mobile shows Client above Core, two named providers, and a localized `+N`
      aggregation; the radial four-provider layout is absent.
- [ ] At 375x812, 390x844, and 430x932 there is no overlap or horizontal
      overflow and 10-18% of the next section is visible where the viewport
      height permits.
- [ ] Reduced motion reaches the complete static state within 200ms; skip and
      keyboard focus behavior remain correct.
- [ ] Hidden provider controls are inert until visually available.
- [ ] Logo decode failure/timeout cannot leave a blank opening.
- [ ] Custom-home gating, auth CTA routing, themes, and provider interactions
      retain their existing behavior.
- [ ] Targeted tests, i18n sync, affected-file lint, typecheck, production build,
      copyright check, and `git diff --check` pass.
- [ ] Final desktop/mobile opening frames and settled Light/Dark screenshots are
      visually reviewed against all requirements.

## Out of Scope

- New homepage sections, Hero/Gateway sections, headlines, or CTA strategy.
- A giant `zzapi` Hero headline or V5-style page recomposition.
- New visual effects, particles, 3D, shaders, backgrounds, floating cards, or
  loading UI.
- Changes to the official Logo asset, backend, APIs, dashboard, login, billing,
  permissions, or other business routes.
- New libraries or a generalized animation/design-system refactor.

## Planning Status

The user-provided implementation brief resolves product direction, scope, and
acceptance behavior. No blocking product decision remains. Technical research
will determine the smallest safe timing and CSS contract before implementation.
