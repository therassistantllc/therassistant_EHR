import type { SupabaseSchema } from '../../types/database.types'

const GAP_ANALYSIS_PATH = '/docs/supabase-gap-analysis.md' as const
type KnownSupabaseTable = keyof SupabaseSchema['Tables']

export interface ServiceContext {
  tenantId: string
  practiceId: string
  actorUserId: string
}

export interface PendingSchemaResult<TModule extends string> {
  module: TModule
  status: 'schema_pending'
  gapAnalysisPath: typeof GAP_ANALYSIS_PATH
  knownTables: KnownSupabaseTable[]
  reason: string
}

function pending<TModule extends string>(module: TModule, reason: string): PendingSchemaResult<TModule> {
  return {
    module,
    status: 'schema_pending',
    gapAnalysisPath: GAP_ANALYSIS_PATH,
    knownTables: [],
    reason,
  }
}

function assertTenantScope(context: ServiceContext) {
  if (!context.tenantId || !context.practiceId || !context.actorUserId) {
    throw new Error('tenantId, practiceId, and actorUserId are required for Supabase service boundaries.')
  }
}

interface PatientImportReviewInput {
  providerReviewerUserId: string
  patientSubmissionId: string
  draftClinicalNoteId: string
}

interface AuditWriteInput {
  auditEventId: string
}

function assertProviderReview(input: PatientImportReviewInput) {
  if (!input.providerReviewerUserId) {
    throw new Error('Provider review is required before importing patient-submitted content into clinical notes.')
  }
}

function assertAuditEvent(input: AuditWriteInput) {
  if (!input.auditEventId) {
    throw new Error('auditEventId is required for billing, claim, payment, denial, and clinical-document workflow writes.')
  }
}

const BASE_REASON =
  'Connected Supabase schema is not inspectable from this repository context yet. Generate project types and replace this placeholder after schema review.'

export const tenantPracticeService = {
  async listPractices(context: ServiceContext) {
    assertTenantScope(context)
    return pending('tenant-practice', BASE_REASON)
  },
  async listBillingCompanyLinkedPractices(context: ServiceContext, billingCompanyId: string) {
    assertTenantScope(context)
    if (!billingCompanyId) {
      throw new Error('billingCompanyId is required to scope access to linked practices.')
    }
    return pending('tenant-practice', `${BASE_REASON} Enforce billing-company linked-practice constraints when implementing.`)
  },
}

export const userRolePermissionService = {
  async listRoleAssignments(context: ServiceContext) {
    assertTenantScope(context)
    return pending('user-role-permission', BASE_REASON)
  },
}

export const patientService = {
  async listPatients(context: ServiceContext) {
    assertTenantScope(context)
    return pending('patient', BASE_REASON)
  },
}

export const eligibilityService = {
  async listEligibilityChecks(context: ServiceContext) {
    assertTenantScope(context)
    return pending('eligibility', BASE_REASON)
  },
}

export const preSessionReadinessService = {
  async listPreSessionReadiness(context: ServiceContext) {
    assertTenantScope(context)
    return pending('pre-session-readiness', BASE_REASON)
  },
}

export const documentationReadinessService = {
  async listDocumentationReadiness(context: ServiceContext) {
    assertTenantScope(context)
    return pending('documentation-readiness', BASE_REASON)
  },
  async importPatientSubmissionIntoDraftNote(
    context: ServiceContext,
    input: PatientImportReviewInput & AuditWriteInput,
  ) {
    assertTenantScope(context)
    assertProviderReview(input)
    assertAuditEvent(input)
    return pending('documentation-readiness', `${BASE_REASON} Preserve review workflow audit trails when implementing.`)
  },
}

export const chargeCaptureService = {
  async listChargeCaptureQueue(context: ServiceContext) {
    assertTenantScope(context)
    return pending('charge-capture', BASE_REASON)
  },
  async createCharge(context: ServiceContext, input: AuditWriteInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    return pending('charge-capture', BASE_REASON)
  },
}

export const claimsService = {
  async listClaims(context: ServiceContext) {
    assertTenantScope(context)
    return pending('claims', BASE_REASON)
  },
  async submitClaim(context: ServiceContext, input: AuditWriteInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    return pending('claims', BASE_REASON)
  },
}

export const paymentPostingService = {
  async listClaimBasedPayments(context: ServiceContext) {
    assertTenantScope(context)
    return pending('payment-posting', BASE_REASON)
  },
  async postClaimPayment(context: ServiceContext, input: AuditWriteInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    return pending('payment-posting', BASE_REASON)
  },
}

export const historicalPaymentPostingService = {
  async listHistoricalPayments(context: ServiceContext) {
    assertTenantScope(context)
    return pending('historical-payment-posting', BASE_REASON)
  },
  async postHistoricalPayment(context: ServiceContext, input: AuditWriteInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    return pending('historical-payment-posting', BASE_REASON)
  },
}

export const denialArService = {
  async listDenials(context: ServiceContext) {
    assertTenantScope(context)
    return pending('denial-ar', BASE_REASON)
  },
  async recordDenialFollowUp(context: ServiceContext, input: AuditWriteInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    return pending('denial-ar', BASE_REASON)
  },
}

export const patientLedgerService = {
  async listPatientLedgerEntries(context: ServiceContext) {
    assertTenantScope(context)
    return pending('patient-ledger', BASE_REASON)
  },
}

export const mailroomService = {
  async listMailroomItems(context: ServiceContext) {
    assertTenantScope(context)
    return pending('mailroom', BASE_REASON)
  },
}

export const reportingService = {
  async listReportingSnapshots(context: ServiceContext) {
    assertTenantScope(context)
    return pending('reporting', BASE_REASON)
  },
}

export const taskWorkqueueService = {
  async listTaskQueue(context: ServiceContext) {
    assertTenantScope(context)
    return pending('task-workqueue', BASE_REASON)
  },
}

export const auditService = {
  async listAuditEvents(context: ServiceContext) {
    assertTenantScope(context)
    return pending('audit', BASE_REASON)
  },
}
