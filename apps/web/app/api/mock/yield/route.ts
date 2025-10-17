import { NextResponse } from "next/server"
import type { YieldData } from "@/lib/types"

export async function GET() {
  // Generate 30 days of mock data
  const now = new Date()
  const raysSeries = []
  const allocationSeries = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString()

    // AAVE data point
    raysSeries.push({
      t: dateStr,
      venue: "AAVE" as const,
      interestPct: 4.0 + Math.random() * 0.8,
      safetyDiscountPct: 0.5 + Math.random() * 0.3,
      moveCostPct: 0.1,
      netPct: 3.3 + Math.random() * 0.6,
    })

    // CURVE data point
    raysSeries.push({
      t: dateStr,
      venue: "CURVE" as const,
      interestPct: 4.6 + Math.random() * 0.7,
      safetyDiscountPct: 0.3 + Math.random() * 0.3,
      moveCostPct: 0.1,
      netPct: 4.1 + Math.random() * 0.5,
    })

    // Allocation shifts over time
    const progress = i / 29
    allocationSeries.push({
      t: dateStr,
      AAVE: Math.round(100 - progress * 45),
      CURVE: Math.round(progress * 45),
      WAITING: 0,
    })
  }

  const data: YieldData = {
    asOf: now.toISOString(),
    netInterestPct: 4.8,
    safetyScore: 82,
    splitPct: {
      AAVE: 55,
      CURVE: 45,
      WAITING: 0,
    },
    savingsMonthPct: 0.32,
    raysSeries,
    allocationSeries,
  }

  return NextResponse.json(data)
}
