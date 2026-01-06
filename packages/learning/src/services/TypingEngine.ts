/**
 * Typing Engine - Core typing challenge logic
 *
 * Handles character-by-character input tracking, error detection,
 * WPM calculation, and accuracy metrics for typing challenges.
 */

export interface CharacterState {
  char: string
  expected: string
  isCorrect: boolean | null // null = not yet typed
  timestamp?: number
}

export interface WordState {
  word: string
  characters: CharacterState[]
  startTime?: number
  endTime?: number
  errors: number
  isComplete: boolean
}

export interface TypingState {
  text: string
  words: WordState[]
  currentWordIndex: number
  currentCharIndex: number
  startTime?: number
  endTime?: number
  totalErrors: number
  totalCorrect: number
  isComplete: boolean
}

export interface TypingMetrics {
  wordsTyped: number
  charactersTyped: number
  correctCharacters: number
  incorrectCharacters: number
  totalTimeMs: number
  averageWPM: number
  accuracy: number // 0-100%

  // Error breakdown
  uppercaseErrors: number
  umlautErrors: number
  specialCharErrors: number
  wrongKeyErrors: number
}

export interface ErrorPosition {
  position: number
  wordIndex: number
  charIndex: number
  expected: string
  actual: string
  timestamp: number
}

export class TypingEngine {
  private state: TypingState
  private errorPositions: ErrorPosition[] = []
  private wordTimings: Array<{ word: string; timeMs: number; errors: number }> = []
  private version: number = 0 // Reactivity version counter

  constructor(text: string) {
    this.state = this.initializeState(text)
  }

  /**
   * Get version number for reactivity tracking
   */
  public getVersion(): number {
    return this.version
  }

  /**
   * Increment version to trigger reactivity
   */
  private incrementVersion(): void {
    this.version++
  }

  /**
   * Initialize typing state from text
   */
  private initializeState(text: string): TypingState {
    const words = text.split(' ').filter(w => w.length > 0)

    return {
      text,
      words: words.map((word, index) => {
        // Add space to all words except the last one
        const wordWithSpace = index < words.length - 1 ? word + ' ' : word

        return {
          word,
          characters: wordWithSpace.split('').map(char => ({
            char,
            expected: char,
            isCorrect: null
          })),
          errors: 0,
          isComplete: false
        }
      }),
      currentWordIndex: 0,
      currentCharIndex: 0,
      totalErrors: 0,
      totalCorrect: 0,
      isComplete: false
    }
  }

  /**
   * Process a single character input
   */
  public processInput(char: string): {
    isCorrect: boolean
    currentWord: WordState
    shouldAdvanceWord: boolean
    shouldShowError: boolean
  } {
    if (this.state.isComplete) {
      return {
        isCorrect: false,
        currentWord: this.getCurrentWord(),
        shouldAdvanceWord: false,
        shouldShowError: false
      }
    }

    // Start timer on first input
    if (!this.state.startTime) {
      this.state.startTime = Date.now()
    }

    const currentWord = this.state.words[this.state.currentWordIndex]
    const currentChar = currentWord.characters[this.state.currentCharIndex]

    if (!currentChar) {
      return {
        isCorrect: false,
        currentWord,
        shouldAdvanceWord: false,
        shouldShowError: false
      }
    }

    // Check if input matches expected character
    const isCorrect = char === currentChar.expected

    // Update character state
    currentChar.isCorrect = isCorrect
    currentChar.timestamp = Date.now()

    // Track errors
    if (!isCorrect) {
      this.state.totalErrors++
      currentWord.errors++

      // Record error position
      this.errorPositions.push({
        position: this.getTotalCharactersTyped(),
        wordIndex: this.state.currentWordIndex,
        charIndex: this.state.currentCharIndex,
        expected: currentChar.expected,
        actual: char,
        timestamp: Date.now()
      })
    } else {
      this.state.totalCorrect++
    }

    // Start word timing on first character
    if (this.state.currentCharIndex === 0 && !currentWord.startTime) {
      currentWord.startTime = Date.now()
    }

    // Advance to next character
    this.state.currentCharIndex++

    // Check if word is complete
    const shouldAdvanceWord = this.state.currentCharIndex >= currentWord.characters.length

    if (shouldAdvanceWord) {
      currentWord.isComplete = true
      currentWord.endTime = Date.now()

      // Record word timing
      if (currentWord.startTime) {
        this.wordTimings.push({
          word: currentWord.word,
          timeMs: currentWord.endTime - currentWord.startTime,
          errors: currentWord.errors
        })
      }

      // Move to next word
      this.state.currentWordIndex++
      this.state.currentCharIndex = 0

      // Check if challenge is complete
      if (this.state.currentWordIndex >= this.state.words.length) {
        this.state.isComplete = true
        this.state.endTime = Date.now()
      }
    }

    // Trigger reactivity
    this.incrementVersion()

    return {
      isCorrect,
      currentWord,
      shouldAdvanceWord,
      shouldShowError: !isCorrect
    }
  }

