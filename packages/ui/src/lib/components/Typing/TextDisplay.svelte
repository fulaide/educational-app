<script lang="ts">
	import { cn } from '$lib/utils/index.js';
	import type { WordState } from '@educational-app/learning';

	interface Props {
		words: WordState[];
		currentWordIndex: number;
		windowSize?: number;
		class?: string;
	}

	let { words, currentWordIndex, windowSize = 5, class: className }: Props = $props();

	// Get visible window of words
	const visibleWindow = $derived.by(() => {
		const start = Math.max(0, currentWordIndex - 1);
		const end = Math.min(words.length, start + windowSize);
		return {
			words: words.slice(start, end),
			start
		};
	});

	const visibleWords = $derived(visibleWindow.words);

	// Calculate the index within the visible window (offset from window start)
	const visibleCurrentIndex = $derived(currentWordIndex - visibleWindow.start);

	/**
	 * Get CSS class for a character based on its state
	 */
	function getCharClass(isCorrect: boolean | null, isCurrent: boolean): string {
		if (isCurrent && isCorrect === null) {
			return 'bg-primary-100 border-b-2 border-primary-500 text-neutral-900';
		}
		if (isCorrect === true) {
			return 'text-success-600';
		}
		if (isCorrect === false) {
			return 'text-danger-600 bg-danger-50';
		}
		return 'text-neutral-400';
	}

	/**
	 * Get CSS class for a word based on its state
	 */
	function getWordClass(wordIndex: number, word: WordState): string {
		const isCurrentWord = wordIndex === visibleCurrentIndex;
		const isPastWord = wordIndex < visibleCurrentIndex;
		const isFutureWord = wordIndex > visibleCurrentIndex;

		if (isCurrentWord) {
			return 'scale-110 opacity-100';
		}
		if (isPastWord) {
			return word.errors > 0 ? 'opacity-60' : 'opacity-50';
		}
		if (isFutureWord) {
			return 'opacity-40';
		}
		return 'opacity-30';
	}
</script>

<div class={cn('w-full py-12 px-8 bg-surface rounded-xl', className)}>
	<!-- Text Display Area -->
	<div class="flex flex-wrap items-center justify-center gap-y-4 min-h-[200px]">
		{#each visibleWords as word, wordIndex (wordIndex)}
			<div
				class={cn(
					'inline-flex items-center transition-all duration-300 ease-out',
					getWordClass(wordIndex, word)
				)}
			>
				<!-- Individual Characters (including space at end if present) -->
				{#each word.characters as char, charIndex}
					{@const isCurrent = wordIndex === visibleCurrentIndex && charIndex === word.characters.findIndex(c => c.isCorrect === null)}
					{@const isSpace = char.char === ' '}
					<span
						class={cn(
							'inline-block text-4xl font-mono font-semibold transition-all duration-150',
							isSpace ? 'px-2 py-2' : 'px-0.5 py-2',
							getCharClass(char.isCorrect, isCurrent)
						)}
					>
						{char.char}
					</span>
				{/each}

				<!-- Word Error Indicator -->
				{#if word.isComplete && word.errors > 0}
					<span
						class="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-danger-500 rounded-full"
					>
						{word.errors}
					</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
