import { NextRequest, NextResponse } from 'next/server'
import { getExportJob } from '@/lib/pdf/jobQueue'

// GET /api/export/pdf/download?jobId=xxx - Download the generated PDF
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  
  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID required' },
      { status: 400 }
    )
  }
  
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
  
  // In production, fetch from S3, Google Cloud Storage, etc.
  // For demo purposes, we'll return a message
  // const pdfBuffer = await fetchFromStorage(job.storageKey)
  
  // Generate a sample PDF buffer for demo
  const pdfBuffer = Buffer.from('%PDF-1.4 Sample PDF')
  
  const filename = `${job.options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`
  
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length.toString(),
    },
  })
}
