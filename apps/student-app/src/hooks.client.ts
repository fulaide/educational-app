import { initI18n } from '@educational-app/i18n'

// Initialize i18n on client side
initI18n()

// Set up locale detection and persistence
import { localeManager } from '@educational-app/i18n'

// Initialize locale manager (will auto-detect browser/stored locale)
const currentLocale = localeManager.getCurrentLocale()
console.log('Student app initialized with locale:', currentLocale)

// Update document language attribute
if (typeof document !== 'undefined') {
	document.documentElement.lang = currentLocale
}

// Listen for locale changes
import { locale } from '@educational-app/i18n'
locale.subscribe((newLocale) => {
	if (typeof document !== 'undefined' && newLocale) {
		document.documentElement.lang = newLocale
	}
})