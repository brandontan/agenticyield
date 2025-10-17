"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { YieldData } from "@/lib/types"

export default function RaysLineChart() {
  const [data, setData] = useState<YieldData | null>(null)
  const [loading, setLoading] = useState(true)
  const [visibleLines, setVisibleLines] = useState({ AAVE: true, CURVE: true })

  useEffect(() => {
    fetch("/api/mock/yield")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!data) return null

  const toggleLine = (venue: "AAVE" | "CURVE") => {
    setVisibleLines((prev) => ({ ...prev, [venue]: !prev[venue] }))
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Your rate over time (30 days)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.raysSeries}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} />
          <XAxis
            dataKey="t"
            stroke="#71717a"
            fontSize={14}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short" })}
          />
          <YAxis
            stroke="#71717a"
            fontSize={14}
            label={{ value: "Rate (%)", angle: -90, position: "insideLeft", style: { fill: "#71717a", fontSize: 14 } }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold mb-2 text-white">{data.venue}</p>
                    <div className="space-y-1 text-xs text-zinc-400">
                      <p>
                        {data.venue} {data.interestPct}%
                      </p>
                      <p className="font-semibold text-primary pt-1 border-t border-zinc-800">
                        Net = Interest – Safety – Costs
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            content={() => (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => toggleLine("AAVE")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    visibleLines.AAVE ? "bg-primary/10" : "bg-zinc-800"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-zinc-300">Aave</span>
                </button>
                <button
                  onClick={() => toggleLine("CURVE")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    visibleLines.CURVE ? "bg-success/10" : "bg-zinc-800"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm font-medium text-zinc-300">Curve</span>
                </button>
              </div>
            )}
          />
          {visibleLines.AAVE && (
            <Line
              type="monotoneX"
              dataKey="netPct"
              data={data.raysSeries.filter((d) => d.venue === "AAVE")}
              stroke="#1E90FF"
              strokeWidth={2}
              dot={false}
              name="Aave"
            />
          )}
          {visibleLines.CURVE && (
            <Line
              type="monotoneX"
              dataKey="netPct"
              data={data.raysSeries.filter((d) => d.venue === "CURVE")}
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Curve"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
