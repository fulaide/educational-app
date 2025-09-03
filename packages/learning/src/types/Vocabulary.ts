// TODO: Replace with @educational-app/i18n when available
import type { LocalizedContent } from './Module'
import type { DifficultyLevel } from './Module'

/**
 * Vocabulary categories supported by the system
 */
export type VocabularyCategory = 
  | 'ANIMALS'     // Tiere
  | 'COLORS'      // Farben  
  | 'NUMBERS'     // Zahlen
  | 'FAMILY'      // Familie
  | 'OBJECTS'     // Gegenstände
  | 'FOOD'        // Essen
  | 'CLOTHING'    // Kleidung
  | 'BODY_PARTS'  // Körperteile
  | 'WEATHER'     // Wetter
  | 'TIME'        // Zeit
  | 'PLACES'      // Orte
  | 'ACTIONS'     // Tätigkeiten

/**
 * Core vocabulary word interface
 */
export interface VocabularyWord {
  id: string
  organizationId: string
  word: string // Primary German word
  translation: string // English translation  
  phonetic?: string // IPA pronunciation guide
  audioUrl?: string // Audio pronunciation file
  imageUrl?: string // Associated image
  category: VocabularyCategory
  difficulty: DifficultyLevel
  frequency: number // Usage frequency (1-10)
  tags: string[] // Additional categorization
  translations: LocalizedContent // Full i18n support
  examples?: Array<{
    german: string
    english: string
    context?: string
  }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string // teacher ID
}

/**
 * Vocabulary word with learning metrics
 */
export interface VocabularyWordWithProgress extends VocabularyWord {
  studentProgress?: {
    masteryLevel: MasteryLevel
    correctAttempts: number
    totalAttempts: number
    lastSeen: Date
    nextReview: Date
    streakCount: number
  }
}

/**
 * Student's mastery level for a vocabulary word
 */
export type MasteryLevel = 
  | 'NOT_LEARNED'     // 0-25% accuracy
  | 'LEARNING'        // 26-50% accuracy  
  | 'FAMILIAR'        // 51-75% accuracy
  | 'MASTERED'        // 76-100% accuracy

/**
 * Vocabulary learning session
 */
export interface VocabularySession {
  id: string
  studentId: string
  category?: VocabularyCategory
  difficulty?: DifficultyLevel
  wordsToReview: string[] // vocabulary word IDs
  wordsCompleted: string[]
  sessionType: 'REVIEW' | 'NEW_WORDS' | 'MIXED'
  startedAt: Date
  completedAt?: Date
  totalTimeSpent: number // seconds
  averageAccuracy: number
}

/**
 * Vocabulary word attempt in a session
 */
export interface VocabularyAttempt {
  id: string
  sessionId: string
  wordId: string
  studentId: string
  exerciseType: 'RECOGNITION' | 'RECALL' | 'SPELLING' | 'AUDIO'
  isCorrect: boolean
  responseTime: number // milliseconds
  hintsUsed: number
  attemptedAt: Date
}

/**
 * Student's progress on a vocabulary word (matches database table)
 */
export interface VocabularyProgress {
  id: string
  studentId: string
  wordId: string
  masteryLevel: MasteryLevel
  correctAttempts: number
  totalAttempts: number
  lastSeen?: Date
  nextReview?: Date
  streakCount: number
  // Spaced repetition algorithm data
  interval: number // days until next review
  easeFactor: number // difficulty multiplier
  repetitions: number
  lapseCount: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Spaced repetition algorithm data
 */
export interface SpacedRepetitionData {
  wordId: string
  studentId: string
  interval: number // days until next review
  easeFactor: number // difficulty multiplier (1.3 - 2.5)
  repetitions: number // successful repetitions
  lastReviewed: Date
  nextReview: Date
  lapseCount: number // number of times forgotten
}

/**
 * Vocabulary category with words and metadata
 */
export interface VocabularyCategory_Interface {
  category: VocabularyCategory
  name: LocalizedContent
  description: LocalizedContent
  color: string // hex color for UI
  icon: string // icon name or emoji
  words: VocabularyWord[]
  totalWords: number
  averageDifficulty: DifficultyLevel
}

/**
 * Vocabulary learning statistics
 */
export interface VocabularyStats {
  studentId: string
  totalWordsLearned: number
  wordsByMastery: {
    notLearned: number
    learning: number  
    familiar: number
    mastered: number
  }
  wordsByCategory: Array<{
    category: VocabularyCategory
    total: number
    mastered: number
    masteryPercentage: number
  }>
  currentStreak: number
  longestStreak: number
  averageAccuracy: number
  totalTimeSpent: number // minutes
  wordsLearnedThisWeek: number
  reviewsDue: number
}

/**
 * Vocabulary word creation/update input
 */
export interface VocabularyWordInput {
  word: string
  translation: string
  phonetic?: string
  audioUrl?: string
  imageUrl?: string
  category: VocabularyCategory
  difficulty: DifficultyLevel
  frequency?: number
  tags?: string[]
  translations: LocalizedContent
  examples?: Array<{
    german: string
    english: string
    context?: string
  }>
}

/**
 * Vocabulary search and filtering
 */
export interface VocabularyFilters {
  category?: VocabularyCategory
  difficulty?: DifficultyLevel
  masteryLevel?: MasteryLevel
  organizationId?: string
  createdBy?: string
  search?: string
  hasAudio?: boolean
  hasImage?: boolean
  reviewsDue?: boolean
}

/**
 * Vocabulary import/export format
 */
export interface VocabularyImportData {
  words: Array<{
    word: string
    translation: string
    phonetic?: string
    category: VocabularyCategory
    difficulty?: DifficultyLevel
    examples?: Array<{
      german: string
      english: string
    }>
  }>
  metadata?: {
    source: string
    version: string
    createdAt: string
  }
}

/**
 * Vocabulary learning recommendations
 */
export interface VocabularyRecommendations {
  studentId: string
  recommendedWords: Array<{
    word: VocabularyWord
    reason: 'DUE_REVIEW' | 'NEW_CATEGORY' | 'DIFFICULTY_PROGRESSION' | 'RELATED_WORD'
    priority: number // 1-10
  }>
  reviewWords: string[] // word IDs due for review
  newWords: string[] // suggested new words to learn
  practiceAreas: VocabularyCategory[] // categories needing more practice
}