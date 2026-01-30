"use client"

import { useReducedMotion } from "framer-motion"

import { freshPicks, prawnPicks } from "./data"
import { CategoryRow } from "./sections/CategoryRow"
import { CityChips } from "./sections/CityChips"
import { FooterSection } from "./sections/FooterSection"
import { HeroBanner } from "./sections/HeroBanner"
import { MobileBottomNav } from "./sections/MobileBottomNav"
import { ProductRow } from "./sections/ProductRow"
import { QuickActions } from "./sections/QuickActions"
import { TopNav } from "./sections/TopNav"

export function HomePage() {
  const prefersReducedMotion = useReducedMotion()
  const fadeUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay },
          },
          viewport: { once: true, amount: 0.2 },
        }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f9fb] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-[var(--brand-soft)] blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[var(--brand-accent)]/10 blur-[160px]" />
      </div>
      <TopNav />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 pt-6 md:px-6 md:pt-10">
        <HeroBanner fadeUp={fadeUp} />
        <QuickActions fadeUp={fadeUp} />
        <CategoryRow fadeUp={fadeUp} />
        <ProductRow
          title="Top picks for today"
          subtitle="Fresh catch and chef-ready cuts updated every morning."
          items={freshPicks}
          fadeUp={fadeUp}
        />
        <ProductRow
          title="Premium prawn specials"
          subtitle="Large grades and butterfly cuts for fast bulk prep."
          items={prawnPicks}
          fadeUp={fadeUp}
        />
        <CityChips fadeUp={fadeUp} />
      </main>
      <FooterSection />
      <MobileBottomNav />
    </div>
  )
}
