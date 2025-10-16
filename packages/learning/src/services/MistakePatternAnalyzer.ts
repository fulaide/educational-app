import type { VocabularyWord, VocabularyAttempt } from '../types'

/**
 * Types of mistakes that can occur
 */
export type MistakeType =
  | 'ARTICLE_ERROR' // Wrong German article (der/die/das)
  | 'PLURAL_ERROR' // Incorrect plural formation
  | 'GENDER_ERROR' // Wrong grammatical gender
  | 'CASE_ERROR' // Wrong grammatical case
  | 'UMLAUT_ERROR' // Missing or wrong umlaut (ä, ö, ü)
  | 'PHONETIC_CONFUSION' // Similar sounding letters confused
  | 'VISUAL_CONFUSION' // Visually similar letters confused
  | 'SPELLING_ERROR' // General spelling mistake
  | 'SEMANTIC_CONFUSION' // Wrong word from same category/meaning
  | 'GRAMMAR_ERROR' // Other grammar mistakes
  | 'TIMING_ERROR' // Correct but too slow (timeout/hesitation)
  | 'COMPOUND_ERROR' // Compound word formation error
  | 'CAPITALIZATION_ERROR' // Wrong capitalization (German nouns)

/**
 * Mistake with detailed metadata
 */
export interface MistakeRecord {
  type: MistakeType
  wordId: string
  word: string
  correctAnswer: string
  studentAnswer: string
  timestamp: Date
  exerciseType: string
  responseTime?: number
  hintsUsed: number
  severity: number // 0-1 (how severe the mistake was)
}

/**
 * Aggregated mistake pattern for a student
 */
export interface MistakePattern {
  type: MistakeType
  frequency: number // How often this mistake occurs
  recentFrequency: number // Frequency in last 7 days
  affectedWords: string[] // Word IDs with this mistake
  severity: number // Average severity (0-1)
  trend: 'IMPROVING' | 'STABLE' | 'WORSENING'
  recommendations: string[] // Specific recommendations to address this pattern
}

/**
 * Student weak areas summary
 */
export interface WeakAreas {
  studentId: string
  topMistakes: MistakePattern[]
  weakCategories: Array<{
    category: string
    errorRate: number
    commonMistakes: MistakeType[]
  }>
  weakWords: Array<{
    wordId: string
    word: string
    errorRate: number
    commonMistakes: MistakeType[]
  }>
  overallAccuracy: number
  improvementRate: number // Percentage change in accuracy over time
  lastAnalyzed: Date
}

/**
 * Language-specific complexity factors
 */
export interface LanguageComplexity {
  articleComplexity: number // How difficult articles are (German = high)
  genderComplexity: number // Grammatical gender difficulty
  caseComplexity: number // Case system difficulty
  phonetic Complexity: number // Pronunciation difficulty
  compoundWordComplexity: number // Compound word formation
  overallComplexity: number // Combined complexity score
}

/**
 * Mistake Pattern Analyzer
 *
 * Analyzes student mistakes to identify patterns, weak areas,
 * and provide targeted recommendations for improvement
 */
export class MistakePatternAnalyzer {
  // Language complexity scores (0-1)
  private static readonly LANGUAGE_COMPLEXITY: Record<string, LanguageComplexity> = {
    de: {
      articleComplexity: 0.9, // der/die/das is very difficult
      genderComplexity: 0.9,
      caseComplexity: 0.8, // Nominativ, Akkusativ, Dativ, Genitiv
      phoneticComplexity: 0.6, // Umlauts and special sounds
      compoundWordComplexity: 0.7,
      overallComplexity: 0.78
    },
    en: {
      articleComplexity: 0.2, // just "the/a/an"
      genderComplexity: 0.1,
      caseComplexity: 0.1,
      phoneticComplexity: 0.4,
      compoundWordComplexity: 0.3,
      overallComplexity: 0.22
    }
  }

  /**
   * Analyze a single mistake and classify its type
   *
   * @param word The vocabulary word
   * @param correctAnswer The correct answer
   * @param studentAnswer The student's answer
   * @param language Language code (default: 'de')
   * @returns Array of mistake types detected
   */
  analyzeMistake(
    word: VocabularyWord,
    correctAnswer: string,
    studentAnswer: string,
    language: string = 'de'
  ): MistakeType[] {
    const mistakes: MistakeType[] = []

    if (!studentAnswer || studentAnswer.trim() === '') {
      return ['TIMING_ERROR'] // No answer provided
    }

    const correct = correctAnswer.toLowerCase().trim()
    const student = studentAnswer.toLowerCase().trim()

    // Exact match - no mistake
    if (correct === student) {
      return []
    }

    // Language-specific analysis
    if (language === 'de') {
      mistakes.push(...this.analyzeGermanMistake(word, correctAnswer, studentAnswer))
    }

    // General mistake analysis (applies to all languages)
    mistakes.push(...this.analyzeGeneralMistake(correctAnswer, studentAnswer))

    return mistakes
  }

