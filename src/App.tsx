import { useMemo, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { workflowModules, practiceOptions, roles } from './data/mockData'
import { DashboardPage } from './pages/DashboardPage'
import { ModulePage } from './pages/ModulePage'

function App() {
  const [activeRoleValue, setActiveRoleValue] = useState(roles[2].value)
  const [activePracticeId, setActivePracticeId] = useState(practiceOptions[2].id)

  const activeRole = useMemo(
    () => roles.find((role) => role.value === activeRoleValue) ?? roles[0],
    [activeRoleValue],
  )

  const activePractice = useMemo(
    () => practiceOptions.find((practice) => practice.id === activePracticeId) ?? practiceOptions[0],
    [activePracticeId],
  )

  const navigation = useMemo(() => {
    const groups = new Map<string, typeof workflowModules>()

    for (const module of workflowModules) {
      const existingGroup = groups.get(module.group) ?? []
      existingGroup.push(module)
      groups.set(module.group, existingGroup)
    }

    return Array.from(groups.entries())
  }, [])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <p className="eyebrow">THERASSISTANT</p>
          <h2>RCM + EHR-adjacent SaaS</h2>
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
            <p className="eyebrow">Multi-tenant workspace</p>
            <h2>{activePractice.name}</h2>
          </div>

          <div className="topbar__controls">
            <label>
              <span>Role</span>
              <select value={activeRole.value} onChange={(event) => setActiveRoleValue(event.target.value as typeof activeRole.value)}>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Workspace</span>
              <select value={activePractice.id} onChange={(event) => setActivePracticeId(event.target.value)}>
                {practiceOptions.map((practice) => (
                  <option key={practice.id} value={practice.id}>
                    {practice.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardPage activeRole={activeRole} activePractice={activePractice} />} />
          {workflowModules.map((module) => (
            <Route key={module.path} path={module.path} element={<ModulePage module={module} />} />
          ))}
        </Routes>
      </main>
    </div>
  )
}

export default App
