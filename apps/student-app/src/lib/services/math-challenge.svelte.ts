import {
	type MathProblem,
	type MathProblemConfig,
	type MathSession,
	type MathSessionResults,
	type MathDifficulty,
	type MathOperation,
	type GermanFeedback,
	recordAnswer,
	calculateResults,
	getCurrentProblem,
	isSessionComplete,
	advanceToNextProblem
} from '@educational-app/learning'

export interface MathChallengeState {
	session: MathSession | null
	currentInput: string
	isLoading: boolean
	feedback: GermanFeedback | null
	showFeedback: boolean
	problemStartTime: number
	results: MathSessionResults | null
}

/**
 * Math Challenge Service
 * Manages math challenge sessions with reactive state
 */
class MathChallengeServiceClass {
	// Reactive state
	currentSession = $state<MathSession | null>(null)
	currentInput = $state('')
	isLoading = $state(false)
	feedback = $state<GermanFeedback | null>(null)
	showFeedback = $state(false)
	problemStartTime = $state(Date.now())
	results = $state<MathSessionResults | null>(null)

	// API settings
	private apiBaseUrl = '/api/math'

	/**
	 * Start a new math challenge session
	 * Uses Claude API for problem generation
	 */
	async startSession(
		studentId: string,
		config: {
			difficulty: MathDifficulty
			count: number
			includeZehneruebergang: boolean
			operations?: MathOperation[]
		}
	): Promise<MathSession> {
		this.isLoading = true
		this.feedback = null
		this.showFeedback = false
		this.results = null
		this.currentInput = ''

		console.log('[MathChallengeService] Starting session with config:', config)

		try {
			const response = await fetch(`${this.apiBaseUrl}/generate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					count: config.count,
					difficulty: config.difficulty,
					includeZehneruebergang: config.includeZehneruebergang,
					operations: config.operations
				})
			})

			console.log('[MathChallengeService] API response status:', response.status)

			if (!response.ok) {
				const errorText = await response.text()
				console.error('[MathChallengeService] API error response:', errorText)
				throw new Error(`API error: ${response.status} - ${errorText}`)
			}

			const data = await response.json()
			console.log('[MathChallengeService] API response data:', data)

			if (!data.problems || data.problems.length === 0) {
				throw new Error('No problems returned from API')
			}

			// Create session with API-generated problems
			const session: MathSession = {
				id: crypto.randomUUID(),
				studentId,
				problems: data.problems,
				currentIndex: 0,
				answers: [],
				startedAt: new Date(),
				config: {
					difficulty: config.difficulty,
					count: config.count,
					includeZehneruebergang: config.includeZehneruebergang,
					operations: config.operations
				}
			}

			console.log('[MathChallengeService] Session created:', session.id)
			this.currentSession = session
			this.problemStartTime = Date.now()
			return session
		} catch (error) {
			console.error('[MathChallengeService] Error starting session:', error)
			throw error // Re-throw so caller can handle
		} finally {
			this.isLoading = false
		}
	}

	/**
	 * Get the current problem
	 */
	getCurrentProblem(): MathProblem | null {
		if (!this.currentSession) return null
		return getCurrentProblem(this.currentSession)
	}

	/**
	 * Add a digit to the current input
	 */
	addDigit(digit: string) {
		if (this.showFeedback) return
		if (this.currentInput.length < 3) {
			this.currentInput += digit
		}
	}

	/**
	 * Remove the last digit from the current input
	 */
	deleteDigit() {
		if (this.showFeedback) return
		this.currentInput = this.currentInput.slice(0, -1)
	}

	/**
	 * Clear the current input
	 */
	clearInput() {
		this.currentInput = ''
	}

	/**
	 * Submit the current answer
	 * Uses Claude API for feedback generation
	 */
	async submitAnswer(): Promise<GermanFeedback | null> {
		if (!this.currentSession || !this.currentInput) return null

		const currentProblem = this.getCurrentProblem()
		if (!currentProblem) return null

		this.isLoading = true

		try {
			const answer = parseInt(this.currentInput, 10)
			const timeSpent = Date.now() - this.problemStartTime

			// Get feedback from Claude API
			const response = await fetch(`${this.apiBaseUrl}/evaluate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					problem: currentProblem,
					userAnswer: answer
				})
			})

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`)
			}

			const apiFeedback: GermanFeedback = await response.json()
			console.log('[MathChallenge] Feedback received:', apiFeedback)

			// Record the answer in the session (does NOT advance to next problem)
			const result = recordAnswer(this.currentSession, answer, timeSpent)
			this.currentSession = result.session
			this.feedback = apiFeedback
			this.showFeedback = true

			return apiFeedback
		} finally {
			this.isLoading = false
		}
	}

	/**
	 * Move to the next problem
	 * Advances the session index and resets UI state
	 */
	nextProblem(): boolean {
		if (!this.currentSession) return false

		// Check if all problems have been answered
		if (isSessionComplete(this.currentSession)) {
			this.results = calculateResults(this.currentSession)
			return false
		}

		// Advance to next problem
		this.currentSession = advanceToNextProblem(this.currentSession)

		// Reset UI state for next problem
		this.currentInput = ''
		this.feedback = null
		this.showFeedback = false
		this.problemStartTime = Date.now()

		return true
	}

	/**
	 * Check if the session is complete
	 */
	isComplete(): boolean {
		if (!this.currentSession) return false
		return isSessionComplete(this.currentSession)
	}

	/**
	 * Get session results
	 */
	getResults(): MathSessionResults | null {
		if (!this.currentSession) return null

		if (!this.results && isSessionComplete(this.currentSession)) {
			this.results = calculateResults(this.currentSession)
		}

		return this.results
	}

	/**
	 * Get session progress
	 */
	getProgress(): { current: number; total: number; percentage: number } {
		if (!this.currentSession) {
			return { current: 0, total: 0, percentage: 0 }
		}

		const current = this.currentSession.currentIndex + 1
		const total = this.currentSession.problems.length
		const percentage = Math.round((this.currentSession.currentIndex / total) * 100)

		return { current, total, percentage }
	}

	/**
	 * Clear the current session
	 */
	clearSession() {
		this.currentSession = null
		this.currentInput = ''
		this.isLoading = false
		this.feedback = null
		this.showFeedback = false
		this.problemStartTime = Date.now()
		this.results = null
	}
}

// Create singleton instance
export const mathChallengeService = new MathChallengeServiceClass()
