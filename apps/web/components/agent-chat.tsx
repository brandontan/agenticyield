"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles } from "lucide-react"
import type { ExplainerData } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/format"

type Message = {
  role: "user" | "agent"
  text: string
}

const FAQ_CHIPS = [
  { q: "💰 Where is my money?", topic: "where" },
  { q: "🛡️ What's a safety score?", topic: "safety" },
  { q: "⚙️ When do you move funds?", topic: "when" },
]

export default function AgentChat() {
  const [data, setData] = useState<ExplainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (intervalRef.current) return

    const fetchData = async () => {
      try {
        const res = await fetch("/api/mock/explainer")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch explainer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    intervalRef.current = setInterval(fetchData, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const handleFAQ = async (topic: string) => {
    setSending(true)
    try {
      const res = await fetch(`/api/faqs?topic=${topic}`)
      const data = await res.json()

      const agentMsg: Message = { role: "agent", text: data.answer }
      setMessages([agentMsg])
    } catch (error) {
      const errorMsg: Message = {
        role: "agent",
        text: "Sorry, I couldn't process that. Please try again.",
      }
      setMessages([errorMsg])
    } finally {
      setSending(false)
    }
  }

  const handleSend = async () => {
    const q = input.trim()
    if (!q) return

    setSending(true)
    setInput("")

    const userMsg: Message = { role: "user", text: q }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()

      const agentMsg: Message = { role: "agent", text: data.answer }
      setMessages((prev) => [...prev, agentMsg])
    } catch (error) {
      const errorMsg: Message = {
        role: "agent",
        text: "Sorry, I couldn't process that. Please try again.",
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-20 w-full mb-3" />
        <Skeleton className="h-16 w-full" />
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-white">Latest move</h2>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div
          className={`rounded-2xl p-4 border shadow-sm ${
            data.latest.type === "blocked" ? "bg-amber-900/20 border-amber-800/50" : "bg-zinc-800/50 border-zinc-700"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-white leading-relaxed">{data.latest.title}</h3>
            {data.latest.upliftPct && (
              <Badge className="bg-emerald-900/40 text-emerald-300 border-emerald-800 shrink-0">
                +{data.latest.upliftPct}%
              </Badge>
            )}
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed mb-2">{data.latest.reason}</p>

          {data.latest.type !== "blocked" && (
            <p className="text-sm text-zinc-500 leading-relaxed mb-3 italic">
              Your autopilot found a higher net return and shifted funds automatically.
            </p>
          )}

          <div className="flex items-center justify-between">
            {data.latest.txUrl && (
              <a
                href={data.latest.txUrl}
                className="text-xs text-primary hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                View transaction →
              </a>
            )}
            <span className="text-xs text-zinc-500 ml-auto">{formatDistanceToNow(data.latest.at)}</span>
          </div>
        </div>

        {data.recent && data.recent.length > 0 && (
          <div className="space-y-2">
            {data.recent.slice(0, showHistory ? undefined : 3).map((item, idx) => (
              <div
                key={idx}
                className={`border-l-2 pl-3 py-2 ${
                  item.type === "blocked" ? "border-amber-500/50" : "border-primary/30"
                }`}
              >
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.reason}</p>
                <span className="text-xs text-zinc-600">{formatDistanceToNow(item.at)}</span>
              </div>
            ))}
          </div>
        )}

        {data.recent && data.recent.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-primary hover:text-primary/80 hover:bg-zinc-800 w-full"
          >
            {showHistory ? "Hide history" : "View full history →"}
          </Button>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {FAQ_CHIPS.map((faq) => (
            <Button
              key={faq.topic}
              variant="outline"
              size="default"
              onClick={() => handleFAQ(faq.topic)}
              className="text-sm h-10 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              disabled={sending}
            >
              {faq.q}
            </Button>
          ))}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2 ${
                  msg.role === "user" ? "bg-primary text-white" : "bg-zinc-800 text-zinc-200 border border-zinc-700"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 rounded-xl px-4 py-2 border border-zinc-700">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask how it works or what happened…"
          className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          disabled={sending}
        />
        <Button onClick={handleSend} disabled={!input.trim() || sending} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
