export interface Photo {
  id: string
  src: string
  thumbnail: string
  caption?: string
  dateTaken: Date
  hasGPS: boolean
  latitude?: number
  longitude?: number
  chapterId?: string
  order: number
  uploadProgress?: number
  isUploading?: boolean
  width: number
  height: number
}

export interface Chapter {
  id: string
  title: string
  order: number
}

export interface PhotoSelection {
  selectedIds: Set<string>
  lastSelectedId: string | null
}

export type BulkAction = 'move' | 'delete' | 'rotate-left' | 'rotate-right'

export interface PhotoDragItem {
  id: string
  index: number
}
