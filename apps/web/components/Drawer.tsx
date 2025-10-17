"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseComplete?: () => void
  title: string
  id: string
  children: React.ReactNode
  className?: string
}

export default function Drawer({
  open,
  onOpenChange,
  onCloseComplete,
  title,
  id,
  children,
  className,
}: DrawerProps) {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<Element | null>(null)

  const trapFocus = useCallback((event: KeyboardEvent) => {
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusable.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement ?? null
    const el = document.createElement("div")
    document.body.appendChild(el)
    setPortalEl(el)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      } else if (event.key === "Tab") {
        trapFocus(event)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      if (document.body.contains(el)) {
        document.body.removeChild(el)
      }
      setPortalEl(null)
      onCloseComplete?.()
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus()
      }
    }
  }, [open, onCloseComplete, onOpenChange, trapFocus])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      const focusTarget = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      ;(focusTarget ?? dialogRef.current)?.focus()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [open, portalEl])

  if (!open || !portalEl) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end md:items-start justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        id={id}
        tabIndex={-1}
        className={cn(
          "focus:outline-none",
          "mx-4 w-full max-w-lg rounded-t-2xl border border-zinc-800 bg-zinc-900 p-4 pb-6 shadow-xl",
          "md:mx-auto md:mt-24 md:max-w-md md:rounded-2xl md:border md:p-6 md:pb-6 md:max-h-[80vh] md:overflow-y-auto",
          className
        )}
      >
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white" id={`${id}-title`}>
            {title}
          </h2>
          <button
            className="text-sm text-zinc-400 hover:text-white"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>,
    portalEl
  )
}
