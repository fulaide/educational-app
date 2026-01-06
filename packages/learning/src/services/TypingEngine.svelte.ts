/**
 * Reactive Typing Engine - Svelte 5 version
 *
 * This is a reactive wrapper around the core TypingEngine that uses Svelte 5's
 * $state runes to ensure proper reactivity.
 */

import { TypingEngine } from './TypingEngine.js'
import type { TypingState, WordState, CharacterState, TypingMetrics } from './TypingEngine.js'

export class ReactiveTypingEngine {
	private engine: TypingEngine

	// Reactive state - these will trigger re-renders when changed
	public state = $state<TypingState>() as TypingState

	constructor(text: string) {
		this.engine = new TypingEngine(text)
		this.state = this.engine.getState()
	}

	/**
	 * Process a single character input
	 */
	public processInput(char: string) {
		const result = this.engine.processInput(char)
		// Update reactive state
		this.state = this.engine.getState()
		return result
	}

	/**
	 * Handle backspace
	 */
	public handleBackspace(): boolean {
		const didDelete = this.engine.handleBackspace()
		if (didDelete) {
			// Update reactive state
			this.state = this.engine.getState()
		}
		return didDelete
	}

	/**
	 * Get current word being typed
	 */
	public getCurrentWord(): WordState {
		// Access from reactive state to ensure proper reactivity
		return this.state.words[this.state.currentWordIndex] || this.state.words[this.state.words.length - 1]
	}

	/**
	 * Get current character being typed
	 */
	public getCurrentChar(): CharacterState | null {
		// Access from reactive state to ensure proper reactivity
		const word = this.getCurrentWord()
		return word?.characters[word.characters.findIndex(c => c.isCorrect === null)] || null
	}

	/**
	 * Calculate current typing metrics
	 */
	public getMetrics(): TypingMetrics {
		return this.engine.getMetrics()
	}

	/**
	 * Check if typing is complete
	 */
	public isComplete(): boolean {
		return this.engine.isComplete()
	}

	/**
	 * Get progress percentage
	 */
	public getProgress(): number {
		return this.engine.getProgress()
	}

	/**
	 * Reset the typing engine with new text
	 */
	public reset(text?: string): void {
		this.engine.reset(text)
		this.state = this.engine.getState()
	}

	/**
	 * Calculate XP earned based on performance
	 */
	public calculateXP(baseXP: number = 50): number {
		return this.engine.calculateXP(baseXP)
	}

	/**
	 * Check if achievements should be unlocked
	 */
	public checkAchievements(): string[] {
		return this.engine.checkAchievements()
	}

	/**
	 * Get error positions for analytics
	 */
	public getErrorPositions() {
		return this.engine.getErrorPositions()
	}

	/**
	 * Get word timings for analytics
	 */
	public getWordTimings() {
		return this.engine.getWordTimings()
	}
}
