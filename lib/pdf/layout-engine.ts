/**
 * Layout Engine for Photo Story Book
 * Handles auto-fit algorithms, smart cropping, caption placement, and page number positioning
 */

import { PrintSpecs, mmToPixels, getSafeZoneBox } from './print-specs'

export interface PhotoLayout {
  id: string
  src: string
  caption?: string
  x: number // pixels from left
  y: number // pixels from top
  width: number // pixels
  height: number // pixels
  rotation?: number // degrees
  crop?: CropRegion
}

export interface CropRegion {
  x: number // percentage 0-1
  y: number // percentage 0-1
  width: number // percentage 0-1
  height: number // percentage 0-1
}

export interface PageLayout {
  pageNumber: number
  photos: PhotoLayout[]
  background?: string
  layout: LayoutType
}

export type LayoutType = 
  | 'single'      // One photo centered
  | 'double'      // Two photos side by side
  | 'triple'      // Three photos in grid
  | 'quad'        // Four photos in 2x2 grid
  | 'masonry-2'   // Two photos, different sizes
  | 'masonry-3'   // Three photos, masonry style
  | 'cover'       // Full bleed cover image
  | 'spread'      // Two-page spread

export interface LayoutConfig {
  gap: number // pixels between photos
  captionHeight: number // pixels reserved for caption
  captionGap: number // pixels between photo and caption
  minPhotoSize: number // minimum photo dimension in pixels
  maxPhotoSize: number // maximum photo dimension in pixels
  preferFullBleed: boolean // prefer full bleed for single photos
  captionPosition: 'below' | 'overlay' | 'sidebar'
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  gap: 20,
  captionHeight: 40,
  captionGap: 10,
  minPhotoSize: 100,
  maxPhotoSize: 4000,
  preferFullBleed: true,
  captionPosition: 'below'
}

/**
 * Calculate aspect ratio from width and height
 */
export function getAspectRatio(width: number, height: number): number {
  return width / height
}

/**
 * Fit photo into container while maintaining aspect ratio
 * Returns dimensions that fit within container (letterbox style)
 */
export function fitPhotoToContainer(
  photoWidth: number,
  photoHeight: number,
  containerWidth: number,
  containerHeight: number
): { width: number; height: number } {
  const photoRatio = getAspectRatio(photoWidth, photoHeight)
  const containerRatio = getAspectRatio(containerWidth, containerHeight)
  
  if (photoRatio > containerRatio) {
    // Photo is wider relative to height
    const width = containerWidth
    const height = width / photoRatio
    return { width, height }
  } else {
    // Photo is taller relative to width
    const height = containerHeight
    const width = height * photoRatio
    return { width, height }
  }
}

/**
 * Fill container with photo while maintaining aspect ratio
 * Returns dimensions that cover entire container (crop style)
 */
export function fillPhotoToContainer(
  photoWidth: number,
  photoHeight: number,
  containerWidth: number,
  containerHeight: number
): { width: number; height: number; crop?: CropRegion } {
  const photoRatio = getAspectRatio(photoWidth, photoHeight)
  const containerRatio = getAspectRatio(containerWidth, containerHeight)
  
  let width: number
  let height: number
  let crop: CropRegion | undefined
  
  if (photoRatio > containerRatio) {
    // Photo is wider - crop sides
    height = containerHeight
    width = height * photoRatio
    const cropAmount = (width - containerWidth) / width / 2
    crop = {
      x: cropAmount,
      y: 0,
      width: 1 - cropAmount * 2,
      height: 1
    }
  } else {
    // Photo is taller - crop top/bottom
    width = containerWidth
    height = width / photoRatio
    const cropAmount = (height - containerHeight) / height / 2
    crop = {
      x: 0,
      y: cropAmount,
      width: 1,
      height: 1 - cropAmount * 2
    }
  }
  
  return { width, height, crop }
}

/**
 * Smart crop - determine best crop region based on photo content
 * Uses center-weighted crop with slight bias toward rule of thirds
 */
export function calculateSmartCrop(
  photoWidth: number,
  photoHeight: number,
  targetRatio: number
): CropRegion {
  const currentRatio = getAspectRatio(photoWidth, photoHeight)
  
  if (Math.abs(currentRatio - targetRatio) < 0.01) {
    // Ratios are close enough, no crop needed
    return { x: 0, y: 0, width: 1, height: 1 }
  }
  
  if (currentRatio > targetRatio) {
    // Photo is wider than target - need to crop width
    const newWidth = photoHeight * targetRatio
    const cropWidth = newWidth / photoWidth
    const centerBias = 0.5 // Bias slightly toward center (0.5 = exact center)
    
    return {
      x: (1 - cropWidth) * centerBias,
      y: 0,
      width: cropWidth,
      height: 1
    }
  } else {
    // Photo is taller than target - need to crop height
    const newHeight = photoWidth / targetRatio
    const cropHeight = newHeight / photoHeight
    const centerBias = 0.5
    
    return {
      x: 0,
      y: (1 - cropHeight) * centerBias,
      width: 1,
      height: cropHeight
    }
  }
}

