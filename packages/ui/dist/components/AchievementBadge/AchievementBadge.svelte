<script lang="ts">
	import { cn } from '../../utils/index.js';
	import { Trophy, Star, Target, Zap, Crown, Medal } from 'lucide-svelte';
	import type { AchievementType } from '@educational-app/types';

	interface Props {
		name: string;
		icon?: string;
		type: AchievementType;
		isUnlocked?: boolean;
		isNew?: boolean;
		size?: 'sm' | 'md' | 'lg';
		showLabel?: boolean;
		interactive?: boolean;
		class?: string;
		onclick?: () => void;
	}

	let {
		name,
		icon,
		type,
		isUnlocked = false,
		isNew = false,
		size = 'md',
		showLabel = true,
		interactive = false,
		class: className,
		onclick
	}: Props = $props();

	// Icon mapping for achievement types
	const iconMap = {
		STREAK: Zap,
		MILESTONE: Trophy,
		MASTERY: Star,
		SPECIAL: Crown
	};

	const IconComponent = $derived(iconMap[type]);

	// Size variants
	const sizes = {
		sm: {
			container: 'w-12 h-12',
			icon: 'w-6 h-6',
			text: 'text-xs'
		},
		md: {
			container: 'w-16 h-16',
			icon: 'w-8 h-8',
			text: 'text-sm'
		},
		lg: {
			container: 'w-20 h-20',
			icon: 'w-10 h-10',
			text: 'text-base'
		}
	};

	// Type-based colors
	const typeColors = {
		STREAK: {
			bg: 'bg-gradient-to-br from-orange-400 to-red-500',
			text: 'text-orange-600',
			glow: 'shadow-glow-orange'
		},
		MILESTONE: {
			bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
			text: 'text-yellow-600',
			glow: 'shadow-glow-yellow'
		},
		MASTERY: {
			bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
			text: 'text-blue-600',
			glow: 'shadow-glow-blue'
		},
		SPECIAL: {
			bg: 'bg-gradient-to-br from-purple-400 to-pink-500',
			text: 'text-purple-600',
			glow: 'shadow-glow-purple'
		}
	};

	const badgeClasses = $derived(
		cn(
			'relative flex items-center justify-center rounded-full border-4 transition-all duration-300',
			sizes[size].container,
			{
				// Unlocked state
				[typeColors[type].bg]: isUnlocked,
				'border-white shadow-lg': isUnlocked,
				[typeColors[type].glow]: isUnlocked,
				
				// Locked state
				'bg-gray-200 border-gray-300': !isUnlocked,
				
				// Interactive state
				'cursor-pointer hover:scale-110 active:scale-95': interactive && isUnlocked,
				
				// New achievement pulse
				'animate-pulse': isNew,
				'ring-4 ring-yellow-300': isNew
			},
			className
		)
	);

	const iconClasses = $derived(
		cn(
			sizes[size].icon,
			{
				'text-white drop-shadow-sm': isUnlocked,
				'text-gray-400': !isUnlocked
			}
		)
	);

	function handleClick() {
		if (interactive && isUnlocked && onclick) {
			onclick();
		}
	}
</script>

<div class="flex flex-col items-center space-y-2">
	<div
		class={badgeClasses}
		role={interactive ? 'button' : undefined}
		tabindex={interactive && isUnlocked ? 0 : undefined}
		onclick={handleClick}
	>
		<!-- Icon -->
		<IconComponent class={iconClasses} />

		<!-- New achievement indicator -->
		{#if isNew && isUnlocked}
			<div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce">
				<div class="w-full h-full bg-red-400 rounded-full animate-ping"></div>
			</div>
		{/if}

		<!-- Lock overlay for locked achievements -->
		{#if !isUnlocked}
			<div class="absolute inset-0 flex items-center justify-center bg-gray-200/80 rounded-full">
				<div class="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
					<div class="w-2 h-2 border border-white rounded-sm"></div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Label -->
	{#if showLabel}
		<div class={cn(
			'text-center font-medium max-w-20',
			sizes[size].text,
			{
				[typeColors[type].text]: isUnlocked,
				'text-gray-500': !isUnlocked
			}
		)}>
			{name}
		</div>
	{/if}
</div>

<style>
	.shadow-glow-orange { box-shadow: 0 0 20px rgba(251, 146, 60, 0.4); }
	.shadow-glow-yellow { box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
	.shadow-glow-blue { box-shadow: 0 0 20px rgba(96, 165, 250, 0.4); }
	.shadow-glow-purple { box-shadow: 0 0 20px rgba(196, 181, 253, 0.4); }
</style>