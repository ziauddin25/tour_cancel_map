export type TourStatus = 'visited' | 'planned' | 'cancelled' | 'one-day' | 'never'

export type District = {
  id: string
  name: string
  nameEn: string
  divisionId: string
  divisionName: string
}

export type DistrictStatuses = Record<string, TourStatus>

export type TourRecord = {
  id: string
  locationId: string
  locationType: 'district' | 'country'
  locationName?: string
  status: TourStatus
  reason?: string
  customReason?: string
  note?: string
  plannedDate?: string
  cancelledDate?: string
  createdAt: string
}

export type CancellationReason = {
  id: string
  label: string
  labelEn: string
}

export type TourLocation = {
  id: string
  name: string
  nameEn: string
  locationType: TourRecord['locationType']
  subtitle?: string
}

export type UserProfile = {
  name: string
  image?: string
  showDistrictNames?: boolean
}

export type TourTheme = 'classic' | 'dark' | 'minimal' | 'funny' | 'midnight'
