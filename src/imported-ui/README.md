# Imported Retool UI Reference

This folder is a safe landing area for Retool-exported UI/workflow material.

Current import status:

- `types/rcm.ts` has been imported as a domain/UI type reference.
- The full cleaned Retool salvage bundle remains the source artifact for additional pages/components.
- Do not wire these files directly into runtime until each module is reconciled with generated Supabase types.

## Guardrails

- Supabase remains the schema source of truth.
- Treat Retool files as reference material, not production code.
- Do not use Retool `database.query(...)` code in the app runtime.
- Keep historical payment posting separate from claim-based payment posting.
- Keep patient-submitted journal/check-in/questionnaire content separate from provider-authored clinical documentation unless provider-reviewed/imported.
- Billing-company access must be scoped to linked practices.
- Tenant/practice/user context is required for service calls.

## Suggested port order

1. Domain/UI types.
2. Shared layout components.
3. Dashboard.
4. Patients.
5. Pre-session workflow.
6. Payment posting and historical payment posting.
7. Denials and AR workqueues.
8. Mailroom.
