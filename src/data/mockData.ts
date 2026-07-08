import type { PracticeSummary, RoleOption, WorkflowModule } from '../types/domain'

export const roles: RoleOption[] = [
  {
    value: 'platform_admin',
    label: 'Platform Admin',
    focus: 'Monitor tenant health, security controls, and shared services across all practices.',
  },
  {
    value: 'billing_company_admin',
    label: 'Billing Company Admin',
    focus: 'Coordinate linked-practice billing queues, denials, payments, and follow-up staffing.',
  },
  {
    value: 'practice_admin',
    label: 'Practice Admin',
    focus: 'Balance clinical readiness, patient access, staffing, and financial performance for one practice.',
  },
  {
    value: 'clinician',
    label: 'Clinician',
    focus: 'Review pre-session readiness and keep documentation aligned with service delivery.',
  },
  {
    value: 'biller',
    label: 'Biller',
    focus: 'Clear edits, post payments, work denials, and move clean claims through the revenue cycle.',
  },
  {
    value: 'front_desk',
    label: 'Front Desk / Intake',
    focus: 'Resolve intake, portal, balance, and insurance issues before the patient arrives.',
  },
  {
    value: 'patient',
    label: 'Patient / Client',
    focus: 'Complete check-in, review balances, and share updates without altering provider-authored records.',
  },
]

export const practiceOptions: PracticeSummary[] = [
  { id: 'platform', name: 'THERASSISTANT Platform View', type: 'platform', linkedPracticeCount: 3 },
  { id: 'bill_acme', name: 'Acme Behavioral Billing', type: 'billing_company', linkedPracticeCount: 3 },
  { id: 'prac_harbor', name: 'Harbor Wellness Group', type: 'practice', linkedPracticeCount: 1 },
  { id: 'prac_northsound', name: 'North Sound Counseling', type: 'practice', linkedPracticeCount: 1 },
]

export const dashboardMetrics = [
  { label: 'Eligibility issues', value: '14', trend: '6 before next business day', tone: 'warning' },
  { label: 'Documentation readiness', value: '9', trend: '3 notes missing medical necessity support', tone: 'warning' },
  { label: 'Claims ready', value: '32', trend: '24 pass clean-claim rules today', tone: 'positive' },
  { label: 'Active denials', value: '11', trend: '2 credentialing-related', tone: 'danger' },
  { label: 'A/R over 60 days', value: '$48.2k', trend: '8 follow-up tasks due', tone: 'warning' },
  { label: 'Patient balances', value: '$12.7k', trend: '18 payment plans active' },
  { label: 'Open tasks', value: '27', trend: '7 high priority queues', tone: 'warning' },
] as const

export const preSessionRows = [
  {
    Patient: 'Maya R.',
    Appointment: 'Today 9:00 AM',
    Coverage: 'Active / OON check needed',
    Authorization: '2 visits remaining',
    Balance: '$85 due',
    Documentation: 'Last note signed',
    Billing: 'Ready',
  },
  {
    Patient: 'Devon S.',
    Appointment: 'Today 10:30 AM',
    Coverage: 'Termed flag',
    Authorization: 'Missing',
    Balance: '$0',
    Documentation: 'Treatment plan overdue',
    Billing: 'Hold visit',
  },
  {
    Patient: 'Avery L.',
    Appointment: 'Today 2:00 PM',
    Coverage: 'Verified',
    Authorization: 'Not required',
    Balance: '$25 copay',
    Documentation: 'Import draft pending review',
    Billing: 'Ready after note review',
  },
]

export const linkedPracticeRows = [
  {
    Practice: 'Harbor Wellness Group',
    Clinicians: '18',
    Claims: '118 ready',
    Denials: '5 open',
    Eligibility: '4 issues',
    Portal: '92% active',
  },
  {
    Practice: 'North Sound Counseling',
    Clinicians: '9',
    Claims: '57 ready',
    Denials: '3 open',
    Eligibility: '6 issues',
    Portal: '84% active',
  },
  {
    Practice: 'Lighthouse Therapy Partners',
    Clinicians: '12',
    Claims: '74 ready',
    Denials: '3 open',
    Eligibility: '4 issues',
    Portal: '89% active',
  },
]

