export type GateInput = {
  riskScore: number // 0..1 for target venue
  toPctAfterMove: number // % of vault going to target after move
  lastMoveAt?: string // ISO time of last execution
  estSlippagePct: number // from simulation/quote
  estGasUSD: number // for logs only
}

export type GateResult = {
  ok: boolean
  reason?: string
  code?: "RISK" | "CAP" | "COOLDOWN" | "SLIPPAGE"
}

// Hard-coded safety defaults
export const SAFETY_POLICY = {
  RISK_FLOOR: 0.6, // 0-1 scale
  VENUE_CAP_PCT: 50, // max % of funds per venue
  SLIPPAGE_MAX_PCT: 0.3,
  COOLDOWN_HOURS: 6,
}

export function canMove(input: GateInput): GateResult {
  // Check risk score
  if (input.riskScore < SAFETY_POLICY.RISK_FLOOR) {
    const scoreDisplay = Math.round(input.riskScore * 100)
    return {
      ok: false,
      code: "RISK",
      reason: `Safety too low (${scoreDisplay}/100)`,
    }
  }

  // Check venue cap
  if (input.toPctAfterMove > SAFETY_POLICY.VENUE_CAP_PCT) {
    return {
      ok: false,
      code: "CAP",
      reason: "Venue cap exceeded (50%)",
    }
  }

  // Check slippage
  if (input.estSlippagePct > SAFETY_POLICY.SLIPPAGE_MAX_PCT) {
    return {
      ok: false,
      code: "SLIPPAGE",
      reason: `Price impact too high (${input.estSlippagePct.toFixed(2)}%)`,
    }
  }

  // Check cooldown
  if (input.lastMoveAt) {
    const lastMoveTime = new Date(input.lastMoveAt).getTime()
    const cooldownMs = SAFETY_POLICY.COOLDOWN_HOURS * 3600 * 1000
    const timeSinceLastMove = Date.now() - lastMoveTime

    if (timeSinceLastMove < cooldownMs) {
      const hoursRemaining = Math.ceil((cooldownMs - timeSinceLastMove) / (3600 * 1000))
      return {
        ok: false,
        code: "COOLDOWN",
        reason: `Cooldown active (${hoursRemaining}h remaining)`,
      }
    }
  }

  return { ok: true }
}
