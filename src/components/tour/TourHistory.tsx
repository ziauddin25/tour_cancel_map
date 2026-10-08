'use client'

import { useState } from 'react'
import { CalendarDays, ChevronDown, ChevronUp, Clock3, StickyNote, X } from 'lucide-react'
import { Dialog } from '@base-ui/react/dialog'
import { Button } from '@/components/ui/button'
import { cancellationReasons } from '@/data/cancellation-reasons'
import { useLanguage } from '@/lib/language'
import { useTourRecords } from '@/lib/use-tour-records'
import { text } from '@/lib/i18n'
import type { TourRecord, TourStatus } from '@/types/tour'

const MAX_VISIBLE = 10

const statusMeta: Record<TourStatus, { key: 'visited' | 'planned' | 'cancelled' | 'oneDay' | 'never'; color: string }> = {
  visited: { key: 'visited', color: '#397a4e' },
  planned: { key: 'planned', color: '#b48b23' },
  cancelled: { key: 'cancelled', color: '#bd4840' },
  'one-day': { key: 'oneDay', color: '#8053a6' },
  never: { key: 'never', color: '#566159' },
}

type TourHistoryProps = {
  records: TourRecord[]
  locationName: (record: TourRecord) => string
}

type NoteDialogProps = {
  record: TourRecord
  locationName: (record: TourRecord) => string
  copy: ReturnType<typeof text>
}

function NoteDialog({ record, locationName, copy }: NoteDialogProps) {
  const { updateNote } = useTourRecords()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(record.note ?? '')
  const meta = statusMeta[record.status]

  const save = () => {
    updateNote(record.id, draft)
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => {
      setOpen(next)
      if (next) setDraft(record.note ?? '')
    }}>
      <Dialog.Trigger
        render={<Button aria-label={copy.historyColNote} className={`cursor-pointer gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${record.note ? 'bg-[#eaf2e9] text-[#45804f]' : 'text-[#9aa69c] hover:bg-[#f1f5ef] hover:text-[#536157]'}`} variant="ghost" />}
      >
        <StickyNote className="size-3.5" />
        {copy.historyColNote}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#17231b]/35 backdrop-blur-[2px]" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <Dialog.Popup className="w-full max-w-md rounded-t-2xl border border-[#d9e0d7] bg-[#fcfdfb] p-5 shadow-2xl outline-none sm:rounded-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-bold text-[#203126]">{locationName(record)}</Dialog.Title>
                <p className="mt-1 text-xs font-medium" style={{ color: meta.color }}>
                  {copy[meta.key]}
                </p>
              </div>
              <Dialog.Close render={<Button aria-label={copy.close} className="size-9 cursor-pointer text-[#647168]" size="icon" variant="ghost" />}>
                <X className="size-4" />
              </Dialog.Close>
            </div>
            {record.note ? (
              <p className="mt-4 whitespace-pre-wrap rounded-lg border border-[#dfe6dd] bg-[#f7faf6] px-3 py-2.5 text-sm leading-6 text-[#36463a]">
                {record.note}
              </p>
            ) : (
              <>
                <label className="mt-4 block text-sm font-semibold text-[#36463a]" htmlFor={`note-editor-${record.id}`}>{copy.noteLabel}</label>
                <textarea
                  autoFocus
                  className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[#d7ded5] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#9ca69e] focus:border-[#52825d] focus:ring-3 focus:ring-[#52825d]/20"
                  id={`note-editor-${record.id}`}
                  maxLength={280}
                  placeholder={copy.notePlaceholder}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Button className="cursor-pointer p-5 bg-[#263d2e] hover:bg-[#365640] text-white" onClick={save} type="button">{copy.saveRecord}</Button>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function TourHistory({ records, locationName }: TourHistoryProps) {
  const language = useLanguage()
  const copy = text(language)
  const [showAll, setShowAll] = useState(false)

  const sortedRecords = [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const visibleRecords = showAll ? sortedRecords : sortedRecords.slice(0, MAX_VISIBLE)
  const hasMore = sortedRecords.length > MAX_VISIBLE
  const dateFormat = new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'medium' })

  return (
    <section aria-labelledby="tour-history-title" className="border-t border-[#dce4d9] py-8 sm:py-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#829087]">{copy.historyEyebrow}</p>
          <h2 className="mt-1 text-xl font-bold text-[#26392d] sm:text-2xl" id="tour-history-title">{copy.historyTitle}</h2>
        </div>
        <p className="text-xs text-[#758076]">{copy.recordCount(records.length)}</p>
      </div>

      {sortedRecords.length === 0 ? (
        <div className="border-y border-dashed border-[#d5ded3] py-9 text-center">
          <Clock3 aria-hidden="true" className="mx-auto size-5 text-[#8c998e]" />
          <p className="mt-3 text-sm font-medium text-[#405046]">{copy.emptyHistory}</p>
          <p className="mt-1 text-xs text-[#869188]">{copy.emptyHistoryHelp}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#dfe6dd]">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#dfe6dd] bg-[#f1f5ef]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#758076]">#</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#758076]">{copy.historyColStatus}</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#758076]">{copy.historyColPlace}</th>
                  <th className="hidden px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#758076] md:table-cell">{copy.historyColReason}</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#758076]">{copy.historyColNote}</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#758076]">{copy.historyColDate}</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ede6]">
                {visibleRecords.map((record, index) => {
                  const meta = statusMeta[record.status]
                  const reason = cancellationReasons.find((r) => r.id === record.reason)
                  const reasonLabel = reason ? (language === 'bn' ? reason.label : reason.labelEn) : record.customReason
                  return (
                    <tr className="transition-colors hover:bg-[#f7faf6]" key={record.id}>
                      <td className="px-4 py-3 text-xs tabular-nums text-[#9aa69c]">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold" style={{ color: meta.color }}>
                          <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                          {copy[meta.key]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#29392e]">{locationName(record)}</p>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <p className={`max-w-[260px] truncate text-xs ${reasonLabel ? 'text-[#5c6b60]' : 'text-[#a3ada6]'}`} title={reasonLabel}>{reasonLabel ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <NoteDialog copy={copy} locationName={locationName} record={record} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="flex items-center gap-1.5 text-[11px] text-[#879188]">
                          <CalendarDays aria-hidden="true" className="size-3.5 shrink-0" />
                          {dateFormat.format(new Date(record.createdAt))}
                        </p>
                      </td>
                      <td className="px-4 py-3" />
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="mt-4 text-center flex justify-end">
              <Button className="h-10 cursor-pointer gap-1.5 p-5 bg-[#263d2e] hover:bg-[#365640] text-white" onClick={() => setShowAll((value) => !value)} variant="ghost">
                {showAll ? copy.showLess : copy.allRecords}
                {showAll ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}