# Post-import verification checklist

- [ ] App installs (`npm install`)
- [ ] App runs locally (`npm run dev`)
- [ ] TypeScript passes (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] App builds (`npm run build`)
- [ ] Routes load without runtime errors
- [ ] TypeScript path aliases (if introduced) resolve correctly
- [ ] Supabase imports/typed client resolve correctly
- [ ] Tenant IDs/practice IDs are handled safely in service boundaries
- [ ] Permissions checks are enforced by service boundaries and documented
- [ ] RLS assumptions are documented and reviewed against actual policies
- [ ] Audit trail behavior is preserved for billing/claim/payment/denial/clinical-doc workflows
- [ ] Patient-submitted content remains separate from provider-authored clinical documentation
- [ ] Historical payment posting remains separate from claim-based payment posting
- [ ] Replit-specific values/files are excluded
- [ ] No secrets are committed
- [ ] Duplicate or overlapping imported modules are resolved
