export type UserRole =
  | 'platform_admin'
  | 'billing_company_admin'
  | 'practice_admin'
  | 'clinician'
  | 'biller'
  | 'front_desk'
  | 'patient'

export type NavGroup = 'Overview' | 'Clinical' | 'Billing' | 'Patient' | 'Admin'

export interface RoleOption {
  value: UserRole
  label: string
  focus: string
}

export interface PracticeSummary {
  id: string
  name: string
  type: 'practice' | 'billing_company' | 'platform'
  linkedPracticeCount: number
}

export interface Metric {
  label: string
  value: string
  trend: string
  tone?: 'default' | 'positive' | 'warning' | 'danger'
}

export interface FocusCard {
  title: string
  description: string
  tag?: string
}

export interface TableRow {
  [key: string]: string
}

export interface TableConfig {
  columns: string[]
  rows: TableRow[]
}

export interface WorkflowModule {
  path: string
  navLabel: string
  title: string
  description: string
  group: NavGroup
  audience: string
  metrics: Metric[]
  focusCards: FocusCard[]
  table: TableConfig
  guardrails: string[]
}
