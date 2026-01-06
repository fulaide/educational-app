<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { Card, Button, ProgressBar, Badge } from '@educational-app/ui'
	import { Check, X, ArrowRight } from 'lucide-svelte'
	import { vocabularyService, type VocabularyExercise } from '$lib/services/vocabulary.svelte.ts'
	import { page } from '$app/stores'

	// State
	let currentExercise = $state<VocabularyExercise | null>(null)
	let selectedAnswerId = $state<string | null>(null)
	let showFeedback = $state(false)
	let feedback = $state<{ isCorrect: boolean; correctAnswerId: string; explanation?: string } | null>(null)
	let startTime = $state(Date.now())
	let progress = $state({ current: 0, total: 0 })

	// Check if we have an active session
	onMount(() => {
		if (!vocabularyService.currentSession) {
			// No active session, redirect back to vocabulary page
			goto('/vocabulary')
			return
		}

		loadCurrentExercise()
	})

	function loadCurrentExercise() {
		if (!vocabularyService.currentSession) return

		currentExercise = vocabularyService.getCurrentExercise()
		progress = {
			current: vocabularyService.currentSession.currentIndex + 1,
			total: vocabularyService.currentSession.exercises.length
		}
		selectedAnswerId = null
		showFeedback = false
		feedback = null
		startTime = Date.now()
	}

	function selectAnswer(answerId: string) {
		if (showFeedback) return // Already submitted
		selectedAnswerId = answerId
	}

	function submitAnswer() {
		if (!selectedAnswerId || !currentExercise || showFeedback) return

		const timeMs = Date.now() - startTime

		// Submit answer to service
		feedback = vocabularyService.submitAnswer(currentExercise.id, selectedAnswerId, timeMs)
		showFeedback = true
	}

	function nextQuestion() {
		const hasMore = vocabularyService.nextExercise()

		if (hasMore) {
			// Load next exercise
			loadCurrentExercise()
		} else {
			// Session complete, go to results
			goto(`/vocabulary/results/${vocabularyService.currentSession!.id}`)
		}
	}

	// Calculate progress percentage
	const progressPercent = $derived((progress.current / progress.total) * 100)
</script>

<div class="max-w-3xl mx-auto px-4 py-6">
	{#if currentExercise}
		<!-- Progress Bar -->
		<div class="mb-6">
			<div class="flex items-center justify-between text-sm text-neutral-600 mb-2">
				<span>Question {progress.current} of {progress.total}</span>
				<span>{Math.round(progressPercent)}% complete</span>
			</div>
			<ProgressBar value={progressPercent} class="h-2" />
		</div>

		<!-- Question Card -->
		<Card class="p-8 mb-6">
			<div class="text-center mb-8">
				<h2 class="text-2xl font-bold text-neutral-900 mb-2">
					{currentExercise.question}
				</h2>
				<p class="text-sm text-neutral-600">Choose the correct translation</p>
			</div>

			<!-- Answer Options -->
			<div class="space-y-3">
				{#each currentExercise.options as option}
					{@const isSelected = selectedAnswerId === option.id}
					{@const isCorrect = option.id === currentExercise.correctAnswerId}
					{@const showCorrect = showFeedback && isCorrect}
					{@const showIncorrect = showFeedback && isSelected && !isCorrect}

					<button
						onclick={() => selectAnswer(option.id)}
						disabled={showFeedback}
						class="w-full p-4 rounded-lg border-2 transition-all text-left {
							showCorrect ? 'border-green-500 bg-green-50' :
							showIncorrect ? 'border-red-500 bg-red-50' :
							isSelected ? 'border-primary-500 bg-primary-50' :
							'border-neutral-200 bg-white hover:border-neutral-300'
						} {showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}"
					>
						<div class="flex items-center justify-between">
							<span class="font-medium text-neutral-900">{option.text}</span>

							{#if showCorrect}
								<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
									<Check class="w-4 h-4 text-white" />
								</div>
							{:else if showIncorrect}
								<div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
									<X class="w-4 h-4 text-white" />
								</div>
							{:else if isSelected}
								<div class="w-6 h-6 bg-primary-500 rounded-full"></div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</Card>

		<!-- Feedback Card -->
		{#if showFeedback && feedback}
			<Card class="p-6 mb-6 {feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
				<div class="flex items-start space-x-3">
					<div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 {
						feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'
					}">
						{#if feedback.isCorrect}
							<Check class="w-6 h-6 text-white" />
						{:else}
							<X class="w-6 h-6 text-white" />
						{/if}
					</div>

					<div class="flex-1">
						<h3 class="font-bold text-lg mb-1 {
							feedback.isCorrect ? 'text-green-900' : 'text-red-900'
						}">
							{feedback.isCorrect ? 'Correct!' : 'Not quite'}
						</h3>
						<p class="text-sm {feedback.isCorrect ? 'text-green-800' : 'text-red-800'}">
							{feedback.explanation}
						</p>
					</div>
				</div>
			</Card>
		{/if}

		<!-- Action Buttons -->
		<div class="flex justify-between">
			<Button
				variant="ghost"
				onclick={() => goto('/vocabulary')}
			>
				Exit
			</Button>

			{#if showFeedback}
				<Button
					variant="solid"
					color="primary"
					onclick={nextQuestion}
				>
					{progress.current === progress.total ? 'View Results' : 'Next Question'}
					<ArrowRight class="w-4 h-4 ml-2" />
				</Button>
			{:else}
				<Button
					variant="solid"
					color="primary"
					onclick={submitAnswer}
					disabled={!selectedAnswerId}
				>
					Check Answer
				</Button>
			{/if}
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-neutral-600">Loading exercise...</p>
		</div>
	{/if}
</div>
