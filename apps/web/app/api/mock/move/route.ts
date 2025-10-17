import { NextResponse } from "next/server"

export async function POST() {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({ success: true })
}
