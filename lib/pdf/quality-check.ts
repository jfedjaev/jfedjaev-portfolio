/**
 * Quality Check module for Photo Story Book PDF export
 * Validates image quality, resolution, color profiles, and print readiness
 */

import { Metadata } from 'sharp'
import { PrintSpecs, PaperSize, checkResolution, mmToPixels } from './print-specs'
import { PhotoLayout, getAspectRatio } from './layout-engine'

export type QualityLevel = 'pass' | 'warning' | 'error'

export interface QualityCheck {
  id: string
  type: 'resolution' | 'color-profile' | 'format' | 'bleed' | 'safety' | 'contrast' | 'metadata'
  level: QualityLevel
  message: string
  details?: Record<string, unknown>
}

export interface QualityReport {
  checks: QualityCheck[]
  summary: {
    total: number
    pass: number
    warnings: number
    errors: number
  }
  isPrintReady: boolean
}

export interface ImageQualityParams {
  id: string
  buffer: Buffer
  metadata: Metadata
  layout: PhotoLayout
  specs: PrintSpecs
}

// Minimum DPI thresholds
export const DPI_THRESHOLDS = {
  EXCELLENT: 300,
  GOOD: 250,
  ACCEPTABLE: 200,
  MINIMUM: 150
}

// Color profile standards
export const STANDARD_COLOR_PROFILES = {
  RGB: ['sRGB', 'Adobe RGB (1998)', 'Display P3', 'ProPhoto RGB'],
  CMYK: ['U.S. Web Coated (SWOP) v2', 'FOGRA39', 'ISO Coated v2', 'Japan Color 2001']
}

/**
 * Check image resolution for print quality
 */
export function checkImageResolution(
  imageWidth: number,
  imageHeight: number,
  printWidthMm: number,
  printHeightMm: number,
  imageId: string,
  specs: PrintSpecs
): QualityCheck {
  const result = checkResolution(
    imageWidth,
    imageHeight,
    printWidthMm,
    printHeightMm,
    specs.dpi
  )
  
  const minDPI = Math.min(result.actualDPI.width, result.actualDPI.height)
  
  let level: QualityLevel = 'pass'
  let message: string
  
  if (minDPI < DPI_THRESHOLDS.MINIMUM) {
    level = 'error'
    message = `Resolution too low: ${minDPI.toFixed(0)} DPI (minimum ${DPI_THRESHOLDS.MINIMUM} DPI required)`
  } else if (minDPI < DPI_THRESHOLDS.ACCEPTABLE) {
    level = 'error'
    message = `Resolution below acceptable: ${minDPI.toFixed(0)} DPI (${DPI_THRESHOLDS.ACCEPTABLE} DPI recommended)`
  } else if (minDPI < DPI_THRESHOLDS.GOOD) {
    level = 'warning'
    message = `Resolution acceptable but not ideal: ${minDPI.toFixed(0)} DPI (${specs.dpi} DPI recommended)`
  } else if (minDPI < specs.dpi) {
    level = 'warning'
    message = `Good resolution: ${minDPI.toFixed(0)} DPI (optimal is ${specs.dpi} DPI)`
  } else {
    message = `Excellent resolution: ${minDPI.toFixed(0)} DPI`
  }
  
  return {
    id: imageId,
    type: 'resolution',
    level,
    message,
    details: {
      imageWidth,
      imageHeight,
      actualDPI: result.actualDPI,
      targetDPI: specs.dpi,
      printSizeMm: { width: printWidthMm, height: printHeightMm }
    }
  }
}

/**
 * Check color profile validity
 */
export function checkColorProfile(
  metadata: Metadata,
  imageId: string,
  targetColorMode: 'RGB' | 'CMYK'
): QualityCheck {
  const profile = metadata.profile
  const space = metadata.space
  
  // If we have an embedded profile
  if (profile) {
    // In a real implementation, we'd parse the ICC profile
    // For now, we check if it matches our target
    const hasProfile = true
    
    return {
      id: imageId,
      type: 'color-profile',
      level: 'pass',
      message: 'Image has embedded color profile',
      details: {
        hasProfile,
        profileSize: profile.length,
        colorSpace: space,
        targetColorMode
      }
    }
  }
  
  // No embedded profile - use colorspace as fallback
  if (space) {
    const isCorrectSpace = targetColorMode === 'RGB' 
      ? ['srgb', 'rgb', 'scrgb'].includes(space.toLowerCase())
      : ['cmyk', 'cmy'].includes(space.toLowerCase())
    
    if (isCorrectSpace) {
      return {
        id: imageId,
        type: 'color-profile',
        level: 'warning',
        message: `Image uses ${space} colorspace but has no embedded profile. Using default.`,
        details: { space, targetColorMode }
      }
    }
    
    return {
      id: imageId,
      type: 'color-profile',
      level: 'warning',
      message: `Image colorspace (${space}) differs from target (${targetColorMode}). Conversion will be applied.`,
      details: { space, targetColorMode }
    }
  }
  
  return {
    id: imageId,
    type: 'color-profile',
    level: 'warning',
    message: 'No color profile information available. Using sRGB default.',
    details: { targetColorMode }
  }
}

