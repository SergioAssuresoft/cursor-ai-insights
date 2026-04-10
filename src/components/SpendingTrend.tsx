import { useMemo } from 'react'
import type { ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '../lib/currency'

interface Point {
  label: string
  short: string
  total: number
}

interface SpendingTrendProps {
  data: Point[]
}

export function SpendingTrend({ data }: SpendingTrendProps) {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.short),
      datasets: [
        {
          label: 'Spent',
          data: data.map((d) => d.total),
          borderColor: '#818cf8',
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#a5b4fc',
          fill: true,
          backgroundColor: (context: {
            chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } }
          }) => {
            const { ctx, chartArea } = context.chart
            if (!chartArea) return 'rgba(99, 102, 241, 0.08)'
            const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            g.addColorStop(0, 'rgba(99, 102, 241, 0.32)')
            g.addColorStop(1, 'rgba(99, 102, 241, 0)')
            return g
          },
        },
      ],
    }),
    [data],
  )

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
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
          displayColors: false,
          callbacks: {
            title: (items) => {
              const i = items[0]?.dataIndex
              return i !== undefined ? data[i]?.label ?? '' : ''
            },
            label: (item) => `Spent: ${formatCurrency(Number(item.parsed.y))}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#7a8299',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
            font: { size: 11 },
          },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: {
            color: '#7a8299',
            font: { size: 11 },
            callback: (v) => {
              const n = Number(v)
              return n >= 1000 ? `${n / 1000}k` : String(v)
            },
          },
          border: { display: false },
        },
      },
    }),
    [data],
  )

  return (
    <div className="glass-panel flex h-full min-h-[320px] flex-col rounded-2xl p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <TrendingUp className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">Cash flow</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-normal text-[var(--color-fg)]">
            Spending trend
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Last 30 days, daily totals</p>
        </div>
      </div>
      <div className="relative min-h-0 w-full min-w-0 flex-1" style={{ minHeight: 240 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
