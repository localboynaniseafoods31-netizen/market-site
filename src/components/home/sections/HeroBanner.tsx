"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Fish } from "lucide-react"
import { motion } from "framer-motion"

import { promoSlides } from "../data"
import { FadeUp } from "../types"

type HeroBannerProps = {
  fadeUp: FadeUp
}

export function HeroBanner({ fadeUp }: HeroBannerProps) {
  const [primary, secondary] = promoSlides

  return (
    <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <motion.div {...fadeUp(0)}>
        <Card className="h-full rounded-[2rem] border border-slate-100 bg-gradient-to-br from-[var(--brand-soft)] via-white to-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-3">
              <Badge className="w-fit rounded-full bg-[var(--brand)] text-xs uppercase tracking-[0.25em] text-white">
                {primary.eyebrow}
              </Badge>
              <h1 className="text-balance font-[var(--font-display)] text-3xl font-semibold text-[var(--brand-ink)] sm:text-4xl">
                {primary.title}
              </h1>
              <p className="text-sm text-slate-600">{primary.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Button className="h-10 rounded-full bg-[var(--brand-accent)] px-5 text-white hover:bg-[var(--brand-accent)]/90">
                  {primary.cta}
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-slate-200 bg-white px-5 text-slate-600"
                >
                  View catalog
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:h-48 md:w-48">
                <div className="flex h-full items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-white">
                  <Fish className="h-12 w-12 text-[var(--brand)]" />
                </div>
              </div>
              <div className="absolute -bottom-3 left-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow">
                Fresh catch
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]" />
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            <span className="h-2 w-2 rounded-full bg-slate-200" />
          </div>
        </Card>
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <Card className="h-full rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <Badge variant="outline" className="rounded-full border-slate-200">
            {secondary.eyebrow}
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold text-[var(--brand-ink)]">
            {secondary.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{secondary.subtitle}</p>
          <Button className="mt-5 h-10 rounded-full bg-[var(--brand)] px-5 text-white hover:bg-[var(--brand)]/90">
            {secondary.cta}
          </Button>
          <div className="mt-6 h-32 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50" />
        </Card>
      </motion.div>
    </section>
  )
}
