/**
 * Math Challenge Types
 * Types for the interactive German math learning feature
 */

// Problem type variations for Grade 1 math
export type MathProblemType =
  | 'addition_left'       // __ + 35 = 47 (find left operand)
  | 'addition_right'      // 35 + __ = 47 (find right operand)
  | 'subtraction_left'    // __ - 35 = 12 (find left operand)
  | 'subtraction_right'   // 67 - __ = 23 (find right operand)
  | 'addition_result'     // 34 + 12 = __ (find result)
  | 'subtraction_result'  // 45 - 12 = __ (find result)

export type MathOperation = 'addition' | 'subtraction'

export type UnknownPosition = 'left' | 'right' | 'result'

export type MathDifficulty = 'easy' | 'medium' | 'hard'

/**
 * A single math problem
 */
export interface MathProblem {
  id: string
  type: MathProblemType
  operation: MathOperation
  display: string              // "__ + 35 = 47"
  leftOperand: number
  rightOperand: number
  result: number
  unknownPosition: UnknownPosition
  correctAnswer: number
  hasZehneruebergang: boolean  // Crosses tens boundary
  difficulty: MathDifficulty
}

/**
 * Configuration for generating problems
 */
export interface MathProblemConfig {
  difficulty: MathDifficulty
  count: number
  includeZehneruebergang: boolean
  operations?: MathOperation[]  // Default: both
}

/**
 * Difficulty range settings
 */
export interface DifficultyRange {
  min: number
  max: number
  label: string
  labelDe: string
}

export const DIFFICULTY_RANGES: Record<MathDifficulty, DifficultyRange> = {
  easy: { min: 1, max: 20, label: 'Easy', labelDe: 'Leicht' },
  medium: { min: 1, max: 50, label: 'Medium', labelDe: 'Mittel' },
  hard: { min: 1, max: 100, label: 'Hard', labelDe: 'Schwer' }
}

/**
 * German feedback for math problems
 */
export interface GermanFeedback {
  isCorrect: boolean
  message: string              // "Gut gemacht!" or "Nicht ganz richtig."
  explanation?: string         // Pedagogical breakdown
  audioUrl?: string            // ElevenLabs URL
}

/**
 * A math challenge session
 */
export interface MathSession {
  id: string
  studentId: string
  problems: MathProblem[]
  currentIndex: number
  answers: MathAnswer[]
  startedAt: Date
  completedAt?: Date
  config: MathProblemConfig
}

/**
 * A student's answer to a problem
 */
export interface MathAnswer {
  problemId: string
  answer: number
  isCorrect: boolean
  timeSpent: number           // Milliseconds
  feedback?: GermanFeedback
  answeredAt: Date
}

/**
 * Session results summary
 */
export interface MathSessionResults {
  sessionId: string
  studentId: string
  totalProblems: number
  correctAnswers: number
  incorrectAnswers: number
  accuracy: number            // Percentage
  totalTimeSpent: number      // Milliseconds
  averageTimePerProblem: number
  xpEarned: number
  difficulty: MathDifficulty
  includesZehneruebergang: boolean
  completedAt: Date
  answers: MathAnswer[]
}

/**
 * Student math statistics
 */
export interface MathStats {
  totalSessions: number
  totalProblems: number
  correctAnswers: number
  accuracy: number
  totalXpEarned: number
  averageTimePerProblem: number
  strongestOperation: MathOperation | null
  weakestOperation: MathOperation | null
  zehneruebergangAccuracy: number
  recentSessions: MathSessionSummary[]
}

/**
 * Summary of a past session
 */
export interface MathSessionSummary {
  id: string
  completedAt: Date
  difficulty: MathDifficulty
  totalProblems: number
  correctAnswers: number
  accuracy: number
  xpEarned: number
}

/**
 * API request for generating problems via Claude
 */
export interface GenerateProblemsRequest {
  count: number
  difficulty: MathDifficulty
  includeZehneruebergang: boolean
  operations?: MathOperation[]
}

/**
 * API request for evaluating an answer via Claude
 */
export interface EvaluateAnswerRequest {
  problem: MathProblem
  userAnswer: number
}

/**
 * API request for text-to-speech
 */
export interface SpeakTextRequest {
  text: string
  voice?: string
}

/**
 * Audio playback state
 */
export interface AudioState {
  isPlaying: boolean
  isLoading: boolean
  currentUrl: string | null
  error: string | null
}
