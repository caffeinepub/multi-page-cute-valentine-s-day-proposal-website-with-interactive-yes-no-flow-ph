import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ValentineContent, defaultValentineContent, Letter, Photo } from '../content/valentineContent';
import { loadDraftContent, saveDraftContent, resetToDefaults } from './localDraftStorage';

interface EditableContentContextType {
  content: ValentineContent;
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  updateContent: (updates: Partial<ValentineContent>) => void;
  updateLetter: (letterId: string, updates: Partial<Letter>) => void;
  addLetter: (letter: Omit<Letter, 'id'>) => void;
  deleteLetter: (letterId: string) => void;
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  deletePhoto: (photoId: string) => void;
  resetContent: () => void;
}

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export function EditableContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ValentineContent>(() => {
    const loaded = loadDraftContent();
    return loaded || defaultValentineContent;
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Auto-save on content change
  useEffect(() => {
    saveDraftContent(content);
  }, [content]);

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

  return (
    <EditableContentContext.Provider
      value={{
        content,
        isEditMode,
        setEditMode,
        updateContent,
        updateLetter,
        addLetter,
        deleteLetter,
        updatePhoto,
        addPhoto,
        deletePhoto,
        resetContent,
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
