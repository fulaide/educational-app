import { z } from 'zod';

/**
 * Image upload types and validation schemas
 */

export type ImageType = 'preset' | 'custom';

export type ImageCategory = 
  | 'class-avatars' 
  | 'reward-images' 
  | 'student-profiles' 
  | 'achievements';

export interface ImageAsset {
  id: string;
  url: string;
  type: ImageType;
  category: ImageCategory;
  alt?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PresetImage {
  id: string;
  url: string;
  category: ImageCategory;
  alt: string;
  tags: string[];
  thumbnail?: string;
}

export interface UploadResult {
  url: string;
  type: ImageType;
  size: number;
  filename: string;
}

export interface ImagePickerConfig {
  category: ImageCategory;
  allowUpload: boolean;
  maxFileSize: number; // in bytes
  acceptedFormats: string[];
  cropAspectRatio?: number;
  multiple: boolean;
}

// Validation schemas
export const uploadFileSchema = z.object({
  file: z.instanceof(File),
  category: z.enum(['class-avatars', 'reward-images', 'student-profiles', 'achievements']),
  alt: z.string().optional()
});

export const imageAssetSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  type: z.enum(['preset', 'custom']),
  category: z.enum(['class-avatars', 'reward-images', 'student-profiles', 'achievements']),
  alt: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;