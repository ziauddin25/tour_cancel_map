'use client'

import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import type { CountrySummary } from '@/components/maps/WorldMap'
import type { DistrictStatuses, TourStatus } from '@/types/tour'

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

type CountryListProps = {
  query: string
  continentId: string
  countries: CountrySummary[]
  countryStatuses: DistrictStatuses
  selectedCountryId: string | null
  onSelectCountry: (country: CountrySummary) => void
}

export function CountryList({ query, continentId, countries, countryStatuses, selectedCountryId, onSelectCountry }: CountryListProps) {
  const language = useLanguage()
  const copy = text(language)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const groups = [...new Set(countries.map((country) => country.continent))]
    .sort((a, b) => a.localeCompare(b))
    .filter((continent) => continentId === 'all' || continent === continentId)
    .map((continent) => ({
      continent,
      countries: countries
        .filter((country) => country.continent === continent && (
          !normalizedQuery || country.name.toLocaleLowerCase().includes(normalizedQuery)
        ))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.countries.length > 0)

  if (groups.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-[#778379]">{copy.countryListEmpty}</p>
  }

  return (
    <div className="space-y-4 pb-2">
      {groups.map(({ continent, countries: continentCountries }) => {
        const markedCount = continentCountries.filter((country) => (countryStatuses[country.id] ?? 'never') !== 'never').length
        return (
          <section aria-labelledby={`continent-${continent}`} className="border-b border-[#e8ece5] pb-3 last:border-0" key={continent}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[#45554a]" id={`continent-${continent}`}>
                {copy.continentName(continent)}
              </h3>
              <span className="text-[10px] text-[#8a948b]">{copy.markedCount(markedCount, continentCountries.length)}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {continentCountries.map((country) => {
                const status = countryStatuses[country.id] ?? 'never'
                const selected = selectedCountryId === country.id
                return (
                  <button
                    key={country.id}
                    aria-label={`${country.name}, ${copy[statusKeys[status]]}`}
                    aria-pressed={selected}
                    className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4f8059] ${statusStyles[status]} ${selected ? 'ring-2 ring-[#3c6c4b]/35' : ''}`}
                    type="button"
                    onClick={() => onSelectCountry(country)}
                  >
                    {statusIcons[status] && <span aria-hidden="true" className="text-[9px] leading-none">{statusIcons[status]}</span>}
                    {country.name}
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