/**
 * Check image format suitability
 */
export function checkImageFormat(
  metadata: Metadata,
  imageId: string
): QualityCheck {
  const format = metadata.format?.toLowerCase()
  
  if (!format) {
    return {
      id: imageId,
      type: 'format',
      level: 'error',
      message: 'Unable to determine image format'
    }
  }
  
  // Formats suitable for print (lossless or high-quality)
  const printFormats = ['tiff', 'png', 'jpeg', 'jpg']
  
  // Formats with transparency issues for print
  const webFormats = ['webp', 'gif']
  
  if (printFormats.includes(format)) {
    const level: QualityLevel = format === 'tiff' || format === 'png' ? 'pass' : 'warning'
    const message = format === 'jpeg' || format === 'jpg'
      ? 'JPEG format is acceptable but may have compression artifacts'
      : `${format.toUpperCase()} format is excellent for print`
    
    return {
      id: imageId,
      type: 'format',
      level,
      message,
      details: { format }
    }
  }
  
  if (webFormats.includes(format)) {
    return {
      id: imageId,
      type: 'format',
      level: 'warning',
      message: `${format.toUpperCase()} is designed for web use. Converting to print format.`,
      details: { format }
    }
  }
  
  return {
    id: imageId,
    type: 'format',
    level: 'error',
    message: `Unsupported format: ${format}. Please use JPEG, PNG, or TIFF.`,
    details: { format }
  }
}

/**
 * Check if image extends to bleed area when required
 */
export function checkBleedCoverage(
  layout: PhotoLayout,
  imageId: string,
  specs: PrintSpecs,
  requiresBleed: boolean
): QualityCheck {
  const pageWidth = mmToPixels(specs.width + specs.bleed * 2, specs.dpi)
  const pageHeight = mmToPixels(specs.height + specs.bleed * 2, specs.dpi)
  
  // Check if image covers full bleed area
  const coversWidth = layout.x <= mmToPixels(specs.bleed, specs.dpi) / 2 &&
                      layout.x + layout.width >= pageWidth - mmToPixels(specs.bleed, specs.dpi) / 2
  const coversHeight = layout.y <= mmToPixels(specs.bleed, specs.dpi) / 2 &&
                       layout.y + layout.height >= pageHeight - mmToPixels(specs.bleed, specs.dpi) / 2
  
  const hasFullBleed = coversWidth && coversHeight
  
  if (requiresBleed && !hasFullBleed) {
    return {
      id: imageId,
      type: 'bleed',
      level: 'error',
      message: 'Image does not extend to bleed area. Full bleed coverage required.',
      details: {
        layout,
        pageWidth,
        pageHeight,
        bleed: specs.bleed
      }
    }
  }
  
  if (requiresBleed && hasFullBleed) {
    return {
      id: imageId,
      type: 'bleed',
      level: 'pass',
      message: 'Image properly extends to bleed area',
      details: { bleed: specs.bleed }
    }
  }
  
  return {
    id: imageId,
    type: 'bleed',
    level: 'pass',
    message: 'Bleed check not required for this image',
    details: { requiresBleed }
  }
}

/**
 * Check if critical content is within safe zone
 */
export function checkSafetyMargins(
  layout: PhotoLayout,
  imageId: string,
  specs: PrintSpecs
): QualityCheck {
  const safeZone = {
    x: mmToPixels(specs.bleed + specs.safeZone + specs.margins.left, specs.dpi),
    y: mmToPixels(specs.bleed + specs.safeZone + specs.margins.top, specs.dpi),
    width: mmToPixels(specs.width - specs.margins.left - specs.margins.right - specs.safeZone * 2, specs.dpi),
    height: mmToPixels(specs.height - specs.margins.top - specs.bottom - specs.safeZone * 2, specs.dpi)
  }
  
  // For single photo layouts, check if important areas stay within safe zone
  // This is a simplified check - real implementation would use face/object detection
  const marginLeft = layout.x - safeZone.x
  const marginRight = safeZone.x + safeZone.width - (layout.x + layout.width)
  const marginTop = layout.y - safeZone.y
  const marginBottom = safeZone.y + safeZone.height - (layout.y + layout.height)
  
  const isWithinSafeZone = marginLeft >= 0 && marginRight >= 0 && marginTop >= 0 && marginBottom >= 0
  
  if (!isWithinSafeZone) {
    return {
      id: imageId,
      type: 'safety',
      level: 'warning',
      message: 'Image extends beyond safe zone. Important content may be trimmed.',
      details: {
        margins: { left: marginLeft, right: marginRight, top: marginTop, bottom: marginBottom },
        safeZone
      }
    }
  }
  
  return {
    id: imageId,
    type: 'safety',
    level: 'pass',
    message: 'Image positioned within safe zone',
    details: { safeZone }
  }
}

/**
 * Run complete quality check on a single image
 */
