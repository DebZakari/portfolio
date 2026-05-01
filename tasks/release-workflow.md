# Release Workflow

> Trigger: user says "release", "create a release", "tag a version", "ship vX.Y.Z"

## Why This Exists

v0.2.1 incident: tag landed on feature branch (not main), feature branch was never pushed before merge (remote looked behind main), CHANGELOG was updated after merge on main (left feature branch behind). This doc fixes all three.

## Rule

Tags and GitHub Releases always land on **main**.
CHANGELOG update belongs on the **feature branch**, committed before merge.
`CHANGELOG.md` is the source of truth for GitHub Release notes.

## Preflight

Run these before changing anything:

```bash
rtk git status --short --branch
rtk git log --oneline main..HEAD
rtk git diff --stat main...HEAD
```

If unrelated unstaged work exists, do one of these before switching branches:
- Commit only the intended release files.
- Stash unrelated work with a release-specific message and restore it after the release.

Never include unrelated unstaged work in the release commit.

## Flow

```
Feature branch (current)
│
├── 1. Update CHANGELOG.md
│       Add entry at the top: ## [X.Y.Z] - YYYY-MM-DD
│       Commit: "chore: release vX.Y.Z"
│
├── 2. Push feature branch
│       git push -u origin <branch>
│       (remote must not be behind main)
│
├── 3. Switch to main + pull
│       git checkout main
│       git pull origin main
│
├── 4. Merge feature branch (no-ff)
│       git merge --no-ff <branch> -m "chore: merge <branch> for vX.Y.Z"
│
├── 5. Create annotated tag on main
│       git tag -a vX.Y.Z -m "vX.Y.Z"
│
├── 6. Verify tag target before pushing
│       git branch --show-current
│       git show --no-patch --decorate --oneline vX.Y.Z
│       git branch --contains vX.Y.Z
│       (must show main)
│
├── 7. Push main + tags
│       git push origin main
│       git push origin --tags
│
└── 8. Create GitHub Release from CHANGELOG notes
        Extract the matching CHANGELOG.md section to /tmp/release-notes-vX.Y.Z.md
        gh release create vX.Y.Z --title "vX.Y.Z" --notes-file /tmp/release-notes-vX.Y.Z.md
        (do not use --notes-from-tag unless the tag message contains full release notes)
```

## Release Notes Extraction

Set the release version once, then extract the matching `CHANGELOG.md` section:

```bash
VERSION="X.Y.Z"
TAG="v$VERSION"
NOTES="/tmp/release-notes-$TAG.md"

awk -v version="$VERSION" '
  $0 ~ "^## \\[" version "\\] - " { keep = 1; print; next }
  /^## \[/ && keep { exit }
  keep { print }
' CHANGELOG.md > "$NOTES"
```

Then verify the notes before creating or editing the GitHub Release:

```bash
cat "$NOTES"
gh release create "$TAG" --title "$TAG" --notes-file "$NOTES"
gh release view "$TAG" --json body,url
```

If the release already exists:

```bash
gh release edit "$TAG" --notes-file "$NOTES"
```

## Versioning Guide

Use semantic versioning: `vMAJOR.MINOR.PATCH`

| Bump | When |
|------|------|
| PATCH | Bug fixes, copy tweaks, minor visual fixes |
| MINOR | New section, new feature, new phase complete |
| MAJOR | Full redesign, breaking structural change |

## CHANGELOG Format

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

Use only sections that have entries.

## CHANGELOG Writing Style

- Keep entries concise and factual.
- Start each bullet with a past-tense verb: `Added`, `Updated`, `Refined`, `Fixed`, `Restored`, `Removed`.
- Use backticks for component names, filenames, commands, package names, and literal UI labels.
- Prefer user-visible outcomes over implementation trivia.
- Include important technical changes when they affect performance, accessibility, behavior, or maintainability.
- Do not include hidden easter eggs, unreleased surprises, secrets, or implementation details that should stay private.
- Avoid vague catch-all bullets like "miscellaneous polish" unless the release truly contains only tiny copy/style changes.
- Keep naming consistent across releases: `Projects section`, `Mission Logs`, `Focus Mode`, `Immersive Mode`, `GitHub Release`.

## Checklist

- [ ] CHANGELOG updated on feature branch
- [ ] Only intended release files committed
- [ ] Feature branch pushed to remote
- [ ] Switched to main, pulled latest
- [ ] Merged with --no-ff
- [ ] Annotated tag created on main and verified to point at main
- [ ] Pushed main + tags
- [ ] GitHub Release created from the matching `CHANGELOG.md` section
- [ ] Release page checked for non-empty notes
- [ ] Any pre-release stash restored
