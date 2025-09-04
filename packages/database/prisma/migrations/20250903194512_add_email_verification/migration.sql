-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."OrganizationType" AS ENUM ('SCHOOL', 'DISTRICT', 'PRIVATE');

-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('VOCABULARY', 'WRITING', 'READING', 'LISTENING');

-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "public"."ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."AchievementType" AS ENUM ('STREAK', 'MILESTONE', 'MASTERY', 'SPECIAL');

-- CreateEnum
CREATE TYPE "public"."RewardType" AS ENUM ('VIRTUAL', 'PHYSICAL', 'PRIVILEGE');

-- CreateEnum
CREATE TYPE "public"."SyncOperationType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "public"."SyncOperationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."Platform" AS ENUM ('WEB', 'IOS', 'ANDROID', 'DESKTOP');

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_resets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."OrganizationType" NOT NULL,
    "country" CHAR(2) NOT NULL,
    "timezone" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "uuid" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "grade" INTEGER,
    "organizationId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "maxStudents" INTEGER NOT NULL DEFAULT 30,
    "organizationId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parent_children" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "prerequisites" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "type" "public"."TaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "hints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "timeLimit" INTEGER,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_progress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "public"."ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "student_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."achievements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."AchievementType" NOT NULL,
    "icon" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "conditions" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_achievements" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isNew" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "student_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rewards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."RewardType" NOT NULL,
    "cost" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reward_redemptions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "xpSpent" INTEGER NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "reward_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sync_operations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."SyncOperationType" NOT NULL,
    "table" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT NOT NULL,
    "status" "public"."SyncOperationStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,

    CONSTRAINT "sync_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."device_info" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "public"."Platform" NOT NULL,
    "version" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "appVersion" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" "public"."Platform" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."authenticators" (
    "credential_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "credential_public_key" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credential_device_type" TEXT NOT NULL,
    "credential_backed_up" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "authenticators_pkey" PRIMARY KEY ("user_id","credential_id")
);

-- CreateTable
CREATE TABLE "public"."_StudentClasses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentClasses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_tokenId_key" ON "public"."user_sessions"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "public"."password_resets"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_key" ON "public"."email_verifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "public"."users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "parent_children_parentId_childId_key" ON "public"."parent_children"("parentId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "student_progress_studentId_taskId_key" ON "public"."student_progress"("studentId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "student_achievements_studentId_achievementId_key" ON "public"."student_achievements"("studentId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "device_info_deviceId_key" ON "public"."device_info"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_tokens_token_key" ON "public"."notification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "authenticators_credential_id_key" ON "public"."authenticators"("credential_id");

-- CreateIndex
CREATE INDEX "_StudentClasses_B_index" ON "public"."_StudentClasses"("B");

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_resets" ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."email_verifications" ADD CONSTRAINT "email_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parent_children" ADD CONSTRAINT "parent_children_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parent_children" ADD CONSTRAINT "parent_children_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_modules" ADD CONSTRAINT "learning_modules_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."learning_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_progress" ADD CONSTRAINT "student_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_progress" ADD CONSTRAINT "student_progress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_achievements" ADD CONSTRAINT "student_achievements_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_achievements" ADD CONSTRAINT "student_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rewards" ADD CONSTRAINT "rewards_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rewards" ADD CONSTRAINT "rewards_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reward_redemptions" ADD CONSTRAINT "reward_redemptions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reward_redemptions" ADD CONSTRAINT "reward_redemptions_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "public"."rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sync_operations" ADD CONSTRAINT "sync_operations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."device_info" ADD CONSTRAINT "device_info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_tokens" ADD CONSTRAINT "notification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."authenticators" ADD CONSTRAINT "authenticators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentClasses" ADD CONSTRAINT "_StudentClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentClasses" ADD CONSTRAINT "_StudentClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
