<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button, Card, Input } from '@educational-app/ui';
	import { Plus, Trash2, Eye, Save, ArrowLeft, Library, Edit3, Check } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { notifications } from '@educational-app/ui';
	import { textLibrary, getRecommendedTexts, type TextTemplate } from '$lib/data/typing-text-library';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Initialize form state from challenge data
	let title = $state(data.challenge.title);
	let description = $state(data.challenge.description || '');
	let gradeLevel = $state(data.challenge.gradeLevel);
	let theme = $state<'STORY' | 'POEM' | 'EDUCATIONAL' | 'RHYME' | 'CUSTOM'>(data.challenge.theme);
	let difficulty = $state<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>(data.challenge.difficulty);
	let errorHandling = $state<'BLOCKING' | 'HIGHLIGHTING' | 'SPEED_FOCUSED'>(data.challenge.errorHandling);
	let timerMode = $state<'PER_WORD' | 'GLOBAL' | 'DISABLED'>(data.challenge.timerMode);
	let baseTimePerWord = $state(data.challenge.baseTimePerWord);
	let enableHints = $state(data.challenge.enableHints);
	let enableSounds = $state(data.challenge.enableSounds);
	let showKeyboard = $state(data.challenge.showKeyboard);

	// Text snippets
	interface TextSnippet {
		id?: string;
		content: string;
		orderIndex: number;
	}

	let texts = $state<TextSnippet[]>(
		data.challenge.texts.map((text, index) => ({
			id: text.id,
			content: text.content,
			orderIndex: index
		}))
	);

	let currentTextIndex = $state(0);
	let submitting = $state(false);

	// Text library state
	let selectedTemplateId = $state<string | null>(null);
	let showTextLibrary = $state(true);
	let previewText = $state<TextTemplate | null>(null);

	// Get recommended texts based on current settings
	const recommendedTexts = $derived(
		theme === 'CUSTOM' ? [] : getRecommendedTexts(gradeLevel, theme, difficulty)
	);

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
		texts.splice(index, 1);
		// Reindex
		texts.forEach((text, i) => {
			text.orderIndex = i;
		});
		if (currentTextIndex >= texts.length) {
			currentTextIndex = Math.max(0, texts.length - 1);
		}
	}

	// Select text from library - add as new text snippet
	function selectLibraryText(template: TextTemplate) {
		texts.push({
			content: template.content,
			orderIndex: texts.length
		});
		currentTextIndex = texts.length - 1;
		selectedTemplateId = template.id;
	}

	// Preview text
	function handlePreview() {
		const currentText = texts[currentTextIndex];
		if (currentText && currentText.content.trim()) {
			notifications.success('Preview: ' + currentText.content.substring(0, 50) + '...');
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

	// Handle form submission with enhance
	const handleSubmit: import('svelte/action').SubmitFunction = ({ formData }) => {
		submitting = true;

		// Add texts as JSON to formData
		formData.set('texts', JSON.stringify(texts));

		return async ({ result }) => {
			submitting = false;

			if (result.type === 'redirect') {
				// Success - navigate to detail page (toast will show there via onMount)
				await goto(result.location);
			} else if (result.type === 'failure') {
				notifications.error(result.data?.message || 'Failed to update challenge');
			} else if (result.type === 'error') {
				notifications.error('An error occurred. Please try again.');
			}
		};
	};
</script>

<svelte:head>
	<title>Edit {data.challenge.title} - Teacher Portal</title>
</svelte:head>

<!-- Header -->
<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<div class="flex items-center gap-3 mb-2">
				<a
					href="/typing-challenges/{data.challenge.id}"
					class="text-neutral-500 hover:text-neutral-700 transition-colors"
				>
					<ArrowLeft class="w-5 h-5" />
				</a>
				<h1 class="text-2xl font-bold text-neutral-900">Edit Typing Challenge</h1>
			</div>
			<p class="text-sm text-neutral-500">
				Update your keyboard learning challenge
			</p>
		</div>
	</div>
</div>

<form method="POST" action="?/updateChallenge" use:enhance={handleSubmit}>
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

			<!-- Text Library Selection -->
			{#if theme !== 'CUSTOM'}
				<Card variant="outlined" padding="lg">
					<div class="flex items-center justify-between mb-4">
						<div>
							<h2 class="text-lg font-semibold text-neutral-900 flex items-center gap-2">
								<Library class="w-5 h-5 text-primary-600" />
								Text Library
							</h2>
							<p class="text-xs text-neutral-500 mt-1">
								Select pre-written texts that match your challenge settings
							</p>
						</div>
						<button
							type="button"
							onclick={() => (showTextLibrary = !showTextLibrary)}
							class="text-sm text-primary-600 hover:text-primary-700 font-medium"
						>
							{showTextLibrary ? 'Hide' : 'Show'} Library
						</button>
					</div>

					{#if showTextLibrary}
						{#if recommendedTexts.length > 0}
							<div class="space-y-2">
								<div class="text-xs text-neutral-600 mb-3">
									Found {recommendedTexts.length} text{recommendedTexts.length !== 1 ? 's' : ''} for
									<span class="font-medium">{theme}</span> ·
									<span class="font-medium">{difficulty}</span> ·
									<span class="font-medium">Grade {gradeLevel}</span>
								</div>

								<div class="grid gap-3 max-h-96 overflow-y-auto">
									{#each recommendedTexts as template}
										<div
											class={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
												selectedTemplateId === template.id
													? 'border-primary-500 bg-primary-50'
													: 'border-neutral-200 bg-white hover:border-neutral-300'
											}`}
											onclick={() => selectLibraryText(template)}
											role="button"
											tabindex="0"
											onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectLibraryText(template); } }}
										>
											<div class="flex items-start gap-3">
												<div class="flex-1 min-w-0">
													<div class="flex items-center gap-2 mb-1">
														<h4 class="text-sm font-semibold text-neutral-900">
															{template.title}
														</h4>
														<span class="text-xs text-neutral-500">
															{template.wordCount} words
														</span>
													</div>

													<p class="text-xs text-neutral-600 line-clamp-2 mb-2">
														{template.content}
													</p>

													<div class="flex items-center gap-2 flex-wrap">
														{#if template.hasUmlauts}
															<span class="text-xs px-2 py-0.5 bg-info-100 text-info-700 rounded">
																Umlauts
															</span>
														{/if}
														{#if template.hasNumbers}
															<span class="text-xs px-2 py-0.5 bg-info-100 text-info-700 rounded">
																Numbers
															</span>
														{/if}
														{#if template.hasPunctuation}
															<span class="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
																Punctuation
															</span>
														{/if}
													</div>
												</div>

												<button
													type="button"
													onclick={(e) => {
														e.stopPropagation();
														previewText = template;
													}}
													class="flex-shrink-0 p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
													aria-label="Preview {template.title}"
												>
													<Eye class="w-4 h-4" />
												</button>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div class="text-center py-8 text-neutral-500">
								<Library class="w-12 h-12 mx-auto mb-2 opacity-50" />
								<p class="text-sm">No pre-written texts available for these settings</p>
								<p class="text-xs mt-1">Try changing the theme, difficulty, or grade level</p>
							</div>
						{/if}
					{/if}
				</Card>
			{/if}

			<!-- Text Content -->
			<Card variant="outlined" padding="lg">
				<div class="flex items-center justify-between mb-4">
					<div>
						<h2 class="text-lg font-semibold text-neutral-900 flex items-center gap-2">
							<Edit3 class="w-5 h-5 text-primary-600" />
							Text Snippets
						</h2>
						<p class="text-xs text-neutral-500 mt-1">
							Edit the text content for this challenge
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onclick={addText}
					>
						<Plus class="w-4 h-4 mr-1" />
						Add Text
					</Button>
				</div>

				{#if texts.length > 0}
					<!-- Text Tabs -->
					<div class="flex gap-2 mb-4 overflow-x-auto pb-2">
						{#each texts as text, index}
							<div
								class={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
									currentTextIndex === index
										? 'border-primary-500 bg-primary-50 text-primary-700'
										: 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
								}`}
								onclick={() => (currentTextIndex = index)}
								role="tab"
								tabindex="0"
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') currentTextIndex = index; }}
							>
								<span class="font-medium">Text {index + 1}</span>
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										removeText(index);
									}}
									class="text-danger-500 hover:text-danger-700"
									aria-label="Remove text {index + 1}"
								>
									<Trash2 class="w-4 h-4" />
								</button>
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
									<span>{texts[currentTextIndex]?.content.trim().split(/\s+/).filter(w => w.length > 0).length || 0} words</span>
									<span>{texts[currentTextIndex]?.content.length || 0} characters</span>
									{#if texts[currentTextIndex] && /[äöüÄÖÜß]/.test(texts[currentTextIndex].content)}
										<span class="text-info-600">Contains umlauts</span>
									{/if}
								</div>
								<Button variant="outline" size="sm" onclick={handlePreview}>
									<Eye class="w-3 h-3 mr-1" />
									Preview
								</Button>
							</div>
						</div>
					{/if}
				{:else}
					<div class="text-center py-8 text-neutral-500">
						<Edit3 class="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p class="text-sm font-medium">No texts available</p>
						<p class="text-xs mt-1">At least one text is required</p>
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
						disabled={submitting || !title || texts.length === 0}
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
								Saving...
							</span>
						{:else}
							<Save class="w-4 h-4 mr-2" />
							Save Changes
						{/if}
					</Button>

					<Button
						type="button"
						variant="ghost"
						class="w-full"
						onclick={() => (window.location.href = `/typing-challenges/${data.challenge.id}`)}
					>
						Cancel
					</Button>
				</div>
			</Card>
		</div>
	</div>
</form>

<!-- Preview Modal -->
{#if previewText}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
		onclick={() => (previewText = null)}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="p-6 border-b border-neutral-200">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold text-neutral-900">{previewText.title}</h3>
					<button
						type="button"
						onclick={() => (previewText = null)}
						class="text-neutral-500 hover:text-neutral-700"
						aria-label="Close preview"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<div class="p-6 overflow-y-auto max-h-[60vh]">
				<div class="mb-4 flex items-center gap-2 flex-wrap">
					<span class="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
						{previewText.theme}
					</span>
					<span class="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded">
						{previewText.difficulty}
					</span>
					<span class="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
						Grade {previewText.gradeLevel}
					</span>
					<span class="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
						{previewText.wordCount} words
					</span>
					{#if previewText.hasUmlauts}
						<span class="text-xs px-2 py-1 bg-info-100 text-info-700 rounded">
							Umlauts
						</span>
					{/if}
				</div>

				<div class="p-4 bg-neutral-50 rounded-lg border border-neutral-200 font-mono text-sm text-neutral-800 leading-relaxed">
					{previewText.content}
				</div>
			</div>

			<div class="p-6 border-t border-neutral-200 flex justify-end gap-2">
				<Button
					variant="ghost"
					size="md"
					onclick={() => (previewText = null)}
				>
					Close
				</Button>
				<Button
					variant="solid"
					color="primary"
					size="md"
					onclick={() => {
						selectLibraryText(previewText);
						previewText = null;
					}}
				>
					Add as New Text
				</Button>
			</div>
		</div>
	</div>
{/if}
