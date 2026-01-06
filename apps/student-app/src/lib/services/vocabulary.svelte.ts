import { GERMAN_VOCABULARY } from '@educational-app/learning'
import type { VocabularyWord, VocabularyCategory } from '@educational-app/learning'

export type SessionMode = 'review' | 'new' | 'mixed'

export interface VocabularyExercise {
	id: string
	wordId: string
	word: VocabularyWord
	question: string
	options: Array<{ id: string; text: string; isCorrect: boolean }>
	correctAnswerId: string
}

export interface VocabularySession {
	id: string
	mode: SessionMode
	exercises: VocabularyExercise[]
	currentIndex: number
	answers: Array<{
		exerciseId: string
		selectedAnswerId: string
		isCorrect: boolean
		timeMs: number
	}>
	startedAt: number
}

/**
 * Vocabulary service for student app
 * Handles session management and exercise generation with mocked content
 */
class VocabularyServiceClass {
	// Store active session
	currentSession = $state<VocabularySession | null>(null)

	/**
	 * Start a new vocabulary session
	 */
	startSession(mode: SessionMode, wordCount: number = 10): VocabularySession {
		const sessionId = crypto.randomUUID()

		// Get words based on mode
		let selectedWords: VocabularyWord[]

		switch (mode) {
			case 'new':
				// Get random words that student hasn't seen (mock: just random)
				selectedWords = this.getRandomWords(wordCount)
				break
			case 'review':
				// Get words that need review (mock: just random)
				selectedWords = this.getRandomWords(wordCount)
				break
			case 'mixed':
				// Mix of new and review words
				selectedWords = this.getRandomWords(wordCount)
				break
			default:
				selectedWords = this.getRandomWords(wordCount)
		}

		// Generate exercises for each word
		const exercises = selectedWords.map((word) => this.generateExercise(word))

		this.currentSession = {
			id: sessionId,
			mode,
			exercises,
			currentIndex: 0,
			answers: [],
			startedAt: Date.now()
		}

		return this.currentSession
	}

	/**
	 * Get random words from vocabulary
	 */
	private getRandomWords(count: number): VocabularyWord[] {
		const shuffled = [...GERMAN_VOCABULARY].sort(() => Math.random() - 0.5)
		return shuffled.slice(0, Math.min(count, shuffled.length))
	}

	/**
	 * Generate a multiple choice exercise for a word
	 */
	private generateExercise(word: VocabularyWord): VocabularyExercise {
		const exerciseId = crypto.randomUUID()

		// Get 3 random incorrect options from other words
		const incorrectOptions = GERMAN_VOCABULARY.filter((w) => w.id !== word.id)
			.sort(() => Math.random() - 0.5)
			.slice(0, 3)
			.map((w) => ({
				id: crypto.randomUUID(),
				text: w.translation,
				isCorrect: false
			}))

		// Create correct option
		const correctOption = {
			id: crypto.randomUUID(),
			text: word.translation,
			isCorrect: true
		}

		// Shuffle all options
		const options = [...incorrectOptions, correctOption].sort(() => Math.random() - 0.5)

		return {
			id: exerciseId,
			wordId: word.id,
			word,
			question: `What does "${word.word}" mean?`,
			options,
			correctAnswerId: correctOption.id
		}
	}

	/**
	 * Submit an answer for the current exercise
	 */
	submitAnswer(exerciseId: string, selectedAnswerId: string, timeMs: number): {
		isCorrect: boolean
		correctAnswerId: string
		explanation?: string
	} {
		if (!this.currentSession) {
			throw new Error('No active session')
		}

		const exercise = this.currentSession.exercises.find((e) => e.id === exerciseId)
		if (!exercise) {
			throw new Error('Exercise not found')
		}

		const selectedOption = exercise.options.find((o) => o.id === selectedAnswerId)
		const isCorrect = selectedOption?.isCorrect ?? false

		// Store answer
		this.currentSession.answers.push({
			exerciseId,
			selectedAnswerId,
			isCorrect,
			timeMs
		})

		return {
			isCorrect,
			correctAnswerId: exercise.correctAnswerId,
			explanation: isCorrect
				? `Correct! "${exercise.word.word}" means "${exercise.word.translation}".`
				: `Incorrect. The correct answer is "${exercise.word.translation}".`
		}
	}

	/**
	 * Move to next exercise
	 */
	nextExercise(): boolean {
		if (!this.currentSession) return false

		this.currentSession.currentIndex++
		return this.currentSession.currentIndex < this.currentSession.exercises.length
	}

	/**
	 * Get current exercise
	 */
	getCurrentExercise(): VocabularyExercise | null {
		if (!this.currentSession) return null
		return this.currentSession.exercises[this.currentSession.currentIndex] || null
	}

	/**
	 * Check if session is complete
	 */
	isSessionComplete(): boolean {
		if (!this.currentSession) return false
		return this.currentSession.currentIndex >= this.currentSession.exercises.length
	}

	/**
	 * Get session results
	 */
	getSessionResults() {
		if (!this.currentSession) return null

		const totalQuestions = this.currentSession.exercises.length
		const correctAnswers = this.currentSession.answers.filter((a) => a.isCorrect).length
		const accuracy = Math.round((correctAnswers / totalQuestions) * 100)
		const totalTimeMs = this.currentSession.answers.reduce((sum, a) => sum + a.timeMs, 0)
		const avgTimePerQuestion = Math.round(totalTimeMs / totalQuestions / 1000) // seconds

		// Calculate XP earned (base 10 XP per question + accuracy bonus)
		const baseXP = totalQuestions * 10
		const accuracyBonus = Math.round((accuracy / 100) * baseXP)
		const speedBonus = avgTimePerQuestion < 5 ? 20 : 0
		const totalXP = baseXP + accuracyBonus + speedBonus

		return {
			sessionId: this.currentSession.id,
			mode: this.currentSession.mode,
			totalQuestions,
			correctAnswers,
			incorrectAnswers: totalQuestions - correctAnswers,
			accuracy,
			totalTimeMs,
			avgTimePerQuestion,
			xpEarned: totalXP,
			completedAt: new Date().toISOString()
		}
	}

	/**
	 * Clear current session
	 */
	clearSession() {
		this.currentSession = null
	}

	/**
	 * Get category statistics (mock data for now)
	 */
	getCategoryStats(): Array<{
		category: VocabularyCategory
		totalWords: number
		learnedWords: number
		progress: number
	}> {
		const categories: VocabularyCategory[] = [
			'ANIMALS',
			'COLORS',
			'NUMBERS',
			'FAMILY',
			'OBJECTS',
			'FOOD'
		]

		return categories.map((category) => {
			const categoryWords = GERMAN_VOCABULARY.filter((w) => w.category === category)
			const totalWords = categoryWords.length
			const learnedWords = Math.floor(Math.random() * totalWords) // Mock learned count

			return {
				category,
				totalWords,
				learnedWords,
				progress: Math.round((learnedWords / totalWords) * 100)
			}
		})
	}
}

// Create singleton instance
export const vocabularyService = new VocabularyServiceClass()
