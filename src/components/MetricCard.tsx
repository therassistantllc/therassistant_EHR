import type { Metric } from '../types/domain'
import { Badge } from './Badge'

interface MetricCardProps {
  metric: Metric
}

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <article className="metric-card">
      <p className="metric-card__label">{metric.label}</p>
      <div className="metric-card__value-row">
        <h3>{metric.value}</h3>
        <Badge tone={metric.tone}>{metric.tone ?? 'active'}</Badge>
      </div>
      <p className="metric-card__trend">{metric.trend}</p>
    </article>
  )
}