  /**
   * Handle backspace - move to previous character
   */
  public handleBackspace(): boolean {
    if (this.state.currentCharIndex > 0) {
      // Move back in current word
      this.state.currentCharIndex--
      const currentWord = this.getCurrentWord()
      const char = currentWord.characters[this.state.currentCharIndex]

      // Reset character state
      if (char.isCorrect === false) {
        this.state.totalErrors--
        currentWord.errors--
      } else if (char.isCorrect === true) {
        this.state.totalCorrect--
      }

      char.isCorrect = null
      char.timestamp = undefined

      // Trigger reactivity
      this.incrementVersion()
      return true
    } else if (this.state.currentWordIndex > 0) {
      // Move to previous word
      this.state.currentWordIndex--
      const prevWord = this.getCurrentWord()
      prevWord.isComplete = false
      this.state.currentCharIndex = prevWord.characters.length - 1

      // Reset last character of previous word
      const char = prevWord.characters[this.state.currentCharIndex]
      if (char.isCorrect === false) {
        this.state.totalErrors--
        prevWord.errors--
      } else if (char.isCorrect === true) {
        this.state.totalCorrect--
      }

      char.isCorrect = null
      char.timestamp = undefined

      // Trigger reactivity
      this.incrementVersion()
      return true
    }

    return false
  }

  /**
   * Calculate current typing metrics
   */
  public getMetrics(): TypingMetrics {
    const totalTimeMs = this.state.endTime
      ? this.state.endTime - (this.state.startTime || 0)
      : Date.now() - (this.state.startTime || Date.now())

    const totalCharsTyped = this.getTotalCharactersTyped()
    const wordsTyped = this.state.currentWordIndex + (this.state.currentCharIndex > 0 ? 1 : 0)

    // Calculate WPM (words per minute)
    // Standard: 5 characters = 1 word
    const timeInMinutes = totalTimeMs / 60000
    const averageWPM = timeInMinutes > 0
      ? Math.round((totalCharsTyped / 5) / timeInMinutes)
      : 0

    // Calculate accuracy
    const accuracy = totalCharsTyped > 0
      ? Math.round((this.state.totalCorrect / totalCharsTyped) * 100)
      : 100

    // Analyze error types
    const {
      uppercaseErrors,
      umlautErrors,
      specialCharErrors,
      wrongKeyErrors
    } = this.analyzeErrors()

    return {
      wordsTyped,
      charactersTyped: totalCharsTyped,
      correctCharacters: this.state.totalCorrect,
      incorrectCharacters: this.state.totalErrors,
      totalTimeMs,
      averageWPM,
      accuracy,
      uppercaseErrors,
      umlautErrors,
      specialCharErrors,
      wrongKeyErrors
    }
  }

  /**
   * Analyze error types for detailed feedback
   */
  private analyzeErrors(): {
    uppercaseErrors: number
    umlautErrors: number
    specialCharErrors: number
    wrongKeyErrors: number
  } {
    let uppercaseErrors = 0
    let umlautErrors = 0
    let specialCharErrors = 0
    let wrongKeyErrors = 0

    const umlauts = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']
    const specialChars = ['.', ',', '!', '?', ';', ':', '"', "'", '-']

    for (const error of this.errorPositions) {
      const { expected, actual } = error

      // Check if uppercase error (same letter, wrong case)
      if (expected.toLowerCase() === actual.toLowerCase()) {
        uppercaseErrors++
      }
      // Check if umlaut error
      else if (umlauts.includes(expected) || umlauts.includes(actual)) {
        umlautErrors++
      }
      // Check if special character error
      else if (specialChars.includes(expected) || specialChars.includes(actual)) {
        specialCharErrors++
      }
      // Otherwise, it's a wrong key error
      else {
        wrongKeyErrors++
      }
    }

    return {
      uppercaseErrors,
      umlautErrors,
      specialCharErrors,
      wrongKeyErrors
    }
  }

