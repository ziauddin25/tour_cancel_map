import { cancellationReasons } from '@/data/cancellation-reasons'
import { districts } from '@/data/bangladesh/districts'
import { getTourStats } from '@/lib/stats'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import type { TourRecord } from '@/types/tour'

type TourStatsProps = {
  records: TourRecord[]
  locationType: TourRecord['locationType']
  locationName: (id: string) => string | undefined
  placeLabel?: string
}

const statuses = [
  { key: 'totalCompleted', labelKey: 'statsVisited', emoji: '🟢', color: 'text-[#32734b]' },
  { key: 'totalPlans', labelKey: 'statsPlanned', emoji: '🟡', color: 'text-[#997019]' },
  { key: 'totalCancelled', labelKey: 'statsCancelled', emoji: '🔴', color: 'text-[#b14b43]' },
  { key: 'totalOneDay', labelKey: 'statsOneDay', emoji: '🟣', color: 'text-[#7853a1]' },
  { key: 'totalNeverPlanned', labelKey: 'statsNever', emoji: '⚫', color: 'text-[#5d685e]' },
] as const

export function TourStats({ records, locationType, locationName, placeLabel = 'District' }: TourStatsProps) {
  const language = useLanguage()
  const copy = text(language)
  const stats = getTourStats(records, locationType)
  const hasCancellations = records.some((record) => record.locationType === locationType && record.status === 'cancelled')
  const districtName = stats.mostCancelledDistrict
    ? locationName(stats.mostCancelledDistrict) ?? stats.mostCancelledDistrict
    : hasCancellations ? copy.tied : copy.noRecordsYet
  const commonReason = cancellationReasons.find((reason) => reason.id === stats.mostCommonCancellationReason)?.[language === 'bn' ? 'label' : 'labelEn']
    ?? (hasCancellations ? copy.tied : copy.noRecordsYet)

  return (
    <section aria-label="Tour statistics" className="border-y border-[#dce4d9] py-5 sm:py-6">
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        {statuses.map(({ key, labelKey, emoji, color }) => (
          <div key={key} className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden="true" className="text-base">{emoji}</span>
            <div className="min-w-0">
              <p className={`text-xl font-bold leading-none ${color}`}>{stats[key]}</p>
              <p className="mt-1 truncate text-[11px] font-medium text-[#758076] sm:text-xs">{copy[labelKey]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-[#e7ece5] pt-4 sm:grid-cols-3">
        <Insight label={copy.cancellationRate} value={stats.cancellationRate === null ? '—' : `${stats.cancellationRate}%`} />
        <Insight label={copy.mostCancelled(placeLabel)} value={districtName} detail={stats.mostCancelledDistrict ? copy.fromHistory : hasCancellations ? copy.tiedDetail : copy.addRecord} />
        <Insight label={copy.commonReason} value={commonReason} detail={stats.mostCommonCancellationReason ? copy.fromHistory : hasCancellations ? copy.tiedDetail : copy.addRecord} />
      </div>
    </section>
  )
}

function Insight({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#849087]">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-[#283a2e]">{value}</p>
      {detail && <p className="mt-0.5 truncate text-[10px] text-[#849087]">{detail}</p>}
    </div>
  )
}

export function getBangladeshLocationName(id: string) {
  return districts.find((district) => district.id === id)?.name
}