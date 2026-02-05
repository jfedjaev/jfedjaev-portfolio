'use client'

import { useState } from 'react'
import { usePDFExport } from '@/hooks/usePDFExport'
import { ExportProgress } from '@/components/export/ExportProgress'
import { PDFExportOptions } from '@/lib/pdf/types'
import { Photo } from '../photos/types'
import { FileDown, Loader2, Settings } from 'lucide-react'

interface PDFExportButtonProps {
  bookId: string
  title: string
  subtitle?: string
  author?: string
  coverPhoto?: Photo
  chapters: Array<{
    id: string
    title: string
    subtitle?: string
    description?: string
    photos: Photo[]
  }>
}

export function PDFExportButton({
  bookId,
  title,
  subtitle,
  author,
  coverPhoto,
  chapters,
}: PDFExportButtonProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [template, setTemplate] = useState<'classic' | 'modern' | 'travel'>('modern')
  const [includeMap, setIncludeMap] = useState(true)
  const [mapStyle, setMapStyle] = useState<'streets' | 'outdoors' | 'satellite'>('outdoors')

  const {
    job,
    progress,
    status,
    isLoading,
    error,
    canDownload,
    downloadUrl,
    startExport,
    cancelExport,
    retryExport,
  } = usePDFExport({
    onComplete: (job) => {
      console.log('Export complete:', job)
    },
    onError: (err) => {
      console.error('Export error:', err)
    },
  })

  const handleExport = async () => {
    setShowSettings(false)
    setShowExport(true)

    const options: PDFExportOptions = {
      bookId,
      title,
      subtitle,
      author,
      coverPhoto,
      template,
      includeMap,
      mapStyle,
      chapters: chapters.map((ch) => ({
        ...ch,
        photos: ch.photos.map((p) => ({
          ...p,
          dateTaken: p.dateTaken ? new Date(p.dateTaken) : undefined,
        })),
      })),
    }

    await startExport(options)
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  const handleClose = () => {
    setShowExport(false)
    if (job && (status === 'processing' || status === 'pending')) {
      cancelExport()
    }
  }

  const totalPhotos = chapters.reduce((acc, ch) => acc + ch.photos.length, 0)
  const geoPhotos = chapters.reduce(
    (acc, ch) => acc + ch.photos.filter((p) => p.hasGPS).length,
    0
  )

  return (
    <div className="relative">
      {/* Export Button */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSettings(true)}
          disabled={isLoading || status === 'processing' || status === 'pending'}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {isLoading || status === 'processing' || status === 'pending' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Export PDF
            </>
          )}
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                PDF Export Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['classic', 'modern', 'travel'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      template === t
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="capitalize">{t}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {template === 'classic' && 'Elegant serif fonts with traditional book layout'}
                {template === 'modern' && 'Clean sans-serif with contemporary design'}
                {template === 'travel' && 'Adventure style with decorative elements'}
              </p>
            </div>

            {/* Map Options */}
            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={includeMap}
                  onChange={(e) => setIncludeMap(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include location maps
                </span>
              </label>
              {geoPhotos === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 ml-6">
                  No photos have GPS data
                </p>
              )}
              {includeMap && geoPhotos > 0 && (
                <select
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value as typeof mapStyle)}
                  className="mt-2 ml-6 block w-48 text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="streets">Streets</option>
                  <option value="outdoors">Outdoors</option>
                  <option value="satellite">Satellite</option>
                </select>
              )}
            </div>

            {/* Export Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Export Summary
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Chapters:</span>
                  <span>{chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Photos:</span>
                  <span>{totalPhotos}</span>
                </div>
                <div className="flex justify-between">
                  <span>With location:</span>
                  <span>{geoPhotos}</span>
                </div>
                <div className="flex justify-between">
                  <span>Template:</span>
                  <span className="capitalize">{template}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Start Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Progress */}
      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <ExportProgress
            job={job}
            progress={progress}
            status={status}
            isLoading={isLoading}
            error={error}
            canDownload={canDownload}
            downloadUrl={downloadUrl}
            onCancel={cancelExport}
            onRetry={retryExport}
            onDownload={handleDownload}
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  )
}
