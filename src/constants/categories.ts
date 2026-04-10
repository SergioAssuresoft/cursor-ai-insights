import type { ExpenseCategory } from '../types/expense'

export const CATEGORY_VIS: Record<
  ExpenseCategory,
  { label: string; color: string; tailwindRing: string }
> = {
  food: { label: 'Food', color: '#2dd4bf', tailwindRing: 'ring-teal-400/30' },
  transport: { label: 'Transport', color: '#a78bfa', tailwindRing: 'ring-violet-400/30' },
  housing: { label: 'Housing', color: '#fb7185', tailwindRing: 'ring-rose-400/30' },
  entertainment: { label: 'Fun', color: '#38bdf8', tailwindRing: 'ring-sky-400/30' },
  health: { label: 'Health', color: '#fbbf24', tailwindRing: 'ring-amber-400/30' },
  other: { label: 'Other', color: '#94a3b8', tailwindRing: 'ring-slate-400/30' },
}
