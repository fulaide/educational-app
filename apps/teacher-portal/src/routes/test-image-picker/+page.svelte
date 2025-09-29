<script lang="ts">
	import { browser } from '$app/environment';
	import type { ImageAsset } from '@educational-app/media-manager';
	// Try to import CSS explicitly
	import '@educational-app/media-manager/styles';

	let selectedImages: ImageAsset[] = $state([]);
	let errorMessage = $state('');
	let ImagePicker = $state<any>(null);
	let loading = $state(true);

	// Use onMount instead of $effect for better compatibility
	import { onMount } from 'svelte';
	
	onMount(async () => {
		if (browser) {
			console.log('Attempting to load ImagePicker...');
			try {
				const module = await import('@educational-app/media-manager');
				console.log('Module loaded:', module);
				ImagePicker = module.ImagePicker;
				console.log('ImagePicker set:', ImagePicker);
				loading = false;
			} catch (error) {
				console.error('Failed to load ImagePicker:', error);
				errorMessage = `Failed to load image picker: ${error.message}`;
				loading = false;
			}
		}
	});

	function handleImageSelect(images: ImageAsset[]) {
		selectedImages = images;
		console.log('Selected images:', images);
	}
	
	function handleImageError(error: string) {
		errorMessage = error;
		console.error('Image picker error:', error);
	}
</script>

<svelte:head>
	<title>Image Picker Test - Teacher Portal</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-white shadow rounded-lg p-8">
			<h1 class="text-2xl font-bold text-gray-900 mb-6">Image Picker Test</h1>
			
			{#if errorMessage}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
					<p class="text-red-800">{errorMessage}</p>
				</div>
			{/if}

			<div class="space-y-6">
				<div>
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Class Avatar Picker</h2>
					<div class="mb-2 text-sm text-gray-600">
						Debug: browser={browser}, ImagePicker={ImagePicker ? 'loaded' : 'null'}, loading={loading}
					</div>
					{#if loading}
						<div class="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
							<div class="text-center">
								<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
								<p class="text-gray-500">Loading image picker...</p>
								<p class="text-xs text-gray-400 mt-2">Browser: {browser}</p>
							</div>
						</div>
					{:else if ImagePicker}
						<ImagePicker 
							category="class-avatars"
							allowUpload={true}
							onSelect={handleImageSelect}
							onError={handleImageError}
						/>
					{:else}
						<div class="text-red-600">Failed to load ImagePicker component.</div>
					{/if}
				</div>

				{#if selectedImages.length > 0}
					<div class="border-t pt-6">
						<h3 class="text-md font-semibold text-gray-900 mb-4">Selected Images:</h3>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{#each selectedImages as image}
								<div class="border rounded-lg p-4">
									<img 
										src={image.url} 
										alt={image.alt || 'Selected image'} 
										class="w-full h-32 object-cover rounded-md mb-2"
									/>
									<p class="text-sm text-gray-600"><strong>URL:</strong> {image.url}</p>
									<p class="text-sm text-gray-600"><strong>Type:</strong> {image.type}</p>
									<p class="text-sm text-gray-600"><strong>Category:</strong> {image.category}</p>
									{#if image.alt}
										<p class="text-sm text-gray-600"><strong>Alt:</strong> {image.alt}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* Basic ImagePicker styles to avoid CSS import issues */
	:global(.image-picker) {
		width: 100%;
		max-width: 600px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		overflow: hidden;
	}

	:global(.tab-navigation) {
		display: flex;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	:global(.tab-button) {
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

	:global(.tab-button:hover) {
		background: #f3f4f6;
		color: #374151;
	}

	:global(.tab-button.active) {
		color: #2563eb;
		border-bottom-color: #2563eb;
		background: white;
	}

	:global(.tab-content) {
		padding: 20px;
		min-height: 300px;
	}
</style>