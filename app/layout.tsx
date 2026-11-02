import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Pikc — Offline, together', description: 'Private, nearby messaging over Bluetooth.' }
export const viewport: Viewport = { themeColor: '#070b1a', width: 'device-width', initialScale: 1, userScalable: false }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
