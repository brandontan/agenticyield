"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface MoneySplitDonutProps {
  data: {
    AAVE: number
    CURVE: number
    WAITING: number
  }
}

const COLORS = {
  AAVE: "#1E90FF",
  CURVE: "#10B981",
  WAITING: "#9CA3AF",
}

export default function MoneySplitDonut({ data }: MoneySplitDonutProps) {
  const chartData = [
    { name: "Aave", value: data.AAVE, color: COLORS.AAVE },
    { name: "Curve", value: data.CURVE, color: COLORS.CURVE },
    { name: "Waiting", value: data.WAITING, color: COLORS.WAITING },
  ].filter((item) => item.value > 0)

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border rounded-lg p-2 shadow-lg">
                    <p className="text-sm font-medium">{payload[0].name}</p>
                    <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
