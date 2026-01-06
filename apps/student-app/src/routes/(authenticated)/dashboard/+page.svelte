<script lang="ts">
	import { goto } from '$app/navigation'
	import { Card, Button, ProgressBar, Badge } from '@educational-app/ui'
	import { BookOpen, Target, Flame, TrendingUp, Star, Clock } from 'lucide-svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	// Calculate level progress (XP to next level)
	const xpForNextLevel = data.stats.level * 100
	const xpProgress = $derived((data.stats.xp % 100) / xpForNextLevel * 100)

	// Calculate today's progress percentage
	const todayProgressPercent = $derived((data.todayProgress.wordsCompleted / data.todayProgress.dailyGoal) * 100)

	function startVocabulary() {
		goto('/vocabulary')
	}

	function formatTimeAgo(isoDate: string): string {
		const date = new Date(isoDate)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
		const diffDays = Math.floor(diffHours / 24)

		if (diffHours < 1) return 'Just now'
		if (diffHours < 24) return `${diffHours}h ago`
		if (diffDays === 1) return 'Yesterday'
		return `${diffDays} days ago`
	}
</script>

<div class="max-w-7xl mx-auto px-4 py-6 space-y-6">
	<!-- Welcome Header -->
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold text-neutral-900 mb-2">
			Welcome back! 👋
		</h1>
		<p class="text-neutral-600">Keep learning and growing every day</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<!-- Level Card -->
		<Card class="p-4">
			<div class="flex flex-col items-center text-center">
				<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
					{data.stats.level}
				</div>
				<p class="text-xs text-neutral-600 mb-1">Level</p>
				<p class="text-sm font-semibold text-neutral-900">{data.stats.xp} XP</p>
				<ProgressBar value={xpProgress} class="w-full mt-2 h-1" />
			</div>
		</Card>

		<!-- Words Learned Card -->
		<Card class="p-4">
			<div class="flex flex-col items-center text-center">
				<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mb-2">
					<BookOpen class="w-6 h-6" />
				</div>
				<p class="text-xs text-neutral-600 mb-1">Words Learned</p>
				<p class="text-2xl font-bold text-neutral-900">{data.stats.wordsLearned}</p>
			</div>
		</Card>

		<!-- Streak Card -->
		<Card class="p-4">
			<div class="flex flex-col items-center text-center">
				<div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white mb-2">
					<Flame class="w-6 h-6" />
				</div>
				<p class="text-xs text-neutral-600 mb-1">Day Streak</p>
				<p class="text-2xl font-bold text-neutral-900">{data.stats.streak}</p>
			</div>
		</Card>

		<!-- Accuracy Card -->
		<Card class="p-4">
			<div class="flex flex-col items-center text-center">
				<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-2">
					<Target class="w-6 h-6" />
				</div>
				<p class="text-xs text-neutral-600 mb-1">Accuracy</p>
				<p class="text-2xl font-bold text-neutral-900">{data.stats.accuracy}%</p>
			</div>
		</Card>
	</div>

	<!-- Today's Progress -->
	<Card class="p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold text-neutral-900 flex items-center">
				<TrendingUp class="w-5 h-5 mr-2 text-primary-600" />
				Today's Progress
			</h2>
			<Badge variant="soft" color="primary">
				{data.todayProgress.xpEarned} XP earned
			</Badge>
		</div>
		
		<div class="space-y-3">
			<div class="flex items-center justify-between text-sm">
				<span class="text-neutral-600">Daily Goal</span>
				<span class="font-semibold text-neutral-900">
					{data.todayProgress.wordsCompleted} / {data.todayProgress.dailyGoal} words
				</span>
			</div>
			<ProgressBar value={todayProgressPercent} class="h-2" />
			
			{#if data.todayProgress.wordsCompleted >= data.todayProgress.dailyGoal}
				<p class="text-sm text-green-600 font-medium">🎉 Daily goal completed! Great job!</p>
			{:else}
				<p class="text-sm text-neutral-600">
					{data.todayProgress.dailyGoal - data.todayProgress.wordsCompleted} more words to reach your goal
				</p>
			{/if}
		</div>
	</Card>

	<!-- Quick Actions -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- Review Words -->
		<Card class="p-6 cursor-pointer hover:shadow-md transition-shadow" onclick={startVocabulary}>
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-neutral-900 mb-2">Review Words</h3>
					<p class="text-sm text-neutral-600 mb-4">
						{data.stats.wordsDueReview} words need review
					</p>
					<Button variant="solid" color="primary" size="sm">
						Start Review
					</Button>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
					<BookOpen class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</Card>

		<!-- Learn New Words -->
		<Card class="p-6 cursor-pointer hover:shadow-md transition-shadow" onclick={() => goto('/vocabulary?mode=new')}>
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-neutral-900 mb-2">Learn New Words</h3>
					<p class="text-sm text-neutral-600 mb-4">
						Expand your vocabulary
					</p>
					<Button variant="solid" color="secondary" size="sm">
						Start Learning
					</Button>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
					<Star class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</Card>
	</div>

	<!-- Recent Sessions -->
	{#if data.recentSessions.length > 0}
		<Card class="p-6">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
				<Clock class="w-5 h-5 mr-2 text-neutral-600" />
				Recent Activity
			</h2>
			
			<div class="space-y-3">
				{#each data.recentSessions as session}
					<div class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
						<div class="flex-1">
							<p class="font-medium text-neutral-900">{session.type}</p>
							<p class="text-xs text-neutral-600">{formatTimeAgo(session.completedAt)}</p>
						</div>
						<div class="text-right">
							<p class="text-sm font-semibold text-neutral-900">{session.wordsCount} words</p>
							<Badge variant="soft" color={session.accuracy >= 80 ? 'success' : 'warning'} size="sm">
								{session.accuracy}% accuracy
							</Badge>
						</div>
					</div>
				{/each}
			</div>
		</Card>
	{/if}
</div>
