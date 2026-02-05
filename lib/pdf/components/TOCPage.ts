import { ChapterWithPhotos } from '../types/index'
import { getTemplateConfig, generateTemplateStyles } from '../templates/config'

export interface TOCPageProps {
  title: string
  chapters: Array<{
    chapter: ChapterWithPhotos
    pageNumber: number
    photoCount: number
  }>
  template: 'classic' | 'modern' | 'travel'
}

export function renderTOCPage(props: TOCPageProps): string {
  const { title, chapters, template } = props
  const config = getTemplateConfig(template)
  const styles = generateTemplateStyles(config)
  
  const specificStyles = {
    classic: `
      .toc { padding-top: 20px; }
      .toc-header {
        font-size: 36px;
        margin-bottom: 50px;
        text-align: center;
        font-weight: 400;
        font-style: italic;
      }
      .toc-list { list-style: none; }
      .toc-item {
        display: flex;
        align-items: baseline;
        margin-bottom: 24px;
        font-size: 18px;
      }
      .toc-chapter-number {
        font-family: var(--font-accent);
        color: var(--color-accent);
        margin-right: 16px;
        font-size: 14px;
        min-width: 30px;
      }
      .toc-chapter-title {
        flex: 1;
        font-weight: 400;
      }
      .toc-dots {
        flex: 1;
        border-bottom: 1px dotted var(--color-secondary);
        margin: 0 12px;
        opacity: 0.4;
        position: relative;
        top: -4px;
      }
      .toc-page {
        font-family: var(--font-accent);
        color: var(--color-secondary);
        font-size: 14px;
        min-width: 30px;
        text-align: right;
      }
      .toc-photo-count {
        font-size: 12px;
        color: var(--color-secondary);
        opacity: 0.7;
        margin-left: 46px;
        margin-top: -20px;
        margin-bottom: 24px;
      }
    `,
    modern: `
      .toc { padding-top: 40px; }
      .toc-header {
        font-size: 32px;
        margin-bottom: 40px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .toc-list { list-style: none; }
      .toc-item {
        display: flex;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .toc-chapter-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--color-accent);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        margin-right: 20px;
      }
      .toc-content { flex: 1; }
      .toc-chapter-title {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 4px;
      }
      .toc-photo-count {
        font-size: 13px;
        color: var(--color-secondary);
      }
      .toc-page {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-primary);
      }
    `,
    travel: `
      .toc { padding-top: 20px; }
      .toc-header {
        font-size: 42px;
        margin-bottom: 50px;
        font-weight: 700;
        position: relative;
        display: inline-block;
      }
      .toc-header::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 60px;
        height: 4px;
        background: var(--color-accent);
      }
      .toc-list { list-style: none; }
      .toc-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding: 16px;
        background: rgba(0,0,0,0.02);
        border-radius: 8px;
        transition: background 0.2s;
      }
      .toc-chapter-number {
        font-size: 48px;
        font-weight: 700;
        color: var(--color-accent);
        opacity: 0.3;
        margin-right: 20px;
        line-height: 1;
        min-width: 50px;
      }
      .toc-content { flex: 1; }
      .toc-chapter-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .toc-photo-count {
        font-size: 13px;
        color: var(--color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .toc-page {
        font-family: var(--font-accent);
        font-size: 24px;
        color: var(--color-accent);
        transform: rotate(-5deg);
      }
    `,
  }

  const chapterItems = chapters.map((item, index) => {
    const chapterNum = index + 1
    
    if (template === 'classic') {
      return `
        <li class="toc-item">
          <span class="toc-chapter-number">Ch. ${chapterNum}</span>
          <span class="toc-chapter-title">${escapeHtml(item.chapter.title)}</span>
          <span class="toc-dots"></span>
          <span class="toc-page">${item.pageNumber}</span>
        </li>
        <li class="toc-photo-count">${item.photoCount} photo${item.photoCount !== 1 ? 's' : ''}</li>
      `
    } else if (template === 'modern') {
      return `
        <li class="toc-item">
          <span class="toc-chapter-number">${chapterNum}</span>
          <div class="toc-content">
            <div class="toc-chapter-title">${escapeHtml(item.chapter.title)}</div>
            <div class="toc-photo-count">${item.photoCount} photo${item.photoCount !== 1 ? 's' : ''}</div>
          </div>
          <span class="toc-page">${item.pageNumber}</span>
        </li>
      `
    } else {
      return `
        <li class="toc-item">
          <span class="toc-chapter-number">${chapterNum}</span>
          <div class="toc-content">
            <div class="toc-chapter-title">${escapeHtml(item.chapter.title)}</div>
            <div class="toc-photo-count">${item.photoCount} photo${item.photoCount !== 1 ? 's' : ''}</div>
          </div>
          <span class="toc-page">p.${item.pageNumber}</span>
        </li>
      `
    }
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${styles}${specificStyles[template]}</style>
    </head>
    <body>
      <div class="page toc">
        <h2 class="toc-header">${template === 'travel' ? '' : 'Contents'}</h2>
        <ul class="toc-list">
          ${chapterItems}
        </ul>
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
