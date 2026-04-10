import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  hint?: string
  icon: LucideIcon
  trend?: { label: string; positive?: boolean }
}

export function KpiCard({ title, value, hint, icon: Icon, trend }: KpiCardProps) {
  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.22] blur-3xl"
        style={{ background: 'var(--color-accent-bright)' }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-muted)]">{title}</p>
          <p className="mt-2 font-display text-3xl font-normal tracking-tight text-[var(--color-fg)] md:text-4xl">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 max-w-[18rem] text-xs leading-relaxed text-[var(--color-muted)]">
              {hint}
            </p>
          ) : null}
          {trend ? (
            <p
              className={`mt-2 text-xs font-medium ${
                trend.positive === true
                  ? 'text-[var(--color-mint)]'
                  : trend.positive === false
                    ? 'text-[var(--color-coral)]'
                    : 'text-[var(--color-muted)]'
              }`}
            >
              {trend.label}
            </p>
          ) : null}
        </div>
        <div className="glass-icon-well flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[var(--color-accent-bright)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
      </div>
    </div>
  )
}
