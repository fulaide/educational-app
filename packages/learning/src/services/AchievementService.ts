import type { 
  Achievement,
  StudentAchievement,
  AchievementNotification,
  AchievementLeaderboard,
  AchievementAnalytics,
  StudentAchievementStats,
  AchievementSystemConfig,
  AchievementCategory,
  AchievementType,
  AchievementRarity
} from '../types'

export class AchievementService {
  private apiBase: string

  constructor(apiBase = '/api/achievements') {
    this.apiBase = apiBase
  }

  /**
   * Get all available achievements for organization
   */
  async getAchievements(
    organizationId: string,
    category?: string,
    isVisible = true
  ): Promise<Achievement[]> {
    try {
      const params = new URLSearchParams({
        organizationId,
        ...(category && { category }),
        isVisible: isVisible.toString()
      })

      const response = await fetch(`${this.apiBase}?${params}`)
      if (!response.ok) throw new Error('Failed to fetch achievements')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching achievements:', error)
      return this.getMockAchievements(organizationId)
    }
  }

  /**
   * Get student's achievement progress
   */
  async getStudentAchievements(
    studentId: string,
    status?: 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED'
  ): Promise<Array<StudentAchievement & { achievement: Achievement }>> {
    try {
      const params = new URLSearchParams({
        studentId,
        ...(status && { status })
      })

      const response = await fetch(`${this.apiBase}/student?${params}`)
      if (!response.ok) throw new Error('Failed to fetch student achievements')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching student achievements:', error)
      return this.getMockStudentAchievements(studentId, status)
    }
  }

  /**
   * Check and update achievement progress for student
   */
  async checkAchievementProgress(
    studentId: string,
    metrics: Record<string, number | string>,
    context?: {
      moduleId?: string
      exerciseId?: string
      categoryCompleted?: string
      streakDays?: number
    }
  ): Promise<{
    unlockedAchievements: Achievement[]
    progressUpdates: Array<{
      achievementId: string
      oldProgress: number
      newProgress: number
    }>
    notifications: AchievementNotification[]
  }> {
    try {
      const response = await fetch(`${this.apiBase}/check-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          metrics,
          context
        })
      })
      
      if (!response.ok) throw new Error('Failed to check achievement progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error checking achievement progress:', error)
      return this.calculateMockAchievementProgress(studentId, metrics, context)
    }
  }

  /**
   * Get achievement statistics for student
   */
  async getStudentAchievementStats(
    studentId: string
  ): Promise<StudentAchievementStats> {
    try {
      const response = await fetch(`${this.apiBase}/stats/${studentId}`)
      if (!response.ok) throw new Error('Failed to fetch achievement stats')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching achievement stats:', error)
      return this.getMockStudentAchievementStats(studentId)
    }
  }

  /**
   * Get achievement leaderboards
   */
  async getLeaderboard(
    type: 'CLASS' | 'SCHOOL' | 'GLOBAL',
    scope: string,
    metric: 'TOTAL_ACHIEVEMENTS' | 'ACHIEVEMENT_POINTS' | 'RARE_ACHIEVEMENTS' = 'TOTAL_ACHIEVEMENTS',
    timeframe: 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' = 'ALL_TIME'
  ): Promise<AchievementLeaderboard> {
    try {
      const params = new URLSearchParams({
        type,
        scope,
        metric,
        timeframe
      })

      const response = await fetch(`${this.apiBase}/leaderboard?${params}`)
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return this.getMockLeaderboard(type, scope, metric, timeframe)
    }
  }

  /**
   * Get achievement notifications for student
   */
  async getAchievementNotifications(
    studentId: string,
    unreadOnly = false
  ): Promise<AchievementNotification[]> {
    try {
      const params = new URLSearchParams({
        studentId,
        ...(unreadOnly && { unreadOnly: 'true' })
      })

      const response = await fetch(`${this.apiBase}/notifications?${params}`)
      if (!response.ok) throw new Error('Failed to fetch achievement notifications')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching achievement notifications:', error)
      return this.getMockAchievementNotifications(studentId, unreadOnly)
    }
  }

  /**
   * Mark achievement notification as shown
   */
  async markNotificationShown(notificationId: string): Promise<void> {
    try {
      await fetch(`${this.apiBase}/notifications/${notificationId}/shown`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking notification as shown:', error)
    }
  }

  /**
   * Get achievement analytics for teachers/administrators
   */
  async getAchievementAnalytics(
    achievementId: string
  ): Promise<AchievementAnalytics> {
    try {
      const response = await fetch(`${this.apiBase}/analytics/${achievementId}`)
      if (!response.ok) throw new Error('Failed to fetch achievement analytics')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching achievement analytics:', error)
      return this.getMockAchievementAnalytics(achievementId)
    }
  }

  /**
   * Get achievement categories with progress
   */
  async getAchievementCategories(
    organizationId: string,
    studentId?: string
  ): Promise<AchievementCategory[]> {
    try {
      const params = new URLSearchParams({
        organizationId,
        ...(studentId && { studentId })
      })

      const response = await fetch(`${this.apiBase}/categories?${params}`)
      if (!response.ok) throw new Error('Failed to fetch achievement categories')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching achievement categories:', error)
      return this.getMockAchievementCategories(organizationId, studentId)
    }
  }

  /**
   * Create custom achievement (for teachers)
   */
  async createAchievement(
    achievementData: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Achievement> {
    try {
      const response = await fetch(`${this.apiBase}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementData)
      })
      
