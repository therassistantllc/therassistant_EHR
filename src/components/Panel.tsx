import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  description?: string
  aside?: ReactNode
  children: ReactNode
}

export function Panel({ title, description, aside, children }: PanelProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {aside ? <div className="panel__aside">{aside}</div> : null}
      </div>
      {children}
    </section>
  )
}
