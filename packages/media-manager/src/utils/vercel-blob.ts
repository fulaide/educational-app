import { put, del, list } from '@vercel/blob';
import type { ImageCategory, UploadResult } from '../types.js';

/**
 * Vercel Blob storage client for image uploads
 */

export interface BlobUploadOptions {
  folder: ImageCategory;
  filename?: string;
  maxSize?: number;
}

/**
 * Upload file to Vercel Blob storage
 */
export async function uploadToBlob(
  file: File, 
  options: BlobUploadOptions
): Promise<UploadResult> {
  const { folder, filename, maxSize = 5 * 1024 * 1024 } = options;
  
  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP files are allowed.');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  const finalFilename = filename 
    ? `${filename}.${extension}`
    : `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  const blobPath = `${folder}/${finalFilename}`;

  try {
    const { url } = await put(blobPath, file, {
      access: 'public',
      handleUploadUrl: '/api/media/upload'
    });

    return {
      url,
      type: 'custom',
      size: file.size,
      filename: finalFilename
    };
  } catch (error) {
    console.error('Failed to upload to Vercel Blob:', error);
    throw new Error('Upload failed. Please try again.');
  }
}

/**
 * Delete file from Vercel Blob storage
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Failed to delete from Vercel Blob:', error);
    throw new Error('Delete failed. Please try again.');
  }
}

/**
 * List files in a specific folder
 */
export async function listBlobFiles(folder: ImageCategory) {
  try {
    const { blobs } = await list({
      prefix: `${folder}/`,
      limit: 100
    });
    return blobs;
  } catch (error) {
    console.error('Failed to list Blob files:', error);
    throw new Error('Failed to list files.');
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File, maxSize = 5 * 1024 * 1024): string | null {
  // Check file size
  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP files are allowed';
  }

  // Check file dimensions (will be processed client-side)
  return null;
}

/**
 * Generate thumbnail URL from main image URL
 * This is a placeholder - actual implementation would depend on your CDN setup
 */
export function generateThumbnailUrl(url: string, size = 256): string {
  // For now, return the original URL
  // In production, you might use a service like Cloudinary or implement
  // server-side image processing
  return url;
}