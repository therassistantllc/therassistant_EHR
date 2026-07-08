import { dashboardMetrics, linkedPracticeRows, preSessionRows, roles } from '../data/mockData'
import { environmentReadiness, securityPrinciples } from '../lib/foundation'
import type { PracticeSummary, RoleOption } from '../types/domain'
import { DataTable } from '../components/DataTable'
import { MetricCard } from '../components/MetricCard'
import { Panel } from '../components/Panel'

interface DashboardPageProps {
  activeRole: RoleOption
  activePractice: PracticeSummary
}

const roleQuickActions: Record<RoleOption['value'], string[]> = {
  platform_admin: [
    'Review tenant health and practice onboarding blockers.',
    'Confirm row-level security rollout for new Supabase tables.',
    'Audit cross-practice billing-company access grants.',
  ],
  billing_company_admin: [
    'Balance linked-practice denial follow-up and payment posting workloads.',
    'Review timely filing risks across all serviced practices.',
    'Escalate credentialing-related denials before month-end close.',
  ],
  practice_admin: [
    'Resolve eligibility, documentation, and patient balance issues before sessions.',
    'Monitor clinician note readiness and charge release timing.',
    'Review practice-level collections, denials, and patient portal adoption.',
  ],
  clinician: [
    'Check the pre-session board for authorization, balance, and documentation blockers.',
    'Review patient-submitted journals and selectively import only what is clinically relevant.',
    'Finish provider-authored notes before releasing charges to billing.',
  ],
  biller: [
    'Clear claim edits, denials, and zero-pay postings first.',
    'Post historical onboarding payments directly to the patient ledger when needed.',
    'Track corrected claims, reconsiderations, and appeal deadlines.',
  ],
  front_desk: [
    'Work pre-session eligibility, portal, and intake issues before check-in.',
    'Confirm responsible party, copay, and insurance updates with patients.',
    'Escalate missing authorizations or balance plans to the right queue.',
  ],
  patient: [
    'Complete check-in and questionnaires before your next session.',
    'Review balances, update insurance, and share session topics in the portal.',
    'Journal between sessions without changing the provider’s final note.',
  ],
}

export function DashboardPage({ activeRole, activePractice }: DashboardPageProps) {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Behavioral health revenue cycle + clinical readiness</p>
          <h1>THERASSISTANT</h1>
          <p className="hero-card__body">
            A dashboard-first foundation for behavioral health practices, billing companies, and patients.
            The current workspace is <strong>{activePractice.name}</strong> for the{' '}
            <strong>{activeRole.label}</strong> role.
          </p>
        </div>
        <div className="hero-card__highlight">
          <h2>Today’s focus</h2>
          <p>{activeRole.focus}</p>
        </div>
      </section>

      <section className="metric-grid">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <div className="content-grid content-grid--dashboard">
        <Panel title="Role-based priorities" description="Recommended work for the active role and tenant context.">
          <ul className="checklist">
            {roleQuickActions[activeRole.value].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Foundation status"
          description="Supabase-ready environment and security expectations for the first build."
        >
          <ul className="checklist">
            {environmentReadiness.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Pre-session readiness"
        description="A clinician-friendly view of patient, insurance, authorization, balance, documentation, and billing indicators."
      >
        <DataTable
          table={{
            columns: ['Patient', 'Appointment', 'Coverage', 'Authorization', 'Balance', 'Documentation', 'Billing'],
            rows: preSessionRows,
          }}
        />
      </Panel>

      <div className="content-grid">
        <Panel title="Linked practice overview" description="Billing-company and platform users can review shared operating queues.">
          <DataTable
            table={{
              columns: ['Practice', 'Clinicians', 'Claims', 'Denials', 'Eligibility', 'Portal'],
              rows: linkedPracticeRows,
            }}
          />
        </Panel>

        <Panel title="Audit + HIPAA-conscious guardrails" description="Foundational rules baked into the first version.">
          <ul className="checklist">
            {securityPrinciples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Core workflow map"
        description="The first version covers clinical, billing, patient, and admin modules with mock data where production integrations are pending."
      >
        <div className="pill-list">
          {roles.map((role) => (
            <span key={role.value} className="role-pill">
              {role.label}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  )
}
