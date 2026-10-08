import type { TourStatus } from '@/types/tour'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'

const statusColors: Record<TourStatus, string> = {
  visited: '#4f9b68',
  planned: '#e3b94f',
  cancelled: '#d95e56',
  'one-day': '#9a70bd',
  never: '#d6e2d2',
}

const legendItems: { status: TourStatus; key: 'visited' | 'planned' | 'cancelled' | 'oneDay' | 'never' }[] = [
  { status: 'visited', key: 'visited' },
  { status: 'planned', key: 'planned' },
  { status: 'cancelled', key: 'cancelled' },
  { status: 'one-day', key: 'oneDay' },
  { status: 'never', key: 'never' },
]

export function MapLegend({ compact = false, symbolsOnly = false, counts }: { compact?: boolean; symbolsOnly?: boolean; counts?: Partial<Record<TourStatus, number>> }) {
  const copy = text(useLanguage())
  return (
    <ul aria-label={copy.legendLabel} className={compact ? 'flex flex-wrap items-center gap-x-3 gap-y-1.5' : 'flex flex-wrap items-center gap-x-4 gap-y-2'}>
      {legendItems.map(({ status, key }) => (
        <li key={status} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`${compact ? 'size-3' : 'size-3.5'} shrink-0 rounded-[4px] border border-black/10`} style={{ backgroundColor: statusColors[status] }} />
          <span className={symbolsOnly ? 'sr-only' : `${compact ? 'text-[11px]' : 'text-xs sm:text-sm'} font-medium text-[#4d5b50]`}>{copy[key]}</span>
          {counts && <span className={`${compact ? 'text-[11px]' : 'text-xs sm:text-sm'} font-bold tabular-nums text-[#33473a]`}>{counts[status] ?? 0}</span>}
        </li>
      ))}
    </ul>
  )
}
