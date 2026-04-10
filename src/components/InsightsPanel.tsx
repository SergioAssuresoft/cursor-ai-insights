import { Sparkles } from 'lucide-react'
import type { Insight } from '../lib/insights'

interface InsightsPanelProps {
  insights: Insight[]
}

const toneStyles: Record<
  Insight['tone'],
  { bar: string; badge: string }
> = {
  positive: {
    bar: 'from-[var(--color-mint)]/25 to-transparent',
    badge: 'text-[var(--color-mint)] bg-[var(--color-mint)]/10 ring-[var(--color-mint)]/25',
  },
  neutral: {
    bar: 'from-[var(--color-accent)]/20 to-transparent',
    badge: 'text-[var(--color-accent)] bg-[var(--color-accent-dim)] ring-[var(--color-border-strong)]',
  },
  watch: {
    bar: 'from-[var(--color-coral)]/25 to-transparent',
    badge: 'text-[var(--color-coral)] bg-[var(--color-coral)]/10 ring-[var(--color-coral)]/25',
  },
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="glass-panel flex h-full flex-col rounded-2xl p-5 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <Sparkles className="h-4 w-4 text-[var(--color-accent-bright)]" strokeWidth={1.75} aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">Insights</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-normal text-[var(--color-fg)]">
            AI-style signals
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Generated from your ledger (rules today — plug in an LLM later).
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {insights.map((ins) => {
          const s = toneStyles[ins.tone]
          return (
            <li
              key={ins.id}
              className="glass-inset relative overflow-hidden rounded-xl p-4"
            >
              <div
                className={`pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${s.bar}`}
              />
              <div className="pl-2">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${s.badge}`}
                >
                  {ins.tone === 'positive'
                    ? 'Opportunity'
                    : ins.tone === 'watch'
                      ? 'Watch'
                      : 'Tip'}
                </span>
                <p className="mt-2 text-sm font-semibold text-[var(--color-fg)]">{ins.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{ins.body}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
