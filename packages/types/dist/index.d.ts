import { z } from 'zod';

declare const LoginInput: z.ZodEffects<z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    organizationCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    uuid?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    organizationCode?: string | undefined;
}, {
    uuid?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    organizationCode?: string | undefined;
}>, {
    uuid?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    organizationCode?: string | undefined;
}, {
    uuid?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    organizationCode?: string | undefined;
}>;
type LoginInput = z.infer<typeof LoginInput>;
declare const RegisterTeacherInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    organizationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    organizationId: string;
    email: string;
    name: string;
    password: string;
}, {
    organizationId: string;
    email: string;
    name: string;
    password: string;
}>;
type RegisterTeacherInput = z.infer<typeof RegisterTeacherInput>;
declare const RegisterStudentInput: z.ZodObject<{
    grade: z.ZodNumber;
    organizationId: z.ZodString;
    classId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    grade: number;
    organizationId: string;
    classId: string;
}, {
    grade: number;
    organizationId: string;
    classId: string;
}>;
type RegisterStudentInput = z.infer<typeof RegisterStudentInput>;
declare const CreateTaskInput: z.ZodObject<{
    moduleId: z.ZodString;
    type: z.ZodEnum<["VOCABULARY", "WRITING", "READING", "LISTENING"]>;
    title: z.ZodString;
    instructions: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    correctAnswer: z.ZodString;
    hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    timeLimit: z.ZodNullable<z.ZodNumber>;
    xpReward: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "VOCABULARY" | "WRITING" | "READING" | "LISTENING";
    title: string;
    content: Record<string, any>;
    moduleId: string;
    instructions: string;
    correctAnswer: string;
    hints: string[];
    maxAttempts: number;
    timeLimit: number | null;
    xpReward: number;
}, {
    type: "VOCABULARY" | "WRITING" | "READING" | "LISTENING";
    title: string;
    content: Record<string, any>;
    moduleId: string;
    instructions: string;
    correctAnswer: string;
    timeLimit: number | null;
    hints?: string[] | undefined;
    maxAttempts?: number | undefined;
    xpReward?: number | undefined;
}>;
type CreateTaskInput = z.infer<typeof CreateTaskInput>;
declare const UpdateProgressInput: z.ZodObject<{
    taskId: z.ZodString;
    studentId: z.ZodString;
    score: z.ZodOptional<z.ZodNumber>;
    timeSpent: z.ZodNumber;
    completed: z.ZodBoolean;
    data: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    studentId: string;
    taskId: string;
    timeSpent: number;
    data: Record<string, any>;
    completed: boolean;
    score?: number | undefined;
}, {
    studentId: string;
    taskId: string;
    timeSpent: number;
    completed: boolean;
    score?: number | undefined;
    data?: Record<string, any> | undefined;
}>;
type UpdateProgressInput = z.infer<typeof UpdateProgressInput>;
declare const CreateClassInput: z.ZodObject<{
    name: z.ZodString;
    grade: z.ZodNumber;
    organizationId: z.ZodString;
    teacherId: z.ZodString;
    maxStudents: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    grade: number;
    organizationId: string;
    name: string;
    teacherId: string;
    maxStudents: number;
}, {
    grade: number;
    organizationId: string;
    name: string;
    teacherId: string;
    maxStudents?: number | undefined;
}>;
type CreateClassInput = z.infer<typeof CreateClassInput>;
declare const LinkChildInput: z.ZodObject<{
    childCode: z.ZodString;
    parentName: z.ZodString;
    parentEmail: z.ZodString;
}, "strip", z.ZodTypeAny, {
    childCode: string;
    parentName: string;
    parentEmail: string;
}, {
    childCode: string;
    parentName: string;
    parentEmail: string;
}>;
type LinkChildInput = z.infer<typeof LinkChildInput>;
declare const CreateRewardInput: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["VIRTUAL", "PHYSICAL", "PRIVILEGE"]>;
    cost: z.ZodNumber;
    organizationId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "VIRTUAL" | "PHYSICAL" | "PRIVILEGE";
    organizationId: string | null;
    name: string;
    description: string;
    cost: number;
}, {
    type: "VIRTUAL" | "PHYSICAL" | "PRIVILEGE";
    organizationId: string | null;
    name: string;
    description: string;
    cost: number;
}>;
type CreateRewardInput = z.infer<typeof CreateRewardInput>;
declare const PaginationInput: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
type PaginationInput = z.infer<typeof PaginationInput>;
declare const ProgressFilters: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"]>>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | undefined;
    moduleId?: string | undefined;
    studentId?: string | undefined;
    sortBy?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | undefined;
    moduleId?: string | undefined;
    studentId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}>;
