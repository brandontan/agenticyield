import { z } from "zod"

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  RELAYER_RPC: z.string().min(1, "RELAYER_RPC is required"),
  RELAYER_PRIVATE_KEY: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "RELAYER_PRIVATE_KEY must be a 0x-prefixed 32-byte key"),
  VAULT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "VAULT_ADDRESS must be a valid address"),
  USDC_BASE: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "USDC_BASE must be a valid address"),
  MAX_SPONSORED_USDC: z.coerce.number().positive(),
  RISK_FLOOR: z.coerce.number().min(0).max(1),
  VENUE_CAP_PCT: z.coerce.number().min(0).max(100),
  SLIPPAGE_MAX_PCT: z.coerce.number().min(0).max(100),
  COOLDOWN_HOURS: z.coerce.number().min(0),
  RATE_LIMIT_PER_IP: z.coerce.number().int().positive(),
  SPONSOR_ON: z.coerce.boolean().default(false),
})

export type Env = z.infer<typeof EnvSchema>

export function loadEnv(overrides: Partial<Record<keyof Env, unknown>> = {}): Env {
  const parsed = EnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    RELAYER_RPC: process.env.RELAYER_RPC,
    RELAYER_PRIVATE_KEY: process.env.RELAYER_PRIVATE_KEY,
    VAULT_ADDRESS: process.env.VAULT_ADDRESS,
    USDC_BASE: process.env.USDC_BASE,
    MAX_SPONSORED_USDC: process.env.MAX_SPONSORED_USDC,
    RISK_FLOOR: process.env.RISK_FLOOR,
    VENUE_CAP_PCT: process.env.VENUE_CAP_PCT,
    SLIPPAGE_MAX_PCT: process.env.SLIPPAGE_MAX_PCT,
    COOLDOWN_HOURS: process.env.COOLDOWN_HOURS,
    RATE_LIMIT_PER_IP: process.env.RATE_LIMIT_PER_IP,
    SPONSOR_ON: process.env.SPONSOR_ON,
    ...overrides,
  })

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
    throw new Error(`Invalid relayer environment configuration: ${details}`)
  }

  return parsed.data
}
