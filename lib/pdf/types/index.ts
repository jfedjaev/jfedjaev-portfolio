export interface PDFExportOptions {
  bookId: string
  title: string
  subtitle?: string
  author?: string
  coverPhoto?: Photo
  chapters: ChapterWithPhotos[]
  template: 'classic' | 'modern' | 'travel'
  paperSize?: 'A4' | 'Letter' | 'A5'
  orientation?: 'portrait' | 'landscape'
  quality?: 'draft' | 'standard' | 'high'
  includeMap?: boolean
  mapStyle?: 'streets' | 'outdoors' | 'satellite' | 'light' | 'dark'
}

export interface ChapterWithPhotos {
  id: string
  title: string
  subtitle?: string
  description?: string
  photos: Photo[]
  mapBounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface Photo {
  id: string
  src: string
  thumbnail?: string
  caption?: string
  dateTaken?: Date
  location?: string
  hasGPS: boolean
  latitude?: number
  longitude?: number
  width: number
  height: number
}

export interface ExportJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  downloadUrl?: string
  error?: string
  createdAt: Date
  updatedAt: Date
  options: PDFExportOptions
}

export interface PDFPage {
  type: 'cover' | 'toc' | 'chapter' | 'photo-grid'
  pageNumber: number
  content: unknown
}

export type TemplateStyle = 'classic' | 'modern' | 'travel'

export interface TemplateConfig {
  name: string
  fonts: {
    heading: string
    body: string
    accent?: string
  }
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent?: string
  }
  spacing: {
    margin: number
    gutter: number
    lineHeight: number
  }
}
