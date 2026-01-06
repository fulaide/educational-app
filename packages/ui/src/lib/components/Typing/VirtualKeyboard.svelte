<script lang="ts">
	import { cn } from '$lib/utils/index.js';
	import type { KeyDefinition, KeyFinger } from '@educational-app/learning';
	import {
		findKeyForChar,
		qwertzLayout
	} from '@educational-app/learning';

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

	// Track modifier key states
	let shiftPressed = $state(false);
	let altGrPressed = $state(false);

	// Listen for shift and altGr key presses
	$effect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Shift') shiftPressed = true;
			if (e.key === 'AltGraph' || (e.altKey && e.key === 'Alt')) altGrPressed = true;
		}

		function handleKeyUp(e: KeyboardEvent) {
			if (e.key === 'Shift') shiftPressed = false;
			if (e.key === 'AltGraph' || (e.altKey && e.key === 'Alt')) altGrPressed = false;
		}

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});

	// Find the key for the current character
	const currentKeyDef = $derived(currentChar ? findKeyForChar(currentChar) : null);

	// Color mapping for fingers (using inline styles since Tailwind purges dynamic classes)
	// Using 6 distinct, vibrant colors - different colors where hands meet in the middle
	// Distribution: pinky, ring, middle get mirrored colors; index fingers get unique colors
	const fingerColorMap: Record<KeyFinger, { bg: string; text: string; border: string }> = {
		// Left hand
		'left-pinky': { bg: '#fca5a5', text: '#7f1d1d', border: '#ef4444' },     // Red
		'left-ring': { bg: '#a78bfa', text: '#4c1d95', border: '#8b5cf6' },      // Purple
		'left-middle': { bg: '#60a5fa', text: '#1e3a8a', border: '#3b82f6' },    // Blue
		'left-index': { bg: '#34d399', text: '#065f46', border: '#10b981' },     // Green

		// Right hand (mirrored colors except index fingers - they get different colors)
		'right-index': { bg: '#fbbf24', text: '#78350f', border: '#f59e0b' },    // Yellow (different from left-index)
		'right-middle': { bg: '#60a5fa', text: '#1e3a8a', border: '#3b82f6' },   // Blue (matches left-middle)
		'right-ring': { bg: '#a78bfa', text: '#4c1d95', border: '#8b5cf6' },     // Purple (matches left-ring)
		'right-pinky': { bg: '#fca5a5', text: '#7f1d1d', border: '#ef4444' },    // Red (matches left-pinky)

		// Thumb (neutral)
		'thumb': { bg: '#d1d5db', text: '#1f2937', border: '#6b7280' }           // Gray
	};

	/**
	 * Get CSS classes for a key based on its state
	 */
	function getKeyClasses(keyDef: KeyDefinition): string {
		// Check if this key produces the current character (considering base, shift, altGr variants)
		const isCurrentKey = currentKeyDef &&
			(currentKeyDef.key === keyDef.key) &&
			(keyDef.key === currentChar || keyDef.shiftKey === currentChar || keyDef.altGrKey === currentChar);
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
		else if (width >= 6) classes.push('h-12 px-12'); // Space bar

		// Color based on state (we'll use inline styles for finger colors)
		// Current key highlight (key to press next) - keep finger color, add animation
		if (isCurrentKey) {
			classes.push('animate-glow-pulse scale-110 z-10');
			// Finger color will be applied via inline style
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
		// Default (finger colors will be applied via inline style)
		else if (!showFingerGuide) {
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
	 * Get inline styles for finger color
	 */
	function getKeyStyle(keyDef: KeyDefinition): string {
		const isPressed = pressedKey === keyDef.key || pressedKey === keyDef.shiftKey;
		const isHighlighted = highlightKey === keyDef.key;
		const isInHighlightedZone = highlightZone === keyDef.zone;

		// Apply finger colors when showing guide (including current key to keep color)
		if (showFingerGuide && !isPressed && !isHighlighted && !isInHighlightedZone) {
			const colors = fingerColorMap[keyDef.finger];
			return `background-color: ${colors.bg}; color: ${colors.text}; border-color: ${colors.border};`;
		}

		return '';
	}

	/**
	 * Get the label to display based on current modifier key state
	 */
	function getDisplayLabel(keyDef: KeyDefinition): string {
		// Special keys always show their label
		if (keyDef.isSpecial) {
			return keyDef.label;
		}

		// AltGr has priority over Shift
		if (altGrPressed && keyDef.altGrKey) {
			return keyDef.altGrKey;
		}

		// Shift shows shift variant
		if (shiftPressed && keyDef.shiftKey) {
			return keyDef.shiftKey;
		}

		// Default: show main key (lowercase)
		return keyDef.key;
	}

	/**
	 * Get finger name in German
	 */
	function getFingerNameInGerman(finger: KeyFinger): string {
		const fingerNames: Record<KeyFinger, string> = {
			'left-pinky': 'linken kleinen Finger',
			'left-ring': 'linken Ringfinger',
			'left-middle': 'linken Mittelfinger',
			'left-index': 'linken Zeigefinger',
			'right-index': 'rechten Zeigefinger',
			'right-middle': 'rechten Mittelfinger',
			'right-ring': 'rechten Ringfinger',
			'right-pinky': 'rechten kleinen Finger',
			'thumb': 'Daumen'
		};
		return fingerNames[finger];
	}

</script>

<div class={cn('w-full max-w-5xl mx-auto p-6 bg-neutral-50 rounded-xl', className)}>
	<!-- Keyboard Title -->
	{#if showFingerGuide}
		<div class="mb-4 text-center">
			<p class="text-sm font-medium text-neutral-700">
				Follow the color guide - each finger has its own color!
			</p>
		</div>
	{/if}

	<!-- Keyboard Layout -->
	<div class="space-y-2 pb-10">
		{#each qwertzLayout as row, rowIndex}
			<div
				class="flex justify-center gap-1"
				style={row.offset ? `padding-left: ${row.offset * 2}rem` : ''}
			>
				{#each row.keys as keyDef}
					<div class={getKeyClasses(keyDef)} style={getKeyStyle(keyDef)}>
						<!-- Dynamic label based on modifier keys -->
						<span class="text-lg font-bold">
							{getDisplayLabel(keyDef)}
						</span>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- Finger Hint (shown below keyboard when current key is active) -->
	{#if showFingerGuide && currentKeyDef}
		<div class="mt-6 text-center">
			<div class="inline-flex items-center gap-3 px-4 py-3 bg-primary-50 border-2 border-primary-200 rounded-lg shadow-sm">
				<div class="w-0 h-0 border-l-6 border-r-6 border-b-8 border-transparent border-b-primary-500"></div>
				<span class="text-base font-bold text-primary-700">
					Benutze deinen {getFingerNameInGerman(currentKeyDef.finger)}
				</span>
			</div>
		</div>
	{/if}

	<!-- Finger Legend -->
	{#if showFingerGuide}
		<div class="mt-8 pt-6 border-t border-neutral-200">
			<p class="text-sm font-semibold text-neutral-700 text-center mb-4">Finger-Farben-Zuordnung</p>
			<div class="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
				{#each Object.entries(fingerColorMap) as [finger, colors]}
					<div class="flex items-center gap-2">
						<div
							class="w-10 h-10 rounded-lg border-2 shadow-sm"
							style="background-color: {colors.bg}; border-color: {colors.border};"
						></div>
						<span class="text-sm font-medium text-neutral-700 whitespace-nowrap">
							{getFingerNameInGerman(finger as KeyFinger)}
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
	/* Glowing pulse animation for current key - more visible */
	@keyframes glow-pulse {
		0%, 100% {
			box-shadow:
				0 0 10px 2px rgba(59, 130, 246, 0.4),
				0 0 20px 4px rgba(59, 130, 246, 0.2),
				0 4px 6px -1px rgba(0, 0, 0, 0.1);
		}
		50% {
			box-shadow:
				0 0 20px 4px rgba(59, 130, 246, 0.6),
				0 0 40px 8px rgba(59, 130, 246, 0.3),
				0 10px 15px -3px rgba(0, 0, 0, 0.2);
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

	.animate-glow-pulse {
		animation: glow-pulse 1.2s ease-in-out infinite;
	}

	.animate-bounce {
		animation: bounce 0.6s ease-in-out infinite;
	}
</style>