  /**
   * Get total characters typed so far
   */
  private getTotalCharactersTyped(): number {
    let total = 0
    for (let i = 0; i < this.state.currentWordIndex; i++) {
      total += this.state.words[i].characters.length
    }
    total += this.state.currentCharIndex
    return total
  }

  /**
   * Get current word being typed
   */
  public getCurrentWord(): WordState {
    return this.state.words[this.state.currentWordIndex] || this.state.words[this.state.words.length - 1]
  }

  /**
   * Get current character being typed
   */
  public getCurrentChar(): CharacterState | null {
    const word = this.getCurrentWord()
    return word?.characters[this.state.currentCharIndex] || null
  }

  /**
   * Get visible window of words (for sliding window display)
   */
  public getVisibleWords(windowSize: number = 5): {
    words: WordState[]
    currentIndex: number
  } {
    const start = Math.max(0, this.state.currentWordIndex - 1)
    const end = Math.min(this.state.words.length, start + windowSize)

    return {
      words: this.state.words.slice(start, end),
      currentIndex: this.state.currentWordIndex - start
    }
  }

  /**
   * Get complete state for rendering
   */
  public getState(): TypingState {
    return this.state
  }

  /**
   * Get error positions for analytics
   */
  public getErrorPositions(): ErrorPosition[] {
    return this.errorPositions
  }

  /**
   * Get word timings for analytics
   */
  public getWordTimings(): Array<{ word: string; timeMs: number; errors: number }> {
    return this.wordTimings
  }

  /**
   * Check if typing is complete
   */
  public isComplete(): boolean {
    return this.state.isComplete
  }

  /**
   * Reset the typing engine with new text
   */
  public reset(text?: string): void {
    if (text) {
      this.state = this.initializeState(text)
    } else {
      this.state = this.initializeState(this.state.text)
    }
    this.errorPositions = []
    this.wordTimings = []
  }

  /**
   * Get progress percentage
   */
  public getProgress(): number {
    const totalChars = this.state.text.length
    const typedChars = this.getTotalCharactersTyped()
    return Math.round((typedChars / totalChars) * 100)
  }

  /**
   * Calculate XP earned based on performance
   */
  public calculateXP(baseXP: number = 50): number {
    const metrics = this.getMetrics()

    // Accuracy multiplier (0.5x to 2x)
    const accuracyMultiplier = metrics.accuracy / 100

    // Speed bonus (WPM > 20 gets bonus)
    const speedBonus = metrics.averageWPM > 20 ? 1.2 : 1.0

    // Completion bonus
    const completionBonus = this.state.isComplete ? 1.5 : 1.0

    const xp = Math.round(baseXP * accuracyMultiplier * speedBonus * completionBonus)

    return Math.max(xp, 10) // Minimum 10 XP
  }

  /**
   * Check if achievements should be unlocked
   */
  public checkAchievements(): string[] {
    const metrics = this.getMetrics()
    const achievements: string[] = []

    // Perfect typing (100% accuracy)
    if (metrics.accuracy === 100 && this.state.isComplete) {
      achievements.push('PERFECT_TYPING')
    }

    // Speed demon (WPM > 30)
    if (metrics.averageWPM >= 30) {
      achievements.push('SPEED_DEMON')
    }

    // Umlaut master (no umlaut errors)
    if (metrics.umlautErrors === 0 && this.hasUmlauts()) {
      achievements.push('UMLAUT_MASTER')
    }

    // First completion
    if (this.state.isComplete && this.state.currentWordIndex === this.state.words.length) {
      achievements.push('FIRST_COMPLETION')
    }

    return achievements
  }

  /**
   * Check if text contains umlauts
   */
  private hasUmlauts(): boolean {
    const umlauts = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']
    return umlauts.some(u => this.state.text.includes(u))
  }
}
