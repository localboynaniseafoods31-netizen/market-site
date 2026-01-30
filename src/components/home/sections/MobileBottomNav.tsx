"use client"

import { Button } from "@/components/ui/button"
import { ClipboardList, Home, LayoutGrid, ShoppingBag } from "lucide-react"

const items = [
  { label: "Home", icon: Home },
  { label: "Categories", icon: LayoutGrid },
  { label: "Orders", icon: ClipboardList },
  { label: "Cart", icon: ShoppingBag },
]

export function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {items.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="flex h-auto flex-1 flex-col gap-1 text-xs text-slate-500"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
