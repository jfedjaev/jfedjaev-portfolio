/**
 * Image Processor for Photo Story Book PDF export
 * Uses Sharp for high-performance image optimization and processing
 */

import sharp, { OutputInfo, Metadata } from 'sharp'
import { PrintSpecs, mmToPixels, checkResolution } from './print-specs'

export interface ProcessedImage {
  buffer: Buffer
  info: OutputInfo
  originalMetadata: Metadata
  processingApplied: string[]
}

export interface ImageOptimizationOptions {
  quality: number // 1-100 for JPEG
  format: 'jpeg' | 'png' | 'webp'
  colorSpace: 'srgb' | 'cmyk'
  progressive: boolean
  optimizeCoding: boolean
  mozjpeg: boolean
}

export const DEFAULT_OPTIMIZATION_OPTIONS: ImageOptimizationOptions = {
  quality: 95, // High quality for print
  format: 'jpeg',
  colorSpace: 'cmyk',
  progressive: true,
  optimizeCoding: true,
  mozjpeg: true
}

/**
 * Process image for print with specified dimensions and color space
 */
export async function processImageForPrint(
  imageBuffer: Buffer,
  targetWidth: number,
  targetHeight: number,
  specs: PrintSpecs,
  options: Partial<ImageOptimizationOptions> = {}
): Promise<ProcessedImage> {
  const opts = { ...DEFAULT_OPTIMIZATION_OPTIONS, ...options }
  const processingApplied: string[] = []
  
  let pipeline = sharp(imageBuffer)
  
  // Get original metadata for logging
  const originalMetadata = await pipeline.metadata()
  
  // Auto-rotate based on EXIF orientation
  pipeline = pipeline.rotate()
  processingApplied.push('autorotate')
  
  // Resize with high-quality Lanczos resampling
  pipeline = pipeline.resize(targetWidth, targetHeight, {
    fit: 'inside',
    withoutEnlargement: false,
    kernel: sharp.kernel.lanczos3
  })
  processingApplied.push(`resize:${targetWidth}x${targetHeight}`)
  
  // Convert to CMYK for print if specified
  if (opts.colorSpace === 'cmyk') {
    pipeline = pipeline.toColorspace('cmyk')
    processingApplied.push('colorspace:cmyk')
  } else {
    pipeline = pipeline.toColorspace('srgb')
    processingApplied.push('colorspace:srgb')
  }
  
  // Apply output format with compression settings
  let outputBuffer: Buffer
  
  switch (opts.format) {
    case 'jpeg':
      outputBuffer = await pipeline.jpeg({
        quality: opts.quality,
        progressive: opts.progressive,
        optimizeCoding: opts.optimizeCoding,
        mozjpeg: opts.mozjpeg,
        force: true
      }).toBuffer()
      processingApplied.push(`jpeg:q${opts.quality}`)
      break
      
    case 'png':
      outputBuffer = await pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        force: true
      }).toBuffer()
      processingApplied.push('png:compressed')
      break
      
    case 'webp':
      outputBuffer = await pipeline.webp({
        quality: opts.quality,
        effort: 6, // Maximum compression effort
        force: true
      }).toBuffer()
      processingApplied.push(`webp:q${opts.quality}`)
      break
      
    default:
      outputBuffer = await pipeline.jpeg({
        quality: opts.quality,
        progressive: opts.progressive
      }).toBuffer()
  }
  
  const info = await sharp(outputBuffer).metadata()
  
  return {
    buffer: outputBuffer,
    info: {
      format: info.format || 'unknown',
      width: info.width || 0,
      height: info.height || 0,
      channels: info.channels || 0,
      size: outputBuffer.length,
      density: info.density,
      hasProfile: !!info.profile,
      hasAlpha: info.hasAlpha || false
    } as OutputInfo,
    originalMetadata,
    processingApplied
  }
}

/**
 * Process image with smart cropping to exact dimensions
 */
