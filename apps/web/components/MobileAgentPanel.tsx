"use client"

import { useEffect, useState } from "react"
import type { ExplainerData } from "@/lib/types"
import Drawer from "@/components/Drawer"
import RightRail from "@/components/RightRail"
import AgentChat from "@/components/agent-chat"
import { Skeleton } from "@/components/ui/skeleton"

export default function MobileAgentPanel() {
  const [data, setData] = useState<ExplainerData | null>(null)
  const [open, setOpen] = useState(false)
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

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
      <button
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-left shadow-lg"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <p className="text-sm font-semibold text-white">Latest move</p>
        <p className="text-xs text-zinc-400">Tap to see why the agent moved funds and history</p>
      </button>

      <Drawer id="mobile-agent-drawer" title="Agent activity" open={open} onOpenChange={setOpen} className="md:hidden">
        {loading ? (
          <div className="p-3 space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : data ? (
          <RightRail data={data} showAll />
        ) : (
          <AgentChat />
        )}
      </Drawer>
    </div>
  )
}
