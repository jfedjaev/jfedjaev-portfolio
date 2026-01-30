import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/components/LanguageContext'

export const metadata: Metadata = {
  title: 'Shift Autonomy | Strategic Consulting for Autonomous Mobility, BCI & AI',
  description: 'Shift Autonomy provides strategic consulting and operational leadership for Autonomous Mobility, Brain-Computer Interfaces, and AI. Former Volkswagen Head of Program Management.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
