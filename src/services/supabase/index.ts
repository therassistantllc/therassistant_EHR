import { getSupabaseClient } from '../../lib/supabaseClient'

export interface ServiceContext {
  tenantId: string
  practiceId: string
  actorUserId: string
}

interface AuditWriteInput {
  auditEventId: string
}

interface PatientImportReviewInput {
  providerReviewerUserId: string
  patientSubmissionId: string
  draftClinicalNoteId: string
}

export interface ChargeCreateInput extends AuditWriteInput {
  appointmentId: string
  chargeAmountCents?: number
  cptCode?: string
  diagnosisCode?: string
  placeOfService?: string
}

export interface ClaimFromChargeInput extends AuditWriteInput {
  chargeId: string
}

export interface ClaimBatchInput extends AuditWriteInput {
  batchName?: string
  limit?: number
}

export interface ClaimPaymentInput extends AuditWriteInput {
  claimId: string
  amountCents: number
  paymentDate?: string
  paymentMethod?:
    | 'eft'
    | 'ach'
    | 'check'
    | 'credit_card'
    | 'debit_card'
    | 'cash'
    | 'money_order'
    | 'portal'
    | 'manual'
    | 'other'
  checkNumber?: string
  traceNumber?: string
  notes?: string
}

export interface HistoricalPaymentInput extends AuditWriteInput {
  clientId: string
  amountCents: number
  claimId?: string
  payerId?: string
  transactionDate?: string
  description?: string
  legacySource?: string
}

export interface DenialFollowUpInput extends AuditWriteInput {
  denialId: string
  title: string
  description?: string
  dueDate?: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  assignedUserId?: string
}

function assertTenantScope(context: ServiceContext) {
  if (!context.tenantId || !context.practiceId || !context.actorUserId) {
    throw new Error('tenantId, practiceId, and actorUserId are required for Supabase service boundaries.')
  }
}

function assertAuditEvent(input: AuditWriteInput) {
  if (!input.auditEventId) {
    throw new Error('auditEventId is required for billing, claim, payment, denial, and clinical-document workflow writes.')
  }
}

