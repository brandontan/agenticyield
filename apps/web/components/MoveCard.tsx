"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "@/lib/format"
import type { ExplainerEntry } from "@/lib/types"

interface MoveCardProps {
  entry: ExplainerEntry
  variant?: "full" | "compact"
}

export default function MoveCard({ entry, variant = "full" }: MoveCardProps) {
  const isBlocked = entry.type === "blocked"

  return (
    <article
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm transition",
        variant === "full" ? "p-4" : "p-3"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-white leading-snug text-sm md:text-base">{entry.title}</h3>
        {entry.upliftPct && !isBlocked ? (
          <Badge className="bg-emerald-900/40 text-emerald-300 border-emerald-800 shrink-0">
            +{entry.upliftPct}%
          </Badge>
        ) : null}
      </div>

      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{entry.reason}</p>

      <footer className="flex items-center justify-between mt-3 text-xs text-zinc-500">
        <span>{formatDistanceToNow(entry.at)}</span>
        {entry.txUrl && !isBlocked ? (
          <a
            href={entry.txUrl}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View tx →
          </a>
        ) : null}
      </footer>
    </article>
  )
}
