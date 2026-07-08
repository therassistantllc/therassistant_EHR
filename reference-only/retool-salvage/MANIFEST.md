# Retool Salvage Manifest

The cleaned Retool salvage bundle contains these files. They should be treated as reference/import material only.

## Imported in this branch

- `README_RETOOL_SALVAGE_IMPORT.md`
- `src/imported-ui/README.md`
- `src/imported-ui/types/rcm.ts`
- `src/imported-ui/App.from-retool.tsx`
- `src/imported-ui/orgTheme.css`
- `src/imported-ui/context/AppContext.tsx`
- `src/imported-ui/components/Layout.tsx`
- `src/imported-ui/components/StatCard.tsx`

## Remaining salvage files from the cleaned bundle

### Components

- `src/imported-ui/components/NotificationsDrawer.tsx`
- `src/imported-ui/components/Sidebar.tsx`
- `src/imported-ui/components/StarterCanvas.tsx`
- `src/imported-ui/components/StatusBadge.tsx`

### Data

- `src/imported-ui/data/mockData.ts`

### Pages

- `src/imported-ui/pages/ChargeCapture.tsx`
- `src/imported-ui/pages/Claims.tsx`
- `src/imported-ui/pages/Credentialing.tsx`
- `src/imported-ui/pages/Dashboard.tsx`
- `src/imported-ui/pages/Denials.tsx`
- `src/imported-ui/pages/Documentation.tsx`
- `src/imported-ui/pages/Eligibility.tsx`
- `src/imported-ui/pages/Journal.tsx`
- `src/imported-ui/pages/Mailroom.tsx`
- `src/imported-ui/pages/NoteEditor.tsx`
- `src/imported-ui/pages/PatientDetail.tsx`
- `src/imported-ui/pages/PatientPortal.tsx`
- `src/imported-ui/pages/Patients.tsx`
- `src/imported-ui/pages/PaymentPosting.tsx`
- `src/imported-ui/pages/PracticeManagement.tsx`
- `src/imported-ui/pages/PreSession.tsx`
- `src/imported-ui/pages/PriorAuth.tsx`
- `src/imported-ui/pages/Reporting.tsx`
- `src/imported-ui/pages/Tasks.tsx`

### Reference-only Retool backend

- `reference-only/retool-backend/appointments/getAppointments.ts`
- `reference-only/retool-backend/charges/getCharges.ts`
- `reference-only/retool-backend/claims/getClaims.ts`
- `reference-only/retool-backend/clients/getClientById.ts`
- `reference-only/retool-backend/clients/getClients.ts`
- `reference-only/retool-backend/dashboard/getDashboardMetrics.ts`
- `reference-only/retool-backend/notes/getClinicalNotes.ts`
- `reference-only/retool-backend/payers/getPayers.ts`
- `reference-only/retool-backend/shared/config.ts`
- `reference-only/retool-backend/workqueue/getWorkqueueItems.ts`

### Plans

- `reference-only/plans/IMPORT_PLAN.md`
- `reference-only/plans/README.md`
- `reference-only/plans/import-build-plan.json`

## Notes

Do not wire these files into runtime as-is. Port one module at a time through the existing Supabase service boundaries and generated database types.
