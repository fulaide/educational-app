import type { 
  VocabularyWord, 
  VocabularyProgress,
  VocabularySession,
  VocabularyAttempt,
  MasteryLevel,
  VocabularyCategory
} from '../types'
import { GERMAN_VOCABULARY } from '../data/german-vocabulary'

export class VocabularyService {
  private apiBase: string

  constructor(apiBase = '/api/vocabulary') {
    this.apiBase = apiBase
  }

  /**
   * Get vocabulary words for a specific category and difficulty
   */
  async getVocabularyWords(
    category?: VocabularyCategory,
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    limit = 20
  ): Promise<VocabularyWord[]> {
    try {
      const params = new URLSearchParams({
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        limit: limit.toString()
      })

      const response = await fetch(`${this.apiBase}/words?${params}`)
      if (!response.ok) throw new Error('Failed to fetch vocabulary words')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching vocabulary words:', error)
      return this.getMockVocabularyWords(category, difficulty, limit)
    }
  }

  /**
   * Get student's vocabulary progress for spaced repetition
   */
  async getStudentVocabularyProgress(
    studentId: string,
    category?: VocabularyCategory
  ): Promise<VocabularyProgress[]> {
    try {
      const params = new URLSearchParams({
        studentId,
        ...(category && { category })
      })

      const response = await fetch(`${this.apiBase}/progress?${params}`)
      if (!response.ok) throw new Error('Failed to fetch vocabulary progress')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error)
      return this.getMockVocabularyProgress(studentId, category)
    }
  }

  /**
   * Get words due for review based on spaced repetition algorithm
   */
  async getWordsForReview(
    studentId: string,
    limit = 10
  ): Promise<Array<VocabularyWord & { progress: VocabularyProgress }>> {
    try {
      const response = await fetch(
        `${this.apiBase}/review/${studentId}?limit=${limit}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch review words')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching review words:', error)
      return this.getMockReviewWords(studentId, limit)
    }
  }

  /**
   * Start a new vocabulary learning session
   */
  async startVocabularySession(
    studentId: string,
    sessionType: 'REVIEW' | 'NEW_WORDS' | 'MIXED',
    category?: VocabularyCategory
  ): Promise<VocabularySession> {
    try {
      const response = await fetch(`${this.apiBase}/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId, 
          sessionType, 
          category 
        })
      })
      
      if (!response.ok) throw new Error('Failed to start vocabulary session')
      
      return await response.json()
    } catch (error) {
      console.error('Error starting vocabulary session:', error)
      return this.createMockVocabularySession(studentId, sessionType, category)
    }
  }

  /**
   * Submit vocabulary attempt and update spaced repetition data
   */
  async submitVocabularyAttempt(
    attemptData: Omit<VocabularyAttempt, 'id' | 'attemptedAt'>
  ): Promise<{ 
    progress: VocabularyProgress, 
    nextReview: Date,
    masteryUpdate?: { oldLevel: MasteryLevel, newLevel: MasteryLevel }
  }> {
    try {
      const response = await fetch(`${this.apiBase}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attemptData)
      })
      
      if (!response.ok) throw new Error('Failed to submit vocabulary attempt')
      
      return await response.json()
    } catch (error) {
      console.error('Error submitting vocabulary attempt:', error)
      return this.calculateMockSpacedRepetition(attemptData)
    }
  }

  /**
   * Get vocabulary learning analytics for student
   */
  async getVocabularyAnalytics(studentId: string): Promise<{
    totalWords: number
    wordsByMastery: Record<MasteryLevel, number>
    wordsByCategory: Record<VocabularyCategory, number>
    averageAccuracy: number
    currentStreak: number
    wordsReviewedToday: number
    estimatedVocabularySize: number
  }> {
    try {
      const response = await fetch(`${this.apiBase}/analytics/${studentId}`)
      if (!response.ok) throw new Error('Failed to fetch vocabulary analytics')
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching vocabulary analytics:', error)
      return this.getMockVocabularyAnalytics(studentId)
    }
  }

  /**
   * Complete vocabulary session and get results
   */
  async completeVocabularySession(
    sessionId: string
  ): Promise<{
    session: VocabularySession
    results: {
      wordsReviewed: number
      accuracy: number
      timeSpent: number
      masteryUpdates: Array<{ wordId: string, oldLevel: MasteryLevel, newLevel: MasteryLevel }>
    }
  }> {
    try {
      const response = await fetch(`${this.apiBase}/session/${sessionId}/complete`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to complete vocabulary session')
      
      return await response.json()
    } catch (error) {
      console.error('Error completing vocabulary session:', error)
      return this.getMockSessionResults(sessionId)
    }
  }

  // Mock data methods for development/offline use
  private getMockVocabularyWords(
    category?: VocabularyCategory,
    difficulty?: string,
    limit = 20
  ): VocabularyWord[] {
    const allWords = Object.entries(GERMAN_VOCABULARY)
      .flatMap(([cat, words]) => 
        category && cat !== category ? [] :
        words.map(word => ({
          ...word,
          id: `word-${word.word.toLowerCase()}`,
          organizationId: 'org-1',
          category: cat as VocabularyCategory,
          difficulty: (word.difficulty || 'BEGINNER') as DifficultyLevel,
          frequency: word.frequency || 5,
          tags: word.tags || [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system'
        }))
      )

    return allWords
      .filter(word => !difficulty || word.difficulty === difficulty)
      .slice(0, limit)
  }

  private getMockVocabularyProgress(
    studentId: string,
    category?: VocabularyCategory
  ): VocabularyProgress[] {
    const words = this.getMockVocabularyWords(category, undefined, 50)
    
    return words.map(word => ({
      id: `progress-${studentId}-${word.id}`,
      studentId,
      wordId: word.id,
      masteryLevel: ['NOT_LEARNED', 'LEARNING', 'FAMILIAR', 'MASTERED'][
        Math.floor(Math.random() * 4)
      ] as MasteryLevel,
      correctAttempts: Math.floor(Math.random() * 10),
      totalAttempts: Math.floor(Math.random() * 15) + 1,
      lastSeen: new Date(Date.now() - Math.random() * 86400000 * 7), // Last week
      nextReview: new Date(Date.now() + Math.random() * 86400000 * 3), // Next 3 days
      streakCount: Math.floor(Math.random() * 5),
      interval: Math.floor(Math.random() * 7) + 1,
      easeFactor: 2.5 - Math.random() * 0.5,
      repetitions: Math.floor(Math.random() * 5),
      lapseCount: Math.floor(Math.random() * 2),
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 30),
      updatedAt: new Date()
    }))
  }

  private getMockReviewWords(
    studentId: string,
    limit: number
  ): Array<VocabularyWord & { progress: VocabularyProgress }> {
    const words = this.getMockVocabularyWords(undefined, undefined, limit)
    const progress = this.getMockVocabularyProgress(studentId)
    
    return words.map(word => ({
      ...word,
      progress: progress.find(p => p.wordId === word.id) || progress[0]
    }))
  }

  private createMockVocabularySession(
    studentId: string,
    sessionType: string,
    category?: VocabularyCategory
  ): VocabularySession {
    const reviewWords = this.getMockVocabularyWords(category, undefined, 10)
    
    return {
      id: `session-${Date.now()}`,
      studentId,
      category: category || undefined,
      difficulty: 'BEGINNER',
      wordsToReview: reviewWords.map(w => w.id),
      wordsCompleted: [],
      sessionType: sessionType as 'REVIEW' | 'NEW_WORDS' | 'MIXED',
      startedAt: new Date(),
      totalTimeSpent: 0,
      averageAccuracy: 0
    }
  }

  private calculateMockSpacedRepetition(
    attemptData: Omit<VocabularyAttempt, 'id' | 'attemptedAt'>
  ) {
    const baseInterval = attemptData.isCorrect ? 2 : 1
    const nextReview = new Date(Date.now() + baseInterval * 86400000)
    
    const oldLevel: MasteryLevel = 'LEARNING'
    const newLevel: MasteryLevel = attemptData.isCorrect ? 'FAMILIAR' : 'LEARNING'
    
    return {
      progress: {
        id: `progress-${attemptData.studentId}-${attemptData.wordId}`,
        studentId: attemptData.studentId,
        wordId: attemptData.wordId,
        masteryLevel: newLevel,
        correctAttempts: attemptData.isCorrect ? 1 : 0,
        totalAttempts: 1,
        lastSeen: new Date(),
        nextReview,
        streakCount: attemptData.isCorrect ? 1 : 0,
        interval: baseInterval,
        easeFactor: 2.5,
        repetitions: 1,
        lapseCount: attemptData.isCorrect ? 0 : 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      nextReview,
      ...(oldLevel !== newLevel && { 
        masteryUpdate: { oldLevel, newLevel } 
      })
    }
  }

  private getMockVocabularyAnalytics(_studentId: string) {
    return {
      totalWords: 150,
      wordsByMastery: {
        NOT_LEARNED: 80,
        LEARNING: 40,
        FAMILIAR: 20,
        MASTERED: 10
      } as Record<MasteryLevel, number>,
      wordsByCategory: {
        ANIMALS: 15,
        COLORS: 12,
        NUMBERS: 18,
        FAMILY: 10,
        OBJECTS: 20,
        FOOD: 25,
        CLOTHING: 8,
        BODY_PARTS: 12,
        WEATHER: 6,
        TIME: 10,
        PLACES: 9,
        ACTIONS: 5
      } as Record<VocabularyCategory, number>,
      averageAccuracy: 78.5,
      currentStreak: 5,
      wordsReviewedToday: 12,
      estimatedVocabularySize: 150
    }
  }

  private getMockSessionResults(sessionId: string) {
    return {
      session: {
        id: sessionId,
        studentId: 'student-1',
        category: 'ANIMALS' as VocabularyCategory,
        difficulty: 'BEGINNER' as const,
        wordsToReview: ['word-1', 'word-2', 'word-3'],
        wordsCompleted: ['word-1', 'word-2', 'word-3'],
        sessionType: 'MIXED',
        startedAt: new Date(Date.now() - 300000),
        completedAt: new Date(),
        totalTimeSpent: 300,
        averageAccuracy: 80.0
      },
      results: {
        wordsReviewed: 10,
        accuracy: 80.0,
        timeSpent: 300,
        masteryUpdates: [
          { wordId: 'word-1', oldLevel: 'LEARNING' as MasteryLevel, newLevel: 'FAMILIAR' as MasteryLevel }
        ]
      }
    }
  }
}