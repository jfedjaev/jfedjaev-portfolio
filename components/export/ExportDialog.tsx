'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Settings,
  FileText,
  Image,
  Map,
  ChevronRight,
  ChevronLeft,
  X,
  Eye,
  History,
} from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { ExportSettings } from './ExportSettings';
import { ExportProgress } from './ExportProgress';
import { ExportPreview } from './ExportPreview';
import { ExportHistory } from './ExportHistory';
import { DownloadButton } from './DownloadButton';
import { ExportJob } from './types';

type DialogTab = 'settings' | 'progress' | 'preview' | 'history';

export function ExportDialog() {
  const {
    isExportDialogOpen,
    setIsExportDialogOpen,
    currentJob,
    settings,
    isPreviewMode,
    setIsPreviewMode,
    startExport,
    history,
  } = useExport();

  const [activeTab, setActiveTab] = useState<DialogTab>('settings');

  if (!isExportDialogOpen) return null;

  const handleStartExport = async () => {
    // In real app, get selected photo IDs from store
    await startExport(['demo-photos']);
    setActiveTab('progress');
  };

  const handleExportComplete = () => {
    setActiveTab('settings');
    setIsExportDialogOpen(false);
  };

  const getTabIcon = (tab: DialogTab) => {
    switch (tab) {
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'progress':
        return <FileText className="w-4 h-4" />;
      case 'preview':
        return <Eye className="w-4 h-4" />;
      case 'history':
        return <History className="w-4 h-4" />;
    }
  };

  const getTabLabel = (tab: DialogTab) => {
    switch (tab) {
      case 'settings':
        return 'Settings';
      case 'progress':
        return currentJob?.progress.status === 'completed' ? 'Download' : 'Progress';
      case 'preview':
        return 'Preview';
      case 'history':
        return 'History';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsExportDialogOpen(false)}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Export Photo Book
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize and download your story
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportDialogOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {(['settings', 'progress', 'preview', 'history'] as DialogTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={tab === 'progress' && !currentJob}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {getTabIcon(tab)}
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ExportSettings />
              </motion.div>
            )}

            {activeTab === 'progress' && currentJob && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ExportProgress
                  job={currentJob}
                  onClose={handleExportComplete}
                />
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ExportPreview />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ExportHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span>Template: {settings.template}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{settings.pageSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span>{settings.includeMaps ? 'With maps' : 'No maps'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'settings' && (
              <>
                <button
                  onClick={() => setActiveTab('preview')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleStartExport}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Start Export
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {activeTab === 'progress' && currentJob?.progress.status === 'completed' && (
              <DownloadButton
                url={currentJob.downloadUrl!}
                fileName={currentJob.fileName!}
                fileSize={currentJob.fileSize}
                onDownload={handleExportComplete}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
