<script lang="ts">
	import { onMount } from 'svelte';
	import { localeManager, type SupportedLocale } from '@educational-app/i18n';
	import { cn } from '../../utils/index.js';

	interface Props {
		class?: string;
		variant?: 'dropdown' | 'buttons';
		size?: 'sm' | 'md' | 'lg';
	}

	let { 
		class: className,
		variant = 'dropdown',
		size = 'md'
	}: Props = $props();

	let currentLocale = $state('de'); // Default fallback
	let isOpen = $state(false);
	let mounted = $state(false);

	const supportedLocales = localeManager.getSupportedLocales();

	onMount(() => {
		currentLocale = localeManager.getCurrentLocale();
		mounted = true;
	});

	function handleLocaleChange(newLocale: SupportedLocale) {
		localeManager.setLocale(newLocale);
		currentLocale = newLocale;
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	const sizeClasses = {
		sm: 'px-2 py-1 text-sm',
		md: 'px-3 py-2 text-sm',
		lg: 'px-4 py-3 text-base'
	};

	const buttonClasses = $derived(
		cn(
			'inline-flex items-center gap-2 font-medium rounded-md transition-colors',
			'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
			'hover:bg-surface-hover',
			sizeClasses[size],
			className
		)
	);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if mounted}
	{#if variant === 'dropdown'}
	<div class="relative inline-block text-left">
		<button
			type="button"
			onclick={toggleDropdown}
			class={buttonClasses}
			aria-expanded={isOpen}
			aria-haspopup="true"
		>
			<span class="w-5 h-3 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs font-medium">
				{currentLocale.toUpperCase()}
			</span>
			{supportedLocales.find(l => l.code === currentLocale)?.nativeName}
			<svg 
				class="h-4 w-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
				fill="none" 
				viewBox="0 0 24 24" 
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if isOpen}
			<div 
				class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				role="menu" 
				aria-orientation="vertical"
			>
				<div class="py-1" role="none">
					{#each supportedLocales as locale}
						<button
							type="button"
							onclick={() => handleLocaleChange(locale.code)}
							class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 {currentLocale === locale.code ? 'bg-gray-50 font-medium' : ''}"
							role="menuitem"
						>
							<span class="w-5 h-3 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs font-medium">
								{locale.code.toUpperCase()}
							</span>
							<span class="flex-1">{locale.nativeName}</span>
							{#if currentLocale === locale.code}
								<svg class="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="flex gap-1">
		{#each supportedLocales as locale}
			<button
				type="button"
				onclick={() => handleLocaleChange(locale.code)}
				class={cn(
					buttonClasses,
					currentLocale === locale.code 
						? 'bg-primary text-white hover:bg-primary-dark' 
						: 'bg-surface text-foreground hover:bg-surface-hover'
				)}
			>
				<span class="w-4 h-3 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs font-medium">
					{locale.code.toUpperCase()}
				</span>
			</button>
		{/each}
	</div>
	{/if}

	<!-- Click outside to close dropdown -->
	{#if isOpen && variant === 'dropdown'}
		<div 
			class="fixed inset-0 z-40" 
			onclick={() => isOpen = false}
			aria-hidden="true"
		></div>
	{/if}
{/if}