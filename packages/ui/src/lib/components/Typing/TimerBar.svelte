<script lang="ts">
	import { cn } from '$lib/utils/index.js';
	import { onMount } from 'svelte';
	import { Clock } from 'lucide-svelte';

	interface Props {
		timeLimit: number; // milliseconds
		onTimeout?: () => void;
		class?: string;
	}

	let { timeLimit, onTimeout, class: className }: Props = $props();

	let startTime = $state<number | null>(null);
	let elapsed = $state(0);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	// Calculate progress percentage
	const progress = $derived(Math.min((elapsed / timeLimit) * 100, 100));

	// Calculate remaining time in seconds
	const remainingSeconds = $derived(Math.max(0, Math.ceil((timeLimit - elapsed) / 1000)));

	// Determine color based on remaining time
	const barColor = $derived.by(() => {
		if (progress >= 90) return 'bg-danger-500';
		if (progress >= 70) return 'bg-warning-500';
		return 'bg-primary-500';
	});

	// Determine text color
	const textColor = $derived.by(() => {
		if (progress >= 90) return 'text-danger-600';
		if (progress >= 70) return 'text-warning-600';
		return 'text-primary-600';
	});

	/**
	 * Start the timer
	 */
	export function start() {
		if (!startTime) {
			startTime = Date.now();
			tick();
		}
	}

	/**
	 * Pause the timer
	 */
	export function pause() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	/**
	 * Reset the timer
	 */
	export function reset(newTimeLimit?: number) {
		pause();
		startTime = null;
		elapsed = 0;
		if (newTimeLimit !== undefined) {
			timeLimit = newTimeLimit;
		}
	}

	/**
	 * Add bonus time (for fast completion)
	 */
	export function addBonusTime(bonusMs: number) {
		timeLimit += bonusMs;
	}

	/**
	 * Tick function to update elapsed time
	 */
	function tick() {
		intervalId = setInterval(() => {
			if (startTime) {
				elapsed = Date.now() - startTime;

				// Check for timeout
				if (elapsed >= timeLimit) {
					elapsed = timeLimit;
					pause();
					if (onTimeout) {
						onTimeout();
					}
				}
			}
		}, 100); // Update every 100ms for smooth animation
	}

	// Cleanup on component destroy
	onMount(() => {
		return () => {
			pause();
		};
	});
</script>

<div class={cn('w-full', className)}>
	<!-- Timer Display -->
	<div class="flex items-center justify-between mb-2">
		<div class="flex items-center gap-2">
			<Clock class={cn('w-5 h-5', textColor)} />
			<span class={cn('text-sm font-medium', textColor)}>
				{remainingSeconds}s
			</span>
		</div>

		{#if progress >= 70}
			<span class="text-xs text-neutral-500">Hurry up!</span>
		{/if}
	</div>

	<!-- Progress Bar -->
	<div class="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
		<div
			class={cn('h-full transition-all duration-200 ease-linear rounded-full', barColor)}
			style="width: {progress}%"
		></div>
	</div>

	<!-- Bonus Time Indicator -->
	{#if progress < 50}
		<div class="mt-1 text-xs text-center text-success-600">Fast typing = bonus time!</div>
	{/if}
</div>
