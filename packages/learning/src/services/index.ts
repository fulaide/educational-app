export { LearningService } from './LearningService'
export { VocabularyService } from './VocabularyService'
export { ProgressService } from './ProgressService'
export { AchievementService } from './AchievementService'

// Create centralized service instances for easy app-wide access
export const learningService = new LearningService()
export const vocabularyService = new VocabularyService()
export const progressService = new ProgressService()
export const achievementService = new AchievementService()

// Service factory for custom API endpoints
export const createServices = (baseUrl: string) => ({
  learning: new LearningService(`${baseUrl}/learning`),
  vocabulary: new VocabularyService(`${baseUrl}/vocabulary`),
  progress: new ProgressService(`${baseUrl}/progress`),
  achievement: new AchievementService(`${baseUrl}/achievements`)
})