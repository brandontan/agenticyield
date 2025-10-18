import { type FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import { z } from "zod"

const quoteSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "wallet must be a valid address"),
  amountUSDC: z.string().regex(/^\d+(\.\d+)?$/, "amountUSDC must be a decimal string"),
})

const submitSchema = quoteSchema.extend({
  intentSig: z.string().min(1, "intentSig is required"),
  nonce: z.coerce.number().int().nonnegative(),
  deadline: z.coerce.number().int().positive(),
})

export const relayerRoutes: FastifyPluginAsync = fp(async (app) => {
  app.post("/relayer/quote", async (request, reply) => {
    const validation = quoteSchema.safeParse(request.body)
    if (!validation.success) {
      return reply.code(400).send({
        ok: false,
        reason: "invalid_request",
        issues: validation.error.flatten(),
      })
    }

    const body = validation.data
    app.log.info({ route: "relayer.quote", wallet: body.wallet, amountUSDC: body.amountUSDC }, "quote request received")
    return reply.code(501).send({
      ok: false,
      sponsored: false,
      reason: "not_implemented",
    })
  })

  app.post("/relayer/submit", async (request, reply) => {
    const validation = submitSchema.safeParse(request.body)
    if (!validation.success) {
      return reply.code(400).send({
        ok: false,
        reason: "invalid_request",
        issues: validation.error.flatten(),
      })
    }

    const body = validation.data
    app.log.info(
      { route: "relayer.submit", wallet: body.wallet, amountUSDC: body.amountUSDC, nonce: body.nonce },
      "submit request received"
    )
    return reply.code(501).send({
      ok: false,
      reason: "not_implemented",
    })
  })
})

declare module "fastify" {
  interface FastifyInstance {
    // extend if needed later
  }
}
