-- Migration: Create Learning Module System
-- Date: 2025-08-31  
-- Description: Create tables for learning modules, exercises, vocabulary, and progress tracking

-- Create enum types
CREATE TYPE difficulty_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE module_category AS ENUM ('VOCABULARY', 'GRAMMAR', 'READING', 'WRITING', 'LISTENING', 'SPEAKING');
CREATE TYPE module_status AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');
CREATE TYPE exercise_type AS ENUM ('MATCHING', 'MULTIPLE_CHOICE', 'SPELLING', 'AUDIO', 'PICTURE', 'SENTENCE_BUILDING', 'DRAG_DROP', 'FILL_BLANK');
CREATE TYPE vocabulary_category AS ENUM ('ANIMALS', 'COLORS', 'NUMBERS', 'FAMILY', 'OBJECTS', 'FOOD', 'CLOTHING', 'BODY_PARTS', 'WEATHER', 'TIME', 'PLACES', 'ACTIONS');
CREATE TYPE mastery_level AS ENUM ('NOT_LEARNED', 'LEARNING', 'FAMILIAR', 'MASTERED');
CREATE TYPE progress_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED');
CREATE TYPE achievement_type AS ENUM ('MILESTONE', 'STREAK', 'MASTERY', 'SPEED', 'ACCURACY', 'EXPLORATION', 'PERSISTENCE', 'CONSISTENCY', 'IMPROVEMENT', 'COLLABORATION');
CREATE TYPE achievement_rarity AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- Learning Modules Table
CREATE TABLE "LearningModule" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "category" module_category NOT NULL,
  "difficulty" difficulty_level NOT NULL,
  "estimatedDuration" INTEGER NOT NULL, -- minutes
  "prerequisites" UUID[] DEFAULT '{}', -- array of module IDs
  "imageUrl" VARCHAR(500),
  "status" module_status DEFAULT 'ACTIVE',
  "translations" JSONB DEFAULT '{}',
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "createdBy" UUID NOT NULL REFERENCES "User"("id")
);

-- Vocabulary Words Table  
CREATE TABLE "VocabularyWord" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "word" VARCHAR(255) NOT NULL, -- German word
  "translation" VARCHAR(255) NOT NULL, -- English translation
  "phonetic" VARCHAR(255), -- IPA pronunciation
  "audioUrl" VARCHAR(500), -- audio file URL
  "imageUrl" VARCHAR(500), -- associated image URL
  "category" vocabulary_category NOT NULL,
  "difficulty" difficulty_level NOT NULL,
  "frequency" INTEGER DEFAULT 5, -- usage frequency 1-10
  "tags" TEXT[] DEFAULT '{}', -- additional tags
  "translations" JSONB DEFAULT '{}',
  "examples" JSONB DEFAULT '[]', -- usage examples
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "createdBy" UUID NOT NULL REFERENCES "User"("id")
);

-- Exercises Table
CREATE TABLE "Exercise" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "moduleId" UUID NOT NULL REFERENCES "LearningModule"("id") ON DELETE CASCADE,
  "type" exercise_type NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "instructions" TEXT,
  "content" JSONB NOT NULL, -- exercise-specific content
  "pointsValue" INTEGER DEFAULT 10,
  "timeLimit" INTEGER, -- seconds, NULL for unlimited
  "order" INTEGER NOT NULL, -- position within module
  "translations" JSONB DEFAULT '{}',
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Student Progress in Modules
CREATE TABLE "StudentProgress" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "moduleId" UUID NOT NULL REFERENCES "LearningModule"("id") ON DELETE CASCADE,
  "status" progress_status DEFAULT 'NOT_STARTED',
  "completionPercentage" INTEGER DEFAULT 0 CHECK ("completionPercentage" >= 0 AND "completionPercentage" <= 100),
  "currentExerciseId" UUID REFERENCES "Exercise"("id"),
  "score" INTEGER DEFAULT 0,
  "maxPossibleScore" INTEGER DEFAULT 0,
  "timeSpent" INTEGER DEFAULT 0, -- minutes
  "exercisesCompleted" INTEGER DEFAULT 0,
  "totalExercises" INTEGER DEFAULT 0,
  "attempts" INTEGER DEFAULT 0,
  "startedAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "lastAccessed" TIMESTAMP DEFAULT NOW(),
  "pausedAt" TIMESTAMP,
  "resumedAt" TIMESTAMP,
  UNIQUE("studentId", "moduleId")
);

