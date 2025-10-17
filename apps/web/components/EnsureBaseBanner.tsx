"use client"

import { base } from "wagmi/chains"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"

export default function EnsureBaseBanner() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { chains, switchChain, isPending } = useSwitchChain()

  if (!isConnected) return null
  if (chainId === base.id) return null

  const targetChain = chains.find((chain) => chain.id === base.id)

  if (!targetChain) return null

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-sm text-amber-100">
      <span>
        You’re on the wrong network. Switch to <strong className="font-semibold">Base</strong> to keep the autopilot
        active.
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => switchChain({ chainId: targetChain.id })}
        disabled={isPending}
        className="border-amber-400 text-amber-100 hover:bg-amber-500/20"
      >
        {isPending ? "Switching…" : "Switch to Base"}
      </Button>
    </div>
  )
}
