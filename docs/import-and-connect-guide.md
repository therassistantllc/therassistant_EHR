# Import and connect guide (for cleaned legacy modules)

## 1) Treat Supabase as schema source of truth

- Generate/refresh `src/types/database.types.ts` from the connected project before wiring each legacy module.
- Compare legacy data shapes to generated Supabase types first; do not force legacy assumptions onto schema.

## 2) Use adapters around legacy business logic

- Keep legacy business logic in adapter functions.
- Convert legacy inputs/outputs to typed service contracts in `src/services/supabase`.
- Keep route/components unaware of raw table queries.

## 3) Connect adapters to typed services

- Use module services (`patientService`, `claimsService`, `paymentPostingService`, etc.) as the only Supabase boundary.
- Respect tenant/practice/user scoping context in every service call.
- Enforce provider review before importing patient-submitted content into provider-authored clinical docs.
- Keep historical payment posting on `historicalPaymentPostingService` (separate from claim-based posting).

## 4) Replace scaffold placeholders safely

- Replace placeholder screen logic module-by-module only after data-shape compatibility checks pass.
- Keep placeholder implementations for modules whose schema mapping remains unresolved.

## 5) Verify after each integration step

- Run `npm run verify` (or available checks) after connecting each legacy module.
- Confirm no Replit-specific files, secrets, or outdated mocks are introduced.
- Preserve richer legacy business logic when it is validated and compatible with typed service boundaries.
