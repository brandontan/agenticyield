"use client"

import { useState, useCallback } from "react"
import type { ExplainerData } from "@/lib/types"
import MoveCard from "@/components/MoveCard"
import Drawer from "@/components/Drawer"
import FaqChips from "@/components/FaqChips"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface RightRailProps {
  data: ExplainerData
  showAll?: boolean
}

export default function RightRail({ data, showAll = false }: RightRailProps) {
  const [open, setOpen] = useState(false)
  const latest = data.latest
  const rest = data.recent ?? []

  const closeDrawer = useCallback(() => setOpen(false), [])

  if (showAll) {
    return (
      <div className="space-y-3">
        <MoveCard entry={latest} variant="full" />
        {rest.map((item, idx) => (
          <MoveCard key={idx} entry={item} variant="full" />
        ))}
        <FaqChips />
      </div>
    )
  }

  return (
    <aside className="md:sticky md:top-24 space-y-4">
      <section className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl shadow-sm">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white" id="latest-move-title">
              Latest move
            </h2>
          </div>
        </header>

        <MoveCard entry={latest} variant="full" />

        {rest.slice(0, 2).map((item, idx) => (
          <MoveCard key={idx} entry={item} variant="compact" />
        ))}

        <FaqChips />

        {rest.length > 2 && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-primary hover:text-primary/80 hover:bg-zinc-800"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-controls="moves-drawer"
          >
            See all moves →
          </Button>
        )}
      </section>

      <Drawer id="moves-drawer" title="Move history" open={open} onOpenChange={setOpen} onCloseComplete={closeDrawer}>
        <RightRail data={data} showAll />
      </Drawer>
    </aside>
  )
}
