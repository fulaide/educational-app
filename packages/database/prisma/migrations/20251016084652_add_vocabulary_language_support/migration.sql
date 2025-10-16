-- CreateEnum
CREATE TYPE "public"."VocabularyCategory" AS ENUM ('ANIMALS', 'COLORS', 'NUMBERS', 'FAMILY', 'OBJECTS', 'FOOD', 'CLOTHING', 'BODY_PARTS', 'WEATHER', 'TIME', 'PLACES', 'ACTIONS');

-- CreateEnum
CREATE TYPE "public"."MasteryLevel" AS ENUM ('NOT_LEARNED', 'LEARNING', 'FAMILIAR', 'MASTERED');

-- CreateEnum
CREATE TYPE "public"."ExerciseType" AS ENUM ('MATCHING', 'MULTIPLE_CHOICE', 'SPELLING', 'AUDIO', 'PICTURE', 'SENTENCE_BUILDING', 'DRAG_DROP', 'FILL_BLANK');

-- CreateTable
CREATE TABLE "public"."vocabulary_words" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "phonetic" TEXT,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "category" "public"."VocabularyCategory" NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 5,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "translations" JSONB NOT NULL DEFAULT '{}',
    "examples" JSONB NOT NULL DEFAULT '[]',
    "language" CHAR(2) NOT NULL DEFAULT 'de',
    "languageSpecificData" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "vocabulary_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocabulary_progress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "masteryLevel" "public"."MasteryLevel" NOT NULL DEFAULT 'NOT_LEARNED',
    "correctAttempts" INTEGER NOT NULL DEFAULT 0,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastSeen" TIMESTAMP(3),
    "nextReview" TIMESTAMP(3),
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "lapseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocabulary_sessions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "category" "public"."VocabularyCategory",
    "difficulty" "public"."Difficulty",
    "wordsToReview" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "wordsCompleted" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sessionType" TEXT NOT NULL DEFAULT 'MIXED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "averageAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "vocabulary_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocabulary_attempts" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "exerciseType" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vocabulary_words_organizationId_idx" ON "public"."vocabulary_words"("organizationId");

-- CreateIndex
CREATE INDEX "vocabulary_words_category_idx" ON "public"."vocabulary_words"("category");

-- CreateIndex
CREATE INDEX "vocabulary_words_difficulty_idx" ON "public"."vocabulary_words"("difficulty");

-- CreateIndex
CREATE INDEX "vocabulary_words_language_idx" ON "public"."vocabulary_words"("language");

-- CreateIndex
CREATE INDEX "vocabulary_progress_studentId_idx" ON "public"."vocabulary_progress"("studentId");

-- CreateIndex
CREATE INDEX "vocabulary_progress_nextReview_idx" ON "public"."vocabulary_progress"("nextReview");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_progress_studentId_wordId_key" ON "public"."vocabulary_progress"("studentId", "wordId");

-- CreateIndex
CREATE INDEX "vocabulary_sessions_studentId_idx" ON "public"."vocabulary_sessions"("studentId");

-- CreateIndex
CREATE INDEX "vocabulary_attempts_sessionId_idx" ON "public"."vocabulary_attempts"("sessionId");

-- CreateIndex
CREATE INDEX "vocabulary_attempts_wordId_idx" ON "public"."vocabulary_attempts"("wordId");

-- CreateIndex
CREATE INDEX "vocabulary_attempts_studentId_idx" ON "public"."vocabulary_attempts"("studentId");

-- AddForeignKey
ALTER TABLE "public"."vocabulary_words" ADD CONSTRAINT "vocabulary_words_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_words" ADD CONSTRAINT "vocabulary_words_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_progress" ADD CONSTRAINT "vocabulary_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_progress" ADD CONSTRAINT "vocabulary_progress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."vocabulary_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_sessions" ADD CONSTRAINT "vocabulary_sessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_attempts" ADD CONSTRAINT "vocabulary_attempts_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."vocabulary_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_attempts" ADD CONSTRAINT "vocabulary_attempts_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."vocabulary_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_attempts" ADD CONSTRAINT "vocabulary_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
