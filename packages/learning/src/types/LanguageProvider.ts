import type { VocabularyWord, VocabularyCategory } from './Vocabulary'
import type { DifficultyLevel } from './Module'

/**
 * ISO 639-1 language codes
 */
export type LanguageCode = 'de' | 'en' | 'es' | 'fr' | 'it'

/**
 * Types of distractors that can be generated for vocabulary exercises
 */
export type DistractorType =
  | 'PHONETIC'      // Similar-sounding words
  | 'VISUAL'        // Visually similar words (letter confusion)
  | 'SEMANTIC'      // Same category or related meaning
  | 'GRAMMATICAL'   // Grammatically incorrect variations

/**
 * Types of mistakes students can make
 */
export type MistakeType =
  | 'PHONETIC_CONFUSION'      // Confused similar sounds
  | 'VISUAL_CONFUSION'        // Confused similar-looking letters
  | 'SEMANTIC_CONFUSION'      // Confused related concepts
  | 'GRAMMAR_ERROR'           // Grammatical mistakes (articles, cases, etc.)
  | 'SPELLING_ERROR'          // Spelling mistakes
  | 'ARTICLE_ERROR'           // Wrong article (der/die/das in German)
  | 'CASE_ERROR'              // Wrong case (Nominativ/Akkusativ/etc.)
  | 'PLURAL_ERROR'            // Wrong plural form

/**
 * Options for distractor generation
 */
export interface DistractorOptions {
  /** Number of distractors to generate */
  count: number
  /** Types of distractors to include */
  types: DistractorType[]
  /** Difficulty level for distractors (1-4) */
  difficulty: DifficultyLevel
  /** Exclude specific words from distractors */
  excludeWords?: string[]
  /** Category to draw distractors from (for semantic) */
  category?: VocabularyCategory
}

/**
 * Generated distractor with metadata
 */
export interface Distractor {
  /** The distractor word/phrase */
  word: string
  /** Type of distractor */
  type: DistractorType
  /** Reason this distractor was chosen (for teacher insights) */
  reason: string
  /** How similar it is to the target word (0-1) */
  similarityScore: number
}

/**
 * Language-specific grammar rules
 */
export interface GrammarRules {
  /** Does this language have grammatical gender? */
  hasGrammaticalGender: boolean
  /** Gender options (e.g., masculine, feminine, neuter) */
  genders?: string[]
  /** Does this language have cases? */
  hasCases: boolean
  /** Case options (e.g., Nominativ, Akkusativ, Dativ, Genitiv) */
  cases?: string[]
  /** Plural formation rules */
  pluralRules?: Array<{
    rule: string
    examples: string[]
  }>
  /** Article rules */
  articleRules?: Array<{
    rule: string
    examples: string[]
  }>
}

/**
 * Language-specific metadata for a vocabulary word
 */
export interface LanguageSpecificData {
  /** ISO 639-1 language code */
  language: LanguageCode
  /** Grammatical gender (e.g., 'masculine', 'feminine', 'neuter') */
  gender?: string
  /** Article (e.g., 'der', 'die', 'das' in German) */
  article?: string
  /** Plural form */
  plural?: string
  /** Common mistakes for this word */
  commonMistakes?: Array<{
    mistake: string
    mistakeType: MistakeType
    frequency: number // How common (1-10)
  }>
  /** Compound word components (e.g., 'Haustür' = 'Haus' + 'Tür') */
  compoundParts?: string[]
  /** Regional variations */
  regionalVariations?: Array<{
    region: string
    variation: string
  }>
  /** Pronunciation hints specific to this language */
  pronunciationHints?: string[]
  /** Extra metadata that doesn't fit standard fields */
  metadata?: Record<string, unknown>
}

/**
 * Performance data for challenge adaptation
 */
export interface PerformanceData {
  /** Was the answer correct? */
  correct: boolean
  /** Response time in milliseconds */
  responseTime: number
  /** How many hints were used */
  hintsUsed: number
  /** Type of mistake made (if incorrect) */
  mistakeType?: MistakeType
  /** What the student answered (if incorrect) */
  studentAnswer?: string
  /** Distractor that was selected (if multiple choice) */
  selectedDistractor?: Distractor
}

/**
 * Difficulty adjustment recommendation
 */
export interface DifficultyAdjustment {
  /** Recommended new difficulty level */
  newDifficulty: DifficultyLevel
  /** Reason for adjustment */
  reason: string
  /** Confidence in this recommendation (0-1) */
  confidence: number
  /** Suggested distractor types for next exercise */
  suggestedDistractorTypes: DistractorType[]
}

