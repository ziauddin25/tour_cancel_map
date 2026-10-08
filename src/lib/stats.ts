export type BasicStats = {
  totalPlans: number
  totalCompleted: number
  totalCancelled: number
  totalOneDay: number
  totalNeverPlanned: number
  cancellationRate: number | null
  mostCancelledDistrict: string | null
  mostCommonCancellationReason: string | null
}

export function getEmptyStats(): BasicStats {
  return {
    totalPlans: 0,
    totalCompleted: 0,
    totalCancelled: 0,
    totalOneDay: 0,
    totalNeverPlanned: 0,
    cancellationRate: null,
    mostCancelledDistrict: null,
    mostCommonCancellationReason: null,
  }
}

export function calculateCancellationRate(cancelled: number, total: number) {
  if (total <= 0) return null
  return Number(((cancelled / total) * 100).toFixed(1))
}

export function getCurrentTourRecords(records: TourRecord[]) {
  const current = new Map<string, TourRecord>()
  for (const record of records) {
    current.set(`${record.locationType}:${record.locationId}`, record)
  }
  return [...current.values()]
}

import type { TourRecord } from '@/types/tour'

export function getTourStats(records: TourRecord[], locationType: TourRecord['locationType']): BasicStats {
  const current = getCurrentTourRecords(records).filter((record) => record.locationType === locationType)
  const visited = current.filter((record) => record.status === 'visited').length
  const cancelled = current.filter((record) => record.status === 'cancelled').length
  const cancellationRecords = records.filter((record) => record.locationType === locationType && record.status === 'cancelled')
  const cancelledDistrictCounts = new Map<string, number>()
  const reasonCounts = new Map<string, number>()

  for (const record of cancellationRecords) {
    cancelledDistrictCounts.set(record.locationId, (cancelledDistrictCounts.get(record.locationId) ?? 0) + 1)
    if (record.reason) reasonCounts.set(record.reason, (reasonCounts.get(record.reason) ?? 0) + 1)
  }

  function uniqueLeader(counts: Map<string, number>) {
    const highestCount = Math.max(0, ...counts.values())
    const leaders = [...counts.entries()].filter(([, count]) => count === highestCount)
    return leaders.length === 1 ? leaders[0][0] : null
  }

  const mostCancelledId = uniqueLeader(cancelledDistrictCounts)
  const mostCommonReason = uniqueLeader(reasonCounts)

  return {
    totalPlans: current.filter((record) => record.status === 'planned').length,
    totalCompleted: visited,
    totalCancelled: cancelled,
    totalOneDay: current.filter((record) => record.status === 'one-day').length,
    totalNeverPlanned: current.filter((record) => record.status === 'never').length,
    cancellationRate: calculateCancellationRate(cancelled, cancelled + visited),
    mostCancelledDistrict: mostCancelledId,
    mostCommonCancellationReason: mostCommonReason,
  }
}
