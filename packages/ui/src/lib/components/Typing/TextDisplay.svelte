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
	const visibleWords = $derived.by(() => {
		const start = Math.max(0, currentWordIndex - 1);
		const end = Math.min(words.length, start + windowSize);
		return words.slice(start, end);
	});

	const visibleCurrentIndex = $derived(
		Math.min(currentWordIndex, visibleWords.length - 1)
	);

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
	<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 min-h-[200px]">
		{#each visibleWords as word, wordIndex (wordIndex)}
			<div
				class={cn(
					'inline-flex items-center transition-all duration-300 ease-out',
					getWordClass(wordIndex, word)
				)}
			>
				<!-- Individual Characters -->
				{#each word.characters as char, charIndex}
					{@const isCurrent = wordIndex === visibleCurrentIndex && charIndex === word.characters.findIndex(c => c.isCorrect === null)}
					<span
						class={cn(
							'inline-block text-4xl font-mono font-semibold px-1 py-2 transition-all duration-150',
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

	<!-- Progress Indicator -->
	<div class="mt-8 flex items-center justify-center gap-2">
		{#each words as word, idx}
			<div
				class={cn(
					'h-2 rounded-full transition-all duration-300',
					idx < currentWordIndex
						? 'bg-success-500 w-8'
						: idx === currentWordIndex
							? 'bg-primary-500 w-12'
							: 'bg-neutral-200 w-6'
				)}
			></div>
		{/each}
	</div>

	<!-- Word Counter -->
	<div class="mt-4 text-center text-sm text-neutral-500">
		Word {currentWordIndex + 1} of {words.length}
	</div>
</div>
