import { useMemo } from 'react'
import type { ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { PieChartIcon } from 'lucide-react'
import type { ExpenseCategory } from '../types/expense'
import { CATEGORY_VIS } from '../constants/categories'
import { formatCurrency } from '../lib/currency'

interface Row {
  category: ExpenseCategory
  value: number
}

interface CategoryBreakdownProps {
  rows: Row[]
  monthLabel: string
}

export function CategoryBreakdown({ rows, monthLabel }: CategoryBreakdownProps) {
  const sliceRows = rows.filter((r) => r.value > 0)
  const empty = sliceRows.length === 0

  const chartData = useMemo(
    () => ({
      labels: sliceRows.map((r) => CATEGORY_VIS[r.category].label),
      datasets: [
        {
          data: sliceRows.map((r) => r.value),
          backgroundColor: sliceRows.map((r) => CATEGORY_VIS[r.category].color),
          borderWidth: 0,
          spacing: 3,
          hoverOffset: 6,
        },
      ],
    }),
    [sliceRows],
  )

  const options: ChartOptions<'doughnut'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(16, 19, 26, 0.94)',
          titleColor: '#7a8299',
          bodyColor: '#eef0f6',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 12,
          displayColors: true,
          callbacks: {
            label: (ctx) => {
              const label = ctx.label ? `${ctx.label}: ` : ''
              const v = ctx.parsed
              return `${label}${formatCurrency(typeof v === 'number' ? v : 0)}`
            },
          },
        },
      },
    }),
    [],
  )

  return (
    <div className="glass-panel flex h-full min-h-[320px] flex-col rounded-2xl p-5 md:p-6">
      <div className="mb-2 flex items-center gap-2 text-[var(--color-muted)]">
        <PieChartIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wider">Mix</span>
      </div>
      <h2 className="font-display text-2xl font-normal text-[var(--color-fg)]">By category</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{monthLabel}</p>

      <div className="mt-4 flex min-h-0 flex-1 flex-col items-center gap-4 lg:flex-row lg:items-center">
        <div className="h-52 w-full min-w-0 shrink-0 lg:h-56 lg:w-1/2">
          {empty ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
              No spend this month yet
            </div>
          ) : (
            <div className="relative h-full w-full min-h-[208px]">
              <Doughnut data={chartData} options={options} />
            </div>
          )}
        </div>
        <ul className="flex w-full flex-col gap-2 lg:w-1/2">
          {(Object.keys(CATEGORY_VIS) as ExpenseCategory[]).map((cat) => {
            const v = rows.find((r) => r.category === cat)?.value ?? 0
            return (
              <li
                key={cat}
                className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: CATEGORY_VIS[cat].color }}
                  />
                  <span className="truncate text-[var(--color-muted)]">
                    {CATEGORY_VIS[cat].label}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-[var(--color-fg)]">
                  {v > 0 ? formatCurrency(v) : '—'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
