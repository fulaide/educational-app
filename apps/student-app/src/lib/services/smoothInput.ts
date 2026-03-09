/**
 * SmoothInput
 *
 * Wraps a Rive StateMachineInput and lerps its value toward a target each
 * animation frame. Designed for 1D-Blend inputs (e.g. mouth_emotions,
 * eye_emotions) where the Rive layer interpolates between clip poses based
 * on the float value — giving smooth crossfades without any transition
 * arrows in the state machine.
 *
 * NOT suitable for discrete snap inputs (e.g. viseme) where intermediate
 * values would trigger wrong shapes.
 *
 * Usage:
 *   const smooth = new SmoothInput(stateMachineInput, 0.2);
 *   smooth.set(2);   // lerps toward 2 over subsequent frames
 *   smooth.destroy(); // call in onDestroy
 */

import type { StateMachineInput } from '@rive-app/canvas';

export class SmoothInput {
	private current: number;
	private target: number;
	private frameId: number | null = null;

	/**
	 * @param input  The Rive StateMachineInput to drive.
	 * @param speed  Lerp factor per frame (0–1). Higher = faster transition.
	 *               0.15 ≈ slow/dreamy, 0.25 ≈ snappy but smooth.
	 */
	constructor(
		private readonly input: StateMachineInput,
		public speed: number = 0.2
	) {
		this.current = (input.value as number) ?? 0;
		this.target = this.current;
		this.tick();
	}

	/** Smoothly transition to a new target value. */
	set(value: number): void {
		this.target = value;
	}

	/** Jump instantly to a value with no interpolation. */
	snap(value: number): void {
		this.target = value;
		this.current = value;
		this.input.value = value;
	}

	/** Current interpolated value (read-only). */
	get value(): number {
		return this.current;
	}

	private tick = (): void => {
		const diff = this.target - this.current;

		if (Math.abs(diff) > 0.001) {
			this.current += diff * this.speed;
		} else {
			this.current = this.target;
		}

		this.input.value = this.current;
		this.frameId = requestAnimationFrame(this.tick);
	};

	destroy(): void {
		if (this.frameId !== null) {
			cancelAnimationFrame(this.frameId);
			this.frameId = null;
		}
	}
}
