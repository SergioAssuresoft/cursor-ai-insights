import { useCallback, useEffect, useState } from 'react'
import type { Expense, ExpenseCategory } from '../types/expense'
import { seedExpenses } from '../lib/seed'

const STORAGE_KEY = 'ledger-ai-expenses-v1'

function loadFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Expense[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore */
  }
  const seed = seedExpenses()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const addExpense = useCallback(
    (input: {
      amount: number
      category: ExpenseCategory
      description: string
      date: string
    }) => {
      const row: Expense = {
        id: crypto.randomUUID(),
        amount: input.amount,
        category: input.category,
        description: input.description.trim() || 'Expense',
        date: input.date,
      }
      setExpenses((prev) => [row, ...prev])
    },
    [],
  )

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const resetToSample = useCallback(() => {
    const seed = seedExpenses()
    setExpenses(seed)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  }, [])

  const clearAll = useCallback(() => {
    setExpenses([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }, [])

  return {
    expenses,
    addExpense,
    removeExpense,
    resetToSample,
    clearAll,
  }
}
