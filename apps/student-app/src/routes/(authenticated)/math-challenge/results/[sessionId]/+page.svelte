<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { Card, Button, Badge, ProgressBar } from '@educational-app/ui'
	import { Trophy, Star, Clock, Target, RotateCcw, Home, Check, X } from 'lucide-svelte'
	import { mathChallengeService } from '$lib/services/math-challenge.svelte'
	import type { MathSessionResults } from '@educational-app/learning'

	// Get results from service
	let results = $state<MathSessionResults | null>(null)

	onMount(() => {
		results = mathChallengeService.getResults()

		if (!results) {
			// No results available, redirect
			goto('/math-challenge')
		}
	})

	function playAgain() {
		mathChallengeService.clearSession()
		goto('/math-challenge')
	}

	function goHome() {
		mathChallengeService.clearSession()
		goto('/dashboard')
	}

	// Performance rating
	const performanceRating = $derived(() => {
		if (!results) return { emoji: '', text: '', color: '' }

		if (results.accuracy >= 90) {
			return { emoji: '🏆', text: 'Ausgezeichnet!', color: 'text-success-600' }
		} else if (results.accuracy >= 70) {
			return { emoji: '⭐', text: 'Gut gemacht!', color: 'text-primary-600' }
		} else if (results.accuracy >= 50) {
			return { emoji: '👍', text: 'Weiter so!', color: 'text-warning-600' }
		} else {
			return { emoji: '💪', text: 'Übung macht den Meister!', color: 'text-neutral-600' }
		}
	})

	// Format time
	function formatTime(ms: number): string {
		const seconds = Math.floor(ms / 1000)
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60

		if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`
		}
		return `${seconds}s`
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
	{#if results}
		<!-- Hero Section -->
		<div class="text-center py-8">
			<div class="text-6xl mb-4">{performanceRating().emoji}</div>
			<h1 class="text-3xl font-bold text-neutral-900 mb-2">
				{performanceRating().text}
			</h1>
			<p class="text-neutral-600">
				Du hast {results.correctAnswers} von {results.totalProblems} Aufgaben richtig gelöst!
			</p>
		</div>

		<!-- XP Earned -->
		<Card class="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
						<Star class="w-7 h-7 text-white" />
					</div>
					<div>
						<p class="text-sm text-neutral-600">XP verdient</p>
						<p class="text-3xl font-bold text-primary-600">+{results.xpEarned}</p>
					</div>
				</div>
				<Badge variant="primary" class="text-lg px-4 py-2">
					{results.difficulty === 'easy' ? 'Leicht' :
					 results.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
				</Badge>
			</div>
		</Card>

		<!-- Stats Grid -->
		<div class="grid grid-cols-2 gap-4">
			<!-- Accuracy -->
			<Card class="p-4">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
						<Target class="w-5 h-5 text-success-600" />
					</div>
					<div>
						<p class="text-sm text-neutral-600">Genauigkeit</p>
						<p class="text-xl font-bold text-neutral-900">{results.accuracy}%</p>
					</div>
				</div>
			</Card>

			<!-- Time -->
			<Card class="p-4">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
						<Clock class="w-5 h-5 text-primary-600" />
					</div>
					<div>
						<p class="text-sm text-neutral-600">Gesamtzeit</p>
						<p class="text-xl font-bold text-neutral-900">{formatTime(results.totalTimeSpent)}</p>
					</div>
				</div>
			</Card>

			<!-- Correct -->
			<Card class="p-4">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
						<Check class="w-5 h-5 text-success-600" />
					</div>
					<div>
						<p class="text-sm text-neutral-600">Richtig</p>
						<p class="text-xl font-bold text-success-600">{results.correctAnswers}</p>
					</div>
				</div>
			</Card>

			<!-- Incorrect -->
			<Card class="p-4">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
						<X class="w-5 h-5 text-danger-600" />
					</div>
					<div>
						<p class="text-sm text-neutral-600">Falsch</p>
						<p class="text-xl font-bold text-danger-600">{results.incorrectAnswers}</p>
					</div>
				</div>
			</Card>
		</div>

		<!-- Accuracy Bar -->
		<Card class="p-4">
			<div class="flex items-center justify-between text-sm mb-2">
				<span class="text-neutral-600">Erfolgsquote</span>
				<span class="font-medium text-neutral-900">{results.accuracy}%</span>
			</div>
			<ProgressBar
				current={results.correctAnswers}
				total={results.totalProblems}
				class="h-3"
			/>
		</Card>

		<!-- Problem Review -->
		<Card class="p-6">
			<h2 class="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
				<Trophy class="w-5 h-5 text-primary-600" />
				Aufgaben-Übersicht
			</h2>

			<div class="space-y-3 max-h-64 overflow-y-auto">
				{#each results.answers as answer, index}
					{@const session = mathChallengeService.currentSession}
					{@const problem = session?.problems.find(p => p.id === answer.problemId)}
					<div class="flex items-center justify-between p-3 rounded-lg {
						answer.isCorrect ? 'bg-success-50' : 'bg-danger-50'
					}">
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 rounded-full flex items-center justify-center {
								answer.isCorrect ? 'bg-success-500' : 'bg-danger-500'
							}">
								{#if answer.isCorrect}
									<Check class="w-4 h-4 text-white" />
								{:else}
									<X class="w-4 h-4 text-white" />
								{/if}
							</div>
							<div>
								<p class="font-mono font-medium text-neutral-900">
									{problem?.display || `Aufgabe ${index + 1}`}
								</p>
								<p class="text-xs text-neutral-600">
									Deine Antwort: {answer.answer}
									{#if !answer.isCorrect && problem}
										<span class="text-danger-600">(Richtig: {problem.correctAnswer})</span>
									{/if}
								</p>
							</div>
						</div>
						<span class="text-xs text-neutral-500">
							{formatTime(answer.timeSpent)}
						</span>
					</div>
				{/each}
			</div>
		</Card>

		<!-- Zehnerübergang Note -->
		{#if results.includesZehneruebergang}
			<Card class="p-4 bg-warning-50 border-warning-200">
				<p class="text-sm text-warning-800">
					<strong>Hinweis:</strong> Diese Übung enthielt Aufgaben mit Zehnerübergang.
					Das ist eine wichtige Fähigkeit für Mathe!
				</p>
			</Card>
		{/if}

		<!-- Action Buttons -->
		<div class="flex gap-4">
			<Button
				variant="outline"
				color="primary"
				onclick={goHome}
				class="flex-1"
			>
				<Home class="w-4 h-4 mr-2" />
				Startseite
			</Button>
			<Button
				variant="solid"
				color="primary"
				onclick={playAgain}
				class="flex-1"
			>
				<RotateCcw class="w-4 h-4 mr-2" />
				Nochmal spielen
			</Button>
		</div>
	{:else}
		<!-- Loading state -->
		<div class="flex items-center justify-center py-20">
			<div class="text-center">
				<div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p class="text-neutral-600">Lade Ergebnisse...</p>
			</div>
		</div>
	{/if}
</div>
