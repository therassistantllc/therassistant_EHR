import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../components/DataTable'
import { MetricCard } from '../components/MetricCard'
import { Panel } from '../components/Panel'
import {
  chargeCaptureService,
  claimsService,
  denialArService,
  documentationReadinessService,
  eligibilityService,
  mailroomService,
  patientService,
  paymentPostingService,
  preSessionReadinessService,
  reportingService,
  taskWorkqueueService,
  tenantPracticeService,
  type ServiceContext,
} from '../services/supabase'
import { credentialingService } from '../services/supabase/credentialing'
import type { Metric, TableConfig, TableRow, WorkflowModule } from '../types/domain'

interface ModulePageProps {
  module: WorkflowModule
  serviceContext: ServiceContext
}

type LiveLoader = (context: ServiceContext) => Promise<unknown>

const preferredFields: Record<string, string[]> = {
  '/tenants': ['name', 'tenant_type', 'status', 'timezone', 'updated_at'],
  '/patients': [
    'client_name',
    'date_of_birth',
    'client_status',
    'registration_status',
    'billing_readiness_status',
    'open_balance_cents',
    'active_policy_count',
  ],
  '/eligibility': [
    'service_date',
    'eligibility_status',
    'response_source',
    'notes',
    'insurance_policy_id',
    'payer_id',
  ],
  '/pre-session': [
    'client_name',
    'provider_name',
    'starts_at',
    'service_type',
    'appointment_status',
    'checked_in_at',
    'has_note',
    'has_charge',
  ],
  '/documentation': [
    'client_name',
    'provider_name',
    'service_date',
    'note_status',
    'cpt_code',
    'diagnosis_code',
    'duration_minutes',
    'has_blocking_issue',
  ],
  '/charges': [
    'client_name',
    'provider_name',
    'service_date',
    'cpt_code',
    'diagnosis_code',
    'charge_status',
    'charge_amount_cents',
    'block_reason',
  ],
  '/claims': [
    'patient_control_number',
    'client_name',
    'payer_name',
    'service_date_from',
    'claim_status',
    'total_charge_cents',
    'open_balance_cents',
    'aging_bucket',
  ],
  '/payments': [
    'payment_date',
    'payer_name',
    'client_name',
    'amount_cents',
    'allocated_amount_cents',
    'unapplied_amount_cents',
    'payment_status',
    'payment_method',
  ],
  '/denials-ar': [
    'denial_date',
    'client_name',
    'payer_name',
    'carc_code',
    'rarc_code',
    'denial_category',
    'workability',
    'denial_status',
  ],
  '/mailroom': [
    'created_at',
    'file_name',
    'document_type',
    'document_status',
    'mime_type',
    'client_id',
    'claim_id',
  ],
  '/tasks': [
    'title',
    'workqueue_type',
    'priority',
    'workqueue_status',
    'due_date',
    'related_client_name',
    'related_payer_name',
    'is_overdue',
  ],
  '/credentialing': [
    'provider_name',
    'credentials',
    'individual_npi',
    'payer_name',
    'enrollment_status',
    'effective_date',
    'termination_date',
    'payer_provider_id',
  ],
}

const unsupportedReasons: Record<string, string> = {
  '/portal':
    'The current database has check-in records, but the frontend does not yet have a safe client-user-to-patient identity binding. Mock patient portal records are intentionally hidden.',
  '/journal':
    'The connected schema does not yet contain an authoritative patient journal/submission table. Mock journal records are intentionally hidden.',
}

function loaderForPath(path: string): LiveLoader | null {
  switch (path) {
    case '/tenants':
      return (context) => tenantPracticeService.listPractices(context)
    case '/patients':
      return (context) => patientService.listPatients(context)
    case '/eligibility':
      return (context) => eligibilityService.listEligibilityChecks(context)
    case '/pre-session':
      return (context) => preSessionReadinessService.listPreSessionReadiness(context)
    case '/documentation':
      return (context) => documentationReadinessService.listDocumentationReadiness(context)
    case '/charges':
      return (context) => chargeCaptureService.listChargeCaptureQueue(context)
    case '/claims':
      return (context) => claimsService.listClaims(context)
    case '/payments':
      return (context) => paymentPostingService.listClaimBasedPayments(context)
    case '/denials-ar':
      return (context) => denialArService.listDenials(context)
    case '/reporting':
      return (context) => reportingService.listReportingSnapshots(context)
    case '/mailroom':
      return (context) => mailroomService.listMailroomItems(context)
    case '/tasks':
      return (context) => taskWorkqueueService.listTaskQueue(context)
    case '/credentialing':
      return (context) => credentialingService.listProviderEnrollments(context)
    default:
      return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function fieldLabel(field: string) {
  return field
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'

  if (field.endsWith('_cents')) {
    const cents = Number(value)
    if (Number.isFinite(cents)) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
    }
  }

  if (typeof value === 'string' && (field.endsWith('_at') || field.includes('date'))) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date.toLocaleString()
  }

  if (typeof value === 'object') return JSON.stringify(value)
  return String(value).replaceAll('_', ' ')
}

