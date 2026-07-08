import { env, hasSupabaseCredentials } from './env'
import type { UserRole } from '../types/domain'

export interface AuthSessionShape {
  userId: string
  role: UserRole
  practiceIds: string[]
  billingCompanyIds: string[]
  permissions: string[]
}

export const authSessionExample: AuthSessionShape = {
  userId: 'usr_ther_001',
  role: 'practice_admin',
  practiceIds: ['prac_harbor'],
  billingCompanyIds: ['bill_acme'],
  permissions: [
    'dashboard.view',
    'patients.view',
    'eligibility.manage',
    'charges.manage',
    'claims.follow_up',
    'reports.view',
  ],
}

export const securityPrinciples = [
  'Store patient-submitted journal and questionnaire entries separately from provider-authored documentation tables.',
  'Apply practice_id on every tenant-scoped table and prepare Supabase row-level security policies before enabling write access.',
  'Capture audit metadata for claim corrections, payment posting, note imports, and role changes.',
  'Require provider review before imported patient content can influence a billable note or charge state.',
]

export const environmentReadiness = [
  `App name: ${env.appName}`,
  hasSupabaseCredentials
    ? 'Supabase environment variables detected for local configuration.'
    : 'Supabase environment variables are not configured yet. Use .env.example to wire your project.',
  'Authentication flow should map authenticated users to platform, billing-company, and practice scopes.',
]
