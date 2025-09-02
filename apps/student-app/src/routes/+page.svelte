<script lang="ts">
	import { AchievementBadge, Button, Card, ProgressBar, XPDisplay } from '@educational-app/ui';
	import { onMount } from 'svelte';

	let studentData = {
		name: 'Max Mustermann',
		class: 'Klasse 3B',
		streak: 5,
		badges: 8,
		points: 450,
		accuracy: 92
	};

	let currentModules = [
		{
			id: 1,
			title: 'Tiere lernen',
			description: 'Deutsche Tiernamen',
			icon: '🐾',
			progress: 60,
			completed: 3,
			total: 5,
			points: 18,
			nextExercise: 'Ordne Tierbilder zu',
			vocab: ['Hund', 'Katze', 'Vogel'],
			isCompleted: false
		},
		{
			id: 2,
			title: 'Farben lernen',
			description: 'Deutsche Farben',
			icon: '🎨',
			progress: 100,
			completed: 4,
			total: 4,
			points: 35,
			nextExercise: 'Modul abgeschlossen!',
			vocab: [],
			isCompleted: true
		}
	];

	let vocabularyReview = [
		{ word: 'Hund', pronunciation: '[hʊnt]' },
		{ word: 'rot', pronunciation: '[roːt]' },
		{ word: 'zwei', pronunciation: '[tsvaɪ]' },
		{ word: 'Katze', pronunciation: '[ˈkatsə]' },
		{ word: 'blau', pronunciation: '[blaʊ]' }
	];

	let achievements = [
		'🎯 Erste Schritte',
		'🔥 Streak Warrior', 
		'📚 Lern-Enthusiast'
	];

	function startExercise(moduleId) {
		alert(`Übung starten für Modul ${moduleId}`);
	}

	function startVocabulary() {
		alert('Vokabel-Session starten');
	}

	function repeatModule(moduleId) {
		alert(`Modul ${moduleId} wiederholen`);
	}

	onMount(() => {
		console.log('🎓 Student Learning App loaded');
		console.log('📊 Connected to Learning Services:');
		console.log('  - LearningService: ✅ Ready');
		console.log('  - VocabularyService: ✅ Ready');
		console.log('  - ProgressService: ✅ Ready');
		console.log('  - AchievementService: ✅ Ready');
	});
</script>

<svelte:head>
	<title>Student Learning App</title>
</svelte:head>

