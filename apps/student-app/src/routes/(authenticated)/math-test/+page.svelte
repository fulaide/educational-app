<script lang="ts">
	import { Card, Button, Badge } from '@educational-app/ui'
	import { RefreshCw, Play, Volume2, Check, X, Settings } from 'lucide-svelte'
	import type { MathProblem, MathDifficulty, GermanFeedback } from '@educational-app/learning'
	import { generateProblems, generateLocalFeedback, evaluateAnswer } from '@educational-app/learning'
	import { audioManager } from '$lib/services/audio-manager.svelte'
	import NumericKeypad from '$lib/components/NumericKeypad.svelte'
	import MathProblemDisplay from '$lib/components/MathProblemDisplay.svelte'
	import FeedbackCard from '$lib/components/FeedbackCard.svelte'

	// Test configuration
	let difficulty = $state<MathDifficulty>('easy')
	let problemCount = $state(3)
	let includeZehneruebergang = $state(true)
	let useClaudeApi = $state(true)

	// Test state
	let isLoading = $state(false)
	let generatedProblems = $state<MathProblem[]>([])
	let apiSource = $state<string>('')

	// Single problem test state
	let selectedProblem = $state<MathProblem | null>(null)
	let userInput = $state('')
	let feedback = $state<GermanFeedback | null>(null)
	let showFeedback = $state(false)

	// Audio test state
	let testText = $state('Gut gemacht! Du hast die Aufgabe richtig gelöst.')
	let isAudioLoading = $state(false)
	let audioError = $state<string | null>(null)

	// API status
	let claudeApiStatus = $state<'unknown' | 'available' | 'unavailable'>('unknown')
	let elevenLabsApiStatus = $state<'unknown' | 'available' | 'unavailable'>('unknown')

	// Manual API status check (not automatic to avoid unnecessary API calls)
	async function checkApiStatus() {
		claudeApiStatus = 'unknown'
		elevenLabsApiStatus = 'unknown'

		// Check Claude API by generating 1 problem
		try {
			const response = await fetch('/api/math/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					count: 1,
					difficulty: 'easy',
					includeZehneruebergang: false
				})
			})
			const data = await response.json()
			claudeApiStatus = data.source === 'claude' ? 'available' : 'unavailable'
		} catch {
			claudeApiStatus = 'unavailable'
		}

		// Check ElevenLabs API - use a short test phrase
		try {
			const response = await fetch('/api/math/speak', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: 'Test' })
			})
			elevenLabsApiStatus = response.ok ? 'available' : 'unavailable'
		} catch {
			elevenLabsApiStatus = 'unavailable'
		}
	}

	// Test 1: Problem Generation
	async function testGenerateProblems() {
		isLoading = true
		generatedProblems = []
		apiSource = ''

		try {
			if (useClaudeApi) {
				const response = await fetch('/api/math/generate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						count: problemCount,
						difficulty,
						includeZehneruebergang
					})
				})
				const data = await response.json()
				generatedProblems = data.problems
				apiSource = data.source
			} else {
				generatedProblems = generateProblems({
					count: problemCount,
					difficulty,
					includeZehneruebergang
				})
				apiSource = 'local'
			}
		} catch (err) {
			console.error('Error generating problems:', err)
			apiSource = 'error'
		} finally {
			isLoading = false
		}
	}

	// Test 2: Feedback Generation
	function selectProblemForTest(problem: MathProblem) {
		selectedProblem = problem
		userInput = ''
		feedback = null
		showFeedback = false
	}

	function handleDigitInput(digit: string) {
		if (showFeedback) return
		if (userInput.length < 3) {
			userInput += digit
		}
	}

	function handleDelete() {
		if (showFeedback) return
		userInput = userInput.slice(0, -1)
	}

	async function testEvaluateAnswer() {
		if (!selectedProblem || !userInput) return

		const answer = parseInt(userInput, 10)

		if (useClaudeApi) {
			try {
				const response = await fetch('/api/math/evaluate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						problem: selectedProblem,
						userAnswer: answer
					})
				})
				feedback = await response.json()
			} catch {
				feedback = generateLocalFeedback(selectedProblem, answer)
			}
		} else {
			feedback = generateLocalFeedback(selectedProblem, answer)
		}

		showFeedback = true
	}

	function resetFeedbackTest() {
		userInput = ''
		feedback = null
		showFeedback = false
	}

	// Test 3: Audio
	async function testAudio() {
		if (!testText) return

		isAudioLoading = true
		audioError = null

		try {
			await audioManager.speakText(testText)
		} catch (err) {
			audioError = 'Audio konnte nicht abgespielt werden'
		} finally {
			isAudioLoading = false
		}
	}

	function stopAudio() {
		audioManager.stop()
	}

	// Status badge helper
	function getStatusColor(status: string): 'success' | 'danger' | 'warning' {
		if (status === 'available') return 'success'
		if (status === 'unavailable') return 'danger'
		return 'warning'
	}
