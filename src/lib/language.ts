'use client'

import { useSyncExternalStore } from 'react'

export type Language = 'bn' | 'en'

const LANGUAGE_KEY = 'tour-cancel-map:language:v1'
const LANGUAGE_EVENT = 'tour-cancel-map:language-change'

function readLanguage(): Language {
  if (typeof window === 'undefined') return 'bn'
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'bn'
  } catch {
    return 'bn'
  }
}

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined') return () => undefined
  window.addEventListener('storage', onChange)
  window.addEventListener(LANGUAGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(LANGUAGE_EVENT, onChange)
  }
}

export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, readLanguage, (): Language => 'bn')
}

export function setLanguage(language: Language) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LANGUAGE_KEY, language)
  } catch {
    // Keep the current page usable if language storage is unavailable.
  }
  document.documentElement.lang = language
  window.dispatchEvent(new Event(LANGUAGE_EVENT))
}