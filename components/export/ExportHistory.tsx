'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Trash2,
  Clock,
  Calendar,
  Palette,
  FileImage,
  AlertCircle,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { CompactDownloadButton } from './DownloadButton';

export function ExportHistory() {
  const { history, removeFromHistory, clearHistory } = useExport();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Export History
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Your exported photo books will appear here. Start your first export to see it in the history.
        </p>
      </div>
    );
  }

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(id);
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleClearAll = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {history.length} export{history.length !== 1 ? 's' : ''} in history
        </div>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Clear Confirmation */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Are you sure you want to clear all export history? This action cannot be undone.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                  >
                    Clear History
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History List */}
      <div className="space-y-2">
        {history.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-xl overflow-hidden transition-colors ${
              expandedId === item.id
                ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {/* Main Row */}
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              {/* Icon */}
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {item.fileName}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <CompactDownloadButton
                  url={item.downloadUrl}
                  fileName={item.fileName}
                  fileSize={item.fileSize}
                />
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedId === item.id ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Template</span>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {item.template}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Page Size</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.pageSize}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Quality</span>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {item.quality}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">File Size</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatFileSize(item.fileSize)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Download Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <a
                          href={item.downloadUrl}
                          download={item.fileName}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
