import type {
  LanguageProvider,
  LanguageCode,
  GrammarRules,
  Distractor,
  DistractorOptions,
  DistractorType,
  MistakeType,
  PerformanceData,
  DifficultyAdjustment,
  WeakAreas,
  LanguageSpecificData
} from '../types/LanguageProvider'
import type { VocabularyWord, VocabularyCategory } from '../types/Vocabulary'
import type { DifficultyLevel } from '../types/Module'

/**
 * Base abstract class for language providers
 * Implements common functionality that all providers can use
 * Subclasses must implement language-specific methods
 */
export abstract class BaseLanguageProvider implements LanguageProvider {
  abstract readonly languageCode: LanguageCode
  abstract readonly languageName: string
  abstract readonly grammarRules: GrammarRules

  /**
   * Generate distractors by delegating to type-specific methods
   */
  async generateDistractors(
    word: VocabularyWord,
    options: DistractorOptions
  ): Promise<Distractor[]> {
    const distractors: Distractor[] = []
    const { count, types, excludeWords = [] } = options

    // Calculate how many distractors to generate per type
    const countPerType = Math.ceil(count / types.length)

    for (const type of types) {
      let typeDistractors: string[] = []

      switch (type) {
        case 'PHONETIC':
          typeDistractors = await this.generatePhoneticDistractors(word, countPerType)
          break
        case 'VISUAL':
          typeDistractors = await this.generateVisualDistractors(word, countPerType)
          break
        case 'SEMANTIC':
          // Note: Semantic distractors need access to all vocabulary
          // Implementations should override this method if they need context
          typeDistractors = await this.generateSemanticDistractors(word, countPerType, [])
          break
        case 'GRAMMATICAL':
          typeDistractors = await this.generateGrammaticalDistractors(word, countPerType)
          break
      }

      // Filter out excluded words and the original word
      const filteredDistractors = typeDistractors
        .filter(d => d !== word.word && !excludeWords.includes(d))
        .map(d => ({
          word: d,
          type,
          reason: this.getDistractorReason(d, word.word, type),
          similarityScore: this.calculateSimilarity(d, word.word)
        }))

      distractors.push(...filteredDistractors)
    }

    // Remove duplicates and shuffle
    const uniqueDistractors = this.deduplicateDistractors(distractors)
    const shuffled = this.shuffleArray(uniqueDistractors)

    // Return exactly the requested count
    return shuffled.slice(0, count)
  }

  /**
   * Abstract methods that must be implemented by subclasses
   */
  abstract generatePhoneticDistractors(word: VocabularyWord, count: number): Promise<string[]>
  abstract generateVisualDistractors(word: VocabularyWord, count: number): Promise<string[]>
  abstract generateSemanticDistractors(
    word: VocabularyWord,
    count: number,
    allWords: VocabularyWord[]
  ): Promise<string[]>
  abstract generateGrammaticalDistractors(word: VocabularyWord, count: number): Promise<string[]>

  /**
   * Validate word format (basic implementation)
   * Subclasses should override with language-specific rules
   */
  validateWord(word: string): string[] {
    const errors: string[] = []

    if (!word || word.trim().length === 0) {
      errors.push('Word cannot be empty')
    }

    if (word.length > 50) {
      errors.push('Word is too long (max 50 characters)')
    }

    if (/\d/.test(word)) {
      errors.push('Word should not contain numbers')
    }

    return errors
  }

  /**
   * Calculate word complexity (basic implementation)
   * Factors in word length, special characters, etc.
   * Subclasses should override with language-specific complexity
   */
  calculateComplexity(word: VocabularyWord): number {
    let complexity = 0

    // Length factor (0-0.3)
    const lengthFactor = Math.min(word.word.length / 20, 0.3)
    complexity += lengthFactor

    // Difficulty level factor (0-0.4)
    const difficultyMap: Record<DifficultyLevel, number> = {
      1: 0.1,
      2: 0.2,
      3: 0.3,
      4: 0.4
    }
    complexity += difficultyMap[word.difficulty] || 0.2

    // Category complexity (0-0.3)
    const categoryComplexity = this.getCategoryComplexity(word.category)
    complexity += categoryComplexity

    return Math.min(complexity, 1)
  }

  /**
   * Analyze student mistake (basic implementation)
   * Subclasses should override with language-specific analysis
   */
  analyzeMistake(targetWord: VocabularyWord, studentAnswer: string): MistakeType[] {
    const mistakes: MistakeType[] = []

    // Phonetic similarity check
    if (this.soundsSimilar(targetWord.word, studentAnswer)) {
      mistakes.push('PHONETIC_CONFUSION')
    }

    // Visual similarity check
    if (this.looksSimilar(targetWord.word, studentAnswer)) {
      mistakes.push('VISUAL_CONFUSION')
    }

    // Spelling check (Levenshtein distance)
    const distance = this.levenshteinDistance(targetWord.word, studentAnswer)
    if (distance <= 2) {
      mistakes.push('SPELLING_ERROR')
    }

    // Default to semantic confusion if no other pattern found
    if (mistakes.length === 0) {
      mistakes.push('SEMANTIC_CONFUSION')
    }

    return mistakes
  }

