import { z } from 'zod';

// src/index.ts
var LoginInput = z.object({
  uuid: z.string().uuid().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  organizationCode: z.string().optional()
}).refine((data) => {
  return data.uuid || data.email && data.password;
}, {
  message: "Either UUID or email+password is required"
});
var RegisterTeacherInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  organizationId: z.string()
});
var RegisterStudentInput = z.object({
  grade: z.number().min(1).max(12),
  organizationId: z.string(),
  classId: z.string()
});
var CreateTaskInput = z.object({
  moduleId: z.string(),
  type: z.enum(["VOCABULARY", "WRITING", "READING", "LISTENING"]),
  title: z.string().min(1),
  instructions: z.string().min(1),
  content: z.record(z.any()),
  correctAnswer: z.string(),
  hints: z.array(z.string()).default([]),
  maxAttempts: z.number().min(1).default(3),
  timeLimit: z.number().nullable(),
  xpReward: z.number().min(0).default(10)
});
var UpdateProgressInput = z.object({
  taskId: z.string(),
  studentId: z.string(),
  score: z.number().min(0).max(100).optional(),
  timeSpent: z.number().min(0),
  completed: z.boolean(),
  data: z.record(z.any()).default({})
});
var CreateClassInput = z.object({
  name: z.string().min(1),
  grade: z.number().min(1).max(12),
  organizationId: z.string(),
  teacherId: z.string(),
  maxStudents: z.number().min(1).max(50).default(30)
});
var LinkChildInput = z.object({
  childCode: z.string(),
  parentName: z.string().min(2),
  parentEmail: z.string().email()
});
var CreateRewardInput = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["VIRTUAL", "PHYSICAL", "PRIVILEGE"]),
  cost: z.number().min(1),
  organizationId: z.string().nullable()
});
var PaginationInput = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});
var ProgressFilters = z.object({
  studentId: z.string().optional(),
  moduleId: z.string().optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"]).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional()
}).merge(PaginationInput);
var StudentFilters = z.object({
  classId: z.string().optional(),
  grade: z.coerce.number().min(1).max(12).optional(),
  isActive: z.coerce.boolean().optional()
}).merge(PaginationInput);
var SyncRequest = z.object({
  lastSyncAt: z.coerce.date().nullable(),
  operations: z.array(z.object({
    id: z.string(),
    type: z.enum(["CREATE", "UPDATE", "DELETE"]),
    table: z.string(),
    data: z.record(z.any()),
    timestamp: z.date()
  })),
  deviceInfo: z.object({
    platform: z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]),
    version: z.string(),
    deviceId: z.string(),
    appVersion: z.string()
  })
});
var SyncResponse = z.object({
  operations: z.array(z.object({
    id: z.string(),
    type: z.enum(["CREATE", "UPDATE", "DELETE"]),
    table: z.string(),
    data: z.record(z.any()),
    timestamp: z.date()
  })),
  conflicts: z.array(z.object({
    operationId: z.string(),
    conflict: z.enum(["CONCURRENT_EDIT", "DELETED", "PERMISSION"]),
    resolution: z.enum(["SERVER_WINS", "CLIENT_WINS", "MERGE", "MANUAL"]),
    data: z.record(z.any())
  })),
  lastSyncAt: z.date()
});
var SocketEvent = z.object({
  type: z.string(),
  payload: z.record(z.any()),
  timestamp: z.date(),
  userId: z.string().optional()
});
var ProgressUpdateEvent = SocketEvent.extend({
  type: z.literal("PROGRESS_UPDATE"),
  payload: z.object({
    studentId: z.string(),
    taskId: z.string(),
    progress: z.number().min(0).max(100)
  })
});
var AchievementUnlockedEvent = SocketEvent.extend({
  type: z.literal("ACHIEVEMENT_UNLOCKED"),
  payload: z.object({
    studentId: z.string(),
    achievementId: z.string(),
    xpEarned: z.number()
  })
});
var ValidationError = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string()
});
var ErrorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string(),
    details: z.array(ValidationError).optional()
  }),
  meta: z.object({
    timestamp: z.date(),
    requestId: z.string()
  })
});

// src/constants.ts
var APP_CONFIG = {
  name: "Lexi",
  version: "1.0.0",
  description: "Educational Learning Platform"
};
var PORTALS = {
  student: {
    name: "Lexi Student",
    description: "Interactive learning for students"
  },
  teacher: {
    name: "Lexi Teacher Portal",
    description: "Manage classes and track student progress"
  },
  parent: {
    name: "Lexi Parent Portal",
    description: "Track your child's learning progress"
  },
  admin: {
    name: "Lexi Admin Dashboard",
    description: "System administration and analytics"
  }
};
var APP_NAME = APP_CONFIG.name;