function reportingTable(payload: Record<string, unknown>): TableConfig {
  const rows: TableRow[] = []

  for (const [section, sectionValue] of Object.entries(payload)) {
    if (!isRecord(sectionValue)) continue
    for (const [metric, value] of Object.entries(sectionValue)) {
      if (metric === 'tenant_id') continue
      rows.push({
        Section: fieldLabel(section),
        Metric: fieldLabel(metric),
        Value: formatValue(metric, value),
      })
    }
  }

  return {
    columns: ['Section', 'Metric', 'Value'],
    rows: rows.length ? rows : [{ Section: 'Supabase', Metric: 'Status', Value: 'No reporting data yet' }],
  }
}

function payloadToTable(path: string, payload: unknown): TableConfig {
  if (path === '/reporting' && isRecord(payload)) return reportingTable(payload)

  const records = Array.isArray(payload) ? payload.filter(isRecord) : isRecord(payload) ? [payload] : []
  if (!records.length) {
    return { columns: ['Status'], rows: [{ Status: 'No records are available for this workspace yet.' }] }
  }

  const requested = preferredFields[path] ?? []
  const requestedPresent = requested.filter((field) => records.some((record) => field in record))
  const fallback = Object.keys(records[0]).filter(
    (field) => field !== 'id' && field !== 'tenant_id' && field !== 'metadata' && field !== 'raw_response',
  )
  const fields = (requestedPresent.length ? requestedPresent : fallback).slice(0, 8)
  const columns = fields.map(fieldLabel)

  return {
    columns,
    rows: records.map((record) => {
      const row: TableRow = {}
      for (const field of fields) row[fieldLabel(field)] = formatValue(field, record[field])
      return row
    }),
  }
}

function recordCount(payload: unknown) {
  if (Array.isArray(payload)) return payload.length
  if (isRecord(payload)) return Object.values(payload).filter(isRecord).length || 1
  return 0
}

export function ModulePage({ module, serviceContext }: ModulePageProps) {
  const loader = useMemo(() => loaderForPath(module.path), [module.path])
  const [payload, setPayload] = useState<unknown>(null)
  const [loading, setLoading] = useState(Boolean(loader))
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!loader) {
      setPayload(null)
      setLoading(false)
      setError('')
      return () => {
        cancelled = true
      }
    }

    async function loadModule() {
      setLoading(true)
      setError('')
      try {
        const result = await loader(serviceContext)
        if (!cancelled) setPayload(result)
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load this Supabase module.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadModule()
    return () => {
      cancelled = true
    }
  }, [loader, serviceContext])

  const liveTable = useMemo(() => payloadToTable(module.path, payload), [module.path, payload])
  const liveMetrics = useMemo<Metric[]>(
    () => [
      {
        label: 'Live records',
        value: loader ? recordCount(payload).toLocaleString() : '—',
        trend: loader ? 'Loaded from the connected tenant scope' : 'No safe live adapter yet',
        tone: loader ? 'positive' : 'warning',
      },
      {
        label: 'Data source',
        value: loader ? 'Supabase' : 'Pending',
        trend: loader ? 'Mock operational rows are not used' : 'Static workflow guidance only',
      },
      {
        label: 'Tenant scope',
        value: loader ? 'Enforced' : '—',
        trend: loader ? 'Access remains subject to RLS' : 'No live query is executed',
      },
    ],
    [loader, payload],
  )

  return (
    <div className="page-stack">
      <section className="hero-card hero-card--compact">
        <div>
          <p className="eyebrow">{module.group}</p>
          <h1>{module.title}</h1>
          <p className="hero-card__body">{module.description}</p>
        </div>
        <div className="hero-card__highlight">
          <h2>Primary audience</h2>
          <p>{module.audience}</p>
        </div>
      </section>

      <section className="metric-grid" aria-busy={loading}>
        {liveMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      {error ? <p className="form-message form-message--error">{error}</p> : null}

      <div className="content-grid">
        <Panel title="Workflow focus" description="Core capabilities and intended operating model for this module.">
          <div className="card-grid">
            {module.focusCards.map((card) => (
              <article key={card.title} className="detail-card">
                {card.tag ? <p className="detail-card__tag">{card.tag}</p> : null}
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Guardrails" description="Healthcare and revenue-cycle controls retained around the live workflow.">
          <ul className="checklist">
            {module.guardrails.map((guardrail) => (
              <li key={guardrail}>{guardrail}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title={loader ? 'Live queue / registry' : 'Live connection status'}
        description={
          loader
            ? loading
              ? 'Loading current tenant data from Supabase…'
              : 'Current tenant-scoped records from Supabase. Sample operational rows are no longer displayed.'
            : unsupportedReasons[module.path] ?? 'This module does not yet have a live Supabase frontend adapter.'
        }
      >
        {loader ? <DataTable table={liveTable} /> : <p className="empty-state">No mock records are displayed.</p>}
      </Panel>
    </div>
  )
}
