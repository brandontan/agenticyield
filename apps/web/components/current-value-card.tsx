"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { useState } from "react"
import PerVenueList from "@/components/per-venue-list"
import type { CurrentResponse } from "@/app/api/metrics/current/route"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface CurrentValueCardProps {
  data: CurrentResponse
}

export default function CurrentValueCard({ data }: CurrentValueCardProps) {
  const [expanded, setExpanded] = useState(true)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getTimeSinceUpdate = (dateString: string) => {
    const now = new Date()
    const then = new Date(dateString)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "just now"
    if (diffMins === 1) return "1 min ago"
    if (diffMins < 60) return `${diffMins} min ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    return `${diffHours} hours ago`
  }

  const sparklineData = Array.from({ length: 7 }, (_, i) => ({
    value: data.total.valueUSDC * (0.98 + Math.random() * 0.04),
  }))

  return (
    <Card className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-zinc-400">Current total</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                  aria-label="Current total information"
                >
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">Breakdown</p>
                  <p>Principal: {formatCurrency(data.total.valueUSDC - data.total.earnedUSDC)} USDC</p>
                  <p className="text-emerald-400">Earnings: +{formatCurrency(data.total.earnedUSDC)} USDC</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-300 border-zinc-700">
          Updated {getTimeSinceUpdate(data.asOf)}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <p className="text-4xl font-bold text-white">{formatCurrency(data.total.valueUSDC)} USDC</p>
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-sm text-emerald-400 font-medium">
        +{formatCurrency(data.total.earnedUSDC)} USDC earned since {formatDate(data.total.since)}
      </p>
      <p className="text-xs text-zinc-500 leading-relaxed mt-2">This includes your deposits and earnings so far.</p>

      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">How it works</h4>
            <p className="text-sm text-zinc-400 leading-snug">
              The autopilot checks rates every few hours and moves your funds automatically when it finds a better
              return — after fees and safety checks.
            </p>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="pt-4 border-t border-zinc-800 mt-4">
          <PerVenueList venues={data.venues} />
        </div>
      )}
    </Card>
  )
}
