# Architecture

Release 1.0.1 is a single-user local application: a browser UI, a Python standard-library server, and an optional Ollama process on the same computer. The project runs directly from its checked-in files; there is no frontend build step or application database.

## Existing modules

| File or directory | Responsibility |
| --- | --- |
| `dist/index.html`, `dist/app.js`, CSS files | Navigation, rendering, supervisor discovery, profile forms, state validation, import and export |
| `dist/mentor-data.js`, `dist/data.js`, `dist/global-mentors.js`, `dist/orr-mentors.js` | Public supervisor, paper, ranking and relationship seed data |
| `dist/research.js` | Research keyword normalization and coordinated supervisor, paper and relationship filtering |
| `dist/qs100.js`, `dist/qs100-*.js`, `dist/schools.js` | Dated QS universe, sourced supervisor expansion and university coverage |
| `dist/appearance.js`, `dist/display.js` | Saved color themes, profile initials and display-only plain scientific notation |
| `dist/obsidian.js`, `dist/obsidian-vault.js` | Native vault access, sync previews, managed note sections, conflict handling and Markdown ZIP export |
| `dist/profile.js` | Browser-side resume text extraction, keyword analysis and direction-coverage comparison |
| `dist/application.js` | Preparation checklist, per-supervisor task progress and shortlist presentation |
| `dist/literature.js`, `dist/literature-seed.json` | Literature UI and public seed metadata |
| `dist/vendor/` | Local copies of third-party UI and document-parsing dependencies, with licenses |
| `server.py` | Loopback HTTP service, literature feed parsing and caching, bounded API requests |
| `config.py` | Environment settings, private runtime paths and loopback restrictions |
| `mentor_import.py` | Public URL validation, page extraction, source evidence and optional local-model structuring |
| `ollama_client.py` | Bounded calls to the supported local Ollama models |
| `literature_sources.json` | Publisher RSS / Atom source URLs |
| `examples/` | Fictional JSON fixtures for documentation and manual exploration |

`dist/` is the current editable frontend source and served root. A `src/` tree, migrations directory, database layer and separate feature services do not exist in this release.

## Data flow and boundaries

1. Python serves static files from `dist/` on `127.0.0.1`, default port `8792`.
2. The browser combines public seeds with the user's local state under the existing localStorage key `catalyst-atlas-v1`.
3. Resume files are parsed in the browser. Saved extracted text and background feed the browser's keyword matcher; they are not sent to the Python server for this operation.
4. The literature API fetches configured public RSS / Atom sources, keeps a local runtime cache, and returns available metadata. Source failures can produce partial or stale results.
5. Supervisor import fetches a public page and builds a draft with evidence. Optional Ollama processing uses compact public-page content. The user checks the draft before saving it in the browser.
6. JSON export downloads the current personal state. JSON import validates a compatible version-1 backup and replaces current personal state after confirmation.
7. Obsidian directory handles stay in browser memory. A preview reads generated note paths, and the separate sync action requests write access. Managed sections are updated while personal notes are preserved; no vault content goes to the Python server.

The HTTP document root is restricted to `dist/`. Runtime files use `APP_PRIVATE_DIR`, which must remain outside the entire repository. Private resumes, exported backups and application materials belong outside the repository. `data/private/` is an ignored opt-in location for users who explicitly choose to keep local files beside the code; it cannot be used as `APP_PRIVATE_DIR`, and the application does not ingest that folder automatically.

The runtime directory is not a second copy of browser state. There is no automatic account, cross-device sync, server-side profile persistence or database backup. See [DATA.md](DATA.md) for storage and migration details.

## Current behavior and limits

- Research matching is a literal keyword heuristic. Its percentage describes overlap among detected directions, not admission probability.
- Application progress is based on user-checked tasks. Stages, notes and a manual follow-up date are separate fields.
- Literature coverage depends on configured feeds and available dates. Public seeds are selected examples, not complete publication records.
- Academic relationships need explicit sources; coauthorship does not establish supervision.
- Ollama is optional, uses only the supported local model names and cannot be redirected to a remote API by configuration. Model downloads are manual.
- The server is designed for one user on a local computer. Network hosting and multi-user operation need a separate design.

## Planned boundaries

The following are design directions, not implemented modules or directories:

