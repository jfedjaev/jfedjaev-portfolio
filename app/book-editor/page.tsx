'use client'

import { useState, useCallback } from 'react'
import { PhotoGrid } from './photos/components/PhotoGrid'
import { Photo } from './photos/types'
import { PDFExportButton } from './components/PDFExportButton'

// Demo data
const demoPhotos: Photo[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    caption: 'Mountain landscape at sunrise',
    dateTaken: new Date('2024-01-15'),
    hasGPS: true,
    latitude: 46.8182,
    longitude: 8.2275,
    chapterId: 'ch1',
    order: 0,
    width: 800,
    height: 600
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    caption: 'Forest path in autumn',
    dateTaken: new Date('2024-01-14'),
    hasGPS: false,
    chapterId: 'ch1',
    order: 1,
    width: 600,
    height: 800
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400',
    dateTaken: new Date('2024-01-13'),
    hasGPS: true,
    latitude: 36.0544,
    longitude: -112.1401,
    chapterId: 'ch1',
    order: 2,
    width: 800,
    height: 500
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    caption: 'Lake reflection',
    dateTaken: new Date('2024-01-12'),
    hasGPS: false,
    chapterId: 'ch2',
    order: 3,
    width: 800,
    height: 600
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    caption: 'Foggy morning in the valley',
    dateTaken: new Date('2024-01-11'),
    hasGPS: true,
    latitude: 37.8651,
    longitude: -119.5383,
    chapterId: 'ch2',
    order: 4,
    width: 600,
    height: 900
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
    dateTaken: new Date('2024-01-10'),
    hasGPS: false,
    chapterId: 'ch3',
    order: 5,
    width: 800,
    height: 600
  }
]

const demoChapters = [
  { 
    id: 'ch1', 
    title: 'Chapter 1: The Journey Begins',
    subtitle: 'Starting our adventure',
    description: 'The first leg of our journey took us through stunning mountain landscapes and ancient forests.',
    photos: [] as Photo[]
  },
  { 
    id: 'ch2', 
    title: 'Chapter 2: Into the Wild',
    subtitle: 'Exploring the unknown',
    description: 'Venturing deeper into the wilderness, we discovered hidden lakes and misty valleys.',
    photos: [] as Photo[]
  },
  { 
    id: 'ch3', 
    title: 'Chapter 3: Mountain Pass',
    subtitle: 'The final ascent',
    description: 'The challenging climb to the summit rewarded us with breathtaking panoramic views.',
    photos: [] as Photo[]
  }
]

// Assign photos to chapters
const chaptersWithPhotos = demoChapters.map(ch => ({
  ...ch,
  photos: demoPhotos.filter(p => p.chapterId === ch.id)
}))

export default function BookEditorPage() {
  const [photos, setPhotos] = useState<Photo[]>(demoPhotos)

  const handleReorder = useCallback((photoIds: string[]) => {
    const photoMap = new Map(photos.map((p) => [p.id, p]))
    const reordered = photoIds
      .map((id) => photoMap.get(id))
      .filter((p): p is Photo => p !== undefined)
      .map((p, index) => ({ ...p, order: index }))
    setPhotos(reordered)
  }, [photos])

  const handleMoveToChapter = useCallback((photoIds: string[], chapterId: string | undefined) => {
    setPhotos((prev) =>
      prev.map((p) =>
        photoIds.includes(p.id) ? { ...p, chapterId } : p
      )
    )
  }, [])

  const handleDelete = useCallback((photoIds: string[]) => {
    setPhotos((prev) => prev.filter((p) => !photoIds.includes(p.id)))
  }, [])

  const handleRotate = useCallback((photoIds: string[], direction: 'left' | 'right') => {
    console.log(`Rotating ${photoIds.length} photos ${direction}`)
  }, [])

  const handlePhotoClick = useCallback((photo: Photo) => {
    console.log('Clicked photo:', photo.id)
  }, [])

  // Get updated chapters with current photos
  const currentChapters = demoChapters.map(ch => ({
    ...ch,
    photos: photos.filter(p => p.chapterId === ch.id)
  }))

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Book Editor - Photo Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Select, organize, and manage your photos. Use Shift+Click for range selection,
              Ctrl/Cmd+Click for multi-select. Drag to reorder.
            </p>
          </div>
          <PDFExportButton
            bookId="demo-book-001"
            title="Mountain Adventure 2024"
            subtitle="A journey through the Alps"
            author="Photo Story Book"
            coverPhoto={photos[0]}
            chapters={currentChapters}
          />
        </div>

        <PhotoGrid
          photos={photos}
          chapters={demoChapters}
          columns={4}
          gap="medium"
          onReorder={handleReorder}
          onMoveToChapter={handleMoveToChapter}
          onDelete={handleDelete}
          onRotate={handleRotate}
          onPhotoClick={handlePhotoClick}
        />
      </div>
    </main>
  )
}
