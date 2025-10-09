<script lang="ts">
	import { cn, calculateProgress } from '../../utils/index.js';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		current: number;
		total: number;
		showLabel?: boolean;
		showPercentage?: boolean;
		size?: 'sm' | 'md' | 'lg';
		color?: 'primary' | 'success' | 'warning' | 'danger';
		animated?: boolean;
		striped?: boolean;
		class?: string;
	}

	let {
		current,
		total,
		showLabel = false,
		showPercentage = false,
		size = 'md',
		color = 'primary',
		animated = true,
		striped = false,
		class: className
	}: Props = $props();

	// Animated progress value
	const progress = tweened(0, {
		duration: animated ? 800 : 0,
		easing: cubicOut
	});

	// Update progress when current/total changes
	$effect(() => {
		const newProgress = calculateProgress(current, total);
		progress.set(newProgress);
	});

	// Size variants
	const sizes = {
		sm: 'h-2',
		md: 'h-3', 
		lg: 'h-4'
	};

	// Color variants - using theme-aware colors
	const colors = {
		primary: 'bg-primary',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-error'
	};

	const progressClasses = $derived(
		cn(
			'relative overflow-hidden rounded-full bg-surface-hover',
			sizes[size],
			className
		)
	);

	const fillClasses = $derived(
		cn(
			'h-full rounded-full transition-all duration-300 ease-out',
			colors[color],
			{
				'animate-pulse': striped
			}
		)
	);

	const percentage = $derived(Math.round($progress));
	const isComplete = $derived(percentage >= 100);
</script>

<div class="space-y-2">
	{#if showLabel}
		<div class="flex justify-between items-center text-sm">
			<span class="font-medium text-neutral-900 font-primary">
				Progress
			</span>
			{#if showPercentage}
				<span class={cn(
					'font-medium font-primary',
					{
						'text-success': isComplete,
						'text-secondary': !isComplete
					}
				)}>
					{percentage}%
				</span>
			{/if}
		</div>
	{/if}

	<div class={progressClasses}>
		<div
			class={fillClasses}
			style="width: {$progress}%"
		>
			{#if striped}
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
			{/if}
		</div>

		{#if isComplete && animated}
			<!-- Success sparkle effect -->
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="w-1 h-1 bg-white rounded-full animate-ping"></div>
			</div>
		{/if}
	</div>

	{#if !showLabel && showPercentage}
		<div class="text-center">
			<span class={cn(
				'text-xs font-medium font-primary',
				{
					'text-success': isComplete,
					'text-secondary': !isComplete
				}
			)}>
				{current} / {total}
			</span>
		</div>
	{/if}
</div>

<style>
	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}
	
	.animate-shimmer {
		animation: shimmer 2s infinite;
	}
</style>