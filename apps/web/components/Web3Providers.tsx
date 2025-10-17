"use client"

import { ReactNode, useMemo } from "react"
import { WagmiProvider, http, createConfig } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import { walletConnectWallet, coinbaseWallet, metaMaskWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets"
import { base, baseSepolia } from "wagmi/chains"

const rawWalletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID ?? "8cda37f721a07c70116a85ae9be325bf"
const walletConnectId = rawWalletConnectId.trim()
const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://v0-agentic-yield-ui.vercel.app").replace(/\/$/, "")

const transports = {
  [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || base.rpcUrls.default.http[0]),
  [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || baseSepolia.rpcUrls.default.http[0]),
}

const projectId = walletConnectId || "demo"
const chains = [base, baseSepolia] as const

if (projectId === "demo") {
  console.warn("WalletConnect projectId missing; QR connect will be disabled. Set NEXT_PUBLIC_WALLETCONNECT_ID.")
}

const walletList = [
  {
    groupName: "Recommended",
    wallets: [
      walletConnectWallet({ projectId }),
      coinbaseWallet({ appName: "AgenticYield" }),
      metaMaskWallet({ projectId }),
      rainbowWallet({ projectId }),
    ],
  },
] as unknown as Parameters<typeof connectorsForWallets>[0]

const connectors = connectorsForWallets(walletList, {
  projectId,
  appName: "AgenticYield",
  appDescription: "We move your USDC to the place that pays more after costs, with safety checks and clear receipts.",
  appUrl,
  appIcon: `${appUrl}/placeholder-logo.png`,
})

const wagmiConfig = createConfig({
  connectors,
  chains,
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
