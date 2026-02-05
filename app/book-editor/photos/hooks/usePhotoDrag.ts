'use client'

import { useCallback } from 'react'
import {
  useSortable,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Photo } from '../types'

interface UsePhotoDragOptions {
  photo: Photo
  index: number
  isSelected: boolean
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string, newIndex: number) => void
}

interface UsePhotoDragReturn {
  attributes: Record<string, any>
  listeners: Record<string, any>
  setNodeRef: (node: HTMLElement | null) => void
  setActivatorNodeRef: (node: HTMLElement | null) => void
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null
  transition: string | undefined
  isDragging: boolean
  isSorting: boolean
  style: React.CSSProperties
  handleProps: {
    ref: (node: HTMLElement | null) => void
    attributes: Record<string, any>
    listeners: Record<string, any>
  }
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export function usePhotoDrag({
  photo,
  index,
  isSelected,
  onDragStart,
  onDragEnd
}: UsePhotoDragOptions): UsePhotoDragReturn {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: photo.id,
    data: {
      type: 'Photo',
      photo,
      index,
      isSelected,
    },
  })

  const handleDragStart = useCallback(() => {
    onDragStart?.(photo.id)
  }, [photo.id, onDragStart])

  const handleDragEnd = useCallback(() => {
    onDragEnd?.(photo.id, index)
  }, [photo.id, index, onDragEnd])

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  }

  return {
    attributes: {
      ...attributes,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    },
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
    style,
    handleProps: {
      ref: setActivatorNodeRef,
      attributes,
      listeners,
    }
  }
}

// Helper hook for the grid container
interface UsePhotoGridDragOptions {
  photos: Photo[]
  selectedIds: Set<string>
  onReorder: (photoIds: string[]) => void
  onDragSelection?: (draggedId: string, targetIndex: number) => void
}

export function usePhotoGridDrag({
  photos,
  selectedIds,
  onReorder,
  onDragSelection
}: UsePhotoGridDragOptions) {
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = photos.findIndex((p) => p.id === active.id)
    const newIndex = photos.findIndex((p) => p.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    // If multiple items are selected and we're dragging one of them,
    // move all selected items together
    if (selectedIds.has(active.id) && selectedIds.size > 1) {
      const selectedPhotos = photos.filter((p) => selectedIds.has(p.id))
      const unselectedPhotos = photos.filter((p) => !selectedIds.has(p.id))
      
      // Calculate new positions for selected items
      const reordered = [...unselectedPhotos]
      const insertIndex = newIndex > oldIndex 
        ? newIndex - selectedPhotos.length + 1
        : newIndex
      
      reordered.splice(insertIndex, 0, ...selectedPhotos)
      onReorder(reordered.map((p) => p.id))
      onDragSelection?.(active.id, newIndex)
    } else {
      // Single item drag - reorder normally
      const reordered = [...photos]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)
      onReorder(reordered.map((p) => p.id))
    }
  }, [photos, selectedIds, onReorder, onDragSelection])

  return {
    handleDragEnd,
    dropAnimation,
  }
}
