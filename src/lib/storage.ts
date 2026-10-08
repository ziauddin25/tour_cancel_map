import type { TourRecord, TourStatus } from '@/types/tour'

export const STORAGE_KEY = 'tour-cancel-map:records:v1'
const STORAGE_EVENT = 'tour-cancel-map:storage-update'
const EMPTY_RECORDS: TourRecord[] = []

const statuses: TourStatus[] = ['visited', 'planned', 'cancelled', 'one-day', 'never']
let cachedValue: string | null = null
let cachedRecords = EMPTY_RECORDS

function isTourRecord(value: unknown): value is TourRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<TourRecord>
  return typeof record.id === 'string'
    && typeof record.locationId === 'string'
    && (record.locationType === 'district' || record.locationType === 'country')
    && statuses.includes(record.status as TourStatus)
    && typeof record.createdAt === 'string'
}

function parseStoredState(value: string | null): TourRecord[] {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isTourRecord) : EMPTY_RECORDS
  } catch {
    return EMPTY_RECORDS
  }
}

export function readStoredState(): TourRecord[] {
  if (typeof window === 'undefined') return EMPTY_RECORDS
  let value: string | null = null
  try {
    value = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return EMPTY_RECORDS
  }
  if (value !== cachedValue) {
    cachedValue = value
    cachedRecords = parseStoredState(value)
  }
  return cachedRecords
}

export function subscribeStoredState(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(STORAGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(STORAGE_EVENT, onStoreChange)
  }
}

export function getServerStoredState() {
  return EMPTY_RECORDS
}

export function saveStoredState(records: TourRecord[]) {
  if (typeof window === 'undefined') return

  try {
    const value = JSON.stringify(records)
    window.localStorage.setItem(STORAGE_KEY, value)
    cachedValue = value
    cachedRecords = records
    window.dispatchEvent(new Event(STORAGE_EVENT))
  } catch {
    // Storage can be unavailable in private browsing or when the device is full.
  }
}
