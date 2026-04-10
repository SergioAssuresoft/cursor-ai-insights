export const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'health',
  'other',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string
}
