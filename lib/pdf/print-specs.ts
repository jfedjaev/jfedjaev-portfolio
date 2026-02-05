/**
 * Print specifications for Photo Story Book PDF export
 * Supports A4 and US Letter sizes with professional print requirements
 */

export type PaperSize = 'A4' | 'US_LETTER'
export type ColorMode = 'RGB' | 'CMYK'
export type Orientation = 'portrait' | 'landscape'

export interface PrintMargins {
  top: number // mm
  bottom: number // mm
  left: number // mm
  right: number // mm
}

export interface PrintSpecs {
  paperSize: PaperSize
  width: number // mm
  height: number // mm
  orientation: Orientation
  dpi: number
  bleed: number // mm
  margins: PrintMargins
  safeZone: number // mm
  colorMode: ColorMode
}

// Standard paper sizes in mm at 300 DPI
export const PAPER_SPECS: Record<PaperSize, Omit<PrintSpecs, 'dpi' | 'bleed' | 'margins' | 'safeZone' | 'colorMode'>> = {
  A4: {
    paperSize: 'A4',
    width: 210,
    height: 297,
    orientation: 'portrait'
  },
  US_LETTER: {
    paperSize: 'US_LETTER',
    width: 216,
    height: 279,
    orientation: 'portrait'
  }
}

// Default print specifications
export const DEFAULT_PRINT_SPECS: PrintSpecs = {
  paperSize: 'A4',
  width: 210,
  height: 297,
  orientation: 'portrait',
  dpi: 300,
  bleed: 3, // 3mm bleed as per industry standard
  margins: {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  },
  safeZone: 5, // 5mm safe zone inside trim
  colorMode: 'CMYK'
}

// US Letter specifications
export const US_LETTER_SPECS: PrintSpecs = {
  paperSize: 'US_LETTER',
  width: 216,
  height: 279,
  orientation: 'portrait',
  dpi: 300,
  bleed: 3,
  margins: {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  },
  safeZone: 5,
  colorMode: 'CMYK'
}

/**
 * Get print specifications for a paper size
 */
export function getPrintSpecs(paperSize: PaperSize, dpi: number = 300): PrintSpecs {
  const base = PAPER_SPECS[paperSize]
  return {
    ...DEFAULT_PRINT_SPECS,
    ...base,
    dpi
  }
}

/**
 * Convert mm to pixels at specified DPI
 */
export function mmToPixels(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi)
}

/**
 * Convert pixels to mm at specified DPI
 */
export function pixelsToMm(pixels: number, dpi: number): number {
  return (pixels / dpi) * 25.4
}

/**
 * Get page dimensions including bleed in pixels
 */
export function getPageDimensionsWithBleed(specs: PrintSpecs): {
  width: number
  height: number
  contentWidth: number
  contentHeight: number
} {
  const { width, height, dpi, bleed, margins } = specs
  
  // Add bleed to both sides
  const bleedPx = mmToPixels(bleed, dpi)
  const totalWidth = mmToPixels(width + bleed * 2, dpi)
  const totalHeight = mmToPixels(height + bleed * 2, dpi)
  
  // Content area (inside margins)
  const contentWidth = mmToPixels(width - margins.left - margins.right, dpi)
  const contentHeight = mmToPixels(height - margins.top - margins.bottom, dpi)
  
  return {
    width: totalWidth,
    height: totalHeight,
    contentWidth,
    contentHeight
  }
}

/**
 * Get trim box (final page size after cutting)
 */
export function getTrimBox(specs: PrintSpecs): {
  x: number
  y: number
  width: number
  height: number
} {
  const { dpi, bleed } = specs
  const bleedPx = mmToPixels(bleed, dpi)
  
  return {
    x: bleedPx,
    y: bleedPx,
    width: mmToPixels(specs.width, dpi),
    height: mmToPixels(specs.height, dpi)
  }
}

/**
 * Get safe zone box (content should stay within this)
 */
export function getSafeZoneBox(specs: PrintSpecs): {
  x: number
  y: number
  width: number
  height: number
} {
  const { dpi, bleed, safeZone, margins } = specs
  const bleedPx = mmToPixels(bleed, dpi)
  const safePx = mmToPixels(safeZone, dpi)
  
  return {
    x: bleedPx + safePx + mmToPixels(margins.left, dpi),
    y: bleedPx + safePx + mmToPixels(margins.top, dpi),
    width: mmToPixels(specs.width - margins.left - margins.right - safeZone * 2, dpi),
    height: mmToPixels(specs.height - margins.top - margins.bottom - safeZone * 2, dpi)
  }
}

/**
 * Get spine width for perfect binding (approximate)
 * @param pageCount - Number of pages in the book
 * @param paperThickness - Paper thickness in mm (default 0.1mm for 80gsm)
 */
export function getSpineWidth(pageCount: number, paperThickness: number = 0.1): number {
  return pageCount * paperThickness
}

/**
 * Color space conversion utilities for CMYK
 */
export const COLOR_PROFILES = {
  // Common CMYK color profiles
  FOGRA39: 'Coated FOGRA39 (ISO 12647-2:2004)',
  FOGRA51: 'PSO Coated v3 (FOGRA51)',
  GRACOL: 'GRACoL 2006 Coated 1',
  SWOP: 'US Web Coated (SWOP) v2',
  JAPAN_COLOR: 'Japan Color 2001 Coated'
}

/**
 * Check if image resolution is sufficient for print
 * @param imageWidth - Image width in pixels
 * @param imageHeight - Image height in pixels
 * @param printWidth - Desired print width in mm
 * @param printHeight - Desired print height in mm
 * @param dpi - Target DPI
 */
export function checkResolution(
  imageWidth: number,
  imageHeight: number,
  printWidth: number,
  printHeight: number,
  dpi: number
): {
  isSufficient: boolean
  actualDPI: { width: number; height: number }
  recommendedMin: { width: number; height: number }
} {
  const requiredPixels = {
    width: mmToPixels(printWidth, dpi),
    height: mmToPixels(printHeight, dpi)
  }
  
  const actualDPI = {
    width: (imageWidth / printWidth) * 25.4,
    height: (imageHeight / printHeight) * 25.4
  }
  
  return {
    isSufficient: imageWidth >= requiredPixels.width && imageHeight >= requiredPixels.height,
    actualDPI,
    recommendedMin: requiredPixels
  }
}

/**
 * Export options for PDF generation
 */
export interface PDFExportOptions {
  paperSize: PaperSize
  dpi: number
  colorMode: ColorMode
  bleed: number
  includeCropMarks: boolean
  includeColorBars: boolean
  pdfStandard: 'PDF/X-1a' | 'PDF/X-3' | 'PDF/X-4' | 'PDF/A-1b' | null
}

export const DEFAULT_EXPORT_OPTIONS: PDFExportOptions = {
  paperSize: 'A4',
  dpi: 300,
  colorMode: 'CMYK',
  bleed: 3,
  includeCropMarks: true,
  includeColorBars: false,
  pdfStandard: 'PDF/X-4'
}
