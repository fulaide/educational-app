<script lang="ts">
	import { locale } from 'svelte-i18n'
	import { localeManager } from '../index'
	import type { SupportedLocale } from '../types'

	export let variant: 'dropdown' | 'toggle' | 'compact' = 'dropdown'
	export let showFlags = true
	export let showLabels = true
	export let className = ''

	const supportedLocales = localeManager.getSupportedLocales()
	
	$: currentLocale = $locale as SupportedLocale

	function handleLocaleChange(newLocale: SupportedLocale) {
		localeManager.setLocale(newLocale)
	}

	function getFlag(localeCode: SupportedLocale): string {
		const flags: Record<SupportedLocale, string> = {
			de: '🇩🇪',
			en: '🇺🇸'
		}
		return flags[localeCode] || '🌍'
	}
</script>

{#if variant === 'dropdown'}
	<div class="language-switcher dropdown {className}">
		<label for="locale-select" class="sr-only">Language / Sprache</label>
		<select 
			id="locale-select"
			bind:value={currentLocale} 
			on:change={(e) => handleLocaleChange(e.currentTarget.value as SupportedLocale)}
			class="locale-select"
		>
			{#each supportedLocales as { code, name, nativeName }}
				<option value={code}>
					{#if showFlags}{getFlag(code)}{/if}
					{#if showLabels}
						{nativeName}
						{#if name !== nativeName}({name}){/if}
					{/if}
				</option>
			{/each}
		</select>
	</div>

{:else if variant === 'toggle'}
	<div class="language-switcher toggle {className}">
		<div class="toggle-group" role="radiogroup" aria-label="Language selection">
			{#each supportedLocales as { code, nativeName }}
				<button
					type="button"
					role="radio"
					aria-checked={currentLocale === code}
					class="toggle-button"
					class:active={currentLocale === code}
					on:click={() => handleLocaleChange(code)}
				>
					{#if showFlags}<span class="flag">{getFlag(code)}</span>{/if}
					{#if showLabels}<span class="label">{nativeName}</span>{/if}
				</button>
			{/each}
		</div>
	</div>

{:else if variant === 'compact'}
	<div class="language-switcher compact {className}">
		<button 
			type="button"
			class="compact-trigger"
			aria-label="Switch language"
			on:click={() => {
				const nextLocale = currentLocale === 'de' ? 'en' : 'de'
				handleLocaleChange(nextLocale)
			}}
		>
			{#if showFlags}
				<span class="current-flag">{getFlag(currentLocale)}</span>
			{/if}
			{#if showLabels}
				<span class="current-label">
					{supportedLocales.find(l => l.code === currentLocale)?.nativeName || currentLocale}
				</span>
			{/if}
			<svg class="switch-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
				<path d="M8 12l-4-4h8l-4 4z"/>
			</svg>
		</button>
	</div>
{/if}

<style>
	.language-switcher {
		display: inline-block;
		font-size: 14px;
	}

	/* Dropdown Variant */
	.dropdown .locale-select {
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		padding: 8px 12px;
		font-size: inherit;
		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	.dropdown .locale-select:hover {
		border-color: #9ca3af;
	}

	.dropdown .locale-select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* Toggle Variant */
	.toggle .toggle-group {
		display: flex;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		overflow: hidden;
	}

	.toggle .toggle-button {
		background: white;
		border: none;
		padding: 8px 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 4px;
		border-right: 1px solid #d1d5db;
	}

	.toggle .toggle-button:last-child {
		border-right: none;
	}

	.toggle .toggle-button:hover {
		background: #f3f4f6;
	}

	.toggle .toggle-button.active {
		background: #3b82f6;
		color: white;
	}

	.toggle .flag {
		font-size: 16px;
		line-height: 1;
	}

	.toggle .label {
		font-size: 12px;
		font-weight: 500;
	}

	/* Compact Variant */
	.compact .compact-trigger {
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		padding: 6px 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 4px;
		transition: all 0.2s ease;
	}

	.compact .compact-trigger:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.compact .current-flag {
		font-size: 14px;
		line-height: 1;
	}

	.compact .current-label {
		font-size: 12px;
		font-weight: 500;
	}

	.compact .switch-icon {
		width: 12px;
		height: 12px;
		opacity: 0.5;
	}

	/* Accessibility */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.dropdown .locale-select,
		.toggle .toggle-button,
		.compact .compact-trigger {
			background: #374151;
			border-color: #4b5563;
			color: #f9fafb;
		}

		.dropdown .locale-select:hover,
		.compact .compact-trigger:hover {
			border-color: #6b7280;
		}

		.toggle .toggle-button:hover {
			background: #4b5563;
		}

		.compact .compact-trigger:hover {
			background: #4b5563;
		}
	}

	/* Mobile optimizations */
	@media (max-width: 640px) {
		.language-switcher {
			font-size: 12px;
		}

		.dropdown .locale-select,
		.toggle .toggle-button,
		.compact .compact-trigger {
			padding: 6px 8px;
		}

		.toggle .flag {
			font-size: 14px;
		}

		.toggle .label {
			font-size: 11px;
		}
	}
</style>