</script>

<div class="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-8">
	<!-- Header -->
	<div class="text-center">
		<h1 class="text-2xl font-bold text-neutral-900 mb-2">
			Math Challenge API Test
		</h1>
		<p class="text-neutral-600">Test and debug the math challenge APIs</p>
	</div>

	<!-- API Status -->
	<Card class="p-6">
		<h2 class="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
			<Settings class="w-5 h-5" />
			API Status
		</h2>

		<div class="grid grid-cols-2 gap-4">
			<div class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
				<span class="text-sm font-medium">Claude API</span>
				<Badge variant={getStatusColor(claudeApiStatus)}>
					{claudeApiStatus}
				</Badge>
			</div>
			<div class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
				<span class="text-sm font-medium">ElevenLabs API</span>
				<Badge variant={getStatusColor(elevenLabsApiStatus)}>
					{elevenLabsApiStatus}
				</Badge>
			</div>
		</div>

		<Button variant="ghost" size="sm" onclick={checkApiStatus} class="mt-4">
			<RefreshCw class="w-4 h-4 mr-2" />
			Refresh Status
		</Button>
	</Card>

	<!-- Test 1: Problem Generation -->
	<Card class="p-6">
		<h2 class="font-semibold text-neutral-900 mb-4">1. Problem Generation</h2>

		<!-- Config -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
			<div>
				<label class="block text-sm font-medium text-neutral-700 mb-1">Difficulty</label>
				<select
					bind:value={difficulty}
					class="w-full px-3 py-2 border rounded-lg bg-white"
				>
					<option value="easy">Easy (1-20)</option>
					<option value="medium">Medium (1-50)</option>
					<option value="hard">Hard (1-100)</option>
				</select>
			</div>

			<div>
				<label class="block text-sm font-medium text-neutral-700 mb-1">Count</label>
				<select
					bind:value={problemCount}
					class="w-full px-3 py-2 border rounded-lg bg-white"
				>
					<option value={3}>3</option>
					<option value={5}>5</option>
					<option value={10}>10</option>
				</select>
			</div>

			<div class="flex items-end">
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={includeZehneruebergang} class="w-4 h-4" />
					<span class="text-sm">Zehnerübergang</span>
				</label>
			</div>

			<div class="flex items-end">
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={useClaudeApi} class="w-4 h-4" />
					<span class="text-sm">Use Claude API</span>
				</label>
			</div>
		</div>

		<Button variant="solid" onclick={testGenerateProblems} loading={isLoading}>
			<Play class="w-4 h-4 mr-2" />
			Generate Problems
		</Button>

		<!-- Results -->
		{#if generatedProblems.length > 0}
			<div class="mt-4 p-4 bg-neutral-50 rounded-lg">
				<div class="flex items-center justify-between mb-3">
					<span class="text-sm font-medium">
						Generated {generatedProblems.length} problems
					</span>
					<Badge variant={apiSource === 'claude' ? 'success' : 'primary'}>
						Source: {apiSource}
					</Badge>
				</div>

				<div class="space-y-2 max-h-60 overflow-y-auto">
					{#each generatedProblems as problem}
						<button
							onclick={() => selectProblemForTest(problem)}
							class="w-full text-left p-3 bg-white rounded border hover:border-primary-300 transition-colors"
						>
							<div class="flex items-center justify-between">
								<span class="font-mono text-lg">{problem.display}</span>
								<div class="flex gap-2">
									{#if problem.hasZehneruebergang}
										<Badge variant="warning">ZÜ</Badge>
									{/if}
									<Badge variant="primary">
										{problem.type}
									</Badge>
								</div>
							</div>
							<p class="text-xs text-neutral-500 mt-1">
								Answer: {problem.correctAnswer}
							</p>
						</button>
					{/each}
				</div>

				<!-- Raw JSON -->
				<details class="mt-4">
					<summary class="text-sm text-neutral-600 cursor-pointer">Show Raw JSON</summary>
					<pre class="mt-2 p-3 bg-neutral-900 text-neutral-100 rounded text-xs overflow-x-auto">
{JSON.stringify(generatedProblems, null, 2)}
					</pre>
				</details>
			</div>
		{/if}
	</Card>

	<!-- Test 2: Feedback Testing -->
	<Card class="p-6">
		<h2 class="font-semibold text-neutral-900 mb-4">2. Feedback Testing</h2>

		{#if selectedProblem}
			<div class="space-y-4">
				<MathProblemDisplay
					problem={selectedProblem}
					userInput={userInput}
					showCorrectAnswer={showFeedback && feedback && !feedback.isCorrect}
					isCorrect={showFeedback ? feedback?.isCorrect ?? null : null}
				/>

				{#if !showFeedback}
					<NumericKeypad
						currentValue={userInput}
						onInput={handleDigitInput}
						onDelete={handleDelete}
						onSubmit={testEvaluateAnswer}
					/>
				{:else if feedback}
					<FeedbackCard {feedback} />

					<div class="flex justify-center">
						<Button variant="outline" onclick={resetFeedbackTest}>
							Try Another Answer
						</Button>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-neutral-600 text-center py-8">
				Generate problems above and click one to test feedback
			</p>
		{/if}
	</Card>

	<!-- Test 3: Audio Testing -->
	<Card class="p-6">
		<h2 class="font-semibold text-neutral-900 mb-4">3. Audio Testing (ElevenLabs)</h2>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-neutral-700 mb-1">
					Text to speak (German)
				</label>
				<textarea
					bind:value={testText}
					rows={3}
					class="w-full px-3 py-2 border rounded-lg resize-none"
					placeholder="Enter German text..."
				></textarea>
			</div>

			<div class="flex gap-3">
				<Button
					variant="solid"
					onclick={testAudio}
					loading={isAudioLoading}
					disabled={!testText || audioManager.isPlaying}
				>
					<Volume2 class="w-4 h-4 mr-2" />
					Play Audio
				</Button>

				{#if audioManager.isPlaying}
					<Button variant="outline" onclick={stopAudio}>
						Stop
					</Button>
				{/if}
			</div>

			{#if audioError}
				<p class="text-sm text-danger-600">{audioError}</p>
			{/if}

			{#if audioManager.error}
				<p class="text-sm text-danger-600">{audioManager.error}</p>
			{/if}
		</div>
	</Card>

	<!-- Test 4: Mini Session -->
	<Card class="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
		<h2 class="font-semibold text-neutral-900 mb-4">4. Integrated Flow Test</h2>
		<p class="text-neutral-600 mb-4">
			Run a complete mini-session with 3 problems to test the full flow.
		</p>
		<Button variant="solid" color="primary" onclick={() => window.location.href = '/math-challenge'}>
			Start Mini Session
		</Button>
	</Card>
</div>
