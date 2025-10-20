<script lang="ts">
	import { cn } from '../../utils/index.js';
	import {
		qwertzLayout,
		fingerColors,
		fingerBorderColors,
		findKeyForChar
	} from '@educational-app/learning';
	import type { KeyDefinition, KeyFinger } from '@educational-app/learning';

	interface Props {
		currentChar?: string | null;
		pressedKey?: string | null;
		showFingerGuide?: boolean;
		highlightZone?: 'left' | 'center' | 'right' | null;
		highlightKey?: string | null;
		class?: string;
	}

	let {
		currentChar = null,
		pressedKey = null,
		showFingerGuide = true,
		highlightZone = null,
		highlightKey = null,
		class: className
	}: Props = $props();

	// Find the key for the current character
	const currentKeyDef = $derived(currentChar ? findKeyForChar(currentChar) : null);

	/**
	 * Get CSS classes for a key based on its state
	 */
	function getKeyClasses(keyDef: KeyDefinition): string {
		const isCurrentKey = currentKeyDef?.key === keyDef.key;
		const isPressed = pressedKey === keyDef.key || pressedKey === keyDef.shiftKey;
		const isHighlighted = highlightKey === keyDef.key;
		const isInHighlightedZone = highlightZone === keyDef.zone;
		const isHomeRow = ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö'].includes(keyDef.key);

		// Base classes
		let classes = [
			'relative flex items-center justify-center',
			'rounded-lg border-2 transition-all duration-150',
			'font-mono font-semibold text-sm select-none',
			'shadow-sm'
		];

		// Width
		const width = keyDef.width || 1;
		if (width === 1) classes.push('h-12 px-3');
		else if (width === 1.5) classes.push('h-12 px-6');
		else if (width === 2) classes.push('h-12 px-8');
		else if (width >= 6) classes.push('h-12 px-16'); // Space bar

		// Color based on finger guide
		if (showFingerGuide && !isCurrentKey && !isPressed && !isHighlighted) {
			classes.push(fingerColors[keyDef.finger]);
			classes.push('border-neutral-300');
		}
		// Current key highlight (key to press next)
		else if (isCurrentKey) {
			classes.push('bg-primary-500 text-white border-primary-600');
			classes.push('animate-pulse shadow-lg scale-110 z-10');
		}
		// Key being pressed
		else if (isPressed) {
			classes.push('bg-success-500 text-white border-success-600');
			classes.push('scale-95 shadow-inner');
		}
		// Hint Level 3: Direct key highlight
		else if (isHighlighted) {
			classes.push('bg-warning-400 text-white border-warning-500');
			classes.push('animate-bounce');
		}
		// Hint Level 1: Zone highlight
		else if (isInHighlightedZone) {
			classes.push('bg-info-100 border-info-400');
		}
		// Default
		else {
			classes.push('bg-surface border-neutral-300 text-neutral-700');
		}

		// Home row indicator (small dots)
		if (isHomeRow) {
			classes.push('after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2');
			classes.push('after:w-1.5 after:h-1.5 after:rounded-full after:bg-current after:opacity-40');
		}

		return cn(classes);
	}

	/**
	 * Get display label for key (shows shift/altGr variants)
	 */
	function getKeyLabel(keyDef: KeyDefinition): string {
		if (keyDef.isSpecial) {
			return keyDef.label;
		}

		// For normal keys, show main character
		return keyDef.label.toUpperCase();
	}

	/**
	 * Get shift/altGr indicators
	 */
	function getShiftLabel(keyDef: KeyDefinition): string | null {
		return keyDef.shiftKey || null;
	}

	function getAltGrLabel(keyDef: KeyDefinition): string | null {
		return keyDef.altGrKey || null;
	}
</script>

<div class={cn('w-full max-w-5xl mx-auto p-6 bg-neutral-50 rounded-xl', className)}>
	<!-- Keyboard Title -->
	{#if showFingerGuide}
		<div class="mb-4 text-center">
			<p class="text-sm text-neutral-600">
				Follow the color guide - each finger has its own color!
			</p>
		</div>
	{/if}

	<!-- Keyboard Layout -->
	<div class="space-y-2">
		{#each qwertzLayout as row, rowIndex}
			<div
				class="flex justify-center gap-1"
				style={row.offset ? `padding-left: ${row.offset * 2}rem` : ''}
			>
				{#each row.keys as keyDef}
					<div class={getKeyClasses(keyDef)}>
						<!-- Shift variant (top-left) -->
						{#if getShiftLabel(keyDef)}
							<span class="absolute top-1 left-1.5 text-xs opacity-60">
								{getShiftLabel(keyDef)}
							</span>
						{/if}

						<!-- AltGr variant (top-right) -->
						{#if getAltGrLabel(keyDef)}
							<span class="absolute top-1 right-1.5 text-xs opacity-60">
								{getAltGrLabel(keyDef)}
							</span>
						{/if}

						<!-- Main label -->
						<span class="text-base font-bold">
							{getKeyLabel(keyDef)}
						</span>

						<!-- Finger guide indicator (bottom) -->
						{#if showFingerGuide && currentKeyDef?.key === keyDef.key}
							<div class="absolute -bottom-6 left-1/2 -translate-x-1/2">
								<div class="flex flex-col items-center">
									<div class="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-primary-500"></div>
									<span class="text-xs font-semibold text-primary-600 whitespace-nowrap mt-1">
										{keyDef.finger.replace('-', ' ').replace('left', 'Left').replace('right', 'Right').replace('thumb', 'Thumb')}
									</span>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- Finger Legend -->
	{#if showFingerGuide}
		<div class="mt-8 pt-6 border-t border-neutral-200">
			<p class="text-xs text-neutral-600 text-center mb-3">Finger Color Guide</p>
			<div class="grid grid-cols-4 md:grid-cols-9 gap-2 max-w-3xl mx-auto">
				{#each Object.entries(fingerColors) as [finger, colorClass]}
					<div class="flex flex-col items-center gap-1">
						<div class={cn('w-8 h-8 rounded-lg border-2 border-neutral-300', colorClass)}></div>
						<span class="text-xs text-neutral-600 text-center capitalize">
							{finger.split('-').pop()}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Zone Highlight Legend (when active) -->
	{#if highlightZone}
		<div class="mt-4 text-center">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-info-50 border border-info-200 rounded-lg">
				<div class="w-3 h-3 bg-info-400 rounded-full animate-pulse"></div>
				<span class="text-sm font-medium text-info-700">
					Look in the {highlightZone} zone
				</span>
			</div>
		</div>
	{/if}

	<!-- Key Highlight Message (when active) -->
	{#if highlightKey}
		<div class="mt-4 text-center">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-warning-50 border border-warning-200 rounded-lg">
				<span class="text-2xl">👆</span>
				<span class="text-sm font-medium text-warning-700">
					Press the highlighted key!
				</span>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Pulse animation for current key */
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}

	/* Bounce animation for hint */
	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}

	.animate-pulse {
		animation: pulse 1.5s ease-in-out infinite;
	}

	.animate-bounce {
		animation: bounce 0.6s ease-in-out infinite;
	}
</style>
