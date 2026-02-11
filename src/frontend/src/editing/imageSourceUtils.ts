const ALLOWED_PROTOCOLS = ['http:', 'https:', 'data:'];
const MAX_DATA_URL_SIZE = 5 * 1024 * 1024; // 5MB limit for data URLs

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Image URL cannot be empty' };
  }

  try {
    const parsed = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return {
        valid: false,
        error: `Protocol ${parsed.protocol} is not allowed. Use http:, https:, or data:`,
      };
    }

    // Check data URL size
    if (parsed.protocol === 'data:' && url.length > MAX_DATA_URL_SIZE) {
      return {
        valid: false,
        error: 'Image data URL is too large (max 5MB)',
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    if (file.size > MAX_DATA_URL_SIZE) {
      reject(new Error('Image file is too large (max 5MB)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
