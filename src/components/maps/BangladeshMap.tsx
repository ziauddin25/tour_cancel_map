'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { districts } from '@/data/bangladesh/districts'
import type { Language } from '@/lib/language'
import type { District, DistrictStatuses, TourStatus } from '@/types/tour'

type Geometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }

type BoundaryFeature = {
  properties: { shapeName: string }
  geometry: Geometry
}

type BoundaryDataset = { features: BoundaryFeature[] }
type MapShape = { district: District; path: string; labelX: number; labelY: number }
let boundaryRequest: Promise<BoundaryDataset> | null = null

const statusColors: Record<TourStatus, string> = {
  visited: '#4f9b68',
  planned: '#e3b94f',
  cancelled: '#d95e56',
  'one-day': '#9a70bd',
  never: '#d6e2d2',
}

const boundaryAliases: Record<string, string> = {
  barisal: 'barishal',
  bogra: 'bogura',
  brahamanbaria: 'brahmanbaria',
  chittagong: 'chattogram',
  comilla: 'cumilla',
  jessore: 'jashore',
  maulvibazar: 'moulvibazar',
  nawabganj: 'chapainawabganj',
  netrakona: 'netrokona',
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getPolygons(geometry: Geometry) {
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
}

function loadBoundaryDataset() {
  boundaryRequest ??= fetch('/maps/bangladesh-districts.geojson')
    .then((response) => {
      if (!response.ok) throw new Error('Map data could not be loaded')
      return response.json() as Promise<BoundaryDataset>
    })
    .catch((error: unknown) => {
      boundaryRequest = null
      throw error
    })
  return boundaryRequest
}

function createMapShapes(dataset: BoundaryDataset): { shapes: MapShape[]; viewBox: string } {
  const districtsByName = new Map(districts.map((district) => [normalizeName(district.nameEn), district]))
  const mapped = dataset.features.flatMap((feature) => {
    const normalizedName = normalizeName(feature.properties.shapeName)
    const districtId = boundaryAliases[normalizedName] ?? normalizedName
    const district = districtsByName.get(districtId)
    return district ? [{ district, geometry: feature.geometry }] : []
  })

  const longitudeScale = Math.cos((23.5 * Math.PI) / 180)
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const { geometry } of mapped) {
    for (const polygon of getPolygons(geometry)) {
      for (const ring of polygon) {
        for (const [longitude, latitude] of ring) {
          const x = longitude * longitudeScale
          const y = -latitude
          minX = Math.min(minX, x)
          maxX = Math.max(maxX, x)
          minY = Math.min(minY, y)
          maxY = Math.max(maxY, y)
        }
      }
    }
  }
  const width = 680
  const height = 900
  const padding = 22
  const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY))
  const offsetX = (width - (maxX - minX) * scale) / 2
  const offsetY = (height - (maxY - minY) * scale) / 2
  const project = ([longitude, latitude]: number[]) => [
    offsetX + (longitude * longitudeScale - minX) * scale,
    offsetY + (-latitude - minY) * scale,
  ]

  const shapes = mapped.map(({ district, geometry }) => {
    const polygons = getPolygons(geometry)
    const path = polygons.flatMap((rings) => rings.map((ring) => {
      const points = ring.map((coordinate) => project(coordinate))
      return `${points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')} Z`
    })).join(' ')

    let labelX = 0
    let labelY = 0
    let largestArea = 0
    for (const polygon of polygons) {
      const points = polygon[0]?.map((coordinate) => project(coordinate)) ?? []
      let twiceArea = 0
      let centerX = 0
      let centerY = 0
      for (let index = 0; index < points.length; index += 1) {
        const [x, y] = points[index]
        const [nextX, nextY] = points[(index + 1) % points.length]
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

    return { district, path, labelX, labelY }
  })

  return { shapes, viewBox: `0 0 ${width} ${height}` }
}

type BangladeshMapProps = {
  districtStatuses: DistrictStatuses
  divisionId: string
  selectedDistrictId: string | null
  onSelectDistrict: (district: District) => void
  interactive?: boolean
  className?: string
  language?: Language
  showDistrictNames?: boolean
  large?: boolean
}

export function BangladeshMap({ districtStatuses, divisionId, selectedDistrictId, onSelectDistrict, interactive = true, className, language = 'bn', showDistrictNames = true, large = false }: BangladeshMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dataset, setDataset] = useState<BoundaryDataset | null>(null)
  const [error, setError] = useState(false)
  const [tip, setTip] = useState<{ district: District; x: number; y: number } | null>(null)

  function showTipAtPointer(district: District, event: ReactPointerEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return
    setTip({
      district,
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  useEffect(() => {
    let active = true
    loadBoundaryDataset()
      .then(setDataset)
      .catch(() => {
        if (active) setError(true)
      })
    return () => { active = false }
  }, [])

  const mapModel = useMemo(() => (dataset ? createMapShapes(dataset) : null), [dataset])

  if (error) {
    return <p className="px-4 py-16 text-center text-sm text-[#9a433c]">মানচিত্র লোড করা যায়নি। পৃষ্ঠাটি আবার খুলে দেখুন।</p>
  }
  if (!mapModel) {
    return <div className="grid min-h-[420px] place-items-center text-sm text-[#69756b] sm:min-h-[620px]">জেলার মানচিত্র তৈরি হচ্ছে...</div>
  }

  const [, , viewWidth, viewHeight] = mapModel.viewBox.split(' ').map(Number)
  const tipStatus = tip ? districtStatuses[tip.district.id] : undefined

  return (
    <div aria-hidden={!interactive} ref={containerRef} className={`relative mx-auto w-full ${large ? 'max-w-[520px]' : 'max-w-[640px]'} ${className ?? ''}`}>
      {interactive && tip && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[150%] whitespace-nowrap rounded-lg bg-[#17201c] px-2.5 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.22)]"
          style={{ left: `${tip.x}%`, top: `${tip.y}%` }}
          role="status"
        >
          {tipStatus && <span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full align-middle" style={{ backgroundColor: statusColors[tipStatus] }} />}
          {language === 'bn' ? tip.district.name : tip.district.nameEn}
          {tipStatus ? ' ✓' : ''}
        </div>
      )}
      <svg aria-label={interactive ? (language === 'bn' ? 'বাংলাদেশের ৬৪ জেলার ইন্টার‌্যাকটিভ মানচিত্র' : 'Interactive map of the 64 districts of Bangladesh') : undefined} className="block h-auto w-full overflow-visible" role={interactive ? 'group' : undefined} viewBox={mapModel.viewBox}>
        <title>{language === 'bn' ? 'বাংলাদেশের জেলা মানচিত্র' : 'Map of Bangladesh districts'}</title>
        {mapModel.shapes.map(({ district, path, labelX, labelY }) => {
          const isDimmed = divisionId !== 'all' && district.divisionId !== divisionId
          const isSelected = selectedDistrictId === district.id
          const status = districtStatuses[district.id] ?? 'never'
          return (
            <path
              key={district.id}
              aria-label={interactive ? `${language === 'bn' ? district.name : district.nameEn}, ${status}` : undefined}
              aria-pressed={interactive ? isSelected : undefined}
              className={`district-shape ${interactive ? '' : 'pointer-events-none'}`}
              d={path}
              fill={statusColors[status]}
              fillRule="evenodd"
              opacity={isDimmed ? 0.24 : 1}
              role={interactive ? 'button' : undefined}
              stroke={isSelected ? '#263d2e' : '#ffffff'}
              strokeWidth={isSelected ? 2.8 : 1.4}
              tabIndex={interactive ? 0 : -1}
              onBlur={interactive ? () => setTip(null) : undefined}
              onClick={interactive ? () => onSelectDistrict(district) : undefined}
              onFocus={interactive ? () => setTip({ district, x: (labelX / viewWidth) * 100, y: (labelY / viewHeight) * 100 }) : undefined}
              onKeyDown={interactive ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectDistrict(district)
                }
              } : undefined}
              onPointerDown={interactive ? (event) => showTipAtPointer(district, event) : undefined}
              onPointerLeave={interactive ? () => setTip(null) : undefined}
              onPointerMove={interactive ? (event) => showTipAtPointer(district, event) : undefined}
            />
          )
        })}
        {interactive && showDistrictNames && mapModel.shapes.map(({ district, labelX, labelY }) => {
          const status = districtStatuses[district.id] ?? 'never'
          if (status === 'never' || (divisionId !== 'all' && district.divisionId !== divisionId)) return null
          return (
            <text
              key={`${district.id}-label`}
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
              {language === 'bn' ? district.name : district.nameEn}
            </text>
          )
        })}
      </svg>
      {interactive && <p className="sr-only">{language === 'bn' ? `মানচিত্রে ${mapModel.shapes.length}টি জেলা দেখানো হয়েছে। জেলার নাম শুনতে বা নির্বাচন করতে Tab ব্যবহার করুন।` : `${mapModel.shapes.length} districts are shown. Use Tab to focus or select a district.`}</p>}
    </div>
  )
}
