# Research: V4.1 visual topology and responsive targets

- Query: Measure the approved V4 static visual baseline and define bounded V4.1 targets for Logo presence, desktop Gateway hierarchy, mobile topology, viewport height, and Light/Dark contrast without redesigning the page.
- Scope: internal
- Date: 2026-08-14

## Findings

### Files found

- `C:/Users/npp_c/.codex/attachments/e02a8324-f8dd-4250-aa75-3767866955f7/pasted-text.txt` - source V4.1 implementation brief and hard redesign boundaries.
- `C:/Users/npp_c/AppData/Local/Temp/zzapi-v4-audit-20260814/01-desktop-settled.png` - 1430x894 Light settled desktop baseline.
- `C:/Users/npp_c/AppData/Local/Temp/zzapi-v4-audit-20260814/02-opening-100ms-signal.png` through `08-opening-1680ms-removed.png` - desktop opening audit sequence.
- `C:/Users/npp_c/AppData/Local/Temp/zzapi-v4-audit-20260814/09-mobile-settled-390x844.png` - Light mobile settled baseline; the PNG raster itself is 380x822.
- `C:/Users/npp_c/AppData/Local/Temp/zzapi-v4-audit-20260814/10-mobile-dark-390x844.png` - Dark mobile settled baseline; the PNG raster itself is 380x822.
- `C:/Users/npp_c/AppData/Local/Temp/zzapi-v4-audit-20260814/11-mobile-dark-openai-active.png` - Dark active-route baseline; the PNG raster itself is 380x822.
- `web/public/landing-brand-core.png` - official 256x256 ARGB Logo asset; inspected read-only.
- `web/src/features/home/index.tsx` - mounts the fixed header, opening overlay, Hero, and unchanged below-fold section order; the landing Logo path is fixed here (`index.tsx:57`, `index.tsx:153-184`).
- `web/src/features/home/components/sections/hero.tsx` - approved Hero copy/CTA structure and the active `InfrastructureMap` mount (`hero.tsx:61-102`).
- `web/src/features/home/components/infrastructure-map.tsx` - current desktop/mobile SVG routes, Client, provider controls, Core Logo, and stable `zzapi` brand anchor (`infrastructure-map.tsx:47-284`).
- `web/src/features/home/components/landing-entrance.tsx` - measures wrapper boxes for the Logo and wordmark handoff (`landing-entrance.tsx:83-129`).
- `web/src/styles/index.css` - V4 palette, Hero sizing, topology, Core, opening, settlement, responsive rules, reduced motion, and forced colors (`index.css:457-2117`).
- `web/src/features/home/components/gateway-card.tsx` - legacy/unused card component. No import or mount was found; it is not the V4 Gateway to modify.

### Current static baseline

- The mounted V4 Gateway is `InfrastructureMap`, not `GatewayCard` (`hero.tsx:28`, `hero.tsx:70-75`).
- Desktop keeps the approved split composition: Hero copy on the left, Core at `66% / 50%`, Client at lower left, and four providers fanned on the right (`index.css:576-589`, `index.css:679-682`, `index.css:799-905`).
- The 1430x894 settled audit shows the next Stats band beginning at about y=827, or roughly 7.5% of the viewport. This desktop behavior is acceptable and is not the mobile-height defect.
- The mobile Light/Dark audits show all four provider nodes around the Core, while Client is below the Core. This reverses the requested reading direction and uses nearly the entire first viewport. No meaningful below-fold content is visible.
- In both mobile themes, the named labels remain legible, but the default routes are too faint to explain ownership. The Dark active screenshot proves the route geometry works when raised to active contrast; the static default is the problem.
- The audit opening frames show the proxy Logo and final Core sharing the same spatial anchor area. Optical enlargement must therefore keep the wrapper center stable and avoid a smaller proxy-to-larger-final size pop.

### Official PNG alpha bounds and optical scale

Read-only pixel inspection produced these bounds:

| Alpha threshold | Bounds (inclusive) | Artwork size | Canvas share |
| --- | --- | --- | --- |
| `alpha >= 1` | x=50..206, y=44..205 | 157x162 | 61.33% x 63.28% |
| `alpha >= 16` | x=52..204, y=46..203 | 153x158 | 59.77% x 61.72% |
| `alpha >= 128` | x=52..204, y=47..202 | 153x156 | 59.77% x 60.94% |
| `alpha >= 240` | x=53..203, y=47..202 | 151x156 | 58.98% x 60.94% |