  /**
   * Analyze German-specific mistakes
   */
  private analyzeGermanMistake(
    word: VocabularyWord,
    correctAnswer: string,
    studentAnswer: string
  ): MistakeType[] {
    const mistakes: MistakeType[] = []
    const correct = correctAnswer.toLowerCase().trim()
    const student = studentAnswer.toLowerCase().trim()

    // Check for article errors (der/die/das)
    if (this.hasArticleError(correct, student)) {
      mistakes.push('ARTICLE_ERROR')
    }

    // Check for umlaut errors (ä, ö, ü)
    if (this.hasUmlautError(correct, student)) {
      mistakes.push('UMLAUT_ERROR')
    }

    // Check for capitalization (German nouns are capitalized)
    if (this.hasCapitalizationError(correctAnswer, studentAnswer)) {
      mistakes.push('CAPITALIZATION_ERROR')
    }

    // Check for compound word errors
    if (this.hasCompoundWordError(correct, student)) {
      mistakes.push('COMPOUND_ERROR')
    }

    return mistakes
  }

  /**
   * Analyze general mistakes (non-language-specific)
   */
  private analyzeGeneralMistake(
    correctAnswer: string,
    studentAnswer: string
  ): MistakeType[] {
    const mistakes: MistakeType[] = []
    const correct = correctAnswer.toLowerCase().trim()
    const student = studentAnswer.toLowerCase().trim()

    // Check for phonetic confusion (similar sounds)
    if (this.hasPhoneticConfusion(correct, student)) {
      mistakes.push('PHONETIC_CONFUSION')
    }

    // Check for visual confusion (similar looking letters)
    if (this.hasVisualConfusion(correct, student)) {
      mistakes.push('VISUAL_CONFUSION')
    }

    // If not other specific type, it's a general spelling error
    if (mistakes.length === 0) {
      mistakes.push('SPELLING_ERROR')
    }

    return mistakes
  }

  /**
   * Check for article errors (der/die/das)
   */
  private hasArticleError(correct: string, student: string): boolean {
    const articles = ['der', 'die', 'das', 'den', 'dem', 'des']
    const correctWords = correct.split(' ')
    const studentWords = student.split(' ')

    if (correctWords.length > 0 && studentWords.length > 0) {
      const correctArticle = correctWords[0]
      const studentArticle = studentWords[0]

      if (articles.includes(correctArticle) && articles.includes(studentArticle)) {
        return correctArticle !== studentArticle
      }
    }

    return false
  }

  /**
   * Check for umlaut errors
   */
  private hasUmlautError(correct: string, student: string): boolean {
    const umlautPairs = [
      ['ä', 'a'], ['ö', 'o'], ['ü', 'u'],
      ['ß', 'ss']
    ]

    for (const [umlaut, replacement] of umlautPairs) {
      // Check if correct has umlaut and student replaced it
      if (correct.includes(umlaut) && !student.includes(umlaut)) {
        const studentWithUmlaut = student.replace(new RegExp(replacement, 'g'), umlaut)
        if (this.levenshteinDistance(correct, studentWithUmlaut) <= 1) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Check for capitalization errors (German nouns)
   */
  private hasCapitalizationError(correct: string, student: string): boolean {
    // If lowercase versions match but originals don't, it's a capitalization error
    return correct.toLowerCase() === student.toLowerCase() && correct !== student
  }

  /**
   * Check for compound word errors
   */
  private hasCompoundWordError(correct: string, student: string): boolean {
    // Check if student split a compound word or combined separate words
    const correctNoSpace = correct.replace(/\s/g, '')
    const studentNoSpace = student.replace(/\s/g, '')

    if (correctNoSpace === studentNoSpace) {
      return true // Same letters, different spacing
    }

    return false
  }

  /**
   * Check for phonetic confusion
   */
  private hasPhoneticConfusion(correct: string, student: string): boolean {
    const phoneticPairs = [
      ['b', 'p'], ['d', 't'], ['g', 'k'],
      ['f', 'v'], ['s', 'z'], ['m', 'n'],
      ['ch', 'sh'], ['th', 't']
    ]

    for (const [sound1, sound2] of phoneticPairs) {
      const studentVariant1 = student.replace(new RegExp(sound1, 'g'), sound2)
      const studentVariant2 = student.replace(new RegExp(sound2, 'g'), sound1)

      if (this.levenshteinDistance(correct, studentVariant1) <= 1 ||
          this.levenshteinDistance(correct, studentVariant2) <= 1) {
        return true
      }
    }

    return false
  }

  /**
   * Check for visual confusion
   */
  private hasVisualConfusion(correct: string, student: string): boolean {
    const visualPairs = [
      ['b', 'd'], ['p', 'q'], ['m', 'n'],
      ['u', 'v'], ['i', 'l'], ['o', '0']
    ]

    for (const [char1, char2] of visualPairs) {
      const studentVariant1 = student.replace(new RegExp(char1, 'g'), char2)
      const studentVariant2 = student.replace(new RegExp(char2, 'g'), char1)

      if (this.levenshteinDistance(correct, studentVariant1) <= 1 ||
          this.levenshteinDistance(correct, studentVariant2) <= 1) {
        return true
      }
    }

    return false
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length
    const n = str2.length
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // deletion
            dp[i][j - 1] + 1, // insertion
            dp[i - 1][j - 1] + 1 // substitution
          )
        }
      }
    }

