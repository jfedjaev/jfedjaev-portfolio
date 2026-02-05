# Photo Management System for Book Editor

A comprehensive photo management solution built with React, Tailwind CSS, dnd-kit, and Zustand.

## Installation

The photo management system requires the following dependencies:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities zustand
```

## Features

### 1. PhotoGrid Component
- Responsive grid layout (2-6 columns)
- Auto-adjusting row heights based on aspect ratio
- Drag-and-drop reordering
- Animated transitions with Framer Motion

### 2. PhotoCard Component
- **Thumbnail**: Lazy-loaded with fallback placeholder
- **Selection checkbox**: Multi-select with visual feedback
- **Drag handle**: Reorder photos by dragging
- **Caption overlay**: Text description at bottom
- **Date badge**: Formatted capture date
- **GPS indicator**: Shows location data availability
- **Upload progress**: Visual progress bar during uploads

### 3. Photo Selection (usePhotoSelection hook)
- **Click**: Select single photo
- **Ctrl/Cmd + Click**: Toggle selection
- **Shift + Click**: Range selection
- **Space**: Toggle selection on focused photo
- Keyboard navigation support

### 4. Bulk Actions (PhotoToolbar)
- **Move to chapter**: Organize photos into chapters
- **Delete**: Remove selected photos
- **Rotate**: Left/right rotation
- **Select all**: Toggle select all/none

### 5. State Management (Zustand)
- Persisted photo storage
- Upload progress tracking
- Chapter management
- UI state (active chapter, view mode)

## Usage

```tsx
import { PhotoGrid } from './photos'
import { usePhotoStore } from './photos'

function MyBookEditor() {
  const { photos, chapters, reorderPhotos, movePhotosToChapter } = usePhotoStore()

  return (
    <PhotoGrid
      photos={photos}
      chapters={chapters}
      columns={4}
      gap="medium"
      onReorder={reorderPhotos}
      onMoveToChapter={movePhotosToChapter}
      onDelete={(ids) => console.log('Delete:', ids)}
      onRotate={(ids, dir) => console.log('Rotate:', ids, dir)}
    />
  )
}
```

## File Structure

```
app/book-editor/photos/
├── components/
│   ├── PhotoCard.tsx      # Individual photo card
│   ├── PhotoGrid.tsx      # Grid container with dnd-kit
│   └── PhotoToolbar.tsx   # Bulk actions toolbar
├── hooks/
│   ├── usePhotoSelection.ts  # Multi-select logic
│   └── usePhotoDrag.ts       # Drag-and-drop hooks
├── store/
│   └── usePhotoStore.ts      # Zustand store
├── types/
│   └── index.ts              # TypeScript types
└── index.ts                  # Exports
```

## Customization

### Grid Columns
```tsx
<PhotoGrid columns={3} />  // 2-6 columns supported
```

### Gap Sizes
```tsx
<PhotoGrid gap="small" />   // gap-2
<PhotoGrid gap="medium" />  // gap-4 (default)
<PhotoGrid gap="large" />   // gap-6
```

### Disabling Features
```tsx
<PhotoGrid
  allowSelection={false}  // Disable selection
  allowDrag={false}       // Disable drag-and-drop
  showToolbar={false}     // Hide toolbar
/>
```

## Styling

The components use Tailwind CSS with dark mode support via CSS variables:
- Light/dark mode automatic
- Customizable via Tailwind classes
- Responsive design

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
