<script lang="ts">
	import { cn } from '@educational-app/ui';
	import type { MathProblem } from '@educational-app/learning';

	interface Props {
		problem: MathProblem | null;
		userInput?: string;
		showCorrectAnswer?: boolean;
		isCorrect?: boolean;
		class?: string;
	}

	let {
		problem,
		userInput = '',
		showCorrectAnswer = false,
		isCorrect,
		class: className
	}: Props = $props();

	// Parse the display string and replace __ with input box
	const displayParts = $derived(() => {
		if (!problem) return [];

		const parts: Array<{ type: 'text' | 'input'; value: string }> = [];
		const display = problem.display;

		// Split by __ (the blank)
		const segments = display.split('__');

		if (segments.length === 2) {
			// Add left part
			if (segments[0].trim()) {
				parts.push({ type: 'text', value: segments[0].trim() });
			}

			// Add input placeholder
			parts.push({ type: 'input', value: '' });

			// Add right part
			if (segments[1].trim()) {
				parts.push({ type: 'text', value: segments[1].trim() });
			}
		} else {
			// Fallback: show entire display as text
			parts.push({ type: 'text', value: display });
		}

		return parts;
	});

	// Input display value
	const inputValue = $derived(
		showCorrectAnswer && problem
			? String(problem.correctAnswer)
			: userInput || '_'
	);

	// Input styling based on state
	const inputClasses = $derived(
		cn(
			'inline-flex items-center justify-center',
			'min-w-[3.5rem] px-3 py-2 mx-2',
			'rounded-lg border-2 transition-all duration-200',
			'font-bold text-4xl sm:text-5xl',

			// States
			isCorrect === true && 'bg-success-100 border-success-500 text-success-700',
			isCorrect === false && 'bg-danger-100 border-danger-500 text-danger-700',
			isCorrect === undefined && userInput && 'bg-primary-50 border-primary-400 text-primary-700',
			isCorrect === undefined && !userInput && 'bg-neutral-100 border-neutral-300 text-neutral-400',

			// Animation for correct/incorrect
			isCorrect === true && 'animate-pop',
			isCorrect === false && 'animate-shake'
		)
	);
</script>

<div class={cn('flex flex-col items-center', className)}>
	{#if problem}
		<!-- Problem Display -->
		<div class="flex items-center justify-center flex-wrap gap-2 text-4xl sm:text-5xl font-bold text-neutral-800">
			{#each displayParts() as part}
				{#if part.type === 'text'}
					<span class="whitespace-nowrap">{part.value}</span>
				{:else}
					<span class={inputClasses}>
						{inputValue}
					</span>
				{/if}
			{/each}
		</div>

		<!-- Difficulty and Zehnerübergang indicators -->
		<div class="flex items-center gap-3 mt-4">
			<span class="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600">
				{problem.difficulty === 'easy' ? 'Leicht' :
				 problem.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
			</span>

			{#if problem.hasZehneruebergang}
				<span class="px-3 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
					Zehnerübergang
				</span>
			{/if}
		</div>
	{:else}
		<!-- Loading/empty state -->
		<div class="flex items-center justify-center h-32 text-neutral-400">
			<span class="text-xl">Lade Aufgabe...</span>
		</div>
	{/if}
</div>

<style>
	/* Pop animation for correct answer */
	@keyframes pop {
		0% { transform: scale(1); }
		50% { transform: scale(1.15); }
		100% { transform: scale(1); }
	}

	/* Shake animation for incorrect answer */
	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
		20%, 40%, 60%, 80% { transform: translateX(4px); }
	}

	.animate-pop {
		animation: pop 0.4s ease-out;
	}

	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}
</style>
