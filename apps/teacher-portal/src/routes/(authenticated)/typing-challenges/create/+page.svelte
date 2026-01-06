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

	// Single text content
	let textContent = $state('');
	let selectedTemplateId = $state<string | null>(null);
	let showTextLibrary = $state(true);
	let submitting = $state(false);
	let previewText = $state<TextTemplate | null>(null);

	// Get recommended texts based on current settings
	const recommendedTexts = $derived(
		theme === 'CUSTOM' ? [] : getRecommendedTexts(gradeLevel, theme, difficulty)
	);

	// Select text from library - populate into textarea
	function selectLibraryText(template: TextTemplate) {
		// Simply populate the textarea with the selected text
		textContent = template.content;
		selectedTemplateId = template.id;
	}

	// Preview text
	function handlePreview() {
		if (textContent.trim()) {
			// TODO: Show preview modal
			notifications.success('Preview: ' + textContent.substring(0, 50) + '...');
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

	// Calculate stats for single text
	const wordCount = $derived(
		textContent.trim().split(/\s+/).filter(w => w.length > 0).length
	);

	const characterCount = $derived(textContent.length);

	const hasUmlauts = $derived(/[äöüÄÖÜß]/.test(textContent));

	// Handle form submission with enhance
	function handleSubmit({ formData }: { formData: FormData }) {
		console.log('[Create Challenge] Form submitting...');
		submitting = true;

		// Add single text as JSON array with one item
		formData.set('texts', JSON.stringify([{
			content: textContent,
			orderIndex: 0,
			isCustom: true
		}]));

		return async ({ result }: { result: any }) => {
			console.log('[Create Challenge] Result:', result);
			submitting = false;

			if (result.type === 'redirect') {
				console.log('[Create Challenge] Redirecting to:', result.location);
				// Use goto to navigate to the detail page
				await goto(result.location);
			} else if (result.type === 'failure') {
				console.log('[Create Challenge] Failure:', result.data);
				notifications.error(result.data?.message || 'Failed to create challenge');
			} else if (result.type === 'error') {
				console.log('[Create Challenge] Error:', result);
				notifications.error('An error occurred. Please try again.');
			}
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
				<div class="mb-4">
					<h2 class="text-lg font-semibold text-neutral-900 flex items-center gap-2">
						<Edit3 class="w-5 h-5 text-primary-600" />
						Text Content
					</h2>
					<p class="text-xs text-neutral-500 mt-1">
						Select a text from the library above, or enter your own custom text below
					</p>
				</div>

				<!-- Single Text Editor -->
				<div class="space-y-3">
					<textarea
						bind:value={textContent}
						rows="8"
						class="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
						placeholder="Enter the text for students to type..."
					></textarea>

					<div class="flex items-center justify-between text-xs text-neutral-500">
						<div class="flex gap-4">
							<span>{wordCount} words</span>
							<span>{characterCount} characters</span>
							{#if hasUmlauts}
								<span class="text-info-600">Contains umlauts</span>
							{/if}
						</div>
						{#if textContent.trim()}
							<Button variant="outline" size="sm" onclick={handlePreview}>
								<Eye class="w-3 h-3 mr-1" />
								Preview
							</Button>
						{/if}
					</div>
				</div>
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
						<span class="text-neutral-600">Words:</span>
						<span class="font-medium text-neutral-900">{wordCount}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-600">Characters:</span>
						<span class="font-medium text-neutral-900">{characterCount}</span>
					</div>
					{#if hasUmlauts}
						<div class="flex justify-between">
							<span class="text-neutral-600">Special Chars:</span>
							<span class="font-medium text-info-600">Umlauts included</span>
						</div>
					{/if}
				</div>

				<div class="mt-6 pt-6 border-t border-neutral-200 space-y-2">
					<button
						type="submit"
						class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-base bg-primary-500 hover:bg-primary-600 text-white border border-transparent rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={submitting || !title || !textContent.trim()}
					>
						{#if submitting}
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
						{:else}
							<Save class="w-4 h-4 mr-2" />
							Create Challenge
						{/if}
					</button>

					<Button
						type="button"
						variant="ghost"
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
					Select Text
				</Button>
			</div>
		</div>
	</div>
{/if}
