'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Language } from '@/lib/language'
import type { DistrictStatuses, TourStatus } from '@/types/tour'

type Geometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }

export type CountrySummary = {
  id: string
  name: string
  nameEn: string
  continent: string
}

type CountryFeature = {
  properties: { ADMIN: string; ADM0_A3: string; CONTINENT?: string }
  geometry: Geometry
}

type CountryDataset = { features: CountryFeature[] }
type CountryShape = { country: CountrySummary; path: string; labelX: number; labelY: number }

const MAP_WIDTH = 1000
const MAP_HEIGHT = 540

const statusColors: Record<TourStatus, string> = {
  visited: '#4f9b68',
  planned: '#e3b94f',
  cancelled: '#d95e56',
  'one-day': '#9a70bd',
  never: '#d6e2d2',
}

function countryId(feature: CountryFeature) {
  if (feature.properties.ADM0_A3 !== '-99') return feature.properties.ADM0_A3.toLowerCase()
  return feature.properties.ADMIN.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function polygonsFor(geometry: Geometry) {
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
}

function createWorldShapes(dataset: CountryDataset): { shapes: CountryShape[]; countries: CountrySummary[] } {
  const countries = dataset.features.map((feature) => ({
    id: countryId(feature),
    name: feature.properties.ADMIN,
    nameEn: feature.properties.ADMIN,
    continent: feature.properties.CONTINENT ?? '',
  }))
  const bounds = dataset.features.flatMap((feature) => polygonsFor(feature.geometry).flat(2))
  const longitudes = bounds.map(([longitude]) => longitude)
  const latitudes = bounds.map(([, latitude]) => latitude)
  const minX = Math.min(...longitudes)
  const maxX = Math.max(...longitudes)
  const minY = Math.min(...latitudes)
  const maxY = Math.max(...latitudes)
  const width = MAP_WIDTH
  const height = MAP_HEIGHT
  const padding = 16
  const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY))
  const offsetX = (width - (maxX - minX) * scale) / 2
  const offsetY = (height - (maxY - minY) * scale) / 2
  const project = ([longitude, latitude]: number[]) => [
    offsetX + (longitude - minX) * scale,
    offsetY + (maxY - latitude) * scale,
  ]
  const shapes = dataset.features.map((feature, index) => {
    const polygons = polygonsFor(feature.geometry)
    const path = polygons.flatMap((rings) => rings.map((ring) => {
      const points = ring.map(project)
      return `${points.map(([x, y], pointIndex) => `${pointIndex === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')} Z`
    })).join(' ')

    let labelX = 0
    let labelY = 0
    let largestArea = 0
    for (const polygon of polygons) {
      const points = polygon[0]?.map(project) ?? []
      let twiceArea = 0
      let centerX = 0
      let centerY = 0
      for (let pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
        const [x, y] = points[pointIndex]
        const [nextX, nextY] = points[(pointIndex + 1) % points.length]
        const cross = x * nextY - nextX * y
        twiceArea += cross
        centerX += (x + nextX) * cross
        centerY += (y + nextY) * cross
      }
      if (Math.abs(twiceArea) > largestArea) {
        largestArea = Math.abs(twiceArea)
        labelX = centerX / (3 * twiceArea)
        labelY = centerY / (3 * twiceArea)
      }
    }

    return { country: countries[index], path, labelX, labelY }
  })

  return { shapes, countries }
}

type WorldMapProps = {
  countryStatuses: DistrictStatuses
  selectedCountryId: string | null
  language: Language
  onSelectCountry: (country: CountrySummary) => void
  onCountriesLoaded: (countries: CountrySummary[]) => void
  interactive?: boolean
  showCountryNames?: boolean
}

