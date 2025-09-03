<script lang="ts">
	import { cn, formatXP } from '../../utils/index.js';
	import { Star, TrendingUp } from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		currentXP: number;
		levelXP: number;
		nextLevelXP: number;
		level: number;
		showLevel?: boolean;
		showProgress?: boolean;
		animated?: boolean;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'compact' | 'detailed';
		class?: string;
	}

	let {
		currentXP,
		levelXP,
		nextLevelXP,
		level,
		showLevel = true,
		showProgress = true,
		animated = true,
		size = 'md',
		variant = 'detailed',
		class: className
	}: Props = $props();

	// Animated XP values
	const animatedXP = tweened(0, {
		duration: animated ? 1000 : 0,
		easing: cubicOut
	});

	const animatedProgress = tweened(0, {
		duration: animated ? 800 : 0,
		easing: cubicOut
	});

	// Calculate progress
	const xpInLevel = $derived(currentXP - levelXP);
	const xpNeededForNext = $derived(nextLevelXP - levelXP);
	const progressPercentage = $derived((xpInLevel / xpNeededForNext) * 100);

	// Size configurations
	const sizeConfig = {
		sm: {
			container: 'text-sm',
			xp: 'text-lg font-bold',
			level: 'text-xs',
			progress: 'h-1.5',
			icon: 'w-3 h-3',
			levelBadge: 'w-6 h-6 text-xs'
		},
		md: {
			container: 'text-base',
			xp: 'text-xl font-bold',
			level: 'text-sm',
			progress: 'h-2',
			icon: 'w-4 h-4',
			levelBadge: 'w-8 h-8 text-sm'
		},
		lg: {
			container: 'text-lg',
			xp: 'text-2xl font-bold',
			level: 'text-base',
			progress: 'h-3',
			icon: 'w-5 h-5',
			levelBadge: 'w-10 h-10 text-base'
		}
	};

	const config = $derived(sizeConfig[size]);

	// Update animations when values change
	$effect(() => {
		animatedXP.set(currentXP);
		animatedProgress.set(progressPercentage);
	});
</script>

{#if variant === 'compact'}
	<!-- Compact variant -->
	<div class={cn('flex items-center gap-2', config.container, className)}>
		{#if showLevel}
			<div class={cn(
				'flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold',
				config.levelBadge
			)}>
				{level}
			</div>
		{/if}

		<div class="flex items-center gap-1">
			<Star class={cn('text-yellow-500 fill-current', config.icon)} />
			<span class={cn('text-gray-900', config.xp)}>
				{formatXP(Math.round($animatedXP))}
			</span>
		</div>
	</div>
{:else}
	<!-- Detailed variant -->
	<div class={cn('space-y-3', className)}>
		<!-- Header with level and XP -->
		<div class="flex items-center justify-between">
			{#if showLevel}
				<div class="flex items-center gap-2">
					<div class={cn(
						'flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-lg',
						config.levelBadge
					)}>
						{level}
					</div>
					<div>
						<div class={cn('font-semibold text-gray-900', config.level)}>
							Level {level}
						</div>
						<div class={cn('text-gray-500', config.level === 'text-xs' ? 'text-xs' : 'text-sm')}>
							{formatXP(xpInLevel)} / {formatXP(xpNeededForNext)} XP
						</div>
					</div>
				</div>
			{/if}

			<div class="text-right">
				<div class="flex items-center gap-1 justify-end">
					<Star class={cn('text-yellow-500 fill-current', config.icon)} />
					<span class={cn('text-gray-900', config.xp)}>
						{formatXP(Math.round($animatedXP))}
					</span>
				</div>
				<div class={cn('text-gray-500 flex items-center gap-1 justify-end', config.level)}>
					<TrendingUp class="w-3 h-3" />
					Total XP
				</div>
			</div>
		</div>

		<!-- Progress bar -->
		{#if showProgress}
			<div class="space-y-1">
				<div class="flex justify-between text-xs text-gray-600">
					<span>Progress to Level {level + 1}</span>
					<span>{Math.round($animatedProgress)}%</span>
				</div>
				<div class={cn('w-full bg-gray-200 rounded-full overflow-hidden', config.progress)}>
					<div
						class={cn(
							'bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out relative',
							config.progress
						)}
						style="width: {$animatedProgress}%"
					>
						<!-- Shine effect -->
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}
	
	.animate-shimmer {
		animation: shimmer 2s infinite;
	}
</style>