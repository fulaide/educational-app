// TODO: Replace with @educational-app/i18n when available
export type LocalizedContent = Record<string, string>

/**
 * Learning module difficulty levels
 */
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

/**
 * Learning module categories
 */
export type ModuleCategory = 
  | 'VOCABULARY' 
  | 'GRAMMAR' 
  | 'READING' 
  | 'WRITING' 
  | 'LISTENING' 
  | 'SPEAKING'

/**
 * Learning module status
 */
export type ModuleStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED'

/**
 * Core learning module interface
 */
export interface LearningModule {
  id: string
  organizationId: string
  name: string
  description: string
  category: ModuleCategory
  difficulty: DifficultyLevel
  estimatedDuration: number // minutes
  prerequisites: string[] // module IDs
  imageUrl?: string
  status: ModuleStatus
  translations: LocalizedContent
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string // teacher ID
}

/**
 * Localized module content for display
 */
export interface LocalizedModule extends Omit<LearningModule, 'translations'> {
  localizedName: string
  localizedDescription: string
}

/**
 * Module creation/update input
 */
export interface ModuleInput {
  name: string
  description: string
  category: ModuleCategory
  difficulty: DifficultyLevel
  estimatedDuration: number
  prerequisites?: string[]
  imageUrl?: string
  translations: LocalizedContent
}

/**
 * Module with exercise count and progress info
 */
export interface ModuleWithProgress extends LearningModule {
  exerciseCount: number
  completedExercises: number
  totalPoints: number
  studentProgress?: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
    completionPercentage: number
    score: number
    timeSpent: number
    lastAccessed?: Date
  }
}

/**
 * Module assignment to students/classes
 */
export interface ModuleAssignment {
  id: string
  moduleId: string
  assignedBy: string // teacher ID
  assignedTo: 'CLASS' | 'STUDENT'
  targetId: string // class ID or student ID
  dueDate?: Date
  maxAttempts?: number
  requiredScore?: number
  assignedAt: Date
  isActive: boolean
}

/**
 * Module analytics for teachers
 */
export interface ModuleAnalytics {
  moduleId: string
  totalAssignments: number
  completedAssignments: number
  averageScore: number
  averageTimeSpent: number
  completionRate: number
  difficultyRating: number // student-reported difficulty
  studentFeedback: Array<{
    studentId: string
    rating: number
    comment?: string
    createdAt: Date
  }>
}

/**
 * Module search and filtering options
 */
export interface ModuleFilters {
  category?: ModuleCategory
  difficulty?: DifficultyLevel
  organizationId?: string
  createdBy?: string
  status?: ModuleStatus
  search?: string
  minDuration?: number
  maxDuration?: number
  hasPrerequisites?: boolean
}

/**
 * Module ordering options
 */
export interface ModuleSort {
  field: 'name' | 'difficulty' | 'duration' | 'createdAt' | 'updatedAt'
  order: 'asc' | 'desc'
}