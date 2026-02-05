import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Photo, Chapter } from '../types'

interface PhotoStore {
  // Photos
  photos: Photo[]
  setPhotos: (photos: Photo[]) => void
  addPhoto: (photo: Photo) => void
  updatePhoto: (id: string, updates: Partial<Photo>) => void
  removePhoto: (id: string) => void
  removePhotos: (ids: string[]) => void
  reorderPhotos: (photoIds: string[]) => void
  movePhotosToChapter: (photoIds: string[], chapterId: string | undefined) => void
  rotatePhoto: (id: string, direction: 'left' | 'right') => void
  
  // Upload
  setUploadProgress: (id: string, progress: number) => void
  setUploading: (id: string, isUploading: boolean) => void
  
  // Chapters
  chapters: Chapter[]
  setChapters: (chapters: Chapter[]) => void
  addChapter: (chapter: Chapter) => void
  updateChapter: (id: string, updates: Partial<Chapter>) => void
  removeChapter: (id: string) => void
  
  // UI State
  activeChapterId: string | null
  setActiveChapterId: (id: string | null) => void
  viewMode: 'grid' | 'timeline'
  setViewMode: (mode: 'grid' | 'timeline') => void
}

export const usePhotoStore = create<PhotoStore>()(
  persist(
    (set, get) => ({
      // Photos
      photos: [],
      setPhotos: (photos) => set({ photos }),
      addPhoto: (photo) => set((state) => ({ 
        photos: [...state.photos, photo] 
      })),
      updatePhoto: (id, updates) => set((state) => ({
        photos: state.photos.map((p) => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      removePhoto: (id) => set((state) => ({
        photos: state.photos.filter((p) => p.id !== id)
      })),
      removePhotos: (ids) => set((state) => ({
        photos: state.photos.filter((p) => !ids.includes(p.id))
      })),
      reorderPhotos: (photoIds) => set((state) => {
        const photoMap = new Map(state.photos.map((p) => [p.id, p]))
        const reordered = photoIds
          .map((id) => photoMap.get(id))
          .filter((p): p is Photo => p !== undefined)
          .map((p, index) => ({ ...p, order: index }))
        
        // Keep photos not in the reordered list
        const otherPhotos = state.photos.filter((p) => !photoIds.includes(p.id))
        return { photos: [...reordered, ...otherPhotos] }
      }),
      movePhotosToChapter: (photoIds, chapterId) => set((state) => ({
        photos: state.photos.map((p) =>
          photoIds.includes(p.id) ? { ...p, chapterId } : p
        )
      })),
      rotatePhoto: (id, direction) => {
        // In a real app, this would rotate the image on the server
        // For now, we'll just track rotation state
        const rotation = direction === 'left' ? -90 : 90
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === id ? { ...p, rotation: ((p as any).rotation || 0) + rotation } : p
          )
        }))
      },
      
      // Upload
      setUploadProgress: (id, progress) => set((state) => ({
        photos: state.photos.map((p) =>
          p.id === id ? { ...p, uploadProgress: progress } : p
        )
      })),
      setUploading: (id, isUploading) => set((state) => ({
        photos: state.photos.map((p) =>
          p.id === id ? { ...p, isUploading } : p
        )
      })),
      
      // Chapters
      chapters: [],
      setChapters: (chapters) => set({ chapters }),
      addChapter: (chapter) => set((state) => ({
        chapters: [...state.chapters, chapter]
      })),
      updateChapter: (id, updates) => set((state) => ({
        chapters: state.chapters.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      removeChapter: (id) => set((state) => ({
        chapters: state.chapters.filter((c) => c.id !== id),
        photos: state.photos.map((p) =>
          p.chapterId === id ? { ...p, chapterId: undefined } : p
        )
      })),
      
      // UI State
      activeChapterId: null,
      setActiveChapterId: (id) => set({ activeChapterId: id }),
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode })
    }),
    {
      name: 'photo-store',
      partialize: (state) => ({ 
        photos: state.photos, 
        chapters: state.chapters,
        viewMode: state.viewMode 
      })
    }
  )
)
