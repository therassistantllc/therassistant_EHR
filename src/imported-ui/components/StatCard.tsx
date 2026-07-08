import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../lib/shadcn/utils'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  trendPositiveIsGood?: boolean
  accent?: 'default' | 'warning' | 'danger' | 'success'
  className?: string
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  trendLabel,
  trendPositiveIsGood = true,
  accent = 'default',
  className,
}: StatCardProps) {
  const accentBorder = {
    default: 'border-border',
    warning: 'border-l-4 border-warning',
    danger: 'border-l-4 border-destructive',
    success: 'border-l-4 border-success',
  }[accent]

  const trendColor =
    trend === 'up'
      ? trendPositiveIsGood ? 'text-success' : 'text-destructive'
      : trend === 'down'
        ? trendPositiveIsGood ? 'text-destructive' : 'text-success'
        : 'text-muted-foreground'

  return (
    <div className={cn('bg-card text-card-foreground rounded-lg border p-4 shadow-[var(--shadow-retool-sm)]', accentBorder, className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          {subtext && <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>}
          {trend && trendLabel && (
            <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium', trendColor)}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {trendLabel}
            </div>
          )}
        </div>
        {icon && (
          <div className="shrink-0 w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

interface AlertCardProps {
  title: string
  count: number
  description: string
  severity: 'error' | 'warning' | 'info'
  onClick?: () => void
}

export function AlertCard({ title, count, description, severity, onClick }: AlertCardProps) {
  const styles = {
    error: 'bg-destructive/10 border-destructive/30 text-destructive',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    info: 'bg-primary/10 border-primary/30 text-primary',
  }[severity]

  return (
    <div
      className={cn('rounded-lg border p-3 cursor-pointer hover:opacity-90 transition-opacity', styles)}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">{count}</span>
        <div>
          <p className="text-sm font-semibold leading-none">{title}</p>
          <p className="text-xs mt-0.5 opacity-80">{description}</p>
        </div>
      </div>
    </div>
  )
}
