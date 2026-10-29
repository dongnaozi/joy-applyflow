# Data, privacy and backup

This document describes release 1.0.1. Personal browser data, runtime files and public repository data have different locations and backup requirements. The existing version-1 backup format and browser storage key are intentionally retained for compatibility.

## Where data lives

| Data | Current location | Included in Git? |
| --- | --- | --- |
| Public supervisor profiles, selected paper metadata, rankings and source links | Seed files inside `dist/` | Yes, after review |
| Feed definitions | `literature_sources.json` | Yes |
| Fictional templates | `examples/*.json` | Yes |
| Background, extracted CV text, custom supervisors, saved papers and supervisors, tasks, stages, notes and follow-up dates | Browser localStorage, key `catalyst-atlas-v1` | No; not repository files |
| Appearance choice, Obsidian vault name and relative note directory | Same browser localStorage and personal JSON backup | No |
| QS discovery scope choice | Same browser localStorage and personal JSON backup | No |
| Feed cache and server logs | `APP_PRIVATE_DIR` | No |
| Launcher PID, start time and process identity | Ignored `.runtime/server.json` | No |
| Exported JSON / CSV, original CVs, emails, application materials | User-selected local files; keep outside the repository | No |
| Obsidian Markdown ZIP and imported notes, including application tasks and notes | User-selected downloads and Obsidian vault | No; keep in a private location |
| Connected Obsidian directory handle | Browser memory for the current page session; reconnect after reload | No |
| Optional local private files kept beside code | Ignored `data/private/` | No; explicit local choice only |

Git ignore rules do not encrypt files and do not remove anything already committed. Review staged changes before sharing. Do not place private files in `dist/`, because it is the HTTP document root.

## Runtime configuration

Copy [.env.example](../.env.example) to `.env` beside `server.py` when an override is needed. The server and Windows launcher read that file; process environment variables take precedence. Values are literal `KEY=value` entries with optional quotes and comments, without shell execution or variable interpolation. Configuration does not move browser localStorage.

| Variable | Purpose |
| --- | --- |
| `APP_PRIVATE_DIR` | Private runtime directory; must be outside the entire repository |
| `APP_PORT` | Local HTTP port, default `8792` |
| `APP_BIND` | Local bind address; only `127.0.0.1` is supported |
| `OLLAMA_DEFAULT_MODEL` | Default choice among `deepseek-r1:1.5b` and `deepseek-r1:7b` |
| `OLLAMA_BASE_URL` | Fixed local Ollama endpoint; remote endpoints are not supported |

On Windows the default private directory is `%APPDATA%\joy-applyflow\private`; on macOS it is `~/Library/Application Support/joy-applyflow/private`; on Linux it is `$XDG_STATE_HOME/joy-applyflow/private` or `~/.local/state/joy-applyflow/private`. Leave `APP_PRIVATE_DIR` blank to use that platform default. For an override, write a literal path rather than `%APPDATA%` or `$HOME` expressions. `data/private/` is for manually held files and cannot be used as the runtime directory. The repository's `.env.example` contains placeholders, not credentials. Keep local overrides out of version control. The application does not need cloud API keys.

Private runtime files contain local operational data and may retain feed text fetched during use. The public release excludes runtime caches. Clearing the runtime cache does not delete browser profile data; clearing browser site data does not delete downloaded exports or runtime files.

Obsidian directory access stays in the browser. The connection validates the vault's `.obsidian` directory, then accesses only the generated note paths under the configured folder. A preview reads these paths; the separate sync action requests write access. Personal note text is shown locally and is not sent to the server. See [Obsidian integration](OBSIDIAN.md).

## Back up and restore

1. Open the workbench's sources / data-management dialog and choose **导出 JSON 备份**, or export a personal backup from the background page.
2. Store that JSON in a private location. It contains personal background, extracted CV text and application notes in readable text.
3. On the destination browser, open the data-management dialog and choose **导入备份**.
4. Read the import summary. Export existing records before confirming if you need to retain them.
5. Confirm replacement, then verify the profile, custom supervisors, saved list and checklist.

Import is a replacement, not a merge. Supported backups have `version: 1`; input is validated and bounded. Application and literature CSV / JSON views are useful exports but do not replace the full personal JSON backup. The runtime directory is not a backup of localStorage.

The [fictional backup example](../examples/backup.example.json) is compatible with the personal backup format. Importing it replaces the current personal record with demo data. The other example JSON files document subobjects only and are not accepted as full backups.

## Migrate an existing local workbench

Export from the old page before moving anything. Keep the existing private working folder untouched until the new copy is verified.

Browser storage is scoped to an origin. Reusing the same browser and `http://127.0.0.1:8792` preserves access to the existing `catalyst-atlas-v1` data even when the server folder changes. `http://localhost:8792`, another port, another browser and another device each have their own storage. Export from the old origin and import into the new one when any of these change. Two copies cannot bind the same port at once.

Moving server runtime files is separate from moving personal records. Use `APP_PRIVATE_DIR` for the new runtime location; do not copy old caches, logs, CVs or backups into public seed files.

## What leaves the computer

- Loading the workbench and parsing a resume use locally served assets. Resume parsing and keyword matching run in the browser.
- The server fetches configured publisher feeds for literature updates. Source availability and retained metadata depend on those feeds.
- Supervisor import fetches the submitted public academic URL. Optional model processing calls Ollama on the same computer using public-page content.
- Opening an external paper, university, ranking or group link sends a normal browser request to that website.
- This release has no automatic email sender, cloud profile sync, application submission or remote model API.

## Public data and licensing

Commit only public academic metadata with source links and enough context to distinguish verified facts from unknowns. Preserve the date and year for dated claims such as affiliation checks and rankings. Publicly visible content is not automatically free to redistribute.

The release omits bulk publisher abstracts and private applicant records. Do not contribute scraped full articles, copyrighted abstract collections, email correspondence, real CVs, recommendation letters or credentials. MIT covers the project's original code; third-party data, text and vendored libraries retain their own rights and licenses.

## Future persistence

SQLite is an option under evaluation for a later release. No SQLite database, database schema, migrations or server-side personal-record store exists in 1.0.1. A future implementation must define its private path, backups, import/export and migration before being described as available.
