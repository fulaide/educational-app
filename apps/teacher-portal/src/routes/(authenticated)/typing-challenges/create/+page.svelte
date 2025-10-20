<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Input } from '@educational-app/ui';
	import { Plus, Trash2, Eye, Save, ArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { notifications } from '@educational-app/ui';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Form state
	let title = $state('');
	let description = $state('');
	let gradeLevel = $state(1);
	let theme = $state<'STORY' | 'POEM' | 'EDUCATIONAL' | 'RHYME' | 'CUSTOM'>('STORY');
	let difficulty = $state<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
	let errorHandling = $state<'BLOCKING' | 'HIGHLIGHTING' | 'SPEED_FOCUSED'>('BLOCKING');
	let timerMode = $state<'PER_WORD' | 'GLOBAL' | 'DISABLED'>('PER_WORD');
	let baseTimePerWord = $state(7000);
	let enableHints = $state(true);
	let enableSounds = $state(true);
	let showKeyboard = $state(true);

	// Text snippets
	interface TextSnippet {
		content: string;
		orderIndex: number;
	}

	let texts = $state<TextSnippet[]>([{ content: '', orderIndex: 0 }]);
	let currentTextIndex = $state(0);
	let previewText = $state('');
	let submitting = $state(false);

	// Add new text snippet
	function addText() {
		texts.push({
			content: '',
			orderIndex: texts.length
		});
		currentTextIndex = texts.length - 1;
	}

	// Remove text snippet
	function removeText(index: number) {
		if (texts.length > 1) {
			texts.splice(index, 1);
			// Reindex
			texts.forEach((text, i) => {
				text.orderIndex = i;
			});
			if (currentTextIndex >= texts.length) {
				currentTextIndex = texts.length - 1;
			}
		} else {
			notifications.error('At least one text snippet is required');
		}
	}

	// Preview text
	function handlePreview() {
		const currentText = texts[currentTextIndex];
		if (currentText && currentText.content) {
			previewText = currentText.content;
		} else {
			notifications.error('Please enter some text to preview');
		}
	}

	// Get recommended error handling mode based on grade
	const recommendedErrorHandling = $derived.by(() => {
		if (gradeLevel <= 2) return 'BLOCKING';
		if (gradeLevel === 3) return 'HIGHLIGHTING';
		return 'SPEED_FOCUSED';
	});

	// Get recommended timer mode based on grade
	const recommendedTimerMode = $derived.by(() => {
		if (gradeLevel === 1) return 'DISABLED';
		return 'PER_WORD';
	});

	// Calculate total stats
	const totalWords = $derived(
		texts.reduce((sum, text) => {
			const words = text.content.trim().split(/\s+/).filter(w => w.length > 0);
			return sum + words.length;
		}, 0)
	);

	const totalCharacters = $derived(
		texts.reduce((sum, text) => sum + text.content.length, 0)
	);

	const hasUmlauts = $derived(
		texts.some(text => /[äöüÄÖÜß]/.test(text.content))
	);

	// Handle form submission
	function handleSubmit(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// Add texts as JSON
		formData.set('texts', JSON.stringify(texts));

		submitting = true;

		return async ({ result, update }: any) => {
			submitting = false;

			if (result.type === 'success') {
				notifications.success('Typing challenge created successfully!');
			} else if (result.type === 'failure') {
				notifications.error(result.data?.message || 'Failed to create challenge');
			}

			await update();
		};
	}
</script>

<svelte:head>
	<title>Create Typing Challenge - Teacher Portal</title>
</svelte:head>

<!-- Header -->
<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<div class="flex items-center gap-3 mb-2">
				<a
					href="/typing-challenges"
					class="text-neutral-500 hover:text-neutral-700 transition-colors"
				>
					<ArrowLeft class="w-5 h-5" />
				</a>
				<h1 class="text-2xl font-bold text-neutral-900">Create Typing Challenge</h1>
			</div>
			<p class="text-sm text-neutral-500">
				Design a new keyboard learning challenge for your students
			</p>
		</div>
	</div>
</div>

<form method="POST" action="?/createChallenge" use:enhance={handleSubmit}>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left Column: Configuration -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Basic Information -->
			<Card variant="outlined" padding="lg">
				<h2 class="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>

				<div class="space-y-4">
					<div>
						<label for="title" class="block text-sm font-medium text-neutral-700 mb-2">
							Challenge Title *
						</label>
						<Input
							id="title"
							name="title"
							type="text"
							bind:value={title}
							placeholder="e.g., Home Row Practice"
							required
						/>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium text-neutral-700 mb-2">
							Description (Optional)
						</label>
						<textarea
							id="description"
							name="description"
							bind:value={description}
							rows="3"
							class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
							placeholder="Brief description of this challenge..."
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="gradeLevel" class="block text-sm font-medium text-neutral-700 mb-2">
								Grade Level *
							</label>
							<select
								id="gradeLevel"
								name="gradeLevel"
								bind:value={gradeLevel}
								class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
							>
								<option value={1}>Grade 1</option>
								<option value={2}>Grade 2</option>
								<option value={3}>Grade 3</option>
								<option value={4}>Grade 4</option>
							</select>
						</div>

						<div>
							<label for="difficulty" class="block text-sm font-medium text-neutral-700 mb-2">
								Difficulty *
							</label>
							<select
								id="difficulty"
								name="difficulty"
								bind:value={difficulty}
								class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
							>
								<option value="BEGINNER">Beginner</option>
								<option value="INTERMEDIATE">Intermediate</option>
								<option value="ADVANCED">Advanced</option>
							</select>
						</div>
					</div>

					<div>
						<label for="theme" class="block text-sm font-medium text-neutral-700 mb-2">
							Theme *
						</label>
						<select
							id="theme"
							name="theme"
							bind:value={theme}
							class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="STORY">Story (Geschichten)</option>
							<option value="POEM">Poem (Gedichte)</option>
							<option value="EDUCATIONAL">Educational (Wissenstexte)</option>
							<option value="RHYME">Rhyme (Reime)</option>
							<option value="CUSTOM">Custom</option>
						</select>
					</div>
				</div>
			</Card>

			<!-- Challenge Settings -->
			<Card variant="outlined" padding="lg">
				<h2 class="text-lg font-semibold text-neutral-900 mb-4">Challenge Settings</h2>

				<div class="space-y-4">
					<div>
						<label for="errorHandling" class="block text-sm font-medium text-neutral-700 mb-2">
							Error Handling Mode *
						</label>
						<select
							id="errorHandling"
							name="errorHandling"
							bind:value={errorHandling}
							class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="BLOCKING">Blocking (Best for Grades 1-2)</option>
							<option value="HIGHLIGHTING">Highlighting (Best for Grade 3)</option>
							<option value="SPEED_FOCUSED">Speed Focused (Best for Grade 4)</option>
						</select>
						{#if errorHandling !== recommendedErrorHandling}
							<p class="mt-1 text-xs text-warning-600">
								💡 Recommended: {recommendedErrorHandling} for Grade {gradeLevel}
							</p>
						{/if}
					</div>

					<div>
						<label for="timerMode" class="block text-sm font-medium text-neutral-700 mb-2">
							Timer Mode *
						</label>
						<select
							id="timerMode"
							name="timerMode"
							bind:value={timerMode}
							class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="PER_WORD">Per Word (with bonus time)</option>
							<option value="GLOBAL">Global Timer</option>
							<option value="DISABLED">No Timer</option>
						</select>
						{#if timerMode !== recommendedTimerMode && gradeLevel === 1}
							<p class="mt-1 text-xs text-warning-600">
								💡 Recommended: DISABLED timer for Grade 1
							</p>
						{/if}
					</div>

					{#if timerMode === 'PER_WORD'}
						<div>
							<label for="baseTimePerWord" class="block text-sm font-medium text-neutral-700 mb-2">
								Time Per Word (seconds)
							</label>
							<div class="flex items-center gap-4">
								<input
									id="baseTimePerWord"
									name="baseTimePerWord"
									type="range"
									min="3000"
									max="20000"
									step="1000"
									bind:value={baseTimePerWord}
									class="flex-1"
								/>
								<span class="text-sm font-medium text-neutral-900 w-16">
									{(baseTimePerWord / 1000).toFixed(1)}s
								</span>
							</div>
						</div>
					{/if}

					<div class="space-y-2">
						<label class="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								name="enableHints"
								bind:checked={enableHints}
								value="true"
								class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
							/>
							<span class="text-sm text-neutral-700">Enable progressive hints</span>
						</label>

						<label class="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								name="enableSounds"
								bind:checked={enableSounds}
								value="true"
								class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
							/>
							<span class="text-sm text-neutral-700">Enable sound effects</span>
						</label>

						<label class="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								name="showKeyboard"
								bind:checked={showKeyboard}
								value="true"
								class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
							/>
							<span class="text-sm text-neutral-700">Show virtual keyboard</span>
						</label>
					</div>
				</div>
			</Card>

			<!-- Text Content -->
			<Card variant="outlined" padding="lg">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-neutral-900">Text Content</h2>
					<Button variant="soft" color="primary" size="sm" onclick={addText}>
						<Plus class="w-4 h-4 mr-1" />
						Add Text
					</Button>
				</div>

				<!-- Text Tabs -->
				<div class="flex gap-2 mb-4 overflow-x-auto pb-2">
					{#each texts as text, index}
						<div
							class={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
								currentTextIndex === index
									? 'border-primary-500 bg-primary-50 text-primary-700'
									: 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
							}`}
						>
							<span class="font-medium" onclick={() => (currentTextIndex = index)}>Text {index + 1}</span>
							{#if texts.length > 1}
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										removeText(index);
									}}
									class="text-danger-500 hover:text-danger-700"
								>
									<Trash2 class="w-4 h-4" />
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<!-- Current Text Editor -->
				{#if texts[currentTextIndex]}
					<div class="space-y-3">
						<textarea
							bind:value={texts[currentTextIndex].content}
							rows="6"
							class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
							placeholder="Enter the text for students to type..."
						></textarea>

						<div class="flex items-center justify-between text-xs text-neutral-500">
							<div class="flex gap-4">
								<span>{texts[currentTextIndex].content.trim().split(/\s+/).filter(w => w.length > 0).length} words</span>
								<span>{texts[currentTextIndex].content.length} characters</span>
								{#if /[äöüÄÖÜß]/.test(texts[currentTextIndex].content)}
									<span class="text-info-600">Contains umlauts</span>
								{/if}
							</div>
							<Button variant="outlined" size="sm" onclick={handlePreview}>
								<Eye class="w-3 h-3 mr-1" />
								Preview
							</Button>
						</div>
					</div>
				{/if}
			</Card>
		</div>

		<!-- Right Column: Summary & Actions -->
		<div class="space-y-6">
			<!-- Summary Card -->
			<Card variant="elevated" padding="lg" class="sticky top-6">
				<h3 class="text-lg font-semibold text-neutral-900 mb-4">Challenge Summary</h3>

				<div class="space-y-3 text-sm">
					<div class="flex justify-between">
						<span class="text-neutral-600">Grade Level:</span>
						<span class="font-medium text-neutral-900">Grade {gradeLevel}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-600">Difficulty:</span>
						<span class="font-medium text-neutral-900">{difficulty}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-600">Total Texts:</span>
						<span class="font-medium text-neutral-900">{texts.length}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-600">Total Words:</span>
						<span class="font-medium text-neutral-900">{totalWords}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-600">Characters:</span>
						<span class="font-medium text-neutral-900">{totalCharacters}</span>
					</div>
					{#if hasUmlauts}
						<div class="flex justify-between">
							<span class="text-neutral-600">Special Chars:</span>
							<span class="font-medium text-info-600">Umlauts included</span>
						</div>
					{/if}
				</div>

				<div class="mt-6 pt-6 border-t border-neutral-200 space-y-2">
					<Button
						type="submit"
						variant="solid"
						color="primary"
						class="w-full"
						disabled={submitting || !title || totalWords === 0}
					>
						{#if submitting}
							<span class="flex items-center justify-center">
								<svg
									class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Creating...
							</span>
						{:else}
							<Save class="w-4 h-4 mr-2" />
							Create Challenge
						{/if}
					</Button>

					<Button
						type="button"
						variant="outlined"
						color="neutral"
						class="w-full"
						onclick={() => (window.location.href = '/typing-challenges')}
					>
						Cancel
					</Button>
				</div>
			</Card>
		</div>
	</div>
</form>
