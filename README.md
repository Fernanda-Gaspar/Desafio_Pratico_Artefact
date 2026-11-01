# Artefact Tasks

A task management application built for a technical challenge using **Next.js 15, React, TypeScript, and tRPC**. The project provides full CRUD functionality, initial server-side rendering, incremental loading, and data stored exclusively in the backend's memory.

The interface features a visual identity inspired by the Artefact reference, with a blue, purple, and pink gradient, vector elements, and a responsive layout. This project was developed for a technical assessment and is not an official Artefact product.

## Table of Contents

- [Overview](#overview)
- [Requirements Met](#requirements-met)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [How to Use](#how-to-use)
- [Available Commands](#available-commands)
- [Testing and Continuous Integration](#testing-and-continuous-integration)
- [Project Structure and Architecture](#project-structure-and-architecture)
- [Data Model and Operations](#data-model-and-operations)
- [SSR, Pagination, and Metrics](#ssr-pagination-and-metrics)
- [TypeScript Backend Guide](#typescript-backend-guide)
- [Project Presentation](#project-presentation)
- [Troubleshooting](#troubleshooting)
- [Next Steps and Improvements](#next-steps-and-improvements)
- [Limitations and Scope Decisions](#limitations-and-scope-decisions)
- [References](#references)

## Overview

The goal is to let users create tasks, organize priorities, and keep track of their to-do lists through a simple interface.

The frontend and backend run on the **same Next.js server**. Backend operations are exposed through tRPC and use an in-memory collection. The frontend receives the first page already rendered on the server and uses TanStack Query for subsequent interactions.

Available features:

- Create, list, retrieve, edit, and delete tasks.
- Validate required titles and field length limits.
- Mark tasks as completed and reopen them.
- Set low, medium, or high priority.
- Search by title or description, ignoring case and accents.
- Filter by status and priority on the backend.
- Load additional tasks as the user scrolls or clicks a button.
- Track total, open, and completed tasks, as well as the completion rate.
- Quickly filter open high-priority tasks.
- Display feedback for loading, successful operations, and errors.

The application starts with an empty task list. Users can create their first task through the interface.

## Requirements Met

| Challenge Requirement | Implementation |
| --- | --- |
| Next.js 15 | App Router with Next.js 15.5.28 |
| tRPC communication | Typed procedures in `src/server/routers/tarefas.ts` |
| In-memory storage | `Map<string, Tarefa>` in the server context |
| Required task fields | ID, title, optional description, and creation timestamp |
| Full CRUD | Create, list, update, and delete operations |
| Backend validation | Zod schemas applied to procedure inputs |
| Meaningful errors | `BAD_REQUEST` and `NOT_FOUND` |
| SSR task list | Router query executed before HTML rendering |
| Form using hooks | Shared functional component for creating and editing tasks |
| Delete from the list | Confirmation, disabling controls during the operation, and feedback |
| UI states | Loading, empty list, network error, and retry |
| Infinite scroll | Cursor-based pagination and `IntersectionObserver` |
| Comments and documentation | Design decisions explained in code comments and consolidated documentation here |

Task completion, priorities, search, filters, and metrics are additional features. They enhance the CRUD functionality without changing the in-memory storage requirement.

## Technologies

| Technology | Version or Adopted Release | Purpose |
| --- | --- | --- |
| Next.js | 15.5.28 | Routing, SSR, and application server |
| React | 19.x | User interface and functional components |
| TypeScript | 5.9.3 | Static typing |
| tRPC | 11.22.1 | Procedures and client-server contract |
| TanStack Query | 5.x | Queries, mutations, caching, and pagination |
| Zod | 4.x | Shared validation |
| Node.js test runner + tsx | As specified in the lockfile | Backend and HTTP transport tests |
| Playwright Test | 1.64.1 | Browser tests |
| ESLint | 9.x | Static analysis |
| GitHub Actions | Workflow included | Continuous integration checks |
| Local CSS and SVG | No component library | Layout and visual elements |

The `package-lock.json` file records the resolved versions. Use `npm ci` to install this exact set of dependencies.

## Prerequisites

- **Node.js 22 or later**, with npm available.
- **Git**, if cloning the repository.
- A web browser to use the application.
- Playwright's Chromium browser, only when running the E2E test suite.

Check your environment:

```bash
node --version
npm --version
git --version
```

The `.nvmrc` file specifies Node.js 22 for users of a Node.js version manager.

There is no need to configure a database, .NET, Docker, an AI API key, or a second server. The current version also does not require an `.env` file.

## Installation

### Clone the Repository

Replace `URL_DO_REPOSITORIO` with this repository's actual HTTPS or SSH URL before running:

```bash
git clone URL_DO_REPOSITORIO artefact-tasks
cd artefact-tasks
npm ci --include=dev
```

The `artefact-tasks` argument sets the local directory name, regardless of the remote repository's name.

The `--include=dev` option ensures that development tools for type checking, linting, and testing, including Playwright, are installed.

### Install from a ZIP File

1. Extract the project archive.
2. Open a terminal in the directory containing `package.json` and `tsconfig.json`.
3. Install the dependencies:

```bash
npm ci --include=dev
```

Open this same directory in your code editor. Avoid opening just an individual file, as TypeScript needs to locate the project configuration.

### Configure the Editor

In VS Code, select the TypeScript version installed in the workspace:

1. Open the Command Palette with `Ctrl + Shift + P`.
2. Run `TypeScript: Select TypeScript Version`.
3. Select `Use Workspace Version`.

The `.vscode/settings.json` file points to `node_modules/typescript/lib`. CSS declarations are located in `src/types/styles.d.ts`.

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend and backend start together. To stop the server, press `Ctrl + C` in the terminal.

If port 3000 is already in use:

```bash
npm run dev -- --port 3001
```

In that case, open [http://localhost:3001](http://localhost:3001).

### Build and Run Locally in Production Mode

```bash
npm run build
npm start
```

The `build` command generates the optimized application; `start` runs the result on port 3000. Run the build before using `npm start`.

To verify the complete flow, prefer running the local production build. Data storage remains in memory in this mode.

> **Temporary data:** Restarting the server deletes all tasks. This behavior is expected for this challenge.

## How to Use

1. Click **Criar uma tarefa** (Create a Task) or **Nova tarefa** (New Task).
2. Enter a title, add a description if needed, and choose a priority.
3. Save the task to return to the list.
4. Use the edit icon to modify its fields.
5. Check the box to complete a task; uncheck it to reopen the task.
6. Use search and filters to find tasks.
7. Click the delete icon and confirm or cancel the operation.
8. Once there are more than 10 tasks, scroll to the bottom to load the next page.
9. Check the overview section to monitor the global metrics.

Interface messages indicate the result of each operation. If saving fails, the form preserves its data so the user can try again.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm ci --include=dev` | Install dependencies from the lockfile, including development dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Generate a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate route types and check TypeScript |
| `npm test` | Run the 17 backend/HTTP adapter tests |
| `npm run test:e2e` | Run the 3 Playwright scenarios |
| `npm run check` | Run linting, type checks, backend tests, and the build |

`npm run check` does not include browser tests. The E2E suite runs separately.

## Testing and Continuous Integration

### Main Verification

```bash
npm run check
```

You can also run each step separately:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

### Backend Tests

The **17 tests** in `tests/tarefas.test.ts` use `node:test` with `tsx` and isolated collections for each test. They cover:

- CRUD, ID generation, and preservation of creation dates.
- Optional descriptions, empty titles, whitespace, and field length limits.
- Retrieving, updating, and deleting nonexistent tasks.
- Pagination with identical timestamps, without duplicates or missing tasks.
- Cursor deletion and changes between pages.
- HTTP transport, user-friendly messages, and rejection of mutations sent via GET.
- Priorities, completion, global metrics, and idempotent completion updates.
- Accent-insensitive searches for tasks beyond the first page.
- Rejection of invalid priority values.

### Browser Tests

Install the Playwright browser:

```bash
npx playwright install chromium
```

On Linux, if system libraries are required:

```bash
npx playwright install --with-deps chromium
```

Then run:

```bash
npm run build
npm run test:e2e
```

The `playwright.config.ts` file starts a dedicated Next.js process on port **3100**. Make sure this port is available. The suite does not reuse the personal instance started on port 3000.

The **3 scenarios** verify:

1. The first page displays 10 tasks with JavaScript disabled.
2. CRUD, validation, priority, completion, and network error handling.
3. Infinite scrolling from 10 to 20 and then 23 tasks, server-side search, filters, and a 390 px viewport width.

The suite clears tasks from its dedicated server before each scenario. Failure diagnostics are stored in `test-results/`.

To list the scenarios without opening a browser:

```bash
npx playwright test --list
```

### Continuous Integration

The `.github/workflows/ci.yml` workflow is triggered by `push` and `pull_request`. It runs dependency installation, linting, type checks, backend tests, the build, Chromium installation, and E2E tests.

To use it, push the project files to the root of your GitHub repository and keep GitHub Actions enabled. Remote execution depends on that repository; the presence of the workflow does not mean a remote run has already completed.

## Project Structure and Architecture

| File or Directory | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Initial task list and SSR |
| `src/app/layout.tsx` | Shared interface layout |
| `src/app/tarefas/nova/page.tsx` | Task creation |
| `src/app/tarefas/[id]/editar/page.tsx` | Server-loaded task editing |
| `src/app/tarefas/loading.tsx` | Loading state for form routes |
| `src/app/error.tsx` | Unexpected page errors |
| `src/app/not-found.tsx` | Missing page or task |
| `src/app/api/trpc/[trpc]/route.ts` | tRPC HTTP handler |
| `src/server/context.ts` | Process-level in-memory collection |
| `src/server/trpc.ts` | tRPC configuration and error formatting |
| `src/server/routers/tarefas.ts` | Operation rules, filters, summary, and pagination |
| `src/server/router.ts` | `AppRouter` composition |
| `src/server/caller.ts` | Router access during SSR |
| `src/lib/tarefa.ts` | Shared types, constants, and schemas |
| `src/lib/erro.ts` | User-facing error messages |
| `src/trpc/` | Client, provider, and TanStack Query |
| `src/components/` | Form, task list, feedback, and illustration |
| `src/types/styles.d.ts` | CSS import declarations |
| `tests/tarefas.test.ts` | Backend tests |
| `tests/e2e/tarefas.spec.ts` | Browser tests |

In the browser, the tRPC client sends requests to the `/api/trpc` handler, which executes procedures with access to the in-memory collection. During SSR, the page calls the same router directly on the server.

The procedures operate directly on the context, without additional service or repository layers that would merely forward calls at this scale.

## Data Model and Operations

### Task

| Field | Type | Rule |
| --- | --- | --- |
| `id` | UUID `string` | Generated in the backend with `crypto.randomUUID()` |
| `titulo` | `string` | Required after `trim()`; maximum 120 characters |
| `descricao` | Optional `string` | Maximum 2,000 characters; empty values are normalized to absence |
| `dataCriacao` | `number` | Unix timestamp in milliseconds, generated in the backend |
| `prioridade` | `baixa`, `media`, or `alta` | Defaults to `media` |
| `concluida` | `boolean` | `false` on creation |

Editing preserves the ID, creation date, and completion status. The form replaces editable fields, including priority. Omitting the description or submitting an empty one removes the previous value.

### tRPC Procedures

| Procedure | Type | Input | Return Value |
| --- | --- | --- | --- |
| `tarefas.listar` | Query | Limit, cursor, search, status, and priority | Page and global summary |
| `tarefas.buscarPorId` | Query | ID | Existing task |
| `tarefas.criar` | Mutation | Title, description, and priority | Created task |
| `tarefas.atualizar` | Mutation | ID and form fields | Updated task |
| `tarefas.alterarConclusao` | Mutation | ID and `concluida` boolean | Task with the requested completion state |
| `tarefas.deletar` | Mutation | ID | Deleted ID |

Optional parameters use the defaults defined in the schemas. Queries use GET and mutations use POST according to the tRPC protocol.

### Error Handling

- `BAD_REQUEST`: Invalid input.
- `NOT_FOUND`: Task does not exist.
- Validation messages are formatted to avoid displaying raw Zod JSON.
- Network failures display a connection error message in the interface.
- Mutations are not automatically retried.
- The cache is invalidated after a confirmed mutation.

The completion operation accepts the desired state instead of toggling the current value. Repeating the same call with `concluida: true` does not reopen the task.

## SSR, Pagination, and Metrics

### Initial Server-Side Rendering

`src/app/page.tsx` is an asynchronous Server Component with `dynamic = "force-dynamic"`. On every request, it calls `createServerCaller().tarefas.listar(...)` and passes the first page as `initialData`.

The caller reuses the validation and business rules of the same router used for CRUD. The initial task list is already part of the rendered HTML.

The main page does not use a global `loading.tsx` that would automatically wrap it in a Suspense boundary. Route-level loading is limited to the forms, making it possible to verify the initial task list with JavaScript disabled.

A Client Component supports hooks and events while also participating in the initial server render. `"use client"` does not disable SSR.

### Pagination and Filters

- Default page size of 10 tasks, with a maximum of 50.
- Descending order by creation date and ID.
- Cursor containing `dataCriacao` and `id` of the last task.
- `proximoCursor: null` indicates that there are no more pages.
- Deleting the task referenced by the cursor does not prevent the next page from loading, because comparisons use cursor values.
- Search and filters are applied to the entire collection before pagination.
- The frontend uses `useInfiniteQuery` and `IntersectionObserver`, with a fallback button.
- After a pagination error, retrying requires a user action.

### Metric Definitions

| Metric | Calculation |
| --- | --- |
| Total | Number of tasks in the collection |
| Open | Total minus completed tasks |
| Completed | Number of tasks with `concluida: true` |
| Open high-priority tasks | Number of incomplete tasks with high priority |
| Completion rate | `Math.round(concluidas / total * 100)`; zero for an empty list |

The page's `total` reflects the active search and filters. The `resumo` reflects the entire collection, regardless of which items have been loaded in the browser.

These metrics describe the task list. They do not demonstrate increased productivity, time savings, or financial impact. The focus card follows a deterministic rule based on priorities; it is not an AI feature.

Dates are displayed in São Paulo time. Visual elements use local CSS and SVG, with no required external images or fonts.

## TypeScript Backend Guide

The backend is written entirely in TypeScript and runs within the Next.js Node.js process. tRPC exposes the operations to the browser.

### Responsibility Comparison

| In a .NET API | In This Project |
| --- | --- |
| Controller action | tRPC procedure |
| DTO with validation | Zod schema |
| Contract class/record | TypeScript type inferred from a schema |
| In-memory singleton service | Map in the context, retained through globalThis |
| API 400/404 error | TRPCError BAD_REQUEST/NOT_FOUND |
| Typed HTTP client | tRPC client inferred from AppRouter |

This comparison focuses on responsibilities: the execution mechanisms and concurrency models differ.

### Recommended Reading Order

1. `src/lib/tarefa.ts`: Defines the data and accepted fields.
2. `src/server/context.ts`: Creates the in-memory collection.
3. `src/server/trpc.ts`: Initializes tRPC and formats errors.
4. `src/server/routers/tarefas.ts`: Implements the operations.
5. `src/server/router.ts`: Composes the main router and exports its type.
6. `src/app/api/trpc/[trpc]/route.ts`: Receives HTTP requests.
7. `src/server/caller.ts` and `src/app/page.tsx`: Use the same operations during SSR.

### The Role of Zod

`tarefaSchema` describes and validates incoming fields. `z.infer<typeof tarefaSchema>` derives the corresponding TypeScript type.

The procedure declares `.input(tarefaSchema)`. tRPC validates the input before executing the operation, similar to validating a DTO before it reaches an API action.

The form reuses the same schema, but the backend still validates requests made without going through the interface.

### Context and In-Memory Storage

`createContext()` makes `ctx.tarefas` available to the procedures. The collection is a `Map` indexed by UUID.

`globalThis` preserves the reference within the process, including during module reevaluation in development. This is not persistence: restarting the process clears the collection.

Map reads and writes are synchronous, with no `await` between checking and modifying a task. There is no coordination between processes or guarantee of concurrent edit protection across clients; a later update can overwrite an earlier one.

### Queries and Mutations

`listar` and `buscarPorId` are read-only queries. `criar`, `atualizar`, `alterarConclusao`, and `deletar` are mutations.

The HTTP transport uses GET for queries and POST for mutations. These names identify operations in the tRPC protocol rather than REST routes based on HTTP verbs and resources.

`encontrar()` centralizes the error raised when a task does not exist. On the frontend, errors are converted into user-facing messages.

### Typing and Execution

The frontend imports `AppRouter` using `import type`. This shares the contract at compile time without bundling the server implementation into the browser code.

Static typing helps detect incorrect calls during development. Zod validates data at runtime.

During SSR, the server calls the router directly. After hydration, the browser uses the tRPC client over HTTP.

## Project Presentation

### Implemented Enhancements

| Enhancement | What It Demonstrates |
| --- | --- |
| Backend-calculated metrics | Effective use of available data with clear definitions |
| Completion and priority | Translating an organizational need into straightforward behavior |
| Search and filters before pagination | Correct results even for data not yet loaded |
| Cursor with date and ID | Handling deletions and identical timestamps |
| SSR visible without JavaScript | Understanding the requirement and verifying it in the browser |
| Shared contracts and validation | Consistency between frontend and backend |
| Business-rule and flow tests | Confidence in important behaviors |
| CI workflow ready | Reproducible checks for delivery |
| Accessible, responsive interface | Attention to user experience |
| README covering limitations and decisions | Technical communication and scope management |

The metrics represent task counts and completion rates. There is not enough data to claim productivity gains, time savings, or financial impact.

### Next Step: AI Agent

- **Suggest subtasks based on a task's description**.

The proposed flow is simple: the user requests suggestions, reviews a preview, and chooses what to keep. Creating subtasks still requires human confirmation.

## Troubleshooting

### Playwright Not Found or Implicit `any` Parameters

Reinstall the development dependencies from the project root:

```bash
npm ci --include=dev
npm ls @playwright/test
```

If the dependency was removed from `package.json`, reinstall the version used by the project:

```bash
npm install -D --save-exact @playwright/test@1.64.1 --include=dev
```

The tests should remain separate:

| File | Test Runner and Import |
| --- | --- |
| `tests/tarefas.test.ts` | Backend: `import { test } from "node:test";` |
| `tests/e2e/tarefas.spec.ts` | Browser: `import { test, expect } from "@playwright/test";` |

E2E test code should not be copied into the backend test file. Once the package is resolved correctly, the types for `page`, `browser`, and callbacks are inferred.

### Port in Use or Connection Error

For development, use a different port with `npm run dev -- --port 3001`. For E2E tests, keep port 3100, as configured in Playwright, available.

If the interface reports a connection error, make sure the server is running and check its terminal output. This project does not have a separate API that needs to be started in another process.

## Next Steps and Improvements

| Priority | Improvement | Goal | How to Validate |
| --- | --- | --- | --- |
| High | Publish and monitor CI in the repository | Make remote validation reproducible | Complete pipeline passes on a PR |
| High | Automated accessibility audit | Extend checks for contrast, keyboard support, and semantics | Automated tests plus manual review |
| High | Per-task version control | Detect concurrent edits instead of silently overwriting data | Test two edits against the same version |
| Medium | Structured observability | Diagnose operation latency and failures | Correlated logs and tests for key events |
| Medium | Export filtered results | Make it easier to review the task list outside the application | Export all pages while respecting filters |
| Medium | Broader UI test coverage | Verify additional screen sizes and browsers | Additional scenarios running in CI |
| Product evolution | Shared persistent storage | Retain data after restarts and support multiple replicas | Integration tests with persistent storage |
| Product evolution | Authentication and authorization | Separate tasks by user with backend-side access checks | Tests for allowed and denied access |
| Additional feature | AI-powered subtask suggestions | Help turn a task description into actionable next steps | Validated output, preview, confirmation, and error handling |

## Limitations and Scope Decisions

- Storage is a `Map` shared only within the current Node.js process.
- Restarting the server removes all data; multiple instances do not share the task list.
- The current version should run in a single Node.js instance. Serverless environments or replicas would require a different storage approach.
- There is no authentication, per-user isolation, or real-time synchronization between browser tabs.
- Pagination does not provide a snapshot across requests; concurrent changes may appear in subsequent updates.
- A later edit may overwrite data from another edit. Concurrency control is on the roadmap.
- The current accessibility implementation covers basic practices; a full audit is planned.
- The visual identity is a design study inspired by the reference provided for the technical challenge.

## References

- [Next.js 15](https://nextjs.org/docs/15)
- [tRPC](https://trpc.io/docs/)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zod](https://zod.dev/)
- [Playwright](https://playwright.dev/docs/intro)
- [TypeScript and Side-Effect Imports](https://www.typescriptlang.org/tsconfig/noUncheckedSideEffectImports.html)
- [Artefact](https://www.artefact.com/br/)
- [Data & Software Engineer — Artefact](https://jobs.artefact.com/job/data-software-engineer-m-f-d/)
