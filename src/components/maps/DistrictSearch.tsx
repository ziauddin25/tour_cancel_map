'use client'

import { Search, X } from 'lucide-react'
import { districts } from '@/data/bangladesh/districts'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import type { District } from '@/types/tour'

type DistrictSearchProps = {
  value: string
  onChange: (value: string) => void
  onSelect: (district: District) => void
}

export function DistrictSearch({ value, onChange, onSelect }: DistrictSearchProps) {
  const language = useLanguage()
  const copy = text(language)
  const normalizedQuery = value.trim().toLocaleLowerCase()
  const results = normalizedQuery
    ? districts.filter((district) => `${district.name} ${district.nameEn}`.toLocaleLowerCase().includes(normalizedQuery)).slice(0, 6)
    : []

  function selectDistrict(district: District) {
    onChange(language === 'bn' ? district.name : district.nameEn)
    onSelect(district)
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="district-search">{copy.searchLabel}</label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#78847a]" />
      <input
        autoComplete="off"
        className="h-12 w-full rounded-lg border border-[#d7ded5] bg-white pl-10 pr-10 text-sm text-[#1e2922] outline-none placeholder:text-[#89948b] focus:border-[#52825d] focus:ring-3 focus:ring-[#52825d]/20"
        id="district-search"
        placeholder={copy.searchPlaceholder}
        role="combobox"
        aria-autocomplete="list"
        aria-controls="district-search-results"
        aria-expanded={results.length > 0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onChange('')
          if (event.key === 'Enter' && results[0]) {
            event.preventDefault()
            selectDistrict(results[0])
          }
        }}
      />
      {value && (
        <button aria-label={copy.clearSearch} className="absolute right-2 top-1/2 grid size-8 cursor-pointer -translate-y-1/2 place-items-center rounded-md text-[#78847a] hover:bg-[#f0f3ee] focus-visible:outline-2 focus-visible:outline-[#52825d]" type="button" onClick={() => onChange('')}>
          <X className="size-4" />
        </button>
      )}
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-[#d7ded5] bg-white p-1 shadow-lg" id="district-search-results" role="listbox">
          {results.map((district) => (
            <li key={district.id} role="presentation">
              <button className="flex min-h-11 w-full cursor-pointer items-center justify-between rounded-md px-3 text-left hover:bg-[#f0f4ef] focus-visible:bg-[#f0f4ef] focus-visible:outline-none" role="option" aria-selected="false" type="button" onClick={() => selectDistrict(district)}>
                <span className="text-sm font-medium text-[#26342a]">{language === 'bn' ? district.name : district.nameEn}</span>
                <span className="text-xs text-[#778379]">{language === 'bn' ? district.nameEn : district.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}