-- CreateTable
CREATE TABLE "public"."vocabulary_challenges" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "exerciseType" "public"."ExerciseType" NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "timeLimit" INTEGER,
    "attemptsAllowed" INTEGER NOT NULL DEFAULT 3,
    "enableHints" BOOLEAN NOT NULL DEFAULT true,
    "enableExplanations" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."challenge_exercises" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "question" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "distractors" JSONB NOT NULL,
    "hints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."challenge_assignments" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "assignedToClass" TEXT,
    "assignedToStudent" TEXT,
    "availableFrom" TIMESTAMP(3),
    "availableUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."challenge_attempts" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,
    "totalPoints" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "responses" JSONB NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "challenge_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vocabulary_challenges_organizationId_idx" ON "public"."vocabulary_challenges"("organizationId");

-- CreateIndex
CREATE INDEX "vocabulary_challenges_createdBy_idx" ON "public"."vocabulary_challenges"("createdBy");

-- CreateIndex
CREATE INDEX "challenge_exercises_challengeId_idx" ON "public"."challenge_exercises"("challengeId");

-- CreateIndex
CREATE INDEX "challenge_exercises_wordId_idx" ON "public"."challenge_exercises"("wordId");

-- CreateIndex
CREATE INDEX "challenge_assignments_challengeId_idx" ON "public"."challenge_assignments"("challengeId");

-- CreateIndex
CREATE INDEX "challenge_assignments_assignedToClass_idx" ON "public"."challenge_assignments"("assignedToClass");

-- CreateIndex
CREATE INDEX "challenge_assignments_assignedToStudent_idx" ON "public"."challenge_assignments"("assignedToStudent");

-- CreateIndex
CREATE INDEX "challenge_attempts_assignmentId_idx" ON "public"."challenge_attempts"("assignmentId");

-- CreateIndex
CREATE INDEX "challenge_attempts_studentId_idx" ON "public"."challenge_attempts"("studentId");

-- AddForeignKey
ALTER TABLE "public"."vocabulary_challenges" ADD CONSTRAINT "vocabulary_challenges_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_exercises" ADD CONSTRAINT "challenge_exercises_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."vocabulary_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_assignments" ADD CONSTRAINT "challenge_assignments_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."vocabulary_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_assignments" ADD CONSTRAINT "challenge_assignments_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_assignments" ADD CONSTRAINT "challenge_assignments_assignedToClass_fkey" FOREIGN KEY ("assignedToClass") REFERENCES "public"."classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_assignments" ADD CONSTRAINT "challenge_assignments_assignedToStudent_fkey" FOREIGN KEY ("assignedToStudent") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_attempts" ADD CONSTRAINT "challenge_attempts_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."challenge_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."challenge_attempts" ADD CONSTRAINT "challenge_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