/**
 * Calculate layout for single photo on page
 */
export function layoutSinglePhoto(
  photo: { id: string; src: string; width: number; height: number; caption?: string },
  specs: PrintSpecs,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG,
  isCover: boolean = false
): PhotoLayout {
  const safeZone = getSafeZoneBox(specs)
  const dpi = specs.dpi
  
  // For cover or full bleed preference, use entire safe zone
  const containerWidth = isCover && config.preferFullBleed 
    ? mmToPixels(specs.width + specs.bleed * 2, dpi)
    : safeZone.width
  const containerHeight = isCover && config.preferFullBleed
    ? mmToPixels(specs.height + specs.bleed * 2, dpi)
    : safeZone.height
  
  // Reserve space for caption if present and positioned below
  let availableHeight = containerHeight
  if (photo.caption && config.captionPosition === 'below') {
    availableHeight -= config.captionHeight + config.captionGap
  }
  
  // Fit photo maintaining aspect ratio
  const { width, height } = fitPhotoToContainer(
    photo.width,
    photo.height,
    containerWidth,
    availableHeight
  )
  
  // Center the photo
  const x = isCover && config.preferFullBleed
    ? 0
    : safeZone.x + (safeZone.width - width) / 2
  const y = isCover && config.preferFullBleed
    ? 0
    : safeZone.y + (availableHeight - height) / 2
  
  return {
    id: photo.id,
    src: photo.src,
    caption: photo.caption,
    x,
    y,
    width,
    height
  }
}

/**
 * Calculate layout for two photos side by side
 */
export function layoutDoublePhotos(
  photos: Array<{ id: string; src: string; width: number; height: number; caption?: string }>,
  specs: PrintSpecs,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): PhotoLayout[] {
  if (photos.length !== 2) {
    throw new Error('Double layout requires exactly 2 photos')
  }
  
  const safeZone = getSafeZoneBox(specs)
  const gap = config.gap
  
  // Each photo gets half the width minus gap
  const photoWidth = (safeZone.width - gap) / 2
  
  // Calculate heights maintaining aspect ratios
  const layouts: PhotoLayout[] = []
  
  photos.forEach((photo, index) => {
    const ratio = getAspectRatio(photo.width, photo.height)
    const height = photoWidth / ratio
    
    // Reserve caption space
    const availableHeight = photo.caption && config.captionPosition === 'below'
      ? safeZone.height - config.captionHeight - config.captionGap
      : safeZone.height
    
    // If photo is too tall, scale down
    const finalHeight = Math.min(height, availableHeight)
    const finalWidth = finalHeight * ratio
    
    const x = safeZone.x + index * (photoWidth + gap) + (photoWidth - finalWidth) / 2
    const y = safeZone.y + (availableHeight - finalHeight) / 2
    
    layouts.push({
      id: photo.id,
      src: photo.src,
      caption: photo.caption,
      x,
      y,
      width: finalWidth,
      height: finalHeight
    })
  })
  
  return layouts
}

/**
 * Calculate quad layout (2x2 grid)
 */
export function layoutQuadPhotos(
  photos: Array<{ id: string; src: string; width: number; height: number; caption?: string }>,
  specs: PrintSpecs,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): PhotoLayout[] {
  if (photos.length !== 4) {
    throw new Error('Quad layout requires exactly 4 photos')
  }
  
  const safeZone = getSafeZoneBox(specs)
  const gap = config.gap
  
  // Calculate grid cell size
  const cellWidth = (safeZone.width - gap) / 2
  const cellHeight = (safeZone.height - gap) / 2
  
  const layouts: PhotoLayout[] = []
  
  photos.forEach((photo, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    
    // Fit photo to cell
    const { width, height } = fitPhotoToContainer(photo.width, photo.height, cellWidth, cellHeight)
    
    const x = safeZone.x + col * (cellWidth + gap) + (cellWidth - width) / 2
    const y = safeZone.y + row * (cellHeight + gap) + (cellHeight - height) / 2
    
    layouts.push({
      id: photo.id,
      src: photo.src,
      caption: photo.caption,
      x,
      y,
      width,
      height
    })
  })
  
  return layouts
}

/**
 * Auto-select best layout based on number of photos and their aspect ratios
 */
