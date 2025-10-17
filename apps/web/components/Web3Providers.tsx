"use client"

import { ReactNode, useMemo } from "react"
import { WagmiProvider, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { base, baseSepolia } from "wagmi/chains"

const walletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID ?? "8cda37f721a07c70116a85ae9be325bf"

const transports = {
  [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || base.rpcUrls.default.http[0]),
  [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || baseSepolia.rpcUrls.default.http[0]),
}

const wagmiConfig = getDefaultConfig({
  appName: "AgenticYield",
  projectId: walletConnectId || "demo",
  chains: [base, baseSepolia],
  transports,
  ssr: true,
})

const queryClient = new QueryClient()

interface Web3ProvidersProps {
  children: ReactNode
}

export default function Web3Providers({ children }: Web3ProvidersProps) {
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
