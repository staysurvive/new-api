# zzapi landing V2 brand entrance

## Goal

Turn the existing default `/` landing page into a memorable zzapi Brand V2
opening experience. The official zzapi logo must become the visual and product
core: its blue gradient, rounded diagonal geometry, and data-flow motion should
connect the opening, hero, and AI gateway visualization into one continuous
experience.

## Requirements

- Refine V1; do not rewrite unrelated sections or change product behavior.
- Apply the opening only to the built-in default landing. Preserve custom URL,
  HTML, and Markdown homepage branches exactly.
- Use the unchanged official `/landing-brand-core.png` asset as the final mark.
- Present a formal lowercase `zzapi` brand lockup on the default landing.
- Decouple opening timing from `/api/home_page_content`.
- Create one signature moment from the logo's rounded diagonal geometry and
  official gradient, without particles, loading UI, video, WebGL, or new deps.
- Keep the homepage mounted beneath the entrance and overlap the transition.
- Use landing-scoped colors `#1549F4`, `#5C8EFF`, `#7DAAFF`, `#AED1FF`, and
  `#E0F4FF`, while retaining neutral light/dark theme surfaces.
- Make the logo the gateway core with restrained diagonal data paths and
  cause-and-effect node interaction.
- Animate primarily transform and opacity; support reduced motion.
- Use i18next for new user-facing copy and preserve protected project identity.

## Acceptance Criteria

- [ ] First-load opening has a fixed 1.25-1.55 second sequence: empty space,
      signal, formation, signature sweep, zzapi reveal, and homepage expansion.
- [ ] The sequence is visibly more than logo fade/scale and derives its rounded
      diagonal geometry from the official logo.
- [ ] The entrance covers the fixed public header until spatial expansion.
- [ ] The default homepage identifies the product as `zzapi` and uses the
      official logo unchanged.
- [ ] Entrance, Hero, and Gateway share brand colors and one motion axis.
- [ ] Custom URL, HTML, and Markdown branches render without default UI flash.
- [ ] Reduced motion exposes the static lockup and page within 200ms.
- [ ] Light/dark themes keep readable contrast and neutral-dominant color.
- [ ] 1920x1080, 1440x900, 1280x720, 1024x768, 768, 430, 390, and 375 widths
      have no clipping, overlap, or horizontal page overflow.
- [ ] Mobile uses a recomposed Hero/Gateway instead of scaled desktop UI.
- [ ] Refresh, hard refresh, and delayed content response do not truncate or
      indefinitely extend the opening.
- [ ] i18n sync, typecheck, lint/format, build, and `git diff --check` pass.

## Notes

- Reference-site principles are used only for timing, hierarchy, spatial reveal,
  and brand focus. No layout, CSS, SVG, animation path, asset, or copy is copied.
