import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tour Cancel Map | যেখানে যাওয়ার কথা ছিল',
  description: 'বাংলাদেশ আর বিশ্বের মানচিত্রে আপনার tour plan, cancellation আর গল্প।',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  )
}
