# Decisions — Toronique

webflow-audit › 3. One decision per entry: what, who, when, what it means.

## 2026-11-20 · Repo on the agency template

- **What:** Toronique's custom code moves from `hamounbv/toronique`
  (personal account) to `brandvm/wf-toronique`, created from
  `brandvm/wf-template` 1.0.0 (public, so jsDelivr can serve tags).
- **Who:** the team (plumbing; tracker TQ-08 "A decision for the team").
- **Means:** nothing changes for visitors until the parity release
  (TQ-01) is published. Until then the live site keeps loading
  `hamounbv/toronique@1.0.0`.

## 2026-11-20 · The parity release ports what is live

- **What:** TQ-01 ports the code as published on 2026-11-20
  (`legacy/published-2026-11-20/`), not the `hamounbv/toronique` repo's
  snippets, which differ from live (see `ROLLBACK.md`).
- **Who:** Claude, from the read-only audit; to be confirmed by the team
  with the TQ-01 plan.
- **Means:** no fix rides along with the move (the doubled stylesheets,
  Phosphor weights, Lenis version stay as they are); each is its own
  measured batch later.
