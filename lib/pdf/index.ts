// PDF Export System - Main exports
export { PDFGenerator, generatePDF } from './generator'
export type { PDFGeneratorProgress, ProgressCallback } from './generator'

// Types
export type {
  PDFExportOptions,
  ChapterWithPhotos,
  Photo,
  ExportJob,
  PDFPage,
  TemplateStyle,
  TemplateConfig,
} from './types/index'

// Job Queue
export {
  createExportJob,
  getExportJob,
  updateExportJob,
  deleteExportJob,
  getAllJobs,
  queueExportJob,
  getJobStats,
} from './jobQueue'

// Templates
export { templateConfigs, getTemplateConfig, generateTemplateStyles } from './templates/config'
export { classicTemplate, getClassicStyles } from './templates/classic'
export { modernTemplate, getModernStyles } from './templates/modern'
export { travelTemplate, getTravelStyles } from './templates/travel'

// Components
export { renderCoverPage } from './components/CoverPage'
export { renderTOCPage } from './components/TOCPage'
export { renderChapterPage } from './components/ChapterPage'
export { renderPhotoGridPage } from './components/PhotoGridPage'

// Utils
export {
  generateMapboxStaticUrl,
  generateFallbackMapHTML,
  calculateMapBounds,
  getCachedMapUrl,
  cacheMapUrl,
} from './utils/mapRenderer'
