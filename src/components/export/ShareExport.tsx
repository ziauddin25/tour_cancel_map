'use client'

import { useState, type RefObject } from 'react'
import { Copy, Download, FileText, ImageDown } from 'lucide-react'
import { toBlob, toJpeg, toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'

type ShareExportProps = {
  targetRef: RefObject<HTMLElement | null>
  savedCount: number
  title: string
  placeLabel: string
}

export function ShareExport({ targetRef, savedCount, title, placeLabel }: ShareExportProps) {
  const language = useLanguage()
  const copy = text(language)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function downloadPng() {
    if (!targetRef.current) return
    setBusy(true)
    try {
      const image = await toPng(targetRef.current, { pixelRatio: 2, backgroundColor: '#f2efe5' })
      const link = document.createElement('a')
      link.download = 'tour-cancel-map.png'
      link.href = image
      link.click()
      setMessage(copy.pngStarted)
    } catch {
      setMessage(copy.cardFailed)
    } finally {
      setBusy(false)
    }
  }

  async function downloadJpg() {
    if (!targetRef.current) return
    setBusy(true)
    try {
      const image = await toJpeg(targetRef.current, { pixelRatio: 2, quality: 0.94, backgroundColor: '#f2efe5' })
      const link = document.createElement('a')
      link.download = 'tour-cancel-map.jpg'
      link.href = image
      link.click()
      setMessage(copy.jpgStarted)
    } catch {
      setMessage(copy.cardFailed)
    } finally {
      setBusy(false)
    }
  }

  async function downloadPdf() {
    if (!targetRef.current) return
    setBusy(true)
    try {
      const image = await toPng(targetRef.current, { pixelRatio: 2, backgroundColor: '#f2efe5' })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const width = 190
      const height = (targetRef.current.offsetHeight / targetRef.current.offsetWidth) * width
      pdf.addImage(image, 'PNG', 10, 18, width, height)
      pdf.save('tour-cancel-map.pdf')
      setMessage(copy.pdfStarted)
    } catch {
      setMessage(copy.pdfFailed)
    } finally {
      setBusy(false)
    }
  }

  async function copyCard() {
    if (!targetRef.current) return
    setBusy(true)
    try {
      const blob = await toBlob(targetRef.current, { pixelRatio: 2, backgroundColor: '#f2efe5' })
      if (!blob) throw new Error('Share card image is unavailable')
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setMessage(copy.copiedCard)
    } catch {
      try {
        await navigator.clipboard.writeText(copy.copyText(title, savedCount))
        setMessage(copy.copiedText)
      } catch {
        setMessage(copy.copyFailed)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="share-title" className="border-t w-full border-[#dce4d9] py-7 sm:py-8" id="download-map">
      <div className="mb-4">
        {/* <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#829087]">{copy.shareEyebrow}</p> */}
        <h2 className="mt-1 text-lg font-bold text-[#26392d] sm:text-xl" id="share-title">{copy.shareTitle}</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Button className="h-14 gap-2 border-[#e5e0d5] bg-white text-sm cursor-pointer text-[#26392d] hover:bg-[#f7f6f1]" disabled={busy} onClick={downloadPng}><Download />PNG</Button>
        <Button className="h-14 gap-2 border-[#e5e0d5] bg-white text-sm cursor-pointer text-[#26392d] hover:bg-[#f7f6f1]" disabled={busy} variant="outline" onClick={downloadJpg}><ImageDown />JPG</Button>
        <Button className="h-14 gap-2 border-[#e5e0d5] bg-white text-sm cursor-pointer text-[#26392d] hover:bg-[#f7f6f1]" disabled={busy} variant="outline" onClick={downloadPdf}><FileText />PDF</Button>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="min-h-5 text-xs text-[#758076]">{message}</p>
        <Button className="h-9 gap-2 px-2 text-xs text-[#69756b] cursor-pointer" disabled={busy} variant="ghost" onClick={copyCard}><Copy />{copy.copyShare}</Button>
      </div>
    </section>
  )
}