# Contributing

Thank you for helping improve Joy ApplyFlow. Small, focused issues and pull requests are easiest to review. For a larger feature, describe the workflow and proposed scope in an issue first.

## Run the app

Use Python 3.10 or newer:

```sh
python server.py
```

Open `http://127.0.0.1:8792/`. There is no dependency installation or frontend build step. Edit the existing files in `dist/` for frontend work. Ollama is optional and models must be downloaded manually.

Keep changes in the existing module structure when that is sufficient. Add new modules when implemented behavior needs them; do not add placeholder services, database migrations or dependencies for planned features.

## Verify a change

Run the existing `check-*` scripts relevant to the changed behavior. Python checks use the standard library; JavaScript module checks require Node.js, which is a development tool rather than an app runtime requirement. Inspect a check before running it: some exercise public-source fetching or local Ollama and depend on those services being available.

For UI changes, also open the app and verify the affected workflow, keyboard operation and a narrow viewport. For persistence changes, verify export and import with fictional data. Do not run destructive import checks in a browser profile containing your only copy of real records.

A pull request should explain the user-facing change, relevant validation and any limitations. Keep documentation accurate: planned reminders, outreach logs, material tracking, draft versions and optional databases must not be presented as implemented features.

## Protect personal and third-party data

- Use fictional examples such as `examples/backup.example.json` for demos and tests.
- Keep CVs, exports, notes, correspondence, drafts, credentials and logs out of commits. Use an external private directory or the ignored `data/private/` for local files.
- Do not put private data in `dist/`. Check `git diff --cached` before submitting.
- Retain source URLs and verification context for academic metadata. Do not infer supervision from coauthorship or demographic background from a name or photo.
- Do not contribute bulk publisher abstracts, full articles or personal correspondence. Respect each source's rights and the bundled third-party licenses.

See [docs/DATA.md](docs/DATA.md) for the storage boundaries. If you discover a privacy issue, describe the affected code path without posting the private data in a public issue.

## License

By submitting a contribution, you agree that your original contribution may be distributed under the project's MIT license. Preserve notices for any third-party material you are authorized to contribute.
