'use client'

import { useEffect, useState } from 'react'
import { Pause, Play, Radio } from 'lucide-react'
import { WorldMap } from '@/components/maps/WorldMap'
import { text } from '@/lib/i18n'
import type { Language } from '@/lib/language'

const demoStatuses = {
  jpn: 'visited',
  tha: 'cancelled',
  ind: 'one-day',
} as const

export function WorldTourDemo({ language }: { language: Language }) {
  const copy = text(language)
  const demoLines = copy.worldDemoLines
  const [lineIndex, setLineIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setInterval(() => {
      setLineIndex((current) => {
        let next = current
        while (next === current) next = Math.floor(Math.random() * demoLines.length)
        return next
      })
    }, 4200)
    return () => window.clearInterval(timer)
  }, [demoLines.length, isPlaying])

  return (
    <figure className="relative overflow-hidden rounded-xl border border-[#31473a] bg-[#22372b] shadow-[0_24px_64px_rgba(31,53,39,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c2d1c0]">
        <span className="flex items-center gap-2"><Radio className="size-3.5 text-[#f0bd50]" />Tour Cancel Map</span>
        <button aria-label={isPlaying ? copy.demoPause : copy.demoPlay} className="grid size-8 cursor-pointer place-items-center rounded-full border border-white/15 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#f0bd50]" type="button" onClick={() => setIsPlaying((playing) => !playing)}>
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
      </div>
      <div className="mx-auto max-w-[440px] px-3 pb-1 pt-4 sm:px-5">
        <WorldMap countryStatuses={demoStatuses} selectedCountryId="tha" language={language} interactive={false} showCountryNames={false} onSelectCountry={() => undefined} onCountriesLoaded={() => undefined} />
      </div>
      <figcaption className="relative z-10 border-t border-white/10 bg-[#1d3025] px-4 py-4 sm:px-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#e7ba5b]">{copy.sampleStory}</p>
        <p aria-live="polite" className="demo-caption mt-1.5 min-h-12 text-sm font-semibold leading-6 text-white sm:text-base" key={lineIndex}>{demoLines[lineIndex]}</p>
      </figcaption>
    </figure>
  )
}
