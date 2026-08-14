# zzapi Hero aperture occlusion fix

## Goal

Prevent the Z Aperture plane from slicing the Hero headline during settlement without changing the opening structure or duration.

## Requirements

- Keep the approved V4.1 Logo, Gateway handoff, Hero layout, copy, and overall
  opening duration unchanged.
- Once the opening reaches `settle`, the white Z Aperture planes must no longer
  occlude the Hero copy or produce partially sliced glyphs.
- Preserve the existing 320ms Hero copy settlement animation and the spatial
  reveal of the Gateway.
- Preserve the pending verified mobile fix that hides the redundant routing
  status label where translated copy can overlap the CTA row.
- Limit product changes to landing-page CSS; add no dependency or new effect.

## Acceptance Criteria

- [ ] At desktop Light and Dark viewports, no Hero glyph is partially covered
      at any sampled frame from handoff through ambient.
- [ ] The Hero copy remains hidden before settlement and appears as a complete
      group during settlement.
- [ ] Logo-to-Core handoff, total opening timing, Gateway routes, and final Hero
      layout remain unchanged.
- [ ] Mobile layouts retain the verified Client -> Core -> models composition
      without the redundant status-label overlap.
- [ ] Affected-file formatting, CSS/build checks, `git diff --check`, and real
      browser verification pass.

## Notes

- This is a lightweight visual regression fix. The aperture planes are no
  longer semantically useful after handoff completes, so settlement may remove
  their occlusion while the rest of the overlay finishes normally.
