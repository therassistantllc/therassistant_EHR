export type DatabaseSystemRole =
  | 'platform_admin'
  | 'practice_admin'
  | 'billing_company_admin'
  | 'billing_manager'
  | 'biller'
  | 'clinician'
  | 'front_desk'
  | 'credentialing_specialist'
  | 'read_only'
  | 'client'

export interface TenantAccess {
  tenant_id: string
  tenant_name: string
  tenant_type: 'platform' | 'practice' | 'billing_company' | 'facility'
  tenant_status: 'active' | 'pending_setup' | 'inactive' | 'suspended' | 'terminated'
  timezone: string
  membership_status: string
  roles: DatabaseSystemRole[]
}

export interface AppUserProfile {
  id: string
  email?: string | null
  display_name?: string | null
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  status?: string | null
}

export interface AppContextPayload {
  user_id: string
  profile: AppUserProfile
  tenants: TenantAccess[]
}

export function asAppContextPayload(value: unknown): AppContextPayload {
  if (!value || typeof value !== 'object') {
    throw new Error('Supabase returned an invalid application context.')
  }

  const context = value as Partial<AppContextPayload>
  if (!context.user_id || !Array.isArray(context.tenants)) {
    throw new Error('Supabase application context is missing the user or tenant list.')
  }

  return {
    user_id: context.user_id,
    profile: context.profile ?? { id: context.user_id },
    tenants: context.tenants,
  }
}
