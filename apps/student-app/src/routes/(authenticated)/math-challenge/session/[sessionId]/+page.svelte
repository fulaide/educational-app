<script lang="ts">
	import { goto } from '$app/navigation';
	import FeedbackCard from '$lib/components/FeedbackCard.svelte';
	import MathProblemDisplay from '$lib/components/MathProblemDisplay.svelte';
	import NumericKeypad from '$lib/components/NumericKeypad.svelte';
	import { mathChallengeService } from '$lib/services/math-challenge.svelte';
	import { Button, Card, ProgressBar } from '@educational-app/ui';
	import { ArrowRight, X, Timer } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// State derived from service
	const currentProblem = $derived(mathChallengeService.getCurrentProblem())
	const currentInput = $derived(mathChallengeService.currentInput)
	const feedback = $derived(mathChallengeService.feedback)
	const showFeedback = $derived(mathChallengeService.showFeedback)
	const isLoading = $derived(mathChallengeService.isLoading)
	const progress = $derived(mathChallengeService.getProgress())

	// Timer state
	const timerEnabled = $derived(mathChallengeService.timerEnabled)
	const timeRemaining = $derived(mathChallengeService.timeRemaining)
	const formattedTime = $derived(mathChallengeService.formatTimeRemaining())
	const isTimerExpired = $derived(mathChallengeService.isTimerExpired())

	// Timer warning when less than 30 seconds
	const timerWarning = $derived(timerEnabled && timeRemaining <= 30 && timeRemaining > 0)
	const timerCritical = $derived(timerEnabled && timeRemaining <= 10 && timeRemaining > 0)

	// Track if we've already handled timer expiration to prevent double redirects
	let hasHandledExpiration = $state(false)

	// Check if we have an active session on mount
	onMount(() => {
		console.log('[SessionPage] onMount - currentSession:', mathChallengeService.currentSession)
		console.log('[SessionPage] onMount - currentProblem:', mathChallengeService.getCurrentProblem())

		if (!mathChallengeService.currentSession) {
			console.warn('[SessionPage] No active session, redirecting to config page')
			// No active session, redirect back to math-challenge page
			goto('/math-challenge')
		}
	})

	// Watch for timer expiration
	$effect(() => {
		if (isTimerExpired && mathChallengeService.currentSession && !hasHandledExpiration) {
			// Mark as handled immediately to prevent multiple redirects
			hasHandledExpiration = true

			// Timer expired - go to results
			const sessionId = mathChallengeService.currentSession.id
			console.log('[SessionPage] Timer expired, redirecting to results for session:', sessionId)

			// Force calculate results before redirecting (session may not be complete)
			mathChallengeService.forceCalculateResults()
			mathChallengeService.stopTimer()
			goto(`/math-challenge/results/${sessionId}`)
		}
	})

	function handleDigitInput(digit: string) {
		mathChallengeService.addDigit(digit)
	}

	function handleDelete() {
		mathChallengeService.deleteDigit()
	}

	async function handleSubmit() {
		if (!currentInput || showFeedback || isLoading) return
		await mathChallengeService.submitAnswer()
	}

	function handleNext() {
		const hasMore = mathChallengeService.nextProblem()

		if (!hasMore) {
			// Session complete, go to results
			const session = mathChallengeService.currentSession
			if (session) {
				goto(`/math-challenge/results/${session.id}`)
			}
		}
	}

	function handleExit() {
		mathChallengeService.clearSession()
		goto('/math-challenge')
	}

	// Calculate progress percentage
	const progressPercent = $derived(
		progress.total > 0 ? (progress.current - 1) / progress.total * 100 : 0
	)
</script>

<div class="max-w-lg mx-auto px-4 py-6 flex flex-col">
	{#if mathChallengeService.currentSession}
		<!-- Header with progress and timer -->
		<div class="mb-6">
			<div class="flex items-center justify-between text-sm text-neutral-600 mb-2">
				<button
					onclick={handleExit}
					class="flex items-center gap-1 text-neutral-500 hover:text-neutral-700"
				>
					<X class="w-4 h-4" />
					Beenden
				</button>

				{#if timerEnabled}
					<div class="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold
						{timerCritical ? 'bg-danger-100 text-danger-700 animate-pulse' :
						 timerWarning ? 'bg-warning-100 text-warning-700' :
						 'bg-neutral-100 text-neutral-700'}">
						<Timer class="w-4 h-4" />
						{formattedTime}
					</div>
				{/if}

				<span>Aufgabe {progress.current} von {progress.total}</span>
			</div>
			<ProgressBar current={progress.current} total={progress.total} class="h-2" />
		</div>

		<!-- Problem Display -->
		<Card class="p-8 mb-6 flex-shrink-0">
			<MathProblemDisplay
				problem={currentProblem}
				userInput={currentInput}
				showCorrectAnswer={showFeedback && feedback && !feedback.isCorrect}
				isCorrect={showFeedback ? feedback?.isCorrect : undefined}
			/>
		</Card>

		<!-- Feedback Card -->
		{#if showFeedback && feedback}
			<FeedbackCard {feedback} class="mb-6 flex-shrink-0" />

			<!-- Next Button -->
			<div class="flex justify-center mb-6">
				<Button
					variant="solid"
					color="primary"
					size="lg"
					onclick={handleNext}
					class="w-full max-w-xs"
				>
					{progress.current === progress.total ? 'Ergebnisse ansehen' : 'Nächste Aufgabe'}
					<ArrowRight class="w-5 h-5 ml-2" />
				</Button>
			</div>
		{/if}

		<!-- Numeric Keypad -->
		{#if !showFeedback}
			<div class="flex-1 flex flex-col justify-end">
				<NumericKeypad
					disabled={isLoading}
					currentValue={currentInput}
					maxLength={3}
					onInput={handleDigitInput}
					onDelete={handleDelete}
					onSubmit={handleSubmit}
				/>
			</div>
		{/if}
	{:else}
		<!-- Loading state -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center">
				<div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p class="text-neutral-600">Lade Aufgaben...</p>
			</div>
		</div>
	{/if}
</div>
