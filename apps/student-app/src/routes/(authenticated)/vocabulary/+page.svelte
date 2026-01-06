<script lang="ts">
	import { goto } from '$app/navigation'
	import { Card, Button, ProgressBar, Badge } from '@educational-app/ui'
	import { BookOpen, Star, Shuffle, TrendingUp } from 'lucide-svelte'
	import { vocabularyService, type SessionMode } from '$lib/services/vocabulary.svelte.ts'

	// Get category stats
	const categoryStats = vocabularyService.getCategoryStats()

	function startSession(mode: SessionMode) {
		// Start session with 10 words
		const session = vocabularyService.startSession(mode, 10)

		// Navigate to session page
		goto(`/vocabulary/session/${session.id}`)
	}
</script>

<div class="max-w-7xl mx-auto px-4 py-6 space-y-6">
	<!-- Header -->
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold text-neutral-900 mb-2">
			Learn Vocabulary 📚
		</h1>
		<p class="text-neutral-600">Choose how you want to practice</p>
	</div>

	<!-- Mode Selection Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- Review Mode -->
		<Card class="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500" onclick={() => startSession('review')}>
			<div class="text-center space-y-4">
				<div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
					<BookOpen class="w-8 h-8 text-white" />
				</div>

				<div>
					<h2 class="text-xl font-bold text-neutral-900 mb-2">Review Words</h2>
					<p class="text-sm text-neutral-600 mb-3">
						Practice words you've already learned
					</p>
					<Badge variant="soft" color="primary">12 words due</Badge>
				</div>

				<Button variant="solid" color="primary" class="w-full">
					Start Review
				</Button>
			</div>
		</Card>

		<!-- Learn New Mode -->
		<Card class="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-500" onclick={() => startSession('new')}>
			<div class="text-center space-y-4">
				<div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
					<Star class="w-8 h-8 text-white" />
				</div>

				<div>
					<h2 class="text-xl font-bold text-neutral-900 mb-2">Learn New</h2>
					<p class="text-sm text-neutral-600 mb-3">
						Discover and learn new vocabulary words
					</p>
					<Badge variant="soft" color="secondary">14 words available</Badge>
				</div>

				<Button variant="solid" color="secondary" class="w-full">
					Learn New Words
				</Button>
			</div>
		</Card>

		<!-- Mixed Mode -->
		<Card class="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500" onclick={() => startSession('mixed')}>
			<div class="text-center space-y-4">
				<div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
					<Shuffle class="w-8 h-8 text-white" />
				</div>

				<div>
					<h2 class="text-xl font-bold text-neutral-900 mb-2">Mixed Practice</h2>
					<p class="text-sm text-neutral-600 mb-3">
						Mix of new words and review
					</p>
					<Badge variant="soft" color="success">Best for learning</Badge>
				</div>

				<Button variant="solid" color="success" class="w-full">
					Start Mixed
				</Button>
			</div>
		</Card>
	</div>

	<!-- Category Progress -->
	<Card class="p-6">
		<h2 class="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
			<TrendingUp class="w-5 h-5 mr-2 text-primary-600" />
			Category Progress
		</h2>

		<div class="space-y-4">
			{#each categoryStats as stat}
				<div class="space-y-2">
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-neutral-900 capitalize">
							{stat.category.toLowerCase().replace('_', ' ')}
						</span>
						<span class="text-neutral-600">
							{stat.learnedWords} / {stat.totalWords} words
						</span>
					</div>
					<ProgressBar value={stat.progress} class="h-2" />
				</div>
			{/each}
		</div>
	</Card>

	<!-- Tips Card -->
	<Card class="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
		<h3 class="font-semibold text-neutral-900 mb-2">💡 Learning Tip</h3>
		<p class="text-sm text-neutral-700">
			Practice a little every day! Regular practice helps you remember words better. Try to complete at least 10 words daily.
		</p>
	</Card>
</div>
