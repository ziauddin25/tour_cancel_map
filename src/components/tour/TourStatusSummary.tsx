import { useEffect, useRef, useState } from 'react'
import { Ban } from 'lucide-react'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import { calculateCancellationRate } from '@/lib/stats'
import type { TourStatus } from '@/types/tour'

const otherStatusItems = [
  { status: 'visited', labelKey: 'visited', color: '#4f9b68', tone: 'text-[#32734b]' },
  { status: 'planned', labelKey: 'planned', color: '#e3b94f', tone: 'text-[#997019]' },
  { status: 'one-day', labelKey: 'oneDay', color: '#9a70bd', tone: 'text-[#7853a1]' },
  { status: 'never', labelKey: 'never', color: '#d6e2d2', tone: 'text-[#5d685e]' },
] as const

type TourStatusSummaryProps = {
  statuses: Partial<Record<string, TourStatus>>
  total: number
}

export function TourStatusSummary({ statuses, total }: TourStatusSummaryProps) {
  const language = useLanguage()
  const copy = text(language)
  const [showOthers, setShowOthers] = useState(false)
  const othersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showOthers) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!othersRef.current?.contains(event.target as Node)) setShowOthers(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowOthers(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showOthers])

  if (total <= 0) return null

  const counts: Record<TourStatus, number> = { visited: 0, planned: 0, cancelled: 0, 'one-day': 0, never: 0 }
  let marked = 0
  for (const status of Object.values(statuses)) {
    if (status && status !== 'never') counts[status] += 1
    if (status) marked += 1
  }
  counts.never = Math.max(0, total - counts.visited - counts.planned - counts.cancelled - counts['one-day'])
  const markedPercent = Math.round((marked / total) * 100)
  const cancelledPercent = Math.round((counts.cancelled / total) * 100)
  const cancellationRate = calculateCancellationRate(counts.cancelled, counts.cancelled + counts.visited)

  return (
    <section aria-label={copy.statusSummaryTitle} className="mt-6 rounded-[14px] border border-[#f1d4d0] bg-[linear-gradient(135deg,#fdeceb,#f8f1e6)] p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="text-[30px] leading-none">📊</span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#8a7570]">{copy.mapCoverage(marked)}</p>
          <p className="text-lg font-extrabold leading-tight text-[#b14b43]">{copy.statusSummaryTitle}</p>
        </div>
        <span className="ml-auto shrink-0 whitespace-nowrap rounded-full border border-[#f1d4d0] bg-white px-3 py-1 text-[13px] font-bold tabular-nums text-[#b14b43]">{marked} / {total}</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(217,94,86,.15)]">
        <div
          aria-hidden="true"
          className="h-full rounded-full bg-[#d95e56] transition-[width] duration-700 ease-out"
          style={{ width: `${marked > 0 ? Math.max(markedPercent, 4) : 0}%` }}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 overflow-hidden rounded-[14px] border border-[#a03a32] bg-[linear-gradient(135deg,#c94a41,#a63931)] px-4 py-4 text-white shadow-[0_10px_24px_rgba(166,57,49,0.3)]">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-inset ring-white/25">
              <Ban className="size-4" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/85">{copy.cancelled}</p>
            <span className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-white/15 px-2.5 py-1 text-xs font-black tabular-nums ring-1 ring-inset ring-white/25">{cancelledPercent}%</span>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-5xl font-black leading-none tracking-tight sm:text-[54px]">{counts.cancelled}</p>
            <p className="text-[11px] font-semibold text-white/75">
              {copy.cancellationRate}
              <b className="ml-1.5 text-sm font-extrabold text-white">{cancellationRate === null ? '—' : `${cancellationRate}%`}</b>
            </p>
          </div>
        </div>

        <div ref={othersRef} className="relative flex flex-col">
          <button
            type="button"
            aria-controls="tour-status-others"
            aria-expanded={showOthers}
            className="flex items-center cursor-pointer rounded-[14px] border border-[#d8dfd7] bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#69756b] transition-colors hover:border-[#aebbae] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f8059]"
            onClick={() => setShowOthers((open) => !open)}
          >
            {copy.others}
          </button>

          {showOthers && (
            <div
            className="absolute bottom-[calc(100%+8px)] right-0 z-30 w-[240px] max-w-[calc(100vw-32px)] rounded-[14px] border border-[#d8dfd7] bg-white p-2 shadow-[0_14px_36px_rgba(34,58,38,0.16)]"
            id="tour-status-others"
          >
            <ul className="grid min-w-0 gap-1">
              {otherStatusItems.map((item) => (
                <li
                  key={item.status}
                  className="flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[#f4f7f2]"
                >
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-[4px] border border-black/10"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#3c4a40]">
                    {copy[item.labelKey]}
                  </span>

                  <span className={`shrink-0 text-sm font-black tabular-nums ${item.tone}`}>
                    {counts[item.status]}
                  </span>

                  <span className="w-11 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[#8a938c]">
                    {Math.round((counts[item.status] / total) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>
      </div>
    </section>
  )
}
