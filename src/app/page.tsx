'use client'

import { useRef, useState } from 'react'
import { ArrowDown, MapPinned } from 'lucide-react'
import { ShareExport } from '@/components/export/ShareExport'
import { ProductFooter } from '@/components/layout/ProductFooter'
import { ProductHeader } from '@/components/layout/ProductHeader'
import { TourDemo } from '@/components/layout/TourDemo'
import { BangladeshMap } from '@/components/maps/BangladeshMap'
import { DistrictList } from '@/components/maps/DistrictList'
import { DistrictSearch } from '@/components/maps/DistrictSearch'
import { DistrictSheet } from '@/components/maps/DistrictSheet'
import { DivisionFilter } from '@/components/maps/DivisionFilter'
import { MapLegend } from '@/components/maps/MapLegend'
import { MapProfileHeader } from '@/components/maps/MapProfileHeader'
import { TourStatusSummary } from '@/components/tour/TourStatusSummary'
// import {TourStats}  from '@/components/tour/TourStats'
import { divisions } from '@/data/bangladesh/divisions'
import { districts } from '@/data/bangladesh/districts'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import { saveUserProfile, useUserProfile } from '@/lib/user-profile'
import { getCurrentTourRecords } from '@/lib/stats'
import { useTourRecords } from '@/lib/use-tour-records'
import type { District, TourLocation, TourStatus } from '@/types/tour'

