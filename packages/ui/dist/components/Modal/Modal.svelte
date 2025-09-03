<script lang="ts">
	import { cn } from '../../utils/index.js';
	import { X } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		closable?: boolean;
		persistent?: boolean;
		class?: string;
		children?: Snippet;
		onclose?: () => void;
	}

	let {
		open = $bindable(),
		title,
		size = 'md',
		closable = true,
		persistent = false,
		class: className,
		children,
		onclose
	}: Props = $props();

	const dispatch = createEventDispatcher();

	// Size variants
	const sizes = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-4xl'
	};

	const modalClasses = $derived(
		cn(
			'relative bg-white rounded-xl shadow-2xl w-full mx-4',
			sizes[size],
			className
		)
	);

	function handleClose() {
		if (closable) {
			open = false;
			onclose?.();
			dispatch('close');
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (!persistent && event.target === event.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closable && !persistent) {
			event.preventDefault();
			handleClose();
		}
	}

	// Focus trap management
	let modalElement: HTMLElement;
	let previouslyFocused: Element | null = null;

	$effect(() => {
		if (open) {
			previouslyFocused = document.activeElement;
			modalElement?.focus();
		} else {
			(previouslyFocused as HTMLElement)?.focus();
		}
	});
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
	>
		<!-- Modal -->
		<div
			bind:this={modalElement}
			class={modalClasses}
			transition:fly={{ duration: 300, y: -20 }}
			tabindex="-1"
		>
			<!-- Header -->
			{#if title || closable}
				<div class="flex items-center justify-between p-6 border-b border-gray-200">
					{#if title}
						<h2 id="modal-title" class="text-xl font-semibold text-gray-900">
							{title}
						</h2>
					{/if}
					
					{#if closable}
						<button
							type="button"
							class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
							onclick={handleClose}
							aria-label="Close modal"
						>
							<X class="w-5 h-5" />
						</button>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<div class={cn('p-6', {
				'pt-0': title || closable
			})}>
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}