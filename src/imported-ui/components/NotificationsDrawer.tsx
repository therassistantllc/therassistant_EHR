import { useEffect, useMemo, useState } from 'react'

type Notification = {
  id: string
  title: string
  body: string
  createdAt: string
  unread?: boolean
  type?: 'task' | 'claim' | 'eligibility' | 'system'
}

const notifications: Notification[] = [
  {
    id: 'notif1',
    title: 'Eligibility issue flagged',
    body: 'A payer response needs review before the next appointment block.',
    createdAt: '2026-07-08T15:30:00.000Z',
    unread: true,
    type: 'eligibility',
  },
  {
    id: 'notif2',
    title: 'Claim follow-up needed',
    body: 'One claim is approaching the follow-up window.',
    createdAt: '2026-07-07T18:10:00.000Z',
    unread: true,
    type: 'claim',
  },
  {
    id: 'notif3',
    title: 'Task reminder',
    body: 'Review unresolved workqueue items when you have a minute.',
    createdAt: '2025-07-10T12:00:00.000Z',
    unread: false,
    type: 'task',
  },
]

function formatRelativeTime(dateInput: string) {
  const timestamp = new Date(dateInput).getTime()

  if (!Number.isFinite(timestamp)) {
    return ''
  }

  const diffMs = Math.max(Date.now() - timestamp, 0)
  const minutes = Math.floor(diffMs / 60_000)
  const hours = Math.floor(diffMs / 3_600_000)
  const days = Math.floor(diffMs / 86_400_000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`

  return `${days}d ago`
}

function RelativeTime({ date }: { date: string }) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const update = () => setLabel(formatRelativeTime(date))

    update()
    const interval = window.setInterval(update, 60_000)

    return () => window.clearInterval(interval)
  }, [date])

  return <span className="text-[10px] text-muted-foreground">{label}</span>
}

function NotifItem({ notif, onClick }: { notif: Notification; onClick?: () => void }) {
  return (
    <div
      className="px-4 py-3 border-b border-border hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 h-2 w-2 rounded-full ${notif.unread ? 'bg-primary' : 'bg-muted'}`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-foreground truncate">{notif.title}</p>
            {notif.type && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground shrink-0">
                {notif.type}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">{notif.body}</p>
          <div className="flex items-center gap-2 mt-2">
            <RelativeTime date={notif.createdAt} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BellButton({ onClick }: { onClick: () => void }) {
  const unreadCount = useMemo(() => notifications.filter((notif) => notif.unread).length, [])

  return (
    <button
      className="relative w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
      aria-label="Open notifications"
      onClick={onClick}
    >
      <span aria-hidden="true" className="text-sm leading-none">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] leading-4 text-center px-1">
          {unreadCount}
        </span>
      )}
    </button>
  )
}

export function NotificationsDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/20"
        aria-label="Close notifications"
        onClick={onClose}
      />
      <aside className="relative h-full w-full max-w-sm bg-card border-l border-border shadow-xl flex flex-col">
        <div className="h-12 px-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
            <p className="text-[11px] text-muted-foreground">Recent workqueue activity</p>
          </div>
          <button
            type="button"
            className="w-7 h-7 rounded-md hover:bg-accent text-muted-foreground"
            aria-label="Close notifications"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.map((notif) => (
            <NotifItem key={notif.id} notif={notif} onClick={onClose} />
          ))}
        </div>
      </aside>
    </div>
  )
}