    return dp[m][n]
  }

  /**
   * Aggregate mistake patterns from multiple attempts
   *
   * @param mistakes Array of mistake records
   * @returns Array of mistake patterns
   */
  aggregateMistakePatterns(mistakes: MistakeRecord[]): MistakePattern[] {
    const patternMap = new Map<MistakeType, MistakePattern>()

    // Count frequency and severity for each mistake type
    for (const mistake of mistakes) {
      const existing = patternMap.get(mistake.type)
      const isRecent = this.isRecent(mistake.timestamp, 7) // Last 7 days

      if (existing) {
        existing.frequency++
        if (isRecent) existing.recentFrequency++
        existing.affectedWords.push(mistake.wordId)
        existing.severity += mistake.severity
      } else {
        patternMap.set(mistake.type, {
          type: mistake.type,
          frequency: 1,
          recentFrequency: isRecent ? 1 : 0,
          affectedWords: [mistake.wordId],
          severity: mistake.severity,
          trend: 'STABLE',
          recommendations: []
        })
      }
    }

    // Calculate averages and trends
    const patterns: MistakePattern[] = []
    for (const [type, pattern] of patternMap) {
      pattern.severity = pattern.severity / pattern.frequency
      pattern.affectedWords = [...new Set(pattern.affectedWords)] // Deduplicate
      pattern.trend = this.calculateTrend(pattern, mistakes)
      pattern.recommendations = this.generateRecommendations(pattern)
      patterns.push(pattern)
    }

    // Sort by frequency (most common first)
    return patterns.sort((a, b) => b.frequency - a.frequency)
  }

  /**
   * Analyze weak areas for a student
   *
   * @param studentId Student ID
   * @param mistakes Array of mistake records
   * @param attempts All vocabulary attempts
   * @returns Weak areas summary
   */
  analyzeWeakAreas(
    studentId: string,
    mistakes: MistakeRecord[],
    attempts: VocabularyAttempt[]
  ): WeakAreas {
    const topMistakes = this.aggregateMistakePatterns(mistakes).slice(0, 5)

    // Calculate overall accuracy
    const totalAttempts = attempts.length
    const correctAttempts = attempts.filter(a => a.isCorrect).length
    const overallAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0

    // Calculate improvement rate (compare recent vs older attempts)
    const improvementRate = this.calculateImprovementRate(attempts)

    return {
      studentId,
      topMistakes,
      weakCategories: [], // To be populated with actual data
      weakWords: [], // To be populated with actual data
      overallAccuracy,
      improvementRate,
      lastAnalyzed: new Date()
    }
  }

  /**
   * Calculate complexity weight for spaced repetition
   *
   * @param mistakeTypes Types of mistakes made
   * @param language Language code
   * @returns Complexity multiplier (0.5-2.0)
   */
  calculateComplexityWeight(mistakeTypes: MistakeType[], language: string = 'de'): number {
    const complexity = MistakePatternAnalyzer.LANGUAGE_COMPLEXITY[language] ||
                      MistakePatternAnalyzer.LANGUAGE_COMPLEXITY.en

    let weight = 1.0

    for (const mistakeType of mistakeTypes) {
      switch (mistakeType) {
        case 'ARTICLE_ERROR':
        case 'GENDER_ERROR':
          weight += complexity.articleComplexity * 0.3
          break
        case 'CASE_ERROR':
          weight += complexity.caseComplexity * 0.25
          break
        case 'UMLAUT_ERROR':
        case 'PHONETIC_CONFUSION':
          weight += complexity.phoneticComplexity * 0.2
          break
        case 'COMPOUND_ERROR':
          weight += complexity.compoundWordComplexity * 0.2
          break
        case 'SPELLING_ERROR':
        case 'VISUAL_CONFUSION':
          weight += 0.15
          break
        default:
          weight += 0.1
      }
    }

    // Clamp to reasonable range
    return Math.max(0.5, Math.min(2.0, weight))
  }

  /**
   * Generate recommendations based on mistake pattern
   */
  private generateRecommendations(pattern: MistakePattern): string[] {
    const recommendations: string[] = []

    switch (pattern.type) {
      case 'ARTICLE_ERROR':
        recommendations.push('Practice German articles (der/die/das) with noun gender rules')
        recommendations.push('Review article changes in different cases (Nominativ, Akkusativ, Dativ, Genitiv)')
        break
      case 'UMLAUT_ERROR':
        recommendations.push('Practice pronunciation of umlauts (ä, ö, ü)')
        recommendations.push('Learn when umlauts appear in plural forms')
        break
      case 'COMPOUND_ERROR':
        recommendations.push('Study German compound word formation rules')
        recommendations.push('Practice breaking down compound words into their parts')
        break
      case 'PHONETIC_CONFUSION':
        recommendations.push('Listen to audio pronunciations more carefully')
        recommendations.push('Practice distinguishing similar sounds')
        break
      case 'VISUAL_CONFUSION':
        recommendations.push('Slow down when reading and writing')
        recommendations.push('Pay attention to letter shapes (b/d, m/n, etc.)')
        break
      case 'SPELLING_ERROR':
        recommendations.push('Practice spelling with written exercises')
        recommendations.push('Use mnemonic devices for difficult words')
        break
      case 'CAPITALIZATION_ERROR':
        recommendations.push('Remember: all German nouns are capitalized')
        break
      default:
        recommendations.push('Continue practicing this word type')
    }

    return recommendations
  }

  /**
   * Calculate trend for a mistake pattern
   */
  private calculateTrend(pattern: MistakePattern, allMistakes: MistakeRecord[]): 'IMPROVING' | 'STABLE' | 'WORSENING' {
    const typeMistakes = allMistakes.filter(m => m.type === pattern.type)
    if (typeMistakes.length < 5) return 'STABLE' // Not enough data

    // Compare first half vs second half
    const midpoint = Math.floor(typeMistakes.length / 2)
    const firstHalf = typeMistakes.slice(0, midpoint)
    const secondHalf = typeMistakes.slice(midpoint)

    const firstHalfRate = firstHalf.length / midpoint
    const secondHalfRate = secondHalf.length / (typeMistakes.length - midpoint)

    if (secondHalfRate < firstHalfRate * 0.8) return 'IMPROVING'
    if (secondHalfRate > firstHalfRate * 1.2) return 'WORSENING'
    return 'STABLE'
  }

  /**
   * Calculate improvement rate
   */
  private calculateImprovementRate(attempts: VocabularyAttempt[]): number {
    if (attempts.length < 10) return 0

    // Split into two halves
    const midpoint = Math.floor(attempts.length / 2)
    const firstHalf = attempts.slice(0, midpoint)
    const secondHalf = attempts.slice(midpoint)

    const firstAccuracy = firstHalf.filter(a => a.isCorrect).length / firstHalf.length
    const secondAccuracy = secondHalf.filter(a => a.isCorrect).length / secondHalf.length

    return ((secondAccuracy - firstAccuracy) / firstAccuracy) * 100
  }

  /**
   * Check if a timestamp is within the last N days
   */
  private isRecent(timestamp: Date, days: number): boolean {
    const now = new Date()
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return new Date(timestamp) >= cutoff
  }

  /**
   * Get language complexity for a given language
   */
  getLanguageComplexity(language: string): LanguageComplexity {
    return MistakePatternAnalyzer.LANGUAGE_COMPLEXITY[language] ||
           MistakePatternAnalyzer.LANGUAGE_COMPLEXITY.en
  }
}
