<script lang="ts">
	import { getPresetImages, getPresetImagesByTags } from '../utils/preset-images.js';
	import type { ImageCategory, PresetImage } from '../types.js';

	interface Props {
		category: ImageCategory;
		currentImage?: string;
		onSelect?: (preset: PresetImage) => void;
	}

	let { category, currentImage, onSelect }: Props = $props();

	// Get all preset images for the category
	const allPresets = getPresetImages(category);

	// Filter state
	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);

	// Get all available tags for this category
	const availableTags = $derived(() => {
		const tagSet = new Set<string>();
		allPresets.forEach(preset => {
			preset.tags.forEach(tag => tagSet.add(tag));
		});
		return Array.from(tagSet).sort();
	});

	// Filtered presets based on search and tags
	const filteredPresets = $derived(() => {
		let filtered = allPresets;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(preset =>
				preset.alt.toLowerCase().includes(query) ||
				preset.tags.some(tag => tag.toLowerCase().includes(query))
			);
		}

		// Filter by selected tags
		if (selectedTags.length > 0) {
			filtered = filtered.filter(preset =>
				selectedTags.every(tag => preset.tags.includes(tag))
			);
		}

		return filtered;
	});

	// Handle preset selection
	function selectPreset(preset: PresetImage) {
		onSelect?.(preset);
	}

	// Handle tag toggle
	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter(t => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	// Clear all filters
	function clearFilters() {
		searchQuery = '';
		selectedTags = [];
	}
</script>

<div class="preset-gallery">
	<!-- Search and Filter Controls -->
	<div class="controls">
		<div class="search-box">
			<input
				type="text"
				placeholder="Search images..."
				bind:value={searchQuery}
				class="search-input"
			/>
		</div>

		{#if availableTags.length > 0}
			<div class="tag-filters">
				<span class="filter-label">Filter by:</span>
				{#each availableTags as tag}
					<button
						type="button"
						class="tag-filter {selectedTags.includes(tag) ? 'active' : ''}"
						onclick={() => toggleTag(tag)}
					>
						{tag}
					</button>
				{/each}
				{#if selectedTags.length > 0 || searchQuery.trim()}
					<button
						type="button"
						class="clear-filters"
						onclick={clearFilters}
					>
						Clear
					</button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Image Grid -->
	<div class="image-grid">
		{#each filteredPresets as preset (preset.id)}
			<button
				type="button"
				class="preset-item {currentImage === preset.url ? 'selected' : ''}"
				onclick={() => selectPreset(preset)}
				title={preset.alt}
			>
				<img
					src={preset.url}
					alt={preset.alt}
					class="preset-image"
					loading="lazy"
				/>
				<div class="preset-overlay">
					<div class="preset-tags">
						{#each preset.tags.slice(0, 3) as tag}
							<span class="preset-tag">{tag}</span>
						{/each}
					</div>
				</div>
			</button>
		{:else}
			<div class="no-results">
				<svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
				</svg>
				<p>No images found matching your criteria.</p>
				<button type="button" class="clear-filters-btn" onclick={clearFilters}>
					Clear Filters
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.preset-gallery {
		width: 100%;
	}

	.controls {
		margin-bottom: 20px;
		space-y: 12px;
	}

	.search-box {
		margin-bottom: 12px;
	}

	.search-input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 14px;
		transition: border-color 200ms;
	}

	.search-input:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.tag-filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}

	.filter-label {
		font-size: 12px;
		font-weight: 500;
		color: #6b7280;
		margin-right: 4px;
	}

	.tag-filter {
		padding: 4px 8px;
		border: 1px solid #d1d5db;
		border-radius: 12px;
		background: white;
		color: #6b7280;
		font-size: 12px;
		cursor: pointer;
		transition: all 200ms;
	}

	.tag-filter:hover {
		border-color: #2563eb;
		color: #2563eb;
	}

	.tag-filter.active {
		background: #2563eb;
		border-color: #2563eb;
		color: white;
	}

	.clear-filters {
		padding: 4px 8px;
		border: 1px solid #ef4444;
		border-radius: 12px;
		background: white;
		color: #ef4444;
		font-size: 12px;
		cursor: pointer;
		transition: all 200ms;
	}

	.clear-filters:hover {
		background: #ef4444;
		color: white;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 16px;
		max-height: 400px;
		overflow-y: auto;
	}

	.preset-item {
		position: relative;
		aspect-ratio: 1;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		cursor: pointer;
		transition: all 200ms;
		overflow: hidden;
		padding: 0;
	}

	.preset-item:hover {
		border-color: #2563eb;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.preset-item.selected {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
	}

	.preset-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preset-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		padding: 8px;
		opacity: 0;
		transition: opacity 200ms;
	}

	.preset-item:hover .preset-overlay {
		opacity: 1;
	}

	.preset-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.preset-tag {
		padding: 2px 6px;
		background: rgba(255, 255, 255, 0.9);
		color: #374151;
		border-radius: 8px;
		font-size: 10px;
		font-weight: 500;
	}

	.no-results {
		grid-column: 1 / -1;
		text-align: center;
		padding: 40px 20px;
		color: #6b7280;
	}

	.no-results-icon {
		width: 48px;
		height: 48px;
		margin: 0 auto 12px;
		opacity: 0.5;
	}

	.no-results p {
		margin: 0 0 16px 0;
		font-size: 14px;
	}

	.clear-filters-btn {
		padding: 8px 16px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		color: #374151;
		font-size: 14px;
		cursor: pointer;
		transition: all 200ms;
	}

	.clear-filters-btn:hover {
		background: #f3f4f6;
	}

	/* Responsive design */
	@media (max-width: 640px) {
		.image-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
			gap: 12px;
		}

		.tag-filters {
			font-size: 12px;
		}

		.filter-label {
			font-size: 11px;
		}
	}
</style>