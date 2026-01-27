<script lang="ts">
	import { cn } from '@educational-app/ui';

	interface Props {
		disabled?: boolean;
		onInput?: (digit: string) => void;
		onDelete?: () => void;
		onSubmit?: () => void;
		currentValue?: string;
		maxLength?: number;
		class?: string;
	}

	let {
		disabled = false,
		onInput,
		onDelete,
		onSubmit,
		currentValue = '',
		maxLength = 3,
		class: className
	}: Props = $props();

	// Check if can add more digits
	const canAddDigit = $derived(currentValue.length < maxLength);
	const canDelete = $derived(currentValue.length > 0);
	const canSubmit = $derived(currentValue.length > 0);

	// Keypad layout: 7-8-9, 4-5-6, 1-2-3, 0-⌫-✓
	const keypadRows = [
		['7', '8', '9'],
		['4', '5', '6'],
		['1', '2', '3'],
		['0', 'delete', 'submit']
	];

	function handleKeyPress(key: string) {
		if (disabled) return;

		if (key === 'delete') {
			if (canDelete && onDelete) {
				onDelete();
			}
		} else if (key === 'submit') {
			if (canSubmit && onSubmit) {
				onSubmit();
			}
		} else {
			if (canAddDigit && onInput) {
				onInput(key);
			}
		}
	}

	// Listen for keyboard input
	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		const key = event.key;

		// Numbers 0-9
		if (/^[0-9]$/.test(key)) {
			event.preventDefault();
			if (canAddDigit && onInput) {
				onInput(key);
			}
		}
		// Backspace or Delete
		else if (key === 'Backspace' || key === 'Delete') {
			event.preventDefault();
			if (canDelete && onDelete) {
				onDelete();
			}
		}
		// Enter
		else if (key === 'Enter') {
			event.preventDefault();
			if (canSubmit && onSubmit) {
				onSubmit();
			}
		}
	}

	// Button classes
	function getButtonClasses(key: string): string {
		const isDelete = key === 'delete';
		const isSubmit = key === 'submit';
		const isNumber = !isDelete && !isSubmit;

		const isButtonDisabled = disabled ||
			(isNumber && !canAddDigit) ||
			(isDelete && !canDelete) ||
			(isSubmit && !canSubmit);

		return cn(
			// Base styles - large touch-friendly buttons
			'flex items-center justify-center',
			'min-w-[4.5rem] min-h-[4.5rem] sm:min-w-[5rem] sm:min-h-[5rem]',
			'rounded-xl border-2 transition-all duration-150',
			'font-bold text-2xl sm:text-3xl select-none',
			'shadow-md active:shadow-sm',

			// Color variants
			isSubmit && !isButtonDisabled && [
				'bg-success-500 hover:bg-success-600 active:bg-success-700',
				'border-success-600 text-white'
			],
			isDelete && !isButtonDisabled && [
				'bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400',
				'border-neutral-300 text-neutral-700'
			],
			isNumber && !isButtonDisabled && [
				'bg-white hover:bg-primary-50 active:bg-primary-100',
				'border-neutral-200 hover:border-primary-300 text-neutral-900'
			],

			// Disabled state
			isButtonDisabled && [
				'opacity-40 cursor-not-allowed',
				'bg-neutral-100 border-neutral-200 text-neutral-400'
			],

			// Active/press effect
			!isButtonDisabled && 'active:scale-95'
		);
	}

	function getKeyLabel(key: string): string {
		if (key === 'delete') return '⌫';
		if (key === 'submit') return '✓';
		return key;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class={cn('w-full max-w-sm mx-auto', className)}>
	<!-- Keypad grid -->
	<div class="grid grid-cols-3 gap-3 p-4">
		{#each keypadRows as row}
			{#each row as key}
				<button
					type="button"
					class={getButtonClasses(key)}
					onclick={() => handleKeyPress(key)}
					disabled={disabled ||
						(key !== 'delete' && key !== 'submit' && !canAddDigit) ||
						(key === 'delete' && !canDelete) ||
						(key === 'submit' && !canSubmit)}
					aria-label={key === 'delete' ? 'Löschen' : key === 'submit' ? 'Prüfen' : key}
				>
					{getKeyLabel(key)}
				</button>
			{/each}
		{/each}
	</div>

	<!-- Keyboard hint for desktop -->
	<p class="hidden sm:block text-center text-sm text-neutral-500 mt-2">
		Tip: Du kannst auch die Tastatur benutzen!
	</p>
</div>

<style>
	/* Ensure buttons don't get tiny on mobile */
	button {
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}
</style>
