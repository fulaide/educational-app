import { BaseLanguageProvider } from '../BaseLanguageProvider'
import type {
  LanguageCode,
  GrammarRules,
  LanguageSpecificData,
  MistakeType
} from '../../types/LanguageProvider'
import type { VocabularyWord } from '../../types/Vocabulary'
import type { DifficultyLevel } from '../../types/Module'
import {
  GERMAN_ARTICLES,
  GERMAN_CASES,
  VOWEL_SUBSTITUTIONS,
  CONSONANT_SUBSTITUTIONS,
  VISUAL_CONFUSIONS,
  PLURAL_SUFFIXES,
  UMLAUT_PLURALS,
  GENDER_PATTERNS,
  PHONETIC_GROUPS,
  CATEGORY_PATTERNS,
  RELATED_CATEGORIES,
  COMPOUND_COMPONENTS
} from './GermanLanguageData'

/**
 * German Language Provider
 * Implements comprehensive German-specific distractor generation and analysis
 */
export class GermanLanguageProvider extends BaseLanguageProvider {
  readonly languageCode: LanguageCode = 'de'
  readonly languageName: string = 'German'
  readonly grammarRules: GrammarRules = {
    hasGrammaticalGender: true,
    genders: ['masculine', 'feminine', 'neuter'],
    hasCases: true,
    cases: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],
    pluralRules: [
      { rule: 'Add -e (often with umlaut)', examples: ['Hund → Hunde', 'Ball → Bälle'] },
      { rule: 'Add -en', examples: ['Frau → Frauen', 'Uhr → Uhren'] },
      { rule: 'Add -n', examples: ['Lampe → Lampen'] },
      { rule: 'Add -er (often with umlaut)', examples: ['Kind → Kinder', 'Buch → Bücher'] },
      { rule: 'Add -s (foreign words)', examples: ['Auto → Autos'] },
      { rule: 'No change', examples: ['Fenster → Fenster'] }
    ],
    articleRules: [
      { rule: 'Masculine: der', examples: ['der Hund', 'der Mann'] },
      { rule: 'Feminine: die', examples: ['die Katze', 'die Frau'] },
      { rule: 'Neuter: das', examples: ['das Kind', 'das Haus'] },
      { rule: 'Plural: die', examples: ['die Hunde', 'die Kinder'] }
    ]
  }

  /**
   * Generate phonetic distractors based on German pronunciation patterns
   */
  async generatePhoneticDistractors(word: VocabularyWord, count: number): Promise<string[]> {
    const distractors: string[] = []
    const targetWord = word.word.toLowerCase()

    // 1. Try phonetic groups first (pre-defined similar-sounding words)
    const phoneticGroup = PHONETIC_GROUPS[targetWord]
    if (phoneticGroup) {
      distractors.push(...phoneticGroup.slice(0, count))
    }

    // 2. Generate using vowel substitutions
    for (const [original, substitutes] of Object.entries(VOWEL_SUBSTITUTIONS)) {
      if (distractors.length >= count) break

      if (targetWord.includes(original)) {
        for (const substitute of substitutes) {
          const distractor = targetWord.replace(original, substitute)
          if (distractor !== targetWord && distractor.length >= 3) {
            distractors.push(this.capitalize(distractor))
            if (distractors.length >= count) break
          }
        }
      }
    }

    // 3. Generate using consonant substitutions
    for (const [original, substitutes] of Object.entries(CONSONANT_SUBSTITUTIONS)) {
      if (distractors.length >= count) break

      if (targetWord.includes(original)) {
        for (const substitute of substitutes) {
          const distractor = targetWord.replace(original, substitute)
          if (distractor !== targetWord && distractor.length >= 3) {
            distractors.push(this.capitalize(distractor))
            if (distractors.length >= count) break
          }
        }
      }
    }

    // 4. Rhyming words (same ending)
    if (distractors.length < count && targetWord.length >= 4) {
      const ending = targetWord.slice(-2)
      const rhymes = this.generateRhymes(targetWord, ending)
      distractors.push(...rhymes.slice(0, count - distractors.length))
    }

    return [...new Set(distractors)].slice(0, count)
  }

  /**
   * Generate visual distractors based on letter confusion patterns
   */
  async generateVisualDistractors(word: VocabularyWord, count: number): Promise<string[]> {
    const distractors: string[] = []
    const targetWord = word.word

    // 1. Letter substitution based on visual similarity
    for (const [letter1, letter2] of VISUAL_CONFUSIONS) {
      if (distractors.length >= count) break

      // Forward substitution
      if (targetWord.includes(letter1)) {
        const distractor = targetWord.replace(letter1, letter2)
        if (distractor !== targetWord) {
          distractors.push(distractor)
        }
      }

      // Reverse substitution
      if (targetWord.includes(letter2)) {
        const distractor = targetWord.replace(letter2, letter1)
        if (distractor !== targetWord) {
          distractors.push(distractor)
        }
      }
    }

    // 2. Letter transposition (swap adjacent letters)
    for (let i = 0; i < targetWord.length - 1; i++) {
      if (distractors.length >= count) break

      const chars = targetWord.split('')
      ;[chars[i], chars[i + 1]] = [chars[i + 1], chars[i]]
      const distractor = chars.join('')

      if (distractor !== targetWord && distractor.length >= 3) {
        distractors.push(distractor)
      }
    }

    // 3. Double letter mistakes (mm → m, n → nn)
    const doubleLetterPattern = /(.)\1/g
    if (doubleLetterPattern.test(targetWord)) {
      const distractor = targetWord.replace(doubleLetterPattern, '$1')
      if (distractor !== targetWord) {
        distractors.push(distractor)
      }
    } else {
      // Try adding double letters
      for (let i = 1; i < targetWord.length; i++) {
        if (distractors.length >= count) break

        const distractor = targetWord.slice(0, i) + targetWord[i] + targetWord.slice(i)
        if (distractor !== targetWord && distractor.length <= targetWord.length + 2) {
          distractors.push(distractor)
        }
      }
    }

    // 4. Missing letter (delete one character)
    for (let i = 0; i < targetWord.length; i++) {
      if (distractors.length >= count) break

      const distractor = targetWord.slice(0, i) + targetWord.slice(i + 1)
      if (distractor.length >= 3) {
        distractors.push(distractor)
      }
    }

    return [...new Set(distractors)].slice(0, count)
  }

  /**
   * Generate semantic distractors from the same category
   */
  async generateSemanticDistractors(
    word: VocabularyWord,
    count: number,
    allWords: VocabularyWord[]
  ): Promise<string[]> {
    const distractors: string[] = []
    const category = word.category

    // 1. Words from the same category
    const sameCategory = allWords
      .filter(w =>
        w.category === category &&
        w.id !== word.id &&
        w.language === 'de'
      )
      .sort((a, b) => {
        // Prioritize similar difficulty
        const diffA = Math.abs(a.difficulty - word.difficulty)
        const diffB = Math.abs(b.difficulty - word.difficulty)
        return diffA - diffB
      })
      .slice(0, Math.ceil(count * 0.6)) // 60% from same category

    distractors.push(...sameCategory.map(w => w.word))

    // 2. Words from related categories
    if (distractors.length < count) {
      const relatedCategories = RELATED_CATEGORIES[category] || []

      const relatedWords = allWords
        .filter(w =>
          relatedCategories.includes(w.category) &&
          w.id !== word.id &&
          w.language === 'de'
        )
        .sort((a, b) => {
          const diffA = Math.abs(a.difficulty - word.difficulty)
          const diffB = Math.abs(b.difficulty - word.difficulty)
          return diffA - diffB
        })
        .slice(0, count - distractors.length)

      distractors.push(...relatedWords.map(w => w.word))
    }

    // 3. If still need more, use words of similar length and complexity
    if (distractors.length < count) {
      const similarWords = allWords
        .filter(w =>
          w.id !== word.id &&
          w.language === 'de' &&
          Math.abs(w.word.length - word.word.length) <= 2 &&
          !distractors.includes(w.word)
        )
        .slice(0, count - distractors.length)

      distractors.push(...similarWords.map(w => w.word))
    }

    return [...new Set(distractors)].slice(0, count)
  }

  /**
   * Generate grammatical distractors (wrong articles, plurals, cases)
   */
  async generateGrammaticalDistractors(word: VocabularyWord, count: number): Promise<string[]> {
    const distractors: string[] = []
    const langData = this.getLanguageSpecificData(word)

    // 1. Wrong articles
    if (langData.article) {
      const wrongArticles = Object.values(GERMAN_ARTICLES).filter(
        a => a !== langData.article
      )

      for (const wrongArticle of wrongArticles) {
        if (distractors.length >= count) break
        distractors.push(`${wrongArticle} ${word.word}`)
      }
    }

    // 2. Wrong plural forms
    if (langData.plural) {
      // Generate incorrect plurals
      for (const suffix of PLURAL_SUFFIXES) {
        if (distractors.length >= count) break

        const incorrectPlural = word.word + suffix
        if (incorrectPlural !== langData.plural) {
          distractors.push(incorrectPlural)
        }
      }

      // Generate with wrong umlaut
      for (const [original, umlaut] of Object.entries(UMLAUT_PLURALS)) {
        if (distractors.length >= count) break

        if (word.word.includes(original) && !langData.plural.includes(umlaut)) {
          const incorrectPlural = word.word.replace(original, umlaut) + 'e'
          distractors.push(incorrectPlural)
        }
      }
    } else {
      // Generate plausible but incorrect plurals
      for (const suffix of PLURAL_SUFFIXES.slice(0, 3)) {
        if (distractors.length >= count) break
        distractors.push(word.word + suffix)
      }
    }

    // 3. Compound word mistakes (wrong combination)
    if (word.word.length > 6 && COMPOUND_COMPONENTS.length > 0) {
      const randomComponent = COMPOUND_COMPONENTS[
        Math.floor(Math.random() * COMPOUND_COMPONENTS.length)
      ]

      if (distractors.length < count) {
        distractors.push(randomComponent + word.word.slice(3))
      }

      if (distractors.length < count) {
        distractors.push(word.word.slice(0, -3) + randomComponent)
      }
    }

    return [...new Set(distractors)].slice(0, count)
  }

  /**
   * Validate German word format
   */
  validateWord(word: string): string[] {
    const errors = super.validateWord(word)

    // German-specific validations
    if (word[0] !== word[0].toUpperCase()) {
      errors.push('German nouns must start with a capital letter')
    }

    // Check for invalid character combinations
    const invalidPatterns = [/ck$/, /^ß/, /üü/, /öö/, /ää/]
    for (const pattern of invalidPatterns) {
      if (pattern.test(word)) {
        errors.push(`Invalid German pattern: ${pattern.source}`)
      }
    }

    return errors
  }

  /**
   * Calculate German-specific complexity
   */
  calculateComplexity(word: VocabularyWord): number {
    let complexity = super.calculateComplexity(word)

    // Compound words are more complex
    if (this.isCompoundWord(word.word)) {
      complexity += 0.15
    }

    // Words with umlauts are slightly more complex
    if (/[äöü]/i.test(word.word)) {
      complexity += 0.05
    }

    // ß is more complex
    if (word.word.includes('ß')) {
      complexity += 0.1
    }

    // Longer compound words are more complex
    if (word.word.length > 10) {
      complexity += 0.1
    }

    return Math.min(complexity, 1)
  }

  /**
   * Analyze German-specific mistakes
   */
  analyzeMistake(targetWord: VocabularyWord, studentAnswer: string): MistakeType[] {
    const mistakes = super.analyzeMistake(targetWord, studentAnswer)
    const target = targetWord.word
    const answer = studentAnswer

    // Article mistake
    if (this.hasArticleMistake(target, answer)) {
      mistakes.push('ARTICLE_ERROR')
    }

    // Plural mistake
    if (this.hasPluralMistake(target, answer)) {
      mistakes.push('PLURAL_ERROR')
    }

    // Umlaut confusion
    if (this.hasUmlautConfusion(target, answer)) {
      mistakes.push('PHONETIC_CONFUSION')
    }

    // ß vs ss confusion
    if (this.hasSsConfusion(target, answer)) {
      mistakes.push('SPELLING_ERROR')
    }

    // Capitalization error
    if (target[0] !== answer[0] && target.toLowerCase() === answer.toLowerCase()) {
      mistakes.push('GRAMMAR_ERROR')
    }

    return [...new Set(mistakes)]
  }

  /**
   * Get German-specific data for a word
   */
  getLanguageSpecificData(word: VocabularyWord): LanguageSpecificData {
    const data: LanguageSpecificData = {
      language: 'de'
    }

    // Infer gender if not provided
    if (!word.languageSpecificData || typeof word.languageSpecificData !== 'object') {
      data.gender = this.inferGender(word.word)
      data.article = this.getArticleForGender(data.gender)
      data.plural = this.inferPlural(word.word, data.gender)

      // Detect compound words
      if (this.isCompoundWord(word.word)) {
        data.compoundParts = this.splitCompoundWord(word.word)
      }

      // Common mistakes
      data.commonMistakes = this.generateCommonMistakes(word.word)

      // Pronunciation hints
      data.pronunciationHints = this.getPronunciationHints(word.word)
    } else {
      return word.languageSpecificData as LanguageSpecificData
    }

    return data
  }

  // ========== German-Specific Helper Methods ==========

  /**
   * Capitalize first letter (German nouns)
   */
  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }

  /**
   * Generate rhyming words
   */
  private generateRhymes(word: string, ending: string): string[] {
    const consonants = ['B', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'Z']
    const rhymes: string[] = []

    for (const consonant of consonants) {
      const rhyme = consonant + word.slice(-ending.length)
      if (rhyme !== word && rhyme.length >= 3) {
        rhymes.push(this.capitalize(rhyme))
        if (rhymes.length >= 3) break
      }
    }

    return rhymes
  }

  /**
   * Infer grammatical gender from word patterns
   */
  private inferGender(word: string): string {
    for (const [gender, patterns] of Object.entries(GENDER_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(word)) {
          return gender
        }
      }
    }
    return 'neuter' // Default
  }

  /**
   * Get article for gender
   */
  private getArticleForGender(gender: string): string {
    return GERMAN_ARTICLES[gender as keyof typeof GERMAN_ARTICLES] || 'das'
  }

  /**
   * Infer plural form
   */
  private inferPlural(word: string, gender: string): string {
    // Simple heuristics (not 100% accurate, but good for distractors)
    if (gender === 'masculine') {
      return word + 'e'
    } else if (gender === 'feminine') {
      return word + 'n'
    } else {
      return word + 'er'
    }
  }

  /**
   * Check if word is likely a compound word
   */
  private isCompoundWord(word: string): boolean {
    return word.length > 8 || COMPOUND_COMPONENTS.some(c => word.includes(c))
  }

  /**
   * Split compound word into components (simple heuristic)
   */
  private splitCompoundWord(word: string): string[] {
    for (const component of COMPOUND_COMPONENTS) {
      if (word.includes(component)) {
        const parts = word.split(component)
        return parts.filter(p => p.length > 0).concat([component])
      }
    }

    // Fallback: split at middle
    const mid = Math.floor(word.length / 2)
    return [word.slice(0, mid), word.slice(mid)]
  }

  /**
   * Generate common mistakes for a word
   */
  private generateCommonMistakes(word: string): Array<{
    mistake: string
    mistakeType: MistakeType
    frequency: number
  }> {
    const mistakes: Array<{ mistake: string; mistakeType: MistakeType; frequency: number }> = []

    // Umlaut mistakes
    for (const [original, umlaut] of Object.entries(UMLAUT_PLURALS)) {
      if (word.includes(original)) {
        mistakes.push({
          mistake: word.replace(original, umlaut),
          mistakeType: 'SPELLING_ERROR',
          frequency: 7
        })
      }
    }

    // ß vs ss
    if (word.includes('ß')) {
      mistakes.push({
        mistake: word.replace('ß', 'ss'),
        mistakeType: 'SPELLING_ERROR',
        frequency: 8
      })
    }

    return mistakes
  }

  /**
   * Get pronunciation hints
   */
  private getPronunciationHints(word: string): string[] {
    const hints: string[] = []

    if (word.includes('ch')) {
      hints.push('ch pronunciation after a, o, u (ach-Laut)')
    }
    if (word.includes('ie')) {
      hints.push('ie is pronounced as long "ee"')
    }
    if (word.includes('ß')) {
      hints.push('ß (Eszett) is a sharp "s" sound')
    }
    if (/[äöü]/.test(word)) {
      hints.push('Remember to pronounce umlauts correctly')
    }

    return hints
  }

  /**
   * Check for article mistakes
   */
  private hasArticleMistake(target: string, answer: string): boolean {
    const targetArticle = Object.values(GERMAN_ARTICLES).find(a => target.startsWith(a + ' '))
    const answerArticle = Object.values(GERMAN_ARTICLES).find(a => answer.startsWith(a + ' '))

    return targetArticle !== answerArticle && (targetArticle !== undefined || answerArticle !== undefined)
  }

  /**
   * Check for plural mistakes
   */
  private hasPluralMistake(target: string, answer: string): boolean {
    // Check if answer has wrong plural suffix
    return PLURAL_SUFFIXES.some(suffix => {
      const targetHas = target.endsWith(suffix)
      const answerHas = answer.endsWith(suffix)
      return targetHas !== answerHas
    })
  }

  /**
   * Check for umlaut confusion
   */
  private hasUmlautConfusion(target: string, answer: string): boolean {
    for (const [original, umlaut] of Object.entries(UMLAUT_PLURALS)) {
      const targetHas = target.includes(umlaut)
      const answerHas = answer.includes(umlaut)

      if (targetHas !== answerHas) {
        return true
      }
    }
    return false
  }

  /**
   * Check for ß vs ss confusion
   */
  private hasSsConfusion(target: string, answer: string): boolean {
    const targetSs = target.replace(/ß/g, 'ss')
    const answerSs = answer.replace(/ß/g, 'ss')

    return targetSs === answerSs && target !== answer
  }
}
