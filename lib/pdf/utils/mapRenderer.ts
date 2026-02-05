import { Photo, ChapterWithPhotos } from '../types/index'

interface MapCacheEntry {
  url: string
  timestamp: number
  hits: number
}

const mapCache = new Map<string, MapCacheEntry>()
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export function generateMapCacheKey(
  photos: Photo[],
  style: string = 'streets',
  width: number = 600,
  height: number = 400
): string {
  const coords = photos
    .filter((p) => p.hasGPS && p.latitude && p.longitude)
    .map((p) => `${p.latitude!.toFixed(4)},${p.longitude!.toFixed(4)}`)
    .sort()
    .join(';')
  
  return `map:${style}:${width}x${height}:${coords}`
}

export function getCachedMapUrl(cacheKey: string): string | null {
  const entry = mapCache.get(cacheKey)
  if (!entry) return null
  
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    mapCache.delete(cacheKey)
    return null
  }
  
  entry.hits++
  return entry.url
}

export function cacheMapUrl(cacheKey: string, url: string): void {
  mapCache.set(cacheKey, {
    url,
    timestamp: Date.now(),
    hits: 1,
  })
}

export function calculateMapBounds(photos: Photo[]): {
  center: [number, number]
  zoom: number
  bbox?: [number, number, number, number]
} | null {
  const geoPhotos = photos.filter((p) => p.hasGPS && p.latitude && p.longitude)
  
  if (geoPhotos.length === 0) return null
  
  if (geoPhotos.length === 1) {
    return {
      center: [geoPhotos[0].longitude!, geoPhotos[0].latitude!],
      zoom: 12,
    }
  }
  
  const lats = geoPhotos.map((p) => p.latitude!)
  const lngs = geoPhotos.map((p) => p.longitude!)
  
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  
  const centerLat = (minLat + maxLat) / 2
  const centerLng = (minLng + maxLng) / 2
  
  // Calculate appropriate zoom level based on bounds
  const latDiff = maxLat - minLat
  const lngDiff = maxLng - minLng
  const maxDiff = Math.max(latDiff, lngDiff)
  
  let zoom = 10
  if (maxDiff < 0.01) zoom = 15
  else if (maxDiff < 0.05) zoom = 13
  else if (maxDiff < 0.1) zoom = 11
  else if (maxDiff < 0.5) zoom = 9
  else if (maxDiff < 1) zoom = 7
  else zoom = 5
  
  return {
    center: [centerLng, centerLat],
    zoom,
    bbox: [minLng, minLat, maxLng, maxLat],
  }
}

export async function generateMapboxStaticUrl(
  chapter: ChapterWithPhotos,
  style: string = 'streets',
  width: number = 600,
  height: number = 400
): Promise<string | null> {
  if (!MAPBOX_TOKEN) {
    console.warn('Mapbox token not configured')
    return null
  }
  
  const bounds = calculateMapBounds(chapter.photos)
  if (!bounds) return null
  
  const cacheKey = generateMapCacheKey(chapter.photos, style, width, height)
  const cached = getCachedMapUrl(cacheKey)
  if (cached) return cached
  
  const markerOverlay = chapter.photos
    .filter((p) => p.hasGPS && p.latitude && p.longitude)
    .map((p, i) => {
      const color = i === 0 ? 'ff0000' : '0066cc'
      return `pin-l-${i + 1}+${color}(${p.longitude},${p.latitude})`
    })
    .join(',')
  
  let url: string
  
  if (bounds.bbox) {
    // Use auto-fit with bounding box
    const bbox = bounds.bbox.join(',')
    url = `https://api.mapbox.com/styles/v1/mapbox/${style}-v11/static/${markerOverlay}/[${bbox}]/${width}x${height}?access_token=${MAPBOX_TOKEN}&padding=50`
  } else {
    // Use center and zoom
    const center = bounds.center.join(',')
    url = `https://api.mapbox.com/styles/v1/mapbox/${style}-v11/static/${markerOverlay}/${center},${bounds.zoom}/${width}x${height}?access_token=${MAPBOX_TOKEN}`
  }
  
  cacheMapUrl(cacheKey, url)
  return url
}

export function generateFallbackMapHTML(
  chapter: ChapterWithPhotos,
  width: number = 600,
  height: number = 400
): string {
  const bounds = calculateMapBounds(chapter.photos)
  
  if (!bounds) {
    return `
      <div style="
        width: ${width}px;
        height: ${height}px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: system-ui, sans-serif;
        border-radius: 8px;
      ">
        <div style="text-align: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 12px;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p style="font-size: 14px; opacity: 0.9;">No location data</p>
        </div>
      </div>
    `
  }
  
  const geoPhotos = chapter.photos.filter((p) => p.hasGPS && p.latitude && p.longitude)
  
  return `
    <div style="
      width: ${width}px;
      height: ${height}px;
      background: linear-gradient(135deg, #e0e7ff 0%, #d1e0fd 100%);
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      font-family: system-ui, sans-serif;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background-image: 
          radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
      "></div>
      
      ${geoPhotos.map((p, i) => {
        // Simple projection for visualization
        const x = 50 + (p.longitude! - bounds.center[0]) * 1000
        const y = 50 + (bounds.center[1] - p.latitude!) * 1000
        const clampedX = Math.max(20, Math.min(width - 20, x))
        const clampedY = Math.max(20, Math.min(height - 20, y))
        
        return `
          <div style="
            position: absolute;
            left: ${clampedX}px;
            top: ${clampedY}px;
            transform: translate(-50%, -100%);
          ">
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
              <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22c0-7.732-6.268-14-14-14z" fill="${i === 0 ? '#ef4444' : '#3b82f6'}"/>
              <circle cx="14" cy="14" r="5" fill="white"/>
              <text x="14" y="17" text-anchor="middle" font-size="8" font-weight="bold" fill="${i === 0 ? '#ef4444' : '#3b82f6'}">${i + 1}</text>
            </svg>
          </div>
        `
      }).join('')}
      
      <div style="
        position: absolute;
        bottom: 12px;
        left: 12px;
        background: rgba(255,255,255,0.95);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        color: #374151;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        ${geoPhotos.length} location${geoPhotos.length > 1 ? 's' : ''}
      </div>
    </div>
  `
}