  /**
   * Get common mistakes (base implementation returns empty)
   * Subclasses should override with language-specific data
   */
  getCommonMistakes(word: VocabularyWord): Array<{
    mistake: string
    mistakeType: MistakeType
    frequency: number
  }> {
    // Base implementation returns empty array
    // Subclasses should provide language-specific common mistakes
    return []
  }

  /**
   * Adapt difficulty based on performance
   */
  adaptDifficulty(
    word: VocabularyWord,
    performance: PerformanceData,
    historicalData?: PerformanceData[]
  ): DifficultyAdjustment {
    const currentDifficulty = word.difficulty
    let newDifficulty = currentDifficulty

    // Calculate performance metrics
    const responseTimeFast = performance.responseTime < 3000
    const responseTimeSlow = performance.responseTime > 10000
    const usedHints = performance.hintsUsed > 0

    // Adjust based on current attempt
    if (performance.correct && responseTimeFast && !usedHints) {
      // Increase difficulty if too easy
      newDifficulty = Math.min(currentDifficulty + 1, 4) as DifficultyLevel
    } else if (!performance.correct || responseTimeSlow || usedHints) {
      // Decrease difficulty if struggling
      newDifficulty = Math.max(currentDifficulty - 1, 1) as DifficultyLevel
    }

    // Consider historical data
    if (historicalData && historicalData.length >= 3) {
      const recentCorrect = historicalData.filter(d => d.correct).length
      const accuracy = recentCorrect / historicalData.length

      if (accuracy >= 0.8) {
        newDifficulty = Math.min(currentDifficulty + 1, 4) as DifficultyLevel
      } else if (accuracy < 0.5) {
        newDifficulty = Math.max(currentDifficulty - 1, 1) as DifficultyLevel
      }
    }

    // Determine suggested distractor types based on mistakes
    const suggestedTypes = this.suggestDistractorTypes(performance, historicalData)

    return {
      newDifficulty,
      reason: this.getDifficultyAdjustmentReason(currentDifficulty, newDifficulty, performance),
      confidence: historicalData && historicalData.length >= 5 ? 0.9 : 0.6,
      suggestedDistractorTypes: suggestedTypes
    }
  }

  /**
   * Identify weak areas from recent attempts
   */
  identifyWeakAreas(
    studentId: string,
    recentAttempts: Array<{ word: VocabularyWord; performance: PerformanceData }>
  ): WeakAreas {
    const mistakeFrequency = new Map<MistakeType, number>()
    const categoryDifficulty = new Map<VocabularyCategory, number>()

    // Analyze all attempts
    for (const attempt of recentAttempts) {
      // Count mistake types
      if (!attempt.performance.correct && attempt.performance.mistakeType) {
        const currentCount = mistakeFrequency.get(attempt.performance.mistakeType) || 0
        mistakeFrequency.set(attempt.performance.mistakeType, currentCount + 1)
      }

      // Track category difficulty
      const category = attempt.word.category
      const currentDifficulty = categoryDifficulty.get(category) || 0
      categoryDifficulty.set(
        category,
        currentDifficulty + (attempt.performance.correct ? 0 : 1)
      )
    }

    // Convert to patterns
    const totalAttempts = recentAttempts.length
    const mistakePatterns = Array.from(mistakeFrequency.entries()).map(([type, count]) => {
      // Find affected categories for this mistake type
      const affectedCategories = Array.from(
        new Set(
          recentAttempts
            .filter(a => a.performance.mistakeType === type)
            .map(a => a.word.category)
        )
      )

      return {
        type,
        frequency: count / totalAttempts,
        affectedCategories
      }
    })

    // Find difficult categories (>50% error rate)
    const difficultCategories = Array.from(categoryDifficulty.entries())
      .filter(([_, errorCount]) => {
        const categoryAttempts = recentAttempts.filter(a => a.word.category === _).length
        return errorCount / categoryAttempts > 0.5
      })
      .map(([category, _]) => category)

    // Generate recommendations
    const recommendations = this.generateRecommendations(mistakePatterns, difficultCategories)

    return {
      studentId,
      language: this.languageCode,
      mistakePatterns,
      difficultCategories,
      recommendations
    }
  }

  /**
   * Get language-specific data (base implementation)
   * Subclasses should override with actual data
   */
  getLanguageSpecificData(word: VocabularyWord): LanguageSpecificData {
    return {
      language: this.languageCode,
      metadata: {}
    }
  }

  // ========== Helper Methods ==========

