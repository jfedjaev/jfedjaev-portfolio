import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ExportSettings,
  ExportJob,
  ExportHistoryItem,
  ExportStatus,
  ExportProgress,
  ExportStep,
  DEFAULT_EXPORT_SETTINGS,
  EXPORT_STEPS,
} from '../components/export/types';

interface ExportState {
  // Current export settings
  settings: ExportSettings;
  setSettings: (settings: Partial<ExportSettings>) => void;
  resetSettings: () => void;

  // Export job
  currentJob: ExportJob | null;
  setCurrentJob: (job: ExportJob | null) => void;
  updateJobProgress: (progress: Partial<ExportProgress>) => void;

  // Export history
  history: ExportHistoryItem[];
  addToHistory: (item: ExportHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // UI State
  isExportDialogOpen: boolean;
  setIsExportDialogOpen: (open: boolean) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
  currentPreviewPage: number;
  setCurrentPreviewPage: (page: number) => void;
  previewTotalPages: number;
  setPreviewTotalPages: (pages: number) => void;

  // Actions
  startExport: (photoIds: string[]) => Promise<string>;
  cancelExport: () => void;
  pollExportStatus: (jobId: string) => Promise<void>;
}

export const useExport = create<ExportState>()(
  persist(
    (set, get) => ({
      // Settings
      settings: DEFAULT_EXPORT_SETTINGS,
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: DEFAULT_EXPORT_SETTINGS }),

      // Current Job
      currentJob: null,
      setCurrentJob: (job) => set({ currentJob: job }),
      updateJobProgress: (progressUpdate) =>
        set((state) => {
          if (!state.currentJob) return state;
          return {
            currentJob: {
              ...state.currentJob,
              progress: {
                ...state.currentJob.progress,
                ...progressUpdate,
              },
            },
          };
        }),

      // History
      history: [],
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 50), // Keep last 50 exports
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),

      // UI State
      isExportDialogOpen: false,
      setIsExportDialogOpen: (open) => set({ isExportDialogOpen: open }),
      isPreviewMode: false,
      setIsPreviewMode: (preview) => set({ isPreviewMode: preview }),
      currentPreviewPage: 0,
      setCurrentPreviewPage: (page) => set({ currentPreviewPage: page }),
      previewTotalPages: 0,
      setPreviewTotalPages: (pages) => set({ previewTotalPages: pages }),

      // Actions
      startExport: async (photoIds: string[]) => {
        const { settings } = get();

        // Create initial job
        const jobId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const initialSteps: ExportStep[] = EXPORT_STEPS.map((step) => ({
          ...step,
          status: step.id === 'preparing' ? 'in_progress' : 'pending',
        }));

        const newJob: ExportJob = {
          id: jobId,
          settings: { ...settings },
          progress: {
            status: 'preparing',
            progress: 0,
            currentStep: 'preparing',
            steps: initialSteps,
          },
          createdAt: new Date(),
        };

        set({ currentJob: newJob, isExportDialogOpen: true });

        // Start polling
        get().pollExportStatus(jobId);

        return jobId;
      },

      cancelExport: () => {
        const { currentJob } = get();
        if (!currentJob) return;

        // Update job status to cancelled
        set({
          currentJob: {
            ...currentJob,
            progress: {
              ...currentJob.progress,
              status: 'cancelled',
            },
          },
        });

        // TODO: Call API to cancel server-side job
      },

      pollExportStatus: async (jobId: string) => {
        const poll = async () => {
          const { currentJob } = get();
          if (!currentJob || currentJob.id !== jobId) return;
          if (currentJob.progress.status === 'cancelled') return;

          try {
            const response = await fetch(`/api/export/status?jobId=${jobId}`);
            if (!response.ok) throw new Error('Failed to fetch status');

            const data = await response.json();

            // Update job with new progress
            set({
              currentJob: {
                ...currentJob,
                progress: data.progress,
                downloadUrl: data.downloadUrl,
                completedAt: data.completedAt,
                fileSize: data.fileSize,
                fileName: data.fileName,
              },
            });

            // Continue polling if not complete
            if (
              data.progress.status !== 'completed' &&
              data.progress.status !== 'error' &&
              data.progress.status !== 'cancelled'
            ) {
              setTimeout(poll, 1000);
            } else if (data.progress.status === 'completed') {
              // Add to history when complete
              get().addToHistory({
                id: jobId,
                fileName: data.fileName,
                template: currentJob.settings.template,
                pageSize: currentJob.settings.pageSize,
                quality: currentJob.settings.quality,
                format: currentJob.settings.format,
                createdAt: new Date(),
                fileSize: data.fileSize,
                downloadUrl: data.downloadUrl,
              });
            }
          } catch (error) {
            console.error('Error polling export status:', error);
            set({
              currentJob: {
                ...currentJob,
                progress: {
                  ...currentJob.progress,
                  status: 'error',
                  error: 'Failed to get export status',
                },
              },
            });
          }
        };

        // Start polling
        poll();
      },
    }),
    {
      name: 'export-store',
      partialize: (state) => ({
        settings: state.settings,
        history: state.history,
      }),
    }
  )
);
