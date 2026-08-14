# zzapi Brand V2 Design

## Preserve / Enhance / Remove

- Preserve the official logo, neutral theme, default-home sections, public
  layout, gateway-core concept, and every custom-home branch.
- Enhance the mark into a formal zzapi lockup, add stable landing brand colors,
  and use diagonal flow as the entrance and gateway's common axis.
- Remove the generic `API` entrance label, network-bound breathing screen,
  repeating small-logo sweep, circular orbit, and redundant hero status badges.
- Refactor only the default landing so opening and homepage share one space.

## Opening Storyboard

| Time | Action | Purpose |
| --- | --- | --- |
| 0-120ms | A neutral field covers header and homepage. | Establish focus without a loader. |
| 120-330ms | A narrow 45-degree blue signal crosses center. | Introduce zzapi's motion axis. |
| 280-620ms | Three clipped official-logo views converge along rounded rails. | Suggest construction without redrawing the logo. |
| 580-820ms | The complete mark resolves and one highlight crosses its diagonal spine. | Create the sole high-energy signature moment. |
| 760-1040ms | Lowercase `zzapi` reveals and two quiet routes begin at the core. | Connect brand to infrastructure. |
| 960-1450ms | Routes extend, the field opens diagonally, and Hero/Gateway enter beneath. | Turn the event into the product space continuously. |

Reduced motion replaces this with a 160ms static lockup reveal.

## Component Design

- `Home` waits only to determine the content branch. The default branch mounts
  the opening and existing landing sections together.
- `LandingEntrance` is a fixed inert overlay above the header. Its CSS timeline
  owns the sequence and it unmounts after a deterministic duration.
- A local hook owns completion/reduced-motion state only, never request progress.
- `Hero` owns the stable zzapi lockup and focused copy.
- `InfrastructureMap` uses diagonal input/output routes. Hover and focus on a
  model highlight one route and trigger one restrained core response.

## Performance and Accessibility

- Animate transform, opacity, and limited clip-path only.
- Keep decorative DOM small and `aria-hidden`; overlay is pointer-inert.
- Use actual buttons for interactive model nodes and equivalent focus behavior.
- Recompose gateway nodes on mobile and remove nonessential traces on short UI.
- Reduced motion disables assembly, sweeps, route pulses, and travel effects.