      if (!response.ok) throw new Error('Failed to create achievement')
      
      return await response.json()
    } catch (error) {
      console.error('Error creating achievement:', error)
      throw error // Re-throw for custom achievements as this should be handled by UI
    }
  }

  /**
   * Get system configuration for achievements
   */
  async getSystemConfig(
    organizationId: string
  ): Promise<AchievementSystemConfig> {
    try {
      const response = await fetch(`${this.apiBase}/config/${organizationId}`)
      if (!response.ok) throw new Error('Failed to fetch system config')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching system config:', error)
      return this.getMockSystemConfig(organizationId)
    }
  }

  // Mock data methods for development/offline use
  private getMockAchievements(organizationId: string): Achievement[] {
    return [
      {
        id: 'achievement-first-steps',
        organizationId,
        name: 'First Steps',
        description: 'Complete your first exercise',
        type: 'MILESTONE',
        rarity: 'COMMON',
        criteria: {
          type: 'SINGLE_METRIC',
          conditions: [
            { metric: 'exercises_completed', operator: 'GREATER_EQUAL', value: 1 }
          ],
          requireAll: true
        },
        pointsValue: 10,
        badgeIcon: '🎯',
        badgeColor: '#4CAF50',
        translations: {
          de: 'Erste Schritte',
          en: 'First Steps'
        },
        isActive: true,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        id: 'achievement-streak-warrior',
        organizationId,
        name: 'Streak Warrior',
        description: 'Maintain a 7-day learning streak',
        type: 'STREAK',
        rarity: 'UNCOMMON',
        criteria: {
          type: 'SINGLE_METRIC',
          conditions: [
            { metric: 'current_streak', operator: 'GREATER_EQUAL', value: 7 }
          ],
          requireAll: true
        },
        pointsValue: 50,
        badgeIcon: '🔥',
        badgeColor: '#FF5722',
        translations: {
          de: 'Streak-Krieger',
          en: 'Streak Warrior'
        },
        isActive: true,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        id: 'achievement-vocab-master',
        organizationId,
        name: 'Vocabulary Master',
        description: 'Learn 50 vocabulary words',
        type: 'MASTERY',
        rarity: 'RARE',
        criteria: {
          type: 'SINGLE_METRIC',
          conditions: [
            { metric: 'vocabulary_words_learned', operator: 'GREATER_EQUAL', value: 50 }
          ],
          requireAll: true
        },
        pointsValue: 100,
        badgeIcon: '📚',
        badgeColor: '#9C27B0',
        translations: {
          de: 'Wortschatz-Meister',
          en: 'Vocabulary Master'
        },
        isActive: true,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        id: 'achievement-speed-demon',
        organizationId,
        name: 'Speed Demon',
        description: 'Complete 5 exercises in under 10 minutes total',
        type: 'SPEED',
        rarity: 'EPIC',
        criteria: {
          type: 'MULTIPLE_METRICS',
          conditions: [
            { metric: 'exercises_completed', operator: 'GREATER_EQUAL', value: 5 },
            { metric: 'total_time_spent', operator: 'LESS_THAN', value: 600 } // 10 minutes in seconds
          ],
          requireAll: true
        },
        pointsValue: 200,
        badgeIcon: '⚡',
        badgeColor: '#FFC107',
        translations: {
          de: 'Geschwindigkeitsteufel',
          en: 'Speed Demon'
        },
        isActive: true,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      }
    ]
  }

  private getMockStudentAchievements(
    studentId: string,
    status?: string
  ): Array<StudentAchievement & { achievement: Achievement }> {
    const achievements = this.getMockAchievements('org-1')
    
    const studentAchievements = [
      {
        id: 'student-achievement-1',
        studentId,
        achievementId: 'achievement-first-steps',
        status: 'UNLOCKED' as const,
        progress: 100,
        unlockedAt: new Date(Date.now() - 86400000),
        notifiedAt: new Date(Date.now() - 86400000),
        achievement: achievements[0]
      },
      {
        id: 'student-achievement-2',
        studentId,
        achievementId: 'achievement-streak-warrior',
        status: 'IN_PROGRESS' as const,
        progress: 71, // 5 out of 7 days
        achievement: achievements[1]
      },
      {
        id: 'student-achievement-3',
        studentId,
        achievementId: 'achievement-vocab-master',
        status: 'IN_PROGRESS' as const,
        progress: 50, // 25 out of 50 words
        achievement: achievements[2]
      },
      {
        id: 'student-achievement-4',
        studentId,
        achievementId: 'achievement-speed-demon',
        status: 'LOCKED' as const,
        progress: 0,
        achievement: achievements[3]
      }
    ]

    return status ? 
      studentAchievements.filter(sa => sa.status === status) : 
      studentAchievements
  }

  private calculateMockAchievementProgress(
    studentId: string,
    metrics: Record<string, number | string>,
    context?: any
  ) {
    const unlocked: Achievement[] = []
    const notifications: AchievementNotification[] = []
    
    // Mock achievement unlock based on metrics
    if (metrics.exercises_completed === 1) {
      const achievement = this.getMockAchievements('org-1')[0]
      unlocked.push(achievement)
      
      notifications.push({
        id: `notification-${Date.now()}`,
        studentId,
        achievementId: achievement.id,
        type: 'UNLOCKED',
        title: 'Achievement Unlocked!',
        message: `You earned "${achievement.name}"!`,
        celebrationLevel: 'MEDIUM',
        showModal: true,
        autoHide: false,
        createdAt: new Date()
      })
    }

    return {
      unlockedAchievements: unlocked,
      progressUpdates: [
        {
          achievementId: 'achievement-streak-warrior',
          oldProgress: 60,
          newProgress: 71
        }
      ],
      notifications
    }
  }

  private getMockStudentAchievementStats(studentId: string): StudentAchievementStats {
    return {
      studentId,
      totalAchievements: 8,
      achievementsByType: {
        MILESTONE: 3,
        STREAK: 1,
        MASTERY: 2,
        SPEED: 1,
        ACCURACY: 1,
        EXPLORATION: 0,
        PERSISTENCE: 0,
        CONSISTENCY: 0,
        IMPROVEMENT: 0,
        COLLABORATION: 0
      },
      achievementsByRarity: {
        COMMON: 4,
        UNCOMMON: 2,
        RARE: 1,
        EPIC: 1,
        LEGENDARY: 0
      },
      totalPoints: 450,
      rank: {
        class: 3,
        school: 12,
        global: 156
      },
      recentAchievements: [
        {
          achievementId: 'achievement-first-steps',
          unlockedAt: new Date(Date.now() - 86400000)
        }
      ],
      streaks: {
        current: 5,
        longest: 12
      },
      completionRate: 67 // 8 out of 12 available achievements
    }
  }

  private getMockLeaderboard(
    type: string,
    scope: string,
    metric: string,
    timeframe: string
  ): AchievementLeaderboard {
    return {
      id: `leaderboard-${type}-${scope}`,
      type: type as any,
      scope,
      metric: metric as any,
      timeframe: timeframe as any,
      entries: [
        {
          studentId: 'student-1',
          studentName: 'Emma Schmidt',
          rank: 1,
          score: 12,
          change: 0,
          avatar: '👧'
        },
        {
          studentId: 'student-2',
          studentName: 'Max Müller',
          rank: 2,
          score: 10,
          change: 1,
          avatar: '👦'
        },
        {
          studentId: 'student-3',
          studentName: 'Lisa Weber',
          rank: 3,
          score: 8,
          change: -1,
          avatar: '👩'
        }
      ],
      updatedAt: new Date()
    }
  }

  private getMockAchievementNotifications(
    studentId: string,
    unreadOnly: boolean
  ): AchievementNotification[] {
    const notifications = [
      {
        id: 'notification-1',
        studentId,
        achievementId: 'achievement-first-steps',
        type: 'UNLOCKED' as const,
        title: 'Achievement Unlocked!',
        message: 'You completed your first exercise! 🎉',
        celebrationLevel: 'LARGE' as const,
        soundEffect: 'achievement-unlock',
        showModal: true,
        autoHide: false,
        createdAt: new Date(Date.now() - 3600000),
        shownAt: unreadOnly ? undefined : new Date(Date.now() - 3000000)
      },
      {
        id: 'notification-2',
        studentId,
        achievementId: 'achievement-streak-warrior',
        type: 'PROGRESS' as const,
        title: 'Keep Going!',
        message: 'You\'re 2 days away from Streak Warrior!',
        celebrationLevel: 'SMALL' as const,
        showModal: false,
        autoHide: true,
        hideAfter: 5,
        createdAt: new Date(Date.now() - 7200000)
      }
    ]

    return unreadOnly ? notifications.filter(n => !n.shownAt) : notifications
  }

  private getMockAchievementAnalytics(achievementId: string): AchievementAnalytics {
    return {
      achievementId,
      totalStudents: 150,
      studentsUnlocked: 45,
      unlockRate: 30,
      averageTimeToUnlock: 5.5, // days
      popularityScore: 8.2,
      difficultyRating: 3.5,
      studentFeedback: [
        { studentId: 'student-1', rating: 5, feedback: 'Great first achievement!' },
        { studentId: 'student-2', rating: 4 },
        { studentId: 'student-3', rating: 5, feedback: 'Very motivating!' }
      ]
    }
  }

  private getMockAchievementCategories(
    organizationId: string,
    studentId?: string
  ): AchievementCategory[] {
    return [
      {
        id: 'category-learning',
        name: {
          de: 'Lernen',
          en: 'Learning'
        },
        description: {
          de: 'Erfolge beim Lernen und Üben',
          en: 'Achievements for learning and practicing'
        },
        icon: '📚',
        color: '#4CAF50',
        achievements: this.getMockAchievements(organizationId).slice(0, 2),
        totalAchievements: 8,
        unlockedAchievements: studentId ? 3 : 0
      },
      {
        id: 'category-mastery',
        name: {
          de: 'Meisterschaft',
          en: 'Mastery'
        },
        description: {
          de: 'Erfolge für das Meistern von Fertigkeiten',
          en: 'Achievements for mastering skills'
        },
        icon: '🏆',
        color: '#FF9800',
        achievements: this.getMockAchievements(organizationId).slice(2, 4),
        totalAchievements: 6,
        unlockedAchievements: studentId ? 2 : 0
      }
    ]
  }

  private getMockSystemConfig(organizationId: string): AchievementSystemConfig {
    return {
      organizationId,
      isEnabled: true,
      pointsMultiplier: 1.0,
      notificationSettings: {
        enableSounds: true,
        enableAnimations: true,
        enablePopups: true,
        enableEmails: false
      },
      leaderboardSettings: {
        enableClassLeaderboards: true,
        enableSchoolLeaderboards: true,
        enableGlobalLeaderboards: false,
        updateFrequency: 'DAILY'
      },
      rewardSettings: {
        enableAutomaticRewards: true,
        maxRewardsPerDay: 3,
        requireParentApproval: false
      }
    }
  }
}