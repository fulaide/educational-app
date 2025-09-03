<script lang="ts">
  import type { SpellingExerciseContent, ExerciseAttempt, ExerciseFeedback } from '../../types'
  import { createEventDispatcher } from 'svelte'

  export let content: SpellingExerciseContent
  export let exerciseId: string
  export let studentId: string
  export let isSubmitted = false
  export let feedback: ExerciseFeedback | null = null

  const dispatch = createEventDispatcher<{
    submit: ExerciseAttempt
    retry: void
    hint: void
  }>()

  let userInput = ''
  let showHint = false
  let hintsUsed = 0
  let startTime = Date.now()
  let inputElement: HTMLInputElement

  function submitExercise() {
    if (!userInput.trim()) return

    const answers = {
      type: 'SPELLING',
      userInput: userInput.trim(),
      hintsUsed
    }

    const attempt: ExerciseAttempt = {
      exerciseId,
      studentId,
      answers,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      startedAt: new Date(startTime),
      completedAt: new Date(),
      hints: showHint ? [getHintText()] : []
    }

    dispatch('submit', attempt)
  }

  function retry() {
    userInput = ''
    showHint = false
    hintsUsed = 0
    startTime = Date.now()
    dispatch('retry')
    // Focus input after retry
    setTimeout(() => inputElement?.focus(), 100)
  }

  function requestHint() {
    if (content.hints && content.hints.length > hintsUsed) {
      showHint = true
      hintsUsed++
      dispatch('hint')
    }
  }

  function getHintText(): string {
    if (!content.hints || hintsUsed === 0) return ''
    return content.hints[Math.min(hintsUsed - 1, content.hints.length - 1)]
  }

  function playAudio() {
    if (content.audioUrl) {
      const audio = new Audio(content.audioUrl)
      audio.play().catch(error => {
        console.warn('Audio playback failed:', error)
      })
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !isSubmitted) {
      submitExercise()
    }
  }

  function getInputValidation(): 'correct' | 'incorrect' | 'partial' | 'neutral' {
    if (!feedback || !isSubmitted) return 'neutral'
    
    if (feedback.isCorrect) return 'correct'
    
    // Check for partial correctness (case-insensitive comparison)
    const userAnswer = userInput.toLowerCase().trim()
    const correctAnswer = content.correctAnswer.toLowerCase().trim()
    
    if (userAnswer.length > 0 && correctAnswer.includes(userAnswer)) {
      return 'partial'
    }
    
    return 'incorrect'
  }

  function getCharacterFeedback(index: number): 'correct' | 'incorrect' | 'missing' | 'extra' {
    if (!feedback || !isSubmitted) return 'correct'
    
    const userChar = userInput[index]?.toLowerCase()
    const correctChar = content.correctAnswer[index]?.toLowerCase()
    
    if (index >= content.correctAnswer.length) return 'extra'
    if (index >= userInput.length) return 'missing'
    if (userChar === correctChar) return 'correct'
    return 'incorrect'
  }

  function showCharacterByCharacter(): boolean {
    return content.showCharacterFeedback && feedback && isSubmitted
  }

  $: canSubmit = userInput.trim().length > 0 && !isSubmitted
  $: hasHints = content.hints && content.hints.length > 0
  $: canUseHint = hasHints && hintsUsed < content.hints!.length && !isSubmitted
  $: maxLength = content.maxLength || content.correctAnswer.length + 10
</script>

