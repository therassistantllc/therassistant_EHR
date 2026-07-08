// Core domain types for THERASSISTANT Behavioral Health RCM/EHR

export type UserRole =
  | 'platform_admin'
  | 'billing_company_admin'
  | 'practice_admin'
  | 'clinician'
  | 'biller'
  | 'front_desk'
  | 'patient'

export type EligibilityStatus = 'verified' | 'pending' | 'issue' | 'expired' | 'unknown'
export type ClaimStatus = 'draft' | 'ready' | 'submitted' | 'accepted' | 'rejected' | 'denied' | 'paid' | 'partial' | 'appealed'
export type AuthStatus = 'active' | 'pending' | 'expired' | 'not_required' | 'needed'
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low'
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'deferred'
export type TaskType = 'billing' | 'eligibility' | 'claim_followup' | 'documentation' | 'patient_balance' | 'credentialing' | 'prior_auth' | 'general'

export interface Practice {
  id: string
  name: string
  npi: string
  taxId: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  billingCompanyId?: string
  billingCompanyName?: string
  activeProviders: number
  activePatients: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  practiceId?: string
  practiceName?: string
  npi?: string
  credentials?: string
  licenseNumber?: string
  licenseExpiry?: string
  caqhId?: string
  status: 'active' | 'inactive'
  lastLogin?: string
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  dob: string
  mrn: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  practiceId: string
  primaryTherapistId: string
  primaryTherapistName: string
  primaryInsurance?: Insurance
  secondaryInsurance?: Insurance
  eligibilityStatus: EligibilityStatus
  lastEligibilityCheck?: string
  outstandingBalance: number
  consentOnFile: boolean
  intakeComplete: boolean
  portalAccess: boolean
  status: 'active' | 'inactive' | 'discharged'
  lastVisit?: string
  nextAppointment?: string
}

export interface Insurance {
  id: string
  payerId: string
  payerName: string
  planName: string
  memberId: string
  groupNumber?: string
  policyHolder: string
  relationship: string
  effectiveDate: string
  terminationDate?: string
  copay?: number
  deductible?: number
  deductibleMet?: number
  coinsurance?: number
  outOfPocketMax?: number
  outOfPocketMet?: number
  priorAuthRequired: boolean
  networkStatus: 'in_network' | 'out_of_network' | 'unknown'
  phone?: string
}

export interface EligibilityRecord {
  id: string
  patientId: string
  patientName: string
  payerId: string
  payerName: string
  verifiedDate: string
  verifiedBy: string
  status: EligibilityStatus
  effectiveDate?: string
  terminationDate?: string
  copay?: number
  deductible?: number
  deductibleMet?: number
  coinsurance?: number
  priorAuthRequired: boolean
  networkStatus: string
  issues: string[]
  notes?: string
  nextVerificationDate?: string
  appointmentDate?: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  dateTime: string
  duration: number
  cptCode: string
  serviceType: string
  status: 'scheduled' | 'checked_in' | 'completed' | 'no_show' | 'cancelled'
  eligibilityStatus: EligibilityStatus
  authStatus: AuthStatus
  noteStatus: 'not_started' | 'in_progress' | 'complete' | 'signed'
  billingReadiness: 'ready' | 'not_ready' | 'pending_review'
  readinessIssues: string[]
  balance: number
}

export interface ClinicalNote {
  id: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  serviceDate: string
  cptCode: string
  sessionType: string
  status: 'in_progress' | 'complete' | 'signed' | 'co_signed'
  hasDiagnosis: boolean
  hasTreatmentPlanLink: boolean
  hasGoalProgress: boolean
  hasIntervention: boolean
  hasMedicalNecessity: boolean
  hasTime: boolean
  billingReadiness: 'ready' | 'not_ready' | 'missing_elements'
  missingElements: string[]
  signedAt?: string
  signedBy?: string
  lastModified: string
}

export interface JournalEntry {
  id: string
  patientId: string
  patientName: string
  submittedAt: string
  mood?: number
  moodLabel?: string
  concerns?: string
  symptoms?: string
  stressors?: string
  progress?: string
  barriers?: string
  copingSkills?: string
  medicationObservations?: string
  questionsForTherapist?: string
  topicsForSession?: string
  reviewedByProvider: boolean
  reviewedAt?: string
  reviewedBy?: string
  importedToNote: boolean
  importedNoteId?: string
}

export interface Charge {
  id: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  serviceDate: string
  cptCode: string
  cptDescription: string
  units: number
  diagnosisCodes: string[]
  chargeAmount: number
  payerId: string
  payerName: string
  authNumber?: string
  placeOfService: string
  status: 'ready' | 'not_ready' | 'submitted' | 'hold'
  readinessIssues: string[]
  noteId?: string
  claimId?: string
}

