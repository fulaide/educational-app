/**
 * MathEngine Service
 * Core math logic for generating and evaluating math problems
 */

import type {
  MathProblem,
  MathProblemConfig,
  MathProblemType,
  MathOperation,
  UnknownPosition,
  MathDifficulty,
  MathSession,
  MathAnswer,
  MathSessionResults,
  GermanFeedback,
  DIFFICULTY_RANGES
} from '../types/MathChallenge'

import {
  getRandomSuccessPhrase,
  generateIncorrectExplanation,
  generateCorrectExplanation
} from '../data/german-math-feedback'

// Re-export DIFFICULTY_RANGES from types
export { DIFFICULTY_RANGES } from '../types/MathChallenge'

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Get difficulty range for a given difficulty level
 */
export function getDifficultyRange(difficulty: MathDifficulty): { min: number; max: number } {
  const ranges: Record<MathDifficulty, { min: number; max: number }> = {
    easy: { min: 1, max: 20 },
    medium: { min: 1, max: 50 },
    hard: { min: 1, max: 100 }
  }
  return ranges[difficulty]
}

/**
 * Check if an operation crosses a tens boundary (Zehnerübergang)
 */
export function detectZehneruebergang(
  a: number,
  b: number,
  operation: MathOperation
): boolean {
  if (operation === 'addition') {
    // Check if adding crosses a tens boundary
    const tensA = Math.floor(a / 10)
    const tensResult = Math.floor((a + b) / 10)
    return tensResult > tensA
  } else {
    // Check if subtracting crosses a tens boundary
    const tensA = Math.floor(a / 10)
    const tensResult = Math.floor((a - b) / 10)
    return tensResult < tensA
  }
}

/**
 * Generate a single math problem
 */
export function generateProblem(config: {
  difficulty: MathDifficulty
  includeZehneruebergang: boolean
  operations?: MathOperation[]
  targetZehneruebergang?: boolean // Force Zehnerübergang (true) or non-Zehnerübergang (false)
}): MathProblem {
  const {
    difficulty,
    includeZehneruebergang,
    operations = ['addition', 'subtraction'],
    targetZehneruebergang
  } = config

  const range = getDifficultyRange(difficulty)
  const operation = operations[randomInt(0, operations.length - 1)]

  // Problem type variations
  const problemTypes: MathProblemType[] = operation === 'addition'
    ? ['addition_left', 'addition_right', 'addition_result']
    : ['subtraction_left', 'subtraction_right', 'subtraction_result']

  const type = problemTypes[randomInt(0, problemTypes.length - 1)]

  let leftOperand: number
  let rightOperand: number
  let result: number
  let hasZehneruebergang: boolean

  // Generate valid operands based on constraints
  const maxAttempts = 50
  let attempts = 0

  do {
    attempts++

    if (operation === 'addition') {
      // For addition, both operands should be positive and result within range
      leftOperand = randomInt(range.min, range.max - 1)
      rightOperand = randomInt(range.min, Math.min(range.max - leftOperand, range.max))
      result = leftOperand + rightOperand

      // Ensure result is within range
      if (result > range.max) {
        rightOperand = range.max - leftOperand
        result = leftOperand + rightOperand
      }
    } else {
      // For subtraction, left operand should be larger than right, result should be positive
      leftOperand = randomInt(range.min + 1, range.max)
      rightOperand = randomInt(range.min, leftOperand - 1)
      result = leftOperand - rightOperand
    }

    hasZehneruebergang = detectZehneruebergang(
      operation === 'subtraction' ? leftOperand : leftOperand,
      rightOperand,
      operation
    )

    // Check if we match the Zehnerübergang requirement
    if (targetZehneruebergang !== undefined) {
      if (hasZehneruebergang === targetZehneruebergang) {
        break
      }
    } else if (includeZehneruebergang || !hasZehneruebergang) {
      break
    }
  } while (attempts < maxAttempts)

  // Determine unknown position and correct answer
  let unknownPosition: UnknownPosition
  let correctAnswer: number
  let display: string

  switch (type) {
    case 'addition_left':
      unknownPosition = 'left'
      correctAnswer = leftOperand
      display = `__ + ${rightOperand} = ${result}`
      break
    case 'addition_right':
      unknownPosition = 'right'
      correctAnswer = rightOperand
      display = `${leftOperand} + __ = ${result}`
      break
    case 'addition_result':
      unknownPosition = 'result'
      correctAnswer = result
      display = `${leftOperand} + ${rightOperand} = __`
      break
    case 'subtraction_left':
      unknownPosition = 'left'
      correctAnswer = leftOperand
      display = `__ - ${rightOperand} = ${result}`
      break
    case 'subtraction_right':
      unknownPosition = 'right'
      correctAnswer = rightOperand
      display = `${leftOperand} - __ = ${result}`
      break
    case 'subtraction_result':
      unknownPosition = 'result'
      correctAnswer = result
      display = `${leftOperand} - ${rightOperand} = __`
      break
    default:
      unknownPosition = 'result'
      correctAnswer = result
      display = `${leftOperand} + ${rightOperand} = __`
  }

  return {
    id: generateId(),
    type,
    operation,
    display,
    leftOperand,
    rightOperand,
    result,
    unknownPosition,
    correctAnswer,
    hasZehneruebergang,
    difficulty
  }
}

/**
 * Generate multiple problems for a session
 */
export function generateProblems(config: MathProblemConfig): MathProblem[] {
  const problems: MathProblem[] = []
  const { count, difficulty, includeZehneruebergang, operations } = config

  // If including Zehnerübergang, try to have a mix
  const targetZehneruebergangCount = includeZehneruebergang
    ? Math.ceil(count * 0.4) // 40% with Zehnerübergang
    : 0

  // Generate problems with Zehnerübergang first
  for (let i = 0; i < targetZehneruebergangCount; i++) {
    problems.push(generateProblem({
      difficulty,
      includeZehneruebergang: true,
      operations,
      targetZehneruebergang: true
    }))
  }

  // Generate remaining problems without Zehnerübergang
  for (let i = problems.length; i < count; i++) {
    problems.push(generateProblem({
      difficulty,
      includeZehneruebergang,
      operations,
      targetZehneruebergang: false
    }))
  }

  // Shuffle the problems
  for (let i = problems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[problems[i], problems[j]] = [problems[j], problems[i]]
  }

  return problems
}

/**
 * Evaluate an answer to a problem
 */
export function evaluateAnswer(problem: MathProblem, userAnswer: number): boolean {
  return userAnswer === problem.correctAnswer
}

/**
 * Generate local feedback for an answer (fallback when API unavailable)
 */
export function generateLocalFeedback(
  problem: MathProblem,
  userAnswer: number
): GermanFeedback {
  const isCorrect = evaluateAnswer(problem, userAnswer)

  if (isCorrect) {
    return {
      isCorrect: true,
      message: generateCorrectExplanation(
        problem.leftOperand,
        problem.rightOperand,
        problem.operation,
        problem.result,
        problem.hasZehneruebergang
      )
    }
  }

  return {
    isCorrect: false,
    message: 'Nicht ganz richtig.',
    explanation: generateIncorrectExplanation(
      problem.leftOperand,
      problem.rightOperand,
      problem.operation,
      problem.correctAnswer,
      userAnswer,
      problem.hasZehneruebergang
    )
  }
}

/**
 * Create a new math session
 */
export function createSession(
  studentId: string,
  config: MathProblemConfig
): MathSession {
  return {
    id: generateId(),
    studentId,
    problems: generateProblems(config),
    currentIndex: 0,
    answers: [],
    startedAt: new Date(),
    config
  }
}

/**
 * Calculate session results
 */
