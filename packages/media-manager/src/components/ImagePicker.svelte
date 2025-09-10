<script lang="ts">
	import { getPresetImages } from '../utils/preset-images.js';
	import { validateImageFile } from '../utils/vercel-blob.js';
	import type { ImageCategory, ImageAsset, ImagePickerConfig } from '../types.js';
	import PresetGallery from './PresetGallery.svelte';
	import CustomUpload from './CustomUpload.svelte';

	interface Props {
		category: ImageCategory;
		currentImage?: string;
		allowUpload?: boolean;
		maxFileSize?: number;
		acceptedFormats?: string[];
		cropAspectRatio?: number;
		multiple?: boolean;
		onSelect?: (images: ImageAsset[]) => void;
		onError?: (error: string) => void;
	}

	let {
		category,
		currentImage,
		allowUpload = true,
		maxFileSize = 5 * 1024 * 1024, // 5MB default
		acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
		cropAspectRatio,
		multiple = false,
		onSelect,
		onError
	}: Props = $props();
	
	// Local state management using $state runes directly in component
	let selectedImages: ImageAsset[] = $state([]);
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let uploadError = $state(null);
	let activeTab = $state<'presets' | 'upload'>('presets');
	
	// Load preset images for the category
	const presetImages = getPresetImages(category);

	// Helper function to convert preset to ImageAsset
	function presetToImageAsset(preset: any): ImageAsset {
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

	// Handle image selection from presets
	function handlePresetSelect(preset: any) {
		const imageAsset = presetToImageAsset(preset);
		selectedImages = [imageAsset];
		onSelect?.([imageAsset]);
	}

	// Handle custom file upload using client-side approach
	async function handleCustomUpload(files: FileList | null) {
		if (!files || files.length === 0) return;

		const file = files[0];
		
		// Validate file
		const validationError = validateImageFile(file, maxFileSize);
		if (validationError) {
			isUploading = false;
			uploadProgress = 0;
			uploadError = validationError;
			onError?.(validationError);
			return;
		}

		// Start upload
		isUploading = true;
		uploadProgress = 0;
		uploadError = null;

		try {
			// Use FormData to upload via our API endpoint
			const formData = new FormData();
			formData.append('file', file);
			formData.append('folder', category);

			const response = await fetch('/api/media/upload', {
				method: 'POST',
				body: formData,
				credentials: 'include', // Include session cookies for authentication
			});

			if (!response.ok) {
				// Check if it's a redirect (authentication required)
				if (response.status === 303 || response.status === 302) {
					throw new Error('Authentication required. Please sign in to upload images.');
				}
				
				const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
				throw new Error(errorData.message || `Upload failed with status ${response.status}`);
			}

			const result = await response.json();

			// Create image asset and select it
			const imageAsset: ImageAsset = {
				id: crypto.randomUUID(),
				url: result.url,
				type: 'custom',
				category,
				createdAt: new Date(),
				updatedAt: new Date()
			};
			
			selectedImages = [imageAsset];
			isUploading = false;
			uploadProgress = 100;
			uploadError = null;
			
			onSelect?.(selectedImages);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Upload failed';
			isUploading = false;
			uploadProgress = 0;
			uploadError = errorMessage;
			onError?.(errorMessage);
		}
	}

	// Handle tab switching
	function switchTab(tab: 'presets' | 'upload') {
		activeTab = tab;
		uploadError = null; // Clear any upload errors
	}
</script>

<div class="image-picker">
	<!-- Tab Navigation -->
	<div class="tab-navigation">
		<button
			type="button"
			class="tab-button {activeTab === 'presets' ? 'active' : ''}"
			onclick={() => switchTab('presets')}
		>
			Choose from Gallery
		</button>
		{#if allowUpload}
			<button
				type="button"
				class="tab-button {activeTab === 'upload' ? 'active' : ''}"
				onclick={() => switchTab('upload')}
			>
				Upload Custom
			</button>
		{/if}
	</div>

	<!-- Tab Content -->
	<div class="tab-content">
		{#if activeTab === 'presets'}
			<PresetGallery
				{category}
				{currentImage}
				onSelect={handlePresetSelect}
			/>
		{:else if activeTab === 'upload' && allowUpload}
			<CustomUpload
				{maxFileSize}
				{acceptedFormats}
				{isUploading}
				{uploadProgress}
				{uploadError}
				onFileSelect={handleCustomUpload}
			/>
		{/if}
	</div>

	<!-- Selected Image Preview -->
	{#if selectedImages.length > 0}
		<div class="selected-preview">
			<h4>Selected Image:</h4>
			<div class="preview-image">
				<img 
					src={selectedImages[0].url} 
					alt={selectedImages[0].alt || 'Selected image'}
					class="preview-img"
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.image-picker {
		width: 100%;
		max-width: 600px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		overflow: hidden;
	}

	.tab-navigation {
		display: flex;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.tab-button {
		flex: 1;
		padding: 12px 16px;
		border: none;
		background: transparent;
		color: #6b7280;
		font-weight: 500;
		cursor: pointer;
		transition: all 200ms;
		border-bottom: 2px solid transparent;
	}

	.tab-button:hover {
		background: #f3f4f6;
		color: #374151;
	}

	.tab-button.active {
		color: #2563eb;
		border-bottom-color: #2563eb;
		background: white;
	}

	.tab-content {
		padding: 20px;
		min-height: 300px;
	}

	.selected-preview {
		padding: 16px;
		border-top: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.selected-preview h4 {
		margin: 0 0 12px 0;
		font-size: 14px;
		font-weight: 600;
		color: #374151;
	}

	.preview-image {
		display: flex;
		justify-content: center;
	}

	.preview-img {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 8px;
		border: 2px solid #e5e7eb;
	}

	/* Responsive design */
	@media (max-width: 640px) {
		.image-picker {
			max-width: 100%;
		}

		.tab-content {
			padding: 16px;
			min-height: 250px;
		}

		.tab-button {
			padding: 10px 12px;
			font-size: 14px;
		}
	}
</style>