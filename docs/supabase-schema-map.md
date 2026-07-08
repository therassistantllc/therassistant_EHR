# Supabase schema map

## Inspection summary

- **Framework/routing:** Vite + React + React Router (`src/main.tsx`, `src/App.tsx`) with static route definitions from `workflowModules`.
- **`src/` organization:** `components`, `data`, `lib`, `pages`, `types`; currently mock-data driven.
- **Path aliases:** none configured in `tsconfig.app.json` or `vite.config.ts`.
- **Supabase config/code:** env placeholders exist (`.env.example`, `src/lib/env.ts`); typed client exists at `src/lib/supabaseClient.ts`.
- **Env usage:** `VITE_APP_NAME`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` only.
- **Existing docs:** `README.md`, `docs/supabase-schema-notes.md`, and `docs/supabase-project-reference.md`.

## Connected Supabase project

- **Project name:** THERASSISTANT EHR
- **Project ref:** `btsbmozbggjllpcsuyyy`
- **Project URL:** `https://btsbmozbggjllpcsuyyy.supabase.co`
- **Region:** `us-east-2`
- **Generated type target:** `src/types/database.types.ts`
- **Type generation command:** `npm run supabase:types`

## Connected Supabase inspect status

| Check | Status | Evidence |
| --- | --- | --- |
| Supabase CLI available | Pending in local/dev environment | The npm script uses `npx -y supabase ...`; authenticated Supabase access is still required. |
| `supabase/config.toml` present | Yes | `supabase/config.toml` declares `project_id = "btsbmozbggjllpcsuyyy"`. |
| Live project ref in repo | Yes | Project reference documented in `docs/supabase-project-reference.md`. |
| Generated DB types in repo before live generation | No | `src/types/database.types.ts` remains the generated target. |
| SQL migrations / RLS policy files | No local migrations committed | Supabase project remains the source of truth. |
| Runtime secrets in repo | No service-role secrets | `.env.example` contains public setup placeholders only. |

## Actual schema objects discovered from connected project

Live tables/views/enums/functions/RLS policies are not represented in this repository yet. This repository should treat the connected Supabase project as the schema source of truth and generate `src/types/database.types.ts` from the project before wiring live data.

Required for live inspection/type generation:

- Supabase CLI access through `npx -y supabase`
- Supabase project ref `btsbmozbggjllpcsuyyy`
- Authenticated Supabase access, such as `SUPABASE_ACCESS_TOKEN`

## In-repo schema references (non-authoritative planning only)

The following are planning notes only from `docs/supabase-schema-notes.md` and are not treated as live-schema truth in code:

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

Relationship details, scoping columns, and RLS enablement for these objects are undetermined until generated Supabase types or schema exports are reviewed.

## Service boundaries

Keep current service boundaries unchanged and treat each as `schema_pending` until real generated Supabase types are available.

| Service boundary | Status |
| --- | --- |
| Dashboard | schema_pending |
| Tenant / Practice Management | schema_pending |
| Patient Management | schema_pending |
| Eligibility & Benefits | schema_pending |
| Pre-Session Dashboard | schema_pending |
| Patient Portal | schema_pending |
| In-Between Session Journal | schema_pending |
| Clinical Documentation Readiness | schema_pending |
| Charge Capture | schema_pending |
| Claims / 837P foundation | schema_pending |
| Payment Posting + Historical Payment Posting | schema_pending |
| Denial Management & A/R | schema_pending |
| Reporting | schema_pending |
| Mailroom | schema_pending |
| Tasks & Workqueues | schema_pending |
| Credentialing / Contracting | schema_pending |

## THERASSISTANT module usage status

All current pages are scaffold modules backed by mock data (`src/data/mockData.ts`). No module currently reads from live Supabase tables yet.

## Notes

- Do not invent database tables.
- Do not fake generated types.
- Do not use destructive migrations.
- Do not use service-role keys in client code.
- Keep historical payment posting separate from claim-based payment posting.
- Keep patient-submitted journal/check-in/questionnaire content separate from provider-authored clinical documentation unless provider-reviewed/imported.
