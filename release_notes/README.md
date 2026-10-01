# Release Notes

One file per release, named `v<version>.md`, written for people using or learning from the demo.
`CHANGELOG.md` lists every change; release notes explain the ones that matter and what to do about them.
The file becomes the body of the GitHub release, so links to repository files should still make sense there.

Each file follows this structure:

1. **Title**: `# React Map Demo <version>`.
2. **Intro**: two or three sentences on what the release is about.
3. **Highlights**: the user-visible changes, each with a short explanation.
4. **Upgrading**: steps an existing checkout must take, such as new `.env` settings. Omit if there are none.
5. **Fixed**: bugs fixed, described by their symptom. Omit if there are none.
6. **Under the hood**: tooling, dependency and structural changes that do not change behaviour.

Put each sentence on its own line.
