import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Juri Fedjaev | Technical Program Manager',
  description: 'Autonomous Mobility • AI/ML • Neuroengineering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
