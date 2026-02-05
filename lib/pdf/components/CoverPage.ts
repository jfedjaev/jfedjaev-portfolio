import { Photo, ChapterWithPhotos, PDFExportOptions } from '../types/index'
import { getTemplateConfig, generateTemplateStyles } from '../templates/config'
import { generateMapboxStaticUrl, generateFallbackMapHTML } from '../utils/mapRenderer'

export interface CoverPageProps {
  title: string
  subtitle?: string
  author?: string
  coverPhoto?: Photo
  template: 'classic' | 'modern' | 'travel'
}

export async function renderCoverPage(props: CoverPageProps): Promise<string> {
  const { title, subtitle, author, coverPhoto, template } = props
  const config = getTemplateConfig(template)
  const styles = generateTemplateStyles(config)
  
  const coverPhotoHTML = coverPhoto
    ? `<div class="cover-photo">
        <img src="${coverPhoto.src}" alt="${title}" />
       </div>`
    : `<div class="cover-photo-placeholder">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
       </div>`

  const specificStyles = {
    classic: `
      .cover { 
        text-align: center; 
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 100%;
      }
      .cover-photo, .cover-photo-placeholder {
        width: 100%;
        height: 400px;
        margin-bottom: 60px;
        overflow: hidden;
        border-radius: 4px;
      }
      .cover-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .cover-photo-placeholder {
        background: linear-gradient(135deg, #f5f5f0 0%, #e8e8e0 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
      }
      .cover-title {
        font-size: 56px;
        font-weight: 400;
        letter-spacing: -0.02em;
        margin-bottom: 20px;
        font-style: italic;
      }
      .cover-subtitle {
        font-size: 24px;
        color: var(--color-secondary);
        margin-bottom: 40px;
        font-weight: 400;
      }
      .cover-author {
        font-size: 18px;
        color: var(--color-secondary);
        font-family: var(--font-accent);
      }
      .cover-divider {
        width: 60px;
        height: 2px;
        background: var(--color-accent);
        margin: 30px auto;
      }
    `,
    modern: `
      .cover { 
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100%;
        padding-top: 40px;
      }
      .cover-photo, .cover-photo-placeholder {
        width: 100%;
        height: 500px;
        overflow: hidden;
        border-radius: 8px;
        margin-bottom: 50px;
      }
      .cover-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .cover-photo-placeholder {
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
      }
      .cover-title {
        font-size: 64px;
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1.1;
        margin-bottom: 16px;
      }
      .cover-subtitle {
        font-size: 28px;
        color: var(--color-secondary);
        font-weight: 400;
        margin-bottom: 30px;
      }
      .cover-author {
        font-size: 16px;
        color: var(--color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
    `,
    travel: `
      .cover { 
        position: relative;
        min-height: 100%;
      }
      .cover-photo, .cover-photo-placeholder {
        position: absolute;
        inset: -60px;
        z-index: 0;
      }
      .cover-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.7);
      }
      .cover-photo-placeholder {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .cover-content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 60px;
        color: white;
      }
      .cover-title {
        font-size: 72px;
        font-weight: 700;
        color: white;
        text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        margin-bottom: 16px;
        line-height: 1.05;
      }
      .cover-subtitle {
        font-size: 28px;
        color: rgba(255,255,255,0.9);
        margin-bottom: 30px;
        font-weight: 400;
      }
      .cover-author {
        font-size: 18px;
        color: rgba(255,255,255,0.8);
        font-family: var(--font-accent);
      }
      .cover-stamp {
        position: absolute;
        top: 40px;
        right: 0;
        width: 100px;
        height: 100px;
        border: 3px solid rgba(255,255,255,0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(-15deg);
        font-family: var(--font-accent);
        font-size: 14px;
        color: rgba(255,255,255,0.7);
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
      <div class="page cover">
        ${template === 'travel' ? `
          ${coverPhotoHTML}
          <div class="cover-content">
            <div class="cover-stamp">ADVENTURE</div>
            <h1 class="cover-title">${escapeHtml(title)}</h1>
            ${subtitle ? `<p class="cover-subtitle">${escapeHtml(subtitle)}</p>` : ''}
            ${author ? `<p class="cover-author">by ${escapeHtml(author)}</p>` : ''}
          </div>
        ` : `
          ${coverPhotoHTML}
          <h1 class="cover-title">${escapeHtml(title)}</h1>
          ${template === 'classic' ? '<div class="cover-divider"></div>' : ''}
          ${subtitle ? `<p class="cover-subtitle">${escapeHtml(subtitle)}</p>` : ''}
          ${author ? `<p class="cover-author">${template === 'modern' ? 'By ' : ''}${escapeHtml(author)}</p>` : ''}
        `}
      </div>
    </body>
    </html>
  `
}

function escapeHtml(text: string): string {
  const div = { toString: () => text }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
