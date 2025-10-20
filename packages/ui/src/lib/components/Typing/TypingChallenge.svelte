<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils/index.js';
	import { TypingEngine } from '@educational-app/learning';
	import type { TypingMetrics } from '@educational-app/learning';
	import TextDisplay from './TextDisplay.svelte';
	import TimerBar from './TimerBar.svelte';
	import ResultsScreen from './ResultsScreen.svelte';
	import { Card } from '$lib/index.js';

	interface Props {
		text: string;
		timeLimit?: number; // milliseconds per word (0 = no timer)
		bonusTime?: number; // bonus time for fast completion
		enableSounds?: boolean;
		onComplete?: (metrics: TypingMetrics, xp: number, achievements: string[]) => void;
		class?: string;
	}

	let {
		text,
		timeLimit = 7000,
		bonusTime = 2000,
		enableSounds = true,
		onComplete,
		class: className
	}: Props = $props();

	let engine = $state(new TypingEngine(text));
	let timerBar = $state<any>(null);
	let showResults = $state(false);
	let metrics = $state<TypingMetrics | null>(null);
	let xpEarned = $state(0);
	let achievements = $state<string[]>([]);

	// Get typing state
	const state = $derived(engine.getState());
	const currentWord = $derived(engine.getCurrentWord());
	const isComplete = $derived(engine.isComplete());

	// Start timer when component mounts
	onMount(() => {
		// Focus on the window to capture keyboard events
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	});

	/**
	 * Handle keyboard input
	 */
	function handleKeyPress(event: KeyboardEvent) {
		if (showResults) return;

		// Prevent default for typing keys
		if (event.key.length === 1 || event.key === 'Backspace') {
			event.preventDefault();
		}

		// Start timer on first keypress
		if (!state.startTime && timerBar && timeLimit > 0) {
			timerBar.start();
		}

		// Handle backspace
		if (event.key === 'Backspace') {
			const didDelete = engine.handleBackspace();
			if (enableSounds && didDelete) {
				playSound('delete');
			}
			return;
		}

		// Handle character input
		if (event.key.length === 1) {
			const result = engine.processInput(event.key);

			// Play sound feedback
			if (enableSounds) {
				if (result.isCorrect) {
					playSound('correct');
				} else {
					playSound('error');
				}
			}

			// Handle word completion
			if (result.shouldAdvanceWord) {
				handleWordComplete();
			}

			// Check if challenge is complete
			if (engine.isComplete()) {
				handleChallengeComplete();
			}
		}
	}

	/**
	 * Handle word completion
	 */
	function handleWordComplete() {
		// Reset timer for next word
		if (timerBar && timeLimit > 0) {
			timerBar.reset();

			// Add bonus time if word completed quickly (< 50% of time limit)
			const wordMetrics = engine.getMetrics();
			const lastWordTiming = engine.getWordTimings().slice(-1)[0];
			if (lastWordTiming && lastWordTiming.timeMs < timeLimit / 2 && lastWordTiming.errors === 0) {
				timerBar.addBonusTime(bonusTime);
				if (enableSounds) {
					playSound('bonus');
				}
			}

			timerBar.start();
		}
	}

	/**
	 * Handle challenge completion
	 */
	function handleChallengeComplete() {
		// Stop timer
		if (timerBar) {
			timerBar.pause();
		}

		// Get final metrics
		metrics = engine.getMetrics();
		xpEarned = engine.calculateXP();
		achievements = engine.checkAchievements();

		// Play completion sound
		if (enableSounds) {
			playSound('complete');
		}

		// Show results after short delay
		setTimeout(() => {
			showResults = true;

			// Call onComplete callback
			if (onComplete && metrics) {
				onComplete(metrics, xpEarned, achievements);
			}
		}, 500);
	}

	/**
	 * Handle timeout
	 */
	function handleTimeout() {
		// For now, just continue - future: could force word advance or show hint
		console.log('Timeout!');
		if (enableSounds) {
			playSound('timeout');
		}
	}

	/**
	 * Play sound effect
	 */
	function playSound(type: 'correct' | 'error' | 'delete' | 'bonus' | 'complete' | 'timeout') {
		// TODO: Implement sound effects using Web Audio API or audio elements
		// For now, just log
		// console.log(`Play sound: ${type}`);
	}

	/**
	 * Restart the challenge
	 */
	function handleRestart() {
		engine.reset();
		showResults = false;
		metrics = null;
		xpEarned = 0;
		achievements = [];

		if (timerBar) {
			timerBar.reset();
		}
	}

	/**
	 * Get progress percentage
	 */
	const progress = $derived(engine.getProgress());
</script>

{#if showResults && metrics}
	<ResultsScreen
		{metrics}
		{achievements}
		{xpEarned}
		onRestart={handleRestart}
		class={className}
	/>
{:else}
	<div class={cn('w-full max-w-5xl mx-auto', className)}>
		<!-- Progress Bar -->
		<div class="mb-6">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-neutral-700">Progress</span>
				<span class="text-sm font-semibold text-primary-600">{progress}%</span>
			</div>
			<div class="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
				<div
					class="h-full bg-primary-500 transition-all duration-300 ease-out"
					style="width: {progress}%"
				></div>
			</div>
		</div>

		<!-- Timer (if enabled) -->
		{#if timeLimit > 0}
			<TimerBar
				bind:this={timerBar}
				{timeLimit}
				onTimeout={handleTimeout}
				class="mb-6"
			/>
		{/if}

		<!-- Text Display -->
		<TextDisplay
			words={state.words}
			currentWordIndex={state.currentWordIndex}
			windowSize={5}
		/>

		<!-- Stats Display -->
		<Card variant="outlined" padding="md" class="mt-6">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
				<div>
					<div class="text-2xl font-bold text-success-600">{state.totalCorrect}</div>
					<div class="text-xs text-neutral-500">Correct</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-danger-600">{state.totalErrors}</div>
					<div class="text-xs text-neutral-500">Errors</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-primary-600">
						{engine.getMetrics().averageWPM}
					</div>
					<div class="text-xs text-neutral-500">WPM</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-secondary-600">
						{engine.getMetrics().accuracy}%
					</div>
					<div class="text-xs text-neutral-500">Accuracy</div>
				</div>
			</div>
		</Card>

		<!-- Instructions -->
		<div class="mt-6 text-center text-sm text-neutral-500">
			<p>Type the words as they appear. Press Backspace to correct mistakes.</p>
			{#if timeLimit > 0 && bonusTime > 0}
				<p class="mt-1 text-success-600">Complete words quickly to earn bonus time!</p>
			{/if}
		</div>
	</div>
{/if}
