<script lang="ts">
	import { cn } from '../../utils/index.js';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import type { ConfirmationDialogProps } from './ConfirmationDialog.types.js';

	interface Props extends ConfirmationDialogProps {
		children?: import('svelte').Snippet;
	}

	let {
		open = $bindable(false),
		title,
		message,
		icon,
		iconColor = 'danger',
		confirmLabel = 'Confirm',
		confirmColor = 'danger',
		cancelLabel = 'Cancel',
		loading = false,
		onConfirm,
		onCancel,
		closeOnBackdropClick = true,
		closeOnEscape = true,
		class: className = '',
		children
	}: Props = $props();

	// Debug logging - VERSION 2025-01-06-21:00 🔴
	$effect(() => {
		if (open) {
			console.log('[ConfirmationDialog] 🔴 VERSION 2025-01-06-21:00 🔴 Props:', {
				confirmColor,
				confirmLabel,
				cancelLabel,
				loading,
				hasOnConfirm: typeof onConfirm === 'function',
				hasOnCancel: typeof onCancel === 'function'
			});
		}
	});

	// Icon color classes mapping
	const iconColorClasses = {
		primary: 'text-primary-600',
		secondary: 'text-secondary-600',
		success: 'text-success-600',
		danger: 'text-danger-600',
		warning: 'text-warning-600'
	};

	// Reactive CSS variables for button colors
	let confirmButtonStyle = $derived.by(() => {
		const colorMap = {
			danger: { bg: 'var(--color-danger-600)', hover: 'var(--color-danger-700)', ring: 'var(--color-danger-500)' },
			primary: { bg: 'var(--color-primary-600)', hover: 'var(--color-primary-700)', ring: 'var(--color-primary-500)' },
			success: { bg: 'var(--color-success-600)', hover: 'var(--color-success-700)', ring: 'var(--color-success-500)' },
			warning: { bg: 'var(--color-warning-600)', hover: 'var(--color-warning-700)', ring: 'var(--color-warning-500)' },
			secondary: { bg: 'var(--color-secondary-600)', hover: 'var(--color-secondary-700)', ring: 'var(--color-secondary-500)' }
		};
		const colors = colorMap[confirmColor] || colorMap.secondary;
		return `--btn-bg: ${colors.bg}; --btn-hover: ${colors.hover}; --btn-ring: ${colors.ring};`;
	});

	// Handle backdrop click
	function handleBackdropClick() {
		if (closeOnBackdropClick && !loading) {
			onCancel();
		}
	}

	// Handle escape key
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closeOnEscape && open && !loading) {
			onCancel();
		}
	}

	// Prevent body scroll when dialog is open
	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		};
	});
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-neutral-600/60 overflow-y-auto h-full w-full z-50"
		onclick={handleBackdropClick}
		role="presentation"
		aria-hidden="true"
		transition:fade={{ duration: 200 }}
	></div>

	<!-- Dialog -->
	<div
		class={cn(
			'fixed inset-0 flex items-center justify-center z-[60] pointer-events-none',
			className
		)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="dialog-title"
	>
		<div
			class="relative p-6 border w-full max-w-md shadow-xl rounded-lg bg-white/90 backdrop-blur-md pointer-events-auto mx-4"
			onclick={(e) => e.stopPropagation()}
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="text-center">
				<!-- Icon -->
				{#if icon}
					<svelte:component
						this={icon}
						class={cn('h-12 w-12 mx-auto mb-4', iconColorClasses[iconColor])}
					/>
				{/if}

				<!-- Title -->
				<h3 id="dialog-title" class="mb-2 text-lg font-semibold text-gray-900">
					{title}
				</h3>

				<!-- Message or Custom Content -->
				<div class="mb-6 text-sm text-gray-500">
					{#if children}
						{@render children()}
					{:else if message}
						<p>{message}</p>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex justify-center space-x-3">
					<button
						type="button"
						class="inline-flex items-center justify-center gap-2 px-4 py-2 text-base bg-white hover:bg-neutral-50 text-primary-700 border border-primary-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
						onclick={onCancel}
						disabled={loading}
					>
						{cancelLabel}
					</button>

					<!-- Confirm button using CSS custom properties -->
					<button
						type="button"
						class="confirmation-dialog-confirm-btn"
						style={confirmButtonStyle}
						onclick={async () => {
							console.log('[ConfirmationDialog] Confirm button clicked', { hasOnConfirm: typeof onConfirm === 'function' });
							if (typeof onConfirm === 'function') {
								const result = onConfirm();
								console.log('[ConfirmationDialog] onConfirm called, result:', result);
								if (result instanceof Promise) {
									await result;
								}
							} else {
								console.error('[ConfirmationDialog] onConfirm is not a function!', typeof onConfirm);
							}
						}}
						disabled={loading}
					>
						{#if loading}
							<svg
								class="animate-spin h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						{/if}
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Confirmation button styles using CSS custom properties */
	.confirmation-dialog-confirm-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 500;
		color: white;
		background-color: var(--btn-bg);
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		outline: none;
	}

	.confirmation-dialog-confirm-btn:hover:not(:disabled) {
		background-color: var(--btn-hover);
	}

	.confirmation-dialog-confirm-btn:focus {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--btn-ring) 10%, transparent);
	}

	.confirmation-dialog-confirm-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
