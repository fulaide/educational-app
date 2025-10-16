import type { LanguageProvider, LanguageCode, LanguageProviderConstructor } from '../types/LanguageProvider'

/**
 * Registry for language-specific providers
 * Manages registration, retrieval, and instantiation of language providers
 */
export class LanguageProviderRegistry {
  private providers: Map<LanguageCode, LanguageProvider>
  private providerConstructors: Map<LanguageCode, LanguageProviderConstructor>

  constructor() {
    this.providers = new Map()
    this.providerConstructors = new Map()
  }

  /**
   * Register a language provider instance
   * @param languageCode - ISO 639-1 language code
   * @param provider - Language provider instance
   */
  register(languageCode: LanguageCode, provider: LanguageProvider): void {
    if (this.providers.has(languageCode)) {
      console.warn(`[LanguageProviderRegistry] Overwriting existing provider for language: ${languageCode}`)
    }

    // Validate that provider's language code matches registration
    if (provider.languageCode !== languageCode) {
      throw new Error(
        `[LanguageProviderRegistry] Provider language code (${provider.languageCode}) does not match registration code (${languageCode})`
      )
    }

    this.providers.set(languageCode, provider)
    console.log(`[LanguageProviderRegistry] Registered provider for language: ${languageCode} (${provider.languageName})`)
  }

  /**
   * Register a language provider constructor for lazy instantiation
   * @param languageCode - ISO 639-1 language code
   * @param providerConstructor - Language provider constructor
   */
  registerConstructor(
    languageCode: LanguageCode,
    providerConstructor: LanguageProviderConstructor
  ): void {
    if (this.providerConstructors.has(languageCode)) {
      console.warn(`[LanguageProviderRegistry] Overwriting existing constructor for language: ${languageCode}`)
    }

    this.providerConstructors.set(languageCode, providerConstructor)
    console.log(`[LanguageProviderRegistry] Registered constructor for language: ${languageCode}`)
  }

  /**
   * Get a language provider by code
   * Will instantiate from constructor if not already created
   * @param languageCode - ISO 639-1 language code
   * @returns Language provider instance
   * @throws Error if no provider is registered for the language
   */
  get(languageCode: LanguageCode): LanguageProvider {
    // Check if provider instance exists
    if (this.providers.has(languageCode)) {
      return this.providers.get(languageCode)!
    }

    // Try to instantiate from constructor
    if (this.providerConstructors.has(languageCode)) {
      const constructor = this.providerConstructors.get(languageCode)!
      const provider = new constructor()

      // Validate language code matches
      if (provider.languageCode !== languageCode) {
        throw new Error(
          `[LanguageProviderRegistry] Instantiated provider language code (${provider.languageCode}) does not match requested code (${languageCode})`
        )
      }

      // Cache the instance
      this.providers.set(languageCode, provider)
      console.log(`[LanguageProviderRegistry] Instantiated provider for language: ${languageCode}`)

      return provider
    }

    // No provider found
    throw new Error(
      `[LanguageProviderRegistry] No provider registered for language: ${languageCode}. ` +
      `Available languages: ${Array.from(this.getSupportedLanguages()).join(', ')}`
    )
  }

  /**
   * Check if a language provider is registered
   * @param languageCode - ISO 639-1 language code
   * @returns True if provider exists
   */
  has(languageCode: LanguageCode): boolean {
    return this.providers.has(languageCode) || this.providerConstructors.has(languageCode)
  }

  /**
   * Get a language provider with fallback
   * If the requested language is not available, falls back to default
   * @param languageCode - ISO 639-1 language code
   * @param fallbackCode - Fallback language code (default: 'de')
   * @returns Language provider instance
   */
  getWithFallback(
    languageCode: LanguageCode,
    fallbackCode: LanguageCode = 'de'
  ): LanguageProvider {
    try {
      return this.get(languageCode)
    } catch (error) {
      console.warn(
        `[LanguageProviderRegistry] Provider not found for ${languageCode}, falling back to ${fallbackCode}`
      )
      return this.get(fallbackCode)
    }
  }

