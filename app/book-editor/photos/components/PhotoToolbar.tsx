'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare,
  Square,
  X,
  FolderOpen,
  Trash2,
  RotateCcw,
  RotateCw,
  ChevronDown,
  Move
} from 'lucide-react'

interface Chapter {
  id: string
  title: string
}

interface PhotoToolbarProps {
  selectedCount: number
  totalCount: number
  chapters?: Chapter[]
  onSelectAll: () => void
  onMoveToChapter: (chapterId: string | undefined) => void
  onDelete: () => void
  onRotate: (direction: 'left' | 'right') => void
  onClearSelection: () => void
  className?: string
}

export function PhotoToolbar({
  selectedCount,
  totalCount,
  chapters = [],
  onSelectAll,
  onMoveToChapter,
  onDelete,
  onRotate,
  onClearSelection,
  className = ''
}: PhotoToolbarProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const [showRotateMenu, setShowRotateMenu] = useState(false)

  const allSelected = selectedCount === totalCount && totalCount > 0

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Left Section - Selection */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>
              {selectedCount > 0 
                ? `${selectedCount} selected` 
                : 'Select all'
              }
            </span>
          </button>

          {selectedCount > 0 && (
            <button
              onClick={onClearSelection}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Section - Bulk Actions */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              {/* Move to Chapter */}
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Move className="w-4 h-4" />
                  <span>Move</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showMoveMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showMoveMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          onMoveToChapter(undefined)
                          setShowMoveMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FolderOpen className="w-4 h-4 inline mr-2" />
                        No chapter (uncategorized)
                      </button>
                      
                      {chapters.length > 0 && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                          {chapters.map((chapter) => (
                            <button
                              key={chapter.id}
                              onClick={() => {
                                onMoveToChapter(chapter.id)
                                setShowMoveMenu(false)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <FolderOpen className="w-4 h-4 inline mr-2" />
                              {chapter.title}
                            </button>
                          ))}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rotate */}
              <div className="relative">
                <button
                  onClick={() => setShowRotateMenu(!showRotateMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Rotate</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showRotateMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showRotateMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          onRotate('left')
                          setShowRotateMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 inline mr-2" />
                        Rotate left
                      </button>
                      <button
                        onClick={() => {
                          onRotate('right')
                          setShowRotateMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <RotateCw className="w-4 h-4 inline mr-2" />
                        Rotate right
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delete */}
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menus */}
      {(showMoveMenu || showRotateMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowMoveMenu(false)
            setShowRotateMenu(false)
          }}
        />
      )}
    </div>
  )
}
