<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { Card, Button, Badge } from '@educational-app/ui'
	import { Trophy, Target, Clock, Zap, BookOpen, Home, RefreshCw } from 'lucide-svelte'
	import { vocabularyService } from '$lib/services/vocabulary.svelte.ts'

	let results = $state<ReturnType<typeof vocabularyService.getSessionResults>>(null)
	let showCelebration = $state(false)

	onMount(() => {
		// Get results from service
		results = vocabularyService.getSessionResults()

		if (!results) {
			// No results available, redirect to vocabulary page
			goto('/vocabulary')
			return
		}

		// Show celebration animation
		showCelebration = true
		setTimeout(() => {
			showCelebration = false
		}, 3000)
	})

	function practiceAgain() {
		// Clear session and start new one with same mode
		const mode = results?.mode || 'mixed'
		vocabularyService.clearSession()
		vocabularyService.startSession(mode, 10)
		goto(`/vocabulary/session/${vocabularyService.currentSession!.id}`)
	}

	function goHome() {
		vocabularyService.clearSession()
		goto('/dashboard')
	}

	function goToVocabulary() {
		vocabularyService.clearSession()
		goto('/vocabulary')
	}

	// Get performance message based on accuracy
	function getPerformanceMessage(accuracy: number): string {
		if (accuracy >= 90) return 'Outstanding! 🌟'
		if (accuracy >= 80) return 'Great job! 🎉'
		if (accuracy >= 70) return 'Good work! 👍'
		if (accuracy >= 60) return 'Keep practicing! 💪'
		return 'Nice try! Keep going! 🌱'
	}

	// Get accuracy color
	function getAccuracyColor(accuracy: number): 'success' | 'warning' | 'danger' {
		if (accuracy >= 80) return 'success'
		if (accuracy >= 60) return 'warning'
		return 'danger'
	}
</script>

{#if results}
	<div class="max-w-3xl mx-auto px-4 py-6">
		<!-- Celebration Animation -->
		{#if showCelebration}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
				<div class="text-center animate-bounce">
					<div class="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
						<Trophy class="w-16 h-16 text-white" />
					</div>
					<h2 class="text-3xl font-bold text-white">Complete! 🎉</h2>
				</div>
			</div>
		{/if}

		<!-- Header -->
		<div class="text-center mb-8">
			<div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
				<Trophy class="w-10 h-10 text-white" />
			</div>
			<h1 class="text-3xl font-bold text-neutral-900 mb-2">
				Session Complete!
			</h1>
			<p class="text-lg text-neutral-600">{getPerformanceMessage(results.accuracy)}</p>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
			<!-- Accuracy -->
			<Card class="p-4">
				<div class="text-center">
					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
						<Target class="w-6 h-6 text-white" />
					</div>
					<p class="text-xs text-neutral-600 mb-1">Accuracy</p>
					<p class="text-2xl font-bold text-neutral-900">{results.accuracy}%</p>
					<Badge
						variant="soft"
						color={getAccuracyColor(results.accuracy)}
						size="sm"
						class="mt-1"
					>
						{results.correctAnswers}/{results.totalQuestions}
					</Badge>
				</div>
			</Card>

			<!-- XP Earned -->
			<Card class="p-4">
				<div class="text-center">
					<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
						<Zap class="w-6 h-6 text-white" />
					</div>
					<p class="text-xs text-neutral-600 mb-1">XP Earned</p>
					<p class="text-2xl font-bold text-neutral-900">{results.xpEarned}</p>
					<p class="text-xs text-neutral-600 mt-1">Points</p>
				</div>
			</Card>

			<!-- Time -->
			<Card class="p-4">
				<div class="text-center">
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
						<Clock class="w-6 h-6 text-white" />
					</div>
					<p class="text-xs text-neutral-600 mb-1">Avg Time</p>
					<p class="text-2xl font-bold text-neutral-900">{results.avgTimePerQuestion}s</p>
					<p class="text-xs text-neutral-600 mt-1">Per question</p>
				</div>
			</Card>

			<!-- Words -->
			<Card class="p-4">
				<div class="text-center">
					<div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
						<BookOpen class="w-6 h-6 text-white" />
					</div>
					<p class="text-xs text-neutral-600 mb-1">Words</p>
					<p class="text-2xl font-bold text-neutral-900">{results.totalQuestions}</p>
					<p class="text-xs text-neutral-600 mt-1">Practiced</p>
				</div>
			</Card>
		</div>

		<!-- Performance Summary -->
		<Card class="p-6 mb-6">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4">Performance Summary</h2>

			<div class="space-y-3">
				<div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
					<div class="flex items-center space-x-2">
						<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
							<span class="text-white text-sm font-bold">✓</span>
						</div>
						<span class="font-medium text-neutral-900">Correct Answers</span>
					</div>
					<span class="text-lg font-bold text-green-700">{results.correctAnswers}</span>
				</div>

				{#if results.incorrectAnswers > 0}
					<div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
						<div class="flex items-center space-x-2">
							<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
								<span class="text-white text-sm font-bold">✗</span>
							</div>
							<span class="font-medium text-neutral-900">Incorrect Answers</span>
						</div>
						<span class="text-lg font-bold text-red-700">{results.incorrectAnswers}</span>
					</div>
				{/if}
			</div>
		</Card>

		<!-- Encouragement Message -->
		<Card class="p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
			<h3 class="font-semibold text-neutral-900 mb-2">Keep Learning! 🚀</h3>
			<p class="text-sm text-neutral-700">
				{#if results.accuracy >= 90}
					You're doing amazing! Keep up the excellent work. Your hard work is paying off!
				{:else if results.accuracy >= 70}
					Great progress! Practice makes perfect. Keep learning every day to improve even more.
				{:else}
					Every practice session helps you learn! Don't give up - you're building your skills with each attempt.
				{/if}
			</p>
		</Card>

		<!-- Action Buttons -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
			<Button
				variant="solid"
				color="primary"
				onclick={practiceAgain}
				class="w-full"
			>
				<RefreshCw class="w-4 h-4 mr-2" />
				Practice Again
			</Button>

			<Button
				variant="outline"
				color="primary"
				onclick={goToVocabulary}
				class="w-full"
			>
				<BookOpen class="w-4 h-4 mr-2" />
				Choose Mode
			</Button>

			<Button
				variant="ghost"
				onclick={goHome}
				class="w-full"
			>
				<Home class="w-4 h-4 mr-2" />
				Back Home
			</Button>
		</div>
	</div>
{:else}
	<div class="text-center py-12">
		<p class="text-neutral-600">Loading results...</p>
	</div>
{/if}