<div class="spelling-exercise">
  <div class="exercise-header">
    <h3 class="exercise-title">{content.title || 'Spell the word'}</h3>
    {#if content.instructions}
      <p class="exercise-instructions">{content.instructions}</p>
    {/if}
  </div>

  <!-- Prompt section -->
  <div class="prompt-section">
    {#if content.prompt.type === 'TEXT'}
      <div class="prompt-text">
        <span class="prompt-label">Word to spell:</span>
        <span class="prompt-content">{content.prompt.content}</span>
      </div>
    {:else if content.prompt.type === 'IMAGE'}
      <div class="prompt-image">
        <span class="prompt-label">What is this?</span>
        <img 
          src={content.prompt.content} 
          alt={content.prompt.alt || 'Image to spell'} 
          class="prompt-img"
        />
      </div>
    {:else if content.prompt.type === 'AUDIO'}
      <div class="prompt-audio">
        <span class="prompt-label">Listen and spell:</span>
        <button 
          class="audio-btn"
          on:click={playAudio}
          aria-label="Play audio"
        >
          🔊 Play Audio
        </button>
      </div>
    {/if}

    {#if content.audioUrl && content.prompt.type !== 'AUDIO'}
      <button 
        class="pronunciation-btn"
        on:click={playAudio}
        aria-label="Listen to pronunciation"
      >
        🎵 Pronunciation
      </button>
    {/if}
  </div>

  <!-- Input section -->
  <div class="input-section">
    <div class="input-container" class:correct={getInputValidation() === 'correct'}
         class:incorrect={getInputValidation() === 'incorrect'}
         class:partial={getInputValidation() === 'partial'}>
      
      {#if showCharacterByCharacter()}
        <!-- Character-by-character feedback -->
        <div class="character-feedback">
          {#each Array.from({ length: Math.max(userInput.length, content.correctAnswer.length) }) as _, index}
            <span 
              class="character"
              class:correct={getCharacterFeedback(index) === 'correct'}
              class:incorrect={getCharacterFeedback(index) === 'incorrect'}
              class:missing={getCharacterFeedback(index) === 'missing'}
              class:extra={getCharacterFeedback(index) === 'extra'}
            >
              {userInput[index] || (getCharacterFeedback(index) === 'missing' ? '_' : '')}
            </span>
          {/each}
        </div>
        
        <!-- Show correct answer -->
        <div class="correct-answer">
          <span class="correct-label">Correct spelling:</span>
          <span class="correct-text">{content.correctAnswer}</span>
        </div>
      {:else}
        <!-- Regular input -->
        <input
          bind:this={inputElement}
          bind:value={userInput}
          type="text"
          class="spelling-input"
          placeholder="Type your answer here..."
          disabled={isSubmitted}
          maxlength={maxLength}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          on:keydown={handleKeydown}
          aria-label="Enter the spelling"
        />
      {/if}
      
      <!-- Input length indicator -->
      <div class="input-info">
        <span class="char-count" class:warning={userInput.length > content.correctAnswer.length + 5}>
          {userInput.length} / {maxLength} characters
        </span>
        {#if content.correctAnswer.length > 0}
          <span class="expected-length">
            Expected: {content.correctAnswer.length} letters
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Hint section -->
  {#if hasHints}
    <div class="hint-section">
      <button 
        class="hint-btn"
        on:click={requestHint}
        disabled={!canUseHint}
        aria-label="Get a hint"
      >
        💡 Hint ({hintsUsed}/{content.hints?.length || 0})
      </button>
      
      {#if showHint && hintsUsed > 0}
        <div class="hint-display">
          <span class="hint-icon">💡</span>
          <span class="hint-text">{getHintText()}</span>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Progress indicators -->
  <div class="progress-section">
    {#if content.allowPartialCredit && !isSubmitted}
      <div class="confidence-indicator">
        <span class="confidence-text">
          Confidence: {Math.min(100, Math.round((userInput.length / content.correctAnswer.length) * 100))}%
        </span>
        <div class="confidence-bar">
          <div 
            class="confidence-fill"
            style="width: {Math.min(100, (userInput.length / content.correctAnswer.length) * 100)}%"
          ></div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Feedback section -->
  {#if feedback}
    <div class="feedback-section" class:success={feedback.isCorrect} class:error={!feedback.isCorrect}>
      <h4 class="feedback-title">
        {#if feedback.isCorrect}
          🎉 Perfect spelling!
        {:else if getInputValidation() === 'partial'}
          🤔 Close, but not quite right
        {:else}
          ❌ Try again
        {/if}
      </h4>
      
      <p class="feedback-message">{feedback.message}</p>
      
      {#if feedback.explanation}
        <p class="feedback-explanation">{feedback.explanation}</p>
      {/if}

      {#if !feedback.isCorrect && content.showCorrectAnswer}
        <div class="correct-answer-section">
          <span class="correct-label">Correct answer:</span>
          <span class="correct-spelling">{content.correctAnswer}</span>
          {#if content.phonetic}
            <span class="phonetic">/{content.phonetic}/</span>
          {/if}
        </div>
      {/if}

      {#if feedback.improvementTips && feedback.improvementTips.length > 0}
        <div class="improvement-tips">
          <h5>📝 Spelling tips:</h5>
          <ul>
            {#each feedback.improvementTips as tip}
              <li>{tip}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Action buttons -->
  <div class="action-buttons">
    {#if !isSubmitted}
      <button 
        class="submit-btn primary-btn"
        on:click={submitExercise}
        disabled={!canSubmit}
      >
        Check Spelling
      </button>
    {:else}
      <button 
        class="retry-btn secondary-btn"
        on:click={retry}
      >
        Try Again
      </button>
      
      {#if content.audioUrl}
        <button 
          class="audio-btn secondary-btn"
          on:click={playAudio}
          aria-label="Play pronunciation again"
        >
          🔊 Listen Again
        </button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .spelling-exercise {
    max-width: 600px;
    margin: 0 auto;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .exercise-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .exercise-title {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .exercise-instructions {
    color: #666;
    font-size: 1rem;
  }

  .prompt-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
  }

  .prompt-label {
    display: block;
    font-weight: 600;
    color: #555;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .prompt-content {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2196F3;
  }

  .prompt-img {
    max-width: 100%;
    max-height: 150px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .audio-btn, .pronunciation-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 1rem;
  }

  .audio-btn:hover, .pronunciation-btn:hover {
    background: #45a049;
  }

  .input-section {
    margin-bottom: 2rem;
  }

  .input-container {
    position: relative;
    background: white;
    border-radius: 8px;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    transition: border-color 0.2s ease;
  }

  .input-container.correct {
    border-color: #4CAF50;
    background: #f1f8e9;
  }

  .input-container.incorrect {
    border-color: #f44336;
    background: #ffebee;
  }

  .input-container.partial {
    border-color: #ff9800;
    background: #fff8e1;
  }

  .spelling-input {
    width: 100%;
    padding: 16px;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    background: transparent;
    outline: none;
    text-align: center;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  }

  .spelling-input::placeholder {
    color: #aaa;
    font-weight: 400;
  }

  .character-feedback {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 1rem;
  }

  .character {
    font-size: 2rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    padding: 8px;
    border-radius: 4px;
    min-width: 40px;
    text-align: center;
    transition: all 0.2s ease;
  }

  .character.correct {
    background: #e8f5e8;
    color: #2e7d32;
    border: 2px solid #4CAF50;
  }

  .character.incorrect {
    background: #ffebee;
    color: #c62828;
    border: 2px solid #f44336;
  }

  .character.missing {
    background: #fff3e0;
    color: #ef6c00;
    border: 2px dashed #ff9800;
  }

  .character.extra {
    background: #f3e5f5;
    color: #7b1fa2;
    border: 2px solid #9c27b0;
  }

  .input-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .char-count.warning {
    color: #f44336;
    font-weight: 600;
  }

  .hint-section {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .hint-btn {
    background: #ff9800;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .hint-btn:hover:not(:disabled) {
    background: #f57c00;
  }

  .hint-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .hint-display {
    margin-top: 1rem;
    padding: 1rem;
    background: #fff8e1;
    border-left: 4px solid #ff9800;
    border-radius: 4px;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .hint-icon {
    font-size: 1.2rem;
  }

  .hint-text {
    color: #333;
    font-style: italic;
  }

  .progress-section {
    margin-bottom: 1.5rem;
  }

  .confidence-indicator {
    text-align: center;
  }

  .confidence-text {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .confidence-bar {
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
  }

  .confidence-fill {
    height: 100%;
    background: linear-gradient(90deg, #f44336, #ff9800, #4CAF50);
    transition: width 0.3s ease;
  }

  .feedback-section {
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .feedback-section.success {
    background: #e8f5e8;
    border-left: 4px solid #4CAF50;
  }

  .feedback-section.error {
    background: #ffebee;
    border-left: 4px solid #f44336;
  }

  .feedback-title {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .correct-answer, .correct-answer-section {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    text-align: center;
  }

  .correct-label {
    font-weight: 600;
    color: #555;
    margin-right: 0.5rem;
  }

  .correct-text, .correct-spelling {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2e7d32;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }

  .phonetic {
    margin-left: 0.5rem;
    font-style: italic;
    color: #666;
  }

  .improvement-tips h5 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  .improvement-tips ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .improvement-tips li {
    margin-bottom: 0.25rem;
    color: #666;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .primary-btn, .secondary-btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .primary-btn {
    background: #4CAF50;
    color: white;
  }

  .primary-btn:hover:not(:disabled) {
    background: #45a049;
    transform: translateY(-1px);
  }

  .primary-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .secondary-btn {
    background: #f0f0f0;
    color: #333;
    border: 2px solid #ddd;
  }

  .secondary-btn:hover {
    background: #e0e0e0;
    border-color: #bbb;
  }

  @media (max-width: 768px) {
    .spelling-exercise {
      padding: 1rem;
    }
    
    .spelling-input {
      font-size: 1.2rem;
      padding: 12px;
    }
    
    .character {
      font-size: 1.5rem;
      min-width: 30px;
      padding: 6px;
    }
  }
</style>