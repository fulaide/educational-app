import type { 
  LearningModule, 
  ModuleWithProgress, 
  Exercise, 
  ExerciseAttempt, 
  ExerciseFeedback,
  StudentProgress,
  ModuleFilters
} from '../types'

/**
 * Core learning service for managing learning modules and exercises
 */
export class LearningService {
  private apiBase: string

  constructor(apiBase = '/api/learning') {
    this.apiBase = apiBase
  }

  /**
   * Get available learning modules for a student
   */
  async getModulesForStudent(
    studentId: string, 
    filters?: ModuleFilters
  ): Promise<ModuleWithProgress[]> {
    try {
      const params = new URLSearchParams({
        studentId,
        ...filters && Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        )
      })

      const response = await fetch(`${this.apiBase}/modules?${params}`)
      if (!response.ok) throw new Error('Failed to fetch modules')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching modules:', error)
      return this.getMockModules(studentId)
    }
  }

  /**
   * Get a specific learning module with student progress
   */
  async getModule(moduleId: string, studentId: string): Promise<ModuleWithProgress | null> {
    try {
      const response = await fetch(`${this.apiBase}/modules/${moduleId}?studentId=${studentId}`)
      if (!response.ok) throw new Error('Module not found')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching module:', error)
      return this.getMockModule(moduleId, studentId)
    }
  }

  /**
   * Start a learning module for a student
   */
  async startModule(studentId: string, moduleId: string): Promise<StudentProgress> {
    try {
      const response = await fetch(`${this.apiBase}/modules/${moduleId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      })
      
      if (!response.ok) throw new Error('Failed to start module')
      
      return await response.json()
    } catch (error) {
      console.error('Error starting module:', error)
      return this.createMockProgress(studentId, moduleId)
    }
  }

  /**
   * Get exercises for a learning module
   */
  async getModuleExercises(moduleId: string): Promise<Exercise[]> {
    try {
      const response = await fetch(`${this.apiBase}/modules/${moduleId}/exercises`)
      if (!response.ok) throw new Error('Failed to fetch exercises')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching exercises:', error)
      return this.getMockExercises(moduleId)
    }
  }

  /**
   * Get next exercise for student based on progress
   */
  async getNextExercise(studentId: string, moduleId: string): Promise<Exercise | null> {
    try {
      const response = await fetch(
        `${this.apiBase}/modules/${moduleId}/next-exercise?studentId=${studentId}`
      )
      
      if (!response.ok) return null
      
      return await response.json()
    } catch (error) {
      console.error('Error getting next exercise:', error)
      return this.getMockNextExercise(moduleId)
    }
  }

  /**
   * Submit exercise attempt and get feedback
   */
  async submitExercise(attemptData: Omit<ExerciseAttempt, 'id'>): Promise<ExerciseFeedback> {
    try {
      const response = await fetch(`${this.apiBase}/exercises/${attemptData.exerciseId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attemptData)
      })
      
      if (!response.ok) throw new Error('Failed to submit exercise')
      
      return await response.json()
    } catch (error) {
      console.error('Error submitting exercise:', error)
      return this.generateMockFeedback(attemptData)
    }
  }

  /**
   * Update student progress in module
   */
  async updateProgress(
    studentId: string, 
    moduleId: string, 
    progressData: Partial<StudentProgress>
  ): Promise<StudentProgress> {
    try {
      const response = await fetch(`${this.apiBase}/progress/${studentId}/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      })
      
      if (!response.ok) throw new Error('Failed to update progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error updating progress:', error)
      return this.getMockProgressUpdate(studentId, moduleId, progressData)
    }
  }

  /**
   * Get student's overall learning analytics
   */
  async getStudentAnalytics(studentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/analytics/${studentId}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return this.getMockAnalytics(studentId)
    }
  }

  // Mock data methods for development/offline use
  private getMockModules(studentId: string): ModuleWithProgress[] {
    return [
      {
        id: 'module-animals',
        organizationId: 'org-1',
        name: 'Tiere lernen',
        description: 'Lerne deutsche Tiernamen',
        category: 'VOCABULARY',
        difficulty: 'BEGINNER',
        estimatedDuration: 30,
        prerequisites: [],
        status: 'ACTIVE',
        translations: {
          de: 'Tiere lernen',
          en: 'Learning Animals'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'teacher-1',
        exerciseCount: 5,
        completedExercises: 0,
        totalPoints: 50,
        studentProgress: {
          status: 'NOT_STARTED',
          completionPercentage: 0,
          score: 0,
          timeSpent: 0
        }
      },
      {
        id: 'module-colors',
        organizationId: 'org-1',
        name: 'Farben lernen',
        description: 'Lerne deutsche Farben',
        category: 'VOCABULARY',
        difficulty: 'BEGINNER',
        estimatedDuration: 25,
        prerequisites: [],
        status: 'ACTIVE',
        translations: {
          de: 'Farben lernen',
          en: 'Learning Colors'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'teacher-1',
        exerciseCount: 4,
        completedExercises: 2,
        totalPoints: 40,
        studentProgress: {
          status: 'IN_PROGRESS',
          completionPercentage: 50,
          score: 18,
          timeSpent: 12,
          lastAccessed: new Date()
        }
      }
    ]
  }

  private getMockModule(moduleId: string, studentId: string): ModuleWithProgress {
    return this.getMockModules(studentId).find(m => m.id === moduleId) || this.getMockModules(studentId)[0]
  }

  private createMockProgress(studentId: string, moduleId: string): StudentProgress {
    return {
      id: `progress-${Date.now()}`,
      studentId,
      moduleId,
      status: 'IN_PROGRESS',
      completionPercentage: 0,
      score: 0,
      maxPossibleScore: 50,
      timeSpent: 0,
      exercisesCompleted: 0,
      totalExercises: 5,
      attempts: 1,
      startedAt: new Date(),
      lastAccessed: new Date()
    }
  }

  private getMockExercises(moduleId: string): Exercise[] {
    return [
      {
        id: `${moduleId}-ex-1`,
        moduleId,
        type: 'MATCHING',
        title: 'Match Animals',
        instructions: 'Match German animal names to their pictures',
        content: {
          type: 'MATCHING',
          pairs: [
            {
              id: '1',
              left: { type: 'TEXT', content: 'Hund' },
              right: { type: 'IMAGE', content: '/images/dog.jpg', alt: 'Dog' }
            },
            {
              id: '2', 
              left: { type: 'TEXT', content: 'Katze' },
              right: { type: 'IMAGE', content: '/images/cat.jpg', alt: 'Cat' }
            }
          ],
          shuffleOptions: true
        },
        pointsValue: 10,
        order: 1,
        translations: {
          de: 'Tiere zuordnen',
          en: 'Match Animals'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `${moduleId}-ex-2`,
        moduleId,
        type: 'MULTIPLE_CHOICE',
        title: 'Animal Quiz',
        instructions: 'Select the correct German word',
        content: {
          type: 'MULTIPLE_CHOICE',
          question: { type: 'IMAGE', content: '/images/dog.jpg', alt: 'Dog' },
          options: [
            { id: '1', content: { type: 'TEXT', content: 'Hund' }, isCorrect: true },
            { id: '2', content: { type: 'TEXT', content: 'Katze' }, isCorrect: false },
            { id: '3', content: { type: 'TEXT', content: 'Vogel' }, isCorrect: false }
          ],
          allowMultiple: false,
          shuffleOptions: true
        },
        pointsValue: 10,
        order: 2,
        translations: {
          de: 'Tier-Quiz',
          en: 'Animal Quiz'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  private getMockNextExercise(moduleId: string): Exercise {
    return this.getMockExercises(moduleId)[0]
  }

  private generateMockFeedback(attemptData: Omit<ExerciseAttempt, 'id'>): ExerciseFeedback {
    // Simple mock feedback based on attempt
    const isCorrect = Math.random() > 0.3 // 70% success rate for demo
    const score = isCorrect ? 10 : 0
    
    return {
      isCorrect,
      score,
      maxScore: 10,
      message: isCorrect ? 'Sehr gut!' : 'Versuche es noch einmal!',
      explanation: isCorrect ? 'Richtige Antwort!' : 'Das war nicht ganz richtig.',
      improvementTips: isCorrect ? [] : ['Schaue dir das Bild genau an', 'Überlege dir die Bedeutung']
    }
  }

  private getMockProgressUpdate(
    studentId: string, 
    moduleId: string, 
    progressData: Partial<StudentProgress>
  ): StudentProgress {
    return {
      id: `progress-${studentId}-${moduleId}`,
      studentId,
      moduleId,
      status: progressData.status || 'IN_PROGRESS',
      completionPercentage: progressData.completionPercentage || 25,
      score: progressData.score || 10,
      maxPossibleScore: 50,
      timeSpent: progressData.timeSpent || 5,
      exercisesCompleted: progressData.exercisesCompleted || 1,
      totalExercises: 5,
      attempts: 1,
      startedAt: new Date(Date.now() - 300000), // 5 minutes ago
      lastAccessed: new Date()
    }
  }

  private getMockAnalytics(studentId: string): any {
    return {
      studentId,
      timeframe: 'WEEKLY',
      metrics: {
        totalTimeSpent: 120, // minutes
        modulesCompleted: 2,
        exercisesCompleted: 15,
        averageScore: 85,
        accuracyRate: 82,
        vocabularyWordsLearned: 25,
        currentStreak: 5,
        longestStreak: 12
      },
      progressByCategory: [
        {
          category: 'ANIMALS',
          completed: 5,
          total: 8,
          averageScore: 90,
          timeSpent: 45
        },
        {
          category: 'COLORS',
          completed: 4,
          total: 6,
          averageScore: 78,
          timeSpent: 30
        }
      ],
      strongAreas: ['ANIMALS', 'NUMBERS'],
      improvementAreas: ['FAMILY', 'OBJECTS']
    }
  }
}