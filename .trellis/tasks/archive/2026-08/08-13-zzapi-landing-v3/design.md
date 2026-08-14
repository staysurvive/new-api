# Technical Design

Keep the V2 component boundaries. The entrance remains a fixed inert overlay;
the homepage remains mounted underneath it. Refine only the landing-scoped CSS
and the Hero/Gateway markup required for hierarchy.

The signature uses a single masked gradient sheen over the official mark plus
two low-opacity diagonal route rails. The measured core anchor remains the only
handoff coordinate. During transfer, the entrance wordmark exits before the
Gateway mark reveals, avoiding two readable lockups at once.

No network state drives animation timing. The existing custom-content hook may
gate whether the default branch mounts, but the entrance timeline itself stays
deterministic.
