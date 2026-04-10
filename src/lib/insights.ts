import { subMonths } from 'date-fns'
import type { Expense, ExpenseCategory } from '../types/expense'
import {
  filterExpensesInRange,
  monthOverMonthDelta,
  totalsByCategory,
  totalForMonth,
} from './aggregates'

export type InsightTone = 'positive' | 'neutral' | 'watch'

export interface Insight {
  id: string
  title: string
  body: string
  tone: InsightTone
}

const CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  food: 'Food & dining',
  transport: 'Transport',
  housing: 'Housing',
  entertainment: 'Entertainment',
  health: 'Health',
  other: 'Other',
}

function topCategoryShare(expenses: Expense[]): {
  category: ExpenseCategory
  share: number
  total: number
} | null {
  if (expenses.length === 0) return null
  const totals = totalsByCategory(expenses)
  const sum = Object.values(totals).reduce((a, b) => a + b, 0)
  if (sum === 0) return null
  let best: ExpenseCategory = 'other'
  let max = 0
  for (const c of Object.keys(totals) as ExpenseCategory[]) {
    if (totals[c] > max) {
      max = totals[c]
      best = c
    }
  }
  return { category: best, share: Math.round((max / sum) * 100), total: max }
}

/** Rule-based “AI-style” insights from your ledger — swap for an LLM API when ready. */
export function buildInsights(expenses: Expense[], now = new Date()): Insight[] {
  const insights: Insight[] = []
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const thisMonth = filterExpensesInRange(expenses, monthStart, monthEnd)
  const total = thisMonth.reduce((s, e) => s + e.amount, 0)
  const delta = monthOverMonthDelta(expenses, now)

  if (expenses.length === 0) {
    insights.push({
      id: 'empty',
      title: 'Start your ledger',
      body: 'Add a few expenses to unlock trends, category mix, and personalized tips based on your real spending.',
      tone: 'neutral',
    })
    return insights
  }

  if (delta > 15 && total > 0) {
    insights.push({
      id: 'mom-up',
      title: 'Spending pace is up',
      body: `This month is about ${delta}% higher than last month. Review your top category and set a soft weekly cap to rebalance.`,
      tone: 'watch',
    })
  } else if (delta < -10 && total > 0) {
    insights.push({
      id: 'mom-down',
      title: 'Nice — you are trending lower',
      body: `You are roughly ${Math.abs(delta)}% under last month. Consider moving the difference toward savings or a goal.`,
      tone: 'positive',
    })
  }

  const top = topCategoryShare(thisMonth)
  if (top && top.share >= 42) {
    insights.push({
      id: 'concentration',
      title: `${CATEGORY_LABEL[top.category]} dominates`,
      body: `About ${top.share}% of this month’s spend is in ${CATEGORY_LABEL[top.category].toLowerCase()}. Diversifying or capping that bucket often stabilizes cash flow.`,
      tone: 'watch',
    })
  }

  const healthTotal = totalsByCategory(thisMonth).health
  if (total > 500 && healthTotal / total < 0.05) {
    insights.push({
      id: 'health',
      title: 'Health bucket is light',
      body: 'Preventive care and fitness often get deferred. Even a small recurring health budget reduces surprise costs later.',
      tone: 'neutral',
    })
  }

  const lastMonthTotal = totalForMonth(expenses, subMonths(now, 1))
  if (lastMonthTotal > 0 && total > 0) {
    const pace = total / now.getDate()
    const projected = pace * new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    if (projected > lastMonthTotal * 1.12) {
      insights.push({
        id: 'projection',
        title: 'Projection check',
        body: `At today’s pace, the month may finish around ${Math.round(projected / lastMonthTotal * 100 - 100)}% above last month. Trim discretionary tags mid-month if that matters for you.`,
        tone: 'watch',
      })
    }
  }

  if (insights.length < 3) {
    insights.push({
      id: 'habit',
      title: 'Micro-habit',
      body: 'Review subscriptions weekly in one pass — batching decisions cuts “silent” recurring spend more than chasing single small purchases.',
      tone: 'neutral',
    })
  }

  return insights.slice(0, 5)
}
