'use client'

import { useRef, useState } from 'react'
import { Camera, UserRound } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { text } from '@/lib/i18n'
import type { Language } from '@/lib/language'
import type { UserProfile } from '@/types/tour'

type MapProfileHeaderProps = {
  profile: UserProfile
  language: Language
  onProfileChange: (profile: UserProfile) => void
}

async function resizeProfileImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file')
  if (file.size > 8 * 1024 * 1024) throw new Error('Image is too large')

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 480 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image could not be processed')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.8)
}

export function MapProfileHeader({ profile, language, onProfileChange }: MapProfileHeaderProps) {
  const copy = text(language)
  const imageInput = useRef<HTMLInputElement>(null)
  const [imageError, setImageError] = useState(false)

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const image = await resizeProfileImage(file)
      onProfileChange({ ...profile, image })
      setImageError(false)
    } catch {
      setImageError(true)
    }
  }

  return (
    <section aria-label={copy.yourMap} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <input ref={imageInput} accept="image/*" className="sr-only" type="file" onChange={handleImageChange} />
        <Button
          aria-label={copy.profileImage}
          className="group cursor-pointer relative size-12 overflow-hidden rounded-full border border-[#dce4d9] bg-[#edf2eb] p-0 text-[#58745d]"
          type="button"
          variant="ghost"
          onClick={() => imageInput.current?.click()}
        >
          {profile.image
            ? <Image alt="" className="size-full object-cover" height={48} src={profile.image} unoptimized width={48} />
            : profile.name.trim()
              ? <span className="text-lg font-bold">{profile.name.trim().slice(0, 1).toLocaleUpperCase()}</span>
              : <UserRound className="size-5" />}
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-[#203126]/65 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Camera className="size-4" />
          </span>
        </Button>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="map-profile-name">{copy.profileNameLabel}</label>
          <input
            autoComplete="name"
            className="py-2.5 px-1.5 rounded-md w-full max-w-[280px] border border-[#d9e1d8] bg-transparent text-xs text-[#647168] outline-none placeholder:text-[#9aa49b] focus:border-[#4f8059]"
            id="map-profile-name"
            maxLength={50}
            placeholder={copy.profileNamePlaceholder}
            value={profile.name}
            onChange={(event) => onProfileChange({ ...profile, name: event.target.value })}
          />
          {imageError && <p role="alert" className="mt-1 text-[10px] text-[#b14b43]">{copy.profileImageError}</p>}
        </div>
      </div>

      {/* <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-[#526056] sm:px-2">
        <input
          checked={profile.showDistrictNames ?? true}
          className="size-4 accent-[#287657]"
          type="checkbox"
          onChange={(event) => onProfileChange({ ...profile, showDistrictNames: event.target.checked })}
        />
        {copy.districtNameToggle}
      </label> */}
    </section>
  )
}