| Planned area | Intended responsibility |
| --- | --- |
| Outreach | Dated contact events and next actions attached to a supervisor; no automatic sending implied |
| Deadlines | School / program deadlines with source URLs, timezone-aware display and explicit reminder behavior |
| Materials | Required-document checklist and local material status without committing private files |
| Drafts | Locally stored application-writing versions with explicit restore and export |
| Optional persistence | Evaluate a small SQLite store only when browser storage no longer covers the workflow |

Keep the existing files while features remain small. Extract a module when implemented behavior needs that boundary. Any persistence change must preserve versioned exports and provide a tested migration; proposed tables or migrations are not present today. Release scope is tracked in [ROADMAP.md](ROADMAP.md).

### Proposed private files for 1.1 and 1.2

The tree below is a **future design**, not files created or read by release 1.0.1. Its root would be the configured `APP_PRIVATE_DIR`, outside the repository and HTTP root. Existing runtime cache and log behavior does not imply that application records are already stored there.

```text
<APP_PRIVATE_DIR>/                 # outside joy-applyflow/
├── outreach/
│   ├── contacts.json              # supervisor-linked contact events and next actions
│   └── logs/                     # optional user-imported correspondence; private
├── deadlines/
│   └── programs.json              # official sources, intake years, instants, reminder consent
├── materials/
│   ├── requirements.json          # per-program requirements and user-confirmed status
│   └── source/                    # optional original files, excluded from public code
├── drafts/
│   └── <document-id>/
│       ├── manifest.json          # version metadata and active-version pointer
│       └── versions/
│           ├── <version-id-1>.md   # immutable copy
│           └── <version-id-2>.md   # immutable copy
└── backups/
    └── application-<timestamp>.json # future versioned portable export
```

No folders or private sample documents are shipped to make this proposal look implemented. The [fictional application-plan example](../examples/application-plan.example.json) illustrates the proposed relationships only. It is **not a supported personal-backup format**, and no current endpoint or UI reads it.

### Proposed record contracts

| Planned record | Fields and behavior to implement |
| --- | --- |
| Contact event, 1.1 | `id`, `supervisorId`, `date`, `channel`, `subject`, `outcome`, `nextAction`, optional `nextActionAt` and private correspondence path. A dated manual log; recording an event does not send an email. |
| Program deadline, 1.1 | `id`, `programId`, `academicYear`, `label`, official `sourceUrl`, `verifiedAt`, source-local `localDeadline`, IANA `timezone`, normalized `deadlineUtc`, and `reminders` with explicit `enabled`, `consentedAt` and `windowsDays`. Preserve the source's timezone and year; do not infer a deadline from the applicant's computer timezone. |
| Required material, 1.2 | `id`, `programId`, `name`, `required`, `status` (`missing`, `in-progress`, `ready`, `submitted`), `sourceUrl`, optional `documentId` or private `filePath`, and `updatedAt`. Status is user-confirmed; a file existing does not prove it meets program requirements. |
| Draft document, 1.2 | `documentId`, `title`, `kind`, optional `programId`, `activeVersionId` and a manifest of versions. Original paths and document content stay private. |
| Draft version, 1.2 | `versionId`, `documentId`, nullable `parentVersionId`, `sourceFilePath`, immutable `snapshotPath`, UTC `createdAt`, content `hash` (SHA-256) and `changeNote`. Make a new copy for every saved version; never overwrite an earlier snapshot. |

Reminder delivery must be opt-in per deadline. A first implementation can show overdue and upcoming items when the workbench is open. A closed browser, stopped local server or sleeping computer cannot deliver reliable background reminders without a separately implemented and explicitly enabled OS scheduling or notification mechanism. No reminder scheduler or notification permission flow exists in 1.0.1. Reminder windows are preferences, not evidence that a notification was delivered.

Draft comparison would read two immutable snapshots and display their differences. Restoring an earlier version would create a new version whose `parentVersionId` references the current version and whose content is copied from the selected historical snapshot; record the selected version in the change note or an explicit `restoredFromVersionId`. Earlier files remain intact. Compute and verify the hash when writing or reading snapshots, and make failure visible before claiming a save or restore succeeded.

The 1.1 and 1.2 work can extend a **new versioned backup format** before a database is needed. Define a new format version, import validation, migrations and an export that covers these records and any referenced draft contents. Do not silently append unsupported records to a version-1 backup or imply that a path-only export backs up its files. SQLite remains an optional 1.3 evaluation; these proposed JSON contracts do not require a database or create migrations today.
