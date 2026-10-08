'use client'

import { useRef, useState } from 'react'
import { ArrowDown, Globe2 } from 'lucide-react'
import { ShareExport } from '@/components/export/ShareExport'
import { ProductFooter } from '@/components/layout/ProductFooter'
import { ProductHeader } from '@/components/layout/ProductHeader'
import { WorldTourDemo } from '@/components/layout/WorldTourDemo'
import { ContinentFilter } from '@/components/maps/ContinentFilter'
import { CountryList } from '@/components/maps/CountryList'
import { CountrySearch } from '@/components/maps/CountrySearch'
import { DistrictSheet } from '@/components/maps/DistrictSheet'
import { MapLegend } from '@/components/maps/MapLegend'
import { MapProfileHeader } from '@/components/maps/MapProfileHeader'
import { WorldMap, type CountrySummary } from '@/components/maps/WorldMap'
import { TourStatusSummary } from '@/components/tour/TourStatusSummary'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import { saveUserProfile, useUserProfile } from '@/lib/user-profile'
import { getCurrentTourRecords } from '@/lib/stats'
import { useTourRecords } from '@/lib/use-tour-records'
import type { TourLocation } from '@/types/tour'

const WORLD_COUNTRY_COUNT = 194

export default function WorldPage() {
  const language = useLanguage()
  const copy = text(language)
  const profile = useUserProfile()
  const { records, getRecord, getStatus, saveRecord } = useTourRecords()
  const mapExportRef = useRef<HTMLDivElement>(null)
  const [countries, setCountries] = useState<CountrySummary[]>([])
  const [selectedLocation, setSelectedLocation] = useState<TourLocation | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [continentId, setContinentId] = useState('all')
  const countryStatuses = getStatus('country')
  const currentStatus = selectedLocation ? getRecord(selectedLocation.id, 'country')?.status ?? 'never' : 'never'
  const currentCountryRecords = getCurrentTourRecords(records).filter((record) => record.locationType === 'country')
  const continents = [...new Set(countries.map((country) => country.continent).filter(Boolean))].sort((a, b) => a.localeCompare(b))

  function selectCountry(country: CountrySummary) {
    setSelectedLocation({
      id: country.id,
      name: country.name,
      nameEn: country.nameEn,
      locationType: 'country',
      subtitle: copy.continentName(country.continent),
    })
    if (country.continent) setContinentId(country.continent)
  }

  function saveCountryRecord(record: Parameters<typeof saveRecord>[0]) {
    saveRecord(record)
    setSelectedLocation(null)
  }

  return (
    <main className="min-h-screen bg-[#f8f9f6] text-[#1e2922]" id="top">
      <ProductHeader />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
        <section className="-mx-4 grid items-center gap-7 border-b border-[#e3eae1] bg-gradient-to-b from-[#edf3ea] to-[#f8f9f6] px-4 py-7 sm:-mx-7 sm:px-7 sm:py-10 lg:-mx-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:gap-12 lg:px-10 lg:py-12">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#708074]"><Globe2 className="size-3.5" />{copy.worldLabel}</p>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.18] text-[#23372b] sm:text-4xl lg:text-[46px]">{copy.worldTitle}</h1>
            <p className="mt-3 text-sm text-[#6e7a70] sm:text-base">{copy.heroSubtitle}</p>
            <a className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#263d2e] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#365640] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f8059]" href="#world-map-section">
              {copy.worldCta} <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
          <WorldTourDemo language={language} />
        </section>

        <section aria-labelledby="country-list-title" className="scroll-mt-24 py-7 sm:py-9" id="world-map-section">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(380px,0.36fr)_minmax(0,1fr)] lg:gap-5">
            <aside className="rounded-xl border border-[#dce4d9] bg-white px-4 py-4 shadow-[0_8px_28px_rgba(34,58,38,0.05)] sm:px-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2 className="text-base font-bold leading-snug text-[#26392d] sm:text-lg" id="country-list-title">{copy.countryListTitle}</h2>
                <span className="shrink-0 rounded-full bg-[#e7f1e8] px-2.5 py-1 text-[11px] font-bold text-[#31714a]">{currentCountryRecords.length}/{WORLD_COUNTRY_COUNT}</span>
              </div>
              <section aria-label={`${copy.countrySearchLabel} & ${copy.continentLabel}`} className="grid gap-2">
                <CountrySearch value={searchValue} countries={countries} onChange={setSearchValue} onSelect={selectCountry} />
                <ContinentFilter value={continentId} continents={continents} onChange={setContinentId} />
              </section>
              <div className="mt-4 max-h-[65vh] overflow-y-auto overscroll-contain pr-1">
                <CountryList
                  query={searchValue}
                  continentId={continentId}
                  countries={countries}
                  countryStatuses={countryStatuses}
                  selectedCountryId={selectedLocation?.locationType === 'country' ? selectedLocation.id : null}
                  onSelectCountry={selectCountry}
                />
              </div>
            </aside>

            <section aria-label={copy.mapOwner(profile.name.trim())} className="min-w-0 overflow-hidden rounded-xl border border-[#dce4d9] bg-white shadow-[0_14px_42px_rgba(34,58,38,0.07)]">
              <div className="border-b border-[#e7ece5] bg-[#fcfdfb]/95">
                <MapProfileHeader profile={profile} language={language} onProfileChange={saveUserProfile} />
              </div>
              <div className="m-6">
                <div ref={mapExportRef} className="map-paper relative p-8 rounded-md bg-[#faf8f4]">
                <div className="mb-5 flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#79877c]">{copy.worldMapEyebrow}</p>
                    <h3 className="mt-1 break-words text-xl font-extrabold leading-tight text-[#20372a] sm:text-2xl lg:text-[28px]">{copy.mapOwner(profile.name.trim())}</h3>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
                    <div className="max-w-[200px]">
                      <MapLegend compact symbolsOnly />
                    </div>
                  </div>
                </div>
                <WorldMap
                  countryStatuses={countryStatuses}
                  selectedCountryId={selectedLocation?.locationType === 'country' ? selectedLocation.id : null}
                  language={language}
                  showCountryNames={profile.showDistrictNames ?? true}
                  onSelectCountry={selectCountry}
                  onCountriesLoaded={setCountries}
                />
                <TourStatusSummary statuses={countryStatuses} total={WORLD_COUNTRY_COUNT} />
                </div>
              </div>
              <div className="p-6">
                <ShareExport
                  targetRef={mapExportRef}
                  savedCount={currentCountryRecords.length}
                  title={copy.worldLabel}
                  placeLabel={language === 'bn' ? 'দেশ' : 'countries'}
                />
                <p className="mt-3 text-xs leading-5 text-[#78847a]">{copy.countryHelp}</p>
              </div>
            </section>
          </div>
        </section>
      </div>
      <ProductFooter />

      <DistrictSheet
        key={`${selectedLocation?.id ?? 'closed'}-${language}`}
        location={selectedLocation}
        record={selectedLocation ? getRecord(selectedLocation.id, 'country') : null}
        status={currentStatus}
        onClose={() => setSelectedLocation(null)}
        onSave={saveCountryRecord}
      />
    </main>
  )
}
