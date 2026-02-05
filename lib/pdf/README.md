# PDF Export System for Photo Story Book

A comprehensive PDF generation system for creating beautiful photo story books using Puppeteer and React-based HTML templates.

## Features

- **PDF Generation Pipeline**: Cover page, table of contents, chapter pages, and photo grids
- **Multiple Templates**: Classic (elegant serif), Modern (clean sans-serif), Travel (adventure style)
- **Map Rendering**: Mapbox Static API integration with caching
- **Async Job Queue**: Non-blocking export processing with progress tracking

## Installation

Dependencies are already included in `package.json`:
- `puppeteer` - Headless browser for PDF generation
- `pdf-lib` - PDF manipulation and merging

```bash
npm install
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

Get your token at: https://www.mapbox.com/

## Usage

### Basic Usage

```tsx
import { usePDFExport } from '@/hooks/usePDFExport'
import { ExportProgress } from '@/components/export/ExportProgress'
import { PDFExportOptions } from '@/lib/pdf/types'

function MyBookComponent() {
  const { 
    startExport, 
    progress, 
    status, 
    job,
    canDownload,
    downloadUrl 
  } = usePDFExport()

  const handleExport = () => {
    const options: PDFExportOptions = {
      bookId: 'my-book-123',
      title: 'My Travel Adventure',
      subtitle: 'A journey through Europe',
      author: 'John Doe',
      template: 'travel',
      includeMap: true,
      mapStyle: 'outdoors',
      chapters: [
        {
          id: 'ch1',
          title: 'Chapter 1: Paris',
          description: 'Our first stop in the city of lights',
          photos: [
            {
              id: 'p1',
              src: 'https://example.com/photo1.jpg',
              caption: 'Eiffel Tower at sunset',
              dateTaken: new Date('2024-01-15'),
              hasGPS: true,
              latitude: 48.8584,
              longitude: 2.2945,
              width: 1200,
              height: 800,
            },
            // ... more photos
          ],
        },
        // ... more chapters
      ],
    }

    startExport(options)
  }

  return (
    <div>
      <button onClick={handleExport}>
        Export as PDF
      </button>
      
      <ExportProgress
        job={job}
        progress={progress}
        status={status}
        canDownload={canDownload}
        downloadUrl={downloadUrl}
        onCancel={() => {}}
        onRetry={() => {}}
        onDownload={() => window.open(downloadUrl, '_blank')}
        onClose={() => {}}
      />
    </div>
  )
}
```

### Templates

Three built-in templates available:

1. **Classic** - Elegant serif fonts, traditional book layout
2. **Modern** - Clean sans-serif, contemporary design
3. **Travel** - Adventure style with decorative elements

```tsx
const options: PDFExportOptions = {
  template: 'classic', // or 'modern' or 'travel'
  // ...
}
```

### Map Styles

When `includeMap` is true, choose from:

- `streets` - Standard street map
- `outdoors` - Terrain and trails (great for travel)
- `satellite` - Satellite imagery
- `light` - Minimal light style
- `dark` - Minimal dark style

```tsx
const options: PDFExportOptions = {
  includeMap: true,
  mapStyle: 'outdoors',
  // ...
}
```

## API Endpoints

### Create Export Job

```http
POST /api/export/pdf
Content-Type: application/json

{
  "bookId": "string",
  "title": "string",
  "subtitle": "string (optional)",
  "author": "string (optional)",
  "template": "classic | modern | travel",
  "chapters": [...],
  "includeMap": true,
  "mapStyle": "streets | outdoors | satellite | light | dark"
}
```

Response:
```json
{
  "jobId": "pdf_1234567890_abc123",
  "message": "PDF export job created",
  "status": "pending"
}
```

### Check Job Status

```http
GET /api/export/pdf?jobId=pdf_1234567890_abc123
```

Response:
```json
{
  "job": {
    "id": "pdf_1234567890_abc123",
    "status": "processing",
    "progress": 45,
    "message": "Rendering chapter 2...",
    "downloadUrl": null
  }
}
```

### Download PDF

```http
GET /api/export/pdf/download?jobId=pdf_1234567890_abc123
```

Returns the PDF file as `application/pdf`.

### Cancel/Delete Job

```http
DELETE /api/export/pdf?jobId=pdf_1234567890_abc123
```

## File Structure

```
lib/pdf/
├── index.ts                    # Main exports
├── generator.ts                # Core PDF generation logic
├── jobQueue.ts                 # Async job queue management
├── types/
│   └── index.ts               # TypeScript types
├── templates/
│   ├── config.ts              # Template configuration
│   ├── classic.tsx            # Classic template styles
│   ├── modern.tsx             # Modern template styles
│   └── travel.tsx             # Travel template styles
├── components/
│   ├── CoverPage.tsx          # Cover page renderer
│   ├── TOCPage.tsx            # Table of contents renderer
│   ├── ChapterPage.tsx        # Chapter page renderer
│   └── PhotoGridPage.tsx      # Photo grid renderer
└── utils/
    └── mapRenderer.ts         # Mapbox integration & caching

app/api/export/pdf/
├── route.ts                   # Main API route
└── download/
    └── route.ts              # Download endpoint

hooks/
└── usePDFExport.ts           # React hook for export status

components/export/
├── ExportProgress.tsx        # Progress UI component
└── PDFExportExample.tsx      # Example usage component
```

## Customization

### Creating a Custom Template

1. Add your template config to `lib/pdf/templates/config.ts`:

```tsx
export const templateConfigs = {
  // ... existing templates
  custom: {
    name: 'Custom',
    fonts: {
      heading: 'Your Font, sans-serif',
      body: 'Your Font, sans-serif',
    },
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#ff0000',
    },
    spacing: {
      margin: 50,
      gutter: 30,
      lineHeight: 1.5,
    },
  },
}
```

2. Update the `TemplateStyle` type in `lib/pdf/types/index.ts`:

```tsx
export type TemplateStyle = 'classic' | 'modern' | 'travel' | 'custom'
```

### Custom Map Markers

Modify `lib/pdf/utils/mapRenderer.ts` to customize map marker appearance:

```tsx
const markerOverlay = chapter.photos
  .filter((p) => p.hasGPS && p.latitude && p.longitude)
  .map((p, i) => {
    // Customize marker colors and labels
    const color = i === 0 ? 'your-color' : 'another-color'
    return `pin-l-${i + 1}+${color}(${p.longitude},${p.latitude})`
  })
  .join(',')
```

## Production Considerations

1. **File Storage**: The current implementation stores PDFs in memory. For production:
   - Use S3, Google Cloud Storage, or similar
   - Store file reference in the job object
   - Implement cleanup policies

2. **Queue Backend**: The in-memory queue works for single-instance deployments. For scaling:
   - Use Redis with Bull or BullMQ
   - Implement job persistence
   - Add retry logic with exponential backoff

3. **Puppeteer Performance**:
   - Use a pool of browser instances
   - Implement request caching
   - Consider using puppeteer-cluster for concurrent processing

4. **Mapbox Costs**:
   - Implement aggressive caching (already included)
   - Consider static map fallbacks
   - Monitor API usage

## License

MIT
