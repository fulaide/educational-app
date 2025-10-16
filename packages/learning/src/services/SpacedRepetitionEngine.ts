import type { VocabularyProgress, MasteryLevel } from '../types'

/**
 * Quality rating for the SM-2 algorithm (0-5)
 * 0: Complete blackout - complete failure to recall
 * 1: Incorrect response, but correct answer seemed familiar
 * 2: Incorrect response, but correct answer remembered
 * 3: Correct response, but with serious difficulty
 * 4: Correct response, after some hesitation
 * 5: Perfect response
 */
export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Result of SM-2 calculation
 */
export interface SM2Result {
  interval: number // Days until next review
  easeFactor: number // Difficulty multiplier (1.3-2.5+)
  repetitions: number // Number of consecutive successful reviews
  nextReview: Date // When the word should be reviewed next
  masteryLevel: MasteryLevel // Updated mastery level
}

/**
 * Options for spaced repetition calculation
 */
export interface SpacedRepetitionOptions {
  languageComplexity?: number // 0.5-2.0 multiplier for language-specific difficulty
  mistakeTypeWeight?: number // 0.8-1.5 multiplier based on mistake severity
  timeSpentMultiplier?: number // 0.9-1.2 based on how long it took to answer
  minimumInterval?: number // Minimum days between reviews (default: 1)
  maximumInterval?: number // Maximum days between reviews (default: 365)
}

/**
 * Spaced Repetition Engine implementing SuperMemo SM-2 algorithm
 * with language-specific adjustments and mistake pattern analysis
 *
 * @see https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 */
export class SpacedRepetitionEngine {
  // SM-2 Constants
  private static readonly DEFAULT_EASE_FACTOR = 2.5
  private static readonly MIN_EASE_FACTOR = 1.3
  private static readonly MAX_EASE_FACTOR = 2.5
  private static readonly EASE_FACTOR_BONUS = 0.1
  private static readonly EASE_FACTOR_PENALTY = 0.2

  // Mastery thresholds
  private static readonly MASTERY_THRESHOLDS = {
    NOT_LEARNED: { minRepetitions: 0, minEaseFactor: 0 },
    LEARNING: { minRepetitions: 1, minEaseFactor: 1.8 },
    FAMILIAR: { minRepetitions: 3, minEaseFactor: 2.0 },
    MASTERED: { minRepetitions: 6, minEaseFactor: 2.3 }
  }

  /**
   * Calculate next review parameters based on performance
   *
   * @param progress Current vocabulary progress
   * @param quality Quality rating (0-5)
   * @param options Additional options for calculation
   * @returns SM2Result with updated interval, ease factor, and next review date
   */
  calculateNextReview(
    progress: VocabularyProgress,
    quality: SM2Quality,
    options: SpacedRepetitionOptions = {}
  ): SM2Result {
    const {
      languageComplexity = 1.0,
      mistakeTypeWeight = 1.0,
      timeSpentMultiplier = 1.0,
      minimumInterval = 1,
      maximumInterval = 365
    } = options

    // Current values
    let { easeFactor, repetitions, interval } = progress

    // Initialize defaults if needed
    easeFactor = easeFactor || SpacedRepetitionEngine.DEFAULT_EASE_FACTOR
    repetitions = repetitions || 0
    interval = interval || 1

    // Calculate new ease factor based on quality (SM-2 formula)
    let newEaseFactor = easeFactor + (
      SpacedRepetitionEngine.EASE_FACTOR_BONUS -
      (5 - quality) * (SpacedRepetitionEngine.EASE_FACTOR_BONUS +
      SpacedRepetitionEngine.EASE_FACTOR_PENALTY)
    )

    // Apply language complexity adjustment
    newEaseFactor = newEaseFactor * (2 - languageComplexity) // More complex = lower ease factor

    // Apply mistake type weight
    newEaseFactor = newEaseFactor * mistakeTypeWeight

    // Clamp ease factor to valid range
    newEaseFactor = Math.max(
      SpacedRepetitionEngine.MIN_EASE_FACTOR,
      Math.min(SpacedRepetitionEngine.MAX_EASE_FACTOR, newEaseFactor)
    )

    // Calculate repetitions and interval based on quality
    let newRepetitions: number
    let newInterval: number

    if (quality < 3) {
      // Failed recall - restart from beginning
      newRepetitions = 0
      newInterval = 1
    } else {
      // Successful recall - increase interval
      newRepetitions = repetitions + 1

      if (newRepetitions === 1) {
        newInterval = 1
      } else if (newRepetitions === 2) {
        newInterval = 6
      } else {
        // SM-2 formula: I(n) = I(n-1) * EF
        newInterval = Math.round(interval * newEaseFactor)
      }
    }

    // Apply time spent multiplier (faster = slightly shorter interval)
    newInterval = Math.round(newInterval * timeSpentMultiplier)

    // Clamp interval to valid range
    newInterval = Math.max(minimumInterval, Math.min(maximumInterval, newInterval))

    // Calculate next review date
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + newInterval)
    nextReview.setHours(0, 0, 0, 0) // Reset to start of day

    // Determine mastery level
    const masteryLevel = this.calculateMasteryLevel(newRepetitions, newEaseFactor)

