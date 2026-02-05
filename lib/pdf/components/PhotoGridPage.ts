import { Photo } from '../types/index'
import { getTemplateConfig, generateTemplateStyles } from '../templates/config'

export interface PhotoGridPageProps {
  photos: Photo[]
  template: 'classic' | 'modern' | 'travel'
  layout: '2' | '3' | '4' | '6' | 'mixed'
  chapterTitle?: string
  pageNumber?: number
}

export function renderPhotoGridPage(props: PhotoGridPageProps): string {
  const { photos, template, layout, chapterTitle, pageNumber } = props
  const config = getTemplateConfig(template)
  const styles = generateTemplateStyles(config)
  
  const gridLayouts = {
    '2': 'grid-template-columns: repeat(2, 1fr);',
    '3': 'grid-template-columns: repeat(3, 1fr);',
    '4': 'grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr);',
    '6': 'grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr);',
    'mixed': 'grid-template-columns: repeat(12, 1fr); grid-auto-rows: minmax(200px, auto);',
  }
  
  const specificStyles = {
    classic: `
      .photo-grid-page { padding-top: 20px; }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e5e5e0;
      }
      .page-chapter-title {
        font-size: 14px;
        color: var(--color-secondary);
        font-family: var(--font-accent);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .page-number {
        font-size: 14px;
        color: var(--color-secondary);
      }
      .photo-grid {
        display: grid;
        ${gridLayouts[layout]}
        gap: 20px;
        height: calc(100% - 60px);
      }
      .photo-item {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        background: #f5f5f0;
      }
      .photo-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .photo-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        color: white;
        font-size: 13px;
        font-style: italic;
      }
      .photo-date {
        font-size: 11px;
        opacity: 0.8;
        margin-top: 4px;
      }
    `,
    modern: `
      .photo-grid-page { padding-top: 10px; }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
      }
      .page-chapter-title {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .page-number {
        font-size: 13px;
        color: var(--color-secondary);
        font-weight: 500;
      }
      .photo-grid {
        display: grid;
        ${gridLayouts[layout]}
        gap: 16px;
        height: calc(100% - 50px);
      }
      .photo-item {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        background: #f3f4f6;
      }
      .photo-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      }
      .photo-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        background: linear-gradient(transparent, rgba(0,0,0,0.6));
        color: white;
        font-size: 14px;
        font-weight: 500;
      }
      .photo-date {
        font-size: 12px;
        opacity: 0.9;
        font-weight: 400;
        margin-top: 4px;
      }
      .photo-location {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        opacity: 0.9;
        margin-top: 4px;
      }
    `,
    travel: `
      .photo-grid-page { 
        padding-top: 10px;
        position: relative;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        transform: rotate(-1deg);
      }
      .page-chapter-title {
        font-family: var(--font-accent);
        font-size: 16px;
        color: var(--color-accent);
      }
      .page-number {
        font-family: var(--font-accent);
        font-size: 18px;
        color: var(--color-secondary);
        transform: rotate(5deg);
      }
      .photo-grid {
        display: grid;
        ${gridLayouts[layout]}
        gap: 20px;
        height: calc(100% - 60px);
      }
      .photo-item {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        background: #f0ebe5;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transform: rotate(${() => (Math.random() * 2 - 1).toFixed(1)}deg);
      }
      .photo-item:nth-child(even) {
        transform: rotate(${(Math.random() * 2 - 1).toFixed(1)}deg);
      }
      .photo-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: saturate(1.1) contrast(1.05);
      }
      .photo-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        background: linear-gradient(transparent, rgba(45,52,54,0.85));
        color: white;
        font-size: 14px;
      }
      .photo-date {
        font-size: 11px;
        opacity: 0.9;
        font-family: var(--font-accent);
        margin-top: 4px;
      }
      .tape {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%) rotate(-2deg);
        width: 80px;
        height: 25px;
        background: rgba(255,255,255,0.6);
        z-index: 10;
      }
    `,
  }
  
  const photoItems = photos.map((photo, index) => {
    const dateStr = photo.dateTaken 
      ? new Date(photo.dateTaken).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      : ''
    
    const locationStr = photo.location || (photo.hasGPS ? '📍 Location tagged' : '')
    
    return `
      <div class="photo-item" style="${getPhotoGridStyle(layout, index, photos.length)}">
        ${template === 'travel' ? '<div class="tape"></div>' : ''}
        <img src="${photo.src}" alt="${photo.caption || ''}" />
        ${(photo.caption || dateStr || locationStr) ? `
          <div class="photo-caption">
            ${photo.caption ? `<div>${escapeHtml(photo.caption)}</div>` : ''}
            ${dateStr ? `<div class="photo-date">${dateStr}</div>` : ''}
            ${locationStr && template === 'modern' ? `
              <div class="photo-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${locationStr}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${styles}${specificStyles[template]}</style>
    </head>
    <body>
      <div class="page photo-grid-page">
        <div class="page-header">
          ${chapterTitle ? `<span class="page-chapter-title">${escapeHtml(chapterTitle)}</span>` : '<span></span>'}
          ${pageNumber ? `<span class="page-number">${pageNumber}</span>` : ''}
        </div>
        <div class="photo-grid">
          ${photoItems}
        </div>
      </div>
    </body>
    </html>
  `
}

function getPhotoGridStyle(layout: string, index: number, total: number): string {
  if (layout !== 'mixed') return ''
  
  // Mixed layout: creates interesting layouts based on photo index
  const patterns = [
    'grid-column: span 6; grid-row: span 2;',
    'grid-column: span 6; grid-row: span 1;',
    'grid-column: span 6; grid-row: span 1;',
    'grid-column: span 4; grid-row: span 2;',
    'grid-column: span 4; grid-row: span 2;',
    'grid-column: span 4; grid-row: span 2;',
  ]
  
  return patterns[index % patterns.length]
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