At the stable `alpha >= 16` edge, the transparent margins are 52px left, 51px right, 46px top, and 52px bottom. The alpha-weighted centroid is `(128.18, 125.79)` versus canvas center `(127.5, 127.5)`, so the content is already centered closely enough; no Core-anchor translation is justified.

Current and target visible sizes use the `alpha >= 16` box. The V4.1 target is an internal artwork scale of `1.30-1.45`, with `1.35-1.40` the preferred QA starting range. The official PNG and the outer anchor boxes remain unchanged.

| Context | Existing outer box | Current visible artwork | +30% target | +45% upper target |
| --- | ---: | ---: | ---: | ---: |
| Desktop opening proxy | 144x144 | 86.1x88.9 | 111.9x115.5 | 124.8x128.9 |
| Desktop Core (`>=1280`) | 148x148 | 88.5x91.3 | 115.0x118.7 | 128.3x132.4 |
| Tablet Core (`1024-1279`) | 132x132 | 78.9x81.5 | 102.6x105.9 | 114.4x118.1 |
| Mobile opening/Core (`<=767`) | 112x112 | 66.9x69.1 | 87.0x89.9 | 97.1x100.2 |

The full antialiased `alpha >= 1` artwork also remains inside every existing wrapper at `1.45x`. This gives enough room to scale the Logo image and matching sheen/mask without scaling `.zzapi-core-mark`, `.zzapi-gateway-core`, energy, orbits, surrounding whitespace, or route coordinates (`index.css:908-947`).

Implementation implication: `measureTargets()` currently derives handoff scale only from outer wrapper widths (`landing-entrance.tsx:94-128`). If the child artwork is enlarged internally, the proxy's final optical scale must include the same factor. Otherwise the proxy lands at the old visible size and the real Core Logo appears 30-45% larger on settlement.

### Desktop Gateway target

Preserve the Core anchor at CSS `66% / 50%` and the SVG routing origin at `(660,310)`. Tighten only the provider fan.

The current provider contacts are far from the origin (`infrastructure-map.tsx:105-152`). Their viewBox-space distances are:

| Provider | Current contact | Current distance from Core | Target contact | Target distance | Change |
| --- | ---: | ---: | ---: | ---: | ---: |
| OpenAI | `(920,88)` | 342 | `(881,121)` | 291 | -15% |
| Claude | `(956,230)` | 307 | `(912,242)` | 261 | -15% |
| Gemini | `(936,420)` | 297 | `(895,404)` | 253 | -15% |
| Qwen | `(876,530)` | 308 | `(844,497)` | 262 | -15% |

Because the SVG uses `preserveAspectRatio='none'` (`infrastructure-map.tsx:63-68`), these distances are a topology measure, not literal screen pixels. At the 1280px map width, the proposed x shifts are about 50-56 CSS px. That is enough to make the endpoints Core-owned without changing the composition.

Corresponding node-position targets are approximately:

- OpenAI: `top 11-12%`, `right 4-5%` instead of `7% / 1%`.
- Claude: `top 30-31%`, `right 3-4%` instead of `29% / 0`.
- Gemini: `top 57-59%`, `right 4-5%` instead of `60% / 1%`.
- Qwen: `bottom 13-15%`, `right 10-11%` instead of `7% / 7%`.

The branch curves should be recomputed through the proposed contacts, retaining the existing four-route fan and calibration language. Do not move the Core left/right or introduce a card/container around the network.

Static hierarchy target:

- Client -> Core input: 1.75-2px visual stroke, continuous through most of the path, and the strongest idle route.
- Core -> provider branches: 1.5-1.75px, quieter than input and active state but clearly present without hover.
- Active branch: retain the existing approximately 2.25px/high-contrast behavior (`index.css:1013-1019`).
- Diagonal axis/calibration: remain decorative and faint; they must not carry topology meaning.
- Keep the existing neutral palette. Improve contrast with a darker Light neutral / lighter Dark neutral and opacity, not neon saturation, glow, or additional effects.

Core lockup target:

