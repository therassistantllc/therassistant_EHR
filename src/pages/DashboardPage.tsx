import { useEffect, useMemo, useState } from 'react'
import type { TenantAccess } from '../types/appContext'
import type { Metric, PracticeSummary, RoleOption, TableRow } from '../types/domain'
import {
  preSessionReadinessService,
  reportingService,
  type ServiceContext,
} from '../services/supabase'
import { DataTable } from '../components/DataTable'
import { MetricCard } from '../components/MetricCard'
import { Panel } from '../components/Panel'

interface DashboardPageProps {
  activeRole: RoleOption
  activePractice: PracticeSummary
  serviceContext: ServiceContext
  accessibleTenants: TenantAccess[]
}

interface ReportingSnapshot {
  kpis: Record<string, unknown> | null
  openAr: Record<string, unknown> | null
}

const roleQuickActions: Record<RoleOption['value'], string[]> = {
  platform_admin: [
    'Review tenant health and practice onboarding blockers.',
    'Monitor shared workqueues and access boundaries.',
    'Review cross-practice billing activity that requires escalation.',
  ],
  billing_company_admin: [
    'Balance linked-practice denial follow-up and payment posting workloads.',
    'Review timely filing risks across serviced practices.',
    'Escalate credentialing-related denials before month-end close.',
  ],
  practice_admin: [
    'Resolve eligibility, documentation, and patient balance issues before sessions.',
    'Monitor clinician note readiness and charge release timing.',
    'Review practice-level A/R, denials, and open workqueues.',
  ],
  clinician: [
    'Check the pre-session board for visit-readiness blockers.',
    'Finish provider-authored notes before releasing charges to billing.',
    'Review unsigned documentation that needs clinical action.',
  ],
  biller: [
    'Clear claim edits, denials, and payment posting issues first.',
    'Post historical onboarding payments separately from claim-based payments.',
    'Track corrected claims, reconsiderations, and appeal deadlines.',
  ],
  front_desk: [
    'Work pre-session eligibility and intake issues before check-in.',
    'Confirm insurance and responsible-party changes that require staff review.',
    'Escalate missing authorizations to the appropriate workqueue.',
  ],
  patient: [
    'Complete check-in items before the next session.',
    'Review account information made available through the patient workflow.',
    'Submit updates without altering provider-authored clinical documentation.',
  ],
}

function numberValue(value: unknown) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function currencyFromCents(value: unknown) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numberValue(value) / 100)
}

