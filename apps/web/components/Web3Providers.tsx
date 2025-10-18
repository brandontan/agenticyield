"use client"

import { ReactNode, useMemo } from "react"
import { WagmiProvider, http, createConfig } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import { walletConnectWallet, coinbaseWallet, metaMaskWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets"
import { base, baseSepolia } from "wagmi/chains"

import { publicEnv } from "@/lib/env"

const transports = {
  [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || base.rpcUrls.default.http[0]),
  [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || baseSepolia.rpcUrls.default.http[0]),
}

const projectId = publicEnv.walletConnectProjectId
const chains = [base, baseSepolia] as const

function buildConnectors(metadataUrl: string) {
  const walletList: Parameters<typeof connectorsForWallets>[0] = [
    {
      groupName: "Recommended",
      wallets: [walletConnectWallet, coinbaseWallet, metaMaskWallet, rainbowWallet],
    },
  ]

  return connectorsForWallets(walletList, {
    projectId,
    appName: "AgenticYield",
    appDescription: "We move your USDC to the place that pays more after costs, with safety checks and clear receipts.",
    appUrl: metadataUrl,
    appIcon: `${metadataUrl}/placeholder-logo.png`,
  })
}

const queryClient = new QueryClient()

interface Web3ProvidersProps {
  children: ReactNode
}

export default function Web3Providers({ children }: Web3ProvidersProps) {
  const metadataUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return publicEnv.appUrl
  }, [])

  const wagmiConfig = useMemo(() => {
    const connectors = buildConnectors(metadataUrl)

    return createConfig({
      connectors,
      chains,
      transports,
      ssr: true,
    })
  }, [metadataUrl])

  const theme = useMemo(
    () =>
      darkTheme({
        accentColor: "#42a5f5",
        accentColorForeground: "#0b1221",
        borderRadius: "medium",
      }),
    []
  )

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={base} theme={theme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
