import { NextRequest, NextResponse } from 'next/server'
import { 
  createExportJob, 
  getExportJob, 
  queueExportJob, 
  getAllJobs,
  deleteExportJob,
  getJobStats 
} from '@/lib/pdf/jobQueue'
import { PDFExportOptions } from '@/lib/pdf/types'

// GET /api/export/pdf - List jobs or get specific job status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  const action = searchParams.get('action')
  
  // Get download
  if (action === 'download' && jobId) {
    const job = getExportJob(jobId)
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }
    
    if (job.status !== 'completed') {
      return NextResponse.json(
        { error: 'PDF not ready', status: job.status },
        { status: 400 }
      )
    }
    
    // In production, you'd fetch the PDF from storage (S3, etc.)
    // For now, return a placeholder
    return NextResponse.json({
      message: 'Download endpoint - implement with actual file storage',
      jobId,
    })
  }
  
  // Get specific job status
  if (jobId) {
    const job = getExportJob(jobId)
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ job })
  }
  
  // Get stats
  if (action === 'stats') {
    return NextResponse.json({ stats: getJobStats() })
  }
  
  // List all jobs
  const jobs = getAllJobs()
  return NextResponse.json({ jobs })
}

// POST /api/export/pdf - Create new export job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.bookId || !body.title || !body.chapters) {
      return NextResponse.json(
        { error: 'Missing required fields: bookId, title, chapters' },
        { status: 400 }
      )
    }
    
    const options: PDFExportOptions = {
      bookId: body.bookId,
      title: body.title,
      subtitle: body.subtitle,
      author: body.author,
      coverPhoto: body.coverPhoto,
      chapters: body.chapters,
      template: body.template || 'modern',
      paperSize: body.paperSize || 'A4',
      orientation: body.orientation || 'portrait',
      quality: body.quality || 'standard',
      includeMap: body.includeMap !== false,
      mapStyle: body.mapStyle || 'streets',
    }
    
    // Queue the job
    const { jobId, promise } = await queueExportJob(options)
    
    // Don't await the promise - let it run in background
    promise.catch((error) => {
      console.error(`PDF generation failed for job ${jobId}:`, error)
    })
    
    return NextResponse.json({
      jobId,
      message: 'PDF export job created',
      status: 'pending',
    })
    
  } catch (error) {
    console.error('Error creating PDF export job:', error)
    return NextResponse.json(
      { error: 'Failed to create export job' },
      { status: 500 }
    )
  }
}

// DELETE /api/export/pdf?jobId=xxx - Cancel/delete a job
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  
  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID required' },
      { status: 400 }
    )
  }
  
  const deleted = deleteExportJob(jobId)
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({
    message: 'Job deleted successfully',
    jobId,
  })
}