export function WorldMap({ countryStatuses, selectedCountryId, language, onSelectCountry, onCountriesLoaded, interactive = true, showCountryNames = true }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dataset, setDataset] = useState<CountryDataset | null>(null)
  const [error, setError] = useState(false)
  const [tip, setTip] = useState<{ country: CountrySummary; x: number; y: number } | null>(null)

  function showTipAtPointer(country: CountrySummary, event: ReactPointerEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return
    setTip({
      country,
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  useEffect(() => {
    const controller = new AbortController()
    fetch('/maps/world-countries.geojson', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('World map data could not be loaded')
        return response.json() as Promise<CountryDataset>
      })
      .then(setDataset)
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [])

  const mapModel = useMemo(() => (dataset ? createWorldShapes(dataset) : null), [dataset])

  useEffect(() => {
    if (mapModel) onCountriesLoaded(mapModel.countries)
  }, [mapModel, onCountriesLoaded])

  if (error) return <p className="py-20 text-center text-sm text-[#9a433c]">World map লোড করা যায়নি। পৃষ্ঠাটি আবার খুলে দেখুন।</p>
  if (!mapModel) return <div className="grid min-h-[300px] place-items-center text-sm text-[#69756b] sm:min-h-[440px]">World map তৈরি হচ্ছে...</div>

  const tipStatus = tip ? countryStatuses[tip.country.id] : undefined

  return (
    <div aria-hidden={!interactive} ref={containerRef} className="relative w-full">
      {interactive && tip && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[150%] whitespace-nowrap rounded-lg bg-[#17201c] px-2.5 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.22)]"
          style={{ left: `${tip.x}%`, top: `${tip.y}%` }}
          role="status"
        >
          {tipStatus && <span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full align-middle" style={{ backgroundColor: statusColors[tipStatus] }} />}
          {tip.country.name}
          {tipStatus ? ' ✓' : ''}
        </div>
      )}
      <svg aria-label={interactive ? (language === 'bn' ? 'বিশ্বের interactive country map' : 'Interactive world country map') : undefined} className={`block h-auto w-full ${interactive ? '' : 'pointer-events-none'}`} role={interactive ? 'group' : undefined} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
        <title>{language === 'bn' ? 'বিশ্ব ভ্রমণ status map' : 'World tour status map'}</title>
        {mapModel.shapes.map(({ country, path, labelX, labelY }) => {
          const selected = selectedCountryId === country.id
          const status = countryStatuses[country.id] ?? 'never'
          return (
            <path
              key={country.id}
              aria-label={interactive ? `${country.name}, ${status}` : undefined}
              aria-pressed={interactive ? selected : undefined}
              className={`district-shape ${interactive ? '' : 'pointer-events-none'}`}
              d={path}
              fill={statusColors[status]}
              fillRule="evenodd"
              role={interactive ? 'button' : undefined}
              stroke={selected ? '#263d2e' : '#ffffff'}
              strokeWidth={selected ? 2.5 : 1}
              tabIndex={interactive ? 0 : -1}
              onBlur={interactive ? () => setTip(null) : undefined}
              onClick={interactive ? () => onSelectCountry(country) : undefined}
              onFocus={interactive ? () => setTip({ country, x: (labelX / MAP_WIDTH) * 100, y: (labelY / MAP_HEIGHT) * 100 }) : undefined}
              onKeyDown={interactive ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectCountry(country)
                }
              } : undefined}
              onPointerDown={interactive ? (event) => showTipAtPointer(country, event) : undefined}
              onPointerLeave={interactive ? () => setTip(null) : undefined}
              onPointerMove={interactive ? (event) => showTipAtPointer(country, event) : undefined}
            />
          )
        })}
        {interactive && showCountryNames && mapModel.shapes.map(({ country, labelX, labelY }) => {
          const status = countryStatuses[country.id] ?? 'never'
          if (status === 'never') return null
          return (
            <text
              key={`${country.id}-label`}
              aria-hidden="true"
              className="pointer-events-none select-none font-bold"
              fill="#183a2c"
              paintOrder="stroke"
              stroke="#fffdf7"
              strokeLinejoin="round"
              strokeWidth="3.5"
              textAnchor="middle"
              x={labelX}
              y={labelY}
            >
              {country.name}
            </text>
          )
        })}
      </svg>
      {interactive && <p className="sr-only">মানচিত্রে {mapModel.shapes.length}টি দেশের সীমানা আছে। Tab ব্যবহার করে দেশ ফোকাস বা সিলেক্ট করুন।</p>}
    </div>
  )
}
