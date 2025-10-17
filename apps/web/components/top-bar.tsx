"use client"

import { useState, type CSSProperties } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import WalletUsdcBalance from "@/components/WalletUsdcBalance"
import EnsureBaseBanner from "@/components/EnsureBaseBanner"

export default function TopBar() {
  const [autoManage, setAutoManage] = useState(true)

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">AgenticYield</h1>

            {/* Network Badge */}
            <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Base (L2)
            </Badge>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />

            {/* Auto-Manage Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-start gap-1 bg-muted/50 px-3 py-2 rounded-lg border border-border/50 cursor-help">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">Auto-Manage</span>
                      <Switch checked={autoManage} onCheckedChange={setAutoManage} aria-label="Toggle auto-manage" />
                      <span
                        className={`text-xs font-semibold ${autoManage ? "text-success" : "text-muted-foreground"}`}
                      >
                        {autoManage ? "ON" : "OFF"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">
                      We only move when a pool pays more and passes safety checks.
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 border-zinc-700 text-white max-w-xs">
                  <p className="text-sm">The autopilot checks for better rates and moves your funds automatically.</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Safety checks include risk score, venue caps, slippage limits, and cooldown periods.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <WalletUsdcBalance />

            <ConnectButton.Custom>
              {({
                account,
                chain,
                authenticationStatus,
                mounted,
                openAccountModal,
                openChainModal,
                openConnectModal,
              }) => {
                const ready = mounted && authenticationStatus !== "loading"
                const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated")

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      } as CSSProperties,
                    })}
                  >
                    {!connected ? (
                      <button
                        type="button"
                        onClick={() => openConnectModal?.()}
                        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
                      >
                        Connect Wallet
                      </button>
                    ) : chain?.unsupported ? (
                      <button
                        type="button"
                        onClick={() => openChainModal?.()}
                        className="flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow hover:bg-destructive/90"
                      >
                        Wrong network
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openAccountModal?.()}
                        className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 shadow"
                      >
                        {account.displayName}
                      </button>
                    )}
                  </div>
                )
              }}
            </ConnectButton.Custom>
          </div>
        </div>
        <EnsureBaseBanner />
      </div>
    </header>
  )
}