-- Exercise Progress and Attempts
CREATE TABLE "ExerciseProgress" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "exerciseId" UUID NOT NULL REFERENCES "Exercise"("id") ON DELETE CASCADE,
  "moduleId" UUID NOT NULL REFERENCES "LearningModule"("id") ON DELETE CASCADE,
  "status" progress_status DEFAULT 'NOT_STARTED',
  "score" INTEGER DEFAULT 0,
  "maxScore" INTEGER DEFAULT 0,
  "attempts" INTEGER DEFAULT 0,
  "timeSpent" INTEGER DEFAULT 0, -- seconds
  "hintsUsed" INTEGER DEFAULT 0,
  "firstAttemptAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "lastAttemptAt" TIMESTAMP DEFAULT NOW(),
  "isCorrect" BOOLEAN DEFAULT false,
  "feedback" TEXT,
  UNIQUE("studentId", "exerciseId")
);

-- Exercise Attempts (detailed attempt history)
CREATE TABLE "ExerciseAttempt" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "exerciseId" UUID NOT NULL REFERENCES "Exercise"("id") ON DELETE CASCADE,
  "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "answers" JSONB NOT NULL, -- student's answers
  "score" INTEGER NOT NULL,
  "maxScore" INTEGER NOT NULL,
  "timeSpent" INTEGER NOT NULL, -- seconds
  "isCompleted" BOOLEAN DEFAULT false,
  "startedAt" TIMESTAMP DEFAULT NOW(),
  "completedAt" TIMESTAMP,
  "hints" TEXT[] DEFAULT '{}', -- hints used
  "feedback" TEXT
);

-- Vocabulary Learning Progress (Spaced Repetition)
CREATE TABLE "VocabularyProgress" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "wordId" UUID NOT NULL REFERENCES "VocabularyWord"("id") ON DELETE CASCADE,
  "masteryLevel" mastery_level DEFAULT 'NOT_LEARNED',
  "correctAttempts" INTEGER DEFAULT 0,
  "totalAttempts" INTEGER DEFAULT 0,
  "lastSeen" TIMESTAMP,
  "nextReview" TIMESTAMP,
  "streakCount" INTEGER DEFAULT 0,
  -- Spaced repetition algorithm data
  "interval" INTEGER DEFAULT 1, -- days until next review
  "easeFactor" DECIMAL(3,2) DEFAULT 2.5, -- difficulty multiplier
  "repetitions" INTEGER DEFAULT 0,
  "lapseCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("studentId", "wordId")
);

-- Vocabulary Learning Sessions
CREATE TABLE "VocabularySession" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "category" vocabulary_category,
  "difficulty" difficulty_level,
  "wordsToReview" UUID[] DEFAULT '{}', -- word IDs
  "wordsCompleted" UUID[] DEFAULT '{}', -- completed word IDs
  "sessionType" VARCHAR(20) DEFAULT 'MIXED', -- REVIEW, NEW_WORDS, MIXED
  "startedAt" TIMESTAMP DEFAULT NOW(),
  "completedAt" TIMESTAMP,
  "totalTimeSpent" INTEGER DEFAULT 0, -- seconds
  "averageAccuracy" DECIMAL(5,2) DEFAULT 0.0
);

-- Vocabulary Attempts within Sessions
CREATE TABLE "VocabularyAttempt" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionId" UUID NOT NULL REFERENCES "VocabularySession"("id") ON DELETE CASCADE,
  "wordId" UUID NOT NULL REFERENCES "VocabularyWord"("id") ON DELETE CASCADE,
  "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "exerciseType" VARCHAR(20) NOT NULL, -- RECOGNITION, RECALL, SPELLING, AUDIO
  "isCorrect" BOOLEAN NOT NULL,
  "responseTime" INTEGER NOT NULL, -- milliseconds
  "hintsUsed" INTEGER DEFAULT 0,
  "attemptedAt" TIMESTAMP DEFAULT NOW()
);

-- Achievements System
CREATE TABLE "Achievement" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "organizationId" UUID NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "type" achievement_type NOT NULL,
  "rarity" achievement_rarity DEFAULT 'COMMON',
  "criteria" JSONB NOT NULL, -- achievement criteria
  "pointsValue" INTEGER DEFAULT 10,
  "badgeIcon" VARCHAR(100),
  "badgeColor" VARCHAR(7), -- hex color
  "translations" JSONB DEFAULT '{}',
  "isActive" BOOLEAN DEFAULT true,
  "isVisible" BOOLEAN DEFAULT true, -- hidden achievements
  "prerequisiteAchievements" UUID[] DEFAULT '{}',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "createdBy" UUID NOT NULL REFERENCES "User"("id")
);

