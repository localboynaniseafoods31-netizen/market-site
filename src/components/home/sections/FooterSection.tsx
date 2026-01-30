"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Phone, Mail } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 text-sm text-slate-600 md:grid-cols-[1.2fr_1fr_1fr] md:px-6">
        <div className="space-y-3">
          <p className="text-base font-semibold text-[var(--brand-ink)]">
            Bhargav Fish Co.
          </p>
          <p className="text-sm text-slate-500">
            Premium fish and prawn supply for hotels, caterers, and bulk
            kitchens.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Facebook className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Quick links
          </p>
          <p>Why choose us</p>
          <p>Quality promise</p>
          <p>Cold chain standards</p>
          <p>Wholesale pricing</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Contact us
          </p>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            +91 90000 00000
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            hello@bhargavfish.co
          </div>
          <p className="text-xs text-slate-400">
            Serving multi-city orders daily.
          </p>
        </div>
      </div>
    </footer>
  )
}