- The 30-45% internal Logo enlargement is the main hierarchy correction.
- Keep `zzapi` immediately below the Logo as the stable brand anchor (`infrastructure-map.tsx:257-283`). The current 1.45rem wordmark may rise only modestly, to roughly 1.50-1.60rem desktop and about 1.30rem mobile; it must not become a second Hero headline.
- Internal Logo scaling naturally reduces the current large optical gap caused by the transparent lower margin. Reassess before reducing `.zzapi-core-lockup` margin; do not compact both aggressively.
- Keep `Gateway Core` secondary, localized, and below `zzapi` (`index.css:964-993`).

### Mobile Client -> Core -> two models -> +2 target

The current mobile SVG still draws a four-node radial fan (`infrastructure-map.tsx:156-220`), while CSS places Core at x=62% and Client at the bottom (`index.css:1859-1948`). Replace that mobile-only topology with a centered, top-to-bottom composition. Desktop remains four named providers.

Recommended mobile visual order within the post-CTA map zone:

| Element | Horizontal target | Vertical target in map zone | Notes |
| --- | ---: | ---: | --- |
| Client | 50% | 8-12% | Centered above Core; retain icon, `Client`, and `One Key`.
| Core Logo center | 50% | 35-41% | Dominant element; keep 112px wrapper and enlarge only internal artwork.
| OpenAI / Claude row | 28% / 72% | 70-76% | Two named, interactive 44px-minimum targets.
| `+2 Models` summary | 50% | 88-92% | Localized aggregate, visually secondary to the named row.

A normalized 1000x620 mobile SVG can use Client near `(500,60-80)`, the input port near `(500,180)`, output origin below the Core lockup near `(500,360)`, named contacts near `(290,455)` and `(710,455)`, and the aggregate contact near `(500,555)`. This yields one central trunk and three clearly owned outputs without routing lines through the Logo or wordmark. Keep the V4 diagonal geometry as faint background structure, not as the semantic route.

Use OpenAI and Claude as the two named mobile providers because they are already the first two model entries (`infrastructure-map.tsx:27-32`). Gemini and Qwen should be represented by the localized `+2 Models` summary on mobile. Hidden model buttons must be `display:none`/unmounted at the mobile breakpoint so they do not remain focusable. The two visible provider controls keep the current `aria-pressed`, click, hover, and focus behavior (`infrastructure-map.tsx:236-254`).

The brief does not define an expansion interaction for `+2 Models`. Prefer a non-interactive summary rather than inventing a drawer/menu in V4.1. Desktop continues to expose all four interactive providers.

### Mobile viewport-height targets

The fixed Public Header does not consume document-flow height (`public-header.tsx:176-190`), so the target is the `.home-hero` block itself. For common portrait viewports, use an 82-90svh Hero range, nominally about 88svh. This naturally exposes 10-18% of the next section without a scroll label.

| CSS viewport | Acceptable Hero end | Acceptable next-section reveal | Preferred 88svh result |
| --- | ---: | ---: | ---: |
| 375x812 | 666-731px | 81-146px | Hero 715px / reveal 97px |
| 390x844 | 692-760px | 84-152px | Hero 743px / reveal 101px |
| 430x932 | 764-839px | 93-168px | Hero 820px / reveal 112px |

The present mobile rules combine `min-height: min(52rem, 100svh)` with a stage `min-height: 39rem`, which keeps the Gateway at almost a full viewport (`index.css:1819-1828`). The simplified topology should remove the 39rem floor for normal portrait heights and size the stage from the Hero target after its existing 4.75rem top / 1rem bottom padding. At widths below 359px, content fit and unclipped CTA controls take priority over forcing an exact reveal percentage (`index.css:2010-2026`).

Do not add `SCROLL`, a chevron prompt, or another visual control. The first rows of the existing Stats section are the cue.

### Light/Dark contrast observations and targets

Contrast values below composite the current CSS colors and opacities over the V4 canvas (`index.css:458-485`, `index.css:744-772`).

| Element | Light contrast | Dark contrast | Observation |
| --- | ---: | ---: | --- |
| Secondary text / labels | 6.16:1 | 9.00:1 | Passes AA for small text; do not make labels brighter merely for emphasis.
| Idle provider route at 0.56 | 1.64:1 | 1.75:1 | Too faint for data-bearing topology.
| Provider route faded endpoint (`0.56 * 0.42`) | 1.22:1 | 1.21:1 | Effectively disappears in both audits.
| Blue input route at 0.72 | 2.17:1 | 4.40:1 | Dark is adequate; Light is too weak.
| Decorative axis at 0.17 | 1.15:1 | 1.14:1 | Acceptable only because it is decorative.

