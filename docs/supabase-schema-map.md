# Supabase schema map

## Connected project

- **Project name:** KrystinButler's Project
- **Project ref:** `lpjwfdvaxobewxcklenl`
- **Project URL:** `https://lpjwfdvaxobewxcklenl.supabase.co`
- **Region:** `ca-central-1`
- **Generated type target:** `src/types/database.types.ts`
- **Type generation:** `npm run supabase:types`
- **Browser configuration:** `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`

Supabase is the source of truth for schema and tenant authorization. Row Level Security is enabled on the tenant-scoped application tables. General tenant policies now require an active tenant role in addition to membership: `client` is excluded from general PHI/RCM access, and `read_only` is excluded from writes. The role-gate helpers live in the non-exposed `private` schema.

## Live backend objects used by the application

| Application area | Supabase source |
| --- | --- |
| Tenant / practice | `tenants`, `billing_company_practice_links`, `tenant_user_roles` |
| Patient management | `clients`, `v_client_profile_summary` |
| Eligibility | `eligibility_checks`, `eligibility_benefits` |
| Pre-session | `v_upcoming_appointments` |
| Clinical documentation | `clinical_notes`, `v_unsigned_clinical_notes` |
| Charge capture | `charge_capture_items`, `v_charge_capture_workqueue`, `create_charge_from_appointment()` |
| Claims | `professional_claims`, `v_claim_ar`, `create_claim_from_charge()`, `validate_claim()`, `create_claim_batch()` |
| Payment posting | `payments`, `payment_allocations`, `v_payment_reconciliation`, `post_insurance_payment()` |
| Historical posting | `historical_transactions`, `post_historical_transaction()` |
| Denials / A/R | `denials`, `v_denial_inventory`, `create_workqueue_item()` |
| Ledger | `ledger_entries`, `ledger_transactions` |
| Mailroom | `documents` |
| Reporting | `v_tenant_operating_kpis`, `v_open_ar_summary` |
| Tasks | `workqueue_items`, `v_open_workqueue` |
| Credentialing | `provider_payer_enrollments`, `v_provider_enrollment_matrix` |
| Audit | `audit_logs` |
| Authentication context | Supabase Auth + `get_app_context()` |

All application views used by the frontend are configured with `security_invoker=true`, so their underlying RLS policies remain effective for the signed-in user.

## Frontend connection status

The application shell now uses Supabase Auth and `get_app_context()` instead of mock practice/workspace selection. The workspace selector contains only tenants assigned to the authenticated user, and the role selector contains only roles assigned to that user for the active tenant.

The dashboard loads live tenant KPIs, open A/R, and pre-session appointments. Live queue/registry data is connected for tenant management, patient management, eligibility, pre-session, documentation readiness, charge capture, claims, payment posting, denials/A/R, reporting, mailroom, tasks/workqueues, and credentialing.

The existing `workflowModules` configuration remains in `src/data/mockData.ts` only for navigation labels, workflow descriptions, guardrails, and other static product copy. Mock operational counts and queue rows are no longer rendered by connected modules.

Two workflows remain intentionally deferred:

- **Patient Portal:** no safe authenticated-user-to-client identity binding exists yet, so the application does not expose tenant-wide patient records to a client login.
- **In-Between Session Journal:** the schema does not yet contain an authoritative patient journal/submission source table and audited provider-review/import path.

## Service boundary status

`src/services/supabase/index.ts` uses the live schema instead of returning `schema_pending` placeholders. Reads are tenant-scoped and writes that have authoritative database RPCs use those RPCs.

Claim creation, validation, and batching are available. **External claim transmission is intentionally not enabled yet** because no clearinghouse submission endpoint is configured in the connected backend. The service throws instead of falsely recording a transmission.

Patient-submitted content import into clinical notes is also intentionally blocked because the current schema has no authoritative patient-submission source table. That workflow must not be enabled until the source schema and provider-review audit trail exist.

## Security / data handling

- Never place a service-role or secret key in browser code or the repository.
- The Supabase publishable key is a public browser credential; authenticated JWTs plus RLS enforce data access.
- General tenant RLS requires active role assignment as well as active membership.
- `client` roles are denied general tenant PHI/RCM table access until patient-specific identity policies are implemented.
- `read_only` roles can read permitted tenant data but cannot write through the general tenant policies.
- Preserve billing-company-to-practice and tenant scoping on every operation.
- Keep historical payment posting separate from claim-based payment posting.
- Keep patient-submitted content separate from provider-authored clinical documentation until reviewed/imported through an auditable workflow.
- Run Supabase security/performance advisors after schema changes.

## Type generation

The repository's type-generation command points to the active project. Refresh generated types after database migrations:

```bash
npm run supabase:types
```
