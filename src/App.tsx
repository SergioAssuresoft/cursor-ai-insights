import { endOfMonth, format, startOfMonth } from 'date-fns'
import { LayoutDashboard, Receipt, RotateCcw, Trash } from 'lucide-react'
import { useMemo } from 'react'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { ExpenseTable } from './components/ExpenseTable'
import { InsightsPanel } from './components/InsightsPanel'
import { KpiCard } from './components/KpiCard'
import { QuickAddExpense } from './components/QuickAddExpense'
import { SpendingTrend } from './components/SpendingTrend'
import { EXPENSE_CATEGORIES } from './types/expense'
import {
  dailyTotalsLastDays,
  filterExpensesInRange,
  monthOverMonthDelta,
  totalsByCategory,
  totalForMonth,
} from './lib/aggregates'
import { formatCurrency } from './lib/currency'
import { useExpenses } from './hooks/useExpenses'
import { buildInsights } from './lib/insights'

function App() {
  const { expenses, addExpense, removeExpense, resetToSample, clearAll } = useExpenses()

  const now = useMemo(() => new Date(), [])
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const thisMonthList = useMemo(
    () => filterExpensesInRange(expenses, monthStart, monthEnd),
    [expenses, monthStart, monthEnd],
  )

  const totalMonth = totalForMonth(expenses, now)
  const deltaPct = monthOverMonthDelta(expenses, now)
  const trendLabel =
    totalMonth === 0
      ? 'No spend recorded this month'
      : deltaPct === 0
        ? 'Flat vs last month'
        : deltaPct > 0
          ? `${deltaPct}% vs last month`
          : `${Math.abs(deltaPct)}% below last month`

  const categoryRows = useMemo(() => {
    const t = totalsByCategory(thisMonthList)
    return EXPENSE_CATEGORIES.map((category) => ({ category, value: t[category] }))
  }, [thisMonthList])

  const trendData = useMemo(() => dailyTotalsLastDays(expenses, 30), [expenses])
  const insights = useMemo(() => buildInsights(expenses, now), [expenses, now])

  return (
    <div className="app-backdrop min-h-dvh">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <aside className="glass-sidebar relative z-10 border-b border-[rgba(255,255,255,0.07)] px-5 py-6 lg:sticky lg:top-0 lg:flex lg:min-h-dvh lg:w-56 lg:flex-col lg:border-b-0 lg:border-r">
          <div className="relative z-[1] flex items-center gap-3">
            <div className="glass-icon-well flex h-10 w-10 items-center justify-center rounded-xl text-lg font-display italic text-[var(--color-accent-bright)]">
              L
            </div>
            <div>
              <p className="font-display text-lg leading-tight text-[var(--color-fg)]">Ledger AI</p>
              <p className="text-xs text-[var(--color-muted)]">Expense intelligence</p>
            </div>
          </div>
          <nav className="relative z-[1] mt-8 flex gap-2 lg:flex-col lg:gap-1" aria-label="Main">
            <a
              href="#dashboard"
              className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm font-medium text-[var(--color-fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md"
            >
              <LayoutDashboard className="h-4 w-4 text-[var(--color-accent-bright)]" strokeWidth={1.75} />
              Dashboard
            </a>
            <span className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--color-muted)] lg:flex">
              <Receipt className="h-4 w-4" strokeWidth={1.75} />
              All data is local
            </span>
          </nav>
          <div className="relative z-[1] mt-auto hidden flex-col gap-2 pt-10 lg:flex">
            <button
              type="button"
              onClick={resetToSample}
              className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-xs font-medium text-[var(--color-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition hover:border-[rgba(255,255,255,0.14)] hover:text-[var(--color-fg)]"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              Reset sample data
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.06)] px-3 py-2 text-xs font-medium text-[var(--color-coral)] backdrop-blur-sm transition hover:bg-[rgba(248,113,113,0.12)]"
            >
              <Trash className="h-3.5 w-3.5" strokeWidth={1.75} />
              Clear ledger
            </button>
          </div>
        </aside>

        <main id="dashboard" className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Overview
              </p>
              <h1 className="mt-1 font-display text-3xl font-normal tracking-tight text-[var(--color-fg)] sm:text-4xl">
                Spending cockpit
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
                A compact, glassmorphic dashboard layout inspired by premium 2025 product surfaces —
                tuned for clarity, contrast, and at-a-glance decisions.
              </p>
            </div>
            <p className="text-sm tabular-nums text-[var(--color-muted)]">
              {format(now, 'EEEE, MMMM d, yyyy')}
            </p>
          </header>

          <QuickAddExpense onAdd={addExpense} />

          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="KPIs">
            <KpiCard
              title="This month"
              value={formatCurrency(totalMonth)}
              hint="Sum of everything dated in the current calendar month."
              icon={Receipt}
              trend={{
                label: trendLabel,
                positive: totalMonth > 0 ? deltaPct <= 0 : undefined,
              }}
            />
            <KpiCard
              title="Transactions"
              value={String(thisMonthList.length)}
              hint="Number of line items this month."
              icon={LayoutDashboard}
            />
            <KpiCard
              title="Last 30 days"
              value={formatCurrency(trendData.reduce((s, d) => s + d.total, 0))}
              hint="Rolling window for the trend chart."
              icon={Receipt}
            />
          </section>

          <section
            className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12"
            aria-label="Charts"
          >
            <div className="xl:col-span-8">
              <SpendingTrend data={trendData} />
            </div>
            <div className="xl:col-span-4">
              <CategoryBreakdown rows={categoryRows} monthLabel={format(now, 'MMMM yyyy')} />
            </div>
          </section>

          <section
            className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12"
            aria-label="Ledger and insights"
          >
            <div className="lg:col-span-7">
              <ExpenseTable items={expenses} onRemove={removeExpense} />
            </div>
            <div className="lg:col-span-5">
              <InsightsPanel insights={insights} />
            </div>
          </section>

          <footer className="mt-10 border-t border-[rgba(255,255,255,0.06)] pt-6 text-center text-xs text-[var(--color-muted)] lg:hidden">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={resetToSample}
                className="glass-inset rounded-lg px-3 py-1.5"
              >
                Reset sample
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="glass-inset rounded-lg border-rose-400/25 px-3 py-1.5 text-[var(--color-coral)]"
              >
                Clear ledger
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
