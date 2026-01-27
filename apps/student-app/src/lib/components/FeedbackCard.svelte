<script lang="ts">
	import { cn } from '@educational-app/ui'
	import { Volume2, VolumeX, Loader2 } from 'lucide-svelte'
	import { audioManager } from '$lib/services/audio-manager.svelte'
	import type { GermanFeedback } from '@educational-app/learning'

	interface Props {
		feedback: GermanFeedback
		showAudioButton?: boolean
		class?: string
	}

	let {
		feedback,
		showAudioButton = true,
		class: className
	}: Props = $props()

	// Audio state from manager
	const isPlaying = $derived(audioManager.isPlaying)
	const isLoading = $derived(audioManager.isLoading)
	const audioError = $derived(audioManager.error)

	// Get full text for TTS
	const fullText = $derived(() => {
		if (feedback.explanation) {
			return `${feedback.message} ${feedback.explanation}`
		}
		return feedback.message
	})

	async function handlePlayAudio() {
		if (isPlaying) {
			audioManager.stop()
		} else {
			await audioManager.speakText(fullText())
		}
	}

	// Card styles based on correct/incorrect
	const cardClasses = $derived(
		cn(
			'p-6 rounded-xl border-2 transition-all',
			feedback.isCorrect
				? 'bg-success-50 border-success-200'
				: 'bg-danger-50 border-danger-200',
			className
		)
	)

	const iconClasses = $derived(
		cn(
			'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
			feedback.isCorrect ? 'bg-success-500' : 'bg-danger-500'
		)
	)

	const titleClasses = $derived(
		cn(
			'font-bold text-lg mb-1',
			feedback.isCorrect ? 'text-success-900' : 'text-danger-900'
		)
	)

	const textClasses = $derived(
		cn(
			'text-sm whitespace-pre-line',
			feedback.isCorrect ? 'text-success-800' : 'text-danger-800'
		)
	)
</script>

<div class={cardClasses}>
	<div class="flex items-start gap-4">
		<!-- Icon -->
		<div class={iconClasses}>
			<span class="text-2xl text-white">
				{feedback.isCorrect ? '✓' : '✗'}
			</span>
		</div>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<h3 class={titleClasses}>
				{feedback.message}
			</h3>

			{#if feedback.explanation}
				<p class={textClasses}>
					{feedback.explanation}
				</p>
			{/if}

			<!-- Audio Button -->
			{#if showAudioButton}
				<button
					onclick={handlePlayAudio}
					disabled={isLoading}
					class="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
						{feedback.isCorrect
							? 'bg-success-100 text-success-700 hover:bg-success-200'
							: 'bg-danger-100 text-danger-700 hover:bg-danger-200'}
						disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<Loader2 class="w-4 h-4 animate-spin" />
						<span>Lädt...</span>
					{:else if isPlaying}
						<VolumeX class="w-4 h-4" />
						<span>Stoppen</span>
					{:else}
						<Volume2 class="w-4 h-4" />
						<span>Anhören</span>
					{/if}
				</button>

				{#if audioError}
					<p class="mt-2 text-xs text-neutral-600">
						{audioError}
					</p>
				{/if}
			{/if}
		</div>
	</div>
</div>
