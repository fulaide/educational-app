import type { 
  StudentProgress,
  ExerciseProgress,
  LearningAnalytics,
  ProgressMilestone,
  LearningPath,
  ProgressComparison,
  ProgressAlert,
  ProgressReport,
  AlertType,
  MilestoneType
} from '../types'

export class ProgressService {
  private apiBase: string

  constructor(apiBase = '/api/progress') {
    this.apiBase = apiBase
  }

  /**
   * Get student's progress across all modules
   */
  async getStudentProgress(
    studentId: string,
    moduleId?: string
  ): Promise<StudentProgress[]> {
    try {
      const params = new URLSearchParams({
        studentId,
        ...(moduleId && { moduleId })
      })

      const response = await fetch(`${this.apiBase}/student?${params}`)
      if (!response.ok) throw new Error('Failed to fetch student progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching student progress:', error)
      return this.getMockStudentProgress(studentId, moduleId)
    }
  }

  /**
   * Get detailed exercise progress for a module
   */
  async getExerciseProgress(
    studentId: string,
    moduleId: string
  ): Promise<ExerciseProgress[]> {
    try {
      const response = await fetch(
        `${this.apiBase}/exercises/${studentId}/${moduleId}`
      )
      if (!response.ok) throw new Error('Failed to fetch exercise progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching exercise progress:', error)
      return this.getMockExerciseProgress(studentId, moduleId)
    }
  }

  /**
   * Update student progress after exercise completion
   */
  async updateProgress(
    studentId: string,
    moduleId: string,
    exerciseId: string,
    progressData: {
      score: number
      timeSpent: number
      isCorrect: boolean
      hintsUsed?: number
    }
  ): Promise<{ 
    moduleProgress: StudentProgress
    exerciseProgress: ExerciseProgress
    milestones?: ProgressMilestone[]
  }> {
    try {
      const response = await fetch(`${this.apiBase}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          moduleId,
          exerciseId,
          ...progressData
        })
      })
      
      if (!response.ok) throw new Error('Failed to update progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error updating progress:', error)
      return this.calculateMockProgressUpdate(studentId, moduleId, exerciseId, progressData)
    }
  }

  /**
   * Get comprehensive learning analytics for student
   */
  async getLearningAnalytics(
    studentId: string,
    timeframe: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'WEEKLY'
  ): Promise<LearningAnalytics> {
    try {
      const response = await fetch(
        `${this.apiBase}/analytics/${studentId}?timeframe=${timeframe}`
      )
      if (!response.ok) throw new Error('Failed to fetch learning analytics')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching learning analytics:', error)
      return this.getMockLearningAnalytics(studentId, timeframe)
    }
  }

  /**
   * Get student milestones and achievements
   */
  async getStudentMilestones(
    studentId: string,
    limit = 20
  ): Promise<ProgressMilestone[]> {
    try {
      const response = await fetch(
        `${this.apiBase}/milestones/${studentId}?limit=${limit}`
      )
      if (!response.ok) throw new Error('Failed to fetch milestones')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching milestones:', error)
      return this.getMockMilestones(studentId, limit)
    }
  }

  /**
   * Get personalized learning path recommendations
   */
  async getLearningPath(studentId: string): Promise<LearningPath> {
    try {
      const response = await fetch(`${this.apiBase}/learning-path/${studentId}`)
      if (!response.ok) throw new Error('Failed to fetch learning path')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching learning path:', error)
      return this.getMockLearningPath(studentId)
    }
  }

  /**
   * Compare student progress with class/grade averages
   */
  async getProgressComparison(
    studentId: string,
    classId: string
  ): Promise<ProgressComparison> {
    try {
      const response = await fetch(
        `${this.apiBase}/comparison/${studentId}?classId=${classId}`
      )
      if (!response.ok) throw new Error('Failed to fetch progress comparison')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching progress comparison:', error)
      return this.getMockProgressComparison(studentId, classId)
    }
  }

  /**
   * Get progress alerts for student (streak breaks, falling behind, etc.)
   */
  async getProgressAlerts(
    studentId: string,
    unreadOnly = false
  ): Promise<ProgressAlert[]> {
    try {
      const params = new URLSearchParams({
        studentId,
        ...(unreadOnly && { unreadOnly: 'true' })
      })

      const response = await fetch(`${this.apiBase}/alerts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch progress alerts')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching progress alerts:', error)
      return this.getMockProgressAlerts(studentId, unreadOnly)
    }
  }

  /**
   * Mark progress alert as read
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      await fetch(`${this.apiBase}/alerts/${alertId}/read`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking alert as read:', error)
    }
  }

  /**
   * Generate progress report for student
   */
  async generateProgressReport(
    studentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ProgressReport> {
    try {
      const response = await fetch(`${this.apiBase}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      })
      
      if (!response.ok) throw new Error('Failed to generate progress report')
      
      return await response.json()
    } catch (error) {
      console.error('Error generating progress report:', error)
      return this.getMockProgressReport(studentId, startDate, endDate)
    }
  }

  /**
   * Pause module progress (student taking a break)
   */
  async pauseModuleProgress(
    studentId: string,
    moduleId: string
  ): Promise<StudentProgress> {
    try {
      const response = await fetch(`${this.apiBase}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, moduleId })
      })
      