type ProgressFilters = z.infer<typeof ProgressFilters>;
declare const StudentFilters: z.ZodObject<{
    classId: z.ZodOptional<z.ZodString>;
    grade: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
} & {
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    grade?: number | undefined;
    isActive?: boolean | undefined;
    classId?: string | undefined;
    sortBy?: string | undefined;
}, {
    grade?: number | undefined;
    isActive?: boolean | undefined;
    classId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
type StudentFilters = z.infer<typeof StudentFilters>;
declare const SyncRequest: z.ZodObject<{
    lastSyncAt: z.ZodNullable<z.ZodDate>;
    operations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["CREATE", "UPDATE", "DELETE"]>;
        table: z.ZodString;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }, {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }>, "many">;
    deviceInfo: z.ZodObject<{
        platform: z.ZodEnum<["WEB", "IOS", "ANDROID", "DESKTOP"]>;
        version: z.ZodString;
        deviceId: z.ZodString;
        appVersion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        deviceId: string;
        platform: "WEB" | "IOS" | "ANDROID" | "DESKTOP";
        version: string;
        appVersion: string;
    }, {
        deviceId: string;
        platform: "WEB" | "IOS" | "ANDROID" | "DESKTOP";
        version: string;
        appVersion: string;
    }>;
}, "strip", z.ZodTypeAny, {
    lastSyncAt: Date | null;
    operations: {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }[];
    deviceInfo: {
        deviceId: string;
        platform: "WEB" | "IOS" | "ANDROID" | "DESKTOP";
        version: string;
        appVersion: string;
    };
}, {
    lastSyncAt: Date | null;
    operations: {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }[];
    deviceInfo: {
        deviceId: string;
        platform: "WEB" | "IOS" | "ANDROID" | "DESKTOP";
        version: string;
        appVersion: string;
    };
}>;
type SyncRequest = z.infer<typeof SyncRequest>;
declare const SyncResponse: z.ZodObject<{
    operations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["CREATE", "UPDATE", "DELETE"]>;
        table: z.ZodString;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }, {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }>, "many">;
    conflicts: z.ZodArray<z.ZodObject<{
        operationId: z.ZodString;
        conflict: z.ZodEnum<["CONCURRENT_EDIT", "DELETED", "PERMISSION"]>;
        resolution: z.ZodEnum<["SERVER_WINS", "CLIENT_WINS", "MERGE", "MANUAL"]>;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        data: Record<string, any>;
        operationId: string;
        conflict: "CONCURRENT_EDIT" | "DELETED" | "PERMISSION";
        resolution: "SERVER_WINS" | "CLIENT_WINS" | "MERGE" | "MANUAL";
    }, {
        data: Record<string, any>;
        operationId: string;
        conflict: "CONCURRENT_EDIT" | "DELETED" | "PERMISSION";
        resolution: "SERVER_WINS" | "CLIENT_WINS" | "MERGE" | "MANUAL";
    }>, "many">;
    lastSyncAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    lastSyncAt: Date;
    operations: {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }[];
    conflicts: {
        data: Record<string, any>;
        operationId: string;
        conflict: "CONCURRENT_EDIT" | "DELETED" | "PERMISSION";
        resolution: "SERVER_WINS" | "CLIENT_WINS" | "MERGE" | "MANUAL";
    }[];
}, {
    lastSyncAt: Date;
    operations: {
        type: "CREATE" | "UPDATE" | "DELETE";
        id: string;
        data: Record<string, any>;
        table: string;
        timestamp: Date;
    }[];
    conflicts: {
        data: Record<string, any>;
        operationId: string;
        conflict: "CONCURRENT_EDIT" | "DELETED" | "PERMISSION";
        resolution: "SERVER_WINS" | "CLIENT_WINS" | "MERGE" | "MANUAL";
    }[];
}>;
type SyncResponse = z.infer<typeof SyncResponse>;
declare const SocketEvent: z.ZodObject<{
    type: z.ZodString;
    payload: z.ZodRecord<z.ZodString, z.ZodAny>;
    timestamp: z.ZodDate;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: string;
    timestamp: Date;
    payload: Record<string, any>;
    userId?: string | undefined;
}, {
    type: string;
    timestamp: Date;
    payload: Record<string, any>;
    userId?: string | undefined;
}>;
type SocketEvent = z.infer<typeof SocketEvent>;
declare const ProgressUpdateEvent: z.ZodObject<{
    timestamp: z.ZodDate;
    userId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"PROGRESS_UPDATE">;
    payload: z.ZodObject<{
        studentId: z.ZodString;
        taskId: z.ZodString;
        progress: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        taskId: string;
        progress: number;
    }, {
        studentId: string;
        taskId: string;
        progress: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "PROGRESS_UPDATE";
    timestamp: Date;
    payload: {
        studentId: string;
        taskId: string;
        progress: number;
    };
    userId?: string | undefined;
}, {
    type: "PROGRESS_UPDATE";
    timestamp: Date;
    payload: {
        studentId: string;
        taskId: string;
        progress: number;
    };
    userId?: string | undefined;
}>;
type ProgressUpdateEvent = z.infer<typeof ProgressUpdateEvent>;
declare const AchievementUnlockedEvent: z.ZodObject<{
    timestamp: z.ZodDate;
    userId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"ACHIEVEMENT_UNLOCKED">;
    payload: z.ZodObject<{
        studentId: z.ZodString;
        achievementId: z.ZodString;
        xpEarned: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        achievementId: string;
        xpEarned: number;
    }, {
        studentId: string;
        achievementId: string;
        xpEarned: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "ACHIEVEMENT_UNLOCKED";
    timestamp: Date;
    payload: {
        studentId: string;
        achievementId: string;
        xpEarned: number;
    };
    userId?: string | undefined;
}, {
    type: "ACHIEVEMENT_UNLOCKED";
    timestamp: Date;
    payload: {
        studentId: string;
        achievementId: string;
        xpEarned: number;
    };
    userId?: string | undefined;
}>;
type AchievementUnlockedEvent = z.infer<typeof AchievementUnlockedEvent>;
declare const ValidationError: z.ZodObject<{
    field: z.ZodString;
    message: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    field: string;
}, {
    code: string;
    message: string;
    field: string;
}>;
type ValidationError = z.infer<typeof ValidationError>;
declare const ErrorResponse: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        message: z.ZodString;
        code: z.ZodString;
        details: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            message: z.ZodString;
            code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            field: string;
        }, {
            code: string;
            message: string;
            field: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }, {
        code: string;
        message: string;
        details?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    }>;
    meta: z.ZodObject<{
        timestamp: z.ZodDate;
        requestId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        requestId: string;
    }, {
        timestamp: Date;
        requestId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    };
    meta: {
        timestamp: Date;
        requestId: string;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: {
            code: string;
            message: string;
            field: string;
        }[] | undefined;
    };
    meta: {
        timestamp: Date;
        requestId: string;
    };
}>;
type ErrorResponse = z.infer<typeof ErrorResponse>;