export const workflowModules: WorkflowModule[] = [
  {
    path: '/tenants',
    navLabel: 'Tenant & Practice',
    title: 'Tenant / Practice Management',
    description:
      'Manage multi-tenant practice separation, billing-company relationships, user roles, and permission boundaries.',
    group: 'Admin',
    audience: 'Platform Admin, Billing Company Admin, Practice Admin',
    metrics: [
      { label: 'Practices', value: '3', trend: '2 linked to Acme Behavioral Billing' },
      { label: 'Billing companies', value: '1', trend: 'Shared follow-up across 3 practices' },
      { label: 'Active users', value: '46', trend: '7 roles with scoped permissions' },
    ],
    focusCards: [
      {
        title: 'Practice-level tenant keys',
        description: 'Every operational record is prepared to carry practice_id and audit metadata for row-level security.',
        tag: 'RLS-ready',
      },
      {
        title: 'Linked-practice access',
        description: 'Billing company users can be granted shared queue access without exposing unrelated clinical records.',
        tag: 'Cross-practice',
      },
      {
        title: 'Permission starter model',
        description: 'Permissions distinguish dashboard, patient, eligibility, claims, payments, and admin capabilities.',
        tag: 'RBAC',
      },
    ],
    table: {
      columns: ['Entity', 'Purpose', 'Tenant scope', 'Audit note'],
      rows: [
        {
          Entity: 'practices',
          Purpose: 'Core tenant record and branding context',
          'Tenant scope': 'platform + practice',
          'Audit note': 'Track onboarding state and linked billing company updates',
        },
        {
          Entity: 'billing_company_links',
          Purpose: 'Assign cross-practice billing access',
          'Tenant scope': 'platform + billing company',
          'Audit note': 'Log who granted or revoked linkage',
        },
        {
          Entity: 'user_role_assignments',
          Purpose: 'Map users to practice, role, and permission packs',
          'Tenant scope': 'practice',
          'Audit note': 'Retain history for HIPAA and revenue-cycle audits',
        },
      ],
    },
    guardrails: [
      'Separate platform, billing-company, and practice scopes before rendering privileged actions.',
      'Never infer billing-company visibility from clinician roles alone.',
      'Log role and linkage changes with actor, timestamp, and affected practice.',
    ],
  },
  {
    path: '/patients',
    navLabel: 'Patient Management',
    title: 'Patient Management',
    description:
      'Track demographics, insurance, responsible party details, portal activation, balances, and intake readiness.',
    group: 'Patient',
    audience: 'Practice Admin, Front Desk / Intake, Clinician, Biller',
    metrics: [
      { label: 'Active patients', value: '624', trend: '38 pending intake tasks' },
      { label: 'Portal invited', value: '91%', trend: '14 require follow-up' },
      { label: 'Outstanding balances', value: '$12.7k', trend: 'Patient balance tasking enabled', tone: 'warning' },
    ],
    focusCards: [
      {
        title: 'Demographics + responsible party',
        description: 'Prepare separate capture of subscriber, guarantor, emergency, and consent details.',
      },
      {
        title: 'Eligibility-aware snapshots',
        description: 'Patient rows can surface active coverage issues without mixing financial and clinical content.',
      },
      {
        title: 'Portal status visibility',
        description: 'Show activation, questionnaire completion, journal engagement, and balance visibility at a glance.',
      },
    ],
    table: {
      columns: ['Patient', 'Coverage', 'Responsible party', 'Portal', 'Balance'],
      rows: [
        {
          Patient: 'Maya R.',
          Coverage: 'BlueWave PPO / active',
          'Responsible party': 'Self',
          Portal: 'Active',
          Balance: '$85',
        },
        {
          Patient: 'Devon S.',
          Coverage: 'Cascade HMO / termed flag',
          'Responsible party': 'Parent guarantor',
          Portal: 'Invite sent',
          Balance: '$0',
        },
        {
          Patient: 'Avery L.',
          Coverage: 'Employer EPO / verified',
          'Responsible party': 'Self',
          Portal: 'Active',
          Balance: '$25',
        },
      ],
    },
    guardrails: [
      'Store patient demographics separately from documentation and claim payload history.',
      'Mark patient-supplied insurance changes as pending review before affecting billing workflows.',
      'Avoid exposing balances or guarantor data to users without patient-financial permissions.',
    ],
  },
  {
    path: '/eligibility',
    navLabel: 'Eligibility & Benefits',
    title: 'Eligibility & Benefits',
    description:
      'Surface pre-session verification, benefit details, authorization requirements, and issue flags before appointments.',
    group: 'Billing',
    audience: 'Front Desk / Intake, Biller, Practice Admin',
    metrics: [
      { label: 'Verifications due today', value: '18', trend: '6 flagged for manual follow-up', tone: 'warning' },
      { label: 'Authorization risks', value: '4', trend: '2 visits exceed approved units', tone: 'danger' },
      { label: 'Network issues', value: '3', trend: 'Out-of-network escalation required', tone: 'warning' },
    ],
    focusCards: [
      {
        title: 'Benefit detail capture',
        description: 'Track copay, deductible, coinsurance, effective dates, termination dates, and network status.',
      },
      {
        title: 'Verification history',
        description: 'Prepare a repeatable verification ledger for payer calls, portals, and clearinghouse responses.',
      },
      {
        title: 'Issue-first workflow',
        description: 'Queue appointments with coverage, authorization, or referral gaps before the session starts.',
        tag: 'Workqueue',
      },
    ],
    table: {
      columns: ['Patient', 'Appointment', 'Coverage status', 'Auth', 'Issue flag'],
      rows: [
        {
          Patient: 'Devon S.',
          Appointment: 'Today 10:30 AM',
          'Coverage status': 'Termed 07/01',
          Auth: 'Missing',
          'Issue flag': 'Call payer + notify front desk',
        },
        {
          Patient: 'Maya R.',
          Appointment: 'Today 9:00 AM',
          'Coverage status': 'Active / OON review',
          Auth: '2 visits left',
          'Issue flag': 'Estimate patient responsibility',
        },
        {
          Patient: 'Jordan K.',
          Appointment: 'Tomorrow 1:00 PM',
          'Coverage status': 'Verified',
          Auth: 'Referral on file',
          'Issue flag': 'None',
        },
      ],
    },
    guardrails: [
      'Do not overwrite historical verification snapshots when coverage changes.',
      'Keep payer responses traceable to the verification source and date.',
      'Require manual confirmation before auto-resolving authorization warnings.',
    ],
  },
  {
    path: '/pre-session',
    navLabel: 'Pre-Session Dashboard',
    title: 'Pre-Session Dashboard',
    description:
      'Give clinicians and support staff a visit-readiness view across patient, insurance, authorization, balance, documentation, and billing indicators.',
    group: 'Clinical',
    audience: 'Clinician, Front Desk / Intake, Practice Admin',
    metrics: [
      { label: 'Sessions today', value: '21', trend: '3 need intervention before check-in' },
      { label: 'Documentation blockers', value: '5', trend: 'Treatment plan or diagnosis updates needed', tone: 'warning' },
      { label: 'Balance alerts', value: '8', trend: 'Collection reminders staged for check-in' },
    ],
    focusCards: [
      {
        title: 'Clinician-ready summary',
        description: 'Present only the minimum operational detail needed to protect the visit and documentation flow.',
      },
      {
        title: 'Billing-readiness indicator',
        description: 'Expose note, code, diagnosis, authorization, and payer setup blockers before charge capture begins.',
        tag: 'Readiness',
      },
      {
        title: 'Patient coordination',
        description: 'Show questionnaire, portal check-in, and balance reminder status without altering the clinical note.',
      },
    ],
    table: {
      columns: ['Patient', 'Visit', 'Insurance', 'Documentation', 'Balance', 'Next step'],
      rows: preSessionRows,
    },
    guardrails: [
      'Keep readiness indicators separate from final note authoring.',
      'Display patient-submitted items as reviewable inputs, not as completed documentation.',
      'Allow the clinician to see operational blockers without exposing unrelated payment-posting details.',
    ],
  },
  {
    path: '/portal',
    navLabel: 'Patient Portal',
    title: 'Patient Portal',
    description:
      'Support check-in, questionnaires, insurance updates, balances, and clearly labeled patient-submitted content.',
    group: 'Patient',
    audience: 'Patient / Client, Front Desk / Intake, Practice Admin',
    metrics: [
      { label: 'Active portal users', value: '568', trend: '92% of active caseload' },
      { label: 'Check-ins pending', value: '16', trend: '7 for today’s schedule', tone: 'warning' },
      { label: 'Insurance updates awaiting review', value: '5', trend: 'Patient-submitted changes held for staff review' },
    ],
    focusCards: [
      {
        title: 'Patient-submitted badge',
        description: 'Portal content is visually separated from provider-authored documentation and requires review.',
        tag: 'Patient-submitted',
      },
      {
        title: 'Balance transparency',
        description: 'Patients can review balances and payment status without accessing payer-side posting detail.',
      },
      {
        title: 'Insurance and check-in updates',
        description: 'Collect new coverage and questionnaire answers as pending operational tasks.',
      },
    ],
    table: {
      columns: ['Workflow', 'Submitted by', 'Status', 'Review owner', 'Import rule'],
      rows: [
        {
          Workflow: 'Pre-session questionnaire',
          'Submitted by': 'Patient',
          Status: 'Complete',
          'Review owner': 'Clinician',
          'Import rule': 'Reference only until reviewed',
        },
        {
          Workflow: 'Insurance card update',
          'Submitted by': 'Patient',
          Status: 'Pending review',
          'Review owner': 'Front desk',
          'Import rule': 'No payer update until approved',
        },
        {
          Workflow: 'Balance payment',
          'Submitted by': 'Patient',
          Status: 'Available',
          'Review owner': 'Billing',
          'Import rule': 'Post to patient ledger after reconciliation',
        },
      ],
    },
    guardrails: [
      'Never blend patient-submitted journal text directly into a final provider note.',
      'Mark all portal updates with source, submitter, and review status.',
      'Require staff approval before patient-entered insurance data affects claims.',
    ],
  },
  {
    path: '/journal',
    navLabel: 'In-Between Session Journal',
    title: 'In-Between Session Journal',
    description:
      'Let patients record symptoms, stressors, progress, and questions while preserving provider review and selective import controls.',
    group: 'Clinical',
    audience: 'Patient / Client, Clinician',
    metrics: [
      { label: 'New journal entries', value: '12', trend: '5 highlighted for next session' },
      { label: 'Entries reviewed', value: '68%', trend: 'Selective import workflow enabled' },
      { label: 'Imports awaiting provider note action', value: '4', trend: 'Still draft-only', tone: 'warning' },
    ],
    focusCards: [
      {
        title: 'Structured patient reflection',
        description: 'Capture concerns, symptoms, mood changes, barriers, coping skills, and medication observations.',
      },
      {
        title: 'Selective import',
        description: 'Providers can pull only relevant snippets into a draft note section after review.',
        tag: 'Review required',
      },
      {
        title: 'Draft protection',
        description: 'Imported patient content never auto-finalizes clinical documentation.',
      },
    ],
    table: {
      columns: ['Entry', 'Source', 'Reviewed by', 'Import status', 'Clinical note status'],
      rows: [
        {
          Entry: 'Sleep decline + stressor update',
          Source: 'Patient-submitted',
          'Reviewed by': 'Dr. Rivera',
          'Import status': 'Snippet selected',
          'Clinical note status': 'Draft only',
        },
        {
          Entry: 'Medication side-effect question',
          Source: 'Patient-submitted',
          'Reviewed by': 'Pending',
          'Import status': 'Not imported',
          'Clinical note status': 'No provider note linkage',
        },
        {
          Entry: 'Progress on coping skills',
          Source: 'Patient-submitted',
          'Reviewed by': 'Dr. Rivera',
          'Import status': 'Reviewed only',
          'Clinical note status': 'No import yet',
        },
      ],
    },
    guardrails: [
      'Preserve original patient language in its own record for audit review.',
      'Track which provider imported which snippet and when.',
      'Require providers to author the final clinical interpretation separately.',
    ],
  },
  {
    path: '/documentation',
    navLabel: 'Documentation Readiness',
    title: 'Clinical Documentation Readiness',
    description:
      'Check whether documentation supports the billed service while preserving provider review and golden-thread logic.',
    group: 'Clinical',
    audience: 'Clinician, Practice Admin, Biller',
    metrics: [
      { label: 'Notes at risk', value: '9', trend: '3 missing medical necessity support', tone: 'warning' },
      { label: 'Unsigned notes', value: '4', trend: 'Impacting charge release today', tone: 'warning' },
      { label: 'Golden-thread gaps', value: '6', trend: 'Goals or interventions not aligned', tone: 'danger' },
    ],
    focusCards: [
      {
        title: 'Readiness checks',
        description: 'Flag missing goals, time, interventions, assessment details, diagnosis, and medical necessity support.',
      },
      {
        title: 'Golden-thread support',
        description: 'Prepare diagnosis, treatment plan, session content, and billed service alignment checks.',
      },
      {
        title: 'No auto-generated final notes',
        description: 'Documentation assistance stays in draft and review states until the provider signs.',
        tag: 'HIPAA-conscious',
      },
    ],
    table: {
      columns: ['Encounter', 'Readiness issue', 'Billing impact', 'Owner', 'Status'],
      rows: [
        {
          Encounter: '07/08 Maya R. 90837',
          'Readiness issue': 'Need intervention detail',
          'Billing impact': 'Charge held',
          Owner: 'Clinician',
          Status: 'Draft in progress',
        },
        {
          Encounter: '07/07 Devon S. 90834',
          'Readiness issue': 'Treatment plan expired',
          'Billing impact': 'Medical necessity risk',
          Owner: 'Practice admin',
          Status: 'Plan update due',
        },
        {
          Encounter: '07/06 Avery L. 90791',
          'Readiness issue': 'Diagnosis not finalized',
          'Billing impact': 'Cannot release charge',
          Owner: 'Clinician',
          Status: 'Awaiting review',
        },
      ],
    },
    guardrails: [
      'Expose documentation risk without auto-completing clinical reasoning.',
      'Keep provider-authored note text separate from imported patient content.',
      'Audit note status changes, signature events, and post-sign edits.',
    ],
  },
  {
    path: '/charges',
    navLabel: 'Charge Capture',
    title: 'Charge Capture',
    description:
      'Queue visits for billing readiness and flag note, code, diagnosis, authorization, and payer setup issues.',
    group: 'Billing',
    audience: 'Clinician, Biller, Practice Admin',
    metrics: [
      { label: 'Charges ready', value: '32', trend: '24 ready to bill now', tone: 'positive' },
      { label: 'Charges on hold', value: '7', trend: '4 missing diagnosis or note', tone: 'warning' },
      { label: 'Auth/payer setup blockers', value: '3', trend: 'Require billing review', tone: 'danger' },
    ],
    focusCards: [
      {
        title: 'Visit readiness queue',
        description: 'Organize service date, provider, patient, payer, code, units, diagnosis, and charge amount.',
      },
      {
        title: 'Billing blocker flags',
        description: 'Surface missing note, missing code, missing diagnosis, eligibility issue, and payer setup problems.',
      },
      {
        title: 'Clinician-to-biller handoff',
        description: 'Keep charge state transitions auditable from session completion through claim generation.',
      },
    ],
    table: {
      columns: ['Service date', 'Patient', 'Code', 'Diagnosis', 'Charge status', 'Blocker'],
      rows: [
        {
          'Service date': '07/08',
          Patient: 'Maya R.',
          Code: '90837',
          Diagnosis: 'F41.1',
          'Charge status': 'Ready',
          Blocker: 'None',
        },
        {
          'Service date': '07/08',
          Patient: 'Devon S.',
          Code: '90834',
          Diagnosis: 'Pending',
          'Charge status': 'Hold',
          Blocker: 'Missing diagnosis + auth',
        },
        {
          'Service date': '07/07',
          Patient: 'Avery L.',
          Code: '90791',
          Diagnosis: 'Draft',
          'Charge status': 'Review',
          Blocker: 'Unsigned note',
        },
      ],
    },
    guardrails: [
      'Do not release charges until documentation and authorization checks pass.',
      'Preserve every state transition from clinician completion to biller release.',
      'Allow payer-specific edit rules without mutating the underlying encounter record.',
    ],
  },
  {
    path: '/claims',
    navLabel: 'Claims / 837P',
    title: 'Claims / 837P Foundation',
    description:
      'Establish a claims workqueue with status tracking, rejections, denials, corrected claims, appeals, and timely filing awareness.',
    group: 'Billing',
    audience: 'Biller, Billing Company Admin, Practice Admin',
    metrics: [
      { label: 'Claims queued', value: '41', trend: '32 clean, 9 need edits' },
      { label: 'Rejections', value: '5', trend: '2 missing payer setup', tone: 'warning' },
      { label: 'Timely filing risks', value: '3', trend: 'Review this week', tone: 'danger' },
    ],
    focusCards: [
      {
        title: '837P-ready payload foundation',
        description: 'Prepare claim headers, service lines, diagnosis pointers, payer routing, and rendering/billing provider context.',
      },
      {
        title: 'Follow-up paths',
        description: 'Support corrected claim, reconsideration, and appeal states with payer-specific notes.',
      },
      {
        title: 'Timely filing tracking',
        description: 'Flag claims approaching payer deadlines before denial or write-off decisions are needed.',
      },
    ],
    table: {
      columns: ['Claim', 'Payer', 'Status', 'Deadline', 'Next action'],
      rows: [
        {
          Claim: 'CLM-10021',
          Payer: 'BlueWave PPO',
          Status: 'Ready to submit',
          Deadline: '09/06',
          'Next action': 'Batch with clean claims',
        },
        {
          Claim: 'CLM-10008',
          Payer: 'Cascade HMO',
          Status: 'Rejected',
          Deadline: '08/14',
          'Next action': 'Fix payer ID + resubmit',
        },
        {
          Claim: 'CLM-9988',
          Payer: 'Evergreen Medicaid',
          Status: 'Appeal draft',
          Deadline: '07/19',
          'Next action': 'Attach medical necessity packet',
        },
      ],
    },
    guardrails: [
      'Retain original and corrected claim versions separately.',
      'Track payer-specific notes without exposing unnecessary PHI in summary queues.',
      'Keep timely filing calculations anchored to claim and payer history snapshots.',
    ],
  },
  {
    path: '/payments',
    navLabel: 'Payment Posting',
    title: 'Payment Posting',
    description:
      'Support insurance and patient payment posting, ERA/EOB structure, adjustments, denials, secondary logic, and historical posting.',
    group: 'Billing',
    audience: 'Biller, Billing Company Admin',
    metrics: [
      { label: 'ERA/EOB batches', value: '6', trend: '2 include zero-pay denial lines' },
      { label: 'Historical payments to post', value: '11', trend: 'Onboarding backlog', tone: 'warning' },
      { label: 'Secondary balance transfers', value: '4', trend: 'Awaiting next claim generation' },
    ],
    focusCards: [
      {
        title: 'Posting detail',
        description: 'Capture payer, patient, provider, date of service, payment date, amount, adjustments, and CARC/RARC details.',
      },
      {
        title: 'Historical posting support',
        description: 'Allow payment records even when the original claim is not present in the system.',
        tag: 'Onboarding',
      },
      {
        title: 'Patient ledger transfer',
        description: 'Support insurance-to-patient balance movement after contractual and secondary logic runs.',
      },
    ],
    table: {
      columns: ['Posting type', 'Reference', 'Amount', 'Adjustment', 'Outcome'],
      rows: [
        {
          'Posting type': 'Insurance ERA',
          Reference: 'ERA-7721 / CLM-10021',
          Amount: '$128.00',
          Adjustment: 'CO-45 $32.00',
          Outcome: 'Patient balance $20.00',
        },
        {
          'Posting type': 'Historical payment',
          Reference: 'Legacy payer batch 2025-11',
          Amount: '$240.00',
          Adjustment: 'Write-off $0.00',
          Outcome: 'Posted to patient ledger only',
        },
        {
          'Posting type': 'Zero-pay denial',
          Reference: 'EOB-1193 / CLM-9988',
          Amount: '$0.00',
          Adjustment: 'PR-204 / N386',
          Outcome: 'Denial workqueue created',
        },
      ],
    },
    guardrails: [
      'Permit historical postings without fabricating matching claims.',
      'Separate payment, adjustment, and transfer events for auditability.',
      'Carry CARC/RARC codes into denial and AR workflows automatically.',
    ],
  },
  {
    path: '/denials-ar',
    navLabel: 'Denials & A/R',
    title: 'Denial Management & A/R',
    description:
      'Track denial workqueues, aging, follow-up actions, credentialing denials, and write-off recommendations.',
    group: 'Billing',
    audience: 'Biller, Billing Company Admin, Practice Admin',
    metrics: [
      { label: 'Open denials', value: '11', trend: '2 credentialing-related', tone: 'danger' },
      { label: 'A/R over 90 days', value: '$17.4k', trend: '6 urgent payer follow-ups', tone: 'warning' },
      { label: 'Write-off recommendations', value: '3', trend: 'Need admin review' },
    ],
    focusCards: [
      {
        title: 'CARC-based categorization',
        description: 'Organize denials by remittance code families and separate credentialing / contracting issues.',
      },
      {
        title: 'Action tracking',
        description: 'Assign follow-up dates, next actions, corrected claim status, and appeal progress.',
      },
      {
        title: 'A/R aging visibility',
        description: 'Monitor aging by payer, practice, provider, and denial category.',
      },
    ],
    table: {
      columns: ['Denial', 'Category', 'A/R bucket', 'Follow-up', 'Recommendation'],
      rows: [
        {
          Denial: 'CLM-9988',
          Category: 'Medical necessity',
          'A/R bucket': '61-90 days',
          'Follow-up': 'Appeal due 07/19',
          Recommendation: 'Appeal',
        },
        {
          Denial: 'CLM-9941',
          Category: 'Credentialing / contract',
          'A/R bucket': '31-60 days',
          'Follow-up': 'Escalate payer setup',
          Recommendation: 'Hold write-off',
        },
        {
          Denial: 'CLM-9890',
          Category: 'Patient responsibility',
          'A/R bucket': '91+ days',
          'Follow-up': 'Balance transfer sent',
          Recommendation: 'Review payment plan',
        },
      ],
    },
    guardrails: [
      'Keep credentialing / contracting denials separate from claim-edit denials.',
      'Track every follow-up attempt and payer contact outcome.',
      'Require explicit approval before posting write-offs on behavioral health claims.',
    ],
  },
  {
    path: '/reporting',
    navLabel: 'Reporting',
    title: 'Reporting',
    description:
      'Lay out month-end, provider, practice, collections, denial, AR, payer mix, and benchmark reporting foundations.',
    group: 'Admin',
    audience: 'Platform Admin, Billing Company Admin, Practice Admin',
    metrics: [
      { label: 'Clean claim rate', value: '92%', trend: '+3% over last month', tone: 'positive' },
      { label: 'Average days in A/R', value: '34', trend: 'Goal under 30', tone: 'warning' },
      { label: 'First-pass yield', value: '88%', trend: 'Credentialing denials dragging performance' },
    ],
    focusCards: [
      {
        title: 'Operational reporting base',
        description: 'Shape datasets for month-end close, provider output, collections, patient payments, and denial trends.',
      },
      {
        title: 'Benchmark-ready metrics',
        description: 'Prepare clean claim rate, first-pass yield, collection rate, payer mix, and days in A/R comparisons.',
      },
      {
        title: 'Practice and tenant filters',
        description: 'Use tenant-aware reporting scopes so billing companies can aggregate linked practices safely.',
      },
    ],
    table: {
      columns: ['Report', 'Dimension', 'Refresh cadence', 'Primary user', 'Status'],
      rows: [
        {
          Report: 'Month-end financial close',
          Dimension: 'Practice',
          'Refresh cadence': 'Monthly',
          'Primary user': 'Practice Admin',
          Status: 'Mocked KPI view',
        },
        {
          Report: 'Denial trend dashboard',
          Dimension: 'Payer + CARC',
          'Refresh cadence': 'Weekly',
          'Primary user': 'Biller',
          Status: 'Starter model',
        },
        {
          Report: 'Provider productivity + collections',
          Dimension: 'Provider',
          'Refresh cadence': 'Monthly',
          'Primary user': 'Billing Company Admin',
          Status: 'Foundation only',
        },
      ],
    },
    guardrails: [
      'Aggregate by tenant scope before exposing multi-practice dashboards.',
      'Use de-identified or minimum necessary data for broad operational summaries.',
      'Keep benchmark comparisons separate from patient-level exports.',
    ],
  },
  {
    path: '/mailroom',
    navLabel: 'Mailroom',
    title: 'Mailroom',
    description:
      'Centralize payer correspondence, EOBs, notices, and requests with assignment to patients, claims, payers, or workqueues.',
    group: 'Billing',
    audience: 'Biller, Billing Company Admin, Front Desk / Intake',
    metrics: [
      { label: 'Unresolved mail items', value: '13', trend: '4 affect active denials', tone: 'warning' },
      { label: 'Unassigned EOBs', value: '3', trend: 'Need patient/claim linking' },
      { label: 'Urgent notices', value: '2', trend: 'Timely filing and recoupment risk', tone: 'danger' },
    ],
    focusCards: [
      {
        title: 'Central intake',
        description: 'Route payer letters, remits, notices, and requests into one accountable intake queue.',
      },
      {
        title: 'Flexible assignment',
        description: 'Associate incoming documents with patients, claims, payers, or downstream tasks.',
      },
      {
        title: 'Resolution tracking',
        description: 'Keep unresolved mail visible until linked workqueues close the issue.',
      },
    ],
    table: {
      columns: ['Item', 'Linked to', 'Priority', 'Owner', 'Resolution state'],
      rows: [
        {
          Item: 'Recoupment notice',
          'Linked to': 'CLM-9988',
          Priority: 'High',
          Owner: 'Biller',
          'Resolution state': 'Appeal packet in progress',
        },
        {
          Item: 'Paper EOB',
          'Linked to': 'Unassigned',
          Priority: 'Medium',
          Owner: 'Mailroom',
          'Resolution state': 'Need patient match',
        },
        {
          Item: 'Authorization request',
          'Linked to': 'Devon S.',
          Priority: 'High',
          Owner: 'Front desk',
          'Resolution state': 'Call payer today',
        },
      ],
    },
    guardrails: [
      'Record original document source and receipt date.',
      'Do not close mailroom items until the downstream task outcome is documented.',
      'Restrict access to documents containing sensitive payer or patient identifiers.',
    ],
  },
  {
    path: '/tasks',
    navLabel: 'Tasks & Workqueues',
    title: 'Tasks & Workqueues',
    description:
      'Coordinate billing, eligibility, follow-up, documentation, patient balance, and credentialing work across tenants.',
    group: 'Overview',
    audience: 'All operational roles',
    metrics: [
      { label: 'Open tasks', value: '27', trend: '7 high priority' },
      { label: 'Due today', value: '9', trend: 'Eligibility and denial follow-up heavy', tone: 'warning' },
      { label: 'Overdue', value: '3', trend: 'Escalate to admin review', tone: 'danger' },
    ],
    focusCards: [
      {
        title: 'Cross-functional queues',
        description: 'Blend eligibility, claims, denials, documentation, patient balance, and credentialing work in one model.',
      },
      {
        title: 'Tenant-aware assignment',
        description: 'Tasks carry practice and optionally billing-company context for safe shared operations.',
      },
      {
        title: 'Priority + due date tracking',
        description: 'Support high-touch behavioral health follow-up and audit-friendly status changes.',
      },
    ],
    table: {
      columns: ['Task', 'Queue', 'Tenant', 'Owner', 'Due'],
      rows: [
        {
          Task: 'Verify authorization for Devon S.',
          Queue: 'Eligibility',
          Tenant: 'Harbor Wellness Group',
          Owner: 'Front desk',
          Due: 'Today',
        },
        {
          Task: 'Appeal CLM-9988',
          Queue: 'Denials',
          Tenant: 'Acme Behavioral Billing',
          Owner: 'Biller',
          Due: '07/19',
        },
        {
          Task: 'Review imported journal snippet',
          Queue: 'Documentation',
          Tenant: 'Harbor Wellness Group',
          Owner: 'Clinician',
          Due: 'Before next session',
        },
      ],
    },
    guardrails: [
      'Use explicit tenant assignment for every task.',
      'Keep task notes audit-friendly and role-appropriate.',
      'Preserve completion history for compliance and revenue-cycle analysis.',
    ],
  },
  {
    path: '/credentialing',
    navLabel: 'Credentialing',
    title: 'Credentialing / Contracting',
    description:
      'Track enrollments, CAQH, contracts, revalidation dates, payer contacts, and credentialing-related denials.',
    group: 'Admin',
    audience: 'Practice Admin, Billing Company Admin, Platform Admin',
    metrics: [
      { label: 'Enrollments in flight', value: '8', trend: '2 delaying claim submission', tone: 'warning' },
      { label: 'Revalidations due', value: '3', trend: 'Next 45 days' },
      { label: 'Credentialing denials', value: '2', trend: 'Tracked separately from claim-edit denials', tone: 'danger' },
    ],
    focusCards: [
      {
        title: 'Payer enrollment tracking',
        description: 'Maintain effective dates, contacts, status, and prerequisites for new payer participation.',
      },
      {
        title: 'Contract awareness',
        description: 'Store contract status and dates so downstream billing teams can identify setup gaps.',
      },
      {
        title: 'Denial crossover',
        description: 'Credentialing-related denials flow into AR separately from regular claim follow-up.',
      },
    ],
    table: {
      columns: ['Payer', 'Enrollment status', 'Effective date', 'Revalidation', 'Risk'],
      rows: [
        {
          Payer: 'BlueWave PPO',
          'Enrollment status': 'Active',
          'Effective date': '05/01/2025',
          Revalidation: '02/14/2027',
          Risk: 'None',
        },
        {
          Payer: 'Cascade HMO',
          'Enrollment status': 'Pending file completion',
          'Effective date': 'TBD',
          Revalidation: 'N/A',
          Risk: 'Claims held',
        },
        {
          Payer: 'Evergreen Medicaid',
          'Enrollment status': 'Revalidation due',
          'Effective date': '08/15/2024',
          Revalidation: '08/01/2026',
          Risk: 'Credentialing denial risk',
        },
      ],
    },
    guardrails: [
      'Separate credentialing lifecycle data from claim operational data but link them when denial risk exists.',
      'Track payer contacts and effective dates historically.',
      'Alert billing teams when contract or enrollment gaps block clean submission.',
    ],
  },
]
