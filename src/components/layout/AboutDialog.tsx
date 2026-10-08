'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { Dialog } from '@base-ui/react/dialog'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language'
import { text } from '@/lib/i18n'

const role = 'Frontend Developer · Student'
const desc =
  "I built this app as a way to combine my passion for frontend development with my love for exploring Bangladesh. The idea is simple: we all make tour plans, but somehow, a lot of them never happen. This app is for everyone who loves travelling, making plans, and remembering the trips that actually happened — and the ones that got cancelled. 😂"
const socialTitle = 'Connect with me on social media.'
const socialLinks = [
  { label: 'Facebook', href: 'https://web.facebook.com/jsjavin.jia.1/', color: '#1877f2', icon: <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" /></svg> },
  { label: 'GitHub', href: 'https://github.com/ziauddin25/git', color: '#24292e', icon: <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.7.5.5 5.8.5 12.1c0 5.1 3.3 9.5 7.9 11 .6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.1-1.3-5.1-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1.9-.2 1.8-.3 2.8-.3s1.9.1 2.8.3c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.3-5.1 5.6.4.3.7 1 .7 2v3c0 .3.2.6.8.5 4.6-1.5 7.9-5.9 7.9-11C23.5 5.8 18.3.5 12 .5z" /></svg> },
]

export function AboutDialog() {
  const language = useLanguage()
  const copy = text(language)

  return (
    <Dialog.Root>
        <Dialog.Trigger render={<Button type="button" variant="ghost" className="inline h-4 items-center cursor-pointer px-0 text-xs font-bold text-[#263d2e] underline underline-offset-4 hover:opacity-80">{copy.makerName}</Button>} />
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#17231b]/45 backdrop-blur-[2px]" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
            <Dialog.Popup className="w-full max-w-md overflow-hidden rounded-t-2xl border border-[#d9e0d7] bg-[#fcfdfb] shadow-2xl outline-none sm:rounded-2xl">
              <div className="relative h-[230px] w-full sm:h-[260px]">
                <Image alt="Zia Uddin" className="object-cover" fill priority sizes="(max-width: 448px) 100vw, 448px" src="/imgs/ziapr.jpg" />
                <Dialog.Close render={<Button aria-label={copy.close} className="absolute cursor-pointer right-3 top-3 size-10 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50" size="icon" variant="ghost" />}>
                  <X className="size-5" />
                </Dialog.Close>
              </div>
              <div className="px-6 pb-6 pt-5">
                <h2 className="text-2xl font-extrabold leading-tight text-[#203126]">Zia Uddin</h2>
                <p className="mt-1 text-sm font-medium text-[#6b776e]">{role}</p>
                <p className="mt-4 text-[15px] leading-7 text-[#36463a]">{desc}</p>
                <p className="mt-5 text-sm font-semibold text-[#6b776e]">{socialTitle}</p>
                <div className="mt-3 flex gap-3">
                  {socialLinks.map(({ label, href, color, icon }) => (
                    <a
                      key={label}
                      aria-label={label}
                      className="grid size-11 place-items-center rounded-full text-white transition-all hover:-translate-y-0.5"
                      href={href}
                      rel="noopener noreferrer"
                      style={{ backgroundColor: color }}
                      target="_blank"
                      title={label}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
  )
}