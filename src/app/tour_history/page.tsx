'use client'

import { Suspense } from 'react'
import { ArrowRight, Globe2, MapPinned } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { ProductFooter } from '@/components/layout/ProductFooter'
import { ProductHeader } from '@/components/layout/ProductHeader'
import { TourDemo } from '@/components/layout/TourDemo'
import { WorldTourDemo } from '@/components/layout/WorldTourDemo'
import { TourHistory } from '@/components/tour/TourHistory'
import { getBangladeshLocationName } from '@/components/tour/TourStats'
import { districts } from '@/data/bangladesh/districts'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import { useTourRecords } from '@/lib/use-tour-records'
import type { TourRecord } from '@/types/tour'

function HistoryHero({ isWorld, language }: { isWorld: boolean; language: ReturnType<typeof useLanguage> }) {
  const copy = text(language)
  return (
    <section className="-mx-4 grid items-center gap-7 border-b border-[#e3eae1] bg-gradient-to-b from-[#edf3ea] to-[#f8f9f6] px-4 py-7 sm:-mx-7 sm:px-7 sm:py-10 lg:-mx-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:gap-12 lg:px-10 lg:py-12" id="history-hero">
      <div>
        <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#708074]">
          {isWorld ? <Globe2 aria-hidden="true" className="size-3.5" /> : <MapPinned aria-hidden="true" className="size-3.5" />}
          {isWorld ? copy.worldLabel : copy.heroLabel}
        </p>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.18] text-[#23372b] sm:text-4xl lg:text-[46px]">
          {isWorld ? copy.worldTitle : copy.heroTitle}
        </h1>
        <p className="mt-3 text-sm text-[#6e7a70] sm:text-base">{copy.historySubtitle}</p>
        <a className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#263d2e] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#365640] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f8059]" href={isWorld ? '/world' : '/'}>
          {isWorld ? copy.worldCta : copy.heroCta} <ArrowRight aria-hidden="true" className="size-4" />
        </a>
      </div>
      {isWorld ? <WorldTourDemo language={language} /> : <TourDemo language={language} />}
    </section>
  )
}

function HistoryContent() {
  const language = useLanguage()
  const searchParams = useSearchParams()
  const { records } = useTourRecords()
  const mapParam = searchParams.get('map')

  const isWorld = mapParam === 'world' || (
    mapParam === null &&
    records.some((record) => record.locationType === 'country') &&
    !records.some((record) => record.locationType === 'district')
  )

  function locationName(record: TourRecord) {
    if (record.locationType !== 'district') return record.locationName || record.locationId
    if (language === 'en') return districts.find((district) => district.id === record.locationId)?.nameEn ?? record.locationName ?? record.locationId
    return getBangladeshLocationName(record.locationId) ?? record.locationName ?? record.locationId
  }

  return (
    <>
      <HistoryHero isWorld={isWorld} language={language} />
      <TourHistory records={records} locationName={locationName} />
    </>
  )
}

export default function TourHistoryPage() {
  const language = useLanguage()
  return (
    <main className="min-h-screen bg-[#f8f9f6] text-[#1e2922]" id="top">
      <ProductHeader />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
        <Suspense fallback={<HistoryHero isWorld={false} language={language} />}>
          <HistoryContent />
        </Suspense>
      </div>
      <ProductFooter />
    </main>
  )
}
