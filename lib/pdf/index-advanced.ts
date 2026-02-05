/**
 * Main PDF Generator for Photo Story Book
 * Orchestrates layout, image processing, quality checks, and PDF generation
 */

import puppeteer, { Browser, Page } from 'puppeteer'
import { PDFDocument, PDFPage, PDFImage, StandardFonts, rgb, cmyk } from 'pdf-lib'
import {
  PrintSpecs,
  PDFExportOptions,
  DEFAULT_EXPORT_OPTIONS,
  getPrintSpecs,
  getTrimBox,
  getPageDimensionsWithBleed,
  mmToPixels,
  pixelsToMm
} from './print-specs'
import {
  PageLayout,
  PhotoLayout,
  LayoutConfig,
  DEFAULT_LAYOUT_CONFIG,
  generatePageLayout,
  getPageNumberPosition,
  getCaptionPosition,
  distributePhotosToPages
} from './layout-engine'
import {
  processImageForPrint,
  batchProcessImages,
  createPlaceholderImage,
  validateImageForPrint,
  ImageOptimizationOptions
} from './image-processor'
import {
  runBookQualityCheck,
  QualityReport,
  formatQualityReport,
  ImageQualityParams
} from './quality-check'

export interface PhotoBookPage {
  photos: Array<{
    id: string
    src: string // URL or base64
    buffer?: Buffer
    caption?: string
    width: number
    height: number
  }>
  background?: string
  layout?: import('./layout-engine').LayoutType
}

export interface PDFGenerationOptions {
  exportOptions?: Partial<PDFExportOptions>
  layoutConfig?: Partial<LayoutConfig>
  optimizationOptions?: Partial<ImageOptimizationOptions>
  browserPoolSize?: number
  onProgress?: (stage: string, current: number, total: number) => void
}

export interface PDFGenerationResult {
  buffer: Buffer
  qualityReport: QualityReport
  pageCount: number
  fileSize: number
  generationTime: number
}

/**
 * Browser pool for concurrent page generation
 */
class PuppeteerBrowserPool {
  private browsers: Browser[] = []
  private maxSize: number
  private queue: Array<{
    task: (page: Page) => Promise<void>
    resolve: () => void
    reject: (error: Error) => void
  }> = []
  private activeCount = 0

  constructor(maxSize: number = 3) {
    this.maxSize = maxSize
  }

  async initialize(): Promise<void> {
    for (let i = 0; i < this.maxSize; i++) {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      this.browsers.push(browser)
    }
  }

  async execute<T>(task: (page: Page) => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task: async (page: Page) => {
          try {
            const result = await task(page)
            resolve(result)
          } catch (error) {
            reject(error as Error)
          }
        },
        resolve: () => {},
        reject
      })
      this.processQueue()
    })
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0 || this.activeCount >= this.maxSize) {
      return
    }

    const item = this.queue.shift()
    if (!item) return

    this.activeCount++
    const browser = this.browsers[this.activeCount % this.browsers.length]
    
    try {
      const page = await browser.newPage()
      await item.task(page)
      await page.close()
    } catch (error) {
      item.reject(error as Error)
    } finally {
      this.activeCount--
      this.processQueue()
    }
  }

  async close(): Promise<void> {
    await Promise.all(this.browsers.map(b => b.close()))
    this.browsers = []
  }
}

/**
 * Generate HTML for a single page
 */
