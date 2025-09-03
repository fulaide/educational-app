// TODO: Replace with @educational-app/i18n when available
import type { LocalizedContent } from './Module'

/**
 * Achievement types in the gamification system
 */
export type AchievementType = 
  | 'MILESTONE'      // Reach specific milestones
  | 'STREAK'         // Consecutive day achievements
  | 'MASTERY'        // Master categories or skills
  | 'SPEED'          // Complete tasks quickly
  | 'ACCURACY'       // High accuracy achievements
  | 'EXPLORATION'    // Try different modules/exercises
  | 'PERSISTENCE'    // Keep trying despite failures
  | 'CONSISTENCY'    // Regular learning habits
  | 'IMPROVEMENT'    // Show significant improvement
  | 'COLLABORATION'  // Help others or team achievements

/**
 * Achievement difficulty/rarity
 */
export type AchievementRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'

/**
 * Core achievement definition
 */
export interface Achievement {
  id: string
  organizationId: string
  name: string
  description: string
  type: AchievementType
  rarity: AchievementRarity
  criteria: AchievementCriteria
  pointsValue: number
  badgeIcon: string // icon name or emoji
  badgeColor: string // hex color
  translations: LocalizedContent
  isActive: boolean
  isVisible: boolean // hidden achievements
  prerequisiteAchievements?: string[] // achievement IDs
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

/**
 * Achievement criteria - conditions to unlock
 */
export interface AchievementCriteria {
  type: CriteriaType
  conditions: Array<{
    metric: string
    operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_EQUAL' | 'LESS_EQUAL'
    value: number | string
    timeframe?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'
  }>
  requireAll: boolean // AND vs OR logic
}

export type CriteriaType = 
  | 'SINGLE_METRIC'        // Based on one metric
  | 'MULTIPLE_METRICS'     // Multiple conditions
  | 'SEQUENCE'             // Ordered sequence of events  
  | 'CUMULATIVE'          // Accumulate over time
  | 'COMPARATIVE'         // Compare to others

/**
 * Student achievement progress
 */
export interface StudentAchievement {
  id: string
  studentId: string
  achievementId: string
  status: 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED'
  progress: number // 0-100 percentage
  unlockedAt?: Date
  notifiedAt?: Date // when student was notified
  metadata?: Record<string, any> // achievement-specific data
}

/**
 * Achievement reward system
 */
export interface AchievementReward {
  id: string
  achievementId: string
  rewardType: RewardType
  value: number | string
  name: string
  description: string
  imageUrl?: string
  isAutomatic: boolean // automatically granted
  expiresAfter?: number // days until expiration
}

export type RewardType = 
  | 'POINTS'           // Extra points
  | 'BADGE'            // Digital badge
  | 'AVATAR_ITEM'      // Avatar customization
  | 'THEME'            // App theme unlock
  | 'PRIVILEGE'        // Special privileges
  | 'CERTIFICATE'      // Printable certificate
  | 'STICKER'          // Digital sticker collection
  | 'TROPHY'           // 3D trophy model

/**
 * Achievement category grouping
 */
export interface AchievementCategory {
  id: string
  name: LocalizedContent
  description: LocalizedContent
  icon: string
  color: string
  achievements: Achievement[]
  totalAchievements: number
  unlockedAchievements: number // for specific student
}

/**
 * Achievement notification
 */
export interface AchievementNotification {
  id: string
  studentId: string
  achievementId: string
  type: 'UNLOCKED' | 'PROGRESS' | 'NEAR_COMPLETION'
  title: string
  message: string
  celebrationLevel: 'SMALL' | 'MEDIUM' | 'LARGE' // animation intensity
  soundEffect?: string
  showModal: boolean
  autoHide: boolean
  hideAfter?: number // seconds
  createdAt: Date
  shownAt?: Date
  dismissedAt?: Date
}

/**
 * Achievement leaderboard
 */
export interface AchievementLeaderboard {
  id: string
  type: 'CLASS' | 'SCHOOL' | 'GLOBAL'
  scope: string // class ID, organization ID, or 'global'
  metric: 'TOTAL_ACHIEVEMENTS' | 'ACHIEVEMENT_POINTS' | 'RARE_ACHIEVEMENTS'
  timeframe: 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'
  entries: Array<{
    studentId: string
    studentName: string
    rank: number
    score: number
    change: number // rank change since last period
    avatar?: string
  }>
  updatedAt: Date
}

/**
 * Achievement analytics
 */
export interface AchievementAnalytics {
  achievementId: string
  totalStudents: number
  studentsUnlocked: number
  unlockRate: number // percentage
  averageTimeToUnlock: number // days
  popularityScore: number // 1-10 based on student engagement
  difficultyRating: number // 1-10 based on unlock rate
  studentFeedback: Array<{
    studentId: string
    rating: number // 1-5 stars
    feedback?: string
  }>
}

/**
 * Achievement system configuration
 */
export interface AchievementSystemConfig {
  organizationId: string
  isEnabled: boolean
  pointsMultiplier: number // global points multiplier
  notificationSettings: {
    enableSounds: boolean
    enableAnimations: boolean
    enablePopups: boolean
    enableEmails: boolean
  }
  leaderboardSettings: {
    enableClassLeaderboards: boolean
    enableSchoolLeaderboards: boolean
    enableGlobalLeaderboards: boolean
    updateFrequency: 'HOURLY' | 'DAILY' | 'WEEKLY'
  }
  rewardSettings: {
    enableAutomaticRewards: boolean
    maxRewardsPerDay: number
    requireParentApproval: boolean
  }
}

/**
 * Achievement statistics for students
 */
export interface StudentAchievementStats {
  studentId: string
  totalAchievements: number
  achievementsByType: Record<AchievementType, number>
  achievementsByRarity: Record<AchievementRarity, number>
  totalPoints: number
  rank: {
    class: number
    school: number
    global?: number
  }
  recentAchievements: Array<{
    achievementId: string
    unlockedAt: Date
  }>
  streaks: {
    current: number
    longest: number
  }
  completionRate: number // percentage of available achievements
}