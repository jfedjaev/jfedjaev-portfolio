import { ChapterWithPhotos } from '../types/index'
import { getTemplateConfig, generateTemplateStyles } from '../templates/config'
import { generateMapboxStaticUrl, generateFallbackMapHTML } from '../utils/mapRenderer'

export interface ChapterPageProps {
  chapter: ChapterWithPhotos
  chapterNumber: number
  template: 'classic' | 'modern' | 'travel'
  mapStyle?: string
  includeMap?: boolean
}

export async function renderChapterPage(props: ChapterPageProps): Promise<string> {
  const { chapter, chapterNumber, template, mapStyle = 'streets', includeMap = true } = props
  const config = getTemplateConfig(template)
  const styles = generateTemplateStyles(config)
  
  // Generate map
  let mapHTML = ''
  if (includeMap && chapter.photos.some((p) => p.hasGPS)) {
    const mapUrl = await generateMapboxStaticUrl(chapter, mapStyle, 600, 300)
    if (mapUrl) {
      mapHTML = `<div class="chapter-map"><img src="${mapUrl}" alt="Map" /></div>`
    } else {
      mapHTML = `<div class="chapter-map">${generateFallbackMapHTML(chapter, 600, 300)}</div>`
    }
  }
  
  // Get first 3 photos for preview
  const previewPhotos = chapter.photos.slice(0, 3)
  const previewHTML = previewPhotos.map((photo) => `
    <div class="chapter-preview-photo">
      <img src="${photo.src}" alt="${photo.caption || ''}" />
    </div>
  `).join('')
  
  const specificStyles = {
    classic: `
      .chapter-page { 
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }
      .chapter-header {
        text-align: center;
        margin-bottom: 40px;
        padding-top: 60px;
      }
      .chapter-number {
        font-family: var(--font-accent);
        font-size: 14px;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 16px;
      }
      .chapter-title {
        font-size: 42px;
        font-weight: 400;
        font-style: italic;
        margin-bottom: 16px;
      }
      .chapter-subtitle {
        font-size: 20px;
        color: var(--color-secondary);
        font-weight: 400;
      }
      .chapter-map {
        width: 100%;
        height: 300px;
        margin: 30px 0;
        border-radius: 4px;
        overflow: hidden;
      }
      .chapter-map img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .chapter-description {
        font-size: 16px;
        line-height: 1.8;
        color: var(--color-secondary);
        margin: 30px 0;
        text-align: center;
        max-width: 80%;
        margin-left: auto;
        margin-right: auto;
      }
      .chapter-previews {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: auto;
        padding-top: 40px;
      }
      .chapter-preview-photo {
        aspect-ratio: 4/3;
        border-radius: 4px;
        overflow: hidden;
      }
      .chapter-preview-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .chapter-divider {
        width: 40px;
        height: 2px;
        background: var(--color-accent);
        margin: 30px auto;
      }
    `,
    modern: `
      .chapter-page { 
        display: flex;
        flex-direction: column;
        min-height: 100%;
        padding-top: 40px;
      }
      .chapter-header {
        margin-bottom: 40px;
      }
      .chapter-number {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 12px;
      }
      .chapter-title {
        font-size: 48px;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.1;
        margin-bottom: 12px;
      }
      .chapter-subtitle {
        font-size: 22px;
        color: var(--color-secondary);
        font-weight: 400;
      }
      .chapter-map {
        width: 100%;
        height: 350px;
        margin: 40px 0;
        border-radius: 12px;
        overflow: hidden;
      }
      .chapter-map img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .chapter-description {
        font-size: 18px;
        line-height: 1.7;
        color: var(--color-secondary);
        margin: 20px 0;
        max-width: 90%;
      }
      .chapter-previews {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: auto;
        padding-top: 40px;
      }
      .chapter-preview-photo {
        aspect-ratio: 16/10;
        border-radius: 8px;
        overflow: hidden;
      }
      .chapter-preview-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `,
    travel: `
      .chapter-page { 
        position: relative;
        min-height: 100%;
      }
      .chapter-header {
        position: relative;
        z-index: 2;
        padding-top: 40px;
      }
      .chapter-number {
        font-family: var(--font-accent);
        font-size: 120px;
        font-weight: 700;
        color: var(--color-accent);
        opacity: 0.15;
        position: absolute;
        top: 20px;
        right: 0;
        line-height: 1;
        z-index: 1;
      }
      .chapter-title {
        font-size: 52px;
        font-weight: 700;
        margin-bottom: 12px;
        position: relative;
        z-index: 2;
      }
      .chapter-subtitle {
        font-size: 24px;
        color: var(--color-secondary);
        font-weight: 400;
      }
      .chapter-map {
        width: 100%;
        height: 280px;
        margin: 30px 0;
        border-radius: 8px;
        overflow: hidden;
        transform: rotate(-1deg);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      .chapter-map img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .chapter-description {
        font-size: 17px;
        line-height: 1.7;
        color: var(--color-secondary);
        margin: 30px 0;
        padding-left: 20px;
        border-left: 3px solid var(--color-accent);
      }
      .chapter-previews {
        display: flex;
        gap: 16px;
        margin-top: 30px;
        transform: rotate(1deg);
      }
      .chapter-preview-photo {
        flex: 1;
        aspect-ratio: 3/4;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: rotate(-2deg);
      }
      .chapter-preview-photo:nth-child(2) {
        transform: rotate(1deg) translateY(-10px);
      }
      .chapter-preview-photo:nth-child(3) {
        transform: rotate(3deg);
      }
      .chapter-preview-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `,
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${styles}${specificStyles[template]}</style>
    </head>
    <body>
      <div class="page chapter-page">
        <div class="chapter-header">
          ${template === 'travel' ? `<div class="chapter-number">${chapterNumber}</div>` : ''}
          ${template !== 'travel' ? `<div class="chapter-number">Chapter ${chapterNumber}</div>` : ''}
          <h2 class="chapter-title">${escapeHtml(chapter.title)}</h2>
          ${chapter.subtitle ? `<p class="chapter-subtitle">${escapeHtml(chapter.subtitle)}</p>` : ''}
          ${template === 'classic' ? '<div class="chapter-divider"></div>' : ''}
        </div>
        
        ${chapter.description ? `<p class="chapter-description">${escapeHtml(chapter.description)}</p>` : ''}
        
        ${mapHTML}
        
        ${previewPhotos.length > 0 ? `
          <div class="chapter-previews">
            ${previewHTML}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