/**
 * Student's weak areas in a language
 */
export interface WeakAreas {
  studentId: string
  language: LanguageCode
  /** Mistake types the student struggles with */
  mistakePatterns: Array<{
    type: MistakeType
    frequency: number // How often this mistake occurs (0-1)
    affectedCategories: VocabularyCategory[]
  }>
  /** Specific vocabulary categories that need work */
  difficultCategories: VocabularyCategory[]
  /** Recommended focus areas */
  recommendations: string[]
}

/**
 * Core language provider interface
 * All language-specific implementations must implement this interface
 */
export interface LanguageProvider {
  /** ISO 639-1 language code */
  readonly languageCode: LanguageCode

  /** Human-readable language name */
  readonly languageName: string

  /** Grammar rules for this language */
  readonly grammarRules: GrammarRules

  /**
   * Generate distractors for a vocabulary word
   * @param word - The target vocabulary word
   * @param options - Distractor generation options
   * @returns Array of generated distractors
   */
  generateDistractors(
    word: VocabularyWord,
    options: DistractorOptions
  ): Promise<Distractor[]>

  /**
   * Validate if a word follows language-specific rules
   * @param word - Word to validate
   * @returns Validation errors, if any
   */
  validateWord(word: string): string[]

  /**
   * Calculate language-specific difficulty for a word
   * Factors in things like word length, compound words, special characters, etc.
   * @param word - Vocabulary word to assess
   * @returns Complexity score (0-1, where 1 is most complex)
   */
  calculateComplexity(word: VocabularyWord): number

  /**
   * Analyze a student's mistake and categorize it
   * @param targetWord - The correct word
   * @param studentAnswer - What the student answered
   * @returns Classified mistake type(s)
   */
  analyzeMistake(
    targetWord: VocabularyWord,
    studentAnswer: string
  ): MistakeType[]

  /**
   * Get common mistakes for a specific word
   * @param word - Vocabulary word
   * @returns Array of common mistakes with frequencies
   */
  getCommonMistakes(word: VocabularyWord): Array<{
    mistake: string
    mistakeType: MistakeType
    frequency: number
  }>

  /**
   * Adapt challenge difficulty based on student performance
   * @param word - Current vocabulary word
   * @param performance - Student's performance data
   * @param historicalData - Historical performance on similar words
   * @returns Difficulty adjustment recommendation
   */
  adaptDifficulty(
    word: VocabularyWord,
    performance: PerformanceData,
    historicalData?: PerformanceData[]
  ): DifficultyAdjustment

  /**
   * Identify student's weak areas in this language
   * @param studentId - Student identifier
   * @param recentAttempts - Recent vocabulary attempts
   * @returns Analysis of weak areas and recommendations
   */
  identifyWeakAreas(
    studentId: string,
    recentAttempts: Array<{
      word: VocabularyWord
      performance: PerformanceData
    }>
  ): WeakAreas

  /**
   * Get language-specific metadata for a word
   * @param word - Vocabulary word
   * @returns Language-specific data
   */
  getLanguageSpecificData(word: VocabularyWord): LanguageSpecificData

  /**
   * Generate phonetically similar words
   * Language-specific phonetic rules
   * @param word - Target word
   * @param count - Number of similar words to generate
   * @returns Array of phonetically similar words
   */
  generatePhoneticDistractors(
    word: VocabularyWord,
    count: number
  ): Promise<string[]>

  /**
   * Generate visually similar words
   * Language-specific letter confusion patterns
   * @param word - Target word
   * @param count - Number of similar words to generate
   * @returns Array of visually similar words
   */
  generateVisualDistractors(
    word: VocabularyWord,
    count: number
  ): Promise<string[]>

  /**
   * Generate semantically related words
   * Same category or related meaning
   * @param word - Target word
   * @param count - Number of related words to generate
   * @param allWords - Available vocabulary pool
   * @returns Array of semantically related words
   */
  generateSemanticDistractors(
    word: VocabularyWord,
    count: number,
    allWords: VocabularyWord[]
  ): Promise<string[]>

  /**
   * Generate grammatically incorrect variations
   * Language-specific grammar rules
   * @param word - Target word
   * @param count - Number of incorrect variations to generate
   * @returns Array of grammatically incorrect words
   */
  generateGrammaticalDistractors(
    word: VocabularyWord,
    count: number
  ): Promise<string[]>
}

/**
 * Language provider constructor type for registry
 */
export type LanguageProviderConstructor = new () => LanguageProvider
