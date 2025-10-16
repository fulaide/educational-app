/**
 * Server-side Spaced Repetition Integration
 *
 * This module integrates the SpacedRepetitionEngine and MistakePatternAnalyzer
 * with the database to update vocabulary progress based on student attempts.
 */

import type { PrismaClient } from '@educational-app/database';
import { SpacedRepetitionEngine, type SM2Quality } from '@educational-app/learning/services/SpacedRepetitionEngine';
import { MistakePatternAnalyzer, type MistakeType } from '@educational-app/learning/services/MistakePatternAnalyzer';

export interface ProcessAttemptOptions {
  studentId: string;
  wordId: string;
  sessionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  studentAnswer: string;
  responseTime: number; // milliseconds
  hintsUsed: number;
  exerciseType: string;
  expectedTime?: number; // milliseconds (default: 5000)
}

export interface ProcessAttemptResult {
  attemptId: string;
  progress: {
    masteryLevel: string;
    nextReview: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
    streakUpdated: boolean;
  };
  mistakesRecorded: number;
  xpEarned: number;
}

/**
 * Process a vocabulary attempt and update spaced repetition data
 *
 * This function:
 * 1. Records the vocabulary attempt
 * 2. Analyzes any mistakes and records them
 * 3. Calculates spaced repetition parameters using SM-2
 * 4. Updates vocabulary progress
 * 5. Returns XP earned and progress updates
 */
