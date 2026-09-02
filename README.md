# Focus — React & TypeScript Task App

[![Release](https://img.shields.io/github/v/release/fatmakahveci/react-ts-tasks?display_name=tag&sort=semver)](https://github.com/fatmakahveci/react-ts-tasks/releases)
[![Next.js](https://img.shields.io/badge/Next.js-React-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE.md)

A simple task management application built with Next.js, React, and TypeScript,
using Firebase Realtime Database for persistence.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Replace the URL in `.env.local` with your Firebase Realtime Database URL.
The URL must end with `tasks.json`.

## Features

- Add, complete, and delete tasks
- Loading, error, validation, and empty-list states
- Responsive interface
- Type-safe Firebase data parsing

## Quality checks

```bash
npm run check
```

This command runs linting, unit tests, and the production build in sequence.