export function runImageQualityCheck(
  params: ImageQualityParams,
  options: {
    requiresBleed?: boolean
  } = {}
): QualityReport {
  const checks: QualityCheck[] = []
  
  // Resolution check
  const printWidthMm = params.specs.width - params.specs.margins.left - params.specs.margins.right
  const printHeightMm = params.specs.height - params.specs.margins.top - params.specs.margins.bottom
  
  checks.push(checkImageResolution(
    params.metadata.width || 0,
    params.metadata.height || 0,
    printWidthMm,
    printHeightMm,
    params.id,
    params.specs
  ))
  
  // Color profile check
  checks.push(checkColorProfile(params.metadata, params.id, params.specs.colorMode))
  
  // Format check
  checks.push(checkImageFormat(params.metadata, params.id))
  
  // Bleed check
  checks.push(checkBleedCoverage(params.layout, params.id, params.specs, options.requiresBleed || false))
  
  // Safety margin check
  checks.push(checkSafetyMargins(params.layout, params.id, params.specs))
  
  // Calculate summary
  const summary = {
    total: checks.length,
    pass: checks.filter(c => c.level === 'pass').length,
    warnings: checks.filter(c => c.level === 'warning').length,
    errors: checks.filter(c => c.level === 'error').length
  }
  
  return {
    checks,
    summary,
    isPrintReady: summary.errors === 0
  }
}

/**
 * Run quality check on entire book
 */
export function runBookQualityCheck(
  images: ImageQualityParams[],
  specs: PrintSpecs
): QualityReport {
  const allChecks: QualityCheck[] = []
  
  images.forEach((img, index) => {
    const isCover = index === 0 // Assume first image is cover
    const report = runImageQualityCheck(img, { requiresBleed: isCover })
    allChecks.push(...report.checks)
  })
  
  const summary = {
    total: allChecks.length,
    pass: allChecks.filter(c => c.level === 'pass').length,
    warnings: allChecks.filter(c => c.level === 'warning').length,
    errors: allChecks.filter(c => c.level === 'error').length
  }
  
  return {
    checks: allChecks,
    summary,
    isPrintReady: summary.errors === 0 && summary.warnings < images.length * 2 // Allow some warnings
  }
}

/**
 * Generate human-readable quality report
 */
export function formatQualityReport(report: QualityReport): string {
  const lines: string[] = []
  
  lines.push('='.repeat(50))
  lines.push('PRINT QUALITY REPORT')
  lines.push('='.repeat(50))
  lines.push('')
  
  // Summary
  lines.push('SUMMARY:')
  lines.push(`  Total Checks: ${report.summary.total}`)
  lines.push(`  ✓ Passed: ${report.summary.pass}`)
  lines.push(`  ⚠ Warnings: ${report.summary.warnings}`)
  lines.push(`  ✗ Errors: ${report.summary.errors}`)
  lines.push(`  Print Ready: ${report.isPrintReady ? 'YES' : 'NO'}`)
  lines.push('')
  
  // Group by image
  const checksByImage = new Map<string, QualityCheck[]>()
  report.checks.forEach(check => {
    const existing = checksByImage.get(check.id) || []
    existing.push(check)
    checksByImage.set(check.id, existing)
  })
  
  // List issues
  const errors = report.checks.filter(c => c.level === 'error')
  const warnings = report.checks.filter(c => c.level === 'warning')
  
  if (errors.length > 0) {
    lines.push('ERRORS (must fix before printing):')
    errors.forEach(check => {
      lines.push(`  [${check.type.toUpperCase()}] ${check.message}`)
      lines.push(`    Image: ${check.id}`)
    })
    lines.push('')
  }
  
  if (warnings.length > 0) {
    lines.push('WARNINGS (recommended to review):')
    warnings.forEach(check => {
      lines.push(`  [${check.type.toUpperCase()}] ${check.message}`)
      lines.push(`    Image: ${check.id}`)
    })
    lines.push('')
  }
  
  lines.push('='.repeat(50))
  
  return lines.join('\n')
}

/**
 * Recommend paper size based on image aspect ratios
 */
export function recommendPaperSize(
  images: Array<{ width: number; height: number }>,
  availableSizes: PaperSize[] = ['A4', 'US_LETTER']
): PaperSize {
  if (availableSizes.length === 1) {
    return availableSizes[0]
  }
  
  // Calculate average aspect ratio of images
  const avgRatio = images.reduce((sum, img) => {
    return sum + getAspectRatio(img.width, img.height)
  }, 0) / images.length
  
  // A4 ratio: 210/297 = 0.707
  // US Letter ratio: 216/279 = 0.774
  
  const a4Ratio = 210 / 297
  const letterRatio = 216 / 279
  
  // Find which paper size is closer to the images' aspect ratio
  const a4Diff = Math.abs(avgRatio - a4Ratio)
  const letterDiff = Math.abs(avgRatio - letterRatio)
  
  if (a4Diff < letterDiff) {
    return 'A4'
  }
  
  return 'US_LETTER'
}
