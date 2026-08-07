# Focus — React & TypeScript Task App

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