function generatePageHTML(
  pageLayout: PageLayout,
  specs: PrintSpecs,
  config: LayoutConfig,
  processedImages: Map<string, Buffer>
): string {
  const dimensions = getPageDimensionsWithBleed(specs)
  const trimBox = getTrimBox(specs)
  const pageNumberPos = getPageNumberPosition(specs, pageLayout.pageNumber, 'bottom-center')
  
  const photoElements = pageLayout.photos.map(photo => {
    const imageBuffer = processedImages.get(photo.id)
    const imageSrc = imageBuffer 
      ? `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
      : photo.src
    
    const captionPos = photo.caption 
      ? getCaptionPosition(photo, specs, config.captionPosition, config)
      : null
    
    const captionHTML = captionPos && photo.caption
      ? `<div class="caption" style="
          position: absolute;
          left: ${captionPos.x}px;
          top: ${captionPos.y}px;
          width: ${captionPos.maxWidth}px;
          text-align: center;
          font-family: Georgia, serif;
          font-size: 10pt;
          color: #333;
          line-height: 1.4;
        ">${photo.caption}</div>`
      : ''
    
    return `
      <div class="photo-container" style="
        position: absolute;
        left: ${photo.x}px;
        top: ${photo.y}px;
        width: ${photo.width}px;
        height: ${photo.height}px;
      ">
        <img src="${imageSrc}" style="
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        " />
      </div>
      ${captionHTML}
    `
  }).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          width: ${dimensions.width}px;
          height: ${dimensions.height}px;
          position: relative;
          background: ${pageLayout.background || '#ffffff'};
          overflow: hidden;
        }
        .page-number {
          position: absolute;
          left: ${pageNumberPos.x}px;
          top: ${pageNumberPos.y}px;
          transform: translateX(-50%);
          font-family: Georgia, serif;
          font-size: 9pt;
          color: #666;
        }
        .trim-marks {
          position: absolute;
          left: ${trimBox.x}px;
          top: ${trimBox.y}px;
          width: ${trimBox.width}px;
          height: ${trimBox.height}px;
          border: 0.5pt solid #ccc;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      ${photoElements}
      <div class="page-number">${pageLayout.pageNumber}</div>
      <div class="trim-marks"></div>
    </body>
    </html>
  `
}

/**
 * Generate PDF from HTML pages
 */
async function generatePDFFromPages(
  pagesHTML: string[],
  specs: PrintSpecs,
  exportOptions: PDFExportOptions,
  browserPool: PuppeteerBrowserPool,
  onProgress?: (stage: string, current: number, total: number) => void
): Promise<Buffer> {
  const pdfBuffers: Buffer[] = []
  
  // Generate PDF pages in batches
  const batchSize = 4
  for (let i = 0; i < pagesHTML.length; i += batchSize) {
    const batch = pagesHTML.slice(i, i + batchSize)
    
    const batchPromises = batch.map((html, batchIndex) => 
      browserPool.execute(async (page) => {
        await page.setContent(html, { waitUntil: 'networkidle0' })
        
        const pdfBuffer = await page.pdf({
          width: `${specs.width + specs.bleed * 2}mm`,
          height: `${specs.height + specs.bleed * 2}mm`,
          printBackground: true,
          preferCSSPageSize: true
        })
        
        return { index: i + batchIndex, buffer: pdfBuffer }
      })
    )
    
    const batchResults = await Promise.all(batchPromises)
    batchResults.forEach(result => {
      pdfBuffers[result.index] = result.buffer
    })
    
    onProgress?.('pdf_generation', Math.min(i + batchSize, pagesHTML.length), pagesHTML.length)
  }
  
  // Merge PDFs using pdf-lib
  const mergedPdf = await PDFDocument.create()
  
  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))
  }
  
  // Add PDF metadata
  mergedPdf.setTitle('Photo Story Book')
  mergedPdf.setAuthor('Photo Story Book Generator')
  mergedPdf.setCreator('Photo Story Book PDF Generator')
  mergedPdf.setKeywords(['photo book', 'print', 'photography'])
  
  // Add print specifications as document metadata
  mergedPdf.setProducer(`Puppeteer + pdf-lib | ${specs.paperSize} ${specs.dpi}DPI ${specs.colorMode}`)
  
  const pdfBytes = await mergedPdf.save({
    addDefaultPage: false,
    useObjectStreams: true
  })
  
  return Buffer.from(pdfBytes)
}

/**
 * Main PDF generation function
 */
export async function generatePhotoBookPDF(
  pages: PhotoBookPage[],
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  const startTime = Date.now()
  
  const exportOptions: PDFExportOptions = {
    ...DEFAULT_EXPORT_OPTIONS,
    ...options.exportOptions
  }
  
  const layoutConfig: LayoutConfig = {
    ...DEFAULT_LAYOUT_CONFIG,
    ...options.layoutConfig
  }
  
  const optimizationOptions: ImageOptimizationOptions = {
    quality: 95,
    format: 'jpeg',
    colorSpace: exportOptions.colorMode === 'CMYK' ? 'cmyk' : 'srgb',
    progressive: true,
    optimizeCoding: true,
    mozjpeg: true,
    ...options.optimizationOptions
  }
  
  const specs = getPrintSpecs(exportOptions.paperSize, exportOptions.dpi)
  
  // Initialize browser pool
  const browserPool = new PuppeteerBrowserPool(options.browserPoolSize || 3)
  await browserPool.initialize()
  
  try {
    // Step 1: Process images
    options.onProgress?.('image_processing', 0, pages.length)
    
    const imagesToProcess: Array<{
      id: string
      buffer: Buffer
      targetWidth: number
      targetHeight: number
      pageIndex: number
    }> = []
    
    // Collect all images that need processing
    pages.forEach((page, pageIndex) => {
      page.photos.forEach(photo => {
        if (photo.buffer) {
          // Calculate target dimensions based on page
          const contentWidth = specs.width - specs.margins.left - specs.margins.right
          const contentHeight = specs.height - specs.margins.top - specs.margins.bottom
          
          imagesToProcess.push({
            id: photo.id,
            buffer: photo.buffer,
            targetWidth: mmToPixels(contentWidth, specs.dpi),
            targetHeight: mmToPixels(contentHeight, specs.dpi),
            pageIndex
          })
        }
      })
    })
    
    // Process images concurrently
    const processedImages = await batchProcessImages(
      imagesToProcess,
      specs,
      optimizationOptions,
      {
        concurrency: 4,
        onProgress: (completed, total) => {
          options.onProgress?.('image_processing', completed, total)
        }
      }
    )
    
    // Step 2: Generate page layouts
    options.onProgress?.('layout', 0, pages.length)
    
    const pageLayouts: PageLayout[] = []
    const qualityCheckParams: ImageQualityParams[] = []
    
    pages.forEach((page, index) => {
      const layout = generatePageLayout(
        page.photos,
        index + 1,
        specs,
        layoutConfig,
        page.layout
      )
      pageLayouts.push(layout)
      
      // Prepare quality check params
      page.photos.forEach(photo => {
        const photoLayout = layout.photos.find(p => p.id === photo.id)
        if (photoLayout && photo.buffer) {
          // Get metadata from processed image
          const processed = processedImages.get(photo.id)
          if (processed) {
            qualityCheckParams.push({
              id: photo.id,
              buffer: photo.buffer,
              metadata: processed.originalMetadata,
              layout: photoLayout,
              specs
            })
          }
        }
      })
      
      options.onProgress?.('layout', index + 1, pages.length)
    })
    
    // Step 3: Run quality checks
    options.onProgress?.('quality_check', 0, 1)
    const qualityReport = runBookQualityCheck(qualityCheckParams, specs)
    options.onProgress?.('quality_check', 1, 1)
    
    // Step 4: Generate HTML for each page
    options.onProgress?.('html_generation', 0, pageLayouts.length)
    
    const pagesHTML = pageLayouts.map((layout, index) => {
      const html = generatePageHTML(layout, specs, layoutConfig, processedImages)
      options.onProgress?.('html_generation', index + 1, pageLayouts.length)
      return html
    })
    
    // Step 5: Generate final PDF
    options.onProgress?.('pdf_generation', 0, pagesHTML.length)
    
    const pdfBuffer = await generatePDFFromPages(
      pagesHTML,
      specs,
      exportOptions,
      browserPool,
      options.onProgress
    )
    
    const generationTime = Date.now() - startTime
    
    return {
      buffer: pdfBuffer,
      qualityReport,
      pageCount: pages.length,
      fileSize: pdfBuffer.length,
      generationTime
    }
    
  } finally {
    await browserPool.close()
  }
}

/**
 * Validate a photo book before PDF generation
 */
export async function validatePhotoBook(
  pages: PhotoBookPage[],
  paperSize: import('./print-specs').PaperSize = 'A4'
): Promise<QualityReport> {
  const specs = getPrintSpecs(paperSize, 300)
  const qualityParams: ImageQualityParams[] = []
  
  pages.forEach((page, pageIndex) => {
    page.photos.forEach(photo => {
      if (photo.buffer) {
        // Create a simple layout for validation
        const layout: PhotoLayout = {
          id: photo.id,
          src: photo.src,
          caption: photo.caption,
          x: 0,
          y: 0,
          width: mmToPixels(specs.width - specs.margins.left - specs.margins.right, specs.dpi),
          height: mmToPixels(specs.height - specs.margins.top - specs.margins.bottom, specs.dpi)
        }
        
        // Validate image
        validateImageForPrint(
          photo.buffer,
          pixelsToMm(layout.width, specs.dpi),
          pixelsToMm(layout.height, specs.dpi),
          specs
        ).then(result => {
          qualityParams.push({
            id: photo.id,
            buffer: photo.buffer!,
            metadata: result.metadata,
            layout,
            specs
          })
        })
      }
    })
  })
  
  return runBookQualityCheck(qualityParams, specs)
}

/**
 * Quick preview generation for a single page
 */
export async function generatePagePreview(
  page: PhotoBookPage,
  specs: PrintSpecs,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const layout = generatePageLayout(
      page.photos,
      1,
      specs,
      config,
      page.layout
    )
    
    // Create placeholder images if needed
    const processedImages = new Map<string, Buffer>()
    
    for (const photo of page.photos) {
      if (!photo.buffer) {
        const placeholder = await createPlaceholderImage(
          Math.round(photo.width),
          Math.round(photo.height),
          '#e0e0e0',
          photo.caption || 'Photo'
        )
        processedImages.set(photo.id, placeholder)
      }
    }
    
    const html = generatePageHTML(layout, specs, config, processedImages)
    
    const puppeteerPage = await browser.newPage()
    await puppeteerPage.setContent(html, { waitUntil: 'networkidle0' })
    
    const screenshot = await puppeteerPage.screenshot({
      type: 'jpeg',
      quality: 90,
      fullPage: true
    })
    
    return screenshot as Buffer
  } finally {
    await browser.close()
  }
}

// Re-export all types for convenience
export * from './print-specs'
export * from './layout-engine'
export * from './image-processor'
export * from './quality-check'
