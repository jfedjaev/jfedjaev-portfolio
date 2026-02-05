'use client';

import { useExport } from '@/hooks/useExport';
import {
  TEMPLATE_OPTIONS,
  PAGE_SIZE_OPTIONS,
  QUALITY_OPTIONS,
  ExportTemplate,
  PageSize,
  ExportQuality,
} from './types';
import {
  Palette,
  FileText,
  Image,
  Map,
  Info,
  Check,
  Type,
} from 'lucide-react';

export function ExportSettings() {
  const { settings, setSettings } = useExport();

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Template Style
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEMPLATE_OPTIONS.map((template) => (
            <button
              key={template.value}
              onClick={() => setSettings({ template: template.value })}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                settings.template === template.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {settings.template === template.value && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-3 overflow-hidden">
                {/* Template Preview Thumbnail */}
                <TemplatePreview type={template.value} />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {template.label}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Page Size Selection */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Page Size
          </h3>
        </div>
        <div className="flex gap-4">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size.value}
              onClick={() => setSettings({ pageSize: size.value })}
              className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                settings.pageSize === size.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {size.label}
                </span>
                {settings.pageSize === size.value && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {size.dimensions}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Quality Settings */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Export Quality
          </h3>
        </div>
        <div className="space-y-3">
          {QUALITY_OPTIONS.map((quality) => (
            <button
              key={quality.value}
              onClick={() => setSettings({ quality: quality.value })}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                settings.quality === quality.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  settings.quality === quality.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {settings.quality === quality.value && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {quality.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                    {quality.dpi} DPI
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {quality.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Additional Options */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Additional Options
          </h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={settings.includeMaps}
              onChange={(e) => setSettings({ includeMaps: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2 flex-1">
              <Map className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Include Location Maps
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Show maps for photos with GPS data
                </p>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={settings.includeMetadata}
              onChange={(e) => setSettings({ includeMetadata: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2 flex-1">
              <Info className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Include Photo Metadata
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Show date, location, and camera information
                </p>
              </div>
            </div>
          </label>
        </div>
      </section>

      {/* Cover Settings */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Cover Title (Optional)
          </h3>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter book title..."
            value={settings.coverTitle || ''}
            onChange={(e) => setSettings({ coverTitle: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Subtitle (optional)..."
            value={settings.coverSubtitle || ''}
            onChange={(e) => setSettings({ coverSubtitle: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </section>
    </div>
  );
}

function TemplatePreview({ type }: { type: ExportTemplate }) {
  switch (type) {
    case 'classic':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-amber-50 dark:bg-amber-900/20">
          <div className="w-full h-12 bg-white dark:bg-gray-700 rounded border-2 border-amber-200 dark:border-amber-800 p-1">
            <div className="w-full h-full border border-amber-300 dark:border-amber-700 rounded" />
          </div>
          <div className="mt-1 text-[8px] text-amber-800 dark:text-amber-400 font-serif">
            Classic
          </div>
        </div>
      );
    case 'modern':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-900/20">
          <div className="w-full h-12 bg-gray-800 dark:bg-gray-600 rounded" />
          <div className="mt-1 text-[8px] text-gray-600 dark:text-gray-400 font-sans">
            Modern
          </div>
        </div>
      );
    case 'travel':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-emerald-50 dark:bg-emerald-900/20">
          <div className="w-full h-12 bg-emerald-700 dark:bg-emerald-600 rounded relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent)]" />
          </div>
          <div className="mt-1 text-[8px] text-emerald-800 dark:text-emerald-400">
            Travel
          </div>
        </div>
      );
    default:
      return null;
  }
}