export async function processImageWithCrop(
  imageBuffer: Buffer,
  targetWidth: number,
  targetHeight: number,
  cropRegion: { x: number; y: number; width: number; height: number },
  specs: PrintSpecs,
  options: Partial<ImageOptimizationOptions> = {}
): Promise<ProcessedImage> {
  const opts = { ...DEFAULT_OPTIMIZATION_OPTIONS, ...options }
  const processingApplied: string[] = []
  
  const pipeline = sharp(imageBuffer)
  const originalMetadata = await pipeline.clone().metadata()
  
  const imgWidth = originalMetadata.width || targetWidth
  const imgHeight = originalMetadata.height || targetHeight
  
  // Calculate crop coordinates in pixels
  const left = Math.round(cropRegion.x * imgWidth)
  const top = Math.round(cropRegion.y * imgHeight)
  const width = Math.round(cropRegion.width * imgWidth)
  const height = Math.round(cropRegion.height * imgHeight)
  
  // Apply crop and resize
  const processed = await pipeline
    .extract({ left, top, width, height })
    .rotate()
    .resize(targetWidth, targetHeight, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3
    })
    .toColorspace(opts.colorSpace === 'cmyk' ? 'cmyk' : 'srgb')
    .jpeg({
      quality: opts.quality,
      progressive: opts.progressive,
      optimizeCoding: opts.optimizeCoding
    })
    .toBuffer()
  
  processingApplied.push(`crop:${left},${top},${width},${height}`)
  processingApplied.push(`resize:${targetWidth}x${targetHeight}`)
  processingApplied.push(`colorspace:${opts.colorSpace}`)
  
  const info = await sharp(processed).metadata()
  
  return {
    buffer: processed,
    info: {
      format: info.format || 'jpeg',
      width: info.width || 0,
      height: info.height || 0,
      channels: info.channels || 0,
      size: processed.length,
      density: info.density,
      hasProfile: !!info.profile,
      hasAlpha: info.hasAlpha || false
    } as OutputInfo,
    originalMetadata,
    processingApplied
  }
}

/**
 * Create a resized thumbnail preview
 */
