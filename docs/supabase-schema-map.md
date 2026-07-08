# Supabase schema map (repository-context inspection)

## Inspection summary

- **Framework/routing:** Vite + React + React Router (`src/main.tsx`, `src/App.tsx`) with static route definitions from `workflowModules`.
- **`src/` organization:** `components`, `data`, `lib`, `pages`, `types`; currently mock-data driven.
- **Path aliases:** none configured in `tsconfig.app.json` or `vite.config.ts`.
- **Supabase config/code:** env placeholders exist (`.env.example`, `src/lib/env.ts`); typed client added at `src/lib/supabaseClient.ts`.
- **Env usage:** `VITE_APP_NAME`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` only.
- **Existing docs:** `README.md`, `docs/supabase-schema-notes.md` (planning notes, not verified live schema).

## Connected Supabase inspect status

| Check | Status | Evidence |
| --- | --- | --- |
| Supabase CLI available | No | `supabase --version` returned `command not found` |
| `supabase/config.toml` present | No | No `supabase/` directory in repository |
| Live project ref in repo | No | No Supabase project reference file found |
| Generated DB types in repo before this pass | No | No existing `database.types.ts` file |
| SQL migrations / RLS policy files | No | No `*.sql` files or migrations directory |
| Runtime secrets in repo | No | Only `.env.example` placeholders |

## Actual schema objects discovered from connected project

No tables/views/enums/functions/RLS policies could be inspected from this repository context because project connection metadata and Supabase CLI access are not available.

Required for live inspection/type generation:

- Supabase CLI available in environment
- Supabase project ref
- Auth for `supabase gen types` (for example `SUPABASE_ACCESS_TOKEN`)

## In-repo schema references (non-authoritative planning only)

The following are **planning notes only** from `docs/supabase-schema-notes.md` and are not treated as live-schema truth in code:

- `practices`
- `billing_companies`
- `billing_company_links`
- `profiles`
- `user_role_assignments`
- `patients`
- `patient_coverages`
- `portal_submissions`
- `journal_entries`
- `journal_note_imports`
- `clinical_notes`
- `documentation_readiness_checks`
- `charges`
- `claims`
- `payment_events`
- `denial_events`
- `tasks`
- `mailroom_items`
- `credentialing_records`

Relationship details, scoping columns, and RLS enablement for these objects are **undetermined** without direct project inspection.

## THERASSISTANT module usage status (current app)

All current pages are scaffold modules backed by mock data (`src/data/mockData.ts`). No module currently reads from live Supabase tables yet.
