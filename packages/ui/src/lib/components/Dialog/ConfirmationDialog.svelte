<script lang="ts">
	import { cn } from '$lib/utils/index.js';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import Button from '../Button/Button.svelte';
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

	// Icon color classes
	const iconColorClasses = {
		primary: 'text-primary-600',
		secondary: 'text-secondary-600',
		success: 'text-success-600',
		danger: 'text-danger-600',
		warning: 'text-warning-600'
	};

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
			'fixed inset-0 flex items-center justify-center z-50 pointer-events-none',
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
					<Button variant="outline" color="primary" onclick={onCancel} disabled={loading}>
						{cancelLabel}
					</Button>
					<Button
						variant="solid"
						color={confirmColor}
						onclick={onConfirm}
						disabled={loading}
						loading={loading}
					>
						{confirmLabel}
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
