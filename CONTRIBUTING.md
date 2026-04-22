# Contributing to Cowork Business OS

Thanks for your interest in this marketplace. This repo ships four plugins for the Claude desktop app's Cowork mode: `cowork-business-os`, `prima-project-management`, `prima-memory`, and `prima-scholar`.

## Before opening a pull request

1. Read [PLUGIN-BUILD-SPEC.md](PLUGIN-BUILD-SPEC.md) end to end. It is the authoritative source on layout, manifests, packaging, and release flow.
2. Run the validation checklist in spec §6.2 for any plugin you touch.
3. Run `claude plugin validate .` from the repo root and confirm it passes.

## Layout rules

- Every plugin folder name must match the `name` in its `.claude-plugin/plugin.json`.
- Components (`commands/`, `skills/`, `agents/`, `.mcp.json`) live at the plugin root, not inside `.claude-plugin/`.
- All file and folder names are kebab-case.
- Every plugin has a `README.md` at its root.

## Commits

- Imperative first line, under 72 characters. Body optional.
- One logical change per commit.
- Do not commit build artefacts (`.build/`, `release-artefacts/`). `dist/` is committed only when a plugin's runtime requires it (currently `prima-memory` and `prima-scholar`).
- Do not commit secrets, `.env` files, `.DS_Store`, or `node_modules/`.

## Versioning

Semver. `MAJOR.MINOR.PATCH`.

- Bump `version` in every `plugin.json` on every release — even plugins that did not change. All four stay pinned to the same bundle version.
- Update `VERSION` at repo root to match.
- Add a dated section to `CHANGELOG.md`.
- Tag as `vMAJOR.MINOR.PATCH` (e.g. `v2.1.0`). Tags without the `v` prefix will not trigger the release workflow.

## Releases

Pushing a tag that matches `v*` triggers `.github/workflows/release.yml`, which:

1. Builds four `.plugin` ZIP files.
2. Attaches them to a GitHub Release.
3. Force-pushes the tag and `main` to the private mirror repo for org-admin sync.

The `MIRROR_REPO_PAT` secret must be configured on the public repo. See spec §9.

Do not cut a release without going through the pre-release checklist in spec Appendix B.

## Issues and questions

Open an issue on the public repo: https://github.com/larrygmaguire-hash/cowork-business-os/issues

## Licence

All contributions are made under the MIT licence (see [LICENSE](LICENSE)).
