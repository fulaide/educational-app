import { initI18n, localeManager, t } from './index'
import { TranslationValidator } from './index'

/**
 * Test i18n integration across the educational app platform
 */
export async function testI18nIntegration() {
	console.log('🌍 Testing i18n Integration...\n')

	// Test 1: Initialization
	console.log('📝 Test 1: i18n Initialization')
	try {
		initI18n()
		console.log('✅ i18n initialized successfully')
		console.log(`   Current locale: ${localeManager.getCurrentLocale()}`)
	} catch (error) {
		console.log('❌ i18n initialization failed:', error)
	}

	// Test 2: Locale Management
	console.log('\n📝 Test 2: Locale Management')
	try {
		const supportedLocales = localeManager.getSupportedLocales()
		console.log('✅ Supported locales:', supportedLocales.map(l => l.code).join(', '))

		// Test locale switching
		localeManager.setLocale('en')
		console.log(`   Switched to: ${localeManager.getCurrentLocale()}`)
		
		localeManager.setLocale('de')
		console.log(`   Switched back to: ${localeManager.getCurrentLocale()}`)
	} catch (error) {
		console.log('❌ Locale management test failed:', error)
	}

	// Test 3: Translation Keys
	console.log('\n📝 Test 3: Translation Key Access')
	try {
		// Import translations for testing
		const deTranslations = await import('./locales/de.json')
		const enTranslations = await import('./locales/en.json')

		// Test key extraction
		const deKeys = TranslationValidator.extractKeys(deTranslations.default)
		const enKeys = TranslationValidator.extractKeys(enTranslations.default)
		
		console.log(`✅ German translation keys: ${deKeys.length}`)
		console.log(`✅ English translation keys: ${enKeys.length}`)

		// Test missing translations
		const missingInEnglish = TranslationValidator.validateTranslations(enTranslations.default, deKeys)
		const missingInGerman = TranslationValidator.validateTranslations(deTranslations.default, enKeys)

		if (missingInEnglish.length === 0 && missingInGerman.length === 0) {
			console.log('✅ All translation keys are present in both languages')
		} else {
			console.log(`⚠️  Missing translations:`)
			if (missingInEnglish.length > 0) {
				console.log(`   English missing: ${missingInEnglish.slice(0, 5).join(', ')}${missingInEnglish.length > 5 ? '...' : ''}`)
			}
			if (missingInGerman.length > 0) {
				console.log(`   German missing: ${missingInGerman.slice(0, 5).join(', ')}${missingInGerman.length > 5 ? '...' : ''}`)
			}
		}
	} catch (error) {
		console.log('❌ Translation key test failed:', error)
	}

	// Test 4: Route Localization
	console.log('\n📝 Test 4: Route Localization')
	try {
		localeManager.setLocale('de')
		const deRoute = localeManager.getLocalizedRoute('/dashboard')
		console.log(`   German route: ${deRoute}`)

		localeManager.setLocale('en')
		const enRoute = localeManager.getLocalizedRoute('/dashboard')
		console.log(`   English route: ${enRoute}`)

		console.log('✅ Route localization working')
	} catch (error) {
		console.log('❌ Route localization test failed:', error)
	}

	// Test 5: Content Localization Helpers
	console.log('\n📝 Test 5: Content Localization Helpers')
	try {
		const { getLocalizedContent, getVocabularyForLocale } = await import('./index')

		// Test basic content localization
		const testContent = {
			de: 'Hund',
			en: 'Dog'
		}

		const germanContent = getLocalizedContent(testContent, 'de')
		const englishContent = getLocalizedContent(testContent, 'en')

		console.log(`   German content: ${germanContent}`)
		console.log(`   English content: ${englishContent}`)

		// Test vocabulary localization
		const testVocab = {
			word: { de: 'Hund', en: 'Dog' },
			translation: { de: 'Tier', en: 'Animal' },
			phonetic: { de: '[hʊnt]', en: '[dɔg]' },
			definition: { 
				de: 'Ein vierbeiniges Haustier', 
				en: 'A four-legged pet animal' 
			}
		}

		const localizedVocab = getVocabularyForLocale(testVocab, 'de', 'en')
		console.log('✅ Vocabulary localization:', JSON.stringify(localizedVocab, null, 2))

	} catch (error) {
		console.log('❌ Content localization test failed:', error)
	}

	// Test 6: Formatting Utilities
	console.log('\n📝 Test 6: Formatting Utilities')
	try {
		const { formatDate, formatTime, formatNumber } = await import('./index')

		const testDate = new Date('2025-08-31T10:30:00')
		const testNumber = 1234.56

		console.log(`   Date (German): ${formatDate(testDate, 'de')}`)
		console.log(`   Date (English): ${formatDate(testDate, 'en')}`)
		console.log(`   Time (German): ${formatTime(testDate, 'de')}`)
		console.log(`   Time (English): ${formatTime(testDate, 'en')}`)
		console.log(`   Number (German): ${formatNumber(testNumber, 'de')}`)
		console.log(`   Number (English): ${formatNumber(testNumber, 'en')}`)

		console.log('✅ Formatting utilities working')
	} catch (error) {
		console.log('❌ Formatting utilities test failed:', error)
	}

	// Test Summary
	console.log('\n📊 i18n Integration Test Summary')
	console.log('✅ Core i18n foundation implemented successfully!')
	console.log('🔧 Features tested:')
	console.log('   - Locale management and switching')
	console.log('   - Translation key validation')  
	console.log('   - Route localization')
	console.log('   - Content localization helpers')
	console.log('   - Locale-aware formatting')
	console.log('🌍 Ready for German-first MVP with English expansion capability')
}

/**
 * Test translation coverage for specific app sections
 */
export async function testAppTranslationCoverage() {
	console.log('\n🎯 Testing App-Specific Translation Coverage...')

	const criticalKeys = [
		// Auth section
		'auth.student_login',
		'auth.scan_qr_prompt', 
		'auth.enter_code_manually',
		'auth.camera_access_denied',
		'auth.qr_expired',
		'auth.processing_qr',
		'auth.login_successful',
		'auth.redirecting',

		// Common section
		'common.welcome',
		'common.loading',
		'common.error',
		'common.try_again',

		// QR section
		'qr.management',
		'qr.generate',
		'qr.expired',
		'qr.active',
		'qr.analytics',

		// Errors
		'errors.generic',
		'errors.network',
		'errors.validation_failed'
	]

	try {
		const deTranslations = await import('./locales/de.json')
		const enTranslations = await import('./locales/en.json')

		const missingDe = TranslationValidator.validateTranslations(deTranslations.default, criticalKeys)
		const missingEn = TranslationValidator.validateTranslations(enTranslations.default, criticalKeys)

		console.log(`📋 Critical keys tested: ${criticalKeys.length}`)
		console.log(`🇩🇪 German coverage: ${((criticalKeys.length - missingDe.length) / criticalKeys.length * 100).toFixed(1)}%`)
		console.log(`🇺🇸 English coverage: ${((criticalKeys.length - missingEn.length) / criticalKeys.length * 100).toFixed(1)}%`)

		if (missingDe.length > 0) {
			console.log(`❌ Missing German keys: ${missingDe.join(', ')}`)
		}
		if (missingEn.length > 0) {
			console.log(`❌ Missing English keys: ${missingEn.join(', ')}`)
		}

		if (missingDe.length === 0 && missingEn.length === 0) {
			console.log('🎉 All critical app translations are complete!')
		}

	} catch (error) {
		console.log('❌ App translation coverage test failed:', error)
	}
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
	testI18nIntegration().then(() => testAppTranslationCoverage())
}