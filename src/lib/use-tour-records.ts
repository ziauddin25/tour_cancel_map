'use client'

import { useSyncExternalStore } from 'react'
import { getCurrentTourRecords } from '@/lib/stats'
import { getServerStoredState, readStoredState, saveStoredState, subscribeStoredState } from '@/lib/storage'
import type { TourRecord, TourStatus } from '@/types/tour'

type RecordDraft = Omit<TourRecord, 'id' | 'createdAt'>

export function useTourRecords() {
  const records = useSyncExternalStore(subscribeStoredState, readStoredState, getServerStoredState)

  function saveRecord(draft: RecordDraft) {
    const current = readStoredState()
    const currentRecord = getCurrentTourRecords(current).find(
      (record) => record.locationId === draft.locationId && record.locationType === draft.locationType,
    )
    const recordIndex = currentRecord ? current.findIndex((record) => record.id === currentRecord.id) : -1

    if (recordIndex >= 0 && currentRecord?.status === draft.status) {
      const updated = current.slice()
      updated[recordIndex] = { ...currentRecord, ...draft }
      saveStoredState(updated)
      return
    }

    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${draft.locationType}-${draft.locationId}-${Date.now()}`
    saveStoredState([...current, { ...draft, id, createdAt: new Date().toISOString() }])
  }

  function updateNote(recordId: string, note: string) {
    const current = readStoredState()
    const index = current.findIndex((record) => record.id === recordId)
    if (index < 0) return
    const updated = current.slice()
    updated[index] = { ...updated[index], note: note.trim() || undefined }
    saveStoredState(updated)
  }

  function getStatus(locationType: TourRecord['locationType']): Record<string, TourStatus> {
    return Object.fromEntries(
      getCurrentTourRecords(records)
        .filter((record) => record.locationType === locationType)
        .map((record) => [record.locationId, record.status]),
    )
  }

  function getRecord(locationId: string, locationType: TourRecord['locationType']) {
    return getCurrentTourRecords(records).find(
      (record) => record.locationId === locationId && record.locationType === locationType,
    ) ?? null
  }

  return { records, saveRecord, updateNote, getStatus, getRecord }
}