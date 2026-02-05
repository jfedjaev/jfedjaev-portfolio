import { useState, useEffect, useCallback, useRef } from 'react'
import { ExportJob, PDFExportOptions } from '@/lib/pdf/types'

interface UsePDFExportOptions {
  pollInterval?: number // milliseconds
  onComplete?: (job: ExportJob) => void
  onError?: (error: string) => void
}

interface UsePDFExportReturn {
  // State
  job: ExportJob | null
  isLoading: boolean
  error: string | null
  
  // Actions
  startExport: (options: PDFExportOptions) => Promise<void>
  cancelExport: () => Promise<void>
  retryExport: () => Promise<void>
  
  // Derived state
  progress: number
  status: ExportJob['status'] | null
  isPending: boolean
  isProcessing: boolean
  isCompleted: boolean
  isFailed: boolean
  canDownload: boolean
  downloadUrl: string | null
}

export function usePDFExport(options: UsePDFExportOptions = {}): UsePDFExportReturn {
  const { pollInterval = 1000, onComplete, onError } = options
  
  const [job, setJob] = useState<ExportJob | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastOptions, setLastOptions] = useState<PDFExportOptions | null>(null)
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])
  
  // Poll for job status updates
  useEffect(() => {
    if (!job || (job.status !== 'pending' && job.status !== 'processing')) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      return
    }
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/export/pdf?jobId=${job.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch job status')
        }
        
        const data = await response.json()
        const updatedJob = data.job as ExportJob
        
        setJob(updatedJob)
        
        // Handle completion
        if (updatedJob.status === 'completed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }
          onComplete?.(updatedJob)
        }
        
        // Handle failure
        if (updatedJob.status === 'failed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }
          setError(updatedJob.error || 'Export failed')
          onError?.(updatedJob.error || 'Export failed')
        }
      } catch (err) {
        console.error('Error polling job status:', err)
      }
    }, pollInterval)
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [job?.id, job?.status, pollInterval, onComplete, onError])
  
  const startExport = useCallback(async (exportOptions: PDFExportOptions) => {
    setIsLoading(true)
    setError(null)
    setLastOptions(exportOptions)
    
    // Cancel any existing poll
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportOptions),
        signal: abortControllerRef.current.signal,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start export')
      }
      
      const data = await response.json()
      
      // Create initial job object
      const initialJob: ExportJob = {
        id: data.jobId,
        status: 'pending',
        progress: 0,
        message: 'Waiting to start...',
        createdAt: new Date(),
        updatedAt: new Date(),
        options: exportOptions,
      }
      
      setJob(initialJob)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start export'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [onError])
  
  const cancelExport = useCallback(async () => {
    if (!job) return
    
    try {
      const response = await fetch(`/api/export/pdf?jobId=${job.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to cancel export')
      }
      
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      
      setJob(null)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel export'
      setError(errorMessage)
    }
  }, [job])
  
  const retryExport = useCallback(async () => {
    if (lastOptions) {
      await startExport(lastOptions)
    }
  }, [lastOptions, startExport])
  
  // Derived state
  const progress = job?.progress ?? 0
  const status = job?.status ?? null
  const isPending = status === 'pending'
  const isProcessing = status === 'processing'
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'
  const canDownload = isCompleted && !!job?.downloadUrl
  const downloadUrl = job?.downloadUrl ?? null
  
  return {
    // State
    job,
    isLoading,
    error,
    
    // Actions
    startExport,
    cancelExport,
    retryExport,
    
    // Derived state
    progress,
    status,
    isPending,
    isProcessing,
    isCompleted,
    isFailed,
    canDownload,
    downloadUrl,
  }
}

// Hook for managing multiple exports
export function usePDFExportsList() {
  const [jobs, setJobs] = useState<ExportJob[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/export/pdf')
      
      if (!response.ok) {
        throw new Error('Failed to fetch exports')
      }
      
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exports')
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  const deleteJob = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/export/pdf?jobId=${jobId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete job')
      }
      
      setJobs((prev) => prev.filter((j) => j.id !== jobId))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job')
      return false
    }
  }, [])
  
  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])
  
  return {
    jobs,
    isLoading,
    error,
    refetch: fetchJobs,
    deleteJob,
  }
}
