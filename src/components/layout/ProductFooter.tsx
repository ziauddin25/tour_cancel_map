'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPinned } from 'lucide-react'
import { AboutDialog } from '@/components/layout/AboutDialog'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.7.5.5 5.8.5 12.1c0 5.1 3.3 9.5 7.9 11 .6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.1-1.3-5.1-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1.9-.2 1.8-.3 2.8-.3s1.9.1 2.8.3c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.3-5.1 5.6.4.3.7 1 .7 2v3c0 .3.2.6.8.5 4.6-1.5 7.9-5.9 7.9-11C23.5 5.8 18.3.5 12 .5z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

function FooterScene() {
  return (
    <svg aria-hidden="true" className="block h-[130px] w-full sm:h-[170px] lg:h-[200px]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 220">
      <defs>
        <linearGradient id="footer-sea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#bde4ee" />
          <stop offset="1" stopColor="#8ccbdd" />
        </linearGradient>
        <linearGradient id="footer-hill-far" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d6ead9" />
          <stop offset="1" stopColor="#b8d9c3" />
        </linearGradient>
      </defs>
      <circle cx="960" cy="104" fill="#ffd27a" opacity="0.32" r="38" />
      <circle cx="960" cy="104" fill="#ffc35c" r="24" />
      <path d="M898 68q7-7 14 0M932 52q6-6 12 0M1010 62q7-7 14 0" fill="none" stroke="#2f4a3c" strokeLinecap="round" strokeWidth="2" />
      <path d="M0 156C140 108 280 120 400 136C540 104 680 112 820 148C940 128 1080 134 1200 144L1200 220L0 220Z" fill="url(#footer-hill-far)" />
      <rect fill="url(#footer-sea)" height="82" width="1200" x="0" y="148" />
      <path d="M180 168q10-6 20 0t20 0M420 182q10-6 20 0t20 0M760 166q10-6 20 0t20 0M1040 176q10-6 20 0t20 0M240 196q10-6 20 0t20 0M560 190q10-6 20 0t20 0M880 200q10-6 20 0t20 0" fill="none" opacity="0.75" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" />
      <path d="M642 158l48 0-7 16-34 0z" fill="#2f4a3c" />
      <path d="M666 158l0-26 18 26z" fill="#ffffff" />
      <path d="M0 220C40 176 120 140 210 126C204 156 214 202 240 220Z" fill="#8cc7a2" />
      <path d="M210 126C300 148 360 186 420 220L240 220C214 202 204 156 210 126Z" fill="#4f9a6f" />
      <path d="M352 220C380 190 420 164 470 152C466 168 470 196 486 220Z" fill="#74b98f" />
    </svg>
  )
}

export function ProductFooter() {
  const pathname = usePathname()
  const copy = text(useLanguage())
  const historyHref = pathname.startsWith('/world') ? '/tour_history?map=world' : '/tour_history?map=bd'

  return (
    <footer className="border-t border-[#dce4d9] bg-[#eef4ec] text-[#6b716d]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
        <div className="flex gap-8 pb-6 pt-8 flex-wrap justify-between md:gap-12">
          <div>
            <Link aria-label="Tour Cancel Map home" className="flex w-fit items-center gap-2.5 whitespace-nowrap" href="/">
              <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-[#263d2e] text-[#f5c760] sm:size-9 sm:rounded-[10px]"><MapPinned className="size-4 sm:size-[18px]" /></span>
              <span className="text-sm font-extrabold tracking-[0.08em] text-[#263d2e]">TOUR CANCEL MAP</span>
            </Link>
            <p className="mt-3 max-w-[340px] text-sm leading-relaxed">{copy.footerAbout}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#5f6a61]">Made by <AboutDialog /></div>
          </div>
          <nav aria-label={copy.footerPages}>
            <h3 className="mb-3 text-[13px] font-bold tracking-[0.02em] text-[#263d2e]">{copy.footerPages}</h3>
            <ul className="grid gap-2.5 text-sm">
              <li>
                <Link className="underline underline-offset-4 transition-colors hover:text-[#263d2e]" href="/">{copy.bangladesh}</Link>
              </li>
              <li>
                <Link className="underline underline-offset-4 transition-colors hover:text-[#263d2e]" href="/world">{copy.world}</Link>
              </li>
              <li>
                <Link className="underline underline-offset-4 transition-colors hover:text-[#263d2e]" href={historyHref}>{copy.navTourHistory}</Link>
              </li>
              <li>
                <a className="underline underline-offset-4 transition-colors hover:text-[#263d2e]" href="#top">{copy.scrollTop}</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 border-t border-[#dce4d9] py-4 text-[13px]">
          <a className="underline underline-offset-4 transition-colors hover:text-[#263d2e]" href="#">{copy.footerGuide}</a>
          <a className="underline underline-offset-4 transition-colors hover:text-[#263d2e]" href="#">{copy.footerPrivacy}</a>
          <span className="text-[#93a096]">© 2026 <a href="#" className="hover:underline">Tour Cancel Map</a> · {copy.allRights}</span>
        </div>
        {/* <p className="pb-4 text-center text-[11px] leading-relaxed text-[#93a096]">{copy.footerCredits}</p> */}
      </div>
      <FooterScene />
    </footer>
  )
}