export interface Claim {
  id: string
  claimNumber: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  serviceDate: string
  submittedDate?: string
  payerId: string
  payerName: string
  cptCodes: string[]
  diagnosisCodes: string[]
  billedAmount: number
  allowedAmount?: number
  paidAmount?: number
  adjustmentAmount?: number
  patientResponsibility?: number
  status: ClaimStatus
  daysInAR: number
  timelyFilingDeadline?: string
  clearinghouseStatus?: string
  rejectionReason?: string
  denialReason?: string
  denialCarcCode?: string
  correctedClaimId?: string
  appealDeadline?: string
  notes?: string
  lastAction?: string
  lastActionDate?: string
}

export interface Payment {
  id: string
  type: 'insurance' | 'patient' | 'historical'
  patientId: string
  patientName: string
  payerId?: string
  payerName?: string
  providerId?: string
  providerName?: string
  serviceDate?: string
  paymentDate: string
  checkNumber?: string
  eraId?: string
  paymentAmount: number
  adjustmentAmount?: number
  contractualAdjustment?: number
  denialAmount?: number
  patientBalance?: number
  carcCode?: string
  rarcCode?: string
  claimId?: string
  notes?: string
  postedBy?: string
  postedAt: string
}

export interface DenialRecord {
  id: string
  claimId: string
  claimNumber: string
  patientId: string
  patientName: string
  payerId: string
  payerName: string
  providerId: string
  providerName: string
  serviceDate: string
  denialDate: string
  carcCode: string
  carcDescription: string
  rarcCode?: string
  category: 'eligibility' | 'authorization' | 'medical_necessity' | 'coding' | 'credentialing' | 'timely_filing' | 'duplicate' | 'coordination' | 'other'
  billedAmount: number
  deniedAmount: number
  status: 'open' | 'in_appeal' | 'corrected_claim_submitted' | 'reconsideration' | 'resolved_paid' | 'resolved_writeoff' | 'closed'
  actionTaken?: string
  appealDeadline?: string
  followUpDate?: string
  assignedTo?: string
  notes?: string
  daysOpen: number
}

export interface MailroomItem {
  id: string
  receivedDate: string
  type: 'eob' | 'denial_letter' | 'authorization' | 'correspondence' | 'appeal_response' | 'contract' | 'other'
  payerId?: string
  payerName?: string
  patientId?: string
  patientName?: string
  description: string
  status: 'unassigned' | 'assigned' | 'in_progress' | 'resolved'
  assignedTo?: string
  linkedClaimId?: string
  linkedTaskId?: string
  notes?: string
  dueDate?: string
}

export interface Task {
  id: string
  type: TaskType
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  assignedTo?: string
  assignedToName?: string
  practiceId: string
  patientId?: string
  patientName?: string
  claimId?: string
  dueDate?: string
  createdAt: string
  completedAt?: string
  notes?: string
}

export interface CredentialingRecord {
  id: string
  providerId: string
  providerName: string
  npi: string
  caqhId?: string
  caqhStatus: 'current' | 'attestation_due' | 'expired' | 'not_enrolled'
  caqhLastAttestation?: string
  licenseType: string
  licenseNumber: string
  licenseState: string
  licenseExpiry: string
  malpracticeExpiry?: string
  payer: string
  payerId: string
  enrollmentStatus: 'active' | 'pending' | 'submitted' | 'expired' | 'not_enrolled' | 'credentialing_issue'
  effectiveDate?: string
  revalidationDate?: string
  contractType?: string
  payerContact?: string
  notes?: string
  lastUpdated: string
}

export type AuthRequestStatus =
  | 'active'
  | 'pending_submission'
  | 'pending_response'
  | 'approved'
  | 'denied'
  | 'expired'
  | 'not_required'

export interface PriorAuthRequest {
  id: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  payerId: string
  payerName: string
  serviceType: string
  cptCodes: string[]
  diagnosisCodes: string[]
  requestedSessions: number
  approvedSessions?: number
  sessionsUsed: number
  authNumber?: string
  status: AuthRequestStatus
  requestDate: string
  approvedDate?: string
  startDate?: string
  endDate?: string
  denialReason?: string
  submittedBy?: string
  reviewedBy?: string
  notes?: string
  urgency: 'routine' | 'urgent' | 'expedited'
  linkedClaimIds: string[]
}

export type NotificationSeverity = 'urgent' | 'warning' | 'info' | 'success'
export type NotificationType =
  | 'eligibility_issue'
  | 'auth_expiring'
  | 'denial_deadline'
  | 'note_overdue'
  | 'claim_rejected'
  | 'payment_received'
  | 'task_due'
  | 'credentialing_action'

export interface AppNotification {
  id: string
  type: NotificationType
  severity: NotificationSeverity
  title: string
  body: string
  patientName?: string
  patientId?: string
  linkPath?: string
  createdAt: string
  readAt?: string
  isRead: boolean
}

export interface ARAgingBucket {
  bucket: '0-30' | '31-60' | '61-90' | '91-120' | '120+'
  totalAmount: number
  claimCount: number
  percentage: number
}

export interface ReportMetric {
  label: string
  value: string | number
  change?: number
  period?: string
  trend?: 'up' | 'down' | 'neutral'
}
