import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://juri-fedjaev-portfolio.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/angebot.pdf`,
      lastModified: new Date('2025-01-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/juri-fedjaev-MEGA-REPORT.pdf`,
      lastModified: new Date('2025-01-30'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
