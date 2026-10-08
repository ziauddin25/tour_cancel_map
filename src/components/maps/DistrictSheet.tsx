'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Button } from '@/components/ui/button'
import { cancellationReasons } from '@/data/cancellation-reasons'
import { generateExcuse } from '@/lib/excuses'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'
import type { TourLocation, TourRecord, TourStatus } from '@/types/tour'

const statusOptions: { value: TourStatus; labelKey: 'visited' | 'planned' | 'cancelled' | 'oneDay' | 'never'; emoji: string; color: string }[] = [
  { value: 'visited', labelKey: 'visited', emoji: '🟢', color: '#397a4e' },
  { value: 'planned', labelKey: 'planned', emoji: '🟡', color: '#b48b23' },
  { value: 'cancelled', labelKey: 'cancelled', emoji: '🔴', color: '#bd4840' },
  { value: 'one-day', labelKey: 'oneDay', emoji: '🟣', color: '#8053a6' },
  { value: 'never', labelKey: 'never', emoji: '⚫', color: '#566159' },
]

type DistrictSheetProps = {
  location: TourLocation | null
  record: TourRecord | null
  status: TourStatus
  onSave: (record: Omit<TourRecord, 'id' | 'createdAt'>) => void
  onClose: () => void
}

export function DistrictSheet({ location, record, status, onSave, onClose }: DistrictSheetProps) {
  const language = useLanguage()
  const copy = text(language)
  const [draftStatus, setDraftStatus] = useState<TourStatus>(status)
  const [excuse, setExcuse] = useState('')
  const [excuseFor, setExcuseFor] = useState<string | null>(null)
  const [reason, setReason] = useState(record?.reason ?? '')
  const [customReason, setCustomReason] = useState(record?.customReason ?? '')
  const [note, setNote] = useState(record?.note ?? '')

  if (location && excuseFor !== location.id) {
    setExcuseFor(location.id)
    setExcuse(generateExcuse())
  }

  const statusMessages: Partial<Record<TourStatus, string>> = {
    visited: copy.visitedMessage,
    cancelled: copy.cancelledMessage,
    'one-day': copy.oneDayMessage,
  }

  const canSave = draftStatus !== 'cancelled' || (reason !== '' && (reason !== 'other' || customReason.trim() !== ''))

  return (
    <Dialog.Root open={location !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#17231b]/35 backdrop-blur-[2px]" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <Dialog.Popup className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#d9e0d7] bg-[#fcfdfb] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl outline-none sm:rounded-xl sm:p-6">
            {location && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-[#203126]">{location.name}</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-[#748075]">{location.nameEn} · {location.subtitle ?? (location.locationType === 'district' ? copy.bangladesh : copy.world)}</Dialog.Description>
                  </div>
                  <Dialog.Close render={<Button aria-label={copy.close} className="size-10 cursor-pointer text-[#647168]" size="icon" variant="ghost" />}>
                    <X className="size-5" />
                  </Dialog.Close>
                </div>

                <form onSubmit={(event) => {
                  event.preventDefault()
                  if (!canSave) return
                  onSave({
                    locationId: location.id,
                    locationType: location.locationType,
                    locationName: location.name,
                    status: draftStatus,
                    reason: draftStatus === 'cancelled' ? reason : undefined,
                    customReason: draftStatus === 'cancelled' && reason === 'other' ? customReason.trim() : undefined,
                    note: note.trim() || undefined,
                  })
                }}>
                  <fieldset className="mt-7 space-y-2">
                    <legend className="mb-3 text-sm font-semibold text-[#36463a]">{copy.sheetStatus}</legend>
                    {statusOptions.map(({ labelKey, ...option }) => (
                      <label key={option.value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 transition-colors focus-within:ring-3 focus-within:ring-[#52825d]/20 ${draftStatus === option.value ? 'border-[#7b9b7d] bg-[#f0f5ef]' : 'border-[#e1e6df] bg-white hover:bg-[#f7f9f6]'}`}>
                        <input checked={draftStatus === option.value} className="size-4 accent-[#4f8059]" name={`status-${location.id}`} type="radio" value={option.value} onChange={() => {
                          setDraftStatus(option.value)
                          if (option.value === 'cancelled') setExcuse(generateExcuse())
                        }} />
                        <span aria-hidden="true" className="text-base">{option.emoji}</span>
                        <span className="text-sm font-medium" style={{ color: option.color }}>{copy[labelKey]}</span>
                      </label>
                    ))}
                  </fieldset>

                  {draftStatus === 'cancelled' && (
                    <fieldset className="mt-6">
                      <legend className="mb-3 text-sm font-semibold text-[#36463a]">{copy.reasonTitle} <span className="text-[#b14b43]">* {copy.required}</span></legend>
                      <div className="grid grid-cols-2 gap-2">
                        {cancellationReasons.map((option) => (
                          <label key={option.id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs transition-colors focus-within:ring-3 focus-within:ring-[#52825d]/20 ${reason === option.id ? 'border-[#c9766f] bg-[#fff3f1] text-[#9b3f38]' : 'border-[#e1e6df] bg-white text-[#58665c] hover:bg-[#f7f9f6]'}`}>
                            <input checked={reason === option.id} className="size-3.5 accent-[#bd4840]" name={`reason-${location.id}`} type="radio" value={option.id} onChange={() => setReason(option.id)} />
                            <span>{language === 'bn' ? option.label : option.labelEn}</span>
                          </label>
                        ))}
                      </div>
                      {reason === 'other' && (
                        <input aria-label={copy.customReason} className="mt-3 h-11 w-full rounded-lg border border-[#d7ded5] bg-white px-3 text-sm outline-none focus:border-[#52825d] focus:ring-3 focus:ring-[#52825d]/20" maxLength={80} placeholder={copy.customReason} value={customReason} onChange={(event) => setCustomReason(event.target.value)} />
                      )}
                    </fieldset>
                  )}

                  <label className="mt-5 block text-sm font-semibold text-[#36463a]" htmlFor={`note-${location.id}`}>{copy.noteLabel} <span className="font-normal text-[#879188]">{copy.optional}</span></label>
                  <textarea id={`note-${location.id}`} className="mt-2 min-h-20 w-full resize-y rounded-lg border border-[#d7ded5] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#9ca69e] focus:border-[#52825d] focus:ring-3 focus:ring-[#52825d]/20" maxLength={280} placeholder={copy.notePlaceholder} value={note} onChange={(event) => setNote(event.target.value)} />

                  <div className="mt-5 flex items-center justify-between gap-3 pt-4">
                    <p aria-live="polite" className="min-h-5 text-xs text-[#69756b]">{statusMessages[draftStatus] ?? ''}</p>
                    <Button className="h-11 shrink-0 cursor-pointer px-5 bg-[#263d2e] hover:bg-[#365640] text-white" disabled={!canSave} type="submit">{copy.saveRecord}</Button>
                  </div>
                </form>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}