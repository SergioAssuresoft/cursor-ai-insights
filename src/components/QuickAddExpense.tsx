import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '../types/expense'
import { CATEGORY_VIS } from '../constants/categories'

interface QuickAddExpenseProps {
  onAdd: (input: {
    amount: number
    category: ExpenseCategory
    description: string
    date: string
  }) => void
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function QuickAddExpense({ onAdd }: QuickAddExpenseProps) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('food')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayIso)

  function submit(e: FormEvent) {
    e.preventDefault()
    const n = Number.parseFloat(amount.replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) return
    onAdd({
      amount: Math.round(n * 100) / 100,
      category,
      description,
      date,
    })
    setAmount('')
    setDescription('')
    setDate(todayIso())
  }

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="glass-icon-well flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-accent-bright)]">
          <Plus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <h2 className="font-display text-xl font-normal text-[var(--color-fg)]">Quick add</h2>
          <p className="text-xs text-[var(--color-muted)]">Saved locally in your browser</p>
        </div>
      </div>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium text-[var(--color-muted)]">Description</span>
          <input
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="e.g. Groceries"
            className="glass-input rounded-xl px-3 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)]/70"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[var(--color-muted)]">Amount</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
            placeholder="0.00"
            className="glass-input rounded-xl px-3 py-2.5 text-sm text-[var(--color-fg)] tabular-nums placeholder:text-[var(--color-muted)]/70"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[var(--color-muted)]">Date</span>
          <input
            type="date"
            value={date}
            onChange={(ev) => setDate(ev.target.value)}
            className="glass-input rounded-xl px-3 py-2.5 text-sm text-[var(--color-fg)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium text-[var(--color-muted)]">Category</span>
          <select
            value={category}
            onChange={(ev) => setCategory(ev.target.value as ExpenseCategory)}
            className="glass-input rounded-xl px-3 py-2.5 text-sm text-[var(--color-fg)]"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_VIS[c].label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-2">
          <button
            type="submit"
            className="glass-button-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
          >
            Add expense
          </button>
        </div>
      </form>
    </div>
  )
}
