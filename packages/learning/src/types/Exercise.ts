// TODO: Replace with @educational-app/i18n when available
import type { LocalizedContent } from './Module'

/**
 * Exercise types supported by the system
 */
export type ExerciseType = 
  | 'MATCHING'          // Match words to images/translations
  | 'MULTIPLE_CHOICE'   // Select correct answer from options
  | 'SPELLING'          // Type the correct word
  | 'AUDIO'            // Listen and identify word
  | 'PICTURE'          // Select image for word
  | 'SENTENCE_BUILDING' // Construct sentences
  | 'DRAG_DROP'        // Drag and drop elements
  | 'FILL_BLANK'       // Fill in missing words

/**
 * Base exercise interface
 */
export interface Exercise {
  id: string
  moduleId: string
  type: ExerciseType
  title: string
  instructions: string
  content: ExerciseContent
  pointsValue: number
  timeLimit?: number // seconds, null for unlimited
  order: number // position within module
  translations: LocalizedContent
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Exercise content union type for different exercise types
 */
export type ExerciseContent = 
  | MatchingExerciseContent
  | MultipleChoiceExerciseContent  
  | SpellingExerciseContent
  | AudioExerciseContent
  | PictureExerciseContent
  | SentenceBuildingExerciseContent
  | DragDropExerciseContent
  | FillBlankExerciseContent

/**
 * Matching exercise content
 */
export interface MatchingExerciseContent {
  type: 'MATCHING'
  pairs: Array<{
    left: ExerciseItem  // German word or audio
    right: ExerciseItem // Image or translation
    id: string
  }>
  shuffleOptions: boolean
}

/**
 * Multiple choice exercise content
 */
export interface MultipleChoiceExerciseContent {
  type: 'MULTIPLE_CHOICE'
  question: ExerciseItem
  options: Array<{
    id: string
    content: ExerciseItem
    isCorrect: boolean
  }>
  allowMultiple: boolean
  shuffleOptions: boolean
}

/**
 * Spelling exercise content
 */
export interface SpellingExerciseContent {
  type: 'SPELLING'
  prompt: ExerciseItem // Audio or image prompt
  correctAnswer: string
  hints?: string[] // Letter hints
  caseSensitive: boolean
  allowPartialCredit: boolean
}

/**
 * Audio exercise content
 */
export interface AudioExerciseContent {
  type: 'AUDIO'
  audioUrl: string
  question: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  playbackLimit?: number
}

/**
 * Picture exercise content  
 */
export interface PictureExerciseContent {
  type: 'PICTURE'
  word: string
  images: Array<{
    id: string
    url: string
    alt: string
    isCorrect: boolean
  }>
  shuffleImages: boolean
}

/**
 * Sentence building exercise content
 */
export interface SentenceBuildingExerciseContent {
  type: 'SENTENCE_BUILDING'
  prompt: string
  words: Array<{
    id: string
    word: string
    isRequired: boolean
  }>
  correctOrder: string[] // array of word IDs
  allowPartialCredit: boolean
}

/**
 * Drag and drop exercise content
 */
export interface DragDropExerciseContent {
  type: 'DRAG_DROP'
  instruction: string
  dropZones: Array<{
    id: string
    label: string
    acceptsTypes: string[]
  }>
  dragItems: Array<{
    id: string
    content: ExerciseItem
    type: string
    correctZoneId: string
  }>
}

/**
 * Fill in the blank exercise content
 */
export interface FillBlankExerciseContent {
  type: 'FILL_BLANK'
  text: string // Text with {blank} markers
  blanks: Array<{
    id: string
    correctAnswers: string[]
    hints?: string[]
    position: number // position in text
  }>
  caseSensitive: boolean
}

/**
 * Exercise item - can be text, image, or audio
 */
export interface ExerciseItem {
  type: 'TEXT' | 'IMAGE' | 'AUDIO'
  content: string // text content, image URL, or audio URL
  alt?: string // alt text for images
  metadata?: Record<string, any>
}

/**
 * Student's exercise attempt
 */
export interface ExerciseAttempt {
  id: string
  exerciseId: string
  studentId: string
  answers: ExerciseAnswers
  score: number
  maxScore: number
  timeSpent: number // seconds
  isCompleted: boolean
  startedAt: Date
  completedAt?: Date
  hints: string[] // hints used
  feedback?: string
}

/**
 * Exercise answers union type
 */
export type ExerciseAnswers = 
  | MatchingAnswers
  | MultipleChoiceAnswers
  | SpellingAnswers
  | AudioAnswers
  | PictureAnswers
  | SentenceBuildingAnswers
  | DragDropAnswers
  | FillBlankAnswers

/**
 * Specific answer types for different exercises
 */
export interface MatchingAnswers {
  type: 'MATCHING'
  pairs: Array<{
    leftId: string
    rightId: string
  }>
}

export interface MultipleChoiceAnswers {
  type: 'MULTIPLE_CHOICE'
  selectedOptions: string[]
}

export interface SpellingAnswers {
  type: 'SPELLING'
  answer: string
  hintsUsed: number
}

export interface AudioAnswers {
  type: 'AUDIO'
  selectedOption: string
  playbackCount: number
}

export interface PictureAnswers {
  type: 'PICTURE'
  selectedImageId: string
}

export interface SentenceBuildingAnswers {
  type: 'SENTENCE_BUILDING'
  wordOrder: string[]
}

export interface DragDropAnswers {
  type: 'DRAG_DROP'
  placements: Array<{
    itemId: string
    zoneId: string
  }>
}

export interface FillBlankAnswers {
  type: 'FILL_BLANK'
  answers: Array<{
    blankId: string
    answer: string
  }>
}

/**
 * Exercise feedback for students
 */
export interface ExerciseFeedback {
  isCorrect: boolean
  score: number
  maxScore: number
  message: string
  explanation?: string
  correctAnswers?: any
  improvementTips?: string[]
  nextSteps?: string[]
}