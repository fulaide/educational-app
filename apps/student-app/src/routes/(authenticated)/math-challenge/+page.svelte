<script lang="ts">
	import { goto } from '$app/navigation'
	import { Card, Button, Badge } from '@educational-app/ui'
	import { Calculator, Star, Zap, Trophy } from 'lucide-svelte'
	import { mathChallengeService } from '$lib/services/math-challenge.svelte'
	import type { MathDifficulty } from '@educational-app/learning'

	// Configuration state
	let selectedDifficulty = $state<MathDifficulty>('easy')
	let selectedCount = $state(5)
	let includeZehneruebergang = $state(false)
	let isStarting = $state(false)

	// Difficulty options
	const difficulties: Array<{
		value: MathDifficulty
		label: string
		labelDe: string
		range: string
		icon: typeof Star
		color: 'primary' | 'warning' | 'danger'
	}> = [
		{ value: 'easy', label: 'Easy', labelDe: 'Leicht', range: '1-20', icon: Star, color: 'primary' },
		{ value: 'medium', label: 'Medium', labelDe: 'Mittel', range: '1-50', icon: Zap, color: 'warning' },
		{ value: 'hard', label: 'Hard', labelDe: 'Schwer', range: '1-100', icon: Trophy, color: 'danger' }
	]

	// Problem count options
	const countOptions = [5, 10, 15]

	async function startSession() {
		if (isStarting) return
		isStarting = true

		try {
			// Clear any existing session
			mathChallengeService.clearSession()

			// Start new session (studentId will come from page.data in real app)
			const studentId = 'demo-student'
			const session = await mathChallengeService.startSession(studentId, {
				difficulty: selectedDifficulty,
				count: selectedCount,
				includeZehneruebergang
			})

			// Navigate to session page
			goto(`/math-challenge/session/${session.id}`)
		} finally {
			isStarting = false
		}
	}
</script>

<div class="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
	<!-- Header -->
	<div class="text-center mb-8">
		<div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
			<Calculator class="w-10 h-10 text-white" />
		</div>
		<h1 class="text-3xl font-bold text-neutral-900 mb-2">
			Mathe-Übung
		</h1>
		<p class="text-neutral-600">Wähle deine Einstellungen und los geht's!</p>
	</div>

	<!-- Difficulty Selection -->
	<Card class="p-6">
		<h2 class="text-lg font-semibold text-neutral-900 mb-4">Schwierigkeit</h2>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			{#each difficulties as diff}
				{@const isSelected = selectedDifficulty === diff.value}
				<button
					onclick={() => selectedDifficulty = diff.value}
					class="p-4 rounded-xl border-2 transition-all text-center
						{isSelected
							? `border-${diff.color}-500 bg-${diff.color}-50`
							: 'border-neutral-200 bg-white hover:border-neutral-300'}"
				>
					<div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3
						{isSelected
							? `bg-${diff.color}-500 text-white`
							: 'bg-neutral-100 text-neutral-600'}">
						<svelte:component this={diff.icon} class="w-6 h-6" />
					</div>
					<h3 class="font-bold text-neutral-900">{diff.labelDe}</h3>
					<p class="text-sm text-neutral-600 mt-1">Zahlen {diff.range}</p>
				</button>
			{/each}
		</div>
	</Card>

	<!-- Problem Count -->
	<Card class="p-6">
		<h2 class="text-lg font-semibold text-neutral-900 mb-4">Anzahl der Aufgaben</h2>

		<div class="flex gap-3 justify-center">
			{#each countOptions as count}
				<button
					onclick={() => selectedCount = count}
					class="w-20 h-20 rounded-xl border-2 transition-all flex flex-col items-center justify-center
						{selectedCount === count
							? 'border-primary-500 bg-primary-50'
							: 'border-neutral-200 bg-white hover:border-neutral-300'}"
				>
					<span class="text-2xl font-bold text-neutral-900">{count}</span>
					<span class="text-xs text-neutral-600">Aufgaben</span>
				</button>
			{/each}
		</div>
	</Card>

	<!-- Zehnerübergang Toggle -->
	<Card class="p-6">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold text-neutral-900">Zehnerübergang</h2>
				<p class="text-sm text-neutral-600 mt-1">
					Aufgaben mit Zehnerübergang einschließen (z.B. 7 + 5 = 12)
				</p>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					bind:checked={includeZehneruebergang}
					class="sr-only peer"
				>
				<div class="w-14 h-8 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-500"></div>
			</label>
		</div>

		{#if includeZehneruebergang}
			<div class="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
				<p class="text-sm text-warning-800">
					<strong>Tipp:</strong> Bei einem Zehnerübergang gehst du über die 10 hinaus.
					Zum Beispiel: 7 + 5 - erst 7 + 3 = 10, dann + 2 = 12
				</p>
			</div>
		{/if}
	</Card>

	<!-- Summary & Start -->
	<Card class="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
		<div class="flex items-center justify-between">
			<div>
				<h3 class="font-semibold text-neutral-900">Zusammenfassung</h3>
				<div class="flex flex-wrap gap-2 mt-2">
					<Badge variant="primary">{selectedCount} Aufgaben</Badge>
					<Badge variant="secondary">
						{difficulties.find(d => d.value === selectedDifficulty)?.labelDe}
					</Badge>
					{#if includeZehneruebergang}
						<Badge variant="warning">Mit Zehnerübergang</Badge>
					{/if}
				</div>
			</div>

			<button
				onclick={startSession}
				disabled={isStarting}
				class="px-6 py-3 text-lg font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50"
			>
				{isStarting ? 'Lädt...' : 'Start!'}
			</button>
		</div>
	</Card>

	<!-- Tips Card -->
	<Card class="p-6 bg-neutral-50 border-neutral-200">
		<h3 class="font-semibold text-neutral-900 mb-2">Tipps</h3>
		<ul class="text-sm text-neutral-700 space-y-2">
			<li>• Nimm dir Zeit für jede Aufgabe</li>
			<li>• Benutze die "Verliebten Zahlen" (Zahlen die zusammen 10 ergeben)</li>
			<li>• Bei Zehnerübergang: erst zur 10, dann weiter</li>
		</ul>
	</Card>
</div>
