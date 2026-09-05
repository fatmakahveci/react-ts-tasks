# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where applicable.

## [Unreleased]

### Demo workspace

- Added a default, account-free demo with example tasks and browser-local persistence.
- Added clear storage/privacy messaging and validation for corrupt data or unavailable storage.
- Preserved cloud mode as an explicit `NEXT_PUBLIC_TASK_MODE=cloud` option without changing remote configuration.
- Added regression tests for demo task operations, persistence, empty lists, validation, and storage failures.

### Development dependency security

- Updated Firebase CLI transitive dependencies for `body-parser`, `qs`, `uuid`, and OpenTelemetry through scoped overrides.
- Updated `stream-json` to 3.6.0 to address GHSA-528h-pc64-c93x. A version-pinned Firebase CLI compatibility patch adapts its database import, auth import, and Next.js dependency parsers to the secure API. Clean installs apply the patch automatically and fail if it no longer applies; compatibility tests cover all three pipelines. Review and remove the patch when upgrading the CLI to an upstream-compatible release.

### Added

- Added email/password accounts, sign-out, and private user-scoped task storage.
- Added deny-by-default database rules and emulator tests for authentication, SDK operations, account isolation, and schema validation.
- Added local emulator setup instructions and CI integration tests.

### Migration

- Replace the old collection URL setting with the Firebase web-app configuration from `.env.example`.
- Deploy the database rules and enable Email/Password authentication before production use. Existing shared tasks are not automatically migrated.

### Earlier additions

- Added an initial changelog to track future project changes.
- Added continuous integration for dependency audit, linting, tests, and production builds.
- Added weekly Dependabot updates for npm and GitHub Actions dependencies.
- Added validated, environment-only Firebase endpoint configuration.
- Added TypeScript 7 native type-checking alongside the TypeScript 6 tooling API.

### Changed

- Updated Next.js and compatible type definitions while retaining ESLint 9 until the Next.js plugin chain supports ESLint 10.

### Security

- Removed the hard-coded shared Firebase database fallback.
- Enforced HTTPS for remote Firebase endpoints while retaining local emulator support.

<!--
When preparing a release, move relevant entries from Unreleased into a dated
version section. Use Added, Changed, Deprecated, Removed, Fixed, and Security
headings as appropriate.
-->
