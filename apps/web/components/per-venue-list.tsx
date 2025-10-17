import type { CurrentResponse } from "@/app/api/metrics/current/route"

interface PerVenueListProps {
  venues: CurrentResponse["venues"]
}

export default function PerVenueList({ venues }: PerVenueListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {venues.map((venue) => (
        <div key={venue.name} className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-white text-base">{venue.name}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-zinc-400">{formatCurrency(venue.valueUSDC)} USDC</span>
              <button
                className="text-zinc-500 hover:text-zinc-400 transition-colors"
                title={`Live rate after fees: ${venue.apyPct}%`}
                aria-label={`${venue.name} live rate: ${venue.apyPct}%`}
              >
                <span className="text-xs">({venue.apyPct}% live)</span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-emerald-400">+{formatCurrency(venue.earnedUSDC)} USDC</div>
          </div>
        </div>
      ))}
    </div>
  )
}
