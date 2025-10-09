<script lang="ts">
	import { onMount } from 'svelte';
	import { localeManager, type SupportedLocale } from '@educational-app/i18n';
	import { cn } from '../../utils/index.js';
	import { Languages } from 'lucide-svelte';

	interface Props {
		class?: string;
		variant?: 'dropdown' | 'buttons' | 'toggle';
		size?: 'sm' | 'md' | 'lg';
		compact?: boolean; // For sidebar/collapsed views
	}

	let { 
		class: className,
		variant = 'dropdown',
		size = 'md',
		compact = false
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

	function toggleLanguage() {
		// Simple toggle between EN and DE
		const newLocale: SupportedLocale = currentLocale === 'en' ? 'de' : 'en';
		handleLocaleChange(newLocale);
	}

	// Helper to get the target (switch-to) language
	const targetLocale = $derived(currentLocale === 'en' ? 'de' : 'en');
	
	// Helper to get switch-to language label
	const switchToLabel = $derived(
		currentLocale === 'en' ? 'Deutsch wechseln' : 'Switch to English'
	);

	const sizeClasses = {
		sm: 'px-2 py-1 text-sm',
		md: 'px-3 py-2 text-sm',
		lg: 'px-4 py-3 text-base'
	};

	const buttonClasses = $derived(
		cn(
			'inline-flex items-center font-medium rounded-md transition-colors',
			'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
			'hover:bg-primary-500/10 text-primary-700',
			compact ? 'gap-1' : 'gap-2',
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
			<span class="rounded border border-primary-300 flex items-center justify-center text-xs font-medium text-text-muted">
				{currentLocale.toUpperCase()}
			</span>
			{#if !compact}
				<!-- {supportedLocales.find(l => l.code === currentLocale)?.nativeName} -->
				{switchToLabel}
			{/if}
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
				class="absolute right-0 z-50 mt-2 {compact ? 'w-40' : 'w-48'} origin-top-right rounded-md bg-surface shadow-lg ring-1 ring-border focus:outline-none"
				role="menu" 
				aria-orientation="vertical"
			>
				<div class="py-1" role="none">
					{#each supportedLocales as locale}
						<button
							type="button"
							onclick={() => handleLocaleChange(locale.code)}
							class="flex w-full items-center {compact ? 'gap-2 px-3 py-2' : 'gap-3 px-4 py-2'} text-left text-sm text-text hover:bg-surface-hover hover:text-text {currentLocale === locale.code ? 'bg-primary-100/50 font-medium text-primary-900' : ''}"
							role="menuitem"
						>
							<span class="w-5 h-3 rounded border border-border bg-surface-muted flex items-center justify-center text-xs font-medium text-text-muted">
								{locale.code.toUpperCase()}
							</span>
							{#if !compact}
								<span class="flex-1">{locale.nativeName}</span>
							{/if}
							{#if currentLocale === locale.code}
								<svg class="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
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
						? 'bg-primary-500 text-text-on-primary hover:bg-primary-600' 
						: 'bg-surface text-text hover:bg-surface-hover'
				)}
			>
				<span class="w-4 h-3 rounded border border-border bg-surface-muted flex items-center justify-center text-xs font-medium text-text-muted">
					{locale.code.toUpperCase()}
				</span>
			</button>
		{/each}
	</div>
{:else if variant === 'toggle'}
	<!-- Simple Toggle Button with Globe Icon -->
	<button
		type="button"
		onclick={toggleLanguage}
		class={cn(
			buttonClasses,
			'bg-surface hover:bg-surface-hover border border-border'
		)}
		title={switchToLabel}
	>
		<!-- Languages Icon -->
		<Languages class="w-4 h-4 text-primary-600" />
		
		<!-- Show full label on desktop, language code on tablet/mobile -->
		<span class="text-xs text-primary-600 font-medium hidden  { compact ? "" : "md:inline-flex"}">
			{switchToLabel}
		</span>
		<span class="flex items-center justify-center text-xs font-medium text-primary-600 { compact ? "" : "md:hidden"} ">
			{targetLocale.toUpperCase()}
		</span>
	</button>
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