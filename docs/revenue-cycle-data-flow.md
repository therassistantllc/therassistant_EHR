# Revenue cycle data flow (schema-alignment pass)

This map uses repository-confirmed facts only. Live Supabase schema objects were not inspectable from current repo context, so mappings below identify expected module boundaries and current schema visibility status.

## Primary revenue-cycle workflow

| Workflow stage | Expected service boundary | Schema mapping status | Notes |
| --- | --- | --- | --- |
| Patient intake / registration | `patientService` | Missing (not inspectable) | Candidate tables in notes: `patients`, `portal_submissions`. |
| Insurance | `patientService` | Missing (not inspectable) | Candidate table: `patient_coverages`. |
| Eligibility | `eligibilityService` | Missing (not inspectable) | Candidate support implied by workflow notes only. |
| Appointment / pre-session readiness | `preSessionReadinessService` | Missing (not inspectable) | Derived from dashboard workflow mock data today. |
| Documentation readiness | `documentationReadinessService` | Missing (not inspectable) | Must preserve provider-authored docs separate from patient submissions. |
| Charge capture | `chargeCaptureService` | Missing (not inspectable) | Candidate table: `charges`. |
| Claim / 837P | `claimsService` | Missing (not inspectable) | Candidate table: `claims`. |
| Claim status / follow-up | `claimsService`, `taskWorkqueueService` | Missing (not inspectable) | Queue/follow-up currently mocked. |
| Payment posting | `paymentPostingService` | Missing (not inspectable) | Claim-based payment path remains separate. |
| Patient ledger / balance | `patientLedgerService` | Missing (not inspectable) | Ledger tables not verifiable from repo. |
| Denials / A/R | `denialArService` | Missing (not inspectable) | Candidate table: `denial_events`. |
| Reporting | `reportingService` | Missing (not inspectable) | Reporting currently mock summaries only. |

## Historical payment workflow (kept separate)

| Workflow stage | Expected service boundary | Schema mapping status | Notes |
| --- | --- | --- | --- |
| Historical payment posting | `historicalPaymentPostingService` | Missing (not inspectable) | Explicitly separate from claim-based posting. |
| Patient ledger | `patientLedgerService` | Missing (not inspectable) | Must support audit linkage to historical postings. |
| Reporting | `reportingService` | Missing (not inspectable) | Historical and claim-based payment metrics should remain attributable. |

## Boundary rules preserved in service contracts

- Patient-submitted content import requires provider review prior to clinical-note integration.
- Historical payment posting has a dedicated service separate from claim-based payment posting.
- Tenant/practice/user context is required for service calls.
- Audit boundary represented through dedicated `auditService`.
