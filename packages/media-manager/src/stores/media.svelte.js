/**
 * Media state management using Svelte 5 runes
 * @typedef {import('../types.js').ImageAsset} ImageAsset
 * @typedef {import('../types.js').PresetImage} PresetImage  
 * @typedef {import('../types.js').ImageCategory} ImageCategory
 * @typedef {import('../types.js').UploadResult} UploadResult
 */

export class MediaManager {
  constructor() {
    // Initialize state with $state runes inside constructor for proper Svelte context
    this.selectedImages = $state([]);
    this.isUploading = $state(false);
    this.uploadProgress = $state(0);
    this.uploadError = $state(null);
    this.presetImages = $state(new Map());
    this.activeTab = $state('presets');
    this.showCropper = $state(false);
  }
  
  /**
   * Select an image (preset or uploaded)
   * @param {ImageAsset} image
   */
  selectImage(image) {
    this.selectedImages = [image];
  }
  
  /**
   * Select multiple images
   * @param {ImageAsset[]} images
   */
  selectImages(images) {
    this.selectedImages = [...images];
  }
  
  /**
   * Clear selected images
   */
  clearSelection() {
    this.selectedImages = [];
  }
  
  /**
   * Add uploaded image to selection
   * @param {UploadResult} result
   * @param {ImageCategory} category
   */
  addUploadedImage(result, category) {
    const imageAsset = {
      id: crypto.randomUUID(),
      url: result.url,
      type: result.type,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.selectedImages = [imageAsset];
  }
  
  /**
   * Set upload state
   * @param {boolean} uploading
   * @param {number} progress
   * @param {string|null} error
   */
  setUploadState(uploading, progress = 0, error = null) {
    this.isUploading = uploading;
    this.uploadProgress = progress;
    this.uploadError = error;
  }
  
  /**
   * Cache preset images for a category
   * @param {ImageCategory} category
   * @param {PresetImage[]} images
   */
  cachePresetImages(category, images) {
    this.presetImages.set(category, images);
  }
  
  /**
   * Get cached preset images
   * @param {ImageCategory} category
   * @returns {PresetImage[]}
   */
  getCachedPresetImages(category) {
    return this.presetImages.get(category) || [];
  }
  
  /**
   * Switch active tab
   * @param {'presets' | 'upload'} tab
   */
  setActiveTab(tab) {
    this.activeTab = tab;
  }
  
  /**
   * Show/hide image cropper
   * @param {boolean} show
   */
  toggleCropper(show) {
    this.showCropper = show;
  }
  
  /**
   * Reset all state
   */
  reset() {
    this.selectedImages = [];
    this.isUploading = false;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.activeTab = 'presets';
    this.showCropper = false;
  }
}

/**
 * Create a new MediaManager instance
 * Use this in components that need media management
 */
export function createMediaManager() {
  return new MediaManager();
}

/**
 * Utility function to convert PresetImage to ImageAsset
 * @param {PresetImage} preset
 * @returns {ImageAsset}
 */
export function presetToImageAsset(preset) {
  return {
    id: preset.id,
    url: preset.url,
    type: 'preset',
    category: preset.category,
    alt: preset.alt,
    metadata: {
      tags: preset.tags,
      thumbnail: preset.thumbnail
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}