'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  FileText,
  Check,
  Loader2,
  Mail,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface DownloadButtonProps {
  url: string;
  fileName: string;
  fileSize?: number;
  onDownload?: () => void;
}

export function DownloadButton({
  url,
  fileName,
  fileSize,
  onDownload,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [emailNotify, setEmailNotify] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Simulate download completion
      setTimeout(() => {
        setIsDownloading(false);
        setIsDownloaded(true);
        onDownload?.();
      }, 1500);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Email notification toggle (future feature) */}
      <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={emailNotify}
          onChange={(e) => setEmailNotify(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <Mail className="w-4 h-4" />
        <span>Email me when ready</span>
      </label>

      {/* Download Button */}
      <motion.button
        onClick={handleDownload}
        disabled={isDownloading || isDownloaded}
        whileHover={{ scale: isDownloading || isDownloaded ? 1 : 1.02 }}
        whileTap={{ scale: isDownloading || isDownloaded ? 1 : 0.98 }}
        className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-all ${
          isDownloaded
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-70`}
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Downloading...</span>
          </>
        ) : isDownloaded ? (
          <>
            <Check className="w-4 h-4" />
            <span>Downloaded</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download</span>
            {fileSize && (
              <span className="text-xs opacity-75">
                ({formatFileSize(fileSize)})
              </span>
            )}
          </>
        )}
      </motion.button>
    </div>
  );
}

// Compact download button for use in lists/history
interface CompactDownloadButtonProps {
  url: string;
  fileName: string;
  fileSize?: number;
  onDownload?: () => void;
}

export function CompactDownloadButton({
  url,
  fileName,
  fileSize,
  onDownload,
}: CompactDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onDownload?.();
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
      title={`Download ${fileName}`}
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </button>
  );
}

// Download card for completed exports
interface DownloadCardProps {
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  createdAt: Date;
  onDismiss?: () => void;
}

export function DownloadCard({
  fileName,
  fileSize,
  downloadUrl,
  createdAt,
  onDismiss,
}: DownloadCardProps) {
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg">
          <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {fileName}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatFileSize(fileSize)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <DownloadButton
            url={downloadUrl}
            fileName={fileName}
            fileSize={fileSize}
          />
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