Targets:

- Main input and provider branches should approach or exceed 3:1 composite contrast in their information-bearing segments, in both themes.
- Do not retain the current 0.42 endpoint fade on semantic branches. A mild fade is acceptable only if the contact and final segment remain clearly traceable.
- Keep model labels and Core secondary text on the existing secondary tokens; they already pass small-text contrast.
- Keep the diagonal axis/calibration below semantic-route contrast so the hierarchy is input -> Core -> outputs.
- Active/selected routes may keep the current brand blue and stronger stroke. Default comprehension must not rely on activating a provider.

### Explicit do-not-change boundaries

- Do not change Hero headline, description, CTA text, CTA destination logic, navigation, section order, or add a second large `zzapi` headline.
- Do not add a new Hero/Gateway section, card, floating panel, scroll prompt, background system, particles, 3D, shader, loading screen, glow system, or decorative route family.
- Do not move the desktop Core anchor, enlarge the Core wrapper/orbits by the Logo scale factor, or recompose the left/right desktop split.
- Do not modify, crop, regenerate, or replace `web/public/landing-brand-core.png`; handle transparent padding inside existing wrappers.
- Do not change the desktop provider count or names. Only mobile summarizes the trailing two as `+2 Models`.
- Do not change the header Logo size as collateral work; the measured V4.1 defect concerns the opening and Gateway Core anchors.
- Do not replace React, CSS, SVG, Tailwind, the animation approach, or add dependencies.
- Do not touch backend behavior, APIs, data structures, auth, dashboard, custom-home routing, or protected project metadata.
- Preserve Light/Dark neutral canvases, blue brand anchor, restrained whitespace, existing focus/selected semantics, reduced-motion final structure, and the approved V4 visual identity.

## External References

- W3C WCAG 2.1, Success Criterion 1.4.3 (Contrast Minimum): 4.5:1 for normal text. This aligns with `web/AGENTS.md` accessibility guidance.
- W3C WCAG 2.1, Success Criterion 1.4.11 (Non-text Contrast): 3:1 for visual information needed to understand UI components/graphics. Used as the target for semantic routes; decorative axes are explicitly excluded from carrying meaning.
- No external visual system or redesign reference was used. The approved V4 code and audit PNGs are authoritative.

## Related Specs

- `.trellis/tasks/08-14-zzapi-landing-v4-1/prd.md` - R1/R4/R5/R6 and acceptance criteria for V4 preservation, 30-45% visible Logo growth, desktop static readability, mobile aggregation, and 10-18% reveal.
- `.trellis/workflow.md` - research persistence and task workflow requirements.
- `.trellis/spec/guides/index.md` - shared planning/review guide index.
- `.trellis/spec/guides/cross-layer-thinking-guide.md` - boundary and impact checks; this change remains landing-frontend-only.
- `web/AGENTS.md` sections 3.10, 3.12, and 3.14 - responsive styling, WCAG AA/accessibility, and responsive behavior regression coverage.
- No dedicated `.trellis/spec/frontend/` package exists in this checkout.

## Caveats / Not Found

- The files named `390x844` are physically 380x822 PNGs. Treat their names as the intended browser viewport and use fresh browser measurements for final acceptance; do not derive CSS dimensions from the raster alone.
- The screenshots contain TanStack Router/dev overlays at the lower corners. These are not product elements and must not influence spacing decisions.
- The audit set has no settled desktop Dark screenshot. Desktop Dark conclusions are based on the same theme tokens plus the mobile Dark settled/active evidence; final implementation still needs a fresh desktop Dark capture.
- Screenshot-derived y positions are approximate. Alpha bounds, CSS boxes, SVG coordinates, and computed contrast values are measured from source and are the authoritative numeric inputs.
- No live app or new screenshot was produced in this research pass. The implement/check phases should validate 375x812, 390x844, 430x932, 1430x894, Light/Dark, default/active states, and horizontal overflow.
- The official PNG was opened read-only and remains byte-for-byte untouched.
