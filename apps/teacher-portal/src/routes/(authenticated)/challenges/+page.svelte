<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { Button, Card, Input } from '@educational-app/ui';
	import {
		Plus,
		FileText,
		Users,
		TrendingUp,
		CheckCircle,
		Clock,
		BarChart3,
		Eye,
		Edit,
		Trash2,
		Search
	} from 'lucide-svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Make translations reactive
	const pageTitle = $derived($t('challenges.title'));
	const pageSubtitle = $derived($t('challenges.subtitle'));
	const createNewText = $derived($t('challenges.create_new'));
	const noChallengesText = $derived($t('challenges.no_challenges'));
	const exercisesText = $derived($t('challenges.exercises'));
	const studentsText = $derived($t('challenges.students'));
	const completionRateText = $derived($t('challenges.completion_rate'));
	const avgScoreText = $derived($t('challenges.avg_score'));
	const viewDetailsText = $derived($t('challenges.view_details'));

	// Reactive challenge counts
	const totalChallenges = $derived(data.challenges.length);
	const totalStudents = $derived(
		data.challenges.reduce((sum, c) => sum + c.stats.totalStudents, 0)
	);
	const avgCompletionRate = $derived(
		data.challenges.length > 0
			? Math.round(
					data.challenges.reduce((sum, c) => sum + c.stats.completionRate, 0) /
						data.challenges.length
				)
			: 0
	);

	// Filter and sort state
	let searchQuery = $state('');
	let sortBy = $state<'recent' | 'popular' | 'completion'>('recent');

	// Filtered challenges
	const filteredChallenges = $derived.by(() => {
		let filtered = data.challenges;

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.title.toLowerCase().includes(query) ||
					c.description?.toLowerCase().includes(query)
			);
		}

		// Sort
		switch (sortBy) {
			case 'recent':
				filtered = [...filtered].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				break;
			case 'popular':
				filtered = [...filtered].sort(
					(a, b) => b.stats.totalAttempts - a.stats.totalAttempts
				);
				break;
			case 'completion':
				filtered = [...filtered].sort(
					(a, b) => b.stats.completionRate - a.stats.completionRate
				);
				break;
		}

		return filtered;
	});

	function getDifficultyColor(difficulty: string): string {
		switch (difficulty) {
			case 'BEGINNER':
				return 'text-success-600 bg-success-50';
			case 'INTERMEDIATE':
				return 'text-warning-600 bg-warning-50';
			case 'ADVANCED':
				return 'text-danger-600 bg-danger-50';
			default:
				return 'text-neutral-600 bg-neutral-50';
		}
	}

	function getExerciseTypeLabel(type: string): string {
		return type.replace('_', ' ');
	}
</script>

<svelte:head>
	<title>{pageTitle} - Teacher Portal</title>
</svelte:head>

<!-- Header -->
<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-neutral-900">{pageTitle}</h1>
			<p class="mt-1 text-sm text-neutral-500">{pageSubtitle}</p>
		</div>
		<Button
			variant="solid"
			color="primary"
			onclick={() => (window.location.href = '/challenges/create')}
		>
			<Plus class="w-4 h-4 mr-2" />
			{createNewText}
		</Button>
	</div>
</div>

<!-- Stats Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
	<Card variant="elevated" padding="lg">
		<div class="flex items-center">
			<div class="flex-shrink-0 p-3 bg-primary-50 rounded-lg">
				<FileText class="h-6 w-6 text-primary-600" />
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-neutral-500">Total Challenges</p>
				<p class="text-2xl font-bold text-neutral-900">{totalChallenges}</p>
			</div>
		</div>
	</Card>

	<Card variant="elevated" padding="lg">
		<div class="flex items-center">
			<div class="flex-shrink-0 p-3 bg-secondary-50 rounded-lg">
				<Users class="h-6 w-6 text-secondary-600" />
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-neutral-500">Total Students</p>
				<p class="text-2xl font-bold text-neutral-900">{totalStudents}</p>
			</div>
		</div>
	</Card>

	<Card variant="elevated" padding="lg">
		<div class="flex items-center">
			<div class="flex-shrink-0 p-3 bg-success-50 rounded-lg">
				<TrendingUp class="h-6 w-6 text-success-600" />
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-neutral-500">Avg Completion</p>
				<p class="text-2xl font-bold text-neutral-900">{avgCompletionRate}%</p>
			</div>
		</div>
	</Card>
</div>

