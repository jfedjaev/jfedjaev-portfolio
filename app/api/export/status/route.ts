import { NextRequest, NextResponse } from 'next/server';
import {
  ExportStatus,
  ExportProgress,
  ExportStep,
  EXPORT_STEPS,
} from '@/components/export/types';

// Mock storage for export jobs - in production, use Redis or database
const exportJobs = new Map<string, MockExportJob>();

interface MockExportJob {
  id: string;
  status: ExportStatus;
  progress: number;
  currentStep: string;
  steps: ExportStep[];
  startTime: number;
  estimatedDuration: number;
  downloadUrl?: string;
  fileSize?: number;
  fileName?: string;
}

// Simulate export progress
function simulateExportProgress(jobId: string) {
  const job = exportJobs.get(jobId);
  if (!job) return;

  const interval = setInterval(() => {
    const currentJob = exportJobs.get(jobId);
    if (!currentJob || currentJob.status === 'cancelled' || currentJob.status === 'error') {
      clearInterval(interval);
      return;
    }

    // Update progress
    currentJob.progress = Math.min(100, currentJob.progress + Math.random() * 15);

    // Update steps based on progress
    const stepProgress = currentJob.progress / 25;
    currentJob.steps = currentJob.steps.map((step, index) => ({
      ...step,
      status:
        index < Math.floor(stepProgress)
          ? 'completed'
          : index === Math.floor(stepProgress)
          ? 'in_progress'
          : 'pending',
    }));

    // Update current step
    const activeStepIndex = currentJob.steps.findIndex((s) => s.status === 'in_progress');
    if (activeStepIndex !== -1) {
      currentJob.currentStep = currentJob.steps[activeStepIndex].id;
      currentJob.status = currentJob.steps[activeStepIndex].id as ExportStatus;
    }

    // Complete the job
    if (currentJob.progress >= 100) {
      currentJob.progress = 100;
      currentJob.status = 'completed';
      currentJob.steps = currentJob.steps.map((s) => ({ ...s, status: 'completed' as const }));
      currentJob.downloadUrl = `/api/export/download/${jobId}`;
      currentJob.fileName = `photo-book-${new Date().toISOString().split('T')[0]}.pdf`;
      currentJob.fileSize = Math.floor(Math.random() * 50000000) + 10000000; // 10-60MB
      clearInterval(interval);
    }

    exportJobs.set(jobId, currentJob);
  }, 1000);
}

// GET /api/export/status?jobId=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    );
  }

  // For demo purposes, create a mock job if it doesn't exist
  if (!exportJobs.has(jobId)) {
    const newJob: MockExportJob = {
      id: jobId,
      status: 'preparing',
      progress: 0,
      currentStep: 'preparing',
      steps: EXPORT_STEPS.map((step) => ({
        ...step,
        status: step.id === 'preparing' ? 'in_progress' : 'pending',
      })),
      startTime: Date.now(),
      estimatedDuration: 30000, // 30 seconds
    };
    exportJobs.set(jobId, newJob);
    simulateExportProgress(jobId);
  }

  const job = exportJobs.get(jobId)!;

  // Calculate estimated time remaining
  const elapsed = Date.now() - job.startTime;
  const remaining = Math.max(0, Math.floor((job.estimatedDuration - elapsed) / 1000));

  const progress: ExportProgress = {
    status: job.status,
    progress: job.progress,
    currentStep: job.currentStep,
    steps: job.steps,
    estimatedTimeRemaining: remaining > 0 ? remaining : undefined,
  };

  return NextResponse.json({
    jobId: job.id,
    progress,
    downloadUrl: job.downloadUrl,
    fileSize: job.fileSize,
    fileName: job.fileName,
    completedAt: job.status === 'completed' ? new Date().toISOString() : undefined,
  });
}

// POST /api/export/status - Create new export job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings, photoIds } = body;

    const jobId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newJob: MockExportJob = {
      id: jobId,
      status: 'preparing',
      progress: 0,
      currentStep: 'preparing',
      steps: EXPORT_STEPS.map((step) => ({
        ...step,
        status: step.id === 'preparing' ? 'in_progress' : 'pending',
      })),
      startTime: Date.now(),
      estimatedDuration: 30000 + photoIds.length * 1000, // Base + per photo
    };

    exportJobs.set(jobId, newJob);
    simulateExportProgress(jobId);

    return NextResponse.json({
      jobId,
      message: 'Export job created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create export job' },
      { status: 500 }
    );
  }
}

// DELETE /api/export/status?jobId=xxx - Cancel export job
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    );
  }

  const job = exportJobs.get(jobId);
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }

  job.status = 'cancelled';
  exportJobs.set(jobId, job);

  return NextResponse.json({
    jobId,
    message: 'Export job cancelled',
  });
}
