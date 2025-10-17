"use client"

import { useEffect, useState } from "react"
import type { ExplainerData } from "@/lib/types"
import RightRail from "@/components/RightRail"
import AgentChat from "@/components/agent-chat"
import { Skeleton } from "@/components/ui/skeleton"

export default function AgentPanelDesktop() {
  const [data, setData] = useState<ExplainerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/mock/explainer")
        const json: ExplainerData = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch explainer data", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl shadow-sm">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-20 w-full mb-3" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (!data) return <AgentChat />
  return <RightRail data={data} />
}
