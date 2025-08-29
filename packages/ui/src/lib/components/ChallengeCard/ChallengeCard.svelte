<script lang="ts">
	import { cn, formatDuration, formatXP } from '$lib/utils/index.js';
	import { Clock, Star, Play, CheckCircle } from 'lucide-svelte';
	import { Card } from '../Card/index.js';
	import { ProgressBar } from '../ProgressBar/index.js';
	import type { TaskType, Difficulty } from '@educational-app/types';

	interface Props {
		title: string;
		type: TaskType;
		difficulty: Difficulty;
		xpReward: number;
		timeLimit?: number;
		progress?: number;
		totalSteps?: number;
		isCompleted?: boolean;
		isLocked?: boolean;
		thumbnail?: string;
		class?: string;
		onclick?: () => void;
	}

	let {
		title,
		type,
		difficulty,
		xpReward,
		timeLimit,
		progress = 0,
		totalSteps = 1,
		isCompleted = false,
		isLocked = false,
		thumbnail,
		class: className,
		onclick
	}: Props = $props();

	// Type icons and colors
	const typeConfig = {
		VOCABULARY: {
			icon: '📚',
			color: 'bg-blue-100 text-blue-700',
			bgGradient: 'from-blue-50 to-indigo-50'
		},
		WRITING: {
			icon: '✍️',
			color: 'bg-green-100 text-green-700',
			bgGradient: 'from-green-50 to-emerald-50'
		},
		READING: {
			icon: '📖',
			color: 'bg-purple-100 text-purple-700',
			bgGradient: 'from-purple-50 to-violet-50'
		},
		LISTENING: {
			icon: '🎧',
			color: 'bg-orange-100 text-orange-700',
			bgGradient: 'from-orange-50 to-red-50'
		}
	};

	// Difficulty styling
	const difficultyConfig = {
		BEGINNER: { color: 'text-green-600', dots: 1 },
		INTERMEDIATE: { color: 'text-yellow-600', dots: 2 },
		ADVANCED: { color: 'text-red-600', dots: 3 }
	};

	const config = $derived(typeConfig[type]);
	const diffConfig = $derived(difficultyConfig[difficulty]);
	const progressPercentage = $derived((progress / totalSteps) * 100);
	const showProgress = $derived(totalSteps > 1 && !isCompleted);
</script>

<Card
	variant="elevated"
	padding="none"
	clickable={!isLocked}
	hoverable={!isLocked}
	class={cn(
		'overflow-hidden transition-all duration-300',
		{
			'opacity-60': isLocked,
			'ring-2 ring-success-200 bg-success-50': isCompleted
		},
		className
	)}
	{onclick}
>
	<!-- Thumbnail or Type Background -->
	<div class={cn(
		'relative h-32 flex items-center justify-center',
		{
			[`bg-gradient-to-br ${config.bgGradient}`]: !thumbnail
		}
	)}>
		{#if thumbnail}
			<img src={thumbnail} alt={title} class="w-full h-full object-cover" />
		{:else}
			<div class="text-4xl">{config.icon}</div>
		{/if}

		<!-- Completion overlay -->
		{#if isCompleted}
			<div class="absolute inset-0 bg-success-500/90 flex items-center justify-center">
				<CheckCircle class="w-12 h-12 text-white animate-bounce-subtle" />
			</div>
		{/if}

		<!-- Lock overlay -->
		{#if isLocked}
			<div class="absolute inset-0 bg-gray-500/70 flex items-center justify-center">
				<div class="w-8 h-8 bg-gray-600 rounded-md flex items-center justify-center">
					<div class="w-4 h-4 border-2 border-white rounded-sm"></div>
				</div>
			</div>
		{/if}

		<!-- Type badge -->
		<div class={cn(
			'absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium',
			config.color
		)}>
			{type}
		</div>

		<!-- XP reward -->
		<div class="absolute top-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
			<Star class="w-3 h-3 text-yellow-500 fill-current" />
			{formatXP(xpReward)}
		</div>
	</div>

	<!-- Content -->
	<div class="p-4 space-y-3">
		<!-- Title -->
		<h3 class="font-semibold text-gray-900 line-clamp-2">
			{title}
		</h3>

		<!-- Metadata -->
		<div class="flex items-center justify-between text-sm text-gray-600">
			<!-- Difficulty -->
			<div class="flex items-center gap-1">
				<span class={cn('font-medium', diffConfig.color)}>
					{difficulty}
				</span>
				<div class="flex gap-0.5">
					{#each Array(3) as _, i}
						<div class={cn(
							'w-1.5 h-1.5 rounded-full',
							{
								[diffConfig.color.replace('text-', 'bg-')]: i < diffConfig.dots,
								'bg-gray-300': i >= diffConfig.dots
							}
						)}></div>
					{/each}
				</div>
			</div>

			<!-- Time limit -->
			{#if timeLimit}
				<div class="flex items-center gap-1">
					<Clock class="w-3 h-3" />
					{formatDuration(timeLimit)}
				</div>
			{/if}
		</div>

		<!-- Progress -->
		{#if showProgress}
			<div class="space-y-1">
				<div class="flex justify-between text-xs text-gray-600">
					<span>Progress</span>
					<span>{progress}/{totalSteps}</span>
				</div>
				<ProgressBar
					current={progress}
					total={totalSteps}
					size="sm"
					color="primary"
				/>
			</div>
		{/if}

		<!-- Action button -->
		{#if !isLocked}
			<div class="pt-2">
				{#if isCompleted}
					<div class="flex items-center justify-center gap-2 py-2 text-success-600 font-medium">
						<CheckCircle class="w-4 h-4" />
						Completed!
					</div>
				{:else}
					<div class="flex items-center justify-center gap-2 py-2 text-primary-600 font-medium">
						<Play class="w-4 h-4" />
						{progress > 0 ? 'Continue' : 'Start'}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</Card>