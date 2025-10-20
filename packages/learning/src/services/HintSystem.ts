/**
 * Hint System - Progressive 3-level hint management
 *
 * Provides progressive hints for typing challenges:
 * - Level 1: Keyboard zone hint (after 3 errors)
 * - Level 2: Finger position hint (after 5 errors)
 * - Level 3: Direct key highlight (after 7 errors)
 */

import type { KeyDefinition, KeyZone, KeyFinger } from '../data/qwertz-keyboard-layout'
import { findKeyForChar } from '../data/qwertz-keyboard-layout'

export type HintLevel = 0 | 1 | 2 | 3

export interface HintState {
  level: HintLevel
  errorCount: number
  zone?: KeyZone
  finger?: KeyFinger
  key?: string
  message?: string
}

export interface HintSystemOptions {
  level1Threshold?: number // errors before level 1 hint
  level2Threshold?: number // errors before level 2 hint
  level3Threshold?: number // errors before level 3 hint
  enabled?: boolean
}

export class HintSystem {
  private static readonly DEFAULT_OPTIONS: Required<HintSystemOptions> = {
    level1Threshold: 3,
    level2Threshold: 5,
    level3Threshold: 7,
    enabled: true
  }

  private options: Required<HintSystemOptions>
  private state: HintState
  private currentChar: string | null = null
  private currentKeyDef: KeyDefinition | null = null

  constructor(options: HintSystemOptions = {}) {
    this.options = { ...HintSystem.DEFAULT_OPTIONS, ...options }
    this.state = {
      level: 0,
      errorCount: 0
    }
  }

  /**
   * Set the current character being typed
   */
  public setCurrentChar(char: string | null): void {
    this.currentChar = char
    this.currentKeyDef = char ? findKeyForChar(char) : null

    // Reset hint level when character changes
    this.resetLevel()
  }

  /**
   * Record an error and potentially escalate hint level
   */
  public recordError(): HintState {
    if (!this.options.enabled || !this.currentKeyDef) {
      return this.state
    }

    this.state.errorCount++

    // Determine hint level based on error count
    if (this.state.errorCount >= this.options.level3Threshold) {
      this.activateLevel3()
    } else if (this.state.errorCount >= this.options.level2Threshold) {
      this.activateLevel2()
    } else if (this.state.errorCount >= this.options.level1Threshold) {
      this.activateLevel1()
    }

    return this.state
  }

  /**
   * Record a correct input (resets error count for current character)
   */
  public recordCorrect(): void {
    this.state.errorCount = 0
    this.state.level = 0
    this.state.zone = undefined
    this.state.finger = undefined
    this.state.key = undefined
    this.state.message = undefined
  }

  /**
   * Activate Level 1: Keyboard Zone Hint
   */
  private activateLevel1(): void {
    if (this.state.level < 1 && this.currentKeyDef) {
      this.state.level = 1
      this.state.zone = this.currentKeyDef.zone
      this.state.message = this.getZoneMessage(this.currentKeyDef.zone)
    }
  }

  /**
   * Activate Level 2: Finger Position Hint
   */
  private activateLevel2(): void {
    if (this.state.level < 2 && this.currentKeyDef) {
      this.state.level = 2
      this.state.finger = this.currentKeyDef.finger
      this.state.message = this.getFingerMessage(this.currentKeyDef.finger)
    }
  }

  /**
   * Activate Level 3: Direct Key Highlight
   */
  private activateLevel3(): void {
    if (this.state.level < 3 && this.currentKeyDef) {
      this.state.level = 3
      this.state.key = this.currentKeyDef.key
      this.state.message = `Press the "${this.currentChar}" key!`
    }
  }

  /**
   * Get zone hint message
   */
  private getZoneMessage(zone: KeyZone): string {
    switch (zone) {
      case 'left':
        return 'Try using your left hand'
      case 'right':
        return 'Try using your right hand'
      case 'center':
        return 'Use your thumbs for the space bar'
    }
  }

  /**
   * Get finger hint message
   */
  private getFingerMessage(finger: KeyFinger): string {
    const fingerMap: Record<KeyFinger, string> = {
      'left-pinky': 'Use your left pinky finger',
      'left-ring': 'Use your left ring finger',
      'left-middle': 'Use your left middle finger',
      'left-index': 'Use your left index finger',
      'right-index': 'Use your right index finger',
      'right-middle': 'Use your right middle finger',
      'right-ring': 'Use your right ring finger',
      'right-pinky': 'Use your right pinky finger',
      'thumb': 'Use your thumbs'
    }
    return fingerMap[finger]
  }

  /**
   * Reset hint level (when character changes)
   */
  private resetLevel(): void {
    this.state.level = 0
    this.state.errorCount = 0
    this.state.zone = undefined
    this.state.finger = undefined
    this.state.key = undefined
    this.state.message = undefined
  }

  /**
   * Get current hint state
   */
  public getState(): HintState {
    return { ...this.state }
  }

  /**
   * Check if hints are enabled
   */
  public isEnabled(): boolean {
    return this.options.enabled
  }

  /**
   * Enable or disable hints
   */
  public setEnabled(enabled: boolean): void {
    this.options.enabled = enabled
    if (!enabled) {
      this.resetLevel()
    }
  }

  /**
   * Get hint usage statistics
   */
  public getStats(): {
    level1Used: number
    level2Used: number
    level3Used: number
    totalHintsUsed: number
  } {
    // This would need to track usage over time
    // For now, return based on current state
    return {
      level1Used: this.state.level >= 1 ? 1 : 0,
      level2Used: this.state.level >= 2 ? 1 : 0,
      level3Used: this.state.level >= 3 ? 1 : 0,
      totalHintsUsed: this.state.level
    }
  }

  /**
   * Reset all hint statistics
   */
  public reset(): void {
    this.state = {
      level: 0,
      errorCount: 0
    }
    this.currentChar = null
    this.currentKeyDef = null
  }

  /**
   * Update hint thresholds
   */
  public updateThresholds(options: Partial<HintSystemOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * Check if a hint should be shown for current state
   */
  public shouldShowHint(): boolean {
    return this.options.enabled && this.state.level > 0
  }

  /**
   * Get hint level name
   */
  public getLevelName(level: HintLevel = this.state.level): string {
    switch (level) {
      case 0: return 'No hint'
      case 1: return 'Zone hint'
      case 2: return 'Finger hint'
      case 3: return 'Key hint'
    }
  }
}
