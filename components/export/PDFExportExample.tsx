'use client'

import { useState } from 'react'
import { usePDFExport } from '@/hooks/usePDFExport'
import { ExportProgress } from '@/components/export/ExportProgress'
import { PDFExportOptions } from '@/lib/pdf/types'
import { FileDown, Loader2 } from 'lucide-react'

// Demo data
const demoExportOptions: PDFExportOptions = {
  bookId: 'book-123',
  title: 'My Travel Adventure',
  subtitle: 'A journey through the mountains',
  author: 'John Doe',
  template: 'travel',
  includeMap: true,
  mapStyle: 'outdoors',
  chapters: [
    {
      id: 'ch1',
      title: 'The Beginning',
      subtitle: 'Starting the journey',
      description: 'Our adventure began with a early morning train ride through the countryside.',
      photos: [
        {
          id: 'p1',
          src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          caption: 'Mountain sunrise',
          dateTaken: new Date('2024-01-15'),
          hasGPS: true,
          latitude: 46.8182,
          longitude: 8.2275,
          width: 800,
          height: 600,
        },
        {
          id: 'p2',
          src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
          caption: 'Forest path',
          dateTaken: new Date('2024-01-14'),
          hasGPS: false,
          width: 600,
          height: 800,
        },
        {
          id: 'p3',
          src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
          caption: 'Waterfall',
          dateTaken: new Date('2024-01-13'),
          hasGPS: true,
          latitude: 36.0544,
          longitude: -112.1401,
          width: 800,
          height: 500,
        },
      ],
    },
    {
      id: 'ch2',
      title: 'Mountain Pass',
      description: 'The challenging climb to the summit rewarded us with breathtaking views.',
      photos: [
        {
          id: 'p4',
          src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
          caption: 'Lake reflection',
          dateTaken: new Date('2024-01-12'),
          hasGPS: false,
          width: 800,
          height: 600,
        },
        {
          id: 'p5',
          src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
          caption: 'Foggy valley',
          dateTaken: new Date('2024-01-11'),
          hasGPS: true,
          latitude: 37.8651,
          longitude: -119.5383,
          width: 600,
          height: 900,
        },
      ],
    },
  ],
}

export function PDFExportExample() {
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'travel'>('travel')
  const [showExport, setShowExport] = useState(false)
  
  const {
    job,
    progress,
    status,
    isLoading,
    error,
    canDownload,
    downloadUrl,
    startExport,
    cancelExport,
    retryExport,
  } = usePDFExport({
    onComplete: (job) => {
      console.log('Export complete:', job)
    },
    onError: (err) => {
      console.error('Export error:', err)
    },
  })
  
  const handleExport = async () => {
    setShowExport(true)
    await startExport({
      ...demoExportOptions,
      template: selectedTemplate,
    })
  }
  
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }
  
  const handleClose = () => {
    setShowExport(false)
    if (job && (status === 'processing' || status === 'pending')) {
      cancelExport()
    }
  }
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">PDF Export Demo</h2>
      
      {/* Template Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Template
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['classic', 'modern', 'travel'] as const).map((template) => (
            <button
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTemplate === template
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium capitalize">{template}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {template === 'classic' && 'Elegant, serif fonts'}
                {template === 'modern' && 'Clean, sans-serif'}
                {template === 'travel' && 'Adventure style'}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Export Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-2">Export Details</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>Title: {demoExportOptions.title}</li>
          <li>Chapters: {demoExportOptions.chapters.length}</li>
          <li>Total Photos: {demoExportOptions.chapters.reduce((acc, ch) => acc + ch.photos.length, 0)}</li>
          <li>Template: <span className="capitalize">{selectedTemplate}</span></li>
          <li>Include Maps: {demoExportOptions.includeMap ? 'Yes' : 'No'}</li>
        </ul>
      </div>
      
      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isLoading || status === 'processing' || status === 'pending'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting...
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5" />
            Export as PDF
          </>
        )}
      </button>
      
      {/* Export Progress */}
      {showExport && (
        <div className="mt-6 flex justify-center">
          <ExportProgress
            job={job}
            progress={progress}
            status={status}
            isLoading={isLoading}
            error={error}
            canDownload={canDownload}
            downloadUrl={downloadUrl}
            onCancel={cancelExport}
            onRetry={retryExport}
            onDownload={handleDownload}
            onClose={handleClose}
          />
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          How to use in your app:
        </h4>
        <pre className="text-xs text-blue-800 dark:text-blue-200 overflow-x-auto">
{`import { usePDFExport } from '@/hooks/usePDFExport'
import { ExportProgress } from '@/components/export/ExportProgress'

function MyComponent() {
  const { startExport, progress, status, job } = usePDFExport()
  
  const handleExport = () => {
    startExport({
      bookId: 'my-book',
      title: 'My Story',
      chapters: [...],
      template: 'modern'
    })
  }
  
  return (
    <>
      <button onClick={handleExport}>
        Export PDF
      </button>
      <ExportProgress 
        job={job}
        progress={progress}
        status={status}
        {...}
      />
    </>
  )
}`}
        </pre>
      </div>
    </div>
  )
}