<div class="min-h-screen flex flex-col gap-6 items-center   bg-gradient-to-b from-green-50 to-green-100 p-4">

	<!-- Header -->
	<Card variant="elevated" padding="lg" class="mb-6">
		<div class="flex items-center gap-4 mb-4">
			<div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl">👦</div>
			<div>
				<h2 class="text-xl font-bold font-family-comic text-gray-800">{studentData.name}</h2>
				<p class="text-gray-600 text-sm">{studentData.class} • Heute aktiv</p>
			</div>
		</div>
		<div class="bg-primary-100 rounded-lg p-4">
			<div class="text-primary-800 font-bold text-lg mb-2">🔥 {studentData.streak} Tage Streak!</div>
			<p class="text-primary-700 text-sm">Heute: 3 Übungen abgeschlossen</p>
		</div>
	</Card>

	<!-- Main Content -->
	<div class="space-y-12 max-w-4xl mx-auto">
		<!-- Quick Stats using UI Components -->
		<div class="flex gap-4 mb-6">
			<XPDisplay 
				currentXP={studentData.points} 
				levelXP={300}
				nextLevelXP={600}
				level={3}
				size="lg"
				showLevel={true}
				showProgress={true}
			/>
			<Card variant="default" padding="md" class="text-center">
				<span class="block text-2xl font-bold text-primary-600">{studentData.badges}</span>
				<div class="text-gray-600 text-sm">Abzeichen</div>
			</Card>
			<Card variant="default" padding="md" class="text-center">
				<span class="block text-2xl font-bold text-primary-600">{studentData.accuracy}%</span>
				<div class="text-gray-600 text-sm">Genauigkeit</div>
			</Card>
		</div>

		<!-- Current Modules -->
		<Card variant="elevated" padding="lg">
			<h3 class="text-lg font-bold text-gray-800 mb-4">🎯 Aktuelle Module</h3>
			
			{#each currentModules as module}
				<Card variant="soft" padding="md" class="mb-4">
					<div class="flex items-center gap-3 mb-3">
						<div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl {module.isCompleted ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-blue-100'}">{module.icon}</div>
						<div class="flex-1">
							<h3 class="font-bold text-gray-800">{module.title}</h3>
							<p class="text-gray-600 text-sm">{module.description}</p>
						</div>
					</div>
					<ProgressBar 
						value={module.progress} 
						max={100} 
						label="{module.completed}/{module.total} Übungen"
						showPercentage={true}
					/>
					<div class="flex justify-between text-sm text-gray-600 my-2">
						<span>{module.completed} von {module.total} Übungen</span>
						<span class="font-semibold text-primary-600">{module.points} Punkte</span>
					</div>
					<div class="mt-3">
						<div class="inline-block px-2 py-1 rounded text-xs font-bold text-white mb-2 {module.isCompleted ? 'bg-purple-500' : 'bg-blue-500'}">
							{module.isCompleted ? 'ABGESCHLOSSEN' : 'MATCHING'}
						</div>
						<p class="text-sm mb-2"><strong>{module.isCompleted ? '✅ Modul abgeschlossen!' : 'Nächste Übung:'}</strong> {module.nextExercise}</p>
						{#if module.vocab.length > 0}
							<div class="flex flex-wrap gap-2 mb-2">
								{#each module.vocab as word}
									<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{word}</span>
								{/each}
							</div>
						{/if}
						{#if module.isCompleted}
							<p class="text-sm text-green-600 mt-2">Perfekte Punktzahl erreicht</p>
						{/if}
					</div>
					{#if module.isCompleted}
						<Button 
							variant="solid" 
							color="secondary"
							size="lg" 
							onclick={() => repeatModule(module.id)}
							fullWidth={true}
						>
							Wiederholen
						</Button>
					{:else}
						<Button 
							variant="solid" 
							color="primary"
							size="lg" 
							onclick={() => startExercise(module.id)}
							fullWidth={true}
						>
							Weiter lernen →
						</Button>
					{/if}
				</Card>
			{/each}
		</Card>

		<!-- Vocabulary Review -->
		<Card variant="elevated" padding="lg">
			<h3 class="text-lg font-bold text-gray-800 mb-4">📚 Vokabeln wiederholen</h3>
			<Card variant="soft" padding="md">
				<p class="mb-3"><strong>{vocabularyReview.length} Wörter</strong> sind bereit zur Wiederholung</p>
				<div class="flex flex-wrap gap-2 mb-4">
					{#each vocabularyReview as vocab}
						<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{vocab.word} {vocab.pronunciation}</span>
					{/each}
				</div>
				<Button 
					variant="solid" 
					color="primary"
					size="lg" 
					onclick={startVocabulary}
					fullWidth={true}
				>
					Vokabeln üben
				</Button>
			</Card>
		</Card>

		<!-- Recent Achievements -->
		<Card variant="elevated" padding="lg" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
			<h3 class="text-lg font-bold mb-4">🏆 Letzte Erfolge</h3>
			<div class="flex justify-center gap-4 mb-4">
				<AchievementBadge
					name="Erste Schritte"
					type="MILESTONE"
					isUnlocked={true}
					size="md"
				/>
				<AchievementBadge
					name="Streak Warrior"
					type="STREAK"
					isUnlocked={true}
					size="md"
				/>
				<AchievementBadge
					name="Lern-Enthusiast"
					type="MASTERY"
					isUnlocked={true}
					size="md"
				/>
			</div>
			<p class="text-center text-sm opacity-90">
				Du bist auf Platz 3 in deiner Klasse! 🥉
			</p>
		</Card>

		<div style="height: 80px;"></div> <!-- Space for bottom nav -->
	</div>

	<!-- Bottom Navigation -->
	<Card variant="elevated" class="fixed bottom-0 left-0 right-0 mx-4 mb-4" padding="sm">
		<div class="flex justify-around">
			<a href="#" class="flex flex-col items-center py-2 px-4 text-primary-600 bg-primary-50 rounded-lg">
				<span class="text-2xl mb-1">🏠</span>
				<span class="text-xs font-medium">Start</span>
			</a>
			<a href="#" class="flex flex-col items-center py-2 px-4 text-gray-500 hover:text-primary-600 transition-colors">
				<span class="text-2xl mb-1">📚</span>
				<span class="text-xs font-medium">Module</span>
			</a>
			<a href="#" class="flex flex-col items-center py-2 px-4 text-gray-500 hover:text-primary-600 transition-colors">
				<span class="text-2xl mb-1">🏆</span>
				<span class="text-xs font-medium">Erfolge</span>
			</a>
			<a href="#" class="flex flex-col items-center py-2 px-4 text-gray-500 hover:text-primary-600 transition-colors">
				<span class="text-2xl mb-1">👤</span>
				<span class="text-xs font-medium">Profil</span>
			</a>
		</div>
	</Card>
</div>
