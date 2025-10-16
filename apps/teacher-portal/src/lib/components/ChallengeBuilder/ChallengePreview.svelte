<script lang="ts">
	import { Eye, Clock, Users, Calendar, Target, BookOpen } from 'lucide-svelte';
	import { cn } from '@educational-app/ui';

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
		types: readonly string[];
		count: number;
		difficulty: string;
		customDistractors: Map<string, string[]>;
	}

	interface AssignmentConfig {
		classIds: string[];
		studentIds: string[];
		availableFrom?: string;
		availableUntil?: string;
	}

	interface Class {
		id: string;
		name: string;
		grade: number;
		students: any[];
	}

	interface Props {
		selectedWords: VocabularyWord[];
		exerciseConfig: ExerciseConfig;
		distractorConfig: DistractorConfig;
		assignmentConfig: AssignmentConfig;
		classes: Class[];
	}

	let {
		selectedWords,
		exerciseConfig,
		distractorConfig,
		assignmentConfig,
		classes
	}: Props = $props();

	// Example preview for multiple choice
	let previewWordIndex = $state(0);

	// Computed values
	const previewWord = $derived(selectedWords[previewWordIndex]);

	const assignedClasses = $derived(
		classes.filter((c) => assignmentConfig.classIds.includes(c.id))
	);

	const totalStudents = $derived(
		assignedClasses.reduce((sum, c) => sum + c.students.length, 0) +
			assignmentConfig.studentIds.length
	);

	const estimatedDuration = $derived(
		Math.ceil((selectedWords.length * (exerciseConfig.timeLimit || 60)) / 60)
	);

	// Exercise type display
	const exerciseTypeNames: Record<string, string> = {
		MULTIPLE_CHOICE: 'Multiple Choice',
		FILL_BLANK: 'Fill in the Blank',
		SPELLING: 'Spelling',
		MATCHING: 'Matching'
	};

	const difficultyNames: Record<string, string> = {
		BEGINNER: 'Beginner',
		INTERMEDIATE: 'Intermediate',
		ADVANCED: 'Advanced'
	};

	const difficultyColors: Record<string, string> = {
		BEGINNER: 'bg-success-100 text-success-700 border-success-300',
		INTERMEDIATE: 'bg-warning-100 text-warning-700 border-warning-300',
		ADVANCED: 'bg-danger-100 text-danger-700 border-danger-300'
	};

	// Mock preview options for multiple choice
	const previewOptions = $derived.by(() => {
		if (!previewWord || exerciseConfig.type !== 'MULTIPLE_CHOICE') return [];

		const customDistractors = distractorConfig.customDistractors.get(previewWord.id) || [];
		const distractors = customDistractors.slice(0, distractorConfig.count);

		// Add more mock distractors if needed
		while (distractors.length < distractorConfig.count) {
			distractors.push(`Mock distractor ${distractors.length + 1}`);
		}

		const options = [
			{ text: previewWord.translation, isCorrect: true },
			...distractors.map((d) => ({ text: d, isCorrect: false }))
		];

		// Shuffle options
		return options.sort(() => Math.random() - 0.5);
	});

	function nextPreview() {
		if (previewWordIndex < selectedWords.length - 1) {
			previewWordIndex++;
		}
	}

	function previousPreview() {
		if (previewWordIndex > 0) {
			previewWordIndex--;
		}
	}

	function formatDateTime(dateStr?: string) {
		if (!dateStr) return 'Not set';
		return new Date(dateStr).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h2 class="text-xl font-semibold text-neutral-900 flex items-center gap-2">
			<Eye class="h-5 w-5" />
			Preview & Review
		</h2>
		<p class="mt-1 text-sm text-neutral-600">
			Review your challenge configuration before creating it.
		</p>
	</div>

	<!-- Summary Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<!-- Words Count -->
		<div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-primary-600 font-medium">Total Words</p>
					<p class="mt-1 text-2xl font-bold text-primary-900">{selectedWords.length}</p>
				</div>
				<BookOpen class="h-8 w-8 text-primary-500" />
			</div>
		</div>

		<!-- Students Count -->
		<div class="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-secondary-600 font-medium">Total Students</p>
					<p class="mt-1 text-2xl font-bold text-secondary-900">{totalStudents}</p>
				</div>
				<Users class="h-8 w-8 text-secondary-500" />
			</div>
		</div>

		<!-- Duration -->
		<div class="bg-info-50 border border-info-200 rounded-lg p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-info-600 font-medium">Est. Duration</p>
					<p class="mt-1 text-2xl font-bold text-info-900">{estimatedDuration} min</p>
				</div>
				<Clock class="h-8 w-8 text-info-500" />
			</div>
		</div>

		<!-- Difficulty -->
		<div class="bg-warning-50 border border-warning-200 rounded-lg p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-warning-600 font-medium">Difficulty</p>
					<p class="mt-1 text-2xl font-bold text-warning-900">
						{difficultyNames[exerciseConfig.difficulty]}
					</p>
				</div>
				<Target class="h-8 w-8 text-warning-500" />
			</div>
		</div>
	</div>

	<!-- Configuration Details -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Exercise Configuration -->
		<div class="bg-white border border-neutral-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-neutral-900 mb-4">Exercise Configuration</h3>
			<dl class="space-y-3">
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Exercise Type:</dt>
					<dd class="text-sm font-medium text-neutral-900">
						{exerciseTypeNames[exerciseConfig.type]}
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Difficulty Level:</dt>
					<dd class="text-sm font-medium">
						<span
							class={cn(
								'px-2 py-1 rounded text-xs font-medium border',
								difficultyColors[exerciseConfig.difficulty]
							)}
						>
							{difficultyNames[exerciseConfig.difficulty]}
						</span>
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Time Limit:</dt>
					<dd class="text-sm font-medium text-neutral-900">
						{exerciseConfig.timeLimit ? `${exerciseConfig.timeLimit}s per word` : 'No limit'}
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Attempts Allowed:</dt>
					<dd class="text-sm font-medium text-neutral-900">{exerciseConfig.attemptsAllowed}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Hints:</dt>
					<dd class="text-sm font-medium text-neutral-900">
						{exerciseConfig.enableHints ? 'Enabled' : 'Disabled'}
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Explanations:</dt>
					<dd class="text-sm font-medium text-neutral-900">
						{exerciseConfig.enableExplanations ? 'Enabled' : 'Disabled'}
					</dd>
				</div>
			</dl>
		</div>

		<!-- Distractor Configuration -->
		{#if exerciseConfig.type === 'MULTIPLE_CHOICE' || exerciseConfig.type === 'MATCHING'}
			<div class="bg-white border border-neutral-200 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-neutral-900 mb-4">Distractor Configuration</h3>
				<dl class="space-y-3">
					<div class="flex justify-between">
						<dt class="text-sm text-neutral-600">Distractor Count:</dt>
						<dd class="text-sm font-medium text-neutral-900">{distractorConfig.count} per word</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-sm text-neutral-600">Difficulty:</dt>
						<dd class="text-sm font-medium text-neutral-900">
							{difficultyNames[distractorConfig.difficulty]}
						</dd>
					</div>
					<div>
						<dt class="text-sm text-neutral-600 mb-2">Types:</dt>
						<dd class="flex flex-wrap gap-2">
							{#each distractorConfig.types as type}
								<span class="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
									{type}
								</span>
							{/each}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-sm text-neutral-600">Custom Distractors:</dt>
						<dd class="text-sm font-medium text-neutral-900">
							{Array.from(distractorConfig.customDistractors.values()).reduce(
								(sum, arr) => sum + arr.length,
								0
							)} total
						</dd>
					</div>
				</dl>
			</div>
		{/if}

		<!-- Assignment Details -->
		<div
			class={cn(
				'bg-white border border-neutral-200 rounded-lg p-6',
				exerciseConfig.type !== 'MULTIPLE_CHOICE' && exerciseConfig.type !== 'MATCHING'
					? 'lg:col-span-2'
					: ''
			)}
		>
			<h3 class="text-lg font-semibold text-neutral-900 mb-4">Assignment Details</h3>
			<dl class="space-y-3">
				<div>
					<dt class="text-sm text-neutral-600 mb-2">Assigned Classes:</dt>
					<dd class="space-y-1">
						{#if assignedClasses.length > 0}
							{#each assignedClasses as cls}
								<div class="flex justify-between items-center p-2 bg-neutral-50 rounded">
									<span class="text-sm font-medium text-neutral-900">{cls.name}</span>
									<span class="text-xs text-neutral-600">
										Grade {cls.grade} • {cls.students.length} students
									</span>
								</div>
							{/each}
						{:else}
							<p class="text-sm text-neutral-500 italic">No classes assigned</p>
						{/if}
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Available From:</dt>
					<dd class="text-sm font-medium text-neutral-900">
						{formatDateTime(assignmentConfig.availableFrom)}
					</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-sm text-neutral-600">Available Until:</dt>
					<dd class="text-sm font-medium text-neutral-900">
						{formatDateTime(assignmentConfig.availableUntil)}
					</dd>
				</div>
			</dl>
		</div>
	</div>

	<!-- Student View Preview -->
	{#if exerciseConfig.type === 'MULTIPLE_CHOICE' && previewWord}
		<div class="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-neutral-900 flex items-center gap-2">
					<Eye class="h-5 w-5" />
					Student View Preview
				</h3>
				<span class="text-sm text-neutral-600">
					Question {previewWordIndex + 1} of {selectedWords.length}
				</span>
			</div>

			<!-- Mock Exercise Card -->
			<div class="bg-white rounded-lg p-6 shadow-md">
				<div class="text-center mb-6">
					<p class="text-sm text-neutral-600 mb-2">What is the correct translation for:</p>
					<h2 class="text-3xl font-bold text-neutral-900">{previewWord.word}</h2>
					{#if previewWord.difficulty}
						<span
							class={cn(
								'inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border',
								difficultyColors[previewWord.difficulty]
							)}
						>
							{difficultyNames[previewWord.difficulty]}
						</span>
					{/if}
				</div>

				<!-- Options -->
				<div class="space-y-3">
					{#each previewOptions as option, index}
						<button
							type="button"
							disabled
							class={cn(
								'w-full p-4 text-left border-2 rounded-lg transition-all',
								'bg-white border-neutral-300 hover:border-primary-400 hover:bg-primary-50',
								'disabled:cursor-default'
							)}
						>
							<div class="flex items-center space-x-3">
								<span
									class="flex-shrink-0 w-8 h-8 rounded-full border-2 border-neutral-300 bg-white flex items-center justify-center text-sm font-medium text-neutral-700"
								>
									{String.fromCharCode(65 + index)}
								</span>
								<span class="text-neutral-900">{option.text}</span>
							</div>
						</button>
					{/each}
				</div>

				<!-- Mock Timer -->
				{#if exerciseConfig.timeLimit}
					<div class="mt-4 flex items-center justify-center space-x-2 text-sm text-neutral-600">
						<Clock class="h-4 w-4" />
						<span>Time remaining: {exerciseConfig.timeLimit}s</span>
					</div>
				{/if}
			</div>

			<!-- Navigation -->
			{#if selectedWords.length > 1}
				<div class="flex justify-between items-center mt-4">
					<button
						type="button"
						onclick={previousPreview}
						disabled={previewWordIndex === 0}
						class="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
					>
						← Previous
					</button>
					<button
						type="button"
						onclick={nextPreview}
						disabled={previewWordIndex === selectedWords.length - 1}
						class="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
					>
						Next →
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Words List -->
	<div class="bg-white border border-neutral-200 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-neutral-900 mb-4">Selected Words ({selectedWords.length})</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
			{#each selectedWords as word}
				<div class="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
					<div class="font-medium text-neutral-900">{word.word}</div>
					<div class="text-sm text-neutral-600">{word.translation}</div>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-xs bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">
							{word.category}
						</span>
						<span
							class={cn(
								'text-xs px-2 py-0.5 rounded',
								difficultyColors[word.difficulty] || 'bg-neutral-100 text-neutral-700'
							)}
						>
							{difficultyNames[word.difficulty]}
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Final Review Message -->
	<div class="bg-success-50 border border-success-200 rounded-lg p-4">
		<p class="text-sm text-success-800">
			<strong>Ready to create?</strong> Review the configuration above. Once created, this challenge will be immediately available to assigned students unless you set a future start date.
		</p>
	</div>
</div>
