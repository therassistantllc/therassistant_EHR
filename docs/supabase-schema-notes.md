# Supabase-ready schema notes

This first version is intentionally frontend-heavy and uses mock data to demonstrate tenant-aware workflows. The following backend notes describe how the THERASSISTANT foundation is intended to map into Supabase.

## Core modeling rules

- Every tenant-scoped table should include `practice_id`.
- Cross-practice billing access should flow through a dedicated linking table such as `billing_company_links` instead of broad role inheritance.
- Patient-submitted content must live in separate tables from provider-authored clinical documentation.
- Audit columns should be standard on operational tables: `created_at`, `created_by`, `updated_at`, `updated_by`, and `audit_event_id` where applicable.

## Suggested starter tables

| Table | Purpose | Notes |
| --- | --- | --- |
| `practices` | Practice tenant record | Holds name, status, timezone, billing-company relationship, and branding metadata. |
| `billing_companies` | Shared billing organizations | Supports centralized billing across linked practices. |
| `billing_company_links` | Join table for practice ↔ billing company access | Enables scoped workqueue access without exposing all tenant data. |
| `profiles` | Auth-linked user profile | Maps Supabase auth users to application metadata. |
| `user_role_assignments` | Practice-scoped user roles and permissions | Supports platform admin, practice admin, clinician, biller, front desk, and patient access. |
| `patients` | Core patient demographic record | Clinical documentation should reference this record, not embed it. |
| `patient_coverages` | Insurance policy history | Preserve effective/termination history and verification snapshots. |
| `portal_submissions` | Check-in, questionnaire, and insurance updates | Store as patient-submitted data pending review. |
| `journal_entries` | In-between session journal content | Keep distinct from final clinical notes. |
| `journal_note_imports` | Provider-selected import snippets | Audit which snippets were reviewed/imported into draft notes. |
| `clinical_notes` | Provider-authored documentation | Final signed notes remain clinician-controlled. |
| `documentation_readiness_checks` | Missing-elements tracking | Supports time, goals, diagnosis, intervention, and medical necessity flags. |
| `charges` | Charge capture queue | Includes billing blockers and release state. |
| `claims` | 837P claim header/service line foundation | Track status, timely filing, corrected claims, and appeals. |
| `payment_events` | Insurance, patient, and historical payment posting | Handle ERA/EOB, adjustments, and patient ledger transfers. |
| `denial_events` | Denial + follow-up tracking | Separate credentialing denials from claim-edit denials. |
| `tasks` | Shared workqueue model | Carry tenant, status, priority, assignee, and due-date metadata. |
| `mailroom_items` | Incoming payer correspondence registry | Supports assignment to patients, claims, payers, and tasks. |
| `credentialing_records` | Enrollments, contracts, revalidation | Connect to denial risk without commingling operational claim data. |

## Row-level security preparation

- Build RLS policies around `practice_id` membership derived from authenticated user role assignments.
- Billing company users should be granted visibility only to practices listed in `billing_company_links`.
- Patient users should see only their own portal, journal, and balance-facing records.
- Platform admins should have explicit elevated policies rather than relying on application-only checks.