function formatDateTime(value: unknown) {
  if (typeof value !== 'string' || !value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export function DashboardPage({
  activeRole,
  activePractice,
  serviceContext,
  accessibleTenants,
}: DashboardPageProps) {
  const [reporting, setReporting] = useState<ReportingSnapshot | null>(null)
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [reportingResult, appointmentResult] = await Promise.all([
          reportingService.listReportingSnapshots(serviceContext),
          preSessionReadinessService.listPreSessionReadiness(serviceContext),
        ])

        if (cancelled) return
        setReporting(reportingResult as ReportingSnapshot)
        setAppointments((appointmentResult ?? []) as Record<string, unknown>[])
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadDashboard()
    return () => {
      cancelled = true
    }
  }, [serviceContext])

  const metrics = useMemo<Metric[]>(() => {
    const kpis = reporting?.kpis ?? {}
    const openAr = reporting?.openAr ?? {}

    return [
      {
        label: 'Clients',
        value: numberValue(kpis.client_count).toLocaleString(),
        trend: 'Active tenant client population',
      },
      {
        label: 'Active providers',
        value: numberValue(kpis.active_provider_count).toLocaleString(),
        trend: 'Providers currently active in this workspace',
      },
      {
        label: 'Claims ready',
        value: numberValue(kpis.ready_for_batch_claim_count).toLocaleString(),
        trend: 'Claims ready for batching',
        tone: 'positive',
      },
      {
        label: 'Open denials',
        value: numberValue(kpis.open_denial_count).toLocaleString(),
        trend: 'Denials still requiring resolution',
        tone: numberValue(kpis.open_denial_count) > 0 ? 'warning' : 'positive',
      },
      {
        label: 'Open workqueues',
        value: numberValue(kpis.open_workqueue_count).toLocaleString(),
        trend: 'Operational tasks still open',
        tone: numberValue(kpis.open_workqueue_count) > 0 ? 'warning' : 'positive',
      },
      {
        label: 'Unreconciled payments',
        value: numberValue(kpis.unreconciled_payment_count).toLocaleString(),
        trend: 'Payments requiring reconciliation',
        tone: numberValue(kpis.unreconciled_payment_count) > 0 ? 'warning' : 'positive',
      },
      {
        label: 'Open A/R',
        value: currencyFromCents(openAr.total_open_ar_cents ?? kpis.total_open_ar_cents),
        trend: `${numberValue(openAr.open_claim_count).toLocaleString()} open claims`,
      },
    ]
  }, [reporting])

  const preSessionRows = useMemo<TableRow[]>(
    () =>
      appointments.map((appointment) => ({
        Patient: String(appointment.client_name ?? '—'),
        Appointment: formatDateTime(appointment.starts_at),
        Provider: String(appointment.provider_name ?? '—'),
        Service: String(appointment.service_type ?? appointment.cpt_code ?? '—'),
        Status: String(appointment.appointment_status ?? '—'),
        CheckIn: appointment.checked_in_at ? 'Checked in' : appointment.arrived_at ? 'Arrived' : 'Pending',
        Documentation: appointment.has_note ? 'Note present' : 'No note yet',
        Charge: appointment.has_charge ? 'Created' : 'Pending',
      })),
    [appointments],
  )

  const tenantRows = useMemo<TableRow[]>(
    () =>
      accessibleTenants.map((tenant) => ({
        Workspace: tenant.tenant_name,
        Type: tenant.tenant_type.replaceAll('_', ' '),
        Status: tenant.tenant_status.replaceAll('_', ' '),
        Roles: tenant.roles.join(', ').replaceAll('_', ' '),
        Timezone: tenant.timezone,
      })),
    [accessibleTenants],
  )

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Behavioral health revenue cycle + clinical readiness</p>
          <h1>THERASSISTANT</h1>
          <p className="hero-card__body">
            Live Supabase workspace for <strong>{activePractice.name}</strong>. The current authorized UI role is{' '}
            <strong>{activeRole.label}</strong>.
          </p>
        </div>
        <div className="hero-card__highlight">
          <h2>Today’s focus</h2>
          <p>{activeRole.focus}</p>
        </div>
      </section>

      {error ? <p className="form-message form-message--error">{error}</p> : null}

      <section className="metric-grid" aria-busy={loading}>
        {metrics.map((metric) => (
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

        <Panel title="Live connection" description="Current data source and scope for this browser session.">
          <ul className="checklist">
            <li>Supabase Auth protects the application shell.</li>
            <li>Tenant membership and database RLS determine record access.</li>
            <li>Dashboard KPIs and queues are loaded from live Supabase views.</li>
          </ul>
        </Panel>
      </div>

      <Panel
        title="Pre-session readiness"
        description={loading ? 'Loading live appointments…' : 'Current appointment readiness from Supabase.'}
      >
        {preSessionRows.length ? (
          <DataTable
            table={{
              columns: ['Patient', 'Appointment', 'Provider', 'Service', 'Status', 'CheckIn', 'Documentation', 'Charge'],
              rows: preSessionRows,
            }}
          />
        ) : (
          <p className="empty-state">No upcoming appointment records are available for this workspace.</p>
        )}
      </Panel>

      <Panel title="Workspace access" description="Tenants currently assigned to the authenticated user.">
        <DataTable
          table={{
            columns: ['Workspace', 'Type', 'Status', 'Roles', 'Timezone'],
            rows: tenantRows,
          }}
        />
      </Panel>
    </div>
  )
}
