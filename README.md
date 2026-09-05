# Focus — Task Manager

[![CI](https://github.com/fatmakahveci/react-ts-tasks/actions/workflows/ci.yml/badge.svg)](https://github.com/fatmakahveci/react-ts-tasks/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/fatmakahveci/react-ts-tasks?display_name=tag&sort=semver)](https://github.com/fatmakahveci/react-ts-tasks/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE.md)

Focus is a responsive task manager built with Next.js, React, and TypeScript. Try it immediately in the account-free demo workspace, with tasks stored in your browser. An optional cloud mode supports authenticated Firebase task lists.

## Demo

![Animated walkthrough of Focus adding, completing, and deleting tasks](demo.gif)

This is an illustrative animation of the task flow, not a recording of the running app. It predates the account sign-in screen.

## Features

- Start immediately with three example tasks; no account, Firebase setup, or emulator required
- Keep demo tasks across page reloads using browser-local storage, separate from cloud data
- Create tasks with whitespace normalization and a 160-character limit
- Mark tasks as complete or return them to the active list
- Delete tasks with per-item pending states that prevent duplicate requests
- Email/password registration, sign-in, and sign-out through Firebase Authentication
- Private task lists under `users/{uid}/tasks`, protected by database rules
- Persist changes through the authenticated Firebase SDK
- Handle loading, empty, validation, request, and retry states
- Accept legacy Firebase records without a completion field
- Ignore malformed remote records instead of breaking the entire list
- Provide accessible labels, live status updates, focus indicators, and touch targets
- Adapt the interface for desktop and mobile screens

## Technology

- Next.js App Router
- React
- TypeScript 7 native type-checking with the TypeScript 6 compatibility API for tooling
- Firebase Authentication and Realtime Database SDK
- CSS with responsive and reduced-motion styles
- Node.js built-in test runner
- ESLint with Next.js Core Web Vitals rules
- GitHub Actions continuous integration and Dependabot updates

## Getting Started

### Requirements

- Node.js 22.13 or newer (Node 22 is used in CI)
- npm

Java 21 and a Firebase project are not required for demo mode. Java is only needed for the optional emulator tests.

### Installation

```bash
git clone https://github.com/fatmakahveci/react-ts-tasks.git
cd react-ts-tasks
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The default mode is `demo`. Add, complete, reopen, and delete tasks without signing in. Changes stay in `localStorage` under `focus.demo.tasks.v1`, only for this browser profile and site origin. They do not sync to other devices or cloud accounts. Clearing site data removes them; private browsing may discard them when the session ends. Do not use the demo for sensitive data. Reload after edits in another tab to refresh the list.

If your environment previously selected cloud mode, set `NEXT_PUBLIC_TASK_MODE=demo` in `.env.local` and restart (or rebuild for production). When storage is blocked, full, or malformed, the app reports an error instead of claiming a successful save. Malformed data is not silently replaced.

## Configuration

Only for optional cloud mode, set the following in `.env.local` before starting or building. Demo mode does not initialize Firebase or send task data to it:

```dotenv
NEXT_PUBLIC_TASK_MODE=cloud
NEXT_PUBLIC_FIREBASE_API_KEY=your-public-web-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

Enable Email/Password in Firebase Authentication and deploy `database.rules.json` before production use. The database URL must be the HTTPS root URL, without `/tasks.json`. Public build-time variables require rebuilding when changed.

```bash
npx firebase deploy --only database --project YOUR_PROJECT_ID
```

Deployment requires access to your Firebase project. Adding the rules to this repository does not deploy them. The old shared `/tasks` path is denied by these rules; old records are not automatically assigned to users or migrated.

### Optional local Firebase emulators

```bash
cp .env.emulator.example .env.local
npm run emulators
# In a second terminal:
npm run dev
```

Register an account using fictional credentials. Both authentication and storage run locally using project `demo-focus`; data is discarded when the emulators stop.

Because `NEXT_PUBLIC_*` values are included in browser code, this URL is not a secret. Authentication, authorization, and schema restrictions must be enforced with Firebase Security Rules. Never store service-account credentials or private tokens in this variable.

## Data Model

Firebase stores tasks below `users/{uid}/tasks/{taskId}`. A record has the following shape:

```json
{
  "text": "Prepare release notes",
  "completed": false
}
```

Firebase generates the task identifier. The client uses that identifier for update and delete requests.

## Request Lifecycle

| Action | SDK operation | Path |
| --- | --- | --- |
| Load tasks | `get` | `users/{uid}/tasks` |
| Create a task | `push` + `set` | `users/{uid}/tasks/{id}` |
| Change completion state | `update` | `users/{uid}/tasks/{id}` |
| Delete a task | `remove` | `users/{uid}/tasks/{id}` |

The SDK manages authenticated connections. Database rules deny anonymous and cross-user access, reject unknown fields and invalid task values, and allow owners to delete their own tasks. Responses also pass through client-side validation.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run data validation, demo storage, and CLI compatibility tests |
| `npm run test:firebase` | Run authentication, SDK CRUD, and access-rule integration tests in local emulators |
| `npm run emulators` | Start local authentication and database emulators |
| `npm run typecheck` | Validate the project with the TypeScript 7 native compiler |
| `npm run check` | Run lint, tests, type-checking, and the production build |

## Testing

The test suite covers:

- Demo seeding, persistence, task creation, completion, reopening, and deletion
- Empty lists, invalid saved data, blocked storage, quota failures, and aborted loads
- Task text trimming and validation
- Maximum-length enforcement
- Empty and malformed Firebase responses
- Backward compatibility with legacy task records
- Firebase-generated identifier validation

Run the complete quality gate before opening a pull request:

```bash
npm run check
# Optional, requires Java 21:
npm run test:firebase
```

## Project Structure

```text
src/
├── app/
│   ├── components/       Form, list, item, and reusable section UI
│   ├── lib/
│   │   ├── firebase.ts   Auth, database, and emulator configuration
│   │   ├── task-api.ts   Authenticated user-scoped task operations
│   │   ├── task-data.ts  Normalization and runtime parsing
│   │   └── task-data.test.ts
│   ├── globals.css       Theme and responsive page layout
│   ├── layout.tsx        Root metadata and document layout
│   └── page.tsx          Application state and task orchestration
└── shared/
    └── types.ts          Shared task model
```

## Contributing and Security

Read the [contributing guide](.github/CONTRIBUTING.md) before submitting a pull request. Add or update tests for behavioral changes and run `npm run check` locally.

Report vulnerabilities privately according to the [security policy](.github/SECURITY.md). Do not include credentials, private Firebase data, or exploit details in public issues.

## Project Resources

- [Releases](https://github.com/fatmakahveci/react-ts-tasks/releases)
- [Changelog](CHANGELOG.md)
- [Contributing guide](.github/CONTRIBUTING.md)
- [Security policy](.github/SECURITY.md)
- [License](LICENSE.md)