export async function processVocabularyAttempt(
  db: PrismaClient,
  options: ProcessAttemptOptions
): Promise<ProcessAttemptResult> {
  const {
    studentId,
    wordId,
    sessionId,
    isCorrect,
    correctAnswer,
    studentAnswer,
    responseTime,
    hintsUsed,
    exerciseType,
    expectedTime = 5000
  } = options;

  const spacedRepEngine = new SpacedRepetitionEngine();
  const mistakeAnalyzer = new MistakePatternAnalyzer();

  // 1. Fetch the word for analysis
  const word = await db.vocabularyWord.findUnique({
    where: { id: wordId }
  });

  if (!word) {
    throw new Error(`Word not found: ${wordId}`);
  }

  // 2. Create the vocabulary attempt
  const attempt = await db.vocabularyAttempt.create({
    data: {
      sessionId,
      wordId,
      studentId,
      exerciseType,
      isCorrect,
      responseTime,
      hintsUsed
    }
  });

  // 3. Analyze mistakes if incorrect
  let mistakeTypes: MistakeType[] = [];
  let complexityWeight = 1.0;

  if (!isCorrect) {
    mistakeTypes = mistakeAnalyzer.analyzeMistake(
      word,
      correctAnswer,
      studentAnswer,
      word.language
    );

    // Calculate complexity weight for spaced repetition adjustment
    complexityWeight = mistakeAnalyzer.calculateComplexityWeight(
      mistakeTypes,
      word.language
    );

    // Record each mistake
    const languageComplexity = mistakeAnalyzer.getLanguageComplexity(word.language);

    for (const mistakeType of mistakeTypes) {
      let severity = 0.5; // Base severity

      // Adjust severity based on mistake type
      switch (mistakeType) {
        case 'ARTICLE_ERROR':
        case 'GENDER_ERROR':
          severity = 0.8 * languageComplexity.articleComplexity;
          break;
        case 'UMLAUT_ERROR':
          severity = 0.7 * languageComplexity.phoneticComplexity;
          break;
        case 'COMPOUND_ERROR':
          severity = 0.7 * languageComplexity.compoundWordComplexity;
          break;
        case 'CASE_ERROR':
          severity = 0.75 * languageComplexity.caseComplexity;
          break;
        case 'PHONETIC_CONFUSION':
          severity = 0.6;
          break;
        case 'VISUAL_CONFUSION':
        case 'SPELLING_ERROR':
          severity = 0.5;
          break;
        case 'CAPITALIZATION_ERROR':
          severity = 0.3;
          break;
        default:
          severity = 0.5;
      }

      await db.vocabularyMistake.create({
        data: {
          attemptId: attempt.id,
          studentId,
          wordId,
          mistakeType,
          correctAnswer,
          studentAnswer,
          severity,
          exerciseType,
          responseTime,
          hintsUsed,
          languageCode: word.language,
          metadata: {}
        }
      });
    }
  }

  // 4. Get or create vocabulary progress
  let progress = await db.vocabularyProgress.findUnique({
    where: {
      studentId_wordId: {
        studentId,
        wordId
      }
    }
  });

  if (!progress) {
    progress = await db.vocabularyProgress.create({
      data: {
        studentId,
        wordId,
        masteryLevel: 'NOT_LEARNED',
        correctAttempts: 0,
        totalAttempts: 0,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        lapseCount: 0,
        streakCount: 0
      }
    });
  }

  // 5. Convert response to SM-2 quality rating
  const quality: SM2Quality = spacedRepEngine.responseToQuality(
    isCorrect,
    hintsUsed,
    responseTime,
    expectedTime
  );

  // 6. Calculate time spent multiplier
  const speedRatio = responseTime / expectedTime;
  const timeSpentMultiplier = speedRatio > 1.5 ? 1.1 : (speedRatio < 0.5 ? 0.9 : 1.0);

  // 7. Calculate next review using SM-2 algorithm
  const sm2Result = spacedRepEngine.calculateNextReview(progress, quality, {
    languageComplexity: complexityWeight,
    mistakeTypeWeight: mistakeTypes.length > 0 ? 1.2 : 1.0, // Penalize multiple mistake types
    timeSpentMultiplier,
    minimumInterval: 1,
    maximumInterval: 365
  });

  // 8. Update streak
  let streakUpdated = false;
  let newStreakCount = progress.streakCount;

  if (isCorrect) {
    // Check if this continues the streak (reviewed within 1 day of nextReview)
    const now = new Date();
    if (progress.nextReview) {
      const daysSinceExpected = Math.floor(
        (now.getTime() - new Date(progress.nextReview).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceExpected <= 1) {
        newStreakCount += 1;
        streakUpdated = true;
      } else {
        // Streak broken
        newStreakCount = 1;
      }
    } else {
      // First review
      newStreakCount = 1;
      streakUpdated = true;
    }
  } else {
    // Failed - reset streak
    newStreakCount = 0;
  }

  // 9. Update vocabulary progress
  const updatedProgress = await db.vocabularyProgress.update({
    where: { id: progress.id },
    data: {
      masteryLevel: sm2Result.masteryLevel,
      correctAttempts: isCorrect ? progress.correctAttempts + 1 : progress.correctAttempts,
      totalAttempts: progress.totalAttempts + 1,
      lastSeen: new Date(),
      nextReview: sm2Result.nextReview,
      interval: sm2Result.interval,
      easeFactor: sm2Result.easeFactor,
      repetitions: sm2Result.repetitions,
      lapseCount: quality < 3 ? progress.lapseCount + 1 : progress.lapseCount,
      streakCount: newStreakCount
    }
  });

  // 10. Calculate XP earned
  const baseXP = 10;
  const streakBonus = spacedRepEngine.calculateStreakBonus(newStreakCount);
  const difficultyMultiplier = word.difficulty === 'BEGINNER' ? 1.0 :
                               word.difficulty === 'INTERMEDIATE' ? 1.5 : 2.0;
  const masteryBonus = sm2Result.masteryLevel === 'MASTERED' ? 1.5 :
                       sm2Result.masteryLevel === 'FAMILIAR' ? 1.2 : 1.0;

  const xpEarned = isCorrect ?
    Math.round(baseXP * difficultyMultiplier * masteryBonus * streakBonus) :
    0;

  return {
    attemptId: attempt.id,
    progress: {
      masteryLevel: updatedProgress.masteryLevel,
      nextReview: updatedProgress.nextReview!,
      interval: updatedProgress.interval,
      easeFactor: updatedProgress.easeFactor,
      repetitions: updatedProgress.repetitions,
      streakUpdated
    },
    mistakesRecorded: mistakeTypes.length,
    xpEarned
  };
}

/**
 * Get words due for review for a student
 *
 * @param db Prisma client
 * @param studentId Student ID
 * @param limit Maximum number of words (default: 10)
 * @returns Array of words with their progress
 */
export async function getWordsForReview(
  db: PrismaClient,
  studentId: string,
  limit: number = 10
) {
  const spacedRepEngine = new SpacedRepetitionEngine();

  // Fetch all vocabulary progress for the student
  const allProgress = await db.vocabularyProgress.findMany({
    where: { studentId },
    include: {
      word: true
    }
  });

  // Use spaced repetition engine to determine which words are due
  const wordsForReview = spacedRepEngine.getWordsForReview(allProgress, limit);

  return wordsForReview.map(progress => ({
    word: progress.word,
    progress: {
      masteryLevel: progress.masteryLevel,
      lastSeen: progress.lastSeen,
      nextReview: progress.nextReview,
      interval: progress.interval,
      streakCount: progress.streakCount,
      correctAttempts: progress.correctAttempts,
      totalAttempts: progress.totalAttempts
    }
  }));
}

/**
 * Get student weak areas based on recent attempts
 *
 * @param db Prisma client
 * @param studentId Student ID
 * @param limit Number of recent attempts to analyze (default: 50)
 * @returns Weak areas summary
 */
export async function getStudentWeakAreas(
  db: PrismaClient,
  studentId: string,
  limit: number = 50
) {
  const mistakeAnalyzer = new MistakePatternAnalyzer();

  // Fetch recent mistakes
  const mistakes = await db.vocabularyMistake.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      attempt: true
    }
  });

  // Fetch recent attempts for accuracy calculation
  const attempts = await db.vocabularyAttempt.findMany({
    where: { studentId },
    orderBy: { attemptedAt: 'desc' },
    take: limit
  });

  // Convert to mistake records format
  const mistakeRecords = mistakes.map(m => ({
    type: m.mistakeType as MistakeType,
    wordId: m.wordId,
    word: m.correctAnswer,
    correctAnswer: m.correctAnswer,
    studentAnswer: m.studentAnswer,
    timestamp: m.createdAt,
    exerciseType: m.exerciseType,
    responseTime: m.responseTime,
    hintsUsed: m.hintsUsed,
    severity: m.severity
  }));

  return mistakeAnalyzer.analyzeWeakAreas(studentId, mistakeRecords, attempts);
}

/**
 * Calculate optimal session size for a student
 *
 * @param db Prisma client
 * @param studentId Student ID
 * @returns Recommended number of words per session
 */
export async function calculateOptimalSessionSize(
  db: PrismaClient,
  studentId: string
): Promise<number> {
  const spacedRepEngine = new SpacedRepetitionEngine();

  // Get recent session statistics
  const recentAttempts = await db.vocabularyAttempt.findMany({
    where: { studentId },
    orderBy: { attemptedAt: 'desc' },
    take: 30
  });

  if (recentAttempts.length === 0) {
    return 10; // Default for new students
  }

  // Calculate average accuracy
  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  const averageAccuracy = (correctCount / recentAttempts.length) * 100;

  // Calculate average time per word (in seconds)
  const totalTime = recentAttempts.reduce((sum, a) => sum + a.responseTime, 0);
  const averageTimePerWord = (totalTime / recentAttempts.length) / 1000;

  return spacedRepEngine.calculateOptimalSessionSize(averageAccuracy, averageTimePerWord);
}
