import { getSupabaseClient } from '../../lib/supabaseClient'
import type { ServiceContext } from './index'

export const credentialingService = {
  async listProviderEnrollments(context: ServiceContext) {
    if (!context.tenantId || !context.actorUserId) {
      throw new Error('tenantId and actorUserId are required for credentialing access.')
    }

    const { data, error } = await getSupabaseClient()
      .from('v_provider_enrollment_matrix')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(`List provider enrollments failed: ${error.message}`)
    }

    return data
  },
}
