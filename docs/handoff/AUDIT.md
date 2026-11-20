# Audit — Toronique (www.toronique.ca)

webflow-audit › 1. Read-only audit. Nothing was written to Webflow.
Date: 2026-11-20. Each point is marked **measured** (a script ran against
the live domain) or **read** (read from the code, the published HTML or the
Webflow connector). Raw output: `.webflow-build/live/logs/` (not in git).

How it was run: the `wf:*` scripts with a second config,
`.webflow-build/live/webflow-build.config.json`, whose `stagingUrl` is the
live domain. In wf-template 1.0.0, `wf:baseline`, `wf:outline`, `wf:html`,
`wf:a11y`, `wf:links` and `wf:perf` measure `stagingUrl` even with `--live`
(only seo, tracking, domain, overflow, parity, install and redirects read
`liveUrl`); see GOTCHAS. Key pages: `/`, `/about`, `/services`,
`/services/custom-home-building`, `/portfolio`, `/contact`.

## Site facts (read, `webflow-toronique`, 2026-11-20)

- Sign-in reaches **one site**: Toronique `69d6881d0180abb3f22d0133`
  (short name `toronique`), workspace `624f2448720a9f8788f834f6`.
- Domains: `www.toronique.ca` (canonical), `toronique.ca`,
  `www.toronique.com`, `toronique.com`.
- Last published **2026-10-27 20:16 UTC**. **Home was edited after that
  (lastUpdated 2026-11-16 20:14 UTC)**: there are unpublished changes on
  the site. Any publish (staging included) sends them out; ask who made
  them before the first publish.
- Pages (14): Home, About, Services, Portfolio, Contact, Privacy Policy,
  Terms and Conditions, 404; Blog (draft); Design › Style Guide (draft);
  CMS templates Services (published), Projects, FAQs, Testimonials (no
  item pages published).
- CMS: Testimonials, Projects, Services (7 items in the sitemap), FAQs.
- Forms: two distinct forms, **Contact Page** (/contact) and **Contact -
  From Footer** (inside a component on every page); Webflow lists 70
  form records (one per page and domain). Fields: First/Last Name, Email,
  Phone, Address, three selects (Type of Project, Estimated Timeline,
  Estimated Budget Range), Message, How Did You Hear About Us?. No
  redirect, no confirmation email.
- Registered scripts: none. All custom code is in Site settings head and
  footer (freeform), page settings and Embeds.
