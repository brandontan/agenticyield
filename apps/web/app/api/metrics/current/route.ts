import { NextResponse } from "next/server"
import { getMockCurrent } from "@/lib/mock-current"

export type CurrentResponse = {
  asOf: string
  total: { valueUSDC: number; earnedUSDC: number; since: string }
  venues: {
    name: "Aave" | "Curve"
    valueUSDC: number
    earnedUSDC: number
    apyPct: number
    sharePct: number
  }[]
}

export async function GET() {
  return NextResponse.json(getMockCurrent())
}
