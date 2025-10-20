-- CreateEnum
CREATE TYPE "public"."TypingTheme" AS ENUM ('STORY', 'POEM', 'EDUCATIONAL', 'RHYME', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ErrorHandlingMode" AS ENUM ('BLOCKING', 'HIGHLIGHTING', 'SPEED_FOCUSED');

-- CreateEnum
CREATE TYPE "public"."TimerMode" AS ENUM ('PER_WORD', 'GLOBAL', 'DISABLED');

-- CreateTable
CREATE TABLE "public"."typing_challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "gradeLevel" INTEGER NOT NULL,
    "theme" "public"."TypingTheme" NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "errorHandling" "public"."ErrorHandlingMode" NOT NULL DEFAULT 'BLOCKING',
    "timerMode" "public"."TimerMode" NOT NULL DEFAULT 'PER_WORD',
    "baseTimePerWord" INTEGER NOT NULL DEFAULT 7000,
    "enableHints" BOOLEAN NOT NULL DEFAULT true,
    "enableSounds" BOOLEAN NOT NULL DEFAULT true,
    "showKeyboard" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typing_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."typing_texts" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "characterCount" INTEGER NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "hasUmlauts" BOOLEAN NOT NULL DEFAULT false,
    "hasNumbers" BOOLEAN NOT NULL DEFAULT false,
    "hasPunctuation" BOOLEAN NOT NULL DEFAULT false,
    "hasUppercase" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typing_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."typing_attempts" (
    "id" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "wordsTyped" INTEGER NOT NULL,
    "charactersTyped" INTEGER NOT NULL,
    "correctCharacters" INTEGER NOT NULL,
    "incorrectCharacters" INTEGER NOT NULL,
    "totalTimeMs" INTEGER NOT NULL,
    "averageWPM" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "uppercaseErrors" INTEGER NOT NULL DEFAULT 0,
    "umlautErrors" INTEGER NOT NULL DEFAULT 0,
    "specialCharErrors" INTEGER NOT NULL DEFAULT 0,
    "wrongKeyErrors" INTEGER NOT NULL DEFAULT 0,
    "timeoutErrors" INTEGER NOT NULL DEFAULT 0,
    "errorPositions" JSONB NOT NULL DEFAULT '[]',
    "wordTimings" JSONB NOT NULL DEFAULT '[]',
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "level1Hints" INTEGER NOT NULL DEFAULT 0,
    "level2Hints" INTEGER NOT NULL DEFAULT 0,
    "level3Hints" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL,
    "achievementsUnlocked" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typing_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."typing_challenge_assignments" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "assignedToClass" TEXT,
    "assignedToStudent" TEXT,
    "assignedBy" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typing_challenge_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "typing_challenges_gradeLevel_idx" ON "public"."typing_challenges"("gradeLevel");

-- CreateIndex
CREATE INDEX "typing_challenges_createdBy_idx" ON "public"."typing_challenges"("createdBy");

-- CreateIndex
CREATE INDEX "typing_challenges_theme_idx" ON "public"."typing_challenges"("theme");

-- CreateIndex
CREATE INDEX "typing_texts_challengeId_idx" ON "public"."typing_texts"("challengeId");

-- CreateIndex
CREATE INDEX "typing_attempts_studentId_idx" ON "public"."typing_attempts"("studentId");

-- CreateIndex
CREATE INDEX "typing_attempts_textId_idx" ON "public"."typing_attempts"("textId");

-- CreateIndex
CREATE INDEX "typing_attempts_challengeId_idx" ON "public"."typing_attempts"("challengeId");

-- CreateIndex
CREATE INDEX "typing_attempts_createdAt_idx" ON "public"."typing_attempts"("createdAt");

-- CreateIndex
CREATE INDEX "typing_challenge_assignments_challengeId_idx" ON "public"."typing_challenge_assignments"("challengeId");

-- CreateIndex
CREATE INDEX "typing_challenge_assignments_assignedToClass_idx" ON "public"."typing_challenge_assignments"("assignedToClass");

-- CreateIndex
CREATE INDEX "typing_challenge_assignments_assignedToStudent_idx" ON "public"."typing_challenge_assignments"("assignedToStudent");

-- AddForeignKey
ALTER TABLE "public"."typing_challenges" ADD CONSTRAINT "typing_challenges_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_texts" ADD CONSTRAINT "typing_texts_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."typing_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_attempts" ADD CONSTRAINT "typing_attempts_textId_fkey" FOREIGN KEY ("textId") REFERENCES "public"."typing_texts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_attempts" ADD CONSTRAINT "typing_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_challenge_assignments" ADD CONSTRAINT "typing_challenge_assignments_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."typing_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_challenge_assignments" ADD CONSTRAINT "typing_challenge_assignments_assignedToClass_fkey" FOREIGN KEY ("assignedToClass") REFERENCES "public"."classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_challenge_assignments" ADD CONSTRAINT "typing_challenge_assignments_assignedToStudent_fkey" FOREIGN KEY ("assignedToStudent") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_challenge_assignments" ADD CONSTRAINT "typing_challenge_assignments_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
