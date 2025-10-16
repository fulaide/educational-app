<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { invalidateAll } from '$app/navigation';
	import { Button, notifications } from '@educational-app/ui';
	import { Check, ChevronLeft, ChevronRight, Save, Send } from 'lucide-svelte';
	import WordSelector from './WordSelector.svelte';
	import DistractorConfigurator from './DistractorConfigurator.svelte';
	import ChallengePreview from './ChallengePreview.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { z } from 'zod';
	import { cn } from '@educational-app/ui/utils';

	interface Props {
		form: SuperValidated<any>;
		vocabularyWords: any[];
		classes: any[];
		categories: string[];
		difficulties: readonly string[];
		draftId?: string | null;
	}

	let {
		form: formData,
		vocabularyWords,
		classes,
		categories,
		difficulties,
		draftId
	}: Props = $props();

	// Form setup with SuperForms
	const challengeForm = superForm(formData, {
		validators: zodClient(formData.validator),
		id: 'createChallenge',
		onUpdated({ form }) {
			if (form.valid && form.message) {
				notifications.success(form.message);
				// TODO: Navigate to challenges list
			} else if (form.message) {
				notifications.error(form.message);
			}
		},
		onError({ result }) {
			notifications.error('Failed to create challenge. Please try again.');
		}
	});

	const { form, enhance, submitting } = challengeForm;

	// Step wizard state
	const steps = [
		{ id: 1, name: 'Select Words', description: 'Choose vocabulary words for the challenge' },
		{
			id: 2,
			name: 'Configure Exercise',
			description: 'Set exercise type and distractor options'
		},
		{
			id: 3,
			name: 'Assign & Schedule',
			description: 'Choose classes/students and availability'
		},
		{ id: 4, name: 'Preview', description: 'Review and create the challenge' }
	];

	let currentStep = $state(1);
	let selectedWords = $state<any[]>([]);
	let exerciseConfig = $state({
		type: 'MULTIPLE_CHOICE' as const,
		difficulty: 'BEGINNER' as const,
		timeLimit: 300,
		attemptsAllowed: 3,
		enableHints: true,
		enableExplanations: true
	});
	let distractorConfig = $state({
		types: ['SEMANTIC', 'PHONETIC'] as const,
		count: 3,
		difficulty: 'BEGINNER' as const,
		customDistractors: new Map<string, string[]>()
	});
	let assignmentConfig = $state({
		classIds: [] as string[],
		studentIds: [] as string[],
		availableFrom: '',
		availableUntil: ''
	});

	// Draft auto-save
	let autoSaveTimeout: NodeJS.Timeout;

	// Computed values
	const canProceed = $derived.by(() => {
		switch (currentStep) {
			case 1:
				return selectedWords.length > 0;
			case 2:
				return exerciseConfig.type && exerciseConfig.difficulty;
			case 3:
				return assignmentConfig.classIds.length > 0 || assignmentConfig.studentIds.length > 0;
			case 4:
				return true;
			default:
				return false;
		}
	});

	const isLastStep = $derived(currentStep === steps.length);
	const isFirstStep = $derived(currentStep === 1);

	// Step navigation
	function nextStep() {
		if (canProceed && currentStep < steps.length) {
			currentStep++;
			saveDraft();
		}
	}

	function previousStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function goToStep(step: number) {
		if (step <= currentStep || (step === currentStep + 1 && canProceed)) {
			currentStep = step;
		}
	}

	// Draft management
	function saveDraft() {
		clearTimeout(autoSaveTimeout);
		autoSaveTimeout = setTimeout(() => {
			const draft = {
				selectedWords,
				exerciseConfig,
				distractorConfig,
				assignmentConfig,
				currentStep,
				savedAt: new Date().toISOString()
			};
			localStorage.setItem('challenge-builder-draft', JSON.stringify(draft));
			notifications.success('Draft saved');
		}, 1000);
	}

	function loadDraft() {
		try {
			const draftJson = localStorage.getItem('challenge-builder-draft');
			if (draftJson) {
				const draft = JSON.parse(draftJson);
				selectedWords = draft.selectedWords || [];
				exerciseConfig = draft.exerciseConfig || exerciseConfig;
				distractorConfig = {
					...draft.distractorConfig,
					customDistractors: new Map(draft.distractorConfig?.customDistractors || [])
				};
				assignmentConfig = draft.assignmentConfig || assignmentConfig;
				currentStep = draft.currentStep || 1;
				notifications.info('Draft loaded');
			}
		} catch (error) {
			console.error('Failed to load draft:', error);
		}
	}

	function clearDraft() {
		localStorage.removeItem('challenge-builder-draft');
		notifications.info('Draft cleared');
	}

	// Form submission
	async function handleSubmit() {
		// Update form data
		$form.wordIds = selectedWords.map((w) => w.id);
		$form.exerciseType = exerciseConfig.type;
		$form.difficulty = exerciseConfig.difficulty;
		$form.timeLimit = exerciseConfig.timeLimit;
		$form.attemptsAllowed = exerciseConfig.attemptsAllowed;
		$form.enableHints = exerciseConfig.enableHints;
		$form.enableExplanations = exerciseConfig.enableExplanations;
		$form.distractorTypes = distractorConfig.types;
		$form.distractorCount = distractorConfig.count;
		$form.distractorDifficulty = distractorConfig.difficulty;
		$form.customDistractors = Array.from(distractorConfig.customDistractors.entries()).map(
			([wordId, distractors]) => ({ wordId, distractors })
		);
		$form.assignToClassIds = assignmentConfig.classIds;
		$form.assignToStudentIds = assignmentConfig.studentIds;
		$form.availableFrom = assignmentConfig.availableFrom;
		$form.availableUntil = assignmentConfig.availableUntil;

		// Clear draft on successful submission
		clearDraft();
	}

	// Load draft on mount
	$effect(() => {
		if (draftId) {
			loadDraft();
		}
	});

	// Auto-save on changes
	$effect(() => {
		// Watch for changes to trigger auto-save
		const deps = [
			selectedWords,
			exerciseConfig,
			distractorConfig,
			assignmentConfig,
			currentStep
		];
		saveDraft();
	});
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-neutral-900">Create Vocabulary Challenge</h1>
		<p class="mt-2 text-sm text-neutral-600">
			Build a custom vocabulary exercise for your students with auto-generated distractors.
		</p>
	</div>

	<!-- Step Progress Indicator -->
	<nav aria-label="Progress" class="mb-8">
		<ol class="flex items-center justify-between">
			{#each steps as step, index}
				{@const isActive = currentStep === step.id}
				{@const isCompleted = currentStep > step.id}
				{@const isAccessible = step.id <= currentStep || (step.id === currentStep + 1 && canProceed)}

				<li class="relative flex-1 {index < steps.length - 1 ? 'pr-8 sm:pr-20' : ''}">
					<!-- Progress Line -->
					{#if index < steps.length - 1}
						<div
							class="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full"
							class:bg-primary-600={isCompleted}
							class:bg-neutral-300={!isCompleted}
							aria-hidden="true"
						></div>
					{/if}

					<!-- Step Button -->
					<button
						type="button"
						onclick={() => goToStep(step.id)}
						disabled={!isAccessible}
						class={cn(
							'group relative w-full flex flex-col items-start',
							isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
						)}
					>
						<span class="flex h-9 items-center">
							<span
								class={cn(
									'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
									isCompleted
										? 'bg-primary-600 border-primary-600'
										: isActive
											? 'bg-white border-primary-600'
											: 'bg-white border-neutral-300',
									isAccessible && !isActive && !isCompleted
										? 'group-hover:border-primary-400'
										: ''
								)}
							>
								{#if isCompleted}
									<Check class="h-5 w-5 text-white" />
								{:else}
									<span
										class={cn(
											'text-sm font-semibold',
											isActive ? 'text-primary-600' : 'text-neutral-500'
										)}
									>
										{step.id}
									</span>
								{/if}
							</span>
						</span>
						<span class="ml-0 mt-3 flex flex-col text-left">
							<span
								class={cn(
									'text-sm font-medium',
									isActive ? 'text-primary-600' : 'text-neutral-900'
								)}
							>
								{step.name}
							</span>
							<span class="text-xs text-neutral-500 hidden sm:block">{step.description}</span>
						</span>
					</button>
				</li>
			{/each}
		</ol>
	</nav>

	<!-- Step Content -->
	<form method="POST" action="?/createChallenge" use:enhance onsubmit={handleSubmit}>
		<div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
			{#if currentStep === 1}
				<WordSelector
					{vocabularyWords}
					{categories}
					{difficulties}
					bind:selectedWords
					onchange={() => saveDraft()}
				/>
			{:else if currentStep === 2}
				<DistractorConfigurator
					{selectedWords}
					bind:exerciseConfig
					bind:distractorConfig
					onchange={() => saveDraft()}
				/>
			{:else if currentStep === 3}
				<!-- Assignment & Scheduling Step -->
				<div class="space-y-6">
					<div>
						<h2 class="text-xl font-semibold text-neutral-900 mb-4">Assign to Classes</h2>
						<div class="space-y-2">
							{#each classes as cls}
								<label class="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
									<input
										type="checkbox"
										value={cls.id}
										bind:group={assignmentConfig.classIds}
										onchange={() => saveDraft()}
										class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
									/>
									<span class="flex-1">
										<span class="text-sm font-medium text-neutral-900">{cls.name}</span>
										<span class="text-xs text-neutral-500 ml-2">Grade {cls.grade} • {cls.students.length} students</span>
									</span>
								</label>
							{/each}
						</div>
					</div>

					<div>
						<h2 class="text-xl font-semibold text-neutral-900 mb-4">Schedule (Optional)</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="availableFrom" class="block text-sm font-medium text-neutral-700 mb-1">
									Available From
								</label>
								<input
									type="datetime-local"
									id="availableFrom"
									bind:value={assignmentConfig.availableFrom}
									onchange={() => saveDraft()}
									class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>
							<div>
								<label for="availableUntil" class="block text-sm font-medium text-neutral-700 mb-1">
									Available Until
								</label>
								<input
									type="datetime-local"
									id="availableUntil"
									bind:value={assignmentConfig.availableUntil}
									onchange={() => saveDraft()}
									class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>
						</div>
					</div>
				</div>
			{:else if currentStep === 4}
				<ChallengePreview
					{selectedWords}
					{exerciseConfig}
					{distractorConfig}
					{assignmentConfig}
					{classes}
				/>
			{/if}
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<Button
					type="button"
					variant="outline"
					color="primary"
					onclick={previousStep}
					disabled={isFirstStep || $submitting}
				>
					<ChevronLeft class="h-4 w-4 mr-1" />
					Previous
				</Button>
			</div>

			<div class="flex items-center space-x-3">
				<Button
					type="button"
					variant="ghost"
					color="primary"
					onclick={saveDraft}
					disabled={$submitting}
				>
					<Save class="h-4 w-4 mr-2" />
					Save Draft
				</Button>

				{#if !isLastStep}
					<Button
						type="button"
						variant="solid"
						color="primary"
						onclick={nextStep}
						disabled={!canProceed || $submitting}
					>
						Next
						<ChevronRight class="h-4 w-4 ml-1" />
					</Button>
				{:else}
					<Button
						type="submit"
						variant="solid"
						color="success"
						disabled={!canProceed || $submitting}
						loading={$submitting}
					>
						<Send class="h-4 w-4 mr-2" />
						Create Challenge
					</Button>
				{/if}
			</div>
		</div>
	</form>
</div>
