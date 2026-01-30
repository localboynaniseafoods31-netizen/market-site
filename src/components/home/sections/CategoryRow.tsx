"use client"

import { Button } from "@/components/ui/button"
import { Fish } from "lucide-react"
import { motion } from "framer-motion"

import { categories } from "../data"
import { FadeUp } from "../types"

type CategoryRowProps = {
  fadeUp: FadeUp
}

export function CategoryRow({ fadeUp }: CategoryRowProps) {
  return (
    <section className="space-y-4">
      <motion.div {...fadeUp(0)}>
        <p className="text-sm font-semibold text-[var(--brand-ink)]">
          What's fresh today?
        </p>
        <p className="text-xs text-slate-500">
          Fresh fish, prawns, and chef-ready cuts updated every morning.
        </p>
      </motion.div>

      <div className="grid grid-flow-col auto-cols-[120px] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-4 sm:overflow-visible lg:grid-cols-5">
        {categories.map((category, index) => (
          <motion.div key={category} {...fadeUp(index * 0.03)}>
            <Button
              variant="ghost"
              className="flex w-full flex-col gap-3 rounded-2xl bg-white px-4 py-4 text-xs font-medium text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-white">
                <Fish className="h-6 w-6 text-[var(--brand)]" />
              </span>
              <span className="text-center">{category}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
