'use client'

import { divisions } from '@/data/bangladesh/divisions'
import { districts } from '@/data/bangladesh/districts'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import type { District, DistrictStatuses, TourStatus } from '@/types/tour'

const statusKeys: Record<TourStatus, 'visited' | 'planned' | 'cancelled' | 'oneDay' | 'never'> = {
  visited: 'visited',
  planned: 'planned',
  cancelled: 'cancelled',
  'one-day': 'oneDay',
  never: 'never',
}

const statusStyles: Record<TourStatus, string> = {
  visited: 'border-[#bad4bd] bg-[#e8f2e7] text-[#27623d]',
  planned: 'border-[#ecd79a] bg-[#fbf3dc] text-[#876614]',
  cancelled: 'border-[#e9c1bb] bg-[#fff0ed] text-[#a74740]',
  'one-day': 'border-[#d4c5e4] bg-[#f2edf8] text-[#704e91]',
  never: 'border-[#e6e4dc] bg-[#f5f3ed] text-[#5f695f]',
}

const statusIcons: Partial<Record<TourStatus, string>> = {
  visited: '🟢',
  planned: '🟡',
  cancelled: '🔴',
  'one-day': '🟣',
}

type DistrictListProps = {
  query: string
  divisionId: string
  districtStatuses: DistrictStatuses
  selectedDistrictId: string | null
  onSelectDistrict: (district: District) => void
}

export function DistrictList({ query, divisionId, districtStatuses, selectedDistrictId, onSelectDistrict }: DistrictListProps) {
  const language = useLanguage()
  const copy = text(language)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const groups = divisions
    .filter((division) => divisionId === 'all' || division.id === divisionId)
    .map((division) => ({
      division,
      districts: districts.filter((district) => district.divisionId === division.id && (
        !normalizedQuery || `${district.name} ${district.nameEn}`.toLocaleLowerCase().includes(normalizedQuery)
      )),
    }))
    .filter((group) => group.districts.length > 0)

  if (groups.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-[#778379]">{copy.districtListEmpty}</p>
  }

  return (
    <div className="space-y-4 pb-2">
      {groups.map(({ division, districts: divisionDistricts }) => {
        const markedCount = divisionDistricts.filter((district) => (districtStatuses[district.id] ?? 'never') !== 'never').length
        return (
          <section aria-labelledby={`division-${division.id}`} className="border-b border-[#e8ece5] pb-3 last:border-0" key={division.id}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[#45554a]" id={`division-${division.id}`}>
                {language === 'bn' ? division.name : division.nameEn}
              </h3>
              <span className="text-[10px] text-[#8a948b]">{copy.markedCount(markedCount, divisionDistricts.length)}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {divisionDistricts.map((district) => {
                const status = districtStatuses[district.id] ?? 'never'
                const selected = selectedDistrictId === district.id
                const districtName = language === 'bn' ? district.name : district.nameEn
                return (
                  <button
                    key={district.id}
                    aria-label={`${districtName}, ${copy[statusKeys[status]]}`}
                    aria-pressed={selected}
                    className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4f8059] ${statusStyles[status]} ${selected ? 'ring-2 ring-[#3c6c4b]/35' : ''}`}
                    type="button"
                    onClick={() => onSelectDistrict(district)}
                  >
                    {statusIcons[status] && <span aria-hidden="true" className="text-[9px] leading-none">{statusIcons[status]}</span>}
                    {districtName}
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