// src/index.ts
var UserRole = z.enum(["STUDENT", "TEACHER", "PARENT", "ADMIN"]);
var BaseUser = z.object({
  id: z.string(),
  role: UserRole,
  createdAt: z.date(),
  updatedAt: z.date()
});
var Student = BaseUser.extend({
  role: z.literal("STUDENT"),
  uuid: z.string().uuid(),
  grade: z.number().min(1).max(12),
  organizationId: z.string(),
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().nullable(),
  settings: z.object({
    soundEnabled: z.boolean().default(true),
    vibrationEnabled: z.boolean().default(true),
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
    language: z.string().default("de")
  })
});
var Teacher = BaseUser.extend({
  role: z.literal("TEACHER"),
  email: z.string().email(),
  name: z.string(),
  organizationId: z.string(),
  isVerified: z.boolean().default(false),
  classes: z.array(z.string()).default([])
});
var Parent = BaseUser.extend({
  role: z.literal("PARENT"),
  email: z.string().email(),
  name: z.string(),
  children: z.array(z.string()).default([]),
  isVerified: z.boolean().default(false)
});
var Admin = BaseUser.extend({
  role: z.literal("ADMIN"),
  email: z.string().email(),
  name: z.string(),
  permissions: z.array(z.string()).default([])
});
var Organization = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["SCHOOL", "DISTRICT", "PRIVATE"]),
  country: z.string().length(2),
  // ISO country code
  timezone: z.string(),
  settings: z.object({
    allowParentAccess: z.boolean().default(true),
    requireVerification: z.boolean().default(true),
    maxStudentsPerClass: z.number().default(30)
  }),
  createdAt: z.date(),
  updatedAt: z.date()
});
var Difficulty = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
var LearningModule = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: Difficulty,
  grade: z.number().min(1).max(12),
  subject: z.string(),
  estimatedDuration: z.number(),
  // minutes
  prerequisites: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  content: z.array(z.string()).default([]),
  // Task IDs
  createdAt: z.date(),
  updatedAt: z.date()
});
var TaskType = z.enum(["VOCABULARY", "WRITING", "READING", "LISTENING"]);
var Task = z.object({
  id: z.string(),
  moduleId: z.string(),
  type: TaskType,
  title: z.string(),
  instructions: z.string(),
  content: z.record(z.any()),
  // Flexible content structure
  correctAnswer: z.string(),
  hints: z.array(z.string()).default([]),
  maxAttempts: z.number().default(3),
  timeLimit: z.number().nullable(),
  // seconds
  xpReward: z.number().default(10),
  isPublished: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});
var ProgressStatus = z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"]);
var StudentProgress = z.object({
  id: z.string(),
  studentId: z.string(),
  taskId: z.string(),
  status: ProgressStatus,
  attempts: z.number().default(0),
  score: z.number().min(0).max(100).nullable(),
  timeSpent: z.number().default(0),
  // seconds
  startedAt: z.date(),
  completedAt: z.date().nullable(),
  data: z.record(z.any()).default({})
  // Additional progress data
});
var AchievementType = z.enum(["STREAK", "MILESTONE", "MASTERY", "SPECIAL"]);
var Achievement = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: AchievementType,
  icon: z.string(),
  xpReward: z.number().default(50),
  conditions: z.record(z.any()),
  // Achievement conditions
  isActive: z.boolean().default(true),
  createdAt: z.date()
});
var StudentAchievement = z.object({
  id: z.string(),
  studentId: z.string(),
  achievementId: z.string(),
  unlockedAt: z.date(),
  isNew: z.boolean().default(true)
});
var RewardType = z.enum(["VIRTUAL", "PHYSICAL", "PRIVILEGE"]);
var Reward = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: RewardType,
  cost: z.number(),
  // XP cost
  isAvailable: z.boolean().default(true),
  createdBy: z.string(),
  // Teacher or Parent ID
  organizationId: z.string().nullable(),
  createdAt: z.date()
});
var ApiResponse = (dataSchema) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.object({
    message: z.string(),
    code: z.string().optional()
  }).optional(),
  meta: z.object({
    timestamp: z.date(),
    requestId: z.string()
  }).optional()
});
var SyncOperation = z.object({
  id: z.string(),
  type: z.enum(["CREATE", "UPDATE", "DELETE"]),
  table: z.string(),
  data: z.record(z.any()),
  timestamp: z.date(),
  deviceId: z.string(),
  userId: z.string(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED"])
});
var Platform = z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]);
var DeviceInfo = z.object({
  platform: Platform,
  version: z.string(),
  deviceId: z.string(),
  appVersion: z.string(),
  lastSyncAt: z.date().nullable()
});

export { APP_CONFIG, APP_NAME, Achievement, AchievementType, AchievementUnlockedEvent, Admin, ApiResponse, BaseUser, CreateClassInput, CreateRewardInput, CreateTaskInput, DeviceInfo, Difficulty, ErrorResponse, LearningModule, LinkChildInput, LoginInput, Organization, PORTALS, PaginationInput, Parent, Platform, ProgressFilters, ProgressStatus, ProgressUpdateEvent, RegisterStudentInput, RegisterTeacherInput, Reward, RewardType, SocketEvent, Student, StudentAchievement, StudentFilters, StudentProgress, SyncOperation, SyncRequest, SyncResponse, Task, TaskType, Teacher, UpdateProgressInput, UserRole, ValidationError };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map