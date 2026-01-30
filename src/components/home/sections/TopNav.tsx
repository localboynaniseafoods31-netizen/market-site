"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronDown,
  FileText,
  Layers,
  MapPin,
  Search,
  ShoppingCart,
  Store,
  User,
} from "lucide-react"

const navItems = [
  { label: "Categories", icon: Layers },
  { label: "Stores", icon: Store },
  { label: "Lab Reports", icon: FileText },
]

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-semibold uppercase tracking-[0.3em] text-white">
              BF
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[var(--brand-ink)]">
                Bhargav Fish Co.
              </p>
              <button className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                Bengaluru, Karnataka
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="hidden flex-1 px-4 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search for fish, prawns, cuts, or trays"
                className="h-11 rounded-full border-slate-200 bg-slate-50 pl-10 text-sm"
              />
            </div>
          </div>

          <div className="hidden items-center justify-center gap-4 lg:flex">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="gap-2 text-sm text-slate-600 hover:text-[var(--brand-ink)]"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden gap-2 text-sm text-slate-600 hover:text-[var(--brand-ink)] md:inline-flex"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
            <Button className="gap-2 rounded-full bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent)]/90">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Button>
          </div>
        </div>

        <div className="relative md:hidden">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search for fish, prawns, cuts, or trays"
            className="h-11 rounded-full border-slate-200 bg-slate-50 pl-10 text-sm"
          />
        </div>
      </div>
    </header>
  )
}
