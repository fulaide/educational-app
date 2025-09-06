import { addMessages, init, getLocaleFromNavigator, _, locale, locales } from 'svelte-i18n'
import type { TranslationObject } from './types'

// Import translation files
import en from './locales/en.json'
import de from './locales/de.json'

// Supported locales
export const SUPPORTED_LOCALES = ['en', 'de'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// Default locale
export const DEFAULT_LOCALE: SupportedLocale = 'de' // German first as per requirements

/**
 * Initialize i18n system
 */
export function initI18n() {
	// Add messages for each locale
	addMessages('en', en)
	addMessages('de', de)

	// Initialize with user's preferred locale or default
	init({
		fallbackLocale: DEFAULT_LOCALE,
		initialLocale: getLocaleFromNavigator() || DEFAULT_LOCALE,
		loadingDelay: 200,
		formats: {
			number: {
				EUR: { style: 'currency', currency: 'EUR' }
			}
		},
		warnOnMissingMessages: true
	})
}

// Re-export translation function with type safety
export { _ as t, locale, locales } from 'svelte-i18n'
export type { 
  SupportedLocale, 
  TranslationKey, 
  LocalizedContent,
  LocalizedLearningContent,
  LocalizedVocabulary,
  LocalizedAchievement,
  TranslationContext
} from './types'

/**
 * Get browser language preference
 */
export function getBrowserLocale(): SupportedLocale {
	if (typeof navigator === 'undefined') return DEFAULT_LOCALE
	
	const browserLang = navigator.language.split('-')[0] as SupportedLocale
	return SUPPORTED_LOCALES.includes(browserLang) ? browserLang : DEFAULT_LOCALE
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale?: SupportedLocale): string {
	const targetLocale = locale || DEFAULT_LOCALE
	return new Intl.DateTimeFormat(targetLocale === 'de' ? 'de-DE' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(date)
}

/**
 * Format time according to locale
 */
export function formatTime(date: Date, locale?: SupportedLocale): string {
	const targetLocale = locale || DEFAULT_LOCALE
	return new Intl.DateTimeFormat(targetLocale === 'de' ? 'de-DE' : 'en-US', {
		hour: '2-digit',
		minute: '2-digit'
	}).format(date)
}

/**
 * Format number according to locale
 */
export function formatNumber(num: number, locale?: SupportedLocale): string {
	const targetLocale = locale || DEFAULT_LOCALE
	return new Intl.NumberFormat(targetLocale === 'de' ? 'de-DE' : 'en-US').format(num)
}

/**
 * Educational content localization helpers
 */
export interface LocalizedContent {
	de: string
	en: string
}

export function getLocalizedContent(
	content: LocalizedContent | string, 
	locale?: SupportedLocale
): string {
	if (typeof content === 'string') return content
	
	const targetLocale = locale || DEFAULT_LOCALE
	return content[targetLocale] || content[DEFAULT_LOCALE]
}

/**
 * Vocabulary word localization
 */
export interface LocalizedVocabulary {
	word: LocalizedContent
	translation?: LocalizedContent
	phonetic?: LocalizedContent
	definition?: LocalizedContent
}

export function getVocabularyForLocale(
	vocab: LocalizedVocabulary,
	primaryLang: SupportedLocale,
	translationLang?: SupportedLocale
) {
	return {
		word: getLocalizedContent(vocab.word, primaryLang),
		translation: vocab.translation ? 
			getLocalizedContent(vocab.translation, translationLang || 'en') : undefined,
		phonetic: vocab.phonetic ? 
			getLocalizedContent(vocab.phonetic, primaryLang) : undefined,
		definition: vocab.definition ? 
			getLocalizedContent(vocab.definition, primaryLang) : undefined
	}
}

/**
 * Advanced locale management utilities
 */
export class LocaleManager {
	private static instance: LocaleManager
	private currentLocale: SupportedLocale = DEFAULT_LOCALE
	private fallbackLocale: SupportedLocale = 'de'
	private storage: Storage | null = null

	constructor() {
		if (typeof localStorage !== 'undefined') {
			this.storage = localStorage
			this.currentLocale = this.getStoredLocale() || this.getBrowserLocale()
		}
	}

	static getInstance(): LocaleManager {
		if (!LocaleManager.instance) {
			LocaleManager.instance = new LocaleManager()
		}
		return LocaleManager.instance
	}

	/**
	 * Get current locale
	 */
	getCurrentLocale(): SupportedLocale {
		return this.currentLocale
	}

	/**
	 * Set locale and persist to storage
	 */
	setLocale(newLocale: SupportedLocale): void {
		if (!SUPPORTED_LOCALES.includes(newLocale)) {
			console.warn(`Unsupported locale: ${newLocale}, falling back to ${this.fallbackLocale}`)
			newLocale = this.fallbackLocale
		}

		this.currentLocale = newLocale
		
		// Update svelte-i18n
		locale.set(newLocale)
		
		// Persist to storage
		if (this.storage) {
			this.storage.setItem('edu-app-locale', newLocale)
		}

		// Update document language
		if (typeof document !== 'undefined') {
			document.documentElement.lang = newLocale
		}
		
		// Sync to database if user is authenticated (browser only)
		if (typeof window !== 'undefined') {
			this.syncLocaleToDatabase(newLocale).catch(console.error)
		}
	}
	
	/**
	 * Sync locale preference to user's database settings
	 */
	private async syncLocaleToDatabase(locale: SupportedLocale): Promise<void> {
		try {
			const response = await fetch('/api/user/locale', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ locale })
			})
			
			if (!response.ok) {
				console.warn('Failed to sync locale to database:', response.statusText)
			}
		} catch (error) {
			console.warn('Failed to sync locale to database:', error)
		}
	}

	/**
	 * Get stored locale from localStorage
	 */
	private getStoredLocale(): SupportedLocale | null {
		if (!this.storage) return null
		
		const stored = this.storage.getItem('edu-app-locale') as SupportedLocale
		return stored && SUPPORTED_LOCALES.includes(stored) ? stored : null
	}

	/**
	 * Get browser's preferred locale
	 */
	private getBrowserLocale(): SupportedLocale {
		return getBrowserLocale()
	}

	/**
	 * Check if locale is supported
	 */
	isLocaleSupported(locale: string): locale is SupportedLocale {
		return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
	}

	/**
	 * Get all supported locales with display names
	 */
	getSupportedLocales(): Array<{ code: SupportedLocale; name: string; nativeName: string }> {
		return [
			{ code: 'de', name: 'German', nativeName: 'Deutsch' },
			{ code: 'en', name: 'English', nativeName: 'English' }
		]
	}

	/**
	 * Get locale-specific route prefix
	 */
	getRoutePrefix(): string {
		return this.currentLocale === DEFAULT_LOCALE ? '' : `/${this.currentLocale}`
	}

	/**
	 * Get localized route path
	 */
	getLocalizedRoute(path: string): string {
		const prefix = this.getRoutePrefix()
		return `${prefix}${path.startsWith('/') ? path : `/${path}`}`
	}
}

// Global locale manager instance
export const localeManager = LocaleManager.getInstance()