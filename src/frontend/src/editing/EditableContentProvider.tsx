import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ValentineContent, defaultValentineContent, Letter, Photo } from '../content/valentineContent';
import { loadDraftContent, saveDraftContent, resetToDefaults, clearDraftContent, hasDraftContent } from './localDraftStorage';
import { useGetPublishedContent, useUpdatePublishedContent } from '../hooks/useQueries';
import { toast } from 'sonner';

interface EditableContentContextType {
  content: ValentineContent;
  publishedContent: ValentineContent | null;
  isEditMode: boolean;
  isPublishing: boolean;
  isLoadingPublished: boolean;
  isDraft: boolean;
  setEditMode: (enabled: boolean) => void;
  updateContent: (updates: Partial<ValentineContent>) => void;
  updateLetter: (letterId: string, updates: Partial<Letter>) => void;
  addLetter: (letter: Omit<Letter, 'id'>) => void;
  deleteLetter: (letterId: string) => void;
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  deletePhoto: (photoId: string) => void;
  resetContent: () => void;
  publishDraft: () => Promise<void>;
  reloadPublished: () => Promise<void>;
}

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export function EditableContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ValentineContent>(defaultValentineContent);
  const [publishedContent, setPublishedContent] = useState<ValentineContent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: fetchedPublished, isLoading: isLoadingPublished, error: publishedError } = useGetPublishedContent();
  const updatePublishedMutation = useUpdatePublishedContent();

  // Initialize content on mount
  useEffect(() => {
    if (isInitialized) return;

    const localDraft = loadDraftContent();
    const hasLocalDraft = hasDraftContent();

    if (hasLocalDraft && localDraft) {
      // Use local draft if it exists
      setContent(localDraft);
    } else if (fetchedPublished) {
      // Use published content from backend if no local draft
      setContent(fetchedPublished);
      setPublishedContent(fetchedPublished);
    } else if (!isLoadingPublished) {
      // Fallback to defaults if backend fetch failed or returned null
      setContent(defaultValentineContent);
      setPublishedContent(defaultValentineContent);
      
      if (publishedError) {
        toast.error('Failed to load published content. Using defaults.');
      }
    }

    if (!isLoadingPublished) {
      setIsInitialized(true);
    }
  }, [fetchedPublished, isLoadingPublished, publishedError, isInitialized]);

  // Update published content when fetched data changes
  useEffect(() => {
    if (fetchedPublished && !hasDraftContent()) {
      setPublishedContent(fetchedPublished);
    } else if (fetchedPublished) {
      setPublishedContent(fetchedPublished);
    }
  }, [fetchedPublished]);

  // Auto-save draft on content change
  useEffect(() => {
    if (isInitialized) {
      saveDraftContent(content);
    }
  }, [content, isInitialized]);

  // Check if current content differs from published
  const isDraft = JSON.stringify(content) !== JSON.stringify(publishedContent);

  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled);
  };

  const updateContent = (updates: Partial<ValentineContent>) => {
    setContent((prev) => {
      const updated = { ...prev };
      
      // Deep merge for nested objects
      if (updates.landing) {
        updated.landing = { ...prev.landing, ...updates.landing };
      }
      if (updates.photos) {
        updated.photos = { ...prev.photos, ...updates.photos };
      }
      if (updates.loveNote) {
        updated.loveNote = { ...prev.loveNote, ...updates.loveNote };
      }
      if (updates.proposal) {
        updated.proposal = { ...prev.proposal, ...updates.proposal };
      }
      if (updates.celebration) {
        updated.celebration = { ...prev.celebration, ...updates.celebration };
      }
      if (updates.recipientName !== undefined) {
        updated.recipientName = updates.recipientName;
      }

      return updated;
    });
  };

  const updateLetter = (letterId: string, updates: Partial<Letter>) => {
    setContent((prev) => ({
      ...prev,
      loveNote: {
        ...prev.loveNote,
        letters: prev.loveNote.letters.map((letter) =>
          letter.id === letterId ? { ...letter, ...updates } : letter
        ),
      },
    }));
  };

  const addLetter = (letter: Omit<Letter, 'id'>) => {
    const newLetter: Letter = {
      ...letter,
      id: `letter-${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      loveNote: {
        ...prev.loveNote,
        letters: [...prev.loveNote.letters, newLetter],
      },
    }));
  };

  const deleteLetter = (letterId: string) => {
    setContent((prev) => ({
      ...prev,
      loveNote: {
        ...prev.loveNote,
        letters: prev.loveNote.letters.filter((letter) => letter.id !== letterId),
      },
    }));
  };

  const updatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setContent((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        photos: prev.photos.photos.map((photo) =>
          photo.id === photoId ? { ...photo, ...updates } : photo
        ),
      },
    }));
  };

  const addPhoto = (photo: Omit<Photo, 'id'>) => {
    const newPhoto: Photo = {
      ...photo,
      id: `photo-${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        photos: [...prev.photos.photos, newPhoto],
      },
    }));
  };

  const deletePhoto = (photoId: string) => {
    setContent((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        photos: prev.photos.photos.filter((photo) => photo.id !== photoId),
      },
    }));
  };

  const resetContent = () => {
    const defaults = resetToDefaults();
    setContent(defaults);
  };

  const publishDraft = async () => {
    try {
      await updatePublishedMutation.mutateAsync(content);
      setPublishedContent(content);
      toast.success('Changes published successfully! Others will now see your updates.');
    } catch (error: any) {
      console.error('Failed to publish:', error);
      
      if (error.message?.includes('Unauthorized')) {
        toast.error('You need to be logged in as an admin to publish changes.');
      } else {
        toast.error('Failed to publish changes. Please try again.');
      }
    }
  };

  const reloadPublished = async () => {
    try {
      if (fetchedPublished) {
        clearDraftContent();
        setContent(fetchedPublished);
        setPublishedContent(fetchedPublished);
        toast.success('Reloaded published version successfully.');
      } else {
        toast.error('No published version available to reload.');
      }
    } catch (error) {
      console.error('Failed to reload published content:', error);
      toast.error('Failed to reload published version.');
    }
  };

  return (
    <EditableContentContext.Provider
      value={{
        content,
        publishedContent,
        isEditMode,
        isPublishing: updatePublishedMutation.isPending,
        isLoadingPublished,
        isDraft,
        setEditMode,
        updateContent,
        updateLetter,
        addLetter,
        deleteLetter,
        updatePhoto,
        addPhoto,
        deletePhoto,
        resetContent,
        publishDraft,
        reloadPublished,
      }}
    >
      {children}
    </EditableContentContext.Provider>
  );
}

export function useEditableContent() {
  const context = useContext(EditableContentContext);
  if (!context) {
    throw new Error('useEditableContent must be used within EditableContentProvider');
  }
  return context;
}
