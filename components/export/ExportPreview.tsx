'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Info,
} from 'lucide-react';
import { useExport } from '@/hooks/useExport';

export function ExportPreview() {
  const {
    settings,
    currentPreviewPage,
    setCurrentPreviewPage,
    previewTotalPages,
    setPreviewTotalPages,
  } = useExport();

  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Mock total pages - in real app, calculate based on photos
  const totalPages = previewTotalPages || 24;

  const handlePrevPage = () => {
    setCurrentPreviewPage(Math.max(0, currentPreviewPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPreviewPage(Math.min(totalPages - 1, currentPreviewPage + 1));
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(200, zoomLevel + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(50, zoomLevel - 25));
  };

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('single')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'single'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>

        {viewMode === 'single' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-40"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 w-14 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-40"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {viewMode === 'single' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPreviewPage === 0}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] text-center">
              Page {currentPreviewPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPreviewPage === totalPages - 1}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Preview Content */}
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          {viewMode === 'single' ? (
            <SinglePagePreview
              key="single"
              pageNumber={currentPreviewPage + 1}
              zoomLevel={zoomLevel}
              template={settings.template}
              pageSize={settings.pageSize}
            />
          ) : (
            <GridPreview
              key="grid"
              totalPages={totalPages}
              template={settings.template}
              onPageSelect={setCurrentPreviewPage}
              onViewModeChange={() => setViewMode('single')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Page Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span>
            Preview shows how your photo book will look with the{' '}
            <span className="font-medium capitalize">{settings.template}</span> template
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
            Share Preview
          </button>
        </div>
      </div>
    </div>
  );
}

interface SinglePagePreviewProps {
  pageNumber: number;
  zoomLevel: number;
  template: string;
  pageSize: string;
}

function SinglePagePreview({
  pageNumber,
  zoomLevel,
  template,
  pageSize,
}: SinglePagePreviewProps) {
  const isCover = pageNumber === 1;
  const isBackCover = pageNumber === 24;

  const getAspectRatio = () => {
    return pageSize === 'A4' ? '210/297' : '216/279';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center p-8"
    >
      <motion.div
        style={{
          width: `${zoomLevel}%`,
          maxWidth: '600px',
          aspectRatio: getAspectRatio(),
        }}
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-sm overflow-hidden"
      >
        {isCover ? (
          <CoverPage template={template} />
        ) : isBackCover ? (
          <BackCoverPage template={template} />
        ) : (
          <ContentPage pageNumber={pageNumber} template={template} />
        )}
      </motion.div>
    </motion.div>
  );
}

function CoverPage({ template }: { template: string }) {
  const gradients: Record<string, string> = {
    classic: 'from-amber-100 to-orange-50',
    modern: 'from-slate-100 to-gray-50',
    travel: 'from-emerald-100 to-teal-50',
  };

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br ${
        gradients[template] || gradients.modern
      }`}
    >
      <div className="w-32 h-32 rounded-full bg-white/50 dark:bg-white/10 mb-6 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        My Photo Story
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        A collection of memories
      </p>
      <div className="mt-8 text-xs text-gray-400">
        {new Date().getFullYear()}
      </div>
    </div>
  );
}

function BackCoverPage({ template }: { template: string }) {
  const bgColors: Record<string, string> = {
    classic: 'bg-amber-50',
    modern: 'bg-slate-50',
    travel: 'bg-emerald-50',
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${
        bgColors[template] || bgColors.modern
      }`}
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Created with Photo Story Book
        </p>
      </div>
    </div>
  );
}

function ContentPage({ pageNumber, template }: { pageNumber: number; template: string }) {
  const isLeftPage = pageNumber % 2 === 0;

  return (
    <div className="w-full h-full flex">
      {/* Photo Area */}
      <div className="flex-1 p-4">
        <div
          className={`w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${
            isLeftPage ? 'mr-2' : 'ml-2'
          }`}
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">Photo {pageNumber - 1}</span>
          </div>
        </div>
      </div>

      {/* Text Area (alternating sides) */}
      {!isLeftPage && (
        <div className="w-1/3 p-4 border-l border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          </div>
        </div>
      )}
      {isLeftPage && (
        <div className="w-1/3 p-4 border-r border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          </div>
        </div>
      )}
    </div>
  );
}

interface GridPreviewProps {
  totalPages: number;
  template: string;
  onPageSelect: (page: number) => void;
  onViewModeChange: () => void;
}

function GridPreview({
  totalPages,
  template,
  onPageSelect,
  onViewModeChange,
}: GridPreviewProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => {
              onPageSelect(pageNum - 1);
              onViewModeChange();
            }}
            className="group relative aspect-[3/4] bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Mini Preview */}
            <div className="absolute inset-1 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              {pageNum === 1 ? (
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30" />
              ) : pageNum === totalPages ? (
                <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600" />
              ) : (
                <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              )}
            </div>

            {/* Page Number */}
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/50 rounded text-[10px] text-white font-medium">
              {pageNum}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
