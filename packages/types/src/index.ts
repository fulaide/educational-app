import { z } from 'zod';

// User Roles
export const UserRole = z.enum(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN']);
export type UserRole = z.infer<typeof UserRole>;

// Base User Schema
export const BaseUser = z.object({
  id: z.string(),
  role: UserRole,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Student Schema (COPPA compliant - no PII)
export const Student = BaseUser.extend({
  role: z.literal('STUDENT'),
  uuid: z.string().uuid(),
  grade: z.number().min(1).max(12),
  organizationId: z.string(),
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().nullable(),
  settings: z.object({
    soundEnabled: z.boolean().default(true),
    vibrationEnabled: z.boolean().default(true),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    language: z.string().default('de'),
  }),
});

export const Teacher = BaseUser.extend({
  role: z.literal('TEACHER'),
  email: z.string().email(),
  name: z.string(),
  organizationId: z.string(),
  isVerified: z.boolean().default(false),
  classes: z.array(z.string()).default([]),
});

export const Parent = BaseUser.extend({
  role: z.literal('PARENT'),
  email: z.string().email(),
  name: z.string(),
  children: z.array(z.string()).default([]),
  isVerified: z.boolean().default(false),
});

export const Admin = BaseUser.extend({
  role: z.literal('ADMIN'),
  email: z.string().email(),
  name: z.string(),
  permissions: z.array(z.string()).default([]),
});

// Organization Schema
export const Organization = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['SCHOOL', 'DISTRICT', 'PRIVATE']),
  country: z.string().length(2), // ISO country code
  timezone: z.string(),
  settings: z.object({
    allowParentAccess: z.boolean().default(true),
    requireVerification: z.boolean().default(true),
    maxStudentsPerClass: z.number().default(30),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Learning Content Schemas
export const Difficulty = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);
export type Difficulty = z.infer<typeof Difficulty>;

export const LearningModule = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: Difficulty,
  grade: z.number().min(1).max(12),
  subject: z.string(),
  estimatedDuration: z.number(), // minutes
  prerequisites: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  content: z.array(z.string()).default([]), // Task IDs
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TaskType = z.enum(['VOCABULARY', 'WRITING', 'READING', 'LISTENING']);
export type TaskType = z.infer<typeof TaskType>;

export const Task = z.object({
  id: z.string(),
  moduleId: z.string(),
  type: TaskType,
  title: z.string(),
  instructions: z.string(),
  content: z.record(z.any()), // Flexible content structure
  correctAnswer: z.string(),
  hints: z.array(z.string()).default([]),
  maxAttempts: z.number().default(3),
  timeLimit: z.number().nullable(), // seconds
  xpReward: z.number().default(10),
  isPublished: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Progress Tracking
export const ProgressStatus = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED']);
export type ProgressStatus = z.infer<typeof ProgressStatus>;

export const StudentProgress = z.object({
  id: z.string(),
  studentId: z.string(),
  taskId: z.string(),
  status: ProgressStatus,
  attempts: z.number().default(0),
  score: z.number().min(0).max(100).nullable(),
  timeSpent: z.number().default(0), // seconds
  startedAt: z.date(),
  completedAt: z.date().nullable(),
  data: z.record(z.any()).default({}), // Additional progress data
});

// Gamification
export const AchievementType = z.enum(['STREAK', 'MILESTONE', 'MASTERY', 'SPECIAL']);
export type AchievementType = z.infer<typeof AchievementType>;

export const Achievement = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: AchievementType,
  icon: z.string(),
  xpReward: z.number().default(50),
  conditions: z.record(z.any()), // Achievement conditions
  isActive: z.boolean().default(true),
  createdAt: z.date(),
});

export const StudentAchievement = z.object({
  id: z.string(),
  studentId: z.string(),
  achievementId: z.string(),
  unlockedAt: z.date(),
  isNew: z.boolean().default(true),
});

// Rewards System
export const RewardType = z.enum(['VIRTUAL', 'PHYSICAL', 'PRIVILEGE']);
export type RewardType = z.infer<typeof RewardType>;

export const Reward = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: RewardType,
  cost: z.number(), // XP cost
  isAvailable: z.boolean().default(true),
  createdBy: z.string(), // Teacher or Parent ID
  organizationId: z.string().nullable(),
  createdAt: z.date(),
});

// API Response Types
export const ApiResponse = <T>(dataSchema: z.ZodType<T>) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
  }).optional(),
  meta: z.object({
    timestamp: z.date(),
    requestId: z.string(),
  }).optional(),
});

// Sync Engine Types
export const SyncOperation = z.object({
  id: z.string(),
  type: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  table: z.string(),
  data: z.record(z.any()),
  timestamp: z.date(),
  deviceId: z.string(),
  userId: z.string(),
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']),
});

export type SyncOperation = z.infer<typeof SyncOperation>;

// Platform Types
export const Platform = z.enum(['WEB', 'IOS', 'ANDROID', 'DESKTOP']);
export type Platform = z.infer<typeof Platform>;

export const DeviceInfo = z.object({
  platform: Platform,
  version: z.string(),
  deviceId: z.string(),
  appVersion: z.string(),
  lastSyncAt: z.date().nullable(),
});

// Export all schemas for runtime validation
export * from './schemas';

// Type exports
export type Student = z.infer<typeof Student>;
export type Teacher = z.infer<typeof Teacher>;
export type Parent = z.infer<typeof Parent>;
export type Admin = z.infer<typeof Admin>;
export type Organization = z.infer<typeof Organization>;
export type LearningModule = z.infer<typeof LearningModule>;
export type Task = z.infer<typeof Task>;
export type StudentProgress = z.infer<typeof StudentProgress>;
export type Achievement = z.infer<typeof Achievement>;
export type StudentAchievement = z.infer<typeof StudentAchievement>;
export type Reward = z.infer<typeof Reward>;
export type DeviceInfo = z.infer<typeof DeviceInfo>;