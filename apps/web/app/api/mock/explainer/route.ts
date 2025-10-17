import { NextResponse } from "next/server"
import type { ExplainerData } from "@/lib/types"

export async function GET() {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const data: ExplainerData = {
    latest: {
      type: "moved",
      title: "We moved 40% from Aave to Curve",
      reason: "Curve paid 0.8% more after costs and looked safer today.",
      upliftPct: 0.8,
      txUrl: "#",
      at: now.toISOString(),
    },
    recent: [
      {
        type: "blocked",
        title: "Move skipped — safety check",
        reason: "Safety too low (59/100). We'll recheck later.",
        at: yesterday.toISOString(),
      },
      {
        type: "moved",
        title: "We moved 20% from Curve to Aave",
        reason: "Aave safety score improved significantly.",
        at: new Date(now.getTime() - 2 * 86400000).toISOString(),
      },
      {
        type: "blocked",
        title: "Move skipped — cooldown",
        reason: "Cooldown active (2h remaining). We'll recheck later.",
        at: new Date(now.getTime() - 3 * 86400000).toISOString(),
      },
    ],
  }

  return NextResponse.json(data)
}
