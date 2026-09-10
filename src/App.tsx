import { useCallback, useMemo, useState, useEffect } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { workflowModules, roles } from './data/mockData'
import { AuthScreen } from './components/AuthScreen'
import { WorkspaceSetup } from './components/WorkspaceSetup'
import { DashboardPage } from './pages/DashboardPage'
import { ModulePage } from './pages/ModulePage'
import { getSupabaseClient } from './lib/supabaseClient'
import { authService, type ServiceContext } from './services/supabase'
import { asAppContextPayload, type DatabaseSystemRole, type TenantAccess } from './types/appContext'
import type { PracticeSummary, RoleOption } from './types/domain'

function roleOptionForDatabaseRole(role: DatabaseSystemRole): RoleOption {
  const direct = roles.find((option) => option.value === role)
  if (direct) return direct

  if (role === 'client') {
    return roles.find((option) => option.value === 'patient') ?? roles[0]
  }

  if (role === 'billing_manager') {
    return {
      value: 'biller',
      label: 'Billing Manager',
      focus: 'Coordinate billing workqueues, payment posting, denials, and revenue cycle performance.',
    }
  }

  if (role === 'credentialing_specialist') {
    return {
      value: 'biller',
      label: 'Credentialing Specialist',
      focus: 'Resolve payer enrollment, contracting, roster, and credentialing issues that affect clean claims.',
    }
  }

  return {
    value: 'practice_admin',
    label: 'Read Only',
    focus: 'Review the permitted workspace data without changing operational records.',
  }
}

function practiceSummaryFromTenant(tenant: TenantAccess): PracticeSummary {
  return {
    id: tenant.tenant_id,
    name: tenant.tenant_name,
    type: tenant.tenant_type === 'facility' ? 'practice' : tenant.tenant_type,
    linkedPracticeCount: 0,
  }
}

function App() {
  const [authUserId, setAuthUserId] = useState<string | null | undefined>(undefined)
  const [appContext, setAppContext] = useState<ReturnType<typeof asAppContextPayload> | null>(null)
  const [activeTenantId, setActiveTenantId] = useState('')
  const [activeRoleKey, setActiveRoleKey] = useState<DatabaseSystemRole | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadApplication = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const supabase = getSupabaseClient()
      const { data, error: claimsError } = await supabase.auth.getClaims()

      if (claimsError) {
        const message = claimsError.message.toLowerCase()
        if (message.includes('session') && message.includes('missing')) {
          setAuthUserId(null)
          setAppContext(null)
          return
        }
        throw claimsError
      }

      const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : null
      if (!userId) {
        setAuthUserId(null)
        setAppContext(null)
        return
      }

      setAuthUserId(userId)
      const context = asAppContextPayload(await authService.getAppContext())
      setAppContext(context)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load the Supabase workspace.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadApplication()

    const {
      data: { subscription },
    } = getSupabaseClient().auth.onAuthStateChange(() => {
      queueMicrotask(() => void loadApplication())
    })

    return () => subscription.unsubscribe()
  }, [loadApplication])

  const activeTenant = useMemo(() => {
    if (!appContext?.tenants.length) return null
    return appContext.tenants.find((tenant) => tenant.tenant_id === activeTenantId) ?? appContext.tenants[0]
  }, [activeTenantId, appContext])

  const activeDatabaseRole = useMemo(() => {
    if (!activeTenant?.roles.length) return null
    return activeTenant.roles.find((role) => role === activeRoleKey) ?? activeTenant.roles[0]
  }, [activeRoleKey, activeTenant])

  const activeRole = activeDatabaseRole ? roleOptionForDatabaseRole(activeDatabaseRole) : null
  const activePractice = activeTenant ? practiceSummaryFromTenant(activeTenant) : null

  const serviceContext: ServiceContext | null =
    activeTenant && appContext
      ? {
          tenantId: activeTenant.tenant_id,
          practiceId: activeTenant.tenant_id,
          actorUserId: appContext.user_id,
        }
      : null

  const navigation = useMemo(() => {
    const groups = new Map<string, typeof workflowModules>()

    for (const module of workflowModules) {
      const existingGroup = groups.get(module.group) ?? []
      existingGroup.push(module)
      groups.set(module.group, existingGroup)
    }

    return Array.from(groups.entries())
  }, [])

  if (loading && authUserId === undefined) {
    return (
      <main className="auth-shell">
        <section className="auth-card auth-card--status">
          <p className="eyebrow">THERASSISTANT</p>
          <h1>Loading secure workspace…</h1>
        </section>
      </main>
    )
  }

  if (!authUserId) {
    return <AuthScreen onAuthenticated={() => void loadApplication()} />
  }

  if (error && !appContext) {
    return (
      <main className="auth-shell">
        <section className="auth-card auth-card--status">
          <p className="eyebrow">Workspace error</p>
          <h1>Unable to load your account</h1>
          <p className="form-message form-message--error">{error}</p>
          <div className="button-row">
            <button className="primary-button" type="button" onClick={() => void loadApplication()}>
              Retry
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={async () => {
                await authService.signOut()
                await loadApplication()
              }}
            >
              Sign out
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (appContext && appContext.tenants.length === 0) {
    return (
      <WorkspaceSetup
        email={appContext.profile.email}
        displayName={appContext.profile.display_name}
        onCreated={() => void loadApplication()}
      />
    )
  }

  if (!appContext || !activeTenant || !activeRole || !activePractice || !serviceContext) {
    return null
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <p className="eyebrow">THERASSISTANT</p>
          <h2>Revenue Cycle + EHR</h2>
          <p>Behavioral health operations for practices, billing teams, clinicians, and patients.</p>
        </div>

        <nav className="sidebar__nav" aria-label="Primary">
          <div className="nav-group">
            <p className="nav-group__label">Overview</p>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              Dashboard
            </NavLink>
          </div>

          {navigation.map(([group, modules]) => (
            <div key={group} className="nav-group">
              <p className="nav-group__label">{group}</p>
              {modules.map((module) => (
                <NavLink
                  key={module.path}
                  to={module.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                >
                  {module.navLabel}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Secure tenant workspace</p>
            <h2>{activeTenant.tenant_name}</h2>
            <p className="topbar__identity">
              {appContext.profile.display_name || appContext.profile.email || 'Authenticated user'}
            </p>
          </div>

          <div className="topbar__controls">
            <label>
              <span>Role</span>
              <select
                value={activeDatabaseRole ?? ''}
                onChange={(event) => setActiveRoleKey(event.target.value as DatabaseSystemRole)}
              >
                {activeTenant.roles.map((role) => (
                  <option key={role} value={role}>
                    {roleOptionForDatabaseRole(role).label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Workspace</span>
              <select value={activeTenant.tenant_id} onChange={(event) => setActiveTenantId(event.target.value)}>
                {appContext.tenants.map((tenant) => (
                  <option key={tenant.tenant_id} value={tenant.tenant_id}>
                    {tenant.tenant_name}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="secondary-button topbar__signout"
              type="button"
              onClick={async () => {
                await authService.signOut()
                await loadApplication()
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        {error ? <p className="form-message form-message--error workspace-message">{error}</p> : null}

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                activeRole={activeRole}
                activePractice={activePractice}
                serviceContext={serviceContext}
                accessibleTenants={appContext.tenants}
              />
            }
          />
          {workflowModules.map((module) => (
            <Route
              key={module.path}
              path={module.path}
              element={<ModulePage module={module} serviceContext={serviceContext} />}
            />
          ))}
        </Routes>
      </main>
    </div>
  )
}

export default App