  /**
   * Calculate similarity between two words (0-1)
   */
  protected calculateSimilarity(word1: string, word2: string): number {
    const distance = this.levenshteinDistance(word1, word2)
    const maxLength = Math.max(word1.length, word2.length)
    return 1 - distance / maxLength
  }

  /**
   * Check if two words sound similar
   * Base implementation uses simple heuristics
   * Subclasses should override with phonetic algorithms
   */
  protected soundsSimilar(word1: string, word2: string): boolean {
    // Simple check: same first and last letters
    return (
      word1[0]?.toLowerCase() === word2[0]?.toLowerCase() &&
      word1[word1.length - 1]?.toLowerCase() === word2[word2.length - 1]?.toLowerCase()
    )
  }

  /**
   * Check if two words look similar
   */
  protected looksSimilar(word1: string, word2: string): boolean {
    const distance = this.levenshteinDistance(word1, word2)
    return distance <= 2
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  protected levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length
    const n = str2.length
    const dp: number[][] = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0))

    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
        }
      }
    }

    return dp[m][n]
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  protected shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Remove duplicate distractors, keeping highest similarity
   */
  protected deduplicateDistractors(distractors: Distractor[]): Distractor[] {
    const uniqueMap = new Map<string, Distractor>()

    for (const distractor of distractors) {
      const existing = uniqueMap.get(distractor.word)
      if (!existing || distractor.similarityScore > existing.similarityScore) {
        uniqueMap.set(distractor.word, distractor)
      }
    }

    return Array.from(uniqueMap.values())
  }

  /**
   * Get category complexity factor
   */
  protected getCategoryComplexity(category: VocabularyCategory): number {
    const complexityMap: Partial<Record<VocabularyCategory, number>> = {
      NUMBERS: 0.05,
      COLORS: 0.1,
      ANIMALS: 0.15,
      FAMILY: 0.15,
      OBJECTS: 0.2,
      FOOD: 0.2,
      CLOTHING: 0.2,
      BODY_PARTS: 0.25,
      PLACES: 0.25,
      WEATHER: 0.25,
      TIME: 0.3,
      ACTIONS: 0.3
    }
    return complexityMap[category] || 0.2
  }

  /**
   * Get reason for distractor selection
   */
  protected getDistractorReason(distractor: string, target: string, type: DistractorType): string {
    const reasons: Record<DistractorType, string> = {
      PHONETIC: `Sounds similar to "${target}"`,
      VISUAL: `Looks similar to "${target}"`,
      SEMANTIC: `Related concept to "${target}"`,
      GRAMMATICAL: `Common grammatical mistake for "${target}"`
    }
    return reasons[type]
  }

  /**
   * Get reason for difficulty adjustment
   */
  protected getDifficultyAdjustmentReason(
    oldDifficulty: DifficultyLevel,
    newDifficulty: DifficultyLevel,
    performance: PerformanceData
  ): string {
    if (newDifficulty > oldDifficulty) {
      return 'Student performed well - increasing difficulty'
    } else if (newDifficulty < oldDifficulty) {
      return 'Student is struggling - reducing difficulty'
    } else {
      return 'Difficulty level maintained'
    }
  }

  /**
   * Suggest distractor types based on performance
   */
  protected suggestDistractorTypes(
    performance: PerformanceData,
    historicalData?: PerformanceData[]
  ): DistractorType[] {
    const types: DistractorType[] = []

    // Analyze mistake patterns
    if (performance.mistakeType) {
      switch (performance.mistakeType) {
        case 'PHONETIC_CONFUSION':
          types.push('PHONETIC')
          break
        case 'VISUAL_CONFUSION':
          types.push('VISUAL')
          break
        case 'SEMANTIC_CONFUSION':
          types.push('SEMANTIC')
          break
        case 'GRAMMAR_ERROR':
        case 'ARTICLE_ERROR':
        case 'CASE_ERROR':
        case 'PLURAL_ERROR':
          types.push('GRAMMATICAL')
          break
      }
    }

    // If no specific pattern, use balanced mix
    if (types.length === 0) {
      types.push('SEMANTIC', 'PHONETIC')
    }

    return types
  }

  /**
   * Generate recommendations based on weak areas
   */
  protected generateRecommendations(
    mistakePatterns: Array<{ type: MistakeType; frequency: number }>,
    difficultCategories: VocabularyCategory[]
  ): string[] {
    const recommendations: string[] = []

    // Recommendations based on mistake patterns
    for (const pattern of mistakePatterns) {
      if (pattern.frequency > 0.3) {
        recommendations.push(
          `Focus on ${pattern.type.toLowerCase().replace('_', ' ')} - occurs in ${Math.round(pattern.frequency * 100)}% of mistakes`
        )
      }
    }

    // Recommendations based on difficult categories
    if (difficultCategories.length > 0) {
      recommendations.push(
        `Practice vocabulary in categories: ${difficultCategories.join(', ')}`
      )
    }

    return recommendations
  }
}
