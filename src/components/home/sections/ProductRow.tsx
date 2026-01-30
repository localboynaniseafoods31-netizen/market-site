"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"

import { FadeUp, ProductItem } from "../types"

type ProductRowProps = {
  title: string
  subtitle: string
  items: ProductItem[]
  fadeUp: FadeUp
}

export function ProductRow({ title, subtitle, items, fadeUp }: ProductRowProps) {
  return (
    <section className="space-y-4">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
          {title}
        </h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            {...fadeUp(index * 0.03)}
            className="snap-start"
          >
            <Card className="min-w-[220px] rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <div className="relative">
                <div className="h-28 rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-50" />
                <Button
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent)]/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Badge className="absolute left-2 top-2 bg-[var(--brand-soft)] text-[var(--brand)]">
                  {item.off}
                </Badge>
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold text-[var(--brand-ink)]">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">{item.size}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-[var(--brand-ink)]">
                    {item.price}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {item.oldPrice}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{item.delivery}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
