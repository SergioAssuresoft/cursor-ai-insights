import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'
import type { Expense, ExpenseCategory } from '../types/expense'

export function filterExpensesInRange(
  expenses: Expense[],
  start: Date,
  end: Date,
): Expense[] {
  return expenses.filter((e) => {
    const d = new Date(e.date)
    return isWithinInterval(d, { start, end })
  })
}

export function totalForMonth(expenses: Expense[], ref: Date): number {
  const start = startOfMonth(ref)
  const end = endOfMonth(ref)
  return filterExpensesInRange(expenses, start, end).reduce((s, e) => s + e.amount, 0)
}

export function totalsByCategory(expenses: Expense[]): Record<ExpenseCategory, number> {
  const base: Record<ExpenseCategory, number> = {
    food: 0,
    transport: 0,
    housing: 0,
    entertainment: 0,
    health: 0,
    other: 0,
  }
  for (const e of expenses) {
    base[e.category] += e.amount
  }
  return base
}

export function dailyTotalsLastDays(expenses: Expense[], days: number) {
  const end = new Date()
  const start = subDays(end, days - 1)
  const daysList = eachDayOfInterval({ start, end })
  const map = new Map<string, number>()
  for (const d of daysList) {
    map.set(format(d, 'yyyy-MM-dd'), 0)
  }
  for (const e of expenses) {
    const key = e.date.slice(0, 10)
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + e.amount)
    }
  }
  return daysList.map((d) => ({
    label: format(d, 'MMM d'),
    short: format(d, 'd'),
    total: map.get(format(d, 'yyyy-MM-dd')) ?? 0,
  }))
}

export function monthOverMonthDelta(expenses: Expense[], ref: Date): number {
  const current = totalForMonth(expenses, ref)
  const prev = totalForMonth(expenses, subMonths(ref, 1))
  if (prev === 0) return current > 0 ? 100 : 0
  return Math.round(((current - prev) / prev) * 100)
}
