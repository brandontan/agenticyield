"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { YieldData } from "@/lib/types"

export default function AllocationAreaChart() {
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
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Where your money sat (30 days)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.allocationSeries}>
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
            label={{
              value: "Allocation (%)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#71717a", fontSize: 14 },
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-lg">
                    <div className="space-y-1 text-xs">
                      {payload.reverse().map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-zinc-300">{entry.name}</span>
                          </div>
                          <span className="font-semibold text-white">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="AAVE"
            stackId="1"
            stroke="#1E90FF"
            fill="#1E90FF"
            fillOpacity={0.6}
            name="Aave"
          />
          <Area
            type="monotone"
            dataKey="CURVE"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Curve"
          />
          <Area
            type="monotone"
            dataKey="WAITING"
            stackId="1"
            stroke="#9CA3AF"
            fill="#9CA3AF"
            fillOpacity={0.6}
            name="Waiting"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
