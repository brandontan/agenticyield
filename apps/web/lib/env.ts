import { z } from "zod"

const DEFAULT_APP_URL = "https://v0-agentic-yield-ui.vercel.app"

const PublicEnvSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_ID: z
    .string({ required_error: "NEXT_PUBLIC_WALLETCONNECT_ID must be set" })
    .trim()
    .regex(/^[a-fA-F0-9]{32}$/, "NEXT_PUBLIC_WALLETCONNECT_ID must be 32 hexadecimal characters"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value.replace(/\/$/, "") : undefined)),
})

const rawPublicEnv = {
  NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const

const parsedPublicEnv = PublicEnvSchema.safeParse(rawPublicEnv)

if (!parsedPublicEnv.success) {
  const issues = parsedPublicEnv.error.issues.map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`).join("; ")
  throw new Error(`[env] Invalid public environment configuration: ${issues}`)
}

const publicEnvData = parsedPublicEnv.data

export const publicEnv = {
  walletConnectProjectId: publicEnvData.NEXT_PUBLIC_WALLETCONNECT_ID,
  appUrl: publicEnvData.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL,
} as const

