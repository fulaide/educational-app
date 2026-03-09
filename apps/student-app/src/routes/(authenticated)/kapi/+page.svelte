<script lang="ts">
	import kapiRiv from '$lib/assets/kapi.riv?url';
	import KapiSpeaker from '$lib/components/KapiSpeaker.svelte';
	import { PHRASES, type PhraseKey } from '$lib/speech/phrases';
	import { EYE_STATES, type EyeState } from '$lib/speech/eyeStates';
	import { MOUTH_STATES, type MouthState } from '$lib/speech/mouthStates';

	let kapi: KapiSpeaker;
	let text = $state('');
	let lastText = $state('');
	let speaking = $state(false);
	let selectedPhrase = $state<PhraseKey | ''>('');
	let selectedEye = $state<EyeState>(EYE_STATES.neutral);
	let eyeSnap = $state(false);
	let selectedMouth = $state<MouthState>(MOUTH_STATES.neutral);
	let mouthSnap = $state(false);
	let driftEnabled = $state(false);
	let lipSyncOffset = $state(0.075);
	let emotionSpeed = $state(0.2);
	let activeViseme = $state(0);
	let audioTime = $state(0);

	const VISEME_NAMES = ['idle', 'pp', 'ff', 'th', 'ss', 'sh', 'kk', 'aa', 'oo', 'ee'];

	const eyeEntries = Object.entries(EYE_STATES) as [string, EyeState][];
	const mouthEntries = Object.entries(MOUTH_STATES) as [string, MouthState][];

	async function handleSubmit() {
		if (!text.trim() || speaking) return;
		lastText = text.trim();
		await kapi.speak(lastText);
	}

	async function handleReplay() {
		if (!lastText || speaking) return;
		await kapi.speak(lastText);
	}

	async function handleSpeakPhrase() {
		if (!selectedPhrase || speaking) return;
		await kapi.speakPhrase(selectedPhrase);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
	}

	const phraseEntries = Object.entries(PHRASES) as [PhraseKey, string][];

	function handleEyeChange() {
		kapi.setEye(selectedEye, eyeSnap);
	}

	function handleMouthChange() {
		kapi.setMouth(selectedMouth, mouthSnap);
	}

	function handleDriftChange() {
		kapi.setDrift(driftEnabled);
	}

	function handleBlink() {
		kapi.doBlink();
	}

	function handleLoad() {
		driftEnabled = kapi.getDrift();
		selectedMouth = kapi.getMouth();
	}
</script>

