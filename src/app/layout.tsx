import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Maison Rêve — Designer dress rental, Manila',
    template: '%s · Maison Rêve',
  },
  description:
    'Maison Rêve rents designer gowns for weddings, galas and evenings out. Reserve online, we deliver to your door, cleaned and pressed.',
  metadataBase: new URL('https://maisonreve.ph'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..600;1,6..96,400..500&family=Inter:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
      </head>
      <body className="min-h-dvh bg-page font-sans text-ink antialiased">{children}</body>
    </html>
  )
}
