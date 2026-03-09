/**
 * BlendStateController
 *
 * Manages a set of Rive number inputs (0–100 mix amounts) that each represent
 * one named state within a direct-blend layer. The neutral/idle base state has
 * no input — it is visible whenever all mix inputs are at 0.
 *
 * Calling set('happy') smoothly lerps 'happy' mix → 100 while lerping any
 * previously active state → 0. Because each state has its own dedicated input,
 * you can crossfade between ANY two states directly without passing through
 * intermediate blend positions.
 *
 * Usage:
 *   const ctrl = new BlendStateController(inputsMap, 0.2);
 *   ctrl.set('happy');      // smoothly crossfade to happy
 *   ctrl.set('neutral');    // smoothly return to base (all zeros)
 *   ctrl.snap('sad');       // instant jump, no lerp
 *   ctrl.destroy();         // call in onDestroy
 */

import type { StateMachineInput } from '@rive-app/canvas';

const NEUTRAL = 'neutral';

export class BlendStateController {
	/** Current mix values (0–100) for each non-neutral state being lerped. */
	private activeMixes = new Map<string, number>();
	/** State we are lerping toward. null = neutral (all inputs at 0). */
	private targetState: string | null = null;
	private frameId: number | null = null;

	/**
	 * @param inputs  Map of state name → Rive StateMachineInput (mix 0–100).
	 *                Does NOT include neutral — neutral has no dedicated input.
	 * @param speed   Lerp factor per frame (0–1). Higher = faster transition.
	 */
	constructor(
		private readonly inputs: Map<string, StateMachineInput>,
		public speed: number = 0.2
	) {
		this.tick();
	}

	/** Smoothly crossfade to a named state. 'neutral' returns to the base (all zeros). */
	set(stateName: string): void {
		const target = stateName === NEUTRAL || stateName === '' ? null : stateName;
		if (target === this.targetState) return;
		this.targetState = target;
		// Seed target into activeMixes at 0 so it starts lerping up this frame
		if (target !== null && !this.activeMixes.has(target)) {
			this.activeMixes.set(target, 0);
		}
	}

	/** Instantly jump to a state with no interpolation. */
	snap(stateName: string): void {
		const target = stateName === NEUTRAL || stateName === '' ? null : stateName;
		// Zero out all currently active inputs
		for (const [state] of this.activeMixes) {
			const input = this.inputs.get(state);
			if (input) input.value = 0;
		}
		this.activeMixes.clear();
		this.targetState = target;
		if (target !== null) {
			this.activeMixes.set(target, 100);
			const input = this.inputs.get(target);
			if (input) input.value = 100;
		}
	}

	/** The currently targeted state name ('neutral' when in base state). */
	get currentState(): string {
		return this.targetState ?? NEUTRAL;
	}

	private tick = (): void => {
		const toRemove: string[] = [];

		for (const [state, mix] of this.activeMixes) {
			const goal = state === this.targetState ? 100 : 0;
			const diff = goal - mix;
			const newMix = Math.abs(diff) > 0.05 ? mix + diff * this.speed : goal;
			this.activeMixes.set(state, newMix);

			const input = this.inputs.get(state);
			if (input) input.value = newMix;

			if (newMix === 0 && state !== this.targetState) {
				toRemove.push(state);
			}
		}

		// Ensure target is seeded (may have been added by set() after last tick)
		if (this.targetState !== null && !this.activeMixes.has(this.targetState)) {
			this.activeMixes.set(this.targetState, 0);
		}

		for (const state of toRemove) {
			this.activeMixes.delete(state);
		}

		this.frameId = requestAnimationFrame(this.tick);
	};

	destroy(): void {
		if (this.frameId !== null) {
			cancelAnimationFrame(this.frameId);
			this.frameId = null;
		}
	}
}
