import { describe, expect, it } from "vitest"
import { buildServer } from "../src/server.js"

describe("relayer routes", () => {
  it("returns 501 for quote while unimplemented", async () => {
    const { app } = await buildServer()

    const response = await app.inject({
      method: "POST",
      url: "/relayer/quote",
      payload: {
        wallet: "0x000000000000000000000000000000000000dead",
        amountUSDC: "100",
      },
    })

    expect(response.statusCode).toBe(501)
    expect(response.json()).toMatchObject({ ok: false, reason: "not_implemented" })
  })

  it("returns validation error for invalid payload", async () => {
    const { app } = await buildServer()

    const response = await app.inject({
      method: "POST",
      url: "/relayer/submit",
      payload: {
        wallet: "not-an-address",
        amountUSDC: "-10",
        intentSig: "",
        nonce: -1,
        deadline: 0,
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toMatchObject({ reason: "invalid_request" })
  })
})
