import { NextResponse } from "next/server"
import { SAFETY_POLICY } from "@/lib/safety"

export async function GET() {
  return NextResponse.json({
    riskFloor: SAFETY_POLICY.RISK_FLOOR,
    venueCapPct: SAFETY_POLICY.VENUE_CAP_PCT,
    slippageMaxPct: SAFETY_POLICY.SLIPPAGE_MAX_PCT,
    cooldownHours: SAFETY_POLICY.COOLDOWN_HOURS,
  })
}