export async function createThumbnail(
  imageBuffer: Buffer,
  maxSize: number = 400
): Promise<Buffer> {
  return sharp(imageBuffer)
    .rotate()
    .resize(maxSize, maxSize, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({
      quality: 85,
      progressive: true
    })
    .toBuffer()
}

/**
 * Apply color corrections for print
 */
export async function applyPrintColorCorrection(
  imageBuffer: Buffer,
  brightness: number = 0, // -100 to 100
  contrast: number = 0, // -100 to 100
  saturation: number = 0 // -100 to 100
): Promise<Buffer> {
  let pipeline = sharp(imageBuffer)
  
  // Apply adjustments using Sharp's modulate
  if (brightness !== 0 || saturation !== 0) {
    const brightnessFactor = 1 + (brightness / 100)
    const saturationFactor = 1 + (saturation / 100)
    pipeline = pipeline.modulate({
      brightness: brightnessFactor,
      saturation: saturationFactor
    })
  }
  
  // Apply contrast using linear adjustment
  if (contrast !== 0) {
    const contrastFactor = contrast / 100
    const midpoint = 0.5
    const a = 1 + contrastFactor // slope
    const b = midpoint * (1 - a) // offset
    pipeline = pipeline.linear(a, b)
  }
  
  return pipeline.toBuffer()
}

/**
 * Unsharp mask for sharpening print images
 */
export async function applyUnsharpMask(
  imageBuffer: Buffer,
  sigma: number = 1.5, // blur radius
  gain: number = 1.0, // strength
  threshold: number = 0 // minimum brightness change
): Promise<Buffer> {
  return sharp(imageBuffer)
    .sharpen({
      sigma,
      m1: gain,
      m2: 0,
      x1: threshold,
      y2: 10,
      y3: 20
    })
    .toBuffer()
}

/**
 * Batch process multiple images concurrently
 */
export interface BatchProcessOptions {
  concurrency: number
  onProgress?: (completed: number, total: number) => void
}

export const DEFAULT_BATCH_OPTIONS: BatchProcessOptions = {
  concurrency: 4
}

export async function batchProcessImages(
  images: Array<{
    id: string
    buffer: Buffer
    targetWidth: number
    targetHeight: number
  }>,
  specs: PrintSpecs,
  options: Partial<ImageOptimizationOptions> = {},
  batchOptions: Partial<BatchProcessOptions> = {}
): Promise<Map<string, ProcessedImage>> {
  const batchOpts = { ...DEFAULT_BATCH_OPTIONS, ...batchOptions }
  const results = new Map<string, ProcessedImage>()
  
  // Process in chunks to control concurrency
  const chunks: Array<typeof images> = []
  for (let i = 0; i < images.length; i += batchOpts.concurrency) {
    chunks.push(images.slice(i, i + batchOpts.concurrency))
  }
  
  let completed = 0
  
  for (const chunk of chunks) {
    const promises = chunk.map(async (img) => {
      try {
        const processed = await processImageForPrint(
          img.buffer,
          img.targetWidth,
          img.targetHeight,
          specs,
          options
        )
        results.set(img.id, processed)
        completed++
        batchOpts.onProgress?.(completed, images.length)
        return { id: img.id, success: true }
      } catch (error) {
        results.set(img.id, {
          buffer: Buffer.alloc(0),
          info: {
            format: 'error',
            width: 0,
            height: 0,
            channels: 0,
            size: 0,
            hasProfile: false,
            hasAlpha: false
          } as OutputInfo,
          originalMetadata: {},
          processingApplied: [`error:${error instanceof Error ? error.message : 'unknown'}`]
        })
        completed++
        batchOpts.onProgress?.(completed, images.length)
        return { id: img.id, success: false, error }
      }
    })
    
    await Promise.all(promises)
  }
  
  return results
}

/**
 * Get image metadata without processing
 */
export async function getImageMetadata(imageBuffer: Buffer): Promise<Metadata> {
  return sharp(imageBuffer).metadata()
}

/**
 * Validate image is suitable for print
 */
export interface ImageValidationResult {
  isValid: boolean
  warnings: string[]
  errors: string[]
  metadata: Metadata
  resolutionCheck?: {
    isSufficient: boolean
    actualDPI: { width: number; height: number }
    recommendedMin: { width: number; height: number }
  }
}

export async function validateImageForPrint(
  imageBuffer: Buffer,
  targetWidthMm: number,
  targetHeightMm: number,
  specs: PrintSpecs
): Promise<ImageValidationResult> {
  const warnings: string[] = []
  const errors: string[] = []
  
  const metadata = await getImageMetadata(imageBuffer)
  
  // Check resolution
  const imgWidth = metadata.width || 0
  const imgHeight = metadata.height || 0
  
  const resolutionCheck = checkResolution(
    imgWidth,
    imgHeight,
    targetWidthMm,
    targetHeightMm,
    specs.dpi
  )
  
  if (!resolutionCheck.isSufficient) {
    warnings.push(
      `Image resolution (${imgWidth}x${imgHeight}) may be insufficient for print. ` +
      `Recommended: ${resolutionCheck.recommendedMin.width}x${resolutionCheck.recommendedMin.height}px ` +
      `at ${specs.dpi} DPI`
    )
  }
  
  // Check color profile
  if (!metadata.profile) {
    warnings.push('Image has no embedded color profile. Using default sRGB.')
  }
  
  // Check bit depth
  if (metadata.depth && metadata.depth !== 'uchar' && metadata.depth !== '8') {
    warnings.push(`Image has ${metadata.depth} bit depth. 8-bit is recommended for print.`)
  }
  
  // Check format
  const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'gif']
  if (!supportedFormats.includes(metadata.format || '')) {
    errors.push(`Unsupported image format: ${metadata.format}. Supported: ${supportedFormats.join(', ')}`)
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    metadata,
    resolutionCheck
  }
}

/**
 * Calculate optimal JPEG quality based on image characteristics
 */
export function calculateOptimalQuality(imageSize: number, targetSize: number): number {
  // Adjust quality based on desired output size
  if (targetSize <= 0) return 95
  
  const ratio = imageSize / targetSize
  
  if (ratio > 2) {
    return 85 // Can afford lower quality for large images
  } else if (ratio > 1) {
    return 90
  } else {
    return 95 // Preserve quality for images close to target size
  }
}

/**
 * Create a blank image placeholder for layout testing
 */
export async function createPlaceholderImage(
  width: number,
  height: number,
  color: string = '#cccccc',
  text?: string
): Promise<Buffer> {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      ${text ? `<text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle" dominant-baseline="middle">${text}</text>` : ''}
    </svg>
  `
  
  return sharp(Buffer.from(svg))
    .resize(width, height)
    .jpeg({ quality: 90 })
    .toBuffer()
}
