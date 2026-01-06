<script lang="ts">
	import { TypingChallenge, Button } from '@educational-app/ui';
	import { ArrowLeft, RotateCcw } from 'lucide-svelte';
	import type { PageData } from './$types';
	import type { TypingMetrics } from '@educational-app/learning';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const challenge = $derived(data.challenge);

	// State for managing which text is being displayed
	let currentTextIndex = $state(0);
	let showCompletion = $state(false);
	let allResults = $state<Array<{ textIndex: number; metrics: TypingMetrics }>>([]);

	const currentText = $derived(challenge.texts[currentTextIndex]);
	const hasMoreTexts = $derived(currentTextIndex < challenge.texts.length - 1);

	function handleComplete(metrics: TypingMetrics) {
		// Store results
		allResults.push({ textIndex: currentTextIndex, metrics });

		if (hasMoreTexts) {
			// Move to next text
			currentTextIndex++;
		} else {
			// All texts completed
			showCompletion = true;
		}
	}

	function handleRestart() {
		currentTextIndex = 0;
		showCompletion = false;
		allResults = [];
		// Force component remount by using key
		componentKey++;
	}

	let componentKey = $state(0);

	function exitPreview() {
		window.location.href = `/typing-challenges/${challenge.id}`;
	}
</script>

<svelte:head>
	<title>Preview: {challenge.title} - Teacher Portal</title>
</svelte:head>

<!-- Header -->
<div class="mb-8">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button
				onclick={exitPreview}
				class="text-neutral-500 hover:text-neutral-700 transition-colors"
			>
				<ArrowLeft class="w-5 h-5" />
			</button>
			<div>
				<h1 class="text-2xl font-bold text-neutral-900">Preview: {challenge.title}</h1>
				{#if challenge.texts.length > 1}
					<p class="text-sm text-neutral-500">
						Testing as a student • {currentTextIndex + 1} of {challenge.texts.length}
					</p>
				{:else}
					<p class="text-sm text-neutral-500">Testing as a student</p>
				{/if}
			</div>
		</div>

		<div class="flex items-center gap-2">
			<Button variant="outline" color="neutral" onclick={handleRestart}>
				<RotateCcw class="w-4 h-4 mr-2" />
				Restart Preview
			</Button>
			<Button variant="solid" color="primary" onclick={exitPreview}>
				Exit Preview
			</Button>
		</div>
	</div>
</div>

{#if showCompletion}
	<!-- All Texts Completed -->
	<div class="max-w-3xl mx-auto">
		<div class="bg-success-50 border-2 border-success-200 rounded-lg p-8 text-center">
			<div class="text-6xl mb-4">🎉</div>
			<h2 class="text-2xl font-bold text-success-900 mb-2">Preview Complete!</h2>
			<p class="text-success-700 mb-6">
				You've completed testing this challenge.
			</p>

			<!-- Overall Performance Metrics -->
			{#if allResults.length === 1}
				{@const result = allResults[0]}
				<div class="bg-white rounded-lg p-6 mb-6">
					<h3 class="text-lg font-semibold text-neutral-900 mb-4">Your Performance</h3>
					<div class="grid grid-cols-2 gap-6">
						<div class="text-center">
							<div class="text-4xl font-bold text-primary-600 mb-2">
								{result.metrics.averageWPM}
							</div>
							<div class="text-sm text-neutral-600">Words Per Minute</div>
						</div>
						<div class="text-center">
							<div class="text-4xl font-bold text-secondary-600 mb-2">
								{result.metrics.accuracy}%
							</div>
							<div class="text-sm text-neutral-600">Accuracy</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Results Summary for Multiple Parts -->
			{#if allResults.length > 1}
				{@const avgWPM = Math.round(allResults.reduce((sum, r) => sum + r.metrics.averageWPM, 0) / allResults.length)}
				{@const avgAccuracy = Math.round(allResults.reduce((sum, r) => sum + r.metrics.accuracy, 0) / allResults.length)}

				<div class="bg-white rounded-lg p-6 mb-6">
					<h3 class="text-lg font-semibold text-neutral-900 mb-4">Overall Performance</h3>
					<div class="grid grid-cols-2 gap-6 mb-6">
						<div class="text-center">
							<div class="text-4xl font-bold text-primary-600 mb-2">
								{avgWPM}
							</div>
							<div class="text-sm text-neutral-600">Average WPM</div>
						</div>
						<div class="text-center">
							<div class="text-4xl font-bold text-secondary-600 mb-2">
								{avgAccuracy}%
							</div>
							<div class="text-sm text-neutral-600">Average Accuracy</div>
						</div>
					</div>

					<div class="border-t border-neutral-200 pt-4">
						<h4 class="text-sm font-semibold text-neutral-700 mb-3">Breakdown by Part</h4>
						<div class="space-y-3">
							{#each allResults as result, index}
								<div class="flex items-center justify-between text-sm">
									<span class="text-neutral-600">Part {index + 1}</span>
									<div class="flex items-center gap-4">
										<span class="text-primary-600 font-medium">{result.metrics.averageWPM} WPM</span>
										<span class="text-secondary-600 font-medium">{result.metrics.accuracy}% Accuracy</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			<div class="flex justify-center gap-3">
				<Button variant="outline" color="neutral" onclick={handleRestart}>
					<RotateCcw class="w-4 h-4 mr-2" />
					Test Again
				</Button>
				<Button variant="solid" color="primary" onclick={exitPreview}>
					Return to Challenge
				</Button>
			</div>
		</div>
	</div>
{:else if currentText}
	<!-- Typing Challenge -->
	{#key componentKey}
		<TypingChallenge
			text={currentText.content}
			timeLimit={challenge.timerMode === 'PER_WORD' ? challenge.baseTimePerWord : 0}
			bonusTime={2000}
			enableSounds={challenge.enableSounds}
			enableHints={challenge.enableHints}
			showKeyboard={challenge.showKeyboard}
			onComplete={handleComplete}
		/>
	{/key}
{/if}