-- Student Achievement Progress
CREATE TABLE "StudentAchievement" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "achievementId" UUID NOT NULL REFERENCES "Achievement"("id") ON DELETE CASCADE,
  "status" VARCHAR(20) DEFAULT 'LOCKED', -- LOCKED, IN_PROGRESS, UNLOCKED
  "progress" INTEGER DEFAULT 0 CHECK ("progress" >= 0 AND "progress" <= 100),
  "unlockedAt" TIMESTAMP,
  "notifiedAt" TIMESTAMP,
  "metadata" JSONB DEFAULT '{}',
  UNIQUE("studentId", "achievementId")
);

-- Module Assignments
CREATE TABLE "ModuleAssignment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "moduleId" UUID NOT NULL REFERENCES "LearningModule"("id") ON DELETE CASCADE,
  "assignedBy" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "assignedTo" VARCHAR(10) NOT NULL, -- CLASS or STUDENT
  "targetId" UUID NOT NULL, -- class ID or student ID
  "dueDate" TIMESTAMP,
  "maxAttempts" INTEGER,
  "requiredScore" INTEGER,
  "assignedAt" TIMESTAMP DEFAULT NOW(),
  "isActive" BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX "idx_learning_module_organization" ON "LearningModule"("organizationId");
CREATE INDEX "idx_learning_module_difficulty" ON "LearningModule"("difficulty");
CREATE INDEX "idx_learning_module_category" ON "LearningModule"("category");
CREATE INDEX "idx_vocabulary_word_category" ON "VocabularyWord"("category");
CREATE INDEX "idx_vocabulary_word_difficulty" ON "VocabularyWord"("difficulty");
CREATE INDEX "idx_student_progress_student" ON "StudentProgress"("studentId");
CREATE INDEX "idx_student_progress_module" ON "StudentProgress"("moduleId");
CREATE INDEX "idx_exercise_progress_student" ON "ExerciseProgress"("studentId");
CREATE INDEX "idx_vocabulary_progress_student" ON "VocabularyProgress"("studentId");
CREATE INDEX "idx_vocabulary_progress_review" ON "VocabularyProgress"("nextReview") WHERE "nextReview" IS NOT NULL;
CREATE INDEX "idx_student_achievement_student" ON "StudentAchievement"("studentId");

-- GIN indexes for JSONB columns
CREATE INDEX "idx_learning_module_translations" ON "LearningModule" USING GIN ("translations");
CREATE INDEX "idx_vocabulary_word_translations" ON "VocabularyWord" USING GIN ("translations");
CREATE INDEX "idx_exercise_content" ON "Exercise" USING GIN ("content");

-- Add triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_learning_module_updated_at BEFORE UPDATE ON "LearningModule" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_vocabulary_word_updated_at BEFORE UPDATE ON "VocabularyWord" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabulary_progress_updated_at BEFORE UPDATE ON "VocabularyProgress" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraints and checks
ALTER TABLE "StudentProgress" ADD CONSTRAINT "check_completion_percentage" 
    CHECK ("completionPercentage" >= 0 AND "completionPercentage" <= 100);
    
ALTER TABLE "VocabularyWord" ADD CONSTRAINT "check_frequency_range"
    CHECK ("frequency" >= 1 AND "frequency" <= 10);

ALTER TABLE "ExerciseProgress" ADD CONSTRAINT "check_score_positive" 
    CHECK ("score" >= 0 AND "maxScore" >= 0);

-- Add helpful comments
COMMENT ON TABLE "LearningModule" IS 'Core learning modules containing educational content';
COMMENT ON TABLE "VocabularyWord" IS 'German vocabulary words with translations and learning metadata';
COMMENT ON TABLE "Exercise" IS 'Interactive exercises within learning modules';
COMMENT ON TABLE "StudentProgress" IS 'Student progress tracking for learning modules';
COMMENT ON TABLE "VocabularyProgress" IS 'Spaced repetition progress for vocabulary learning';
COMMENT ON TABLE "Achievement" IS 'Gamification achievements and badges';

COMMENT ON COLUMN "VocabularyWord"."frequency" IS 'Word usage frequency from 1 (rare) to 10 (very common)';
COMMENT ON COLUMN "VocabularyProgress"."easeFactor" IS 'Spaced repetition ease factor (1.3 - 2.5)';
COMMENT ON COLUMN "Exercise"."content" IS 'Exercise-specific content in JSON format';
COMMENT ON COLUMN "Achievement"."criteria" IS 'Achievement unlock criteria in JSON format';