'use client'

import { useCallback, useState, useRef } from 'react'
import { Photo } from '../types'

interface UsePhotoSelectionOptions {
  photos: Photo[]
  onSelectionChange?: (selectedIds: string[]) => void
}

interface UsePhotoSelectionReturn {
  selectedIds: Set<string>
  lastSelectedId: string | null
  isSelected: (id: string) => boolean
  toggleSelection: (id: string, event?: React.MouseEvent | React.KeyboardEvent) => void
  selectRange: (startId: string, endId: string) => void
  selectAll: () => void
  deselectAll: () => void
  selectOnly: (id: string) => void
}

export function usePhotoSelection({
  photos,
  onSelectionChange
}: UsePhotoSelectionOptions): UsePhotoSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const lastSelectedIdRef = useRef<string | null>(null)

  const updateSelection = useCallback((newSelection: Set<string>) => {
    setSelectedIds(newSelection)
    onSelectionChange?.(Array.from(newSelection))
  }, [onSelectionChange])

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id)
  }, [selectedIds])

  const toggleSelection = useCallback((id: string, event?: React.MouseEvent | React.KeyboardEvent) => {
    const isCtrlPressed = event?.ctrlKey || event?.metaKey
    const isShiftPressed = event?.shiftKey
    const isSpacePressed = (event as React.KeyboardEvent)?.key === ' '

    setSelectedIds((prev) => {
      const newSelection = new Set(prev)

      if (isShiftPressed && lastSelectedIdRef.current) {
        // Range selection
        const photoIds = photos.map((p) => p.id)
        const startIndex = photoIds.indexOf(lastSelectedIdRef.current)
        const endIndex = photoIds.indexOf(id)
        
        if (startIndex !== -1 && endIndex !== -1) {
          const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)]
          for (let i = min; i <= max; i++) {
            newSelection.add(photoIds[i])
          }
        }
      } else if (isCtrlPressed || isSpacePressed) {
        // Toggle single item
        if (newSelection.has(id)) {
          newSelection.delete(id)
        } else {
          newSelection.add(id)
        }
        lastSelectedIdRef.current = id
      } else {
        // Single selection (clear others)
        newSelection.clear()
        newSelection.add(id)
        lastSelectedIdRef.current = id
      }

      onSelectionChange?.(Array.from(newSelection))
      return newSelection
    })
  }, [photos, onSelectionChange])

  const selectRange = useCallback((startId: string, endId: string) => {
    const photoIds = photos.map((p) => p.id)
    const startIndex = photoIds.indexOf(startId)
    const endIndex = photoIds.indexOf(endId)
    
    if (startIndex === -1 || endIndex === -1) return

    const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)]
    const newSelection = new Set<string>()
    
    for (let i = min; i <= max; i++) {
      newSelection.add(photoIds[i])
    }
    
    updateSelection(newSelection)
  }, [photos, updateSelection])

  const selectAll = useCallback(() => {
    const allIds = new Set(photos.map((p) => p.id))
    updateSelection(allIds)
    if (photos.length > 0) {
      lastSelectedIdRef.current = photos[0].id
    }
  }, [photos, updateSelection])

  const deselectAll = useCallback(() => {
    updateSelection(new Set())
    lastSelectedIdRef.current = null
  }, [updateSelection])

  const selectOnly = useCallback((id: string) => {
    const newSelection = new Set([id])
    updateSelection(newSelection)
    lastSelectedIdRef.current = id
  }, [updateSelection])

  return {
    selectedIds,
    lastSelectedId: lastSelectedIdRef.current,
    isSelected,
    toggleSelection,
    selectRange,
    selectAll,
    deselectAll,
    selectOnly
  }
}
