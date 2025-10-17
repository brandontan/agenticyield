import type { CurrentResponse } from "@/app/api/metrics/current/route"

export function getMockCurrent(): CurrentResponse {
  return {
    asOf: new Date().toISOString(),
    total: {
      valueUSDC: 1100,
      earnedUSDC: 22,
      since: "2025-10-01",
    },
    venues: [
      {
        name: "Aave",
        valueUSDC: 550,
        earnedUSDC: 10,
        apyPct: 4.2,
        sharePct: 50,
      },
      {
        name: "Curve",
        valueUSDC: 550,
        earnedUSDC: 12,
        apyPct: 5.4,
        sharePct: 50,
      },
    ],
  }
}
