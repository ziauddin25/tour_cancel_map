import { divisions } from '@/data/bangladesh/divisions'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'

type DivisionFilterProps = {
  value: string
  onChange: (value: string) => void
}

export function DivisionFilter({ value, onChange }: DivisionFilterProps) {
  const language = useLanguage()
  const copy = text(language)
  return (
    <div>
      <label className="sr-only" htmlFor="division-filter">{copy.divisionLabel}</label>
      <select className="h-12 w-full rounded-lg border border-[#d7ded5] bg-white px-3 text-sm text-[#1e2922] outline-none focus:border-[#52825d] focus:ring-3 focus:ring-[#52825d]/20" id="division-filter" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{copy.all}</option>
        {divisions.map((division) => <option key={division.id} value={division.id}>{language === 'bn' ? division.name : division.nameEn}</option>)}
      </select>
    </div>
  )
}