// Export main components
export { default as ImagePicker } from './components/ImagePicker.svelte';
export { default as PresetGallery } from './components/PresetGallery.svelte';
export { default as CustomUpload } from './components/CustomUpload.svelte';

// Export stores and utilities
export { createMediaManager, MediaManager, presetToImageAsset } from './stores/media.svelte.js';
export { uploadToBlob, deleteFromBlob, listBlobFiles, validateImageFile, generateThumbnailUrl } from './utils/vercel-blob.js';
export { getPresetImages, getPresetImagesByTags, getPopularPresetImages, searchPresetImages, CLASS_AVATAR_PRESETS, REWARD_IMAGE_PRESETS } from './utils/preset-images.js';

// Export types
export type {
  ImageType,
  ImageCategory,
  ImageAsset,
  PresetImage,
  UploadResult,
  ImagePickerConfig,
  UploadFileInput
} from './types.js';

// Export validation schemas
export { uploadFileSchema, imageAssetSchema } from './types.js';