    return {
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
      nextReview,
      masteryLevel
    }
  }

  /**
   * Convert student response data to SM-2 quality rating
   *
   * @param isCorrect Whether the answer was correct
   * @param hintsUsed Number of hints used
   * @param responseTime Response time in milliseconds
   * @param expectedTime Expected response time in milliseconds
   * @returns Quality rating (0-5)
   */
  responseToQuality(
    isCorrect: boolean,
    hintsUsed: number,
    responseTime: number,
    expectedTime: number = 5000
  ): SM2Quality {
    if (!isCorrect) {
      // Failed responses
      if (hintsUsed > 0) {
        return 2 // Incorrect but remembered with hints
      }
      return 1 // Incorrect but seemed familiar
    }

    // Correct responses - quality based on speed and hints
    const speedRatio = responseTime / expectedTime

    if (hintsUsed > 2) {
      return 3 // Correct with significant difficulty
    } else if (hintsUsed === 1 || speedRatio > 1.5) {
      return 4 // Correct after hesitation
    } else if (speedRatio < 0.5) {
      return 5 // Perfect, instant response
    }

    return 4 // Correct with some hesitation
  }

  /**
   * Determine mastery level based on repetitions and ease factor
   *
   * @param repetitions Number of consecutive successful reviews
   * @param easeFactor Current ease factor
   * @returns Mastery level
   */
  private calculateMasteryLevel(
    repetitions: number,
    easeFactor: number
  ): MasteryLevel {
    const thresholds = SpacedRepetitionEngine.MASTERY_THRESHOLDS

    if (repetitions >= thresholds.MASTERED.minRepetitions &&
        easeFactor >= thresholds.MASTERED.minEaseFactor) {
      return 'MASTERED'
    } else if (repetitions >= thresholds.FAMILIAR.minRepetitions &&
               easeFactor >= thresholds.FAMILIAR.minEaseFactor) {
      return 'FAMILIAR'
    } else if (repetitions >= thresholds.LEARNING.minRepetitions) {
      return 'LEARNING'
    }

    return 'NOT_LEARNED'
  }

  /**
   * Get words due for review based on nextReview date
   *
   * @param progressRecords All vocabulary progress records
   * @param limit Maximum number of words to return
   * @returns Array of progress records that are due for review
   */
  getWordsForReview(
    progressRecords: VocabularyProgress[],
    limit: number = 10
  ): VocabularyProgress[] {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset to start of day for comparison

    return progressRecords
      .filter(progress => {
        // Include if never reviewed or if nextReview date has passed
        if (!progress.nextReview) return true
        const nextReview = new Date(progress.nextReview)
        nextReview.setHours(0, 0, 0, 0)
        return nextReview <= now
      })
      .sort((a, b) => {
        // Sort by priority:
        // 1. Overdue words (older nextReview dates first)
        // 2. Never reviewed words (no lastSeen)
        // 3. Lower mastery levels first
        if (!a.nextReview && !b.nextReview) {
          // Both never reviewed - prioritize by mastery
          const masteryOrder = { NOT_LEARNED: 0, LEARNING: 1, FAMILIAR: 2, MASTERED: 3 }
          return masteryOrder[a.masteryLevel] - masteryOrder[b.masteryLevel]
        }
        if (!a.nextReview) return -1
        if (!b.nextReview) return 1

        const aNext = new Date(a.nextReview).getTime()
        const bNext = new Date(b.nextReview).getTime()
        return aNext - bNext // Earlier dates first
      })
      .slice(0, limit)
  }

  /**
   * Calculate optimal session size based on student's history
   *
   * @param averageAccuracy Average accuracy (0-100)
   * @param averageTimePerWord Average time per word in seconds
   * @returns Recommended number of words per session
   */
  calculateOptimalSessionSize(
    averageAccuracy: number,
    averageTimePerWord: number
  ): number {
    // Base session size
    let sessionSize = 10

    // Adjust based on accuracy
    if (averageAccuracy > 80) {
      sessionSize = 15 // High accuracy = more words
    } else if (averageAccuracy < 60) {
      sessionSize = 5 // Low accuracy = fewer words
    }

    // Adjust based on speed
    if (averageTimePerWord > 10) {
      sessionSize = Math.max(5, Math.floor(sessionSize * 0.7)) // Slow = fewer words
    } else if (averageTimePerWord < 5) {
      sessionSize = Math.min(20, Math.floor(sessionSize * 1.3)) // Fast = more words
    }

    return sessionSize
  }

  /**
   * Calculate streak bonus for XP rewards
   *
   * @param streakCount Current streak count
   * @returns Streak multiplier (1.0-2.0)
   */
  calculateStreakBonus(streakCount: number): number {
    if (streakCount === 0) return 1.0

    // 5% bonus per day, capped at 100% (2.0x)
    return Math.min(2.0, 1.0 + (streakCount * 0.05))
  }

  /**
   * Determine if a word should be considered "lapsed" (forgotten)
   *
   * @param progress Vocabulary progress
   * @param currentDate Current date
   * @returns True if the word is overdue and should trigger a lapse
   */
  isWordLapsed(progress: VocabularyProgress, currentDate: Date = new Date()): boolean {
    if (!progress.nextReview) return false

    const nextReview = new Date(progress.nextReview)
    const daysSinceReview = Math.floor(
      (currentDate.getTime() - nextReview.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Consider lapsed if more than 2x the interval has passed
    return daysSinceReview > (progress.interval * 2)
  }
}
