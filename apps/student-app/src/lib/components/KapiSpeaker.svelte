<script lang="ts">
	/**
	 * KapiSpeaker.svelte
	 *
	 * Drop-in Svelte 5 component that makes Kapi speak with lip-synced Rive animation.
	 * Viseme timing comes from Rhubarb Lip Sync (server-side), giving phoneme-accurate
	 * mouth shapes instead of raw character timestamps.
	 *
	 * All animation layers use direct-blend mix inputs (0–100). Each named state has
	 * its own input; neutral is the base state (all inputs at 0). BlendStateController
	 * crossfades between any two states directly without going through intermediates.
	 *
	 * Usage:
	 *   <KapiSpeaker bind:this={kapi} riveFile={kapiRiv} stateMachineName="State Machine" />
	 *   kapi.speak("Hallo! Ich bin Kapi.")
	 *   kapi.speakPhrase('correct_1')   // pre-generated, offline-capable
	 */

	import { generateSpeechWithAlignment } from '$lib/services/elevenlabs';
	import { BlendStateController } from '$lib/services/blendStateController';
	import { LipSyncController } from '$lib/services/lipSyncController';
	import type { VisemeEvent } from '$lib/services/visemeMapper';
	import { EYE_STATES, type EyeState } from '$lib/speech/eyeStates';
	import { MOUTH_STATES, type MouthState } from '$lib/speech/mouthStates';
	import type { PhraseKey } from '$lib/speech/phrases';

	import type { StateMachineInput } from '@rive-app/canvas';
	import { Rive } from '@rive-app/canvas';
	import { onDestroy, onMount } from 'svelte';

	// Maps each phrase category to an eye expression shown while speaking
	const PHRASE_EYE: Partial<Record<PhraseKey, EyeState>> = {
		correct_1: EYE_STATES.happy,
		correct_2: EYE_STATES.neutral,
		correct_3: EYE_STATES.glad,
		correct_4: EYE_STATES.happy,
		wrong_1: EYE_STATES.serious,
		wrong_2: EYE_STATES.bored,
		wrong_3: EYE_STATES.serious,
		encourage_1: EYE_STATES.glad,
		encourage_2: EYE_STATES.serious,
		encourage_3: EYE_STATES.closed,
		intro: EYE_STATES.glasses
	};

	// Maps each phrase category to a mouth emotion shown while speaking
	const PHRASE_MOUTH: Partial<Record<PhraseKey, MouthState>> = {
		correct_1: MOUTH_STATES.happy,
		correct_2: MOUTH_STATES.happy,
		correct_3: MOUTH_STATES.happy,
		correct_4: MOUTH_STATES.happy,
		wrong_1: MOUTH_STATES.sad,
		wrong_2: MOUTH_STATES.sad,
		wrong_3: MOUTH_STATES.sad,
		encourage_1: MOUTH_STATES.happy,
		encourage_2: MOUTH_STATES.happy,
		encourage_3: MOUTH_STATES.surprised,
		intro: MOUTH_STATES.happy
	};

	// Viseme index (1–9) → Rive input key suffix (used to build "viseme_{key}_mix")
	const VISEME_KEY: Record<number, string> = {
		1: 'pp',
		2: 'ff',
		3: 'th',
		4: 'ss',
		5: 'sh',
		6: 'kk',
		7: 'aa',
		8: 'oo',
		9: 'ee'
	};

	interface Props {
		riveFile: string;
		stateMachineName?: string;
		driftInputName?: string;
		blinkInputName?: string;
		/** Seconds to look ahead when sampling visemes. Tune if mouth lags or leads the audio. */
		lipSyncOffset?: number;
		/** Lerp speed for eye/mouth emotion transitions (0–1). 0.15=slow, 0.25=snappy. */
		emotionSpeed?: number;
		width?: number;
		height?: number;
		onload?: () => void;
		speaking?: boolean;
		/** Currently active viseme index (0–9). Bindable for debug display. */
		activeViseme?: number;
		/** Current audio position in seconds. Bindable for debug display. */
		audioTime?: number;
	}

	let {
		riveFile,
		stateMachineName = 'State Machine',
		driftInputName = 'do_drift',
		blinkInputName = 'do_blink',
		lipSyncOffset = 0.075,
		emotionSpeed = 0.2,
		width = 400,
		height = 500,
		onload,
		speaking = $bindable(false),
		activeViseme = $bindable(0),
		audioTime = $bindable(0)
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let rive: Rive | null = null;
	let blendEye: BlendStateController | null = null;
	let blendMouth: BlendStateController | null = null;
	let visemeInputs: Map<number, StateMachineInput> = new Map();
	let driftInput: StateMachineInput | null = null;
	let blinkInput: StateMachineInput | null = null;
	let lipSync: LipSyncController | null = null;
	let audio: HTMLAudioElement | null = null;

	// Push prop changes into running instances in real-time
	$effect(() => {
		const offset = lipSyncOffset; // read unconditionally so Svelte tracks it as a dependency
		if (lipSync) (lipSync as unknown as { offset: number }).offset = offset;
	});
	$effect(() => {
		const speed = emotionSpeed; // read unconditionally so Svelte tracks it as a dependency
		if (blendEye) blendEye.speed = speed;
		if (blendMouth) blendMouth.speed = speed;
	});

	// Cache keyed by text – avoids re-calling ElevenLabs for the same dynamic phrase
	const speechCache = new Map<string, { audioBuffer: ArrayBuffer; visemes: VisemeEvent[] }>();

	// Cache for pre-generated phrases fetched from /speech/{key}.mp3 + .json
	const phraseCache = new Map<string, { audioBuffer: ArrayBuffer; visemes: VisemeEvent[] }>();

	onMount(() => {
		audio = new Audio();

		rive = new Rive({
			src: riveFile,
			canvas,
			stateMachines: stateMachineName,
			autoplay: true,
			onLoad: () => {
				rive!.resizeDrawingSurfaceToCanvas();

				// Log available state machines to help diagnose name mismatches
				const availableSMs = (rive as unknown as { stateMachineNames?: string[] })
					.stateMachineNames;
				if (availableSMs) {
					console.log('[KapiSpeaker] Available state machines:', availableSMs);
				}

				const inputs = rive!.stateMachineInputs(stateMachineName);
				if (!inputs) {
					console.error(
						`[KapiSpeaker] State machine "${stateMachineName}" not found.`,
						'Available:',
						availableSMs
					);
					return;
				}
				const find = (name: string) => inputs.find((i) => i.name === name) ?? null;

				// Drift + blink
				driftInput = find(driftInputName);
				blinkInput = find(blinkInputName);

				// Viseme mix inputs: index → input
				visemeInputs = new Map();
				for (const [idx, key] of Object.entries(VISEME_KEY)) {
					const input = find(`viseme_${key}_mix`);
					if (input) {
						visemeInputs.set(Number(idx), input);
					} else {
						console.warn(`[KapiSpeaker] Viseme input NOT found: viseme_${key}_mix`);
					}
				}
				console.log(
					`[KapiSpeaker] Viseme inputs found: ${visemeInputs.size}/9`,
					[...visemeInputs.keys()].map((k) => `${k}:${VISEME_KEY[k]}`)
				);
				if (visemeInputs.size === 0) {
					console.error(
						'[KapiSpeaker] No viseme mix inputs found. Available inputs:',
						inputs?.map((i) => i.name)
					);
				}

				// Eye blend inputs
				const eyeInputMap = new Map<string, StateMachineInput>();
				for (const key of ['happy', 'glad', 'closed', 'bored', 'serious', 'surprise', 'glasses']) {
					const input = find(`eye_${key}_mix`);
					if (input) eyeInputMap.set(key, input);
				}
				blendEye = new BlendStateController(eyeInputMap, emotionSpeed);

				// Mouth blend inputs
				const mouthInputMap = new Map<string, StateMachineInput>();
				for (const key of ['sad', 'happy', 'surprised']) {
					const input = find(`mouth_${key}_mix`);
					if (input) mouthInputMap.set(key, input);
				}
				blendMouth = new BlendStateController(mouthInputMap, emotionSpeed);

				onload?.();
			}
		});
	});

	onDestroy(() => {
		lipSync?.destroy();
		blendEye?.destroy();
		blendMouth?.destroy();
		rive?.cleanup();
		audio?.pause();
	});

	function makeLipSync(visemes: VisemeEvent[]): LipSyncController {
		const ctrl = new LipSyncController({
			visemeInputs,
			visemes,
			audio: audio!,
			onVisemeChange: (v: number) => {
				activeViseme = v;
				audioTime = audio?.currentTime ?? 0;
			}
		});
		(ctrl as unknown as { offset: number }).offset = lipSyncOffset;
		return ctrl;
	}

	/** Make Kapi speak text with lip-synced animation. Resolves when done. */
	export async function speak(text: string): Promise<void> {
		if (visemeInputs.size === 0) throw new Error('[KapiSpeaker] Rive not ready');

		stop();
		speaking = true;

		let cached = speechCache.get(text);
		if (!cached) {
			const { audio, visemes } = (await generateSpeechWithAlignment(text)) as unknown as {
				audio: ArrayBuffer;
				visemes: VisemeEvent[];
			};
			cached = { audioBuffer: audio, visemes };
			speechCache.set(text, cached);
		}

		const blob = new Blob([cached.audioBuffer], { type: 'audio/mpeg' });
		const url = URL.createObjectURL(blob);
		audio!.src = url;

		lipSync = makeLipSync(cached.visemes);
		await audio!.play();
		lipSync.start();

		return new Promise<void>((resolve) => {
			audio!.onended = () => {
				lipSync?.stop();
				speaking = false;
				URL.revokeObjectURL(url);
				resolve();
			};
		});
	}

	/** Make Kapi speak a pre-generated phrase (fetched from /speech/{key}.mp3 + .json). Resolves when done. */
	export async function speakPhrase(key: PhraseKey): Promise<void> {
		if (visemeInputs.size === 0) throw new Error('[KapiSpeaker] Rive not ready');

		stop();
		speaking = true;

		// Remember current expressions so we can restore them after speaking
		const prevEye = (blendEye?.currentState ?? EYE_STATES.neutral) as EyeState;
		const prevMouth = (blendMouth?.currentState ?? MOUTH_STATES.neutral) as MouthState;

		// Set matching eye and mouth expression for this phrase
		blendEye?.set(PHRASE_EYE[key] ?? EYE_STATES.neutral);
		blendMouth?.set(PHRASE_MOUTH[key] ?? MOUTH_STATES.neutral);

		let cached = phraseCache.get(key);
		if (!cached) {
			const [audioResp, visemeResp] = await Promise.all([
				fetch(`/speech/${key}.mp3`),
				fetch(`/speech/${key}.json`)
			]);
			if (!audioResp.ok || !visemeResp.ok) {
				speaking = false;
				blendEye?.set(prevEye);
				blendMouth?.set(prevMouth);
				throw new Error(`[KapiSpeaker] Phrase "${key}" not found`);
			}
			const [audioBuffer, visemes] = await Promise.all([
				audioResp.arrayBuffer(),
				visemeResp.json() as Promise<VisemeEvent[]>
			]);
			cached = { audioBuffer, visemes };
			phraseCache.set(key, cached);
		}

		const blob = new Blob([cached.audioBuffer], { type: 'audio/mpeg' });
		const url = URL.createObjectURL(blob);
		audio!.src = url;

		lipSync = makeLipSync(cached.visemes);
		await audio!.play();
		lipSync.start();

		return new Promise<void>((resolve) => {
			audio!.onended = () => {
				lipSync?.stop();
				speaking = false;
				URL.revokeObjectURL(url);
				blendEye?.set(prevEye);
				blendMouth?.set(prevMouth);
				resolve();
			};
		});
	}

	/** Pre-fetch and cache a pre-generated phrase for zero-latency playback later. */
	export async function preloadPhrase(key: PhraseKey): Promise<void> {
		if (phraseCache.has(key)) return;
		const [audioResp, visemeResp] = await Promise.all([
			fetch(`/speech/${key}.mp3`),
			fetch(`/speech/${key}.json`)
		]);
		if (!audioResp.ok || !visemeResp.ok) return;
		const [audioBuffer, visemes] = await Promise.all([
			audioResp.arrayBuffer(),
			visemeResp.json() as Promise<VisemeEvent[]>
		]);
		phraseCache.set(key, { audioBuffer, visemes });
	}

	/** Set Kapi's eye expression. Pass snap=true to jump instantly without lerping. */
	export function setEye(state: EyeState, snap = false): void {
		if (snap) blendEye?.snap(state);
		else blendEye?.set(state);
	}

	/** Set Kapi's mouth emotion. Pass snap=true to jump instantly without lerping. */
	export function setMouth(state: MouthState, snap = false): void {
		if (snap) blendMouth?.snap(state);
		else blendMouth?.set(state);
	}

	/** Enable or disable the eye drift idle animation. */
	export function setDrift(enabled: boolean): void {
		if (driftInput) driftInput.value = enabled;
	}

	/** Read the current drift state from Rive (useful for syncing UI after load). */
	export function getDrift(): boolean {
		return driftInput ? (driftInput.value as boolean) : false;
	}

	/** Read the current mouth state name (useful for syncing UI after load). */
	export function getMouth(): MouthState {
		return (blendMouth?.currentState ?? MOUTH_STATES.neutral) as MouthState;
	}

	/** Fire a single blink animation (10-frame one-shot). */
	export function doBlink(): void {
		if (blinkInput) blinkInput.fire();
	}

	/** Stop speaking immediately. */
	export function stop(): void {
		lipSync?.stop();
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
		speaking = false;
	}

	/** Pre-generate and cache speech for instant playback later. */
	export async function preload(text: string): Promise<void> {
		if (speechCache.has(text)) return;
		const { audio, visemes } = (await generateSpeechWithAlignment(text)) as unknown as {
			audio: ArrayBuffer;
			visemes: VisemeEvent[];
		};
		speechCache.set(text, { audioBuffer: audio, visemes });
	}
</script>

<canvas bind:this={canvas} {width} {height} style="width: {width}px; height: {height}px;"></canvas>
