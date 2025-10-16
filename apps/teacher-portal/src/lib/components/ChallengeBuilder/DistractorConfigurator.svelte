<script lang="ts">
	import { Settings, Sparkles, RefreshCw, Plus, X, ChevronDown } from 'lucide-svelte';
	import { Button, notifications, cn } from '@educational-app/ui';

	interface VocabularyWord {
		id: string;
		word: string;
		translation: string;
		category: string;
		difficulty: string;
	}

	interface ExerciseConfig {
		type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'SPELLING' | 'MATCHING';
		difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
		timeLimit?: number;
		attemptsAllowed: number;
		enableHints: boolean;
		enableExplanations: boolean;
	}

	interface DistractorConfig {
		types: readonly ('PHONETIC' | 'VISUAL' | 'SEMANTIC' | 'GRAMMATICAL')[];
		count: number;
		difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
		customDistractors: Map<string, string[]>;
	}

	interface Props {
		selectedWords: VocabularyWord[];
		exerciseConfig?: ExerciseConfig;
		distractorConfig?: DistractorConfig;
		onchange?: () => void;
	}

	let {
		selectedWords,
		exerciseConfig = $bindable({
			type: 'MULTIPLE_CHOICE',
			difficulty: 'BEGINNER',
			timeLimit: 300,
			attemptsAllowed: 3,
			enableHints: true,
			enableExplanations: true
		}),
		distractorConfig = $bindable({
			types: ['SEMANTIC', 'PHONETIC'],
			count: 3,
			difficulty: 'BEGINNER',
			customDistractors: new Map()
		}),
		onchange
	}: Props = $props();

	// Local state
	let expandedWordId = $state<string | null>(null);
	let generatingDistractors = $state(false);
	let customDistractorInput = $state<Record<string, string>>({});

	// Exercise type options
	const exerciseTypes = [
		{
			value: 'MULTIPLE_CHOICE',
			label: 'Multiple Choice',
			description: 'Select the correct translation from options',
			icon: '☑️'
		},
		{
			value: 'FILL_BLANK',
			label: 'Fill in the Blank',
			description: 'Complete sentences with missing words',
			icon: '📝'
		},
		{
			value: 'SPELLING',
			label: 'Spelling',
			description: 'Type the correct spelling of the word',
			icon: '✏️'
		},
		{
			value: 'MATCHING',
			label: 'Matching',
			description: 'Match words with their translations',
			icon: '🔗'
		}
	];

	// Distractor type options
	const distractorTypes = [
		{
			value: 'SEMANTIC',
			label: 'Semantic',
			description: 'Similar meaning (synonyms, related words)',
			color: 'bg-blue-100 text-blue-700'
		},
		{
			value: 'PHONETIC',
			label: 'Phonetic',
			description: 'Similar sound (rhymes, homophones)',
			color: 'bg-purple-100 text-purple-700'
		},
		{
			value: 'VISUAL',
			label: 'Visual',
			description: 'Similar appearance (look-alikes)',
			color: 'bg-green-100 text-green-700'
		},
		{
			value: 'GRAMMATICAL',
			label: 'Grammatical',
			description: 'Similar structure (same word class)',
			color: 'bg-orange-100 text-orange-700'
		}
	];

	// Derived values
	const needsDistractors = $derived(
		exerciseConfig.type === 'MULTIPLE_CHOICE' || exerciseConfig.type === 'MATCHING'
	);

	// Actions
	function toggleWord(wordId: string) {
		expandedWordId = expandedWordId === wordId ? null : wordId;
	}

	function toggleDistractorType(type: string) {
		const types = [...distractorConfig.types];
		const index = types.indexOf(type as any);

		if (index > -1) {
			types.splice(index, 1);
		} else {
			types.push(type as any);
		}

		distractorConfig = { ...distractorConfig, types: types as any };
		onchange?.();
	}

	async function generateDistractors(wordId?: string) {
		generatingDistractors = true;

		try {
			// TODO: Call API to generate distractors using language provider
			// For now, simulate with mock data
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const wordsToGenerate = wordId
				? selectedWords.filter(w => w.id === wordId)
				: selectedWords;

			for (const word of wordsToGenerate) {
				if (!distractorConfig.customDistractors.has(word.id)) {
					// Mock distractor generation
					const mockDistractors = [
						`${word.translation} (mock 1)`,
						`${word.translation} (mock 2)`,
						`${word.translation} (mock 3)`
					];
					distractorConfig.customDistractors.set(word.id, mockDistractors);
				}
			}

			distractorConfig = { ...distractorConfig };
			notifications.success(wordId ? 'Distractors generated' : 'All distractors generated');
			onchange?.();
		} catch (error) {
			notifications.error('Failed to generate distractors');
			console.error(error);
		} finally {
			generatingDistractors = false;
		}
	}

	function addCustomDistractor(wordId: string) {
		const input = customDistractorInput[wordId]?.trim();
		if (!input) return;

		const existing = distractorConfig.customDistractors.get(wordId) || [];
		distractorConfig.customDistractors.set(wordId, [...existing, input]);
		distractorConfig = { ...distractorConfig };
		customDistractorInput[wordId] = '';
		onchange?.();
	}

	function removeDistractor(wordId: string, index: number) {
		const existing = distractorConfig.customDistractors.get(wordId) || [];
		existing.splice(index, 1);
		distractorConfig.customDistractors.set(wordId, existing);
		distractorConfig = { ...distractorConfig };
		onchange?.();
	}

	function handleKeyPress(event: KeyboardEvent, wordId: string) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addCustomDistractor(wordId);
		}
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h2 class="text-xl font-semibold text-neutral-900">Configure Exercise</h2>
		<p class="mt-1 text-sm text-neutral-600">
			Choose the exercise type and configure distractor generation options.
		</p>
	</div>

	<!-- Exercise Type Selection -->
	<div class="space-y-3">
		<h3 class="text-sm font-medium text-neutral-900">Exercise Type</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			{#each exerciseTypes as type}
				<button
					type="button"
					onclick={() => {
						exerciseConfig.type = type.value as any;
						onchange?.();
					}}
					class={cn(
						'relative p-4 border-2 rounded-lg text-left transition-all',
						'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
						exerciseConfig.type === type.value
							? 'border-primary-500 bg-primary-50'
							: 'border-neutral-200 bg-white hover:border-neutral-300'
					)}
				>
					<div class="flex items-start space-x-3">
						<span class="text-2xl">{type.icon}</span>
						<div class="flex-1">
							<h4 class="text-sm font-semibold text-neutral-900">{type.label}</h4>
							<p class="mt-1 text-xs text-neutral-600">{type.description}</p>
						</div>
						{#if exerciseConfig.type === type.value}
							<div class="h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center">
								<span class="text-white text-xs">✓</span>
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Exercise Settings -->
	<div class="space-y-4">
		<h3 class="text-sm font-medium text-neutral-900">Exercise Settings</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Difficulty -->
			<div>
				<label for="difficulty" class="block text-sm font-medium text-neutral-700 mb-1">
					Difficulty Level
				</label>
				<select
					id="difficulty"
					bind:value={exerciseConfig.difficulty}
					onchange={onchange}
					class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="BEGINNER">Beginner</option>
					<option value="INTERMEDIATE">Intermediate</option>
					<option value="ADVANCED">Advanced</option>
				</select>
			</div>

			<!-- Time Limit -->
			<div>
				<label for="timeLimit" class="block text-sm font-medium text-neutral-700 mb-1">
					Time Limit (seconds)
				</label>
				<input
					type="number"
					id="timeLimit"
					bind:value={exerciseConfig.timeLimit}
					onchange={onchange}
					min="0"
					max="600"
					step="30"
					class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>

			<!-- Attempts Allowed -->
			<div>
				<label for="attempts" class="block text-sm font-medium text-neutral-700 mb-1">
					Attempts Allowed
				</label>
				<input
					type="number"
					id="attempts"
					bind:value={exerciseConfig.attemptsAllowed}
					onchange={onchange}
					min="1"
					max="10"
					class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				/>
			</div>
		</div>

		<!-- Toggles -->
		<div class="flex flex-col space-y-3">
			<label class="flex items-center space-x-3 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={exerciseConfig.enableHints}
					onchange={onchange}
					class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
				/>
				<span class="text-sm text-neutral-700">Enable hints for students</span>
			</label>
			<label class="flex items-center space-x-3 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={exerciseConfig.enableExplanations}
					onchange={onchange}
					class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
				/>
				<span class="text-sm text-neutral-700">Show explanations after completion</span>
			</label>
		</div>
	</div>

	<!-- Distractor Configuration (only for MC and Matching) -->
	{#if needsDistractors}
		<div class="space-y-4 border-t pt-6">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-sm font-medium text-neutral-900">Distractor Configuration</h3>
					<p class="mt-1 text-xs text-neutral-600">
						Configure how incorrect answer options are generated.
					</p>
				</div>
				<Button
					type="button"
					variant="solid"
					color="primary"
					size="sm"
					onclick={() => generateDistractors()}
					disabled={generatingDistractors}
					loading={generatingDistractors}
				>
					<Sparkles class="h-4 w-4 mr-2" />
					Generate All
				</Button>
			</div>

			<!-- Distractor Types -->
			<div>
				<label class="block text-sm font-medium text-neutral-700 mb-2">
					Distractor Types (select one or more)
				</label>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
					{#each distractorTypes as type}
						<button
							type="button"
							onclick={() => toggleDistractorType(type.value)}
							class={cn(
								'p-3 border-2 rounded-lg text-left transition-all',
								'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
								distractorConfig.types.includes(type.value as any)
									? 'border-primary-500 bg-primary-50'
									: 'border-neutral-200 bg-white hover:border-neutral-300'
							)}
						>
							<div class="text-xs font-semibold text-neutral-900">{type.label}</div>
							<div class="mt-1 text-xs text-neutral-600">{type.description}</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Distractor Count -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="distractorCount" class="block text-sm font-medium text-neutral-700 mb-1">
						Number of Distractors per Word
					</label>
					<input
						type="number"
						id="distractorCount"
						bind:value={distractorConfig.count}
						onchange={onchange}
						min="2"
						max="5"
						class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				<div>
					<label for="distractorDifficulty" class="block text-sm font-medium text-neutral-700 mb-1">
						Distractor Difficulty
					</label>
					<select
						id="distractorDifficulty"
						bind:value={distractorConfig.difficulty}
						onchange={onchange}
						class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="BEGINNER">Easy (obvious differences)</option>
						<option value="INTERMEDIATE">Medium (moderate similarity)</option>
						<option value="ADVANCED">Hard (very similar)</option>
					</select>
				</div>
			</div>

			<!-- Per-Word Distractor Management -->
			<div class="space-y-3">
				<h4 class="text-sm font-medium text-neutral-900">Customize Distractors per Word</h4>
				<div class="space-y-2">
					{#each selectedWords as word}
						{@const isExpanded = expandedWordId === word.id}
						{@const customDistractors = distractorConfig.customDistractors.get(word.id) || []}

						<div class="border border-neutral-200 rounded-lg overflow-hidden">
							<button
								type="button"
								onclick={() => toggleWord(word.id)}
								class="w-full px-4 py-3 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors"
							>
								<div class="flex items-center space-x-3">
									<span class="font-medium text-neutral-900">{word.word}</span>
									<span class="text-sm text-neutral-600">→ {word.translation}</span>
									{#if customDistractors.length > 0}
										<span class="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
											{customDistractors.length} custom
										</span>
									{/if}
								</div>
								<div class="flex items-center space-x-2">
									<Button
										type="button"
										variant="ghost"
										color="primary"
										size="sm"
										onclick={(e: Event) => {
											e.stopPropagation();
											generateDistractors(word.id);
										}}
										disabled={generatingDistractors}
									>
										<RefreshCw class={cn('h-3 w-3', generatingDistractors ? 'animate-spin' : '')} />
									</Button>
									<ChevronDown
										class={cn(
											'h-5 w-5 text-neutral-400 transition-transform',
											isExpanded ? 'rotate-180' : ''
										)}
									/>
								</div>
							</button>

							{#if isExpanded}
								<div class="p-4 bg-white space-y-3">
									<!-- Custom distractors list -->
									{#if customDistractors.length > 0}
										<div class="space-y-2">
											{#each customDistractors as distractor, index}
												<div class="flex items-center space-x-2 p-2 bg-neutral-50 rounded">
													<span class="flex-1 text-sm text-neutral-700">{distractor}</span>
													<button
														type="button"
														onclick={() => removeDistractor(word.id, index)}
														class="text-danger-600 hover:text-danger-700"
													>
														<X class="h-4 w-4" />
													</button>
												</div>
											{/each}
										</div>
									{/if}

									<!-- Add custom distractor -->
									<div class="flex space-x-2">
										<input
											type="text"
											bind:value={customDistractorInput[word.id]}
											onkeypress={(e) => handleKeyPress(e, word.id)}
											placeholder="Add custom distractor..."
											class="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
										/>
										<Button
											type="button"
											variant="outline"
											color="primary"
											size="sm"
											onclick={() => addCustomDistractor(word.id)}
											disabled={!customDistractorInput[word.id]?.trim()}
										>
											<Plus class="h-4 w-4" />
										</Button>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
