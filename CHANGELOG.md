# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where applicable.

## [Unreleased]

### Added

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
