import { NextResponse } from "next/server"

const FAQ_RESPONSES: Record<string, string> = {
  where:
    "Your funds are currently split: about 60% sits in Aave and 40% in Curve. You can see the exact split in the donut chart above.",
  safety:
    "Safety score reflects audits, protocol age, and liquidity stability. Your current score of 82 means lower-than-average risk today. We only use audited protocols with proven track records.",
  when: "We move funds only when the difference is 0.5% or more after accounting for gas costs. This ensures every move is worth it and you're not losing money on transaction fees.",
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    // Simple keyword matching for FAQ
    const lowerQ = question.toLowerCase()
    let answer =
      "I'm here to help! Try asking about where your money is, what the safety score means, or when we move funds."

    if (lowerQ.includes("where") || lowerQ.includes("money") || lowerQ.includes("funds")) {
      answer = FAQ_RESPONSES.where
    } else if (lowerQ.includes("safety") || lowerQ.includes("score") || lowerQ.includes("risk")) {
      answer = FAQ_RESPONSES.safety
    } else if (lowerQ.includes("when") || lowerQ.includes("move") || lowerQ.includes("rebalance")) {
      answer = FAQ_RESPONSES.when
    } else if (lowerQ.includes("auto") || lowerQ.includes("manage") || lowerQ.includes("autopilot")) {
      answer =
        "Auto-Manage is your autopilot. It checks every few hours and moves funds only when the difference is worth it. You can turn it off anytime from the toggle in the top bar."
    }

    return NextResponse.json({ answer })
  } catch (error) {
    return NextResponse.json({ answer: "Sorry, something went wrong. Please try again." }, { status: 500 })
  }
}
