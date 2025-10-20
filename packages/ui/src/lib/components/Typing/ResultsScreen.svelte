<script lang="ts">
	import { cn } from '$lib/utils/index.js';
	import { Card, Button } from '$lib/index.js';
	import {
		CheckCircle,
		Target,
		Zap,
		Trophy,
		RotateCcw,
		ArrowRight,
		TrendingUp,
		Clock
	} from 'lucide-svelte';
	import type { TypingMetrics } from '@educational-app/learning';

	interface Props {
		metrics: TypingMetrics;
		achievements: string[];
		xpEarned: number;
		onRestart?: () => void;
		onNext?: () => void;
		onExit?: () => void;
		class?: string;
	}

	let {
		metrics,
		achievements = [],
		xpEarned,
		onRestart,
		onNext,
		onExit,
		class: className
	}: Props = $props();

	// Achievement labels
	const achievementLabels: Record<string, { label: string; icon: string }> = {
		PERFECT_TYPING: { label: 'Perfect Typing!', icon: '🎯' },
		SPEED_DEMON: { label: 'Speed Demon', icon: '⚡' },
		UMLAUT_MASTER: { label: 'Umlaut Master', icon: 'Ä' },
		FIRST_COMPLETION: { label: 'First Completion', icon: '🎉' }
	};

	// Determine performance rating
	const rating = $derived.by(() => {
		if (metrics.accuracy >= 95) return 'Excellent';
		if (metrics.accuracy >= 85) return 'Great';
		if (metrics.accuracy >= 75) return 'Good';
		if (metrics.accuracy >= 60) return 'Fair';
		return 'Keep Practicing';
	});

	const ratingColor = $derived.by(() => {
		if (metrics.accuracy >= 95) return 'text-success-600';
		if (metrics.accuracy >= 85) return 'text-primary-600';
		if (metrics.accuracy >= 75) return 'text-secondary-600';
		if (metrics.accuracy >= 60) return 'text-warning-600';
		return 'text-danger-600';
	});

	// Stats for display
	const stats = $derived([
		{
			label: 'Words Typed',
			value: metrics.wordsTyped,
			icon: CheckCircle,
			color: 'text-success-600 bg-success-50'
		},
		{
			label: 'Accuracy',
			value: `${metrics.accuracy}%`,
			icon: Target,
			color: 'text-primary-600 bg-primary-50'
		},
		{
			label: 'Speed (WPM)',
			value: metrics.averageWPM,
			icon: Zap,
			color: 'text-secondary-600 bg-secondary-50'
		},
		{
			label: 'Time',
			value: `${Math.round(metrics.totalTimeMs / 1000)}s`,
			icon: Clock,
			color: 'text-neutral-600 bg-neutral-50'
		}
	]);

	// Error breakdown
	const errorBreakdown = $derived([
		{ label: 'Uppercase Errors', value: metrics.uppercaseErrors, color: 'bg-warning-500' },
		{ label: 'Umlaut Errors', value: metrics.umlautErrors, color: 'bg-danger-500' },
		{ label: 'Special Char Errors', value: metrics.specialCharErrors, color: 'bg-info-500' },
		{ label: 'Wrong Key Errors', value: metrics.wrongKeyErrors, color: 'bg-neutral-500' }
	]);

	const totalErrors = $derived(
		errorBreakdown.reduce((sum, error) => sum + error.value, 0)
	);
</script>

<div class={cn('w-full max-w-4xl mx-auto p-6', className)}>
	<!-- Header with XP and Rating -->
	<div class="text-center mb-8">
		<div class="inline-flex items-center justify-center w-20 h-20 mb-4 bg-success-100 rounded-full">
			<Trophy class="w-10 h-10 text-success-600" />
		</div>
		<h2 class="text-3xl font-bold text-neutral-900 mb-2">Challenge Complete!</h2>
		<p class={cn('text-xl font-semibold mb-4', ratingColor)}>{rating}</p>
		<div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
			<TrendingUp class="w-5 h-5 text-primary-600" />
			<span class="text-lg font-bold text-primary-600">+{xpEarned} XP</span>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
		{#each stats as stat}
			<Card variant="outlined" padding="lg" class="text-center">
				<div class={cn('inline-flex items-center justify-center w-12 h-12 mb-3 rounded-lg', stat.color.split(' ')[1])}>
					<svelte:component this={stat.icon} class={cn('w-6 h-6', stat.color.split(' ')[0])} />
				</div>
				<div class="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
				<div class="text-xs text-neutral-500">{stat.label}</div>
			</Card>
		{/each}
	</div>

	<!-- Error Breakdown -->
	{#if totalErrors > 0}
		<Card variant="outlined" padding="lg" class="mb-8">
			<h3 class="text-lg font-semibold text-neutral-900 mb-4">Error Breakdown</h3>
			<div class="space-y-3">
				{#each errorBreakdown as error}
					{#if error.value > 0}
						<div>
							<div class="flex items-center justify-between mb-1">
								<span class="text-sm text-neutral-700">{error.label}</span>
								<span class="text-sm font-semibold text-neutral-900">{error.value}</span>
							</div>
							<div class="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
								<div
									class={cn('h-full transition-all duration-300', error.color)}
									style="width: {(error.value / totalErrors) * 100}%"
								></div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</Card>
	{/if}

	<!-- Achievements -->
	{#if achievements.length > 0}
		<Card variant="elevated" padding="lg" class="mb-8 bg-gradient-to-br from-primary-50 to-secondary-50">
			<h3 class="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<Trophy class="w-5 h-5 text-primary-600" />
				Achievements Unlocked!
			</h3>
			<div class="flex flex-wrap gap-3">
				{#each achievements as achievement}
					{@const info = achievementLabels[achievement]}
					{#if info}
						<div
							class="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary-200 rounded-lg shadow-sm"
						>
							<span class="text-2xl">{info.icon}</span>
							<span class="font-semibold text-neutral-900">{info.label}</span>
						</div>
					{/if}
				{/each}
			</div>
		</Card>
	{/if}

	<!-- Action Buttons -->
	<div class="flex flex-col sm:flex-row gap-4 justify-center">
		{#if onRestart}
			<Button variant="soft" color="neutral" onclick={onRestart} class="flex-1 sm:flex-none">
				<RotateCcw class="w-4 h-4 mr-2" />
				Try Again
			</Button>
		{/if}

		{#if onNext}
			<Button variant="solid" color="primary" onclick={onNext} class="flex-1 sm:flex-none">
				Next Challenge
				<ArrowRight class="w-4 h-4 ml-2" />
			</Button>
		{/if}

		{#if onExit}
			<Button variant="outlined" color="neutral" onclick={onExit} class="flex-1 sm:flex-none">
				Exit
			</Button>
		{/if}
	</div>

	<!-- Encouragement Message -->
	<div class="mt-8 text-center text-sm text-neutral-500">
		{#if metrics.accuracy >= 95}
			<p>🌟 Amazing work! You're a typing superstar!</p>
		{:else if metrics.accuracy >= 85}
			<p>💪 Great job! Keep practicing to get even better!</p>
		{:else if metrics.accuracy >= 75}
			<p>👍 Good effort! You're improving with each try!</p>
		{:else}
			<p>📚 Keep practicing! Every attempt makes you better!</p>
		{/if}
	</div>
</div>
