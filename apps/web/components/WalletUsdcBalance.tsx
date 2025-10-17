"use client"

import { useMemo } from "react"
import { useAccount, useBalance, useChainId } from "wagmi"
import { base } from "wagmi/chains"

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"

export default function WalletUsdcBalance() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const isBase = chainId === base.id

  const { data, isFetching } = useBalance({
    address,
    chainId: base.id,
    token: USDC_ADDRESS as `0x${string}`,
    query: {
      enabled: Boolean(address) && isConnected,
      refetchInterval: 30_000,
    },
  })

  const formatted = useMemo(() => {
    if (!data) return "0.00"
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(data.formatted))
  }, [data])

  if (!isConnected || !isBase) {
    return null
  }

  return (
    <span aria-live="polite" className="text-xs text-zinc-300">
      Wallet USDC: {isFetching ? "…" : formatted}
    </span>
  )
}
