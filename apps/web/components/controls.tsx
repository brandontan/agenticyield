"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Controls() {
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(false)

  const handleRecheck = async () => {
    setIsChecking(true)

    toast({
      title: "Rechecking rates…",
      description: "The agent is evaluating yield opportunities.",
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsChecking(false)

    const isBlocked = Math.random() > 0.5

    if (isBlocked) {
      toast({
        title: "Move skipped — safety check",
        description: "Safety too low (59/100). We'll recheck later.",
        variant: "default",
      })
    } else {
      toast({
        title: "Done",
        description: "No move needed — you're already in the best spot.",
      })
    }
  }

  return (
    <Card className="p-6 border border-zinc-800 bg-zinc-900 rounded-2xl shadow-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleRecheck}
              disabled={isChecking}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
              )}
              Check for better rates
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
            <p className="text-sm">Tap to make the agent re-evaluate yield opportunities right now.</p>
            <p className="text-xs text-zinc-400 mt-1">The agent will check safety requirements before any move.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Card>
  )
}
