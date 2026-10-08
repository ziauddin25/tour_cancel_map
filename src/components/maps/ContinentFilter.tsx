import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'

type ContinentFilterProps = {
  value: string
  continents: string[]
  onChange: (value: string) => void
}

export function ContinentFilter({ value, continents, onChange }: ContinentFilterProps) {
  const language = useLanguage()
  const copy = text(language)
  return (
    <div>
      <label className="sr-only" htmlFor="continent-filter">{copy.continentLabel}</label>
      <select className="h-12 w-full rounded-lg border border-[#d7ded5] bg-white px-3 text-sm text-[#1e2922] outline-none focus:border-[#52825d] focus:ring-3 focus:ring-[#52825d]/20" id="continent-filter" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{copy.allContinents}</option>
        {continents.map((continent) => <option key={continent} value={continent}>{copy.continentName(continent)}</option>)}
      </select>
    </div>
  )
}
