# THERASSISTANT Retool Export Salvage Bundle

This bundle keeps the useful UI/workflow artifacts from the Retool export without requiring Retool.

## Use

Copy `src/imported-ui/` into the GitHub repo as a reference import area, then port one page/module at a time into the real app.

Recommended first imports:
1. `types/rcm.ts` — domain/UI type reference only. Reconcile with Supabase-generated `database.types.ts` before using for live data.
2. `components/` — reusable UI pieces.
3. `pages/` — page layout/workflow references.
4. `data/mockData.ts` — mock/demo only; do not treat as database truth.
5. `orgTheme.css` — visual theme reference.

## Do not use directly

`reference-only/retool-backend/` contains Retool backend functions using Retool-specific `database.query(...)` resource calls. They should not be copied into production as-is.

Use these backend files only as query-shape references when creating Supabase service methods in the real repo.

## Required guardrails

- Supabase schema remains source of truth.
- Generate/update `src/types/database.types.ts` from Supabase before wiring live services.
- Do not invent tables or columns.
- Keep historical payment posting separate from claim-based posting.
- Keep patient-submitted journal/check-in/questionnaire content separate from provider-authored clinical documentation unless provider-reviewed/imported.
- Billing company access must be scoped to linked practices.
- Tenant/practice/user context required for service calls.
