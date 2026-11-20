# Gotchas

A running log of things that cost time on this project. Agents read it at
the start of every session and add to it when they hit something new (see
the Session protocol in `AGENTS.md`). Never delete an entry — update its
`Status` instead.

Lessons from earlier builds are in the skill, not here:
`.claude/skills/webflow-build/lessons/` (one file per area). Read the file
for the area you work in. Entries tagged `Scope: template-candidate` are
collected from client repos into those files.

## Entry format

```md
### YYYY-MM-DD · Short title
- Area: designer | css | loader | release | mcp | ci | js | perf
- Scope: project | template-candidate
- Symptom: what was observed
- Cause: why it happened
- Fix: what was done, or the workaround
- Status: open | fixed <sha> | upstreamed wf-template <sha>
- Found by: claude | codex | human
```

## This project

<!-- Add new entries here, newest first. -->
### 2026-11-20 · `pnpm test` fails in a fresh client repo (update-skills check)
- Area: ci
- Scope: template-candidate
- Symptom: right after `pnpm new-project`, `pnpm test` fails: `tests/update-skills.check.mjs:82` expects "What's new since 0.2.0", which needs the template's CHANGELOG (new-project removes it). Browser tests 20/20, loader 13/13, launch-checks 18/18, progress 10/10 pass. CI runs `pnpm test`, so the staging deploy does not run until this passes.
- Cause: wf-template 1.0.0 test assumes the template repo; the fix is on the template's unreleased branch `fix/tests-in-client-repos` (1.0.1).
- Fix: template 1.0.1's two test files copied by hand (b9dfd11; `update-skills` doesn't copy `tests/`), then `pnpm update-skills` records skills v1.0.1. Staging CI passes since b9dfd11.
- Status: upstreamed wf-template v1.0.1 (d8213c3); fixed here b9dfd11
- Found by: claude
### 2026-11-20 · `--live` measures staging in most wf:* scripts
- Area: perf
- Scope: template-candidate
- Symptom: `wf:baseline`, `wf:outline`, `wf:html`, `wf:a11y`, `wf:links` and `wf:perf` with `--live` open `stagingUrl` (`toronique.webflow.io`), not the custom domain. Only seo, tracking, domain, overflow, parity, install and redirects read `liveUrl`.
- Cause: in wf-template 1.0.0 `lib.mjs` `page()` uses `--live` only to stop the local-bundle routing; the scripts build URLs from `cfg.stagingUrl`.
- Fix: workaround for the audit: a second config in `.webflow-build/live/webflow-build.config.json` with `stagingUrl` set to `https://www.toronique.ca` and `repoDir: "../.."`, scripts run from that folder.
- Status: open
- Found by: claude
