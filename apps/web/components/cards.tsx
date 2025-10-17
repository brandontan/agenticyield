"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { YieldData } from "@/lib/types"

export default function Cards() {
  const [data, setData] = useState<YieldData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/mock/yield")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive/20 rounded-2xl">
        <p className="text-destructive font-medium">Couldn&#39;t load data. Try again.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Safety Score - Added tooltip with explanation */}
      <Card className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl shadow-sm hover:border-zinc-700 transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-zinc-400">Safety</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                  aria-label="Safety score information"
                >
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 border-zinc-700 text-white max-w-xs">
                <p className="text-sm">Based on audits, liquidity, and protocol age.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{data.safetyScore}</span>
          <span className="text-lg text-zinc-500">/ 100</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">steady</p>
      </Card>

      {/* Your current rate (after fees) */}
      <Card className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl shadow-sm hover:border-zinc-700 transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-zinc-400">Your current rate</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                  aria-label="Current rate information"
                >
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 border-zinc-700 text-white max-w-xs">
                <p className="text-sm">Interest earned after all fees</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-3xl font-bold text-white">{data.netInterestPct}%</p>
        <p className="text-xs text-zinc-500 mt-2">after fees</p>
      </Card>
    </div>
  )
}
