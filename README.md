# THERASSISTANT

Initial SaaS foundation for a behavioral health revenue cycle and EHR-adjacent platform focused on practices, billing companies, clinicians, staff, and patients.

## What is included

- Multi-tenant dashboard-first React + TypeScript app scaffold
- Role switcher for platform admin, billing company admin, practice admin, clinician, biller, front desk, and patient personas
- Foundational module pages for:
  - Dashboard
  - Tenant / Practice Management
  - Patient Management
  - Eligibility & Benefits
  - Pre-Session Dashboard
  - Patient Portal
  - In-Between Session Journal
  - Clinical Documentation Readiness
  - Charge Capture
  - Claims / 837P foundation
  - Payment Posting + Historical Payment Posting
  - Denial Management & A/R
  - Reporting
  - Mailroom
  - Tasks & Workqueues
  - Credentialing / Contracting
- Supabase-ready environment configuration and schema notes
- Mocked workflow data to demonstrate behavioral health operational flows

## Tech stack

- Vite
- React
- TypeScript
- React Router
- Oxlint

## Local setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build the app:

   ```bash
   npm run build
   ```

5. Lint the app:

   ```bash
   npm run lint
   ```

## Mocked vs. production-ready

### Mocked in this first version

- Authentication and tenant context are represented with a local role/workspace switcher
- Dashboard counts, workqueues, and patient-facing workflows use in-memory mock data
- Supabase integration is prepared through environment/config structure and schema notes, but no live backend is wired yet

### Production-ready direction established

- Practice-level tenant separation concepts
- Billing-company linked-practice access model
- Role-based navigation and workflow focus
- Separate handling of patient-submitted content versus provider-authored documentation
- Audit-friendly workflow guardrails and HIPAA-conscious structure

## Supabase-ready notes

See `docs/supabase-schema-notes.md` for schema and row-level security preparation notes.

## Suggested next steps

1. Wire Supabase auth and role assignment tables.
2. Implement practice-scoped data access and row-level security policies.
3. Replace mock workflow data with real dashboard queries and workqueues.
4. Add form flows for patient intake, journal submission, charge capture, and payment posting.
5. Add automated tests once the product flows and backend contracts solidify.
