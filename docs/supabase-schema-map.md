# Supabase schema map

## Connected project

- **Project name:** THERASSISTANT EHR
- **Project ref:** `lpjwfdvaxobewxcklenl`
- **Project URL:** `https://lpjwfdvaxobewxcklenl.supabase.co`
- **Region:** `us-east-2`
- **Generated type target:** `src/types/database.types.ts`
- **Type generation:** `npm run supabase:types`
- **Browser configuration:** `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`

Supabase is the source of truth for schema and tenant authorization. The connected project has Row Level Security enabled on the tenant-scoped application tables and authenticated Data API grants are present.

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
| Mailroom | `documents` with `document_status = pending_review` |
| Reporting | `v_tenant_operating_kpis`, `v_open_ar_summary` |
| Tasks | `workqueue_items`, `v_open_workqueue` |
| Audit | `audit_logs` |
| Authentication context | Supabase Auth + `get_app_context()` |

## Service boundary status

`src/services/supabase/index.ts` now uses the live schema instead of returning `schema_pending` placeholders. Reads are tenant-scoped and writes that have authoritative database RPCs use those RPCs.

Claim creation, validation, and batching are available. **External claim transmission is intentionally not enabled yet** because no clearinghouse submission endpoint is configured in the connected backend. The service throws instead of falsely recording a transmission.

Patient-submitted content import into clinical notes is also intentionally blocked because the current schema has no authoritative patient-submission source table. That workflow must not be enabled until the source schema and provider-review audit trail exist.

## Security / data handling

- Keep service-role or secret keys out of browser code and the repository.
- Use the Supabase publishable key in the browser; RLS remains the authorization boundary.
- Preserve billing-company-to-practice and tenant scoping on every operation.
- Keep historical payment posting separate from claim-based payment posting.
- Keep patient-submitted content separate from provider-authored clinical documentation until reviewed/imported through an auditable workflow.
- Run Supabase security/performance advisors after schema changes.

## Type generation

The repository's type-generation command points to the active project. Refresh generated types after database migrations:

```bash
npm run supabase:types
```
