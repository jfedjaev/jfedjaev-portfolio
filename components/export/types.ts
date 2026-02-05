export type ExportTemplate = 'classic' | 'modern' | 'travel';
export type PageSize = 'A4' | 'Letter';
export type ExportQuality = 'web' | 'print';
export type ExportFormat = 'pdf' | 'epub';

export interface ExportSettings {
  template: ExportTemplate;
  pageSize: PageSize;
  quality: ExportQuality;
  format: ExportFormat;
  includeMaps: boolean;
  includeMetadata: boolean;
  coverTitle?: string;
  coverSubtitle?: string;
}

export type ExportStatus = 
  | 'idle' 
  | 'preparing' 
  | 'generating_maps' 
  | 'rendering_pages' 
  | 'finalizing' 
  | 'completed' 
  | 'error' 
  | 'cancelled';

export interface ExportStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

export interface ExportProgress {
  status: ExportStatus;
  progress: number; // 0-100
  currentStep: string;
  steps: ExportStep[];
  estimatedTimeRemaining?: number; // in seconds
  error?: string;
}

export interface ExportJob {
  id: string;
  settings: ExportSettings;
  progress: ExportProgress;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  fileSize?: number;
  fileName?: string;
}

export interface ExportHistoryItem {
  id: string;
  fileName: string;
  template: ExportTemplate;
  pageSize: PageSize;
  quality: ExportQuality;
  format: ExportFormat;
  createdAt: Date;
  fileSize: number;
  downloadUrl: string;
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  template: 'modern',
  pageSize: 'A4',
  quality: 'print',
  format: 'pdf',
  includeMaps: true,
  includeMetadata: true,
};

export const EXPORT_STEPS: Omit<ExportStep, 'status'>[] = [
  { id: 'preparing', label: 'Preparing photos and metadata' },
  { id: 'generating_maps', label: 'Generating location maps' },
  { id: 'rendering_pages', label: 'Rendering pages' },
  { id: 'finalizing', label: 'Finalizing export' },
];

export const TEMPLATE_OPTIONS: { value: ExportTemplate; label: string; description: string }[] = [
  { 
    value: 'classic', 
    label: 'Classic', 
    description: 'Elegant traditional photo book with white borders and serif typography'
  },
  { 
    value: 'modern', 
    label: 'Modern', 
    description: 'Clean minimalist design with full-bleed photos and sans-serif fonts'
  },
  { 
    value: 'travel', 
    label: 'Travel', 
    description: 'Adventure-inspired layout with map elements and vintage accents'
  },
];

export const PAGE_SIZE_OPTIONS: { value: PageSize; label: string; dimensions: string }[] = [
  { value: 'A4', label: 'A4', dimensions: '210 × 297 mm' },
  { value: 'Letter', label: 'US Letter', dimensions: '216 × 279 mm' },
];

export const QUALITY_OPTIONS: { value: ExportQuality; label: string; description: string; dpi: number }[] = [
  { value: 'web', label: 'Web', description: 'Optimized for screen viewing and sharing', dpi: 150 },
  { value: 'print', label: 'Print', description: 'High resolution for professional printing', dpi: 300 },
];
