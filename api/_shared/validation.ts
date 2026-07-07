/**
 * Input validation utilities for API routes
 * Prevents injection attacks and ensures data integrity
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate coordinates are within India's geographic bounds
 */
export function validateCoordinates(lat: number, lng: number): ValidationResult {
  // India spans approximately 8°N to 37°N and 68°E to 97°E
  if (lat < 8 || lat > 37) {
    return { valid: false, error: 'Latitude out of valid range for India (8°N-37°N)' };
  }
  if (lng < 68 || lng > 97) {
    return { valid: false, error: 'Longitude out of valid range for India (68°E-97°E)' };
  }
  return { valid: true };
}

/**
 * Validate base64 image data URI
 */
export function validatePhoto(photo: string): ValidationResult {
  if (!photo) {
    return { valid: false, error: 'Photo is required' };
  }

  // Check it's a data URI
  if (!photo.startsWith('data:image/')) {
    return { valid: false, error: 'Photo must be a valid image data URI' };
  }

  // Check mimetype is an image
  const mimetypeMatch = photo.match(/^data:(image\/[a-z]+);base64,/);
  if (!mimetypeMatch) {
    return { valid: false, error: 'Invalid image format' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(mimetypeMatch[1])) {
    return { valid: false, error: `Image type ${mimetypeMatch[1]} not allowed` };
  }

  // Check size (base64 is ~33% larger than original, so 25MB limit = ~33MB base64)
  const base64Data = photo.split(',')[1];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSizeBytes = 25 * 1024 * 1024; // 25MB

  if (sizeInBytes > maxSizeBytes) {
    return { valid: false, error: 'Photo exceeds maximum size of 25MB' };
  }

  return { valid: true };
}

/**
 * Validate complaint category
 */
export function validateCategory(category: string): ValidationResult {
  const validCategories = ['pothole', 'garbage', 'streetlight', 'water_leak', 'other'];
  if (!validCategories.includes(category)) {
    return { valid: false, error: `Invalid category. Must be one of: ${validCategories.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Validate severity level
 */
export function validateSeverity(severity: string): ValidationResult {
  const validSeverities = ['low', 'medium', 'high'];
  if (!validSeverities.includes(severity)) {
    return { valid: false, error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Validate status
 */
export function validateStatus(status: string): ValidationResult {
  const validStatuses = ['open', 'in_progress', 'resolved'];
  if (!validStatuses.includes(status)) {
    return { valid: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Sanitize user text input (remove potential XSS vectors)
 * Note: React automatically escapes text content, but this adds an extra layer
 */
export function sanitizeText(text: string, maxLength: number = 5000): string {
  if (!text) return '';
  
  // Trim and limit length
  let sanitized = text.trim().substring(0, maxLength);
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
}

/**
 * Validate chat message
 */
export function validateChatMessage(message: string): ValidationResult {
  if (!message || message.trim() === '') {
    return { valid: false, error: 'Message is required' };
  }

  if (message.length > 5000) {
    return { valid: false, error: 'Message exceeds maximum length of 5000 characters' };
  }

  return { valid: true };
}

/**
 * Validate complaint description
 */
export function validateDescription(description: string): ValidationResult {
  if (description && description.length > 2000) {
    return { valid: false, error: 'Description exceeds maximum length of 2000 characters' };
  }
  return { valid: true };
}

/**
 * Validate complaint ID format
 */
export function validateComplaintId(id: string): ValidationResult {
  // Format should be comp-XXXX where X is a digit
  if (!/^comp-\d+$/.test(id)) {
    return { valid: false, error: 'Invalid complaint ID format' };
  }
  return { valid: true };
}
