"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

import { cityChips } from "../data"
import { FadeUp } from "../types"

type CityChipsProps = {
  fadeUp: FadeUp
}

export function CityChips({ fadeUp }: CityChipsProps) {
  return (
    <section className="space-y-5">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
          Cities with fish delivery
        </h2>
        <p className="text-sm text-slate-500">
          We are expanding daily. Choose your city to see live stock.
        </p>
      </motion.div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cityChips.map((city, index) => (
          <motion.div key={city} {...fadeUp(index * 0.02)}>
            <Button
              variant="outline"
              className="h-11 w-full justify-start rounded-full border-slate-200 bg-white text-xs text-slate-600"
            >
              {city}
            </Button>
          </motion.div>
        ))}
        <Button
          variant="outline"
          className="h-11 w-full justify-between rounded-full border-slate-200 bg-white text-xs text-[var(--brand)] sm:col-span-2 lg:col-span-1"
        >
          Show more
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