declare const UserRole: z.ZodEnum<["STUDENT", "TEACHER", "PARENT", "ADMIN"]>;
type UserRole = z.infer<typeof UserRole>;
declare const BaseUser: z.ZodObject<{
    id: z.ZodString;
    role: z.ZodEnum<["STUDENT", "TEACHER", "PARENT", "ADMIN"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
}>;
declare const Difficulty: z.ZodEnum<["BEGINNER", "INTERMEDIATE", "ADVANCED"]>;
type Difficulty = z.infer<typeof Difficulty>;
declare const TaskType: z.ZodEnum<["VOCABULARY", "WRITING", "READING", "LISTENING"]>;
type TaskType = z.infer<typeof TaskType>;
declare const ProgressStatus: z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"]>;
type ProgressStatus = z.infer<typeof ProgressStatus>;
declare const AchievementType: z.ZodEnum<["STREAK", "MILESTONE", "MASTERY", "SPECIAL"]>;
type AchievementType = z.infer<typeof AchievementType>;
declare const RewardType: z.ZodEnum<["VIRTUAL", "PHYSICAL", "PRIVILEGE"]>;
type RewardType = z.infer<typeof RewardType>;
declare const ApiResponse: <T>(dataSchema: z.ZodType<T>) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodType<T, z.ZodTypeDef, T>>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code?: string | undefined;
    }, {
        message: string;
        code?: string | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        requestId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        requestId: string;
    }, {
        timestamp: Date;
        requestId: string;
    }>>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodType<T, z.ZodTypeDef, T>>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code?: string | undefined;
    }, {
        message: string;
        code?: string | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        requestId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        requestId: string;
    }, {
        timestamp: Date;
        requestId: string;
    }>>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodType<T, z.ZodTypeDef, T>>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code?: string | undefined;
    }, {
        message: string;
        code?: string | undefined;
    }>>;
    meta: z.ZodOptional<z.ZodObject<{
        timestamp: z.ZodDate;
        requestId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: Date;
        requestId: string;
    }, {
        timestamp: Date;
        requestId: string;
    }>>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
declare const SyncOperation: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["CREATE", "UPDATE", "DELETE"]>;
    table: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
    timestamp: z.ZodDate;
    deviceId: z.ZodString;
    userId: z.ZodString;
    status: z.ZodEnum<["PENDING", "SUCCESS", "FAILED"]>;
}, "strip", z.ZodTypeAny, {
    type: "CREATE" | "UPDATE" | "DELETE";
    status: "FAILED" | "PENDING" | "SUCCESS";
    id: string;
    data: Record<string, any>;
    table: string;
    timestamp: Date;
    deviceId: string;
    userId: string;
}, {
    type: "CREATE" | "UPDATE" | "DELETE";
    status: "FAILED" | "PENDING" | "SUCCESS";
    id: string;
    data: Record<string, any>;
    table: string;
    timestamp: Date;
    deviceId: string;
    userId: string;
}>;
type SyncOperation = z.infer<typeof SyncOperation>;
declare const Platform: z.ZodEnum<["WEB", "IOS", "ANDROID", "DESKTOP"]>;
type Platform = z.infer<typeof Platform>;

declare const Student: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    role: z.ZodLiteral<"STUDENT">;
    uuid: z.ZodString;
    grade: z.ZodNumber;
    organizationId: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
    lastLoginAt: z.ZodNullable<z.ZodDate>;
    settings: z.ZodObject<{
        soundEnabled: z.ZodDefault<z.ZodBoolean>;
        vibrationEnabled: z.ZodDefault<z.ZodBoolean>;
        theme: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
        language: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        soundEnabled: boolean;
        vibrationEnabled: boolean;
        theme: "light" | "dark" | "auto";
        language: string;
    }, {
        soundEnabled?: boolean | undefined;
        vibrationEnabled?: boolean | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        language?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "STUDENT";
    createdAt: Date;
    updatedAt: Date;
    uuid: string;
    grade: number;
    organizationId: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    settings: {
        soundEnabled: boolean;
        vibrationEnabled: boolean;
        theme: "light" | "dark" | "auto";
        language: string;
    };
}, {
    id: string;
    role: "STUDENT";
    createdAt: Date;
    updatedAt: Date;
    uuid: string;
    grade: number;
    organizationId: string;
    lastLoginAt: Date | null;
    settings: {
        soundEnabled?: boolean | undefined;
        vibrationEnabled?: boolean | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        language?: string | undefined;
    };
    isActive?: boolean | undefined;
}>;
type Student = z.infer<typeof Student>;
declare const Teacher: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    role: z.ZodLiteral<"TEACHER">;
    email: z.ZodString;
    name: z.ZodString;
    organizationId: z.ZodString;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    classes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "TEACHER";
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    email: string;
    name: string;
    isVerified: boolean;
    classes: string[];
}, {
    id: string;
    role: "TEACHER";
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    email: string;
    name: string;
    isVerified?: boolean | undefined;
    classes?: string[] | undefined;
}>;
type Teacher = z.infer<typeof Teacher>;
declare const Parent: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    role: z.ZodLiteral<"PARENT">;
    email: z.ZodString;
    name: z.ZodString;
    children: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isVerified: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "PARENT";
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
    isVerified: boolean;
    children: string[];
}, {
    id: string;
    role: "PARENT";
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
    isVerified?: boolean | undefined;
    children?: string[] | undefined;
}>;
type Parent = z.infer<typeof Parent>;
declare const Admin: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    role: z.ZodLiteral<"ADMIN">;
    email: z.ZodString;
    name: z.ZodString;
    permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "ADMIN";
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
    permissions: string[];
}, {
    id: string;
    role: "ADMIN";
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
    permissions?: string[] | undefined;
}>;
type Admin = z.infer<typeof Admin>;
declare const Organization: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["SCHOOL", "DISTRICT", "PRIVATE"]>;
    country: z.ZodString;
    timezone: z.ZodString;
    settings: z.ZodObject<{
        allowParentAccess: z.ZodDefault<z.ZodBoolean>;
        requireVerification: z.ZodDefault<z.ZodBoolean>;
        maxStudentsPerClass: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        allowParentAccess: boolean;
        requireVerification: boolean;
        maxStudentsPerClass: number;
    }, {
        allowParentAccess?: boolean | undefined;
        requireVerification?: boolean | undefined;
        maxStudentsPerClass?: number | undefined;
    }>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: "SCHOOL" | "DISTRICT" | "PRIVATE";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    settings: {
        allowParentAccess: boolean;
        requireVerification: boolean;
        maxStudentsPerClass: number;
    };
    name: string;
    country: string;
    timezone: string;
}, {
    type: "SCHOOL" | "DISTRICT" | "PRIVATE";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    settings: {
        allowParentAccess?: boolean | undefined;
        requireVerification?: boolean | undefined;
        maxStudentsPerClass?: number | undefined;
    };
    name: string;
    country: string;
    timezone: string;
}>;
type Organization = z.infer<typeof Organization>;
declare const LearningModule: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    difficulty: z.ZodEnum<["BEGINNER", "INTERMEDIATE", "ADVANCED"]>;
    grade: z.ZodNumber;
    subject: z.ZodString;
    estimatedDuration: z.ZodNumber;
    prerequisites: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isPublished: z.ZodDefault<z.ZodBoolean>;
    content: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    grade: number;
    title: string;
    description: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    subject: string;
    estimatedDuration: number;
    prerequisites: string[];
    isPublished: boolean;
    content: string[];
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    grade: number;
    title: string;
    description: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    subject: string;
    estimatedDuration: number;
    prerequisites?: string[] | undefined;
    isPublished?: boolean | undefined;
    content?: string[] | undefined;
}>;
type LearningModule = z.infer<typeof LearningModule>;
declare const Task: z.ZodObject<{
    id: z.ZodString;
    moduleId: z.ZodString;
    type: z.ZodEnum<["VOCABULARY", "WRITING", "READING", "LISTENING"]>;
    title: z.ZodString;
    instructions: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    correctAnswer: z.ZodString;
    hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    timeLimit: z.ZodNullable<z.ZodNumber>;
    xpReward: z.ZodDefault<z.ZodNumber>;
    isPublished: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: "VOCABULARY" | "WRITING" | "READING" | "LISTENING";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    isPublished: boolean;
    content: Record<string, any>;
    moduleId: string;
    instructions: string;
    correctAnswer: string;
    hints: string[];
    maxAttempts: number;
    timeLimit: number | null;
    xpReward: number;
}, {
    type: "VOCABULARY" | "WRITING" | "READING" | "LISTENING";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: Record<string, any>;
    moduleId: string;
    instructions: string;
    correctAnswer: string;
    timeLimit: number | null;
    isPublished?: boolean | undefined;
    hints?: string[] | undefined;
    maxAttempts?: number | undefined;
    xpReward?: number | undefined;
}>;
type Task = z.infer<typeof Task>;
declare const StudentProgress: z.ZodObject<{
    id: z.ZodString;
    studentId: z.ZodString;
    taskId: z.ZodString;
    status: z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"]>;
    attempts: z.ZodDefault<z.ZodNumber>;
    score: z.ZodNullable<z.ZodNumber>;
    timeSpent: z.ZodDefault<z.ZodNumber>;
    startedAt: z.ZodDate;
    completedAt: z.ZodNullable<z.ZodDate>;
    data: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    id: string;
    studentId: string;
    taskId: string;
    attempts: number;
    score: number | null;
    timeSpent: number;
    startedAt: Date;
    completedAt: Date | null;
    data: Record<string, any>;
}, {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    id: string;
    studentId: string;
    taskId: string;
    score: number | null;
    startedAt: Date;
    completedAt: Date | null;
    attempts?: number | undefined;
    timeSpent?: number | undefined;
    data?: Record<string, any> | undefined;
}>;
type StudentProgress = z.infer<typeof StudentProgress>;
declare const Achievement: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["STREAK", "MILESTONE", "MASTERY", "SPECIAL"]>;
    icon: z.ZodString;
    xpReward: z.ZodDefault<z.ZodNumber>;
    conditions: z.ZodRecord<z.ZodString, z.ZodAny>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: "STREAK" | "MILESTONE" | "MASTERY" | "SPECIAL";
    id: string;
    createdAt: Date;
    isActive: boolean;
    name: string;
    description: string;
    xpReward: number;
    icon: string;
    conditions: Record<string, any>;
}, {
    type: "STREAK" | "MILESTONE" | "MASTERY" | "SPECIAL";
    id: string;
    createdAt: Date;
    name: string;
    description: string;
    icon: string;
    conditions: Record<string, any>;
    isActive?: boolean | undefined;
    xpReward?: number | undefined;
}>;
type Achievement = z.infer<typeof Achievement>;
declare const StudentAchievement: z.ZodObject<{
    id: z.ZodString;
    studentId: z.ZodString;
    achievementId: z.ZodString;
    unlockedAt: z.ZodDate;
    isNew: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    studentId: string;
    achievementId: string;
    unlockedAt: Date;
    isNew: boolean;
}, {
    id: string;
    studentId: string;
    achievementId: string;
    unlockedAt: Date;
    isNew?: boolean | undefined;
}>;
type StudentAchievement = z.infer<typeof StudentAchievement>;
declare const Reward: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["VIRTUAL", "PHYSICAL", "PRIVILEGE"]>;
    cost: z.ZodNumber;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
    createdBy: z.ZodString;
    organizationId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: "VIRTUAL" | "PHYSICAL" | "PRIVILEGE";
    id: string;
    createdAt: Date;
    organizationId: string | null;
    name: string;
    description: string;
    cost: number;
    isAvailable: boolean;
    createdBy: string;
}, {
    type: "VIRTUAL" | "PHYSICAL" | "PRIVILEGE";
    id: string;
    createdAt: Date;
    organizationId: string | null;
    name: string;
    description: string;
    cost: number;
    createdBy: string;
    isAvailable?: boolean | undefined;
}>;
type Reward = z.infer<typeof Reward>;
declare const DeviceInfo: z.ZodObject<{
    platform: z.ZodEnum<["WEB", "IOS", "ANDROID", "DESKTOP"]>;
    version: z.ZodString;
    deviceId: z.ZodString;
    appVersion: z.ZodString;
    lastSyncAt: z.ZodNullable<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    deviceId: string;
    platform: "WEB" | "IOS" | "ANDROID" | "DESKTOP";
    version: string;
    appVersion: string;
    lastSyncAt: Date | null;
}, {
    deviceId: string;
    platform: "WEB" | "IOS" | "ANDROID" | "DESKTOP";
    version: string;
    appVersion: string;
    lastSyncAt: Date | null;
}>;
type DeviceInfo = z.infer<typeof DeviceInfo>;

export { Achievement, AchievementType, AchievementUnlockedEvent, Admin, ApiResponse, BaseUser, CreateClassInput, CreateRewardInput, CreateTaskInput, DeviceInfo, Difficulty, ErrorResponse, LearningModule, LinkChildInput, LoginInput, Organization, PaginationInput, Parent, Platform, ProgressFilters, ProgressStatus, ProgressUpdateEvent, RegisterStudentInput, RegisterTeacherInput, Reward, RewardType, SocketEvent, Student, StudentAchievement, StudentFilters, StudentProgress, SyncOperation, SyncRequest, SyncResponse, Task, TaskType, Teacher, UpdateProgressInput, UserRole, ValidationError };
