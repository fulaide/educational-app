/**
 * Lip Sync Controller
 *
 * Synchronizes audio playback with Rive state machine inputs.
 * Uses requestAnimationFrame for frame-accurate viseme updates.
 *
 * Each viseme is driven by a dedicated mix input (0–100). When a viseme
 * activates, its input snaps to 100; when it ends the input snaps back to 0.
 * Idle (index 0) has no input — it is the base state when all mixes are 0.
 */

import type { StateMachineInput } from '@rive-app/canvas';

export interface TimedViseme {
	time: number; // seconds from audio start
	viseme: number; // viseme index (0=idle, 1–9 = active shapes)
	duration: number; // seconds this shape is held
}

export interface LipSyncControllerOptions {
	/** Map of viseme index (1–9) → Rive mix input. Index 0 (idle) has no input. */
	visemeInputs: Map<number, StateMachineInput>;
	visemes: TimedViseme[];
	audio: HTMLAudioElement;
	onVisemeChange?: (viseme: number) => void;
	/**
	 * Seconds to look ahead when sampling visemes. Compensates for rAF + render pipeline
	 * latency (~16-32ms) and OS audio output latency (~20-50ms). Default: 0.075 (75ms).
	 * Increase if mouth moves after the sound; decrease if mouth moves before.
	 */
	offset?: number;
}

const IDLE = 0;

export class LipSyncController {
	private visemeInputs: Map<number, StateMachineInput>;
	private visemes: TimedViseme[];
	private audio: HTMLAudioElement;
	public offset: number;
	private animFrameId: number | null = null;
	private currentViseme: number = IDLE;
	private onVisemeChange?: (viseme: number) => void;

	constructor(options: LipSyncControllerOptions) {
		this.visemeInputs = options.visemeInputs;
		this.visemes = options.visemes;
		this.audio = options.audio;
		this.offset = options.offset ?? 0.075;
		this.onVisemeChange = options.onVisemeChange;
	}

	start(): void {
		this.stop();
		this.tick();
	}

	stop(): void {
		if (this.animFrameId !== null) {
			cancelAnimationFrame(this.animFrameId);
			this.animFrameId = null;
		}
		this.setViseme(IDLE);
	}

	private tick = (): void => {
		if (this.audio.paused || this.audio.ended) {
			this.setViseme(IDLE);
			this.animFrameId = null;
			return;
		}

		const viseme = this.getVisemeAtTime(this.audio.currentTime + this.offset);
		this.setViseme(viseme);
		this.animFrameId = requestAnimationFrame(this.tick);
	};

	/** Binary search for the active viseme at the given audio time */
	private getVisemeAtTime(time: number): number {
		const v = this.visemes;
		if (v.length === 0 || time < v[0].time) return IDLE;

		let low = 0;
		let high = v.length - 1;

		while (low <= high) {
			const mid = (low + high) >>> 1;
			if (v[mid].time <= time) low = mid + 1;
			else high = mid - 1;
		}

		const event = v[high];
		return time <= event.time + event.duration ? event.viseme : IDLE;
	}

	private setViseme(value: number): void {
		if (value === this.currentViseme) return;

		// Zero out the old viseme mix input
		if (this.currentViseme !== IDLE) {
			const oldInput = this.visemeInputs.get(this.currentViseme);
			if (oldInput) oldInput.value = 0;
			else if (this.currentViseme !== IDLE)
				console.warn(`[LipSync] No input for old viseme ${this.currentViseme}`);
		}

		// Set the new viseme mix input to 100
		if (value !== IDLE) {
			const newInput = this.visemeInputs.get(value);
			if (newInput) {
				newInput.value = 100;
			} else {
				console.warn(
					`[LipSync] No input for viseme ${value} (map size: ${this.visemeInputs.size})`
				);
			}
		}

		this.currentViseme = value;
		this.onVisemeChange?.(value);
	}

	destroy(): void {
		this.stop();
	}
}
