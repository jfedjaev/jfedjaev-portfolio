import { ExportJob, PDFExportOptions } from './types/index'

// In-memory job store (use Redis/database in production)
const jobStore = new Map<string, ExportJob>()

// Cleanup old jobs periodically
const JOB_RETENTION_MS = 24 * 60 * 60 * 1000 // 24 hours

setInterval(() => {
  const now = Date.now()
  Array.from(jobStore.entries()).forEach(([id, job]) => {
    if (now - job.createdAt.getTime() > JOB_RETENTION_MS) {
      jobStore.delete(id)
    }
  })
}, 60 * 60 * 1000) // Run every hour

export function createExportJob(options: PDFExportOptions): ExportJob {
  const job: ExportJob = {
    id: generateJobId(),
    status: 'pending',
    progress: 0,
    message: 'Waiting to start...',
    createdAt: new Date(),
    updatedAt: new Date(),
    options,
  }
  
  jobStore.set(job.id, job)
  return job
}

export function getExportJob(jobId: string): ExportJob | undefined {
  return jobStore.get(jobId)
}

export function updateExportJob(
  jobId: string,
  updates: Partial<Pick<ExportJob, 'status' | 'progress' | 'message' | 'downloadUrl' | 'error'>>
): ExportJob | undefined {
  const job = jobStore.get(jobId)
  if (!job) return undefined
  
  const updatedJob: ExportJob = {
    ...job,
    ...updates,
    updatedAt: new Date(),
  }
  
  jobStore.set(jobId, updatedJob)
  return updatedJob
}

export function deleteExportJob(jobId: string): boolean {
  return jobStore.delete(jobId)
}

export function getAllJobs(): ExportJob[] {
  return Array.from(jobStore.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

function generateJobId(): string {
  return `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Processing queue with concurrency control
interface QueuedJob {
  jobId: string
  options: PDFExportOptions
  resolve: (value: Buffer) => void
  reject: (error: Error) => void
}

const jobQueue: QueuedJob[] = []
let isProcessing = false
const CONCURRENCY = 2 // Max concurrent PDF generations
let activeJobs = 0

export async function queueExportJob(
  options: PDFExportOptions
): Promise<{ jobId: string; promise: Promise<Buffer> }> {
  const job = createExportJob(options)
  
  const promise = new Promise<Buffer>((resolve, reject) => {
    jobQueue.push({
      jobId: job.id,
      options,
      resolve,
      reject,
    })
    
    processQueue()
  })
  
  return { jobId: job.id, promise }
}

async function processQueue(): Promise<void> {
  if (isProcessing) return
  if (activeJobs >= CONCURRENCY) return
  if (jobQueue.length === 0) return
  
  isProcessing = true
  
  try {
    while (jobQueue.length > 0 && activeJobs < CONCURRENCY) {
      const queuedJob = jobQueue.shift()!
      activeJobs++
      
      // Update job status
      updateExportJob(queuedJob.jobId, {
        status: 'processing',
        progress: 0,
        message: 'Starting PDF generation...',
      })
      
      // Process the job
      processJob(queuedJob).finally(() => {
        activeJobs--
        // Process next job
        setImmediate(processQueue)
      })
    }
  } finally {
    isProcessing = false
  }
}

async function processJob(queuedJob: QueuedJob): Promise<void> {
  try {
    // Dynamic import to avoid loading puppeteer unnecessarily
    const { generatePDF } = await import('./generator')
    
    const pdfBuffer = await generatePDF(
      queuedJob.options,
      (progress) => {
        updateExportJob(queuedJob.jobId, {
          progress: progress.progress,
          message: progress.message,
        })
      }
    )
    
    // Update job as completed
    updateExportJob(queuedJob.jobId, {
      status: 'completed',
      progress: 100,
      message: 'PDF generation complete',
      downloadUrl: `/api/export/pdf/download?jobId=${queuedJob.jobId}`,
    })
    
    queuedJob.resolve(pdfBuffer)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    updateExportJob(queuedJob.jobId, {
      status: 'failed',
      progress: 0,
      message: `Failed: ${errorMessage}`,
      error: errorMessage,
    })
    
    queuedJob.reject(error instanceof Error ? error : new Error(errorMessage))
  }
}

// Get job statistics
export function getJobStats(): {
  total: number
  pending: number
  processing: number
  completed: number
  failed: number
} {
  const jobs = getAllJobs()
  
  return {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    processing: jobs.filter((j) => j.status === 'processing').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  }
}
