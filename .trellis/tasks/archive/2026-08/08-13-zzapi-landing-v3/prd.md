# zzapi landing V3 signature refinement

## Goal

Refine the existing zzapi V2 landing without rewriting its routing or custom
homepage branches. Make the first 1.5 seconds feel like a deliberate product
opening: the official Z mark assembles, receives a precise diagonal light
signature, and expands into the AI gateway space.

## Requirements

- Preserve the official `/landing-brand-core.png` asset unchanged.
- Preserve the existing measured Entrance -> Gateway Core handoff and all
  custom URL, HTML, and Markdown homepage branches.
- Increase the distinctiveness of the signature moment through one controlled
  diagonal light pass and a clearer core-to-route cause/effect.
- Remove redundant or generic visual noise from the first viewport; keep neutral
  dominant surfaces and restrained zzapi blue accents.
- Keep the default landing branded as lowercase `zzapi` while retaining the
  protected New API and QuantumNous attribution outside the default brand lockup.
- Improve Hero/Gateway hierarchy and mobile composition without touching other
  product pages.
- Support light/dark, reduced motion, delayed content response, refresh, and
  hard refresh without indefinite timing or clipping.

## Acceptance Criteria

- The first two seconds contain a visible sequence beyond a simple fade/scale:
  signal, geometric assembly, signature sweep, brand reveal, and spatial handoff.
- The signature sweep is singular, crisp, and derived from the logo's diagonal
  geometry; no particles, video, WebGL, or new dependency is introduced.
- Entrance and Gateway expose one shared core without simultaneous competing
  brand marks during the handoff.
- Hero text, CTA, gateway labels, and route lines remain readable at the eight
  required viewport widths with no horizontal overflow.
- Reduced motion reveals the static lockup and homepage within 200ms.
- `bun run i18n:sync`, typecheck, affected-file lint/format, build, and
  `git diff --check` pass.
