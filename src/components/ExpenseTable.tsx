import { format, parseISO } from 'date-fns'
import { Trash2 } from 'lucide-react'
import type { Expense } from '../types/expense'
import { CATEGORY_VIS } from '../constants/categories'
import { formatCurrencyDetailed } from '../lib/currency'

interface ExpenseTableProps {
  items: Expense[]
  onRemove: (id: string) => void
}

export function ExpenseTable({ items, onRemove }: ExpenseTableProps) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12)

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6">
      <div className="mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Ledger
        </span>
        <h2 className="mt-1 font-display text-2xl font-normal text-[var(--color-fg)]">
          Recent expenses
        </h2>
      </div>
      <div className="glass-inset overflow-x-auto rounded-xl">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-[var(--color-muted)] backdrop-blur-sm">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="w-12 px-2 py-3" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--color-muted)]">
                  No rows yet — add your first expense.
                </td>
              </tr>
            ) : (
              sorted.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-[rgba(255,255,255,0.05)] last:border-0 transition hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <td className="px-4 py-3 tabular-nums text-[var(--color-muted)]">
                    {format(parseISO(e.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-fg)]">{e.description}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${CATEGORY_VIS[e.category].tailwindRing} bg-[rgba(255,255,255,0.05)] text-[var(--color-fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm`}
                    >
                      {CATEGORY_VIS[e.category].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--color-fg)]">
                    {formatCurrencyDetailed(e.amount)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(e.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:bg-[var(--color-coral)]/15 hover:text-[var(--color-coral)]"
                      aria-label={`Remove ${e.description}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
