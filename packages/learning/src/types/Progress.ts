/**
 * Student progress tracking types
 */

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED'

/**
 * Student progress in a learning module
 */
export interface StudentProgress {
  id: string
  studentId: string
  moduleId: string
  status: ProgressStatus
  completionPercentage: number // 0-100
  currentExerciseId?: string
  score: number
  maxPossibleScore: number
  timeSpent: number // minutes
  exercisesCompleted: number
  totalExercises: number
  attempts: number
  startedAt: Date
  completedAt?: Date
  lastAccessed: Date
  pausedAt?: Date
  resumedAt?: Date
}

/**
 * Detailed exercise progress within a module
 */
export interface ExerciseProgress {
  id: string
  studentId: string
  exerciseId: string
  moduleId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
  score: number
  maxScore: number
  attempts: number
  timeSpent: number // seconds
  hintsUsed: number
  firstAttemptAt?: Date
  completedAt?: Date
  lastAttemptAt: Date
  isCorrect: boolean
  feedback?: string
}

/**
 * Learning analytics and insights
 */
export interface LearningAnalytics {
  studentId: string
  timeframe: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'
  metrics: {
    totalTimeSpent: number // minutes
    modulesCompleted: number
    exercisesCompleted: number
    averageScore: number
    accuracyRate: number // percentage
    consistencyScore: number // based on daily usage
    improvementRate: number // score improvement over time
    vocabularyWordsLearned: number
    currentStreak: number // consecutive days
    longestStreak: number
  }
  progressByCategory: Array<{
    category: string
    completed: number
    total: number
    averageScore: number
    timeSpent: number
  }>
  weeklyActivity: Array<{
    date: Date
    timeSpent: number
    exercisesCompleted: number
    score: number
  }>
  strongAreas: string[] // categories with high performance
  improvementAreas: string[] // categories needing attention
}

/**
 * Progress milestones and achievements
 */
export interface ProgressMilestone {
  id: string
  studentId: string
  type: MilestoneType
  title: string
  description: string
  achievedAt: Date
  value: number // points, streak count, etc.
  metadata?: Record<string, any>
}

export type MilestoneType = 
  | 'FIRST_EXERCISE'
  | 'FIRST_MODULE' 
  | 'STREAK_MILESTONE'
  | 'SCORE_MILESTONE'
  | 'CATEGORY_MASTERY'
  | 'TIME_MILESTONE'
  | 'ACCURACY_MILESTONE'
  | 'VOCABULARY_MILESTONE'

/**
 * Learning path and recommendations
 */
export interface LearningPath {
  studentId: string
  currentLevel: number
  recommendedModules: Array<{
    moduleId: string
    priority: number
    reason: string
    estimatedDuration: number
  }>
  prerequisitesNeeded: string[] // module IDs
  skillGaps: Array<{
    skill: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    recommendedActions: string[]
  }>
  nextGoals: Array<{
    goal: string
    targetDate: Date
    progress: number // 0-100
  }>
}

/**
 * Progress comparison and benchmarking
 */
export interface ProgressComparison {
  student: {
    studentId: string
    score: number
    timeSpent: number
    exercisesCompleted: number
  }
  classAverage: {
    score: number
    timeSpent: number
    exercisesCompleted: number
  }
  gradeAverage: {
    score: number
    timeSpent: number
    exercisesCompleted: number
  }
  percentileRanking: number // 0-100
  strengths: string[]
  areasForImprovement: string[]
}

/**
 * Progress synchronization for offline support
 */
export interface ProgressSync {
  id: string
  studentId: string
  deviceId: string
  lastSyncAt: Date
  pendingChanges: Array<{
    type: 'PROGRESS' | 'EXERCISE_ATTEMPT' | 'SESSION'
    data: any
    timestamp: Date
  }>
  conflictResolution: 'SERVER_WINS' | 'CLIENT_WINS' | 'MERGE'
}

/**
 * Progress notification and alerts
 */
export interface ProgressAlert {
  id: string
  studentId: string
  type: AlertType
  severity: 'INFO' | 'WARNING' | 'URGENT'
  title: string
  message: string
  actionRequired?: string
  createdAt: Date
  readAt?: Date
  dismissed?: boolean
}

export type AlertType = 
  | 'STREAK_BROKEN'
  | 'FALLING_BEHIND'
  | 'MILESTONE_ACHIEVED'
  | 'REVIEW_DUE'
  | 'PERFORMANCE_DROP'
  | 'GOAL_REMINDER'

/**
 * Progress export for reporting
 */
export interface ProgressReport {
  studentId: string
  studentName: string
  reportPeriod: {
    startDate: Date
    endDate: Date
  }
  summary: {
    totalTimeSpent: number
    modulesCompleted: number
    averageScore: number
    accuracyRate: number
  }
  moduleProgress: Array<{
    moduleId: string
    moduleName: string
    status: ProgressStatus
    completionPercentage: number
    score: number
    timeSpent: number
  }>
  vocabularyProgress: {
    wordsLearned: number
    categoriesCompleted: string[]
    masteryLevels: Record<string, number>
  }
  achievements: Array<{
    title: string
    achievedAt: Date
    description: string
  }>
  recommendations: string[]
  teacherNotes?: string[]
  generatedAt: Date
}