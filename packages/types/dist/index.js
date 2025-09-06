'use strict';

var zod = require('zod');

// src/index.ts
var LoginInput = zod.z.object({
  uuid: zod.z.string().uuid().optional(),
  email: zod.z.string().email().optional(),
  password: zod.z.string().min(8).optional(),
  organizationCode: zod.z.string().optional()
}).refine((data) => {
  return data.uuid || data.email && data.password;
}, {
  message: "Either UUID or email+password is required"
});
var RegisterTeacherInput = zod.z.object({
  email: zod.z.string().email(),
  password: zod.z.string().min(8),
  name: zod.z.string().min(2),
  organizationId: zod.z.string()
});
var RegisterStudentInput = zod.z.object({
  grade: zod.z.number().min(1).max(12),
  organizationId: zod.z.string(),
  classId: zod.z.string()
});
var CreateTaskInput = zod.z.object({
  moduleId: zod.z.string(),
  type: zod.z.enum(["VOCABULARY", "WRITING", "READING", "LISTENING"]),
  title: zod.z.string().min(1),
  instructions: zod.z.string().min(1),
  content: zod.z.record(zod.z.any()),
  correctAnswer: zod.z.string(),
  hints: zod.z.array(zod.z.string()).default([]),
  maxAttempts: zod.z.number().min(1).default(3),
  timeLimit: zod.z.number().nullable(),
  xpReward: zod.z.number().min(0).default(10)
});
var UpdateProgressInput = zod.z.object({
  taskId: zod.z.string(),
  studentId: zod.z.string(),
  score: zod.z.number().min(0).max(100).optional(),
  timeSpent: zod.z.number().min(0),
  completed: zod.z.boolean(),
  data: zod.z.record(zod.z.any()).default({})
});
var CreateClassInput = zod.z.object({
  name: zod.z.string().min(1),
  grade: zod.z.number().min(1).max(12),
  organizationId: zod.z.string(),
  teacherId: zod.z.string(),
  maxStudents: zod.z.number().min(1).max(50).default(30)
});
var LinkChildInput = zod.z.object({
  childCode: zod.z.string(),
  parentName: zod.z.string().min(2),
  parentEmail: zod.z.string().email()
});
var CreateRewardInput = zod.z.object({
  name: zod.z.string().min(1),
  description: zod.z.string().min(1),
  type: zod.z.enum(["VIRTUAL", "PHYSICAL", "PRIVILEGE"]),
  cost: zod.z.number().min(1),
  organizationId: zod.z.string().nullable()
});
var PaginationInput = zod.z.object({
  page: zod.z.coerce.number().min(1).default(1),
  limit: zod.z.coerce.number().min(1).max(100).default(20),
  sortBy: zod.z.string().optional(),
  sortOrder: zod.z.enum(["asc", "desc"]).default("desc")
});
var ProgressFilters = zod.z.object({
  studentId: zod.z.string().optional(),
  moduleId: zod.z.string().optional(),
  status: zod.z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"]).optional(),
  dateFrom: zod.z.coerce.date().optional(),
  dateTo: zod.z.coerce.date().optional()
}).merge(PaginationInput);
var StudentFilters = zod.z.object({
  classId: zod.z.string().optional(),
  grade: zod.z.coerce.number().min(1).max(12).optional(),
  isActive: zod.z.coerce.boolean().optional()
}).merge(PaginationInput);
var SyncRequest = zod.z.object({
  lastSyncAt: zod.z.coerce.date().nullable(),
  operations: zod.z.array(zod.z.object({
    id: zod.z.string(),
    type: zod.z.enum(["CREATE", "UPDATE", "DELETE"]),
    table: zod.z.string(),
    data: zod.z.record(zod.z.any()),
    timestamp: zod.z.date()
  })),
  deviceInfo: zod.z.object({
    platform: zod.z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]),
    version: zod.z.string(),
    deviceId: zod.z.string(),
    appVersion: zod.z.string()
  })
});
var SyncResponse = zod.z.object({
  operations: zod.z.array(zod.z.object({
    id: zod.z.string(),
    type: zod.z.enum(["CREATE", "UPDATE", "DELETE"]),
    table: zod.z.string(),
    data: zod.z.record(zod.z.any()),
    timestamp: zod.z.date()
  })),
  conflicts: zod.z.array(zod.z.object({
    operationId: zod.z.string(),
    conflict: zod.z.enum(["CONCURRENT_EDIT", "DELETED", "PERMISSION"]),
    resolution: zod.z.enum(["SERVER_WINS", "CLIENT_WINS", "MERGE", "MANUAL"]),
    data: zod.z.record(zod.z.any())
  })),
  lastSyncAt: zod.z.date()
});
var SocketEvent = zod.z.object({
  type: zod.z.string(),
  payload: zod.z.record(zod.z.any()),
  timestamp: zod.z.date(),
  userId: zod.z.string().optional()
});
var ProgressUpdateEvent = SocketEvent.extend({
  type: zod.z.literal("PROGRESS_UPDATE"),
  payload: zod.z.object({
    studentId: zod.z.string(),
    taskId: zod.z.string(),
    progress: zod.z.number().min(0).max(100)
  })
});
var AchievementUnlockedEvent = SocketEvent.extend({
  type: zod.z.literal("ACHIEVEMENT_UNLOCKED"),
  payload: zod.z.object({
    studentId: zod.z.string(),
    achievementId: zod.z.string(),
    xpEarned: zod.z.number()
  })
});
var ValidationError = zod.z.object({
  field: zod.z.string(),
  message: zod.z.string(),
  code: zod.z.string()
});
var ErrorResponse = zod.z.object({
  success: zod.z.literal(false),
  error: zod.z.object({
    message: zod.z.string(),
    code: zod.z.string(),
    details: zod.z.array(ValidationError).optional()
  }),
  meta: zod.z.object({
    timestamp: zod.z.date(),
    requestId: zod.z.string()
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
var UserRole = zod.z.enum(["STUDENT", "TEACHER", "PARENT", "ADMIN"]);
var BaseUser = zod.z.object({
  id: zod.z.string(),
  role: UserRole,
  createdAt: zod.z.date(),
  updatedAt: zod.z.date()
});
var Student = BaseUser.extend({
  role: zod.z.literal("STUDENT"),
  uuid: zod.z.string().uuid(),
  grade: zod.z.number().min(1).max(12),
  organizationId: zod.z.string(),
  isActive: zod.z.boolean().default(true),
  lastLoginAt: zod.z.date().nullable(),
  settings: zod.z.object({
    soundEnabled: zod.z.boolean().default(true),
    vibrationEnabled: zod.z.boolean().default(true),
    theme: zod.z.enum(["light", "dark", "auto"]).default("auto"),
    language: zod.z.string().default("de")
  })
});
var Teacher = BaseUser.extend({
  role: zod.z.literal("TEACHER"),
  email: zod.z.string().email(),
  name: zod.z.string(),
  organizationId: zod.z.string(),
  isVerified: zod.z.boolean().default(false),
  classes: zod.z.array(zod.z.string()).default([])
});
var Parent = BaseUser.extend({
  role: zod.z.literal("PARENT"),
  email: zod.z.string().email(),
  name: zod.z.string(),
  children: zod.z.array(zod.z.string()).default([]),
  isVerified: zod.z.boolean().default(false)
});
var Admin = BaseUser.extend({
  role: zod.z.literal("ADMIN"),
  email: zod.z.string().email(),
  name: zod.z.string(),
  permissions: zod.z.array(zod.z.string()).default([])
});
var Organization = zod.z.object({
  id: zod.z.string(),
  name: zod.z.string(),
  type: zod.z.enum(["SCHOOL", "DISTRICT", "PRIVATE"]),
  country: zod.z.string().length(2),
  // ISO country code
  timezone: zod.z.string(),
  settings: zod.z.object({
    allowParentAccess: zod.z.boolean().default(true),
    requireVerification: zod.z.boolean().default(true),
    maxStudentsPerClass: zod.z.number().default(30)
  }),
  createdAt: zod.z.date(),
  updatedAt: zod.z.date()
});
var Difficulty = zod.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
var LearningModule = zod.z.object({
  id: zod.z.string(),
  title: zod.z.string(),
  description: zod.z.string(),
  difficulty: Difficulty,
  grade: zod.z.number().min(1).max(12),
  subject: zod.z.string(),
  estimatedDuration: zod.z.number(),
  // minutes
  prerequisites: zod.z.array(zod.z.string()).default([]),
  isPublished: zod.z.boolean().default(false),
  content: zod.z.array(zod.z.string()).default([]),
  // Task IDs
  createdAt: zod.z.date(),
  updatedAt: zod.z.date()
});
var TaskType = zod.z.enum(["VOCABULARY", "WRITING", "READING", "LISTENING"]);
var Task = zod.z.object({
  id: zod.z.string(),
  moduleId: zod.z.string(),
  type: TaskType,
  title: zod.z.string(),
  instructions: zod.z.string(),
  content: zod.z.record(zod.z.any()),
  // Flexible content structure
  correctAnswer: zod.z.string(),
  hints: zod.z.array(zod.z.string()).default([]),
  maxAttempts: zod.z.number().default(3),
  timeLimit: zod.z.number().nullable(),
  // seconds
  xpReward: zod.z.number().default(10),
  isPublished: zod.z.boolean().default(false),
  createdAt: zod.z.date(),
  updatedAt: zod.z.date()
});
var ProgressStatus = zod.z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"]);
var StudentProgress = zod.z.object({
  id: zod.z.string(),
  studentId: zod.z.string(),
  taskId: zod.z.string(),
  status: ProgressStatus,
  attempts: zod.z.number().default(0),
  score: zod.z.number().min(0).max(100).nullable(),
  timeSpent: zod.z.number().default(0),
  // seconds
  startedAt: zod.z.date(),
  completedAt: zod.z.date().nullable(),
  data: zod.z.record(zod.z.any()).default({})
  // Additional progress data
});
var AchievementType = zod.z.enum(["STREAK", "MILESTONE", "MASTERY", "SPECIAL"]);
var Achievement = zod.z.object({
  id: zod.z.string(),
  name: zod.z.string(),
  description: zod.z.string(),
  type: AchievementType,
  icon: zod.z.string(),
  xpReward: zod.z.number().default(50),
  conditions: zod.z.record(zod.z.any()),
  // Achievement conditions
  isActive: zod.z.boolean().default(true),
  createdAt: zod.z.date()
});
var StudentAchievement = zod.z.object({
  id: zod.z.string(),
  studentId: zod.z.string(),
  achievementId: zod.z.string(),
  unlockedAt: zod.z.date(),
  isNew: zod.z.boolean().default(true)
});
var RewardType = zod.z.enum(["VIRTUAL", "PHYSICAL", "PRIVILEGE"]);
var Reward = zod.z.object({
  id: zod.z.string(),
  name: zod.z.string(),
  description: zod.z.string(),
  type: RewardType,
  cost: zod.z.number(),
  // XP cost
  isAvailable: zod.z.boolean().default(true),
  createdBy: zod.z.string(),
  // Teacher or Parent ID
  organizationId: zod.z.string().nullable(),
  createdAt: zod.z.date()
});
var ApiResponse = (dataSchema) => zod.z.object({
  success: zod.z.boolean(),
  data: dataSchema.optional(),
  error: zod.z.object({
    message: zod.z.string(),
    code: zod.z.string().optional()
  }).optional(),
  meta: zod.z.object({
    timestamp: zod.z.date(),
    requestId: zod.z.string()
  }).optional()
});
var SyncOperation = zod.z.object({
  id: zod.z.string(),
  type: zod.z.enum(["CREATE", "UPDATE", "DELETE"]),
  table: zod.z.string(),
  data: zod.z.record(zod.z.any()),
  timestamp: zod.z.date(),
  deviceId: zod.z.string(),
  userId: zod.z.string(),
  status: zod.z.enum(["PENDING", "SUCCESS", "FAILED"])
});
var Platform = zod.z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]);
var DeviceInfo = zod.z.object({
  platform: Platform,
  version: zod.z.string(),
  deviceId: zod.z.string(),
  appVersion: zod.z.string(),
  lastSyncAt: zod.z.date().nullable()
});

exports.APP_CONFIG = APP_CONFIG;
exports.APP_NAME = APP_NAME;
exports.Achievement = Achievement;
exports.AchievementType = AchievementType;
exports.AchievementUnlockedEvent = AchievementUnlockedEvent;
exports.Admin = Admin;
exports.ApiResponse = ApiResponse;
exports.BaseUser = BaseUser;
exports.CreateClassInput = CreateClassInput;
exports.CreateRewardInput = CreateRewardInput;
exports.CreateTaskInput = CreateTaskInput;
exports.DeviceInfo = DeviceInfo;
exports.Difficulty = Difficulty;
exports.ErrorResponse = ErrorResponse;
exports.LearningModule = LearningModule;
exports.LinkChildInput = LinkChildInput;
exports.LoginInput = LoginInput;
exports.Organization = Organization;
exports.PORTALS = PORTALS;
exports.PaginationInput = PaginationInput;
exports.Parent = Parent;
exports.Platform = Platform;
exports.ProgressFilters = ProgressFilters;
exports.ProgressStatus = ProgressStatus;
exports.ProgressUpdateEvent = ProgressUpdateEvent;
exports.RegisterStudentInput = RegisterStudentInput;
exports.RegisterTeacherInput = RegisterTeacherInput;
exports.Reward = Reward;
exports.RewardType = RewardType;
exports.SocketEvent = SocketEvent;
exports.Student = Student;
exports.StudentAchievement = StudentAchievement;
exports.StudentFilters = StudentFilters;
exports.StudentProgress = StudentProgress;
exports.SyncOperation = SyncOperation;
exports.SyncRequest = SyncRequest;
exports.SyncResponse = SyncResponse;
exports.Task = Task;
exports.TaskType = TaskType;
exports.Teacher = Teacher;
exports.UpdateProgressInput = UpdateProgressInput;
exports.UserRole = UserRole;
exports.ValidationError = ValidationError;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map