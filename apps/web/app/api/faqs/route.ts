import { NextResponse } from "next/server"

const ANSWERS: Record<string, string> = {
  where: "About 55% sits in Aave and 45% in Curve. You can see the split in the allocation donut.",
  safety: "It reflects audits, age, and liquidity stability. Higher scores mean steadier venues.",
  when: "We move only when another pool pays meaningfully more after fees and safety checks.",
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const topic = searchParams.get("topic") ?? ""
  const answer = ANSWERS[topic] ?? "I don’t have an answer for that yet."
  return NextResponse.json({ answer })
}
