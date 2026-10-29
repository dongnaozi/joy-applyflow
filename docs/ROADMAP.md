# Roadmap

Plans describe intended work, not available functionality or delivery dates. Each release should remain usable as a small local application and preserve portable backups.

## 1.0 — Local research and application checklist

Available now:

- Public-source supervisor records, selected papers, relationships and dated university rankings.
- Research keyword settings that coordinate discovery views.
- Optional public-profile extraction with supported local Ollama models.
- Browser-local resume parsing and keyword direction matching.
- Shortlist, preparation tasks, per-supervisor tasks, application stage, follow-up date and notes.
- RSS / Atom literature tracking and personal JSON import / export.
- Public/private data separation, fictional examples and release documentation.

## 1.1 — Outreach and deadlines

Planned:

- Structured contact logs with date, channel, outcome and next action.
- School / program deadlines with official sources and timezone context.
- Explicit opt-in reminder behavior with visible permission and delivery limits.

Completion means users can distinguish a program deadline from a supervisor follow-up and export both. The existing follow-up field does not currently issue reminders. Sending email is outside the implemented 1.0 workflow.

## 1.2 — Materials and draft versions

Planned:

- Track required material status for a target program.
- Keep local versions of statements, research proposals and other application drafts.
- Compare or restore a version and export it without adding private writing to the repository.

Completion means version restoration and backup are explicit and tested. A checklist item saying “prepare statement” is not a material tracker or draft editor in the current release.

## 1.3 — Optional persistence

Planned:

- Evaluate whether an optional SQLite store improves reliability for larger personal workflows.
- Define a private data location, portable backups and a versioned migration from localStorage.
- Keep a simple browser-based workflow available where practical.

SQLite and migrations will be added only with a concrete need and an implemented migration path. Multi-user hosting, accounts and cloud synchronization are separate scope decisions.
