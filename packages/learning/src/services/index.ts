// Import dependencies first
import { languageProviderRegistry as registry } from './LanguageProviderRegistry'
import { GermanLanguageProvider } from '../providers/german/GermanLanguageProvider'

// Export services
export { LearningService } from './LearningService'
export { VocabularyService } from './VocabularyService'
export { ProgressService } from './ProgressService'
export { AchievementService } from './AchievementService'
export { LanguageProviderRegistry, languageProviderRegistry } from './LanguageProviderRegistry'
export { TypingEngine } from './TypingEngine'
export type { CharacterState, WordState, TypingState, TypingMetrics, ErrorPosition } from './TypingEngine'
export { HintSystem } from './HintSystem'
export type { HintLevel, HintState, HintSystemOptions } from './HintSystem'

// Register German provider by default
registry.registerConstructor('de', GermanLanguageProvider)

// Create centralized service instances for easy app-wide access
export const learningService = new LearningService()
export const vocabularyService = new VocabularyService('/api/vocabulary', registry)
export const progressService = new ProgressService()
export const achievementService = new AchievementService()

// Service factory for custom API endpoints
export const createServices = (baseUrl: string, withProviders = true) => ({
  learning: new LearningService(`${baseUrl}/learning`),
  vocabulary: new VocabularyService(
    `${baseUrl}/vocabulary`,
    withProviders ? registry : undefined
  ),
  progress: new ProgressService(`${baseUrl}/progress`),
  achievement: new AchievementService(`${baseUrl}/achievements`)
})