-- CreateTable
CREATE TABLE "public"."vocabulary_mistakes" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "mistakeType" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "studentAnswer" TEXT NOT NULL,
    "severity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "exerciseType" TEXT NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "languageCode" CHAR(2) NOT NULL DEFAULT 'de',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_mistakes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vocabulary_mistakes_studentId_idx" ON "public"."vocabulary_mistakes"("studentId");

-- CreateIndex
CREATE INDEX "vocabulary_mistakes_wordId_idx" ON "public"."vocabulary_mistakes"("wordId");

-- CreateIndex
CREATE INDEX "vocabulary_mistakes_mistakeType_idx" ON "public"."vocabulary_mistakes"("mistakeType");

-- CreateIndex
CREATE INDEX "vocabulary_mistakes_createdAt_idx" ON "public"."vocabulary_mistakes"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."vocabulary_mistakes" ADD CONSTRAINT "vocabulary_mistakes_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "public"."vocabulary_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