- Webflow's GSAP 3.15.0 with ScrollTrigger and SplitText is switched on
  site-wide (Webflow's own tags in the footer).

## Custom code inventory (read)

| Where | What | For |
| --- | --- | --- |
| Head | `theme-color` meta | browser chrome colour |
| Head | preload `PublicSans-VariableFont_wght.ttf` (TTF, not WOFF2) | body font |
| Head | Ahrefs `analytics.js` (async) | Ahrefs web analytics |
| Head | Phosphor 2.1.1 regular, light, bold (3 stylesheets) | icon font |
| Head | `hamounbv/toronique@1.0.0/css/toronique.min.css` | site CSS |
| Head | `<style>`: hide `.g-embed-code` and the Webflow badge; Lenis CSS | |
| Head | global JSON-LD `GeneralContractor` + `WebSite` | schema |
| Pages | per-page JSON-LD (`WebPage`; Service/FAQ on service pages) | schema |
| Footer | Lenis 1.1.5 (jsDelivr, defer) | smooth scroll |
| Footer | `hamounbv/toronique@1.0.0/js/toronique.min.js` (defer) | modules: KeyboardIx3ShiftGToggle, GoToTop, SmartSwiper, ClickOnLoad, NavShrink, Lenis init, count-up counters |
| Footer | inline: first-touch lead attribution + UTM fields (adds hidden inputs to every form) | lead source in form submissions |
| Footer | inline: GA4 `generate_lead` on form success (`G-K4YFBYYRMS`) | conversions |
| Embed `G \| Embed Code` (every page) | the 3 Phosphor links and `toronique.min.css` **again**, lightbox `<style>` | canvas preview; lightbox look |
| Embed `.map-embed` (/contact) | Google Maps iframe | map |
| Site settings | GA4 `G-K4YFBYYRMS` (Webflow's integration) | analytics |

Word-for-word copies: `legacy/` (see `ROLLBACK.md`). The connector's
Site settings head and footer text was read on 2026-11-20 and matches the
published blocks (same blocks, same start and end; not byte-compared).

## Findings

### Plumbing (TQ-01, TQ-08)

- **read** Custom code loads from `cdn.jsdelivr.net/gh/hamounbv/toronique@1.0.0`,
  a personal GitHub account. jsDelivr serves `.min` files it minifies
  itself from tag `v1.0.0` (the repo holds only the readable source).
- **read** The four stylesheets (3 × Phosphor, `toronique.min.css`) load
  **twice** on every page: head code and the `G | Embed Code` embed.
- **read** The `hamounbv/toronique` repo is not what is live (footer
  scripts, schema text, the embed): see `ROLLBACK.md`.
- **read** Three Phosphor weights load (regular, light, bold); the pages
  use at least `ph` (regular) and `ph-bold`; light not yet checked.

### Visual baselines (measured)

- `wf:baseline save` on the 6 key pages × 4 widths (1440, 820, 667, 390),
  then `compare` with no change: **0.0 % pixels differ on all 24 shots,
  page heights identical**. Noise floor: 0 % (videos and iframes masked).
  Images: `.webflow-build/live/baselines-2026-11-20/` (not in git).

### Headings (measured, `wf:outline`)

- One H1 on each key page. `/portfolio` skips a level (H1 → H3 on
  project names).
- `/services/custom-home-building` H1 "Toronto Custom Home Builders in
  Toronto" (TQ-07). Service H3s on `/services` start with numbers
  ("07 Garden Suites & Laneway Homes", TQ-02).

### Accessibility (measured, `wf:a11y --all-widths`, axe WCAG 2.2 AA)

Across the 6 pages at 1440 and 390:

- critical `select-name`: the three form selects have no accessible name
  (every page, footer form).
- critical `aria-required-children`: the swiper wrapper on `/`.
- serious `link-name`: logo links in nav and footer, the mobile menu
  button, swiper arrows (`href="#"`).
- serious `target-size`: the email and phone links.
- serious `color-contrast`: `.label-badge.u-muted-56` on project cards
  (`/`, `/portfolio`), 24–29 elements on `/`.
- serious `frame-title`: the map iframe on `/contact`.

### Links (measured, `wf:links --external`)

- 14 pages crawled, 11 external links: the Facebook profile link answers
  **400** to the checker (Facebook often refuses bots: check by hand).
- An empty or `#` link on every page (swiper arrows / a nav link), and a
  "View Gallery" link on `/portfolio` whose text is a JSON blob (lightbox
  JSON inside the link).

### Published HTML (measured, `wf:html`)

- 77 × component variant set without its class (`data-wf--icon-size--variant="16"`
  on Phosphor `<i>` icons): the size variant's styles never apply.
- Classes no stylesheet defines: `s-footer-cta`, `sw-footer-cta`,
  `g-nav-services-w`, `g-nav-services-item`, `sw-home-hero`, `sw-areas`,
  `sw-testimonials`, `is_og`, `contact-main-right-list` (likely empty
  Designer classes; harmless, noted for cleanup).
- Console on `/`: a CSP refusal for a `data:,` fetch (Cloudflare
  challenge script), no script errors from the site's own code.

### SEO and schema (measured, `wf:seo --canonical`)

- 14 sitemap pages, canonical on all, one H1 each.
- **HTML entity `&amp;` inside JSON-LD** on 5 service pages
  (garden-suites, home-additions, home-renovations, landscaping,
  multiplex): TQ-03.
- `/contact` title 66 characters, description 172; `/portfolio`
  description 164 (TQ-05).

### Tracking (measured, `wf:tracking`)

- GA4 `G-K4YFBYYRMS` on 6 of 6 key pages, counted once; no data
  requests sent by the check.
- No cookie banner and no Google consent mode (GA4 and Ahrefs load for
  every visitor; Ahrefs is in the head code, **read**, the checker does
  not list it). Whether the client needs consent is a decision for them.
- http → https, apex → www and trailing-slash redirects keep the query
  string (UTMs survive).
- Third parties: Google Maps (/contact), Google Fonts (1 page),
  Cloudflare Turnstile (6 pages, form spam protection).

### Domain (measured, `wf:domain`)

- Certificate: Google Trust Services, expires 2027-01-14, renews itself.
- `toronique.ca` expires 2028-01-25, registrar GoDaddy Domains Canada;
  DNS at Wix (`ns12/ns13.wixdns.net`). No findings.

### Speed (measured, `wf:perf`, median of 5 Lighthouse runs, live domain)

Lighthouse 12, run 2026-11-20 15:27–15:40 local; median (range). Raw:
`.webflow-build/live/.webflow-build/perf/perf-2026-11-20-20-26-49.json`.

| Page | Mobile score | Mobile LCP | Desktop score | Desktop LCP | Transfer (mobile / desktop) |
| --- | --- | --- | --- | --- | --- |
| `/` | 59 (58–61) | 8.4 s (8.3–10.3) | 87.5 (87–89)¹ | 1.6 s | 17.7 MB / 20.7 MB |
| `/about` | 65 (64–68) | **33.2 s** (32.7–34.7) | 74 (73–76) | 6.2 s | 7.2 MB / 8.1 MB |
| `/services` | 69 (65–71) | 5.9 s (5.5–6.7) | 93 (88–94) | 1.7 s | 3.4 MB / 3.4 MB |
| `/services/custom-home-building` | 61 (60–96) | 7.8 s (2.4–8.1) | 90 (88–91) | 1.5 s | 12.4 MB / 16.9 MB |
| `/portfolio` | 70 (68–96) | 5.8 s (2.4–6.1) | 64 (63–66) | **17.3 s** (6.0–25.2) | 2.8 MB / **54.5 MB** |
| `/contact` | 57 (56–72) | 13.4 s (5.1–14.1) | 89 (79–90) | 2.0 s | 5.7 MB / 5.7 MB |

¹ 4 of 5 runs (one Lighthouse run failed to start).

- TBT 0–72 ms and CLS 0 everywhere: script work and layout shift are not
  the problem. The weight is: pages move 3–55 MB, and LCP follows it.
  First suspects (to measure in TQ-06, not assumed): image sizes and
  formats (the `/portfolio` desktop and `/about` LCP), the four doubled
  stylesheets, three icon-font weights, the TTF body font.
- Matches the tracker's baseline for TQ-06 ("mobile 59–69, LCP 6–10 s"),
  with `/contact` (57) and `/about` (LCP 33 s) worse than it says.

## Order of work (proposal; each its own batch, after TQ-01)

1. TQ-01 parity release (plumbing only, nothing visible).
2. SEO data fixes that need no layout change: TQ-03, TQ-05, TQ-04.
3. Accessibility quick wins in the Designer (select labels, link names,
   iframe title).
4. TQ-06 speed, measured before and after (doubled stylesheets, Phosphor
   weights, the TTF font, Lenis), each change kept only if its number
   moves.
5. TQ-02 and TQ-07 (copy and markup: TQ-07 needs the client).

*Gate:* the person has this report.
