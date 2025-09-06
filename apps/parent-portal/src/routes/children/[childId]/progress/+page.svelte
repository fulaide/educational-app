<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { Card, LocaleSwitcher } from '@educational-app/ui';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Reactive translations
	const pageTitle = $derived($t('parent.progress.title'));
	const backText = $derived($t('common.back'));
	const statsTitle = $derived($t('parent.progress.stats_title'));
	const tasksCompletedText = $derived($t('parent.progress.tasks_completed'));
	const completionRateText = $derived($t('parent.progress.completion_rate'));
	const averageScoreText = $derived($t('parent.progress.average_score'));
	const totalXpText = $derived($t('parent.progress.total_xp'));
	const timeSpentText = $derived($t('parent.progress.time_spent'));
	const recentTasksTitle = $derived($t('parent.progress.recent_tasks'));
	const achievementsTitle = $derived($t('parent.progress.achievements'));
	const noDataText = $derived($t('parent.progress.no_data'));
	const taskText = $derived($t('common.task'));
	const moduleText = $derived($t('parent.progress.module'));
	const statusText = $derived($t('parent.dashboard.status'));
	const scoreText = $derived($t('parent.progress.score'));
	const dateText = $derived($t('common.date'));
	
	const childName = $derived(data.child.name || `Student ${data.child.uuid.slice(0, 8)}`);

	// Format time in minutes
	function formatTime(seconds: number): string {
		if (seconds < 60) return `${seconds}s`;
		const minutes = Math.floor(seconds / 60);
		return `${minutes}m`;
	}

	// Get status badge color
	function getStatusColor(status: string): string {
		switch (status) {
			case 'COMPLETED': return 'bg-green-100 text-green-800';
			case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
			case 'FAILED': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	// Format status text
	function formatStatus(status: string): string {
		return status.toLowerCase().replace('_', ' ');
	}
</script>

<svelte:head>
	<title>{pageTitle}: {childName} - Lexi</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
	<div class="max-w-6xl mx-auto">
		<LocaleSwitcher variant="buttons" size="sm" />

		<!-- Back Navigation -->
		<div class="mb-6">
			<a 
				href="/children/{data.child.id}"
				class="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
			>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				{backText}
			</a>
		</div>

		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">
				{childName}
			</h1>
			<p class="text-gray-600">{pageTitle}</p>
		</div>

		<!-- Statistics Overview -->
		<Card variant="elevated" padding="lg" class="mb-8">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">{statsTitle}</h2>
			
			<div class="grid grid-cols-2 md:grid-cols-5 gap-6">
				<div class="text-center">
					<div class="text-2xl font-bold text-primary mb-2">
						{data.progress.stats.completedTasks}/{data.progress.stats.totalTasks}
					</div>
					<div class="text-sm text-gray-600">{tasksCompletedText}</div>
				</div>

				<div class="text-center">
					<div class="text-2xl font-bold text-blue-600 mb-2">
						{data.progress.stats.completionRate}%
					</div>
					<div class="text-sm text-gray-600">{completionRateText}</div>
				</div>

				<div class="text-center">
					<div class="text-2xl font-bold text-purple-600 mb-2">
						{data.progress.stats.averageScore}%
					</div>
					<div class="text-sm text-gray-600">{averageScoreText}</div>
				</div>

				<div class="text-center">
					<div class="text-2xl font-bold text-yellow-600 mb-2">
						{data.progress.stats.totalXp}
					</div>
					<div class="text-sm text-gray-600">{totalXpText}</div>
				</div>

				<div class="text-center">
					<div class="text-2xl font-bold text-green-600 mb-2">
						{formatTime(data.progress.stats.totalTimeSpent)}
					</div>
					<div class="text-sm text-gray-600">{timeSpentText}</div>
				</div>
			</div>
		</Card>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Recent Tasks -->
			<Card variant="elevated" padding="lg">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">{recentTasksTitle}</h2>
				
				{#if data.progress.tasks.length === 0}
					<div class="text-center py-8">
						<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<p class="text-gray-600">{noDataText}</p>
					</div>
				{:else}
					<div class="space-y-4 max-h-96 overflow-y-auto">
						{#each data.progress.tasks.slice(0, 10) as task (task.id)}
							<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-1">
										<h3 class="text-sm font-medium text-gray-900 truncate">
											{task.task.title}
										</h3>
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getStatusColor(task.status)}">
											{formatStatus(task.status)}
										</span>
									</div>
									<p class="text-xs text-gray-500 mb-1">
										{moduleText}: {task.task.module.title}
									</p>
									<div class="flex items-center gap-4 text-xs text-gray-500">
										{#if task.score !== null}
											<span>{scoreText}: {task.score}%</span>
										{/if}
										<span>{formatTime(task.timeSpent)}</span>
										<span>{new Date(task.startedAt).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card>

			<!-- Achievements -->
			<Card variant="elevated" padding="lg">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">{achievementsTitle}</h2>
				
				{#if data.progress.achievements.length === 0}
					<div class="text-center py-8">
						<svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
						</svg>
						<p class="text-gray-600">{noDataText}</p>
					</div>
				{:else}
					<div class="space-y-3 max-h-96 overflow-y-auto">
						{#each data.progress.achievements.slice(0, 10) as achievement (achievement.id)}
							<div class="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
								<div class="text-2xl">{achievement.achievement.icon}</div>
								<div class="flex-1 min-w-0">
									<h3 class="text-sm font-medium text-gray-900">
										{achievement.achievement.name}
									</h3>
									<p class="text-xs text-gray-600 mt-1">
										{achievement.achievement.description}
									</p>
									<p class="text-xs text-gray-500 mt-1">
										{new Date(achievement.unlockedAt).toLocaleDateString()}
									</p>
								</div>
								<div class="text-sm font-medium text-yellow-600">
									+{achievement.achievement.xpReward} XP
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card>
		</div>
	</div>
</div>