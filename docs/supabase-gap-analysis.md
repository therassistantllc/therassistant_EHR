# Supabase gap analysis (source-of-truth alignment)

## Baseline

- Current app is scaffolded and mock-data driven.
- Live Supabase schema could not be inspected from repository context.
- No Supabase migrations, SQL, or policy files are present locally.
- DB type generation from live project is pending environment/project access.

## Workflow coverage vs schema visibility

| Area | Coverage status | Gap detail |
| --- | --- | --- |
| Tenant / practice | Partial (UI only) | No verified tables/policies in repo; scoping and link model not validated against live schema. |
| User / role / permission | Partial (UI only) | No verified role-assignment tables or policy logic available locally. |
| Patient | Partial (UI only) | No inspectable schema or FK constraints for patient identity/demographics. |
| Eligibility | Missing | No verified eligibility objects or indexes visible. |
| Pre-session readiness | Missing | No inspectable aggregation model for readiness flags. |
| Documentation readiness | Partial (guardrail defined) | Provider-review rule documented; schema and policy enforcement unavailable. |
| Charge capture | Missing | No inspectable charge/line-item structure. |
| Claims / 837P | Missing | No inspectable claim header/line/status model. |
| Payment posting | Missing | No inspectable claim-based posting model. |
| Historical payment posting | Missing | Must remain separate from claim-based posting; no inspectable schema yet. |
| Denial / A/R | Missing | No inspectable denial taxonomy/follow-up model. |
| Patient ledger | Missing | No inspectable ledger/balance structures. |
| Mailroom | Missing | No inspectable correspondence intake model. |
| Reporting | Missing | No inspectable materialized/reporting views/functions. |
| Task / workqueue | Missing | No inspectable queue assignment model. |
| Audit | Partial (rule only) | Guardrails exist in app copy; no inspectable audit event schema. |

## Missing/unknown technical items

- **Fields:** practice/tenant/user scoping fields for each table are unknown.
- **Relationships/FKs:** unknown due to lack of live schema inspection.
- **Indexes:** unknown due to lack of migrations/schema dump.
- **RLS status:** unknown for all objects.
- **Ambiguous/duplicate tables:** cannot validate from connected project without schema access.

## Adapter hotspots for upcoming legacy import

- Any legacy module that directly queries tables must be wrapped behind typed services in `src/services/supabase`.
- Legacy flows for claims, payments, denials, and reporting are high-risk until real table names/columns/FKs are confirmed.
- Patient-submitted journal/check-in/questionnaire imports require explicit provider-review mediation in adapters.
- Billing-company cross-practice access requires linked-practice scoping checks before exposing queues.

## Defer-until-reviewed areas

- Final table-to-service mapping and query implementations.
- RLS policy assumptions and permission matrix wiring.
- Index strategy and reporting view/RPC design.
- Any schema-normalization decisions (duplicates/renames) pending actual schema review.
