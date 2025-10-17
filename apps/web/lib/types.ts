export interface YieldData {
  asOf: string
  netInterestPct: number
  safetyScore: number
  splitPct: {
    AAVE: number
    CURVE: number
    WAITING: number
  }
  savingsMonthPct: number
  raysSeries: RayDataPoint[]
  allocationSeries: AllocationDataPoint[]
}

export interface RayDataPoint {
  t: string
  venue: "AAVE" | "CURVE"
  interestPct: number
  safetyDiscountPct: number
  moveCostPct: number
  netPct: number
}

export interface AllocationDataPoint {
  t: string
  AAVE: number
  CURVE: number
  WAITING: number
}

export interface ExplainerData {
  latest: {
    type?: "moved" | "blocked" // Added type to distinguish move types
    title: string
    reason: string
    upliftPct?: number
    txUrl?: string // Made optional since blocked moves don't have tx
    at: string
  }
  recent: ExplainerEntry[]
}

export interface ExplainerEntry {
  type?: "moved" | "blocked"
  title: string
  reason: string
  upliftPct?: number
  txUrl?: string
  at: string
}