export function calculateResults(session: MathSession): MathSessionResults {
  const { answers, problems, config, studentId, id: sessionId } = session

  const correctAnswers = answers.filter(a => a.isCorrect).length
  const incorrectAnswers = answers.length - correctAnswers
  const totalTimeSpent = answers.reduce((sum, a) => sum + a.timeSpent, 0)
  const averageTimePerProblem = answers.length > 0
    ? totalTimeSpent / answers.length
    : 0

  const accuracy = answers.length > 0
    ? (correctAnswers / answers.length) * 100
    : 0

  // XP calculation: base XP per correct answer + bonuses
  const baseXpPerCorrect = 10
  const zehneruebergangBonus = 5
  const difficultyMultiplier: Record<MathDifficulty, number> = {
    easy: 1,
    medium: 1.5,
    hard: 2
  }

  let xpEarned = 0
  for (const answer of answers) {
    if (answer.isCorrect) {
      const problem = problems.find(p => p.id === answer.problemId)
      let xp = baseXpPerCorrect * difficultyMultiplier[config.difficulty]

      if (problem?.hasZehneruebergang) {
        xp += zehneruebergangBonus
      }

      xpEarned += xp
    }
  }

  // Accuracy bonus
  if (accuracy === 100) {
    xpEarned *= 1.2 // 20% bonus for perfect score
  } else if (accuracy >= 80) {
    xpEarned *= 1.1 // 10% bonus for 80%+
  }

  return {
    sessionId,
    studentId,
    totalProblems: problems.length,
    correctAnswers,
    incorrectAnswers,
    accuracy: Math.round(accuracy * 10) / 10,
    totalTimeSpent,
    averageTimePerProblem: Math.round(averageTimePerProblem),
    xpEarned: Math.round(xpEarned),
    difficulty: config.difficulty,
    includesZehneruebergang: config.includeZehneruebergang,
    completedAt: new Date(),
    answers
  }
}

/**
 * Record an answer in a session
 */
export function recordAnswer(
  session: MathSession,
  answer: number,
  timeSpent: number
): { session: MathSession; feedback: GermanFeedback; isComplete: boolean } {
  const currentProblem = session.problems[session.currentIndex]

  if (!currentProblem) {
    throw new Error('No current problem in session')
  }

  const isCorrect = evaluateAnswer(currentProblem, answer)
  const feedback = generateLocalFeedback(currentProblem, answer)

  const mathAnswer: MathAnswer = {
    problemId: currentProblem.id,
    answer,
    isCorrect,
    timeSpent,
    feedback,
    answeredAt: new Date()
  }

  const updatedSession: MathSession = {
    ...session,
    answers: [...session.answers, mathAnswer],
    currentIndex: session.currentIndex + 1
  }

  const isComplete = updatedSession.currentIndex >= updatedSession.problems.length

  if (isComplete) {
    updatedSession.completedAt = new Date()
  }

  return {
    session: updatedSession,
    feedback,
    isComplete
  }
}

/**
 * Get the current problem in a session
 */
export function getCurrentProblem(session: MathSession): MathProblem | null {
  return session.problems[session.currentIndex] ?? null
}

/**
 * Check if session is complete
 */
export function isSessionComplete(session: MathSession): boolean {
  return session.currentIndex >= session.problems.length
}

/**
 * MathEngine class for object-oriented usage
 */
export class MathEngine {
  /**
   * Generate a single problem
   */
  generateProblem = generateProblem

  /**
   * Generate multiple problems
   */
  generateProblems = generateProblems

  /**
   * Evaluate an answer
   */
  evaluateAnswer = evaluateAnswer

  /**
   * Generate local feedback
   */
  generateLocalFeedback = generateLocalFeedback

  /**
   * Detect Zehnerübergang
   */
  detectZehneruebergang = detectZehneruebergang

  /**
   * Create a new session
   */
  createSession = createSession

  /**
   * Record an answer
   */
  recordAnswer = recordAnswer

  /**
   * Calculate session results
   */
  calculateResults = calculateResults

  /**
   * Get current problem
   */
  getCurrentProblem = getCurrentProblem

  /**
   * Check if session is complete
   */
  isSessionComplete = isSessionComplete

  /**
   * Get difficulty range
   */
  getDifficultyRange = getDifficultyRange
}

// Export singleton instance
export const mathEngine = new MathEngine()
