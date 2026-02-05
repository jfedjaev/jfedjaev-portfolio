import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/components/LanguageContext'

const baseUrl = 'https://juri-fedjaev-portfolio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Juri Fedjaev | Strategic Leadership for Autonomous Mobility & AI',
  description: 'Strategic consulting for Autonomous Mobility, Brain-Computer Interfaces & AI. Former Volkswagen Head of Program Management. Helping scale-ups deploy billions-worth autonomous vehicle strategies.',
  keywords: ['Autonomous Mobility', 'AI Consulting', 'BCI', 'Technical Program Management', 'Strategic Leadership', 'Juri Fedjaev', 'Volkswagen', 'Autonomous Vehicles', 'Machine Learning'],
  authors: [{ name: 'Juri Fedjaev' }],
  creator: 'Juri Fedjaev',
  publisher: 'Juri Fedjaev',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'Juri Fedjaev | Strategic Leadership for Autonomous Mobility & AI',
    description: 'Strategic consulting for Autonomous Mobility, Brain-Computer Interfaces & AI. Former Volkswagen Head of Program Management.',
    url: baseUrl,
    siteName: 'Juri Fedjaev Portfolio',
    images: [
      {
        url: `${baseUrl}/profile.jpg`,
        width: 1200,
        height: 630,
        alt: 'Juri Fedjaev - Strategic Leadership for Autonomous Mobility & AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juri Fedjaev | Strategic Leadership for Autonomous Mobility & AI',
    description: 'Strategic consulting for Autonomous Mobility, Brain-Computer Interfaces & AI. Former Volkswagen Head of Program Management.',
    images: [`${baseUrl}/profile.jpg`],
    creator: '@jurifedjaev',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'theme-color': '#0a1628',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Juri Fedjaev',
    url: baseUrl,
    jobTitle: 'Strategic Leadership Consultant',
    worksFor: {
      '@type': 'Organization',
      name: 'Shift Autonomy',
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Volkswagen Autonomous Mobility',
    },
    image: `${baseUrl}/profile.jpg`,
    description: 'Strategic consulting for Autonomous Mobility, Brain-Computer Interfaces & AI',
    knowsAbout: [
      'Autonomous Mobility',
      'Artificial Intelligence',
      'Brain-Computer Interfaces',
      'Technical Program Management',
      'Strategic Leadership',
    ],
    sameAs: [
      'https://linkedin.com/in/juri-fedjaev',
    ],
  }

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Shift Autonomy - Strategic Consulting',
    url: baseUrl,
    image: `${baseUrl}/profile.jpg`,
    description: 'Strategic consulting and operational leadership for Autonomous Mobility, Brain-Computer Interfaces, and AI',
    provider: {
      '@type': 'Person',
      name: 'Juri Fedjaev',
    },
    areaServed: 'Global',
    serviceType: [
      'Strategic Consulting',
      'Technical Program Management',
      'AI Consulting',
      'Autonomous Mobility Strategy',
    ],
    priceRange: '€€€',
  }

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
      </head>
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
