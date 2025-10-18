import Fastify from "fastify"
import { loadEnv } from "./env.js"
import { relayerRoutes } from "./routes/relayer.js"

export async function buildServer() {
  const env = loadEnv()

  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
      level: env.NODE_ENV === "development" ? "debug" : "info",
    },
  })

  await app.register(relayerRoutes)

  app.get("/healthz", async () => ({ ok: true }))

  return { app, env }
}