<!-- Filters and Search -->
<div class="flex flex-col sm:flex-row gap-4 mb-6">
	<div class="flex-1">
		<Input
			type="search"
			bind:value={searchQuery}
			placeholder="Search challenges..."
		/>
	</div>
	<div class="flex gap-2">
		<select
			bind:value={sortBy}
			class="px-4 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
		>
			<option value="recent">Most Recent</option>
			<option value="popular">Most Popular</option>
			<option value="completion">Highest Completion</option>
		</select>
	</div>
</div>

<!-- Challenges Grid -->
{#if filteredChallenges.length === 0}
	<Card variant="outlined" padding="xl" class="text-center">
		<div class="flex flex-col items-center justify-center py-12">
			<FileText class="h-16 w-16 text-neutral-300 mb-4" />
			<h3 class="text-lg font-semibold text-neutral-900 mb-2">{noChallengesText}</h3>
			<p class="text-sm text-neutral-500 mb-6">Create your first vocabulary challenge to get started</p>
			<Button
				variant="solid"
				color="primary"
				onclick={() => (window.location.href = '/challenges/create')}
			>
				<Plus class="w-4 h-4 mr-2" />
				{createNewText}
			</Button>
		</div>
	</Card>
{:else}
	<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
		{#each filteredChallenges as challenge (challenge.id)}
			<Card variant="elevated" padding="lg" hoverable={true}>
				<!-- Header -->
				<div class="flex items-start justify-between mb-4">
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-neutral-900 mb-1 line-clamp-2">
							{challenge.title}
						</h3>
						{#if challenge.description}
							<p class="text-sm text-neutral-500 line-clamp-2">{challenge.description}</p>
						{/if}
					</div>
				</div>

				<!-- Metadata -->
				<div class="flex items-center gap-3 mb-4">
					<span
						class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(
							challenge.difficulty
						)}"
					>
						{challenge.difficulty}
					</span>
					<span class="text-xs text-neutral-500">
						{getExerciseTypeLabel(challenge.exerciseType)}
					</span>
				</div>

				<!-- Stats -->
				<div class="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-neutral-100">
					<div>
						<div class="flex items-center text-neutral-500 text-xs mb-1">
							<FileText class="w-3 h-3 mr-1" />
							{exercisesText}
						</div>
						<p class="text-lg font-semibold text-neutral-900">
							{challenge._count.exercises}
						</p>
					</div>
					<div>
						<div class="flex items-center text-neutral-500 text-xs mb-1">
							<Users class="w-3 h-3 mr-1" />
							{studentsText}
						</div>
						<p class="text-lg font-semibold text-neutral-900">
							{challenge.stats.totalStudents}
						</p>
					</div>
					<div>
						<div class="flex items-center text-neutral-500 text-xs mb-1">
							<CheckCircle class="w-3 h-3 mr-1" />
							{completionRateText}
						</div>
						<p class="text-lg font-semibold text-neutral-900">
							{challenge.stats.completionRate}%
						</p>
					</div>
					<div>
						<div class="flex items-center text-neutral-500 text-xs mb-1">
							<BarChart3 class="w-3 h-3 mr-1" />
							{avgScoreText}
						</div>
						<p class="text-lg font-semibold text-neutral-900">
							{challenge.stats.averageScore}%
						</p>
					</div>
				</div>

				<!-- Assignment Info -->
				<div class="text-xs text-neutral-500 mb-4">
					{#if challenge.stats.classCount > 0}
						<span>{challenge.stats.classCount} class(es)</span>
					{/if}
					{#if challenge.stats.classCount > 0 && challenge.stats.individualCount > 0}
						<span> • </span>
					{/if}
					{#if challenge.stats.individualCount > 0}
						<span>{challenge.stats.individualCount} individual student(s)</span>
					{/if}
					{#if challenge.stats.classCount === 0 && challenge.stats.individualCount === 0}
						<span class="text-warning-600">Not assigned yet</span>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex gap-2">
					<Button
						variant="soft"
						color="primary"
						class="flex-1"
						onclick={() => (window.location.href = `/challenges/${challenge.id}`)}
					>
						<Eye class="w-4 h-4 mr-2" />
						{viewDetailsText}
					</Button>
				</div>

				<!-- Date -->
				<div class="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400">
					<Clock class="w-3 h-3 inline mr-1" />
					{new Date(challenge.createdAt).toLocaleDateString()}
				</div>
			</Card>
		{/each}
	</div>
{/if}