export default function Home() {
  const language = useLanguage()
  const copy = text(language)
  const profile = useUserProfile()
  const { records, getRecord, getStatus, saveRecord } = useTourRecords()
  const mapExportRef = useRef<HTMLDivElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<TourLocation | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [divisionId, setDivisionId] = useState('all')
  const districtStatuses = getStatus('district')
  const legendCounts: Record<TourStatus, number> = { visited: 0, planned: 0, cancelled: 0, 'one-day': 0, never: 0 }
  for (const district of districts) {
    legendCounts[districtStatuses[district.id] ?? 'never'] += 1
  }
  const currentStatus = selectedLocation ? getRecord(selectedLocation.id, 'district')?.status ?? 'never' : 'never'
  const currentDistrictRecords = getCurrentTourRecords(records).filter((record) => record.locationType === 'district')

  function selectDistrict(district: District) {
    setSelectedLocation({
      id: district.id,
      name: language === 'bn' ? district.name : district.nameEn,
      nameEn: district.nameEn,
      locationType: 'district',
      subtitle: language === 'bn'
        ? `${district.divisionName} বিভাগ`
        : `${divisions.find((division) => division.id === district.divisionId)?.nameEn ?? 'Division'} Division`,
    })
    setDivisionId(district.divisionId)
  }

  function saveDistrictRecord(record: Parameters<typeof saveRecord>[0]) {
    saveRecord(record)
    setSelectedLocation(null)
  }

  const selectedDistrict = districts.find((district) => district.id === selectedLocation?.id)
  const selectedSheetLocation = selectedLocation && selectedDistrict
    ? {
        ...selectedLocation,
        name: language === 'bn' ? selectedDistrict.name : selectedDistrict.nameEn,
        subtitle: language === 'bn'
          ? `${selectedDistrict.divisionName} বিভাগ`
          : `${divisions.find((division) => division.id === selectedDistrict.divisionId)?.nameEn ?? 'Division'} Division`,
      }
    : selectedLocation

  return (
    <main className="min-h-screen bg-[#f8f9f6] text-[#1e2922]" id="top">
      <ProductHeader />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
        <section className="-mx-4 grid items-center gap-7 bg-gradient-to-b from-[#edf3ea] to-[#f8f9f6] px-4 py-7 sm:-mx-7 sm:px-7 sm:py-10 lg:-mx-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:gap-12 lg:px-10 lg:py-12">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#708074]"><MapPinned className="size-3.5" />{copy.heroLabel}</p>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.18] text-[#23372b] sm:text-4xl lg:text-[46px]">{copy.heroTitle}</h1>
            <p className="mt-3 text-sm text-[#6e7a70] sm:text-base">{copy.heroSubtitle}</p>
            <a className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#263d2e] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#365640] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f8059]" href="#map-section">
              {copy.heroCta} <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
          <TourDemo language={language} />
        </section>

        <section aria-labelledby="district-list-title" className="scroll-mt-24 py-7 sm:py-9" id="map-section">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(380px,0.36fr)_minmax(0,1fr)] lg:gap-5">
            <aside className="rounded-xl border border-[#dce4d9] bg-white px-4 py-4 shadow-[0_8px_28px_rgba(34,58,38,0.05)] sm:px-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2 className="text-base font-bold leading-snug text-[#26392d] sm:text-lg" id="district-list-title">{copy.districtListTitle}</h2>
                <span className="shrink-0 rounded-full bg-[#e7f1e8] px-2.5 py-1 text-[11px] font-bold text-[#31714a]">{currentDistrictRecords.length}/64</span>
              </div>
              <section aria-label={`${copy.searchLabel} & ${copy.divisionLabel}`} className="grid gap-2">
                <DistrictSearch value={searchValue} onChange={setSearchValue} onSelect={selectDistrict} />
                <DivisionFilter value={divisionId} onChange={setDivisionId} />
              </section>
              <div className="mt-4 max-h-[65vh] overflow-y-auto overscroll-contain pr-1">
                <DistrictList
                  query={searchValue}
                  divisionId={divisionId}
                  districtStatuses={districtStatuses}
                  selectedDistrictId={selectedLocation?.locationType === 'district' ? selectedLocation.id : null}
                  onSelectDistrict={selectDistrict}
                />
              </div>
            </aside>

            <section aria-label={copy.mapOwner(profile.name.trim())} className="min-w-0 overflow-hidden rounded-xl border border-[#dce4d9] bg-white shadow-[0_14px_42px_rgba(34,58,38,0.07)]">
              <div className="border-b border-[#e7ece5] bg-[#fcfdfb]/95">
                <MapProfileHeader profile={profile} language={language} onProfileChange={saveUserProfile} />
              </div>
              <div className="m-2 md:m-6">
                <div ref={mapExportRef} className="map-paper relative p-5 lg:p-8 rounded-md bg-[#faf8f4]">
                <div className="mb-5 flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  {/* <h3 className="">{copy.}</h3> */}
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#79877c]">{copy.markedMapTitle}</p>
                    <h3 className="mt-1 break-words text-xl font-extrabold leading-tight text-[#20372a] sm:text-2xl lg:text-[28px]">{copy.mapOwner(profile.name.trim())}</h3>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
                    {/* <div className="flex items-baseline gap-1 text-[#287657]">
                      <span className="text-3xl font-black leading-none sm:text-5xl">{currentDistrictRecords.length}</span>
                      <span className="text-sm font-bold text-[#879188]">/ 64</span>
                    </div> */}
                    {/* <MapLegend compact symbolsOnly /> */}
                     <div className="max-w-[200px]">
                      <MapLegend compact symbolsOnly />
                    </div>
                  </div>
                </div>
                <BangladeshMap
                  // className="!max-w-[760px]"
                  districtStatuses={districtStatuses}
                  divisionId={divisionId}
                  selectedDistrictId={selectedLocation?.locationType === 'district' ? selectedLocation.id : null}
                  language={language}
                  showDistrictNames={profile.showDistrictNames ?? true}
                  large
                  onSelectDistrict={selectDistrict}
                />
                <TourStatusSummary statuses={districtStatuses} total={districts.length} />
                </div>
              </div>
              <div className="p-6">
                <ShareExport
                  targetRef={mapExportRef}
                  savedCount={currentDistrictRecords.length}
                  title={copy.mapTitle}
                  placeLabel={language === 'bn' ? 'জেলা' : 'districts'}
                />
              </div>
            </section>
          </div>
        </section>
      </div>
      <ProductFooter /> 

      <DistrictSheet
        key={`${selectedLocation?.id ?? 'closed'}-${language}`}
        location={selectedSheetLocation}
        record={selectedLocation ? getRecord(selectedLocation.id, 'district') : null}
        status={currentStatus}
        onClose={() => setSelectedLocation(null)}
        onSave={saveDistrictRecord}
      />
    </main>
  )
}
