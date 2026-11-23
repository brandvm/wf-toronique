# Plan — next batches (proposal, 2026-11-20)

Nothing here has been done in Webflow. Each batch: prepare in the repo →
the person's go-ahead → apply in Webflow → publish to `toronique.webflow.io`
only → verify → the person checks for other pending changes → the person
types **publish** → live → verify again (webflow-audit › 6).

**Before the first staging publish:** Home has edits from 2026-11-16 that
were never published (last publish 2026-10-27). A staging publish sends
them to `toronique.webflow.io`, and the later live publish sends them to
`www.toronique.ca`. Someone has to say whose they are and whether they can
go out. Also still open: the Webflow backup (MANUAL-TODO A).

## Batch 1 — TQ-01 parity release

Goal: the same CSS and JS, served from `brandvm/wf-toronique` instead of
`hamounbv/toronique@1.0.0`, through the template's loader. Nothing a visitor
can see changes. No fix rides along.

### In the repo (no Webflow write)

1. `src/styles.css` = `toronique.css` from `hamounbv/toronique@1.0.0`,
   word for word. The template's foundation CSS (§01 scaling, resets,
   `is-loading` lock) is **not** shipped: it would change the site's look.
   It stays out until a later, measured batch.
2. `src/legacy/toronique.js` = `toronique.js` at the tag, word for word,
   imported from `src/index.ts`. It already copes with running after
   DOMContentLoaded (it checks `readyState`), which the footer loader needs.
3. Lenis 1.1.5 bundled (`pnpm add lenis@1.1.5`) and set on `window.Lenis`
   before the legacy file runs. The footer loader adds the bundle
   dynamically, so the separate Lenis `<script defer>` would no longer be
   guaranteed to run first (AGENTS.md). The Lenis CDN tag goes.
4. The template's three starter modules stay (they act only on
   `data-aria-role`, `data-placeholder` and duplicate CMS radio ids; the
   parity check shows whether they touch anything).
5. Stays exactly where it is in Webflow: Phosphor ×3 (CDN), the head
   `<style>` (badge hiding, Lenis CSS), the JSON-LD, Ahrefs, the two inline
   footer scripts (lead attribution, GA4 `generate_lead`), the lightbox
   `<style>`, Swiper (the legacy code loads Swiper 11 itself).
6. Check before anything goes to Webflow: `pnpm build && pnpm test`, then
   **`wf:parity --live`** with `parity.oldAssets` mapping the hamounbv CSS
   and JS to `dist/` and the Lenis CDN file to nothing. It renders every key
   page at four widths both ways and compares every element's computed
   style and box. Target: 0 differences (a `--control` run first gives
   the noise). Plus `wf:film` for the first second of loading.
7. Tag `v1.0.0` on the commit whose CI passed (jsDelivr then serves
   `brandvm/wf-toronique@1.0.0/dist/`).

### Status (2026-11-23): repo side done, branch `tq-01-parity`

- `src/styles.css` = legacy `toronique.css` byte for byte under a header
  comment; `src/legacy/toronique.js` = legacy `toronique.js` byte for byte
  between two wrapper lines (`export default function runToronique() {` … `}`),
  run through `run('toronique', …)` so an error in it stays inside it, as
  in its own `<script>` (the template tests have no GSAP, and the Lenis
  block's `ScrollTrigger` reference threw and stopped the whole bundle
  before the wrap). Lenis 1.1.5 bundled and set on `window.Lenis` first.
- `pnpm check` and `pnpm test` pass (20 browser tests, 46 node checks).
  `dist/`: index.js 24.8 kB, styles.css 7.7 kB.
- **`wf:parity --live`**, 6 key pages × 4 widths, old hamounbv CSS/JS →
  `dist/`, Lenis CDN → nothing: same element count and classes on all 24
  renders, no new errors. Remaining differences are noise: the
  `.w-container` auto side margins at 1440 (0 ↔ 113–130 px; the
  `--control` run, published vs published, shows the same) and a 1/64 px
  top margin on `.project-card-visual-w` that comes and goes between
  identical runs (no rule in this CSS sets it). Custom-property *text* is
  ignored (`parity.ignore`): esbuild writes `.54902` for `0.54902`; the
  computed styles that use them are compared.
- Not checkable before Webflow: the load sequence with the new loader
  (`wf:film`) and the CSS arriving through Embed 2a; both on staging.