      if (!response.ok) throw new Error('Failed to pause module progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error pausing module progress:', error)
      return this.getMockPauseProgress(studentId, moduleId)
    }
  }

  /**
   * Resume paused module progress
   */
  async resumeModuleProgress(
    studentId: string,
    moduleId: string
  ): Promise<StudentProgress> {
    try {
      const response = await fetch(`${this.apiBase}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, moduleId })
      })
      
      if (!response.ok) throw new Error('Failed to resume module progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error resuming module progress:', error)
      return this.getMockResumeProgress(studentId, moduleId)
    }
  }

  // Mock data methods for development/offline use
  private getMockStudentProgress(
    studentId: string,
    moduleId?: string
  ): StudentProgress[] {
    const mockProgresses = [
      {
        id: 'progress-1',
        studentId,
        moduleId: 'module-animals',
        status: 'IN_PROGRESS' as const,
        completionPercentage: 60,
        currentExerciseId: 'exercise-3',
        score: 45,
        maxPossibleScore: 75,
        timeSpent: 25,
        exercisesCompleted: 3,
        totalExercises: 5,
        attempts: 1,
        startedAt: new Date(Date.now() - 86400000), // Yesterday
        lastAccessed: new Date(),
      },
      {
        id: 'progress-2',
        studentId,
        moduleId: 'module-colors',
        status: 'COMPLETED' as const,
        completionPercentage: 100,
        score: 85,
        maxPossibleScore: 80,
        timeSpent: 18,
        exercisesCompleted: 4,
        totalExercises: 4,
        attempts: 1,
        startedAt: new Date(Date.now() - 172800000), // 2 days ago
        completedAt: new Date(Date.now() - 86400000),
        lastAccessed: new Date(Date.now() - 86400000),
      }
    ]

    return moduleId ? 
      mockProgresses.filter(p => p.moduleId === moduleId) : 
      mockProgresses
  }

  private getMockExerciseProgress(
    studentId: string,
    moduleId: string
  ): ExerciseProgress[] {
    return [
      {
        id: 'ex-progress-1',
        studentId,
        exerciseId: 'exercise-1',
        moduleId,
        status: 'COMPLETED',
        score: 10,
        maxScore: 10,
        attempts: 1,
        timeSpent: 120, // 2 minutes
        hintsUsed: 0,
        firstAttemptAt: new Date(Date.now() - 7200000),
        completedAt: new Date(Date.now() - 7080000),
        lastAttemptAt: new Date(Date.now() - 7080000),
        isCorrect: true,
        feedback: 'Perfect! Great job matching the animals.'
      },
      {
        id: 'ex-progress-2',
        studentId,
        exerciseId: 'exercise-2',
        moduleId,
        status: 'COMPLETED',
        score: 8,
        maxScore: 10,
        attempts: 2,
        timeSpent: 180,
        hintsUsed: 1,
        firstAttemptAt: new Date(Date.now() - 3600000),
        completedAt: new Date(Date.now() - 3420000),
        lastAttemptAt: new Date(Date.now() - 3420000),
        isCorrect: true,
        feedback: 'Good work! Remember to listen carefully to the sounds.'
      }
    ]
  }

  private calculateMockProgressUpdate(
    studentId: string,
    moduleId: string,
    exerciseId: string,
    progressData: any
  ) {
    const milestones: ProgressMilestone[] = []
    
    // Check for milestone triggers
    if (progressData.isCorrect && progressData.score >= 10) {
      milestones.push({
        id: `milestone-${Date.now()}`,
        studentId,
        type: 'SCORE_MILESTONE',
        title: 'Perfect Score!',
        description: 'You got a perfect score on this exercise!',
        achievedAt: new Date(),
        value: progressData.score
      })
    }

    return {
      moduleProgress: this.getMockStudentProgress(studentId, moduleId)[0],
      exerciseProgress: this.getMockExerciseProgress(studentId, moduleId)[0],
      ...(milestones.length > 0 && { milestones })
    }
  }

  private getMockLearningAnalytics(
    studentId: string,
    timeframe: string
  ): LearningAnalytics {
    return {
      studentId,
      timeframe: timeframe as any,
      metrics: {
        totalTimeSpent: 120,
        modulesCompleted: 2,
        exercisesCompleted: 15,
        averageScore: 85,
        accuracyRate: 82,
        consistencyScore: 7.5,
        improvementRate: 12,
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
      weeklyActivity: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000),
        timeSpent: Math.floor(Math.random() * 30) + 10,
        exercisesCompleted: Math.floor(Math.random() * 5) + 1,
        score: Math.floor(Math.random() * 40) + 60
      })),
      strongAreas: ['ANIMALS', 'NUMBERS'],
      improvementAreas: ['FAMILY', 'OBJECTS']
    }
  }

  private getMockMilestones(
    studentId: string,
    limit: number
  ): ProgressMilestone[] {
    const milestoneTypes: MilestoneType[] = [
      'FIRST_EXERCISE', 'FIRST_MODULE', 'STREAK_MILESTONE', 
      'SCORE_MILESTONE', 'CATEGORY_MASTERY'
    ]
    
    return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: `milestone-${i}`,
      studentId,
      type: milestoneTypes[i % milestoneTypes.length],
      title: `Milestone ${i + 1}`,
      description: `You achieved milestone ${i + 1}!`,
      achievedAt: new Date(Date.now() - i * 86400000 * 2),
      value: (i + 1) * 10
    }))
  }

  private getMockLearningPath(studentId: string): LearningPath {
    return {
      studentId,
      currentLevel: 2,
      recommendedModules: [
        {
          moduleId: 'module-numbers',
          priority: 1,
          reason: 'Next logical step after mastering animals and colors',
          estimatedDuration: 20
        },
        {
          moduleId: 'module-family',
          priority: 2,
          reason: 'Builds vocabulary for personal relationships',
          estimatedDuration: 25
        }
      ],
      prerequisitesNeeded: [],
      skillGaps: [
        {
          skill: 'Listening comprehension',
          severity: 'MEDIUM',
          recommendedActions: ['Practice audio exercises', 'Use pronunciation guide']
        }
      ],
      nextGoals: [
        {
          goal: 'Complete Numbers module',
          targetDate: new Date(Date.now() + 7 * 86400000),
          progress: 0
        }
      ]
    }
  }

  private getMockProgressComparison(
    studentId: string,
    classId: string
  ): ProgressComparison {
    return {
      student: {
        studentId,
        score: 85,
        timeSpent: 120,
        exercisesCompleted: 15
      },
      classAverage: {
        score: 78,
        timeSpent: 95,
        exercisesCompleted: 12
      },
      gradeAverage: {
        score: 75,
        timeSpent: 88,
        exercisesCompleted: 11
      },
      percentileRanking: 75,
      strengths: ['Animals vocabulary', 'Exercise completion rate'],
      areasForImprovement: ['Speed of completion', 'Consistency']
    }
  }

  private getMockProgressAlerts(
    studentId: string,
    unreadOnly: boolean
  ): ProgressAlert[] {
    const alertTypes: AlertType[] = [
      'STREAK_BROKEN', 'MILESTONE_ACHIEVED', 'REVIEW_DUE', 'GOAL_REMINDER'
    ]
    
    const alerts = [
      {
        id: 'alert-1',
        studentId,
        type: 'MILESTONE_ACHIEVED' as AlertType,
        severity: 'INFO' as const,
        title: 'Milestone Achieved!',
        message: 'You completed your first learning module!',
        createdAt: new Date(Date.now() - 3600000),
        readAt: unreadOnly ? undefined : new Date(Date.now() - 1800000)
      },
      {
        id: 'alert-2',
        studentId,
        type: 'REVIEW_DUE' as AlertType,
        severity: 'WARNING' as const,
        title: 'Vocabulary Review Due',
        message: 'You have 5 words ready for review',
        actionRequired: 'Start vocabulary session',
        createdAt: new Date(Date.now() - 7200000)
      }
    ]

    return unreadOnly ? alerts.filter(a => !a.readAt) : alerts
  }

  private getMockProgressReport(
    studentId: string,
    startDate: Date,
    endDate: Date
  ): ProgressReport {
    return {
      studentId,
      studentName: 'Max Mustermann',
      reportPeriod: { startDate, endDate },
      summary: {
        totalTimeSpent: 180,
        modulesCompleted: 2,
        averageScore: 85,
        accuracyRate: 82
      },
      moduleProgress: [
        {
          moduleId: 'module-animals',
          moduleName: 'Animals',
          status: 'COMPLETED',
          completionPercentage: 100,
          score: 90,
          timeSpent: 45
        },
        {
          moduleId: 'module-colors',
          moduleName: 'Colors',
          status: 'IN_PROGRESS',
          completionPercentage: 60,
          score: 80,
          timeSpent: 30
        }
      ],
      vocabularyProgress: {
        wordsLearned: 25,
        categoriesCompleted: ['ANIMALS'],
        masteryLevels: {
          'NOT_LEARNED': 20,
          'LEARNING': 15,
          'FAMILIAR': 8,
          'MASTERED': 7
        }
      },
      achievements: [
        {
          title: 'First Module Complete',
          achievedAt: new Date(Date.now() - 86400000),
          description: 'Completed your first learning module'
        }
      ],
      recommendations: [
        'Continue with Numbers module to build on vocabulary foundation',
        'Spend more time on listening exercises to improve pronunciation'
      ],
      generatedAt: new Date()
    }
  }

  private getMockPauseProgress(
    studentId: string,
    moduleId: string
  ): StudentProgress {
    return {
      ...this.getMockStudentProgress(studentId, moduleId)[0],
      status: 'PAUSED',
      pausedAt: new Date()
    }
  }

  private getMockResumeProgress(
    studentId: string,
    moduleId: string
  ): StudentProgress {
    return {
      ...this.getMockStudentProgress(studentId, moduleId)[0],
      status: 'IN_PROGRESS',
      resumedAt: new Date()
    }
  }
}