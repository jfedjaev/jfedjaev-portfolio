'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { Photo } from '../types'
import { usePhotoSelection } from '../hooks/usePhotoSelection'
import { usePhotoGridDrag } from '../hooks/usePhotoDrag'
import { PhotoCard } from './PhotoCard'
import { PhotoToolbar } from './PhotoToolbar'
import { ImageIcon } from 'lucide-react'

interface PhotoGridProps {
  photos: Photo[]
  chapters?: { id: string; title: string }[]
  columns?: 2 | 3 | 4 | 5 | 6
  gap?: 'small' | 'medium' | 'large'
  showToolbar?: boolean
  allowSelection?: boolean
  allowDrag?: boolean
  onReorder?: (photoIds: string[]) => void
  onMoveToChapter?: (photoIds: string[], chapterId: string | undefined) => void
  onDelete?: (photoIds: string[]) => void
  onRotate?: (photoIds: string[], direction: 'left' | 'right') => void
  onPhotoClick?: (photo: Photo) => void
  emptyState?: React.ReactNode
  className?: string
}

const gapClasses = {
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6'
}

const columnClasses = {
  2: 'grid-cols-2 sm:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
}

export function PhotoGrid({
  photos,
  chapters = [],
  columns = 4,
  gap = 'medium',
  showToolbar = true,
  allowSelection = true,
  allowDrag = true,
  onReorder,
  onMoveToChapter,
  onDelete,
  onRotate,
  onPhotoClick,
  emptyState,
  className = ''
}: PhotoGridProps) {
  const {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll
  } = usePhotoSelection({ photos })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const { handleDragEnd } = usePhotoGridDrag({
    photos,
    selectedIds,
    onReorder: onReorder || (() => {})
  })

  const selectedPhotos = useMemo(() => {
    return photos.filter((p) => selectedIds.has(p.id))
  }, [photos, selectedIds])

  const activePhotos = useMemo(() => {
    return photos.filter((p) => !p.isUploading)
  }, [photos])

  const uploadingPhotos = useMemo(() => {
    return photos.filter((p) => p.isUploading)
  }, [photos])

  const handleMoveToChapter = (chapterId: string | undefined) => {
    onMoveToChapter?.(Array.from(selectedIds), chapterId)
    deselectAll()
  }

  const handleDelete = () => {
    onDelete?.(Array.from(selectedIds))
    deselectAll()
  }

  const handleRotate = (direction: 'left' | 'right') => {
    onRotate?.(Array.from(selectedIds), direction)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === photos.length) {
      deselectAll()
    } else {
      selectAll()
    }
  }

  if (photos.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
        {emptyState || (
          <>
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No photos yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Upload photos to get started
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      {showToolbar && (
        <PhotoToolbar
          selectedCount={selectedIds.size}
          totalCount={photos.length}
          chapters={chapters}
          onSelectAll={handleSelectAll}
          onMoveToChapter={handleMoveToChapter}
          onDelete={handleDelete}
          onRotate={handleRotate}
          onClearSelection={deselectAll}
          className="mb-4"
        />
      )}

      {/* Photo Grid */}
      <DndContext
        sensors={allowDrag ? sensors : undefined}
        collisionDetection={closestCenter}
        onDragEnd={allowDrag ? handleDragEnd : undefined}
      >
        <SortableContext
          items={photos.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <motion.div
            layout
            className={`
              grid auto-rows-[200px]
              ${columnClasses[columns]}
              ${gapClasses[gap]}
            `}
          >
            <AnimatePresence mode="popLayout">
              {activePhotos.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  isSelected={allowSelection && isSelected(photo.id)}
                  onToggleSelect={allowSelection ? toggleSelection : () => {}}
                  onClick={onPhotoClick}
                />
              ))}
              
              {/* Uploading photos (non-draggable) */}
              {uploadingPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layoutId={photo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <PhotoCard
                    photo={photo}
                    index={activePhotos.length + index}
                    isSelected={false}
                    onToggleSelect={() => {}}
                    onClick={undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>

        {/* Drag Overlay for smooth drag preview */}
        <DragOverlay dropAnimation={defaultDropAnimationSideEffects({})}>
          {selectedIds.size > 0 ? (
            <div className="relative">
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {selectedIds.size}
              </div>
              {selectedPhotos[0] && (
                <div className="w-40 h-40 rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={selectedPhotos[0].thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Selection Info */}
      {allowSelection && selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full text-sm font-medium shadow-lg"
        >
          {selectedIds.size} selected
        </motion.div>
      )}
    </div>
  )
}
