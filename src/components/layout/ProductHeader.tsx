'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Globe, MapPinned } from 'lucide-react'
import { setLanguage, useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'

export function ProductHeader() {
  const pathname = usePathname()
  const language = useLanguage()
  const copy = text(language)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const navigation = [
    { href: '/', label: `${copy.bangladesh}` },
    { href: '/world', label: `${copy.world}` },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-[#dce4d9] bg-[#fafbf8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-2 px-3 sm:gap-4 sm:px-7 lg:px-10">
        <Link aria-label="Tour Cancel Map home" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap" href="/">
          <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-[#263d2e] text-[#f5c760] sm:size-9 sm:rounded-[10px]"><MapPinned className="size-4 sm:size-[18px]" /></span>
          <span className="text-[10px] font-extrabold tracking-[0.05em] text-[#263d2e] sm:text-sm sm:tracking-[0.08em]">TOUR CANCEL MAP</span>
        </Link>
        <nav aria-label="Main navigation" className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} aria-current={active ? 'page' : undefined} className={`whitespace-nowrap rounded-full px-1.5 py-2.5 text-[10px] font-semibold transition-colors sm:px-4 sm:text-sm ${active ? 'bg-[#e7eee5] text-[#284332]' : 'text-[#6c786e] hover:bg-[#eef2ec] hover:text-[#263d2e]'}`} href={item.href}>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div aria-label="Language" className="rounded-full border border-[#dce4d9] bg-white py-2 px-3" role="group">
          <button
            type="button"
            className='flex gap-1 items-center cursor-pointer'
            aria-label={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          >
            <Globe className="h-3.5 w-3.5" color='#263d2e' />
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>
        </div>
      </div>
    </header>
  )
}