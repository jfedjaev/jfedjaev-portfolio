'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  RotateCcw,
  Clock
} from 'lucide-react'
import { ExportJob } from '@/lib/pdf/types'

interface ExportProgressProps {
  job: ExportJob | null
  progress: number
  status: ExportJob['status'] | null
  isLoading: boolean
  error: string | null
  canDownload: boolean
  downloadUrl: string | null
  onCancel: () => void
  onRetry: () => void
  onDownload: () => void
  onClose: () => void
  compact?: boolean
}

export function ExportProgress({
  job,
  progress,
  status,
  isLoading,
  error,
  canDownload,
  downloadUrl,
  onCancel,
  onRetry,
  onDownload,
  onClose,
  compact = false,
}: ExportProgressProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  // Auto-show details when processing
  useEffect(() => {
    if (status === 'processing') {
      setShowDetails(true)
    }
  }, [status])
  
  if (!job && !error && !isLoading) return null
  
  const isPending = status === 'pending'
  const isProcessing = status === 'processing'
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'
  
  // Compact version for inline display
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {isPending && (
          <>
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Waiting...</span>
          </>
        )}
        {isProcessing && (
          <>
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            <div className="flex-1">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {job?.message || 'Generating PDF...'}
              </div>
              <div className="mt-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <span className="text-xs text-gray-500">{progress}%</span>
          </>
        )}
        {isCompleted && (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">Ready!</span>
            <button
              onClick={onDownload}
              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}
        {isFailed && (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400 flex-1">Failed</span>
            <button
              onClick={onRetry}
              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    )
  }
  
  // Full card version
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isCompleted ? 'bg-green-100 dark:bg-green-900/20' :
              isFailed ? 'bg-red-100 dark:bg-red-900/20' :
              isProcessing ? 'bg-blue-100 dark:bg-blue-900/20' :
              'bg-amber-100 dark:bg-amber-900/20'
            }`}>
              <FileText className={`w-5 h-5 ${
                isCompleted ? 'text-green-600 dark:text-green-400' :
                isFailed ? 'text-red-600 dark:text-red-400' :
                isProcessing ? 'text-blue-600 dark:text-blue-400' :
                'text-amber-600 dark:text-amber-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                PDF Export
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {job?.options.title || 'Untitled Book'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Status Icon */}
          <div className="flex justify-center mb-4">
            {isPending && (
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
            )}
            {isProcessing && (
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            )}
            {isCompleted && (
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {isFailed && (
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          
          {/* Status Text */}
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isPending && 'Waiting in queue...'}
              {isProcessing && job?.message}
              {isCompleted && 'PDF ready for download!'}
              {isFailed && 'Export failed'}
            </p>
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {error}
              </p>
            )}
          </div>
          
          {/* Progress Bar */}
          {(isPending || isProcessing) && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    isPending ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
          
          {/* Details */}
          {showDetails && job && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex justify-between">
                <span>Template:</span>
                <span className="capitalize">{job.options.template}</span>
              </div>
              <div className="flex justify-between">
                <span>Chapters:</span>
                <span>{job.options.chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Photos:</span>
                <span>
                  {job.options.chapters.reduce((acc, ch) => acc + ch.photos.length, 0)}
                </span>
              </div>
              {job.createdAt && (
                <div className="flex justify-between">
                  <span>Started:</span>
                  <span>{new Date(job.createdAt).toLocaleTimeString()}</span>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Actions */}
          <div className="flex gap-2">
            {isCompleted && (
              <button
                onClick={onDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            )}
            
            {isFailed && (
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            )}
            
            {(isPending || isProcessing) && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            )}
            
            {!isProcessing && !isPending && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {showDetails ? 'Hide' : 'Details'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Toast-style notification variant
interface ExportToastProps {
  job: ExportJob | null
  progress: number
  status: ExportJob['status'] | null
  onDismiss: () => void
}

export function ExportToast({ job, progress, status, onDismiss }: ExportToastProps) {
  if (!job) return null
  
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm ${
        isCompleted 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : isFailed
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="flex items-start gap-3">
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
        ) : isFailed ? (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
        ) : (
          <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin mt-0.5" />
        )}
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${
            isCompleted 
              ? 'text-green-900 dark:text-green-100' 
              : isFailed
              ? 'text-red-900 dark:text-red-100'
              : 'text-gray-900 dark:text-white'
          }`}>
            {isCompleted && 'PDF export complete!'}
            {isFailed && 'PDF export failed'}
            {!isCompleted && !isFailed && job.message}
          </p>
          
          {!isCompleted && !isFailed && (
            <div className="mt-2">
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progress}%
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
