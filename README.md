# Supabase + Mikro-ORM on Next.js 15

A production-ready starter that wires up **Next.js 15 (App Router)** with **Supabase**, **Mikro-ORM**, and **PostgreSQL**. It is optimised for deployment on Vercel using Supabase as the managed Postgres database.

https://github.com/Jenth1234/test-vercel-supabase

## Features

- Server-rendered UI built with the Next.js 15 App Router
- Supabase authentication with both browser and server helpers
- Mikro-ORM configured against the Supabase PostgreSQL connection (pooled URL recommended)
- Example Todo entity, migrations, API route (`/api/todos`), and server actions
- Zod-powered environment variable validation with `.env.example`

## Getting started

1. **Clone the repo and install dependencies**
   ```bash
   npm install
   ```
2. **Create your Supabase project** and go to **Project Settings → API** to copy:
   - `Project URL`
   - `anon` public key
   - `service_role` secret
3. **Enable connection pooling** in Supabase (recommended for Vercel). Copy the pooled connection string from **Database → Connection string → Pooled** and use it as `DATABASE_URL`.
4. **Populate environment variables**
   ```bash
   cp .env.example .env.local
   # edit .env.local with the values from Supabase
   ```
5. **Run database migrations**
   ```bash
   npm run migrate
   ```
6. **Start the dev server**
   ```bash
   npm run dev
   ```
   The app lives at http://localhost:3000.

> 💡 Because environment variables are validated at runtime, make sure `.env.local` is present before running any scripts.

## Available scripts

| Script            | Description |
| ----------------- | ----------- |
| `npm run dev`     | Start Next.js in development mode |
| `npm run build`   | Production build (requires env vars set) |
| `npm run start`   | Serve the production build |
| `npm run lint`    | Run ESLint in legacy `.eslintrc` mode |
| `npm run migrate` | Apply pending Mikro-ORM migrations |
| `npm run mikro-orm <cmd>` | Run arbitrary Mikro-ORM CLI command |

## Database & Mikro-ORM

- Entities live in `src/lib/entities`. The example `Todo` entity is migrated by `migrations/Migration20241105000000.ts`.
- `mikro-orm.config.ts` consumes `DATABASE_URL` and (optionally) `SHADOW_DATABASE_URL` for diffing.
- Generate new migrations with:
  ```bash
  npm run mikro-orm migration:create -- --initial
  ```
- Apply migrations locally or inside Vercel build step with `npm run migrate`.

## Supabase integration

- `src/components/supabase-provider.tsx` exposes a Supabase context on the client.
- `src/lib/supabase/server-client.ts` wraps the SSR helper for server components, route handlers, and server actions.
- Example REST endpoints live in `src/app/api/todos/route.ts` and server actions in `src/app/actions/todo-actions.ts`.

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. On Vercel, import the project and set the following environment variables for **Production** and **Preview**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `SHADOW_DATABASE_URL` (optional, recommended for safe migrations)
3. Add a [Vercel Postgres integration](https://vercel.com/integrations/supabase) or keep using Supabase pooling (port `6543`).
4. Leave the **Output Directory** field empty (or `.next`) so Vercel picks the default Next.js build folder.
5. Run migrations as part of deployment by adding a post-deployment hook or enabling [Vercel Job Migrations](https://vercel.com/docs/workflows/scheduled-jobs) that calls `npm run migrate`.

## Linting

- The project keeps a traditional `.eslintrc.json` for compatibility with existing tooling.
- Use `npm run lint` to lint the entire codebase. The script sets `ESLINT_USE_FLAT_CONFIG=false` via `cross-env` so the legacy configuration continues to work on any platform.
- When ready to adopt the new ESLint flat config, remove the environment variable and migrate the rules into `eslint.config.js`.

## Folder structure overview

```
├── src
│   ├── app
│   │   ├── actions          # Server actions
│   │   ├── api/todos        # REST API example backed by Mikro-ORM
│   │   ├── layout.tsx       # Root layout wiring Supabase session
│   │   └── page.tsx         # Demo UI with Todo list
│   ├── components           # Client components (forms, providers)
│   └── lib
│       ├── entities         # Mikro-ORM entities
│       ├── supabase         # Supabase helpers (browser/server)
│       ├── env.ts           # Server-side env validation
│       └── public-env.ts    # Client-safe env access
├── migrations               # Mikro-ORM migrations
├── mikro-orm.config.ts      # CLI + runtime ORM configuration
└── next.config.mjs          # Next.js configuration
```

## Next steps

- Replace the demo Todo entity with your domain models.
- Connect Supabase Auth UI or OAuth providers using the included Supabase helpers.
- Add Vitest / Playwright according to your testing requirements.

Happy shipping! 🚀
