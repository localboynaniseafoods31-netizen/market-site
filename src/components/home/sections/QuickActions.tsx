"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

import { quickActions } from "../data"
import { FadeUp } from "../types"

type QuickActionsProps = {
  fadeUp: FadeUp
}

export function QuickActions({ fadeUp }: QuickActionsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {quickActions.map((card, index) => (
        <motion.div key={card.title} {...fadeUp(index * 0.05)}>
          <Card className="h-full rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <Badge className="rounded-full bg-[var(--brand-soft)] text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
              {card.tag}
            </Badge>
            <h3 className="mt-4 text-xl font-semibold text-[var(--brand-ink)]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{card.subtitle}</p>
            <Button
              variant="ghost"
              className="mt-6 h-9 w-9 rounded-full border border-slate-200 p-0 text-[var(--brand-ink)]"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Card>
        </motion.div>
      ))}
    </section>
  )
}