function requireValue(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is required.`)
  }
}

function throwQueryError(operation: string, error: { message: string } | null) {
  if (error) {
    throw new Error(`${operation} failed: ${error.message}`)
  }
}

export const authService = {
  async getCurrentUser() {
    const { data, error } = await getSupabaseClient().auth.getUser()
    throwQueryError('Load authenticated user', error)
    return data.user
  },

  async getAppContext() {
    const { data, error } = await getSupabaseClient().rpc('get_app_context')
    throwQueryError('Load application context', error)
    return data
  },

  async signInWithPassword(email: string, password: string) {
    requireValue(email, 'email')
    requireValue(password, 'password')
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
    throwQueryError('Sign in', error)
    return data
  },

  async signOut() {
    const { error } = await getSupabaseClient().auth.signOut()
    throwQueryError('Sign out', error)
  },
}

export const tenantPracticeService = {
  async listPractices(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('tenants')
      .select('*')
      .eq('tenant_type', 'practice')
      .order('name')
    throwQueryError('List practices', error)
    return data
  },

  async listBillingCompanyLinkedPractices(context: ServiceContext, billingCompanyId: string) {
    assertTenantScope(context)
    requireValue(billingCompanyId, 'billingCompanyId')
    const { data, error } = await getSupabaseClient()
      .from('billing_company_practice_links')
      .select('*')
      .eq('billing_company_tenant_id', billingCompanyId)
      .eq('status', 'active')
      .order('created_at')
    throwQueryError('List billing-company linked practices', error)
    return data
  },
}

export const userRolePermissionService = {
  async listRoleAssignments(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('tenant_user_roles')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('created_at')
    throwQueryError('List role assignments', error)
    return data
  },
}

export const patientService = {
  async listPatients(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_client_profile_summary')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('client_name')
    throwQueryError('List patients', error)
    return data
  },
}

export const eligibilityService = {
  async listEligibilityChecks(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('eligibility_checks')
      .select('*, eligibility_benefits(*)')
      .eq('tenant_id', context.tenantId)
      .order('service_date', { ascending: false })
    throwQueryError('List eligibility checks', error)
    return data
  },
}

export const preSessionReadinessService = {
  async listPreSessionReadiness(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_upcoming_appointments')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('starts_at')
    throwQueryError('List pre-session readiness', error)
    return data
  },
}

export const documentationReadinessService = {
  async listDocumentationReadiness(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_unsigned_clinical_notes')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('service_date', { ascending: false })
    throwQueryError('List documentation readiness', error)
    return data
  },

  async importPatientSubmissionIntoDraftNote(
    context: ServiceContext,
    input: PatientImportReviewInput & AuditWriteInput,
  ) {
    assertTenantScope(context)
    assertAuditEvent(input)
    requireValue(input.providerReviewerUserId, 'providerReviewerUserId')
    requireValue(input.patientSubmissionId, 'patientSubmissionId')
    requireValue(input.draftClinicalNoteId, 'draftClinicalNoteId')
    throw new Error(
      'Patient-submission import is not available because the connected schema does not contain a patient-submission source table. Add that schema before enabling this write path.',
    )
  },
}

export const chargeCaptureService = {
  async listChargeCaptureQueue(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_charge_capture_workqueue')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('service_date', { ascending: false })
    throwQueryError('List charge capture queue', error)
    return data
  },

  async createCharge(context: ServiceContext, input: ChargeCreateInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    requireValue(input.appointmentId, 'appointmentId')
    const { data, error } = await getSupabaseClient().rpc('create_charge_from_appointment', {
      p_appointment_id: input.appointmentId,
      p_charge_amount_cents: input.chargeAmountCents,
      p_cpt_code: input.cptCode,
      p_diagnosis_code: input.diagnosisCode,
      p_place_of_service: input.placeOfService,
    })
    throwQueryError('Create charge', error)
    return data
  },
}

export const claimsService = {
  async listClaims(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_claim_ar')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('updated_at', { ascending: false })
    throwQueryError('List claims', error)
    return data
  },

  async createClaimFromCharge(context: ServiceContext, input: ClaimFromChargeInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    requireValue(input.chargeId, 'chargeId')
    const { data, error } = await getSupabaseClient().rpc('create_claim_from_charge', {
      p_charge_id: input.chargeId,
    })
    throwQueryError('Create claim from charge', error)
    return data
  },

  async validateClaim(context: ServiceContext, claimId: string) {
    assertTenantScope(context)
    requireValue(claimId, 'claimId')
    const { data, error } = await getSupabaseClient().rpc('validate_claim', { p_claim_id: claimId })
    throwQueryError('Validate claim', error)
    return data
  },

  async createReadyClaimBatch(context: ServiceContext, input: ClaimBatchInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    const { data, error } = await getSupabaseClient().rpc('create_claim_batch', {
      p_tenant_id: context.tenantId,
      p_batch_name: input.batchName,
      p_limit: input.limit,
    })
    throwQueryError('Create claim batch', error)
    return data
  },

  async submitClaim(context: ServiceContext, input: AuditWriteInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    throw new Error(
      'Claim transmission is not configured. The backend can create, validate, and batch claims, but a clearinghouse submission endpoint must be configured before this method can transmit a claim.',
    )
  },
}

export const paymentPostingService = {
  async listClaimBasedPayments(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_payment_reconciliation')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('payment_date', { ascending: false })
    throwQueryError('List claim-based payments', error)
    return data
  },

  async postClaimPayment(context: ServiceContext, input: ClaimPaymentInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    requireValue(input.claimId, 'claimId')
    if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
      throw new Error('amountCents must be a positive integer.')
    }
    const { data, error } = await getSupabaseClient().rpc('post_insurance_payment', {
      p_claim_id: input.claimId,
      p_amount_cents: input.amountCents,
      p_payment_date: input.paymentDate,
      p_payment_method: input.paymentMethod,
      p_check_number: input.checkNumber,
      p_trace_number: input.traceNumber,
      p_notes: input.notes,
    })
    throwQueryError('Post claim payment', error)
    return data
  },
}

export const historicalPaymentPostingService = {
  async listHistoricalPayments(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('historical_transactions')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .eq('transaction_type', 'payment')
      .order('transaction_date', { ascending: false })
    throwQueryError('List historical payments', error)
    return data
  },

  async postHistoricalPayment(context: ServiceContext, input: HistoricalPaymentInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    requireValue(input.clientId, 'clientId')
    if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
      throw new Error('amountCents must be a positive integer.')
    }
    const { data, error } = await getSupabaseClient().rpc('post_historical_transaction', {
      p_tenant_id: context.tenantId,
      p_client_id: input.clientId,
      p_amount_cents: input.amountCents,
      p_transaction_type: 'payment',
      p_claim_id: input.claimId,
      p_payer_id: input.payerId,
      p_transaction_date: input.transactionDate,
      p_description: input.description,
      p_legacy_source: input.legacySource,
    })
    throwQueryError('Post historical payment', error)
    return data
  },
}

export const denialArService = {
  async listDenials(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_denial_inventory')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('denial_date', { ascending: false })
    throwQueryError('List denials', error)
    return data
  },

  async recordDenialFollowUp(context: ServiceContext, input: DenialFollowUpInput) {
    assertTenantScope(context)
    assertAuditEvent(input)
    requireValue(input.denialId, 'denialId')
    requireValue(input.title, 'title')
    const { data, error } = await getSupabaseClient().rpc('create_workqueue_item', {
      p_tenant_id: context.tenantId,
      p_workqueue_type: 'denial_followup',
      p_source_object_type: 'denial',
      p_source_object_id: input.denialId,
      p_title: input.title,
      p_description: input.description,
      p_due_date: input.dueDate,
      p_priority: input.priority,
      p_assigned_user_id: input.assignedUserId,
    })
    throwQueryError('Create denial follow-up', error)
    return data
  },
}

export const patientLedgerService = {
  async listPatientLedgerEntries(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('ledger_entries')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('posting_date', { ascending: false })
    throwQueryError('List patient ledger entries', error)
    return data
  },
}

export const mailroomService = {
  async listMailroomItems(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('documents')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .eq('document_status', 'pending_review')
      .order('created_at', { ascending: false })
    throwQueryError('List mailroom items', error)
    return data
  },
}

export const reportingService = {
  async listReportingSnapshots(context: ServiceContext) {
    assertTenantScope(context)
    const [kpiResult, arResult] = await Promise.all([
      getSupabaseClient().from('v_tenant_operating_kpis').select('*').eq('tenant_id', context.tenantId).maybeSingle(),
      getSupabaseClient().from('v_open_ar_summary').select('*').eq('tenant_id', context.tenantId).maybeSingle(),
    ])
    throwQueryError('Load tenant KPI snapshot', kpiResult.error)
    throwQueryError('Load open AR snapshot', arResult.error)
    return { kpis: kpiResult.data, openAr: arResult.data }
  },
}

export const taskWorkqueueService = {
  async listTaskQueue(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('v_open_workqueue')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('due_date', { ascending: true, nullsFirst: false })
    throwQueryError('List task workqueue', error)
    return data
  },
}

export const auditService = {
  async listAuditEvents(context: ServiceContext) {
    assertTenantScope(context)
    const { data, error } = await getSupabaseClient()
      .from('audit_logs')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('created_at', { ascending: false })
      .limit(250)
    throwQueryError('List audit events', error)
    return data
  },
}
