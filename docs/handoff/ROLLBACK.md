# Rollback — Toronique

webflow-audit › 4. Rollback point, before the first write.

## The rollback point (2026-11-20)

What is live on `www.toronique.ca` today was read from the published HTML
of all 14 sitemap pages and the 404 page on 2026-11-20. Nothing in this
repo is live yet: the site's custom code still loads from
`hamounbv/toronique@1.0.0` (a personal GitHub account) through jsDelivr.

- **Git tag:** `rollback-2026-11-20` on the commit that adds this file and
  `legacy/`. It marks "the live site as it was before this repo served
  anything". The commit itself changes nothing on the site.
- **Code as it is now, word for word:** `legacy/` (below).
- **Webflow backup:** [Person] Site settings › Backups › create one named
  `2026-11-20 before wf-template` (not done yet; see MANUAL-TODO).
- **Branch protection** on `master`: [Person] (not done yet).

## What is live (read from the published HTML, 2026-11-20)

| Where | What | Copy |
| --- | --- | --- |
| Site head code | theme-color, PublicSans `.ttf` preload, Ahrefs analytics, 3 × Phosphor 2.1.1 CSS (regular, light, bold), `hamounbv/toronique@1.0.0/css/toronique.min.css`, a `<style>` (hide `.g-embed-code` and the Webflow badge; Lenis CSS), global JSON-LD (`GeneralContractor` + `WebSite`) | `legacy/published-2026-11-20/head-per-page/home.html` from the `<!-- Global \| Webflow Head Custom Code \| Start -->` comment |
| Page head code | per-page JSON-LD (`WebPage`, and on service pages `Service`/FAQ) on every page except 404 | `legacy/published-2026-11-20/head-per-page/<page>.html` (before the Global comment; Webflow's own canonical and GA4 lines are included as served) |
| Site footer code | Lenis 1.1.5 (jsDelivr, `defer`), `hamounbv/toronique@1.0.0/js/toronique.min.js` (`defer`), inline script "campaign fields and first-touch lead attribution", inline script sending a GA4 `generate_lead` event when a Webflow form succeeds | `legacy/published-2026-11-20/site-footer-code.html` (starts with Webflow's own GSAP 3.15.0 + ScrollTrigger + SplitText tags: those come from the site's GSAP setting, not the custom code) |
| Embed `.g-embed-code` (every page) | the same 3 Phosphor links and `toronique.min.css` again (so each loads twice), plus a `<style>` that styles Webflow's native lightbox | `legacy/published-2026-11-20/embed-g-embed-code.html` |
| Embed `.map-embed` (/contact) | Google Maps iframe | `legacy/published-2026-11-20/embed-contact-map.html` |
| jsDelivr files | `toronique.min.css` (8 355 B, sha256 `0051f68f…35ab1`), `toronique.min.js` (11 396 B, sha256 `2924f131…7c785`), minified by jsDelivr from tag `v1.0.0` (commit `0141a23`) | `legacy/hamounbv-toronique@1.0.0/cdn/` (as served) and `css/`, `js/` (source at the tag) |

The Webflow-side source for the head and footer blocks is the Designer's
Site settings › Custom code; the published HTML is what visitors get, and
is what a rollback must restore. `webflow-toronique` (signed in
2026-11-20, one site) reads the same head and footer text through
`get_site_freeform_code`; it matches the published blocks (same blocks,
start and end; not byte-compared). No registered scripts exist. The site
was last published 2026-10-27; Home has unpublished edits from
2026-11-16 (see `AUDIT.md`).

### The repo `hamounbv/toronique` is not the same as live

`legacy/hamounbv-toronique@1.0.0/webflow/_header.html` and `_footer.html`
are the snippets that repo says to paste. Live differs:

- **Footer:** live has two inline scripts the repo doesn't have (lead
  attribution, GA4 `generate_lead`); the repo's comment banner is not live.
- **Head:** the global JSON-LD description and `knowsAbout` differ (the
  repo has "commercial general contracting"; live has "landscaping" and no
  commercial entry); live has no `End` marker comment.
- **Embed:** the repo's README says to delete `G | Embed Code`; on live it
  still exists and now loads the same jsDelivr stylesheets again, plus
  lightbox CSS that is in no repo file.
- `main` is one commit past the tag (`3a469db`: AGENTS.md, CLAUDE.md,
  GOTCHAS.md only, no code change); copies are in
  `legacy/hamounbv-toronique@1.0.0/main-*.md`.

So the parity release (TQ-01) ports **what is live**, not the repo's
snippets.

## How to roll back

Every step below is possible today; none has been needed.

1. **Code blocks:** paste back, from `legacy/published-2026-11-20/`, the
   site head code (from the Global Start comment), the site footer code
   (from `<!-- Lenis Smooth Scrolling -->`, leaving out Webflow's GSAP
   lines), the `G | Embed Code` embed, and any page's head code that was
   changed. Publish to staging, check, then live after "publish".
2. **Loader:** once the site loads this repo, point it back by setting
   `RELEASE` to the previous tag in the head code, or (to undo TQ-01
   entirely) restore step 1, which points back at
   `cdn.jsdelivr.net/gh/hamounbv/toronique@1.0.0/…`. jsDelivr keeps a
   tagged version once served; keep `hamounbv/toronique` and its `v1.0.0`
   tag in place until TQ-01 has been live for a while all the same.
3. **Webflow backup:** Site settings › Backups › restore the
   `2026-11-20 before wf-template` backup (restores the whole site,
   Designer and custom code; CMS items are not part of backups).

*Gate:* the person confirms these steps before the first Webflow write.
