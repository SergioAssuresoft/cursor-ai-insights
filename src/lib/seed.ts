import { subDays, format } from 'date-fns'
import type { Expense } from '../types/expense'

function nid() {
  return crypto.randomUUID()
}

function day(daysAgo: number) {
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
}

/** Starter ledger so first load feels like a real dashboard. */
export function seedExpenses(): Expense[] {
  return [
    {
      id: nid(),
      amount: 1240,
      category: 'housing',
      description: 'Rent / mortgage share',
      date: day(2),
    },
    {
      id: nid(),
      amount: 86,
      category: 'food',
      description: 'Groceries',
      date: day(4),
    },
    {
      id: nid(),
      amount: 42,
      category: 'transport',
      description: 'Transit pass',
      date: day(5),
    },
    {
      id: nid(),
      amount: 64,
      category: 'entertainment',
      description: 'Streaming & games',
      date: day(7),
    },
    {
      id: nid(),
      amount: 118,
      category: 'food',
      description: 'Dinner out',
      date: day(9),
    },
    {
      id: nid(),
      amount: 35,
      category: 'health',
      description: 'Pharmacy',
      date: day(10),
    },
    {
      id: nid(),
      amount: 72,
      category: 'food',
      description: 'Groceries',
      date: day(12),
    },
    {
      id: nid(),
      amount: 28,
      category: 'other',
      description: 'Household',
      date: day(14),
    },
    {
      id: nid(),
      amount: 95,
      category: 'transport',
      description: 'Rides',
      date: day(28),
    },
    {
      id: nid(),
      amount: 210,
      category: 'food',
      description: 'Groceries',
      date: day(40),
    },
    {
      id: nid(),
      amount: 55,
      category: 'entertainment',
      description: 'Concert tickets',
      date: day(52),
    },
  ]
}
