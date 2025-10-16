<script lang="ts">
	import { Search, Filter, X, ChevronDown, Check } from 'lucide-svelte';
	import { Button, cn } from '@educational-app/ui';

	interface VocabularyWord {
		id: string;
		word: string;
		translation: string;
		category: string;
		difficulty: string;
		frequency: number;
		tags: string[];
		imageUrl?: string;
		audioUrl?: string;
		phonetic?: string;
	}

	interface Props {
		vocabularyWords: VocabularyWord[];
		categories: string[];
		difficulties: readonly string[];
		selectedWords?: VocabularyWord[];
		onchange?: () => void;
	}

	let {
		vocabularyWords,
		categories,
		difficulties,
		selectedWords = $bindable([]),
		onchange
	}: Props = $props();

	// Filter state
	let searchQuery = $state('');
	let selectedCategory = $state<string>('');
	let selectedDifficulty = $state<string>('');
	let selectedTags = $state<string[]>([]);
	let showFilters = $state(false);

	// Get all unique tags
	const allTags = $derived(
		Array.from(new Set(vocabularyWords.flatMap((w) => w.tags))).sort()
	);

	// Filtered words
	const filteredWords = $derived.by(() => {
		let filtered = vocabularyWords;

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(w) =>
					w.word.toLowerCase().includes(query) ||
					w.translation.toLowerCase().includes(query) ||
					w.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Category filter
		if (selectedCategory) {
			filtered = filtered.filter((w) => w.category === selectedCategory);
		}

		// Difficulty filter
		if (selectedDifficulty) {
			filtered = filtered.filter((w) => w.difficulty === selectedDifficulty);
		}

		// Tags filter
		if (selectedTags.length > 0) {
			filtered = filtered.filter((w) => selectedTags.some((tag) => w.tags.includes(tag)));
		}

		return filtered;
	});

	// Selection state
	const isSelected = $derived((wordId: string) => {
		return selectedWords.some((w) => w.id === wordId);
	});

	const selectedCount = $derived(selectedWords.length);
	const totalCount = $derived(filteredWords.length);

	// Actions
	function toggleWord(word: VocabularyWord) {
		if (isSelected(word.id)) {
			selectedWords = selectedWords.filter((w) => w.id !== word.id);
		} else {
			selectedWords = [...selectedWords, word];
		}
		onchange?.();
	}

	function selectAll() {
		selectedWords = [...filteredWords];
		onchange?.();
	}

	function clearSelection() {
		selectedWords = [];
		onchange?.();
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = '';
		selectedDifficulty = '';
		selectedTags = [];
	}

	// Category display names
	const categoryNames: Record<string, string> = {
		ANIMALS: 'Animals',
		COLORS: 'Colors',
		NUMBERS: 'Numbers',
		FAMILY: 'Family',
		OBJECTS: 'Objects',
		FOOD: 'Food',
		CLOTHING: 'Clothing',
		BODY_PARTS: 'Body Parts',
		WEATHER: 'Weather',
		TIME: 'Time',
		PLACES: 'Places',
		ACTIONS: 'Actions'
	};

	// Difficulty display names
	const difficultyNames: Record<string, string> = {
		BEGINNER: 'Beginner',
		INTERMEDIATE: 'Intermediate',
		ADVANCED: 'Advanced'
	};

	// Difficulty colors
	const difficultyColors: Record<string, string> = {
		BEGINNER: 'bg-success-100 text-success-700',
		INTERMEDIATE: 'bg-warning-100 text-warning-700',
		ADVANCED: 'bg-danger-100 text-danger-700'
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h2 class="text-xl font-semibold text-neutral-900">Select Vocabulary Words</h2>
		<p class="mt-1 text-sm text-neutral-600">
			Choose the words you want to include in this challenge. Selected: {selectedCount} word{selectedCount !==
			1
				? 's'
				: ''}
		</p>
	</div>

	<!-- Search and Filter Bar -->
	<div class="space-y-4">
		<div class="flex flex-col sm:flex-row gap-3">
			<!-- Search Input -->
			<div class="relative flex-1">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search class="h-5 w-5 text-neutral-400" />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search words, translations, or tags..."
					class="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>

			<!-- Filter Toggle Button -->
			<Button
				type="button"
				variant="outline"
				color="primary"
				onclick={() => (showFilters = !showFilters)}
			>
				<Filter class="h-4 w-4 mr-2" />
				Filters
				<ChevronDown
					class={cn('h-4 w-4 ml-2 transition-transform', showFilters ? 'rotate-180' : '')}
				/>
			</Button>
		</div>

		<!-- Filter Panel -->
		{#if showFilters}
			<div class="bg-neutral-50 rounded-lg p-4 space-y-4 border border-neutral-200">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Category Filter -->
					<div>
						<label for="category" class="block text-sm font-medium text-neutral-700 mb-1">
							Category
						</label>
						<select
							id="category"
							bind:value={selectedCategory}
							class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="">All Categories</option>
							{#each categories as category}
								<option value={category}>{categoryNames[category] || category}</option>
							{/each}
						</select>
					</div>

					<!-- Difficulty Filter -->
					<div>
						<label for="difficulty" class="block text-sm font-medium text-neutral-700 mb-1">
							Difficulty
						</label>
						<select
							id="difficulty"
							bind:value={selectedDifficulty}
							class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="">All Difficulties</option>
							{#each difficulties as difficulty}
								<option value={difficulty}>{difficultyNames[difficulty] || difficulty}</option>
							{/each}
						</select>
					</div>

					<!-- Tags Filter -->
					<div>
						<label class="block text-sm font-medium text-neutral-700 mb-1">Tags</label>
						<div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-neutral-300 rounded-lg bg-white">
							{#each allTags as tag}
								<label class="inline-flex items-center">
									<input
										type="checkbox"
										value={tag}
										bind:group={selectedTags}
										class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
									/>
									<span class="ml-2 text-sm text-neutral-700">{tag}</span>
								</label>
							{/each}
						</div>
					</div>
				</div>

				<div class="flex justify-between items-center">
					<button
						type="button"
						onclick={clearFilters}
						class="text-sm text-primary-600 hover:text-primary-700 font-medium"
					>
						Clear Filters
					</button>
					<span class="text-sm text-neutral-600">{totalCount} word{totalCount !== 1 ? 's' : ''} found</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Bulk Actions -->
	{#if filteredWords.length > 0}
		<div class="flex items-center justify-between py-3 px-4 bg-neutral-50 rounded-lg border border-neutral-200">
			<span class="text-sm text-neutral-700">
				{selectedCount} of {totalCount} word{totalCount !== 1 ? 's' : ''} selected
			</span>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={selectAll}
					disabled={selectedCount === totalCount}
					class="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:text-neutral-400 disabled:cursor-not-allowed"
				>
					Select All
				</button>
				<span class="text-neutral-300">|</span>
				<button
					type="button"
					onclick={clearSelection}
					disabled={selectedCount === 0}
					class="text-sm text-danger-600 hover:text-danger-700 font-medium disabled:text-neutral-400 disabled:cursor-not-allowed"
				>
					Clear Selection
				</button>
			</div>
		</div>
	{/if}

	<!-- Words Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each filteredWords as word (word.id)}
			{@const selected = isSelected(word.id)}
			<button
				type="button"
				onclick={() => toggleWord(word)}
				class={cn(
					'relative p-4 border-2 rounded-lg text-left transition-all',
					'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
					selected
						? 'border-primary-500 bg-primary-50'
						: 'border-neutral-200 bg-white hover:border-neutral-300'
				)}
			>
				<!-- Selection Indicator -->
				<div class="absolute top-2 right-2">
					<div
						class={cn(
							'h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors',
							selected
								? 'bg-primary-600 border-primary-600'
								: 'bg-white border-neutral-300'
						)}
					>
						{#if selected}
							<Check class="h-4 w-4 text-white" />
						{/if}
					</div>
				</div>

				<!-- Word Content -->
				<div class="space-y-2 pr-8">
					<div>
						<h3 class="text-lg font-semibold text-neutral-900">{word.word}</h3>
						{#if word.phonetic}
							<p class="text-xs text-neutral-500 italic">{word.phonetic}</p>
						{/if}
					</div>

					<p class="text-sm text-neutral-700">{word.translation}</p>

					<!-- Metadata -->
					<div class="flex items-center gap-2 flex-wrap">
						<span
							class={cn(
								'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
								difficultyColors[word.difficulty] || 'bg-neutral-100 text-neutral-700'
							)}
						>
							{difficultyNames[word.difficulty] || word.difficulty}
						</span>
						<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-700">
							{categoryNames[word.category] || word.category}
						</span>
						{#if word.audioUrl}
							<span class="text-xs text-primary-600">🔊</span>
						{/if}
						{#if word.imageUrl}
							<span class="text-xs text-primary-600">🖼️</span>
						{/if}
					</div>

					<!-- Tags -->
					{#if word.tags.length > 0}
						<div class="flex flex-wrap gap-1">
							{#each word.tags.slice(0, 3) as tag}
								<span class="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
									{tag}
								</span>
							{/each}
							{#if word.tags.length > 3}
								<span class="text-xs text-neutral-500">+{word.tags.length - 3} more</span>
							{/if}
						</div>
					{/if}
				</div>
			</button>
		{:else}
			<div class="col-span-full text-center py-12">
				<p class="text-neutral-500">No words found matching your filters.</p>
				<button
					type="button"
					onclick={clearFilters}
					class="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
				>
					Clear Filters
				</button>
			</div>
		{/each}
	</div>

	<!-- Selected Words Summary -->
	{#if selectedCount > 0}
		<div class="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
			<h3 class="text-sm font-medium text-primary-900 mb-2">Selected Words ({selectedCount}):</h3>
			<div class="flex flex-wrap gap-2">
				{#each selectedWords as word}
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white border border-primary-300 text-primary-700">
						{word.word}
						<button
							type="button"
							onclick={() => toggleWord(word)}
							class="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
						>
							<X class="h-3 w-3" />
						</button>
					</span>
				{/each}
			</div>
		</div>
	{/if}
</div>
