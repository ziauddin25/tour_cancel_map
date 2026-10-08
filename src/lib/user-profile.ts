'use client'

import { useSyncExternalStore } from 'react'
import type { UserProfile } from '@/types/tour'

const PROFILE_KEY = 'tour-cancel-map:profile:v1'
const PROFILE_EVENT = 'tour-cancel-map:profile-update'
const EMPTY_PROFILE: UserProfile = { name: 'Zia' }
let cachedValue: string | null = null
let cachedProfile = EMPTY_PROFILE

function parseProfile(value: string | null): UserProfile {
  try {
    const parsed: unknown = JSON.parse(value ?? '{}')
    if (!parsed || typeof parsed !== 'object') return EMPTY_PROFILE
    const profile = parsed as Partial<UserProfile>
    return {
      name: typeof profile.name === 'string' ? profile.name.slice(0, 50) : '',
      image: typeof profile.image === 'string' && profile.image.startsWith('data:image/') ? profile.image : undefined,
      showDistrictNames: typeof profile.showDistrictNames === 'boolean' ? profile.showDistrictNames : true,
    }
  } catch {
    return EMPTY_PROFILE
  }
}

function readProfile() {
  if (typeof window === 'undefined') return EMPTY_PROFILE
  let value: string | null
  try {
    value = window.localStorage.getItem(PROFILE_KEY)
  } catch {
    return EMPTY_PROFILE
  }
  if (value !== cachedValue) {
    cachedValue = value
    cachedProfile = parseProfile(value)
  }
  return cachedProfile
}

function subscribeProfile(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(PROFILE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(PROFILE_EVENT, onStoreChange)
  }
}

export function useUserProfile() {
  return useSyncExternalStore(subscribeProfile, readProfile, () => EMPTY_PROFILE)
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') return
  const sanitized = {
    name: profile.name.slice(0, 50),
    image: profile.image,
    showDistrictNames: profile.showDistrictNames ?? true,
  }
  try {
    const value = JSON.stringify(sanitized)
    window.localStorage.setItem(PROFILE_KEY, value)
    cachedValue = value
    cachedProfile = sanitized
    window.dispatchEvent(new Event(PROFILE_EVENT))
  } catch {
    return false
  }
  return true
}