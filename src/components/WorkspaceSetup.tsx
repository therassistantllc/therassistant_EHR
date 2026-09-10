import { useState, type FormEvent } from 'react'
import { onboardingService } from '../services/supabase'

interface WorkspaceSetupProps {
  email?: string | null
  displayName?: string | null
  onCreated: () => void
}

export function WorkspaceSetup({ email, displayName, onCreated }: WorkspaceSetupProps) {
  const [tenantName, setTenantName] = useState('')
  const [tenantType, setTenantType] = useState<'practice' | 'billing_company'>('practice')
  const [name, setName] = useState(displayName ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onboardingService.bootstrapTenant({
        tenantName: tenantName.trim(),
        tenantType,
        displayName: name.trim() || undefined,
        email: email ?? undefined,
        timezone: 'America/Denver',
      })
      onCreated()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Workspace setup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-card__brand">
          <p className="eyebrow">First-time setup</p>
          <h1>Create your workspace</h1>
          <p>This establishes the first tenant, your membership, and your administrator role in Supabase.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Your name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          </label>

          <label>
            <span>Workspace name</span>
            <input
              value={tenantName}
              onChange={(event) => setTenantName(event.target.value)}
              required
              placeholder="Practice or billing company name"
            />
          </label>

          <label>
            <span>Workspace type</span>
            <select value={tenantType} onChange={(event) => setTenantType(event.target.value as typeof tenantType)}>
              <option value="practice">Behavioral health practice</option>
              <option value="billing_company">Billing / revenue cycle company</option>
            </select>
          </label>

          {error ? <p className="form-message form-message--error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Creating workspace…' : 'Create workspace'}
          </button>
        </form>
      </section>
    </main>
  )
}
