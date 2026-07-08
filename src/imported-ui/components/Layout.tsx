import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { HelpCircle } from 'lucide-react'
import { useAppContext, ROLE_LABELS } from '../context/AppContext'
import { NotificationsDrawer, BellButton } from './NotificationsDrawer'

interface LayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export function Layout({ children, title, subtitle, actions }: LayoutProps) {
  const { currentUser } = useAppContext()
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="shrink-0 h-12 flex items-center justify-between px-5 border-b border-border bg-card">
          <div className="flex items-center gap-3 min-w-0">
            {title && (
              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
                {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </button>
            {currentUser.role !== 'patient' && (
              <BellButton onClick={() => setNotifOpen(true)} />
            )}
            <div className="flex items-center gap-1.5 ml-1">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-foreground leading-none">
                  {(currentUser.name.split(',')[0] ?? currentUser.name)}
                </p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  {ROLE_LABELS[currentUser.role]}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}

// Reusable page header inside content area
interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  badge?: ReactNode
}

export function PageHeader({ title, description, actions, badge }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-border bg-card">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {badge}
        </div>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

// Empty state
export function EmptyState({
  icon, title, description,
}: {
  icon: ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
      )}
    </div>
  )
}