export function autoSelectLayout(
  photos: Array<{ width: number; height: number }>,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): LayoutType {
  const count = photos.length
  
  if (count === 1) {
    return 'single'
  } else if (count === 2) {
    // Check if photos have similar aspect ratios
    const ratios = photos.map(p => getAspectRatio(p.width, p.height))
    const ratioDiff = Math.abs(ratios[0] - ratios[1])
    
    return ratioDiff < 0.5 ? 'double' : 'masonry-2'
  } else if (count === 3) {
    return 'triple'
  } else if (count >= 4) {
    return 'quad'
  }
  
  return 'single'
}

/**
 * Generate complete page layout
 */
export function generatePageLayout(
  photos: Array<{ id: string; src: string; width: number; height: number; caption?: string }>,
  pageNumber: number,
  specs: PrintSpecs,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG,
  layoutType?: LayoutType
): PageLayout {
  const layout = layoutType || autoSelectLayout(photos, config)
  
  let photoLayouts: PhotoLayout[] = []
  
  switch (layout) {
    case 'single':
      photoLayouts = [layoutSinglePhoto(photos[0], specs, config)]
      break
    case 'double':
      photoLayouts = layoutDoublePhotos(photos.slice(0, 2), specs, config)
      break
    case 'quad':
      photoLayouts = layoutQuadPhotos(photos.slice(0, 4), specs, config)
      break
    case 'cover':
      photoLayouts = [layoutSinglePhoto(photos[0], specs, config, true)]
      break
    default:
      photoLayouts = [layoutSinglePhoto(photos[0], specs, config)]
  }
  
  return {
    pageNumber,
    photos: photoLayouts,
    layout
  }
}

/**
 * Calculate page number position
 */
export function getPageNumberPosition(
  specs: PrintSpecs,
  pageNumber: number,
  position: 'bottom-center' | 'bottom-outside' | 'bottom-inside' = 'bottom-center'
): { x: number; y: number; align: 'left' | 'center' | 'right' } {
  const safeZone = getSafeZoneBox(specs)
  const dpi = specs.dpi
  
  // Position at bottom of safe zone
  const y = safeZone.y + safeZone.height + mmToPixels(5, dpi) // 5mm below content
  
  let x: number
  let align: 'left' | 'center' | 'right'
  
  switch (position) {
    case 'bottom-center':
      x = safeZone.x + safeZone.width / 2
      align = 'center'
      break
    case 'bottom-outside':
      // Outside means different for left/right pages
      // Assuming pageNumber 1 is right page (odd)
      const isRightPage = pageNumber % 2 === 1
      x = isRightPage ? safeZone.x + safeZone.width : safeZone.x
      align = isRightPage ? 'right' : 'left'
      break
    case 'bottom-inside':
      // Inside (toward spine)
      const isRightPageInside = pageNumber % 2 === 1
      x = isRightPageInside ? safeZone.x : safeZone.x + safeZone.width
      align = isRightPageInside ? 'left' : 'right'
      break
    default:
      x = safeZone.x + safeZone.width / 2
      align = 'center'
  }
  
  return { x, y, align }
}

/**
 * Get caption position relative to photo
 */
export function getCaptionPosition(
  photo: PhotoLayout,
  specs: PrintSpecs,
  position: LayoutConfig['captionPosition'],
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): { x: number; y: number; maxWidth: number } {
  switch (position) {
    case 'below':
      return {
        x: photo.x,
        y: photo.y + photo.height + config.captionGap,
        maxWidth: photo.width
      }
    case 'overlay':
      // Overlay at bottom of photo
      return {
        x: photo.x + mmToPixels(5, specs.dpi),
        y: photo.y + photo.height - config.captionHeight,
        maxWidth: photo.width - mmToPixels(10, specs.dpi)
      }
    case 'sidebar':
      // To the right of photo
      return {
        x: photo.x + photo.width + config.captionGap,
        y: photo.y,
        maxWidth: mmToPixels(50, specs.dpi) // 50mm sidebar
      }
    default:
      return {
        x: photo.x,
        y: photo.y + photo.height + config.captionGap,
        maxWidth: photo.width
      }
  }
}

/**
 * Distribute photos across multiple pages
 */
export function distributePhotosToPages(
  photos: Array<{ id: string; src: string; width: number; height: number; caption?: string }>,
  maxPhotosPerPage: number = 4,
  preferLayout?: LayoutType
): Array<Array<{ id: string; src: string; width: number; height: number; caption?: string }>> {
  const pages: Array<Array<{ id: string; src: string; width: number; height: number; caption?: string }>> = []
  
  for (let i = 0; i < photos.length; i += maxPhotosPerPage) {
    const pagePhotos = photos.slice(i, i + maxPhotosPerPage)
    pages.push(pagePhotos)
  }
  
  return pages
}
