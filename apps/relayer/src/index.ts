import { buildServer } from "./server.js"

const port = Number(process.env.PORT ?? 8080)
const host = process.env.HOST ?? "0.0.0.0"

async function start() {
  try {
    const { app } = await buildServer()
    await app.listen({ port, host })
    app.log.info({ port, host }, "Relayer service listening")
  } catch (error) {
    console.error("Failed to start relayer service", error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void start()
}

export default start