<div class="flex flex-col items-center gap-6 p-6">
	<KapiSpeaker
		bind:this={kapi}
		bind:speaking
		bind:activeViseme
		bind:audioTime
		riveFile={kapiRiv}
		stateMachineName="Viseme"
		{lipSyncOffset}
		{emotionSpeed}
		onload={handleLoad}
	/>

	<!-- Lip sync debug panel -->
	<div
		class="w-full max-w-md flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
	>
		<p class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Lip-sync Debug</p>

		<!-- Live readout -->
		<div class="grid grid-cols-3 gap-2 font-mono text-center">
			<div class="rounded-lg bg-surface border border-neutral-200 px-3 py-2">
				<div class="text-xs text-neutral-400 mb-1">audio time</div>
				<div class="text-sm font-semibold text-neutral-900">{audioTime.toFixed(3)}s</div>
			</div>
			<div class="rounded-lg bg-surface border border-neutral-200 px-3 py-2">
				<div class="text-xs text-neutral-400 mb-1">viseme</div>
				<div class="text-sm font-semibold text-neutral-900">
					{activeViseme} · {VISEME_NAMES[activeViseme] ?? '?'}
				</div>
			</div>
			<div class="rounded-lg bg-surface border border-neutral-200 px-3 py-2">
				<div class="text-xs text-neutral-400 mb-1">offset</div>
				<div class="text-sm font-semibold text-neutral-900">{lipSyncOffset.toFixed(3)}s</div>
			</div>
		</div>

		<!-- Offset slider -->
		<input
			type="range"
			bind:value={lipSyncOffset}
			min="-0.1"
			max="0.3"
			step="0.005"
			class="w-full accent-primary-500"
		/>
		<p class="text-xs text-neutral-400 text-center">← mouth leads &nbsp;|&nbsp; mouth lags →</p>

		<!-- Emotion speed slider -->
		<div class="flex items-center justify-between">
			<p class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Emotion speed</p>
			<span class="font-mono text-sm text-neutral-900">{emotionSpeed.toFixed(2)}</span>
		</div>
		<input
			type="range"
			bind:value={emotionSpeed}
			min="0.02"
			max="1"
			step="0.01"
			class="w-full accent-secondary-500"
		/>
		<p class="text-xs text-neutral-400 text-center">← slow/dreamy &nbsp;|&nbsp; instant →</p>
	</div>

	<!-- Eye state -->
	<div class="w-full max-w-md flex flex-col gap-3">
		<div class="flex items-center justify-between">
			<p class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Augenausdruck</p>
			<label class="flex items-center gap-1.5 cursor-pointer select-none text-xs text-neutral-500">
				<input type="checkbox" bind:checked={eyeSnap} class="w-3.5 h-3.5 accent-primary-500" />
				snap
			</label>
		</div>
		<select
			bind:value={selectedEye}
			onchange={handleEyeChange}
			class="w-full px-3 py-3 rounded-xl border border-neutral-200 bg-surface text-neutral-900
				focus:outline-none focus:border-primary-500 transition-colors"
		>
			{#each eyeEntries as [name, value]}
				<option {value}>{name}</option>
			{/each}
		</select>
	</div>

	<!-- Mouth emotion -->
	<div class="w-full max-w-md flex flex-col gap-3">
		<div class="flex items-center justify-between">
			<p class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Mundausdruck</p>
			<label class="flex items-center gap-1.5 cursor-pointer select-none text-xs text-neutral-500">
				<input type="checkbox" bind:checked={mouthSnap} class="w-3.5 h-3.5 accent-primary-500" />
				snap
			</label>
		</div>
		<select
			bind:value={selectedMouth}
			onchange={handleMouthChange}
			class="w-full px-3 py-3 rounded-xl border border-neutral-200 bg-surface text-neutral-900
				focus:outline-none focus:border-primary-500 transition-colors"
		>
			{#each mouthEntries as [name, value]}
				<option {value}>{name}</option>
			{/each}
		</select>
	</div>

	<!-- Eye drift + blink -->
	<div class="w-full max-w-md flex flex-col gap-3">
		<p class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Augenbewegung</p>
		<div class="flex items-center gap-4">
			<label
				class="flex items-center gap-2 cursor-pointer select-none flex-1
				px-4 py-3 rounded-xl border border-neutral-200 bg-surface"
			>
				<input
					type="checkbox"
					bind:checked={driftEnabled}
					onchange={handleDriftChange}
					class="w-4 h-4 accent-primary-500 cursor-pointer"
				/>
				<span class="text-sm text-neutral-900">Drift aktiv</span>
				<span class="ml-auto text-xs text-neutral-400">{driftEnabled ? 'an' : 'aus'}</span>
			</label>

			<button
				onclick={handleBlink}
				class="px-4 py-3 rounded-xl border border-neutral-200 bg-surface text-neutral-700 text-sm font-semibold
					hover:bg-neutral-100 active:scale-95 transition-all"
			>
				Blinzeln ✦
			</button>
		</div>
	</div>

	<!-- Pre-generated phrases -->
	<div class="w-full max-w-md flex flex-col gap-3">
		<p class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
			Vorgefertigte Phrasen
		</p>
		<div class="flex gap-2">
			<select
				bind:value={selectedPhrase}
				disabled={speaking}
				class="flex-1 px-3 py-3 rounded-xl border border-neutral-200 bg-surface text-neutral-900
					focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed
					transition-colors"
			>
				<option value="">Phrase wählen…</option>
				{#each phraseEntries as [key, text]}
					<option value={key}>{key} — {text}</option>
				{/each}
			</select>

			<button
				onclick={handleSpeakPhrase}
				disabled={!selectedPhrase || speaking}
				class="px-4 py-3 rounded-xl bg-secondary-500 text-white font-semibold
					hover:bg-secondary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				▶
			</button>
		</div>
	</div>

	<!-- Dynamic TTS -->
	<div class="w-full max-w-md flex flex-col gap-3">
		<p class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Dynamischer Text</p>
		<textarea
			bind:value={text}
			onkeydown={handleKeydown}
			placeholder="Text eingeben…"
			rows="3"
			disabled={speaking}
			class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-surface text-neutral-900
				placeholder:text-neutral-400 resize-none focus:outline-none focus:border-primary-500
				disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		></textarea>

		<div class="flex gap-2">
			<button
				onclick={handleSubmit}
				disabled={!text.trim() || speaking}
				class="flex-1 py-3 rounded-xl bg-primary-500 text-white font-semibold
					hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				{speaking ? 'Kapi spricht…' : 'Sprechen'}
			</button>

			<button
				onclick={handleReplay}
				disabled={!lastText || speaking}
				title="Nochmal abspielen"
				class="px-4 py-3 rounded-xl border border-neutral-200 text-neutral-700
					hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				↺
			</button>
		</div>
	</div>
</div>