### Status (2026-11-23): merged and tagged

- PR brandvm/wf-toronique#1 merged (c7ed5d0). Master CI: test and deploy
  passed; `brandvm.github.io/wf-toronique/` styles.css and index.js are
  byte-identical to `dist/`.
- Tag `v1.0.0` on c7ed5d0; `cdn.jsdelivr.net/gh/brandvm/wf-toronique@1.0.0/dist/`
  serves both files byte-identical. `RELEASE = "1.0.0"` is what the head
  code will carry.

### In Webflow (after the go-ahead; through `webflow-toronique`)

| Where | Now | After |
| --- | --- | --- |
| Site head code | `…hamounbv/toronique@1.0.0/css/toronique.min.css` link | link removed; template piece 1 added with `RELEASE = "1.0.0"` (keeping the site's own `theme-color #ffffff`, not the template's) |
| `G \| Embed Code` (every page) | 3 Phosphor links + `toronique.min.css` link + lightbox `<style>` | 3 Phosphor links + lightbox `<style>` kept; `toronique.min.css` link replaced by 2a (`#wfc-css`, staging sheet) and 2b (its script) in a second Embed directly after |
| Site footer code | Lenis CDN + `…hamounbv…/toronique.min.js` + 2 inline scripts | template piece 3 + the 2 inline scripts, unchanged |

Head and footer through the connector's freeform-code write; the Embeds in
the Designer (the connector's Designer tools need the Designer open; if
they can't, it becomes a MANUAL-TODO row with the exact text).

### Verify

- Staging (`toronique.webflow.io`, loads the GitHub Pages bundle): the
  key pages at four widths against the 2026-11-20 baselines (noise floor
  0 %), `wf:html` and the console, and by hand: nav shrink, swipers,
  Shift+G, go-to-top, count-up counters, smooth scroll, icons, the forms
  (hidden lead fields filled, `generate_lead` on success: test submission
  only with the person's OK).
- Live after "publish": the same, `--live`, and the Network tab shows no
  `hamounbv` request. Rollback: re-paste `legacy/published-2026-11-20/`
  (ROLLBACK.md), or set `RELEASE` back once there is an earlier tag.
- After a quiet week: the `hamounbv/toronique` repo can be archived (not
  deleted: its tag still backs the rollback).

## Batch 2 — SEO (TQ-02 to TQ-05)

One batch or split, the person's choice; all are page and CMS settings, no
repo code. Measured now (2026-11-20, `wf:seo`, published HTML):

| ID | Found | Proposed fix | Where | Needs |
| --- | --- | --- | --- | --- |
| TQ-02 | `/services` H3s read "0 1 Design-Build Services": the number is a `<sup>` inside the `<h3>` | move the `<sup>` out of the H3 into the same wrapper, so the heading is the name only; look unchanged (check the baseline) | Services page, Designer structure | go-ahead |
| TQ-03 | `&amp;` inside the Service JSON-LD on 5 service pages (Webflow HTML-escapes CMS text bound into the template's head code: "Garden Suites &amp; Laneway Homes", "Design &amp; Build", "Additions &amp; Extensions") | **recommended:** a plain-text CMS field "Schema name" (and description) without `&`, bound into the JSON-LD instead of Name; or write "and" in the names (visible copy change: the client's call) | Services collection + template head code | decision |
| TQ-04 | `llms.txt` (served by Webflow) lists "Commercial General Contracting" → `/services/commercial-general-contractor`, which 301s to `/services`; its summary repeats the claim | drop the entry and "commercial general contracting" from the summary (or point it at a real page if the service is coming back) | Site settings › SEO › llms.txt | decision: drop or keep |
| TQ-05 | no `og:url` on the 7 service pages (static pages have it in page code); `/contact` title 66 characters, description 172; `/portfolio` description 164 | `og:url` in the Services template head code (`https://www.toronique.ca/services/{slug}`); new `/contact` title ≤ 60 and the two descriptions ≤ 155 | template head code; page settings | copy approval for the 3 texts (drafts in the batch) |

Verify: `wf:seo --live --canonical` 0 findings on these, Rich Results test
on one service page, `wf:outline` on `/services`, baseline compare on
`/services` (TQ-02 must not move anything).

## Then

TQ-06 speed (measured batches), accessibility quick wins (select labels,
link names, map iframe title), TQ-07 copy (needs the client).
