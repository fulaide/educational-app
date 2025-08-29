import { z } from 'zod';

// Input validation schemas for API endpoints
export const LoginInput = z.object({
  uuid: z.string().uuid().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  organizationCode: z.string().optional(),
}).refine((data) => {
  // Either UUID (student) or email+password (teacher/parent/admin)
  return (data.uuid) || (data.email && data.password);
}, {
  message: "Either UUID or email+password is required"
});

export const RegisterTeacherInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  organizationId: z.string(),
});

export const RegisterStudentInput = z.object({
  grade: z.number().min(1).max(12),
  organizationId: z.string(),
  classId: z.string(),
});

export const CreateTaskInput = z.object({
  moduleId: z.string(),
  type: z.enum(['VOCABULARY', 'WRITING', 'READING', 'LISTENING']),
  title: z.string().min(1),
  instructions: z.string().min(1),
  content: z.record(z.any()),
  correctAnswer: z.string(),
  hints: z.array(z.string()).default([]),
  maxAttempts: z.number().min(1).default(3),
  timeLimit: z.number().nullable(),
  xpReward: z.number().min(0).default(10),
});

export const UpdateProgressInput = z.object({
  taskId: z.string(),
  studentId: z.string(),
  score: z.number().min(0).max(100).optional(),
  timeSpent: z.number().min(0),
  completed: z.boolean(),
  data: z.record(z.any()).default({}),
});

export const CreateClassInput = z.object({
  name: z.string().min(1),
  grade: z.number().min(1).max(12),
  organizationId: z.string(),
  teacherId: z.string(),
  maxStudents: z.number().min(1).max(50).default(30),
});

export const LinkChildInput = z.object({
  childCode: z.string(),
  parentName: z.string().min(2),
  parentEmail: z.string().email(),
});

export const CreateRewardInput = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['VIRTUAL', 'PHYSICAL', 'PRIVILEGE']),
  cost: z.number().min(1),
  organizationId: z.string().nullable(),
});

// Query parameter schemas
export const PaginationInput = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const ProgressFilters = z.object({
  studentId: z.string().optional(),
  moduleId: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
}).merge(PaginationInput);

export const StudentFilters = z.object({
  classId: z.string().optional(),
  grade: z.coerce.number().min(1).max(12).optional(),
  isActive: z.coerce.boolean().optional(),
}).merge(PaginationInput);

// Sync schemas
export const SyncRequest = z.object({
  lastSyncAt: z.coerce.date().nullable(),
  operations: z.array(z.object({
    id: z.string(),
    type: z.enum(['CREATE', 'UPDATE', 'DELETE']),
    table: z.string(),
    data: z.record(z.any()),
    timestamp: z.date(),
  })),
  deviceInfo: z.object({
    platform: z.enum(['WEB', 'IOS', 'ANDROID', 'DESKTOP']),
    version: z.string(),
    deviceId: z.string(),
    appVersion: z.string(),
  }),
});

export const SyncResponse = z.object({
  operations: z.array(z.object({
    id: z.string(),
    type: z.enum(['CREATE', 'UPDATE', 'DELETE']),
    table: z.string(),
    data: z.record(z.any()),
    timestamp: z.date(),
  })),
  conflicts: z.array(z.object({
    operationId: z.string(),
    conflict: z.enum(['CONCURRENT_EDIT', 'DELETED', 'PERMISSION']),
    resolution: z.enum(['SERVER_WINS', 'CLIENT_WINS', 'MERGE', 'MANUAL']),
    data: z.record(z.any()),
  })),
  lastSyncAt: z.date(),
});

// WebSocket event schemas
export const SocketEvent = z.object({
  type: z.string(),
  payload: z.record(z.any()),
  timestamp: z.date(),
  userId: z.string().optional(),
});

export const ProgressUpdateEvent = SocketEvent.extend({
  type: z.literal('PROGRESS_UPDATE'),
  payload: z.object({
    studentId: z.string(),
    taskId: z.string(),
    progress: z.number().min(0).max(100),
  }),
});

export const AchievementUnlockedEvent = SocketEvent.extend({
  type: z.literal('ACHIEVEMENT_UNLOCKED'),
  payload: z.object({
    studentId: z.string(),
    achievementId: z.string(),
    xpEarned: z.number(),
  }),
});

// Error schemas
export const ValidationError = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

export const ErrorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string(),
    details: z.array(ValidationError).optional(),
  }),
  meta: z.object({
    timestamp: z.date(),
    requestId: z.string(),
  }),
});

// Export input validation types
export type LoginInput = z.infer<typeof LoginInput>;
export type RegisterTeacherInput = z.infer<typeof RegisterTeacherInput>;
export type RegisterStudentInput = z.infer<typeof RegisterStudentInput>;
export type CreateTaskInput = z.infer<typeof CreateTaskInput>;
export type UpdateProgressInput = z.infer<typeof UpdateProgressInput>;
export type CreateClassInput = z.infer<typeof CreateClassInput>;
export type LinkChildInput = z.infer<typeof LinkChildInput>;
export type CreateRewardInput = z.infer<typeof CreateRewardInput>;
export type PaginationInput = z.infer<typeof PaginationInput>;
export type ProgressFilters = z.infer<typeof ProgressFilters>;
export type StudentFilters = z.infer<typeof StudentFilters>;
export type SyncRequest = z.infer<typeof SyncRequest>;
export type SyncResponse = z.infer<typeof SyncResponse>;
export type SocketEvent = z.infer<typeof SocketEvent>;
export type ProgressUpdateEvent = z.infer<typeof ProgressUpdateEvent>;
export type AchievementUnlockedEvent = z.infer<typeof AchievementUnlockedEvent>;
export type ValidationError = z.infer<typeof ValidationError>;
export type ErrorResponse = z.infer<typeof ErrorResponse>;