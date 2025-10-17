export const dynamic = "force-dynamic"

import TopBar from "@/components/top-bar"
import Cards from "@/components/cards"
import Controls from "@/components/controls"
import RaysLineChart from "@/components/rays-line-chart"
import AllocationAreaChart from "@/components/allocation-area-chart"
import AgentPanelDesktop from "@/components/AgentPanelDesktop"
import MobileAgentPanel from "@/components/MobileAgentPanel"
import CurrentValueCard from "@/components/current-value-card"
import { getMockCurrent } from "@/lib/mock-current"

export default function EarnPage() {
  const currentData = getMockCurrent()

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Text */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">Make your money do more.</h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl text-pretty">
            We move your USDC to the place that pays more after costs, with safety checks and clear receipts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Main Content */}
          <div className="space-y-6">
            {/* 1. Big Balance Card */}
            <CurrentValueCard data={currentData} />

            {/* 2. Summary Cards (Safety + Current Rate) */}
            <Cards />

            {/* 3. Threshold Block */}
            <Controls />

            {/* 4. Charts - Combined into single scroll-free block with divider */}
            <div className="space-y-0 border border-zinc-800 bg-zinc-900 rounded-2xl overflow-hidden">
              <RaysLineChart />
              <div className="border-t border-zinc-800" />
              <AllocationAreaChart />
            </div>
          </div>

          {/* Right rail desktop */}
          <div className="hidden md:block lg:sticky lg:top-24 lg:self-start">
            <AgentPanelDesktop />
          </div>
        </div>
      </div>

      <MobileAgentPanel />
    </div>
  )
}
