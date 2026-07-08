interface BadgeProps {
  children: string
  tone?: 'default' | 'positive' | 'warning' | 'danger'
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
