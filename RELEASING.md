# Releasing React Map Demo

This document describes how to cut a release of React Map Demo.
Follow these steps for every release so that the version number, changelog, release notes and git tag stay in sync.

## Versioning

The project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html): `MAJOR.MINOR.PATCH`.

- MAJOR: incompatible or sweeping changes, such as a new required setting or a framework migration.
- MINOR: new, backward-compatible features, such as a new demo page.
- PATCH: backward-compatible bug fixes only.

Until `1.0.0`, a sweeping change may bump MINOR instead of MAJOR, as 0.2.0 did.

## Where versions live

- `version` in `package.json`, the single source of the version number.
- `CHANGELOG.md`, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- `release_notes/v<version>.md`, one user-facing file per release.
- The annotated git tag `v<version>`.

`package-lock.json` is gitignored, so it does not need updating.

## Release steps

1. **Pick the version number** based on the changes under `## [Unreleased]` in `CHANGELOG.md` (see Versioning above).

2. **Bump the version** without letting npm commit or tag, so the release commit carries everything together:

   ```sh
   npm version <version> --no-git-tag-version
   git diff   # expect only the version field in package.json to change
   ```

3. **Cut the changelog.** In `CHANGELOG.md`:
   - Move the items under `## [Unreleased]` into a new `## [<version>] - YYYY-MM-DD` section (today's date).
   - Leave a fresh, empty `## [Unreleased]` at the top.
   - Add a `See [release_notes/v<version>.md](release_notes/v<version>.md) for details.` line under the new heading.
   - Update the link references at the bottom of the file: point `[Unreleased]` at `compare/v<version>...HEAD` and add a `[<version>]` link comparing it with the previous tag.

4. **Write the release notes** at `release_notes/v<version>.md`.
   See `release_notes/README.md` for the structure: a short intro, Highlights, Upgrading if needed, Fixed if needed, and Under the hood.

5. **Run every check** and confirm there are no warnings and no failures:

   ```sh
   make check   # lint, typecheck and tests
   make build   # production build, which also typechecks
   ```

   The tests replace the map with a placeholder, so also run `make dev` and check every demo page in a browser with a real `MAPS_API_KEY`.
   Check that the maps and markers render, that dragging a marker updates its coordinates, and that the browser console is clean.

   Do not cut a release on a failing or flaky check.
   Fix the test or the code first, even when the failure looks unrelated to what the release contains.

6. **Commit** the version bump, changelog and release notes together:

   ```sh
   git add package.json CHANGELOG.md release_notes/
   git commit -m "Release <version>"
   ```

7. **Push the commit:**

   ```sh
   git push origin main
   ```

8. **Tag** the release commit with an annotated tag, and push the tag:

   ```sh
   git tag -a v<version> -m "React Map Demo <version>" <commit>
   git push origin v<version>
   ```

   Name the commit rather than tagging `HEAD`, so a commit made meanwhile cannot end up tagged by accident.
   A pushed tag should never move.
   If a tag goes out on a bad commit, leave it and release the next patch version.

9. **Publish the GitHub release** from the tag, with the release notes as the body:

   ```sh
   gh release create v<version> --title "React Map Demo <version>" \
     --notes-file release_notes/v<version>.md --verify-tag
   ```

   `--verify-tag` refuses to publish if the tag is not on GitHub, rather than creating one on whatever `main` is by then.

## Commit conventions

Use a short prefix on commit messages so history is easy to scan.

- `Release <version>` for the single commit that cuts a release (step 6 above).
- `feat: <summary>` for a new feature, `fix: <summary>` for a bug fix.
- `refactor: <summary>` for restructuring that does not change behaviour.
- `docs: <summary>` for documentation and process changes that are not part of a release.
- `test: <summary>` for test-only changes.
- `build: <summary>` for build tooling, dependencies and configuration.

Documentation or process changes (this file, README, CLAUDE.md) are committed on their own with a `docs:` message rather than being folded into a release commit.

## Notes

- `CHANGELOG.md` is maintained by hand; there is no generator.
  Add to `## [Unreleased]` as part of each change, not only at release time.
- Tags are annotated (`git tag -a`) so they carry a message and tagger.
- Keep one commit per release (`Release <version>`) so each tag anchors to a distinct, accurate point in history.
- Build output (`dist/`) and `.env` are gitignored and never committed.
- There is no CI, so step 5 is the only gate before a release.