  /**
   * Get all supported language codes
   * @returns Set of language codes
   */
  getSupportedLanguages(): Set<LanguageCode> {
    const languages = new Set<LanguageCode>()

    // Add all registered instances
    for (const code of this.providers.keys()) {
      languages.add(code)
    }

    // Add all registered constructors
    for (const code of this.providerConstructors.keys()) {
      languages.add(code)
    }

    return languages
  }

  /**
   * Get all registered providers with their metadata
   * @returns Array of provider information
   */
  getAllProviders(): Array<{
    languageCode: LanguageCode
    languageName: string
    isInstantiated: boolean
  }> {
    const result: Array<{
      languageCode: LanguageCode
      languageName: string
      isInstantiated: boolean
    }> = []

    // Process all instantiated providers
    for (const [code, provider] of this.providers) {
      result.push({
        languageCode: code,
        languageName: provider.languageName,
        isInstantiated: true
      })
    }

    // Process constructors that aren't instantiated yet
    for (const code of this.providerConstructors.keys()) {
      if (!this.providers.has(code)) {
        result.push({
          languageCode: code,
          languageName: `${code.toUpperCase()} (not loaded)`,
          isInstantiated: false
        })
      }
    }

    return result.sort((a, b) => a.languageCode.localeCompare(b.languageCode))
  }

  /**
   * Unregister a language provider
   * @param languageCode - ISO 639-1 language code
   */
  unregister(languageCode: LanguageCode): void {
    this.providers.delete(languageCode)
    this.providerConstructors.delete(languageCode)
    console.log(`[LanguageProviderRegistry] Unregistered provider for language: ${languageCode}`)
  }

  /**
   * Clear all registered providers
   */
  clear(): void {
    this.providers.clear()
    this.providerConstructors.clear()
    console.log('[LanguageProviderRegistry] Cleared all providers')
  }

  /**
   * Validate that a provider properly implements the interface
   * @param provider - Provider to validate
   * @returns Validation errors (empty array if valid)
   */
  validateProvider(provider: LanguageProvider): string[] {
    const errors: string[] = []

    // Check required properties
    if (!provider.languageCode) {
      errors.push('Missing required property: languageCode')
    }
    if (!provider.languageName) {
      errors.push('Missing required property: languageName')
    }
    if (!provider.grammarRules) {
      errors.push('Missing required property: grammarRules')
    }

    // Check required methods
    const requiredMethods = [
      'generateDistractors',
      'validateWord',
      'calculateComplexity',
      'analyzeMistake',
      'getCommonMistakes',
      'adaptDifficulty',
      'identifyWeakAreas',
      'getLanguageSpecificData',
      'generatePhoneticDistractors',
      'generateVisualDistractors',
      'generateSemanticDistractors',
      'generateGrammaticalDistractors'
    ]

    for (const method of requiredMethods) {
      if (typeof (provider as any)[method] !== 'function') {
        errors.push(`Missing or invalid method: ${method}`)
      }
    }

    return errors
  }

  /**
   * Register and validate a provider in one step
   * @param languageCode - ISO 639-1 language code
   * @param provider - Language provider instance
   * @throws Error if validation fails
   */
  registerAndValidate(languageCode: LanguageCode, provider: LanguageProvider): void {
    const errors = this.validateProvider(provider)

    if (errors.length > 0) {
      throw new Error(
        `[LanguageProviderRegistry] Provider validation failed for ${languageCode}:\n` +
        errors.map(e => `  - ${e}`).join('\n')
      )
    }

    this.register(languageCode, provider)
  }
}

/**
 * Singleton instance of the registry
 * Can be imported and used across the application
 */
export const languageProviderRegistry = new LanguageProviderRegistry()
