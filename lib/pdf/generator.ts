import type { Browser } from 'puppeteer'
import { PDFExportOptions, ExportJob, ChapterWithPhotos, Photo } from './types/index'
import { renderCoverPage } from './components/CoverPage'
import { renderTOCPage } from './components/TOCPage'
import { renderChapterPage } from './components/ChapterPage'
import { renderPhotoGridPage } from './components/PhotoGridPage'
import { getTemplateConfig, generateTemplateStyles } from './templates/config'

export interface PDFGeneratorProgress {
  stage: 'initializing' | 'rendering' | 'combining' | 'complete'
  progress: number
  message: string
}

export type ProgressCallback = (progress: PDFGeneratorProgress) => void

export class PDFGenerator {
  private browser: Browser | null = null
  private options: PDFExportOptions
  private onProgress: ProgressCallback

  constructor(options: PDFExportOptions, onProgress: ProgressCallback) {
    this.options = options
    this.onProgress = onProgress
  }

  async initialize(): Promise<void> {
    this.onProgress({
      stage: 'initializing',
      progress: 5,
      message: 'Initializing PDF generator...',
    })

    // Dynamic import for server-side only module
    const puppeteer = await import('puppeteer')
    this.browser = await puppeteer.default.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    })
  }

  async generate(): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('PDF generator not initialized. Call initialize() first.')
    }

    const pages: Buffer[] = []
    const config = getTemplateConfig(this.options.template)
    let currentPageNumber = 1

    // Calculate total pages for progress tracking
    const totalPhotoPages = this.options.chapters.reduce((acc, chapter) => {
      return acc + Math.ceil(chapter.photos.length / 6)
    }, 0)
    const totalPages = 2 + this.options.chapters.length + totalPhotoPages // cover + toc + chapter pages + photo pages
    let completedPages = 0

    // 1. Generate Cover Page
    this.onProgress({
      stage: 'rendering',
      progress: Math.round((completedPages / totalPages) * 100),
      message: 'Rendering cover page...',
    })

    const coverHTML = await renderCoverPage({
      title: this.options.title,
      subtitle: this.options.subtitle,
      author: this.options.author,
      coverPhoto: this.options.coverPhoto,
      template: this.options.template,
    })

    const coverPDF = await this.renderPageToPDF(coverHTML)
    pages.push(coverPDF)
    completedPages++

    // 2. Generate Table of Contents
    this.onProgress({
      stage: 'rendering',
      progress: Math.round((completedPages / totalPages) * 100),
      message: 'Rendering table of contents...',
    })

    const tocChapters = this.options.chapters.map((chapter, index) => ({
      chapter,
      pageNumber: 0, // Will be calculated
      photoCount: chapter.photos.length,
    }))

    // Calculate page numbers
    let pageCounter = 3 // Start after cover and TOC
    tocChapters.forEach((item) => {
      item.pageNumber = pageCounter
      pageCounter += 1 + Math.ceil(item.chapter.photos.length / 6) // chapter page + photo pages
    })

    const tocHTML = renderTOCPage({
      title: this.options.title,
      chapters: tocChapters,
      template: this.options.template,
    })

    const tocPDF = await this.renderPageToPDF(tocHTML)
    pages.push(tocPDF)
    completedPages++

    // 3. Generate Chapter Pages and Photo Grids
    for (let i = 0; i < this.options.chapters.length; i++) {
      const chapter = this.options.chapters[i]

      // Chapter intro page
      this.onProgress({
        stage: 'rendering',
        progress: Math.round((completedPages / totalPages) * 100),
        message: `Rendering chapter ${i + 1}: ${chapter.title}...`,
      })

      const chapterHTML = await renderChapterPage({
        chapter,
        chapterNumber: i + 1,
        template: this.options.template,
        mapStyle: this.options.mapStyle,
        includeMap: this.options.includeMap,
      })

      const chapterPDF = await this.renderPageToPDF(chapterHTML)
      pages.push(chapterPDF)
      completedPages++

      // Photo grid pages (6 photos per page)
      const photoBatches = this.chunkArray(chapter.photos, 6)
      
      for (let j = 0; j < photoBatches.length; j++) {
        const batch = photoBatches[j]
        const layout = this.getLayoutForPhotoCount(batch.length, j)

        this.onProgress({
          stage: 'rendering',
          progress: Math.round((completedPages / totalPages) * 100),
          message: `Rendering photos for chapter ${i + 1}, page ${j + 1}...`,
        })

        const gridHTML = renderPhotoGridPage({
          photos: batch,
          template: this.options.template,
          layout,
          chapterTitle: chapter.title,
          pageNumber: currentPageNumber++,
        })

        const gridPDF = await this.renderPageToPDF(gridHTML)
        pages.push(gridPDF)
        completedPages++
      }
    }

    // 4. Combine all pages
    this.onProgress({
      stage: 'combining',
      progress: 95,
      message: 'Combining pages into final PDF...',
    })

    // For now, return the first page as a placeholder
    // In production, you'd use a PDF library like pdf-lib to merge
    const finalPDF = await this.combinePDFs(pages)

    this.onProgress({
      stage: 'complete',
      progress: 100,
      message: 'PDF generation complete!',
    })

    return finalPDF
  }

  private async renderPageToPDF(htmlContent: string): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser not initialized')
    }

    const page = await this.browser.newPage()
    
    try {
      await page.setContent(htmlContent, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000,
      })

      // Wait for images to load
      await page.waitForFunction(() => {
        const images = document.querySelectorAll('img')
        return Array.from(images).every((img) => img.complete)
      }, { timeout: 10000 })

      // Generate PDF for this page
      const pdf = await page.pdf({
        width: '210mm',
        height: '297mm',
        printBackground: true,
        preferCSSPageSize: true,
      })

      return pdf
    } finally {
      await page.close()
    }
  }

  private async combinePDFs(pdfs: Buffer[]): Promise<Buffer> {
    // In a production environment, use pdf-lib to merge PDFs
    // For now, we'll concatenate the buffers (this is a simplification)
    // You should install pdf-lib: npm install pdf-lib
    
    try {
      const { PDFDocument } = await import('pdf-lib')
      const mergedPdf = await PDFDocument.create()

      for (const pdfBuffer of pdfs) {
        const pdf = await PDFDocument.load(pdfBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      return Buffer.from(await mergedPdf.save())
    } catch (error) {
      console.warn('pdf-lib not available, returning first page only')
      return pdfs[0] || Buffer.from('')
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  private getLayoutForPhotoCount(count: number, batchIndex: number): '2' | '3' | '4' | '6' | 'mixed' {
    if (count <= 2) return '2'
    if (count <= 3) return '3'
    if (count <= 4) return '4'
    if (count <= 6) return '6'
    return 'mixed'
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

// Export a convenience function
export async function generatePDF(
  options: PDFExportOptions,
  onProgress: ProgressCallback
): Promise<Buffer> {
  const generator = new PDFGenerator(options, onProgress)
  
  try {
    await generator.initialize()
    return await generator.generate()
  } finally {
    await generator.close()
  }
}
