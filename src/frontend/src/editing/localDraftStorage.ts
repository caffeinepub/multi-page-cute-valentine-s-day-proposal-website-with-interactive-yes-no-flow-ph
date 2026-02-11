import { ValentineContent, defaultValentineContent } from '../content/valentineContent';

const STORAGE_KEY = 'valentine-editable-content';
const STORAGE_VERSION = 1;

interface StoredContent {
  version: number;
  content: ValentineContent;
}

export function loadDraftContent(): ValentineContent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredContent = JSON.parse(stored);
    
    // Version check
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Stored content version mismatch, ignoring');
      return null;
    }

    return parsed.content;
  } catch (error) {
    console.error('Failed to load draft content:', error);
    return null;
  }
}

export function saveDraftContent(content: ValentineContent): boolean {
  try {
    const toStore: StoredContent = {
      version: STORAGE_VERSION,
      content,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    return true;
  } catch (error) {
    console.error('Failed to save draft content:', error);
    // Check if it's a quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      return false;
    }
    return false;
  }
}

export function clearDraftContent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear draft content:', error);
  }
}

export function resetToDefaults(): ValentineContent {
  clearDraftContent();
  return { ...defaultValentineContent };
}
