"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const FAQS = [
  { label: "💰 Where is my money?", topic: "where", aria: "Where is my money" },
  { label: "🛡️ What’s a safety score?", topic: "safety", aria: "What is a safety score" },
  { label: "⚙️ When do you move funds?", topic: "when", aria: "When do you move funds" },
]

export default function FaqChips() {
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null)

  const handleClick = async (topic: string) => {
    try {
      setLoadingTopic(topic)
      const res = await fetch(`/api/faqs?topic=${topic}`)
      const data = await res.json()
      toast(data.answer, {
        duration: 4000,
        style: {
          background: "#0f172a",
          color: "#e2e8f0",
        },
      })
    } catch (error) {
      toast.error("Couldn’t fetch answer. Try again.")
    } finally {
      setLoadingTopic(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4" aria-label="Frequently asked questions">
      {FAQS.map((faq) => (
        <Button
          key={faq.topic}
          type="button"
          variant="secondary"
          size="sm"
          disabled={loadingTopic === faq.topic}
          onClick={() => handleClick(faq.topic)}
          aria-label={faq.aria}
          className="rounded-full bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700"
        >
          {faq.label}
        </Button>
      ))}
    </div>
  )
}
