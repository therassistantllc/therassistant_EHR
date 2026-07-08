import { DataTable } from '../components/DataTable'
import { MetricCard } from '../components/MetricCard'
import { Panel } from '../components/Panel'
import type { WorkflowModule } from '../types/domain'

interface ModulePageProps {
  module: WorkflowModule
}

export function ModulePage({ module }: ModulePageProps) {
  return (
    <div className="page-stack">
      <section className="hero-card hero-card--compact">
        <div>
          <p className="eyebrow">{module.group}</p>
          <h1>{module.title}</h1>
          <p className="hero-card__body">{module.description}</p>
        </div>
        <div className="hero-card__highlight">
          <h2>Primary audience</h2>
          <p>{module.audience}</p>
        </div>
      </section>

      <section className="metric-grid">
        {module.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <div className="content-grid">
        <Panel title="Workflow focus" description="Key first-version capabilities for this module.">
          <div className="card-grid">
            {module.focusCards.map((card) => (
              <article key={card.title} className="detail-card">
                {card.tag ? <p className="detail-card__tag">{card.tag}</p> : null}
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Guardrails" description="Healthcare SaaS considerations included in the starter foundation.">
          <ul className="checklist">
            {module.guardrails.map((guardrail) => (
              <li key={guardrail}>{guardrail}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Sample queue / registry" description="Starter mock data to demonstrate how the workflow could look.">
        <DataTable table={module.table} />
      </Panel>
    </div>
  )
}
