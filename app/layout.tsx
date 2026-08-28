import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SITE_NAME, SITE_SUMMARY, SITE_TAGLINE, SITE_URL } from '@/lib/site'
import { MAJOR_SA_CITIES, PRIMARY_PROVINCES } from '@/content/locations'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_SUMMARY,
  applicationName: SITE_NAME,
  keywords: [
    'digital systems studio', 'custom software development', 'AI agents',
    'AI operators', 'internal tools', 'marketplace infrastructure',
    'network infrastructure', 'AI training for teams', 'South Africa',
    ...PRIMARY_PROVINCES.map((p) => `software development ${p.name}`),
    ...MAJOR_SA_CITIES.slice(0, 12).map((c) => `app development ${c}`),
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
    types: { 'text/plain': [{ url: '/llms.txt', title: 'llms.txt' }] },
  },
  /* Next derives twitter:card/title/description from metadata unless explicitly unset.
     null suppresses them — this site targets LinkedIn only. */
  twitter: null,
  /* LinkedIn reads OpenGraph — it has no meta namespace of its own, so there is no
     Twitter/X card here by design. LinkedIn wants 1200x627 for og:image. */
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_SUMMARY,
    url: SITE_URL,
    locale: 'en_ZA',
    countryName: 'South Africa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
