'use client'

import { motion } from 'framer-motion'
import { 
  MapPin, 
  GripVertical, 
  Check,
  Image as ImageIcon
} from 'lucide-react'
import { Photo } from '../types'
import { usePhotoDrag } from '../hooks/usePhotoDrag'

interface PhotoCardProps {
  photo: Photo
  index: number
  isSelected: boolean
  selectionMode?: 'single' | 'multi'
  onToggleSelect: (id: string, event?: React.MouseEvent | React.KeyboardEvent) => void
  onClick?: (photo: Photo) => void
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string, newIndex: number) => void
  className?: string
}

export function PhotoCard({
  photo,
  index,
  isSelected,
  selectionMode = 'multi',
  onToggleSelect,
  onClick,
  onDragStart,
  onDragEnd,
  className = ''
}: PhotoCardProps) {
  const {
    attributes,
    setNodeRef,
    handleProps,
    style,
    isDragging
  } = usePhotoDrag({
    photo,
    index,
    isSelected,
    onDragStart,
    onDragEnd
  })

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-drag-handle]') || 
        (e.target as HTMLElement).closest('[data-checkbox]')) {
      return
    }
    
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      onToggleSelect(photo.id, e)
    } else {
      onClick?.(photo)
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSelect(photo.id, e)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const aspectRatio = photo.width / photo.height
  const gridRowSpan = aspectRatio < 0.8 ? 'row-span-2' : 'row-span-1'

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      style={style}
      layoutId={photo.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800
        cursor-pointer select-none
        ${gridRowSpan}
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        ${isDragging ? 'shadow-2xl scale-105' : 'hover:shadow-lg'}
        ${className}
      `}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onToggleSelect(photo.id, e)
        }
      }}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`Photo ${photo.caption || photo.id}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-full min-h-[150px]">
        {photo.thumbnail ? (
          <img
            src={photo.thumbnail}
            alt={photo.caption || `Photo ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {/* Upload Progress Overlay */}
        {photo.isUploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
            <div className="w-3/4 max-w-[150px] h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${photo.uploadProgress || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-white text-sm font-medium">
              {photo.uploadProgress || 0}%
            </span>
          </div>
        )}

        {/* Selection Checkbox */}
        <div 
          data-checkbox
          onClick={handleCheckboxClick}
          className={`
            absolute top-2 left-2 z-10
            w-6 h-6 rounded-md border-2 flex items-center justify-center
            transition-all duration-200
            ${isSelected 
              ? 'bg-blue-500 border-blue-500' 
              : 'bg-white/90 border-gray-300 opacity-0 group-hover:opacity-100 dark:bg-gray-800/90 dark:border-gray-600'
            }
          `}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>

        {/* Drag Handle */}
        <div
          data-drag-handle
          ref={handleProps.ref}
          {...handleProps.attributes}
          {...handleProps.listeners}
          className={`
            absolute top-2 right-2 z-10 p-1.5 rounded-md
            bg-black/30 hover:bg-black/50 text-white
            cursor-grab active:cursor-grabbing
            opacity-0 group-hover:opacity-100 transition-opacity
            ${isDragging ? 'opacity-100 cursor-grabbing' : ''}
          `}
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Caption Overlay */}
        {(photo.caption || photo.hasGPS) && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            {photo.caption && (
              <p className="text-white text-sm font-medium line-clamp-2">
                {photo.caption}
              </p>
            )}
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs">
          {formatDate(photo.dateTaken)}
        </div>

        {/* GPS Indicator */}
        {photo.hasGPS && (
          <div className="absolute bottom-2 left-2 p-1.5 rounded-full bg-blue-500/90 text-white">
            <MapPin className="w-3 h-3" />
          </div>
        )}

        {/* Selected Indicator Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
        )}
      </div>
    </motion.div>
  )
}
