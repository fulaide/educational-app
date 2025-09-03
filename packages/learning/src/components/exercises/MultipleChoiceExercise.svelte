<script lang="ts">
  import type { MultipleChoiceExerciseContent, ExerciseAttempt, ExerciseFeedback } from '../../types'
  import { createEventDispatcher } from 'svelte'

  export let content: MultipleChoiceExerciseContent
  export let exerciseId: string
  export let studentId: string
  export let isSubmitted = false
  export let feedback: ExerciseFeedback | null = null

  const dispatch = createEventDispatcher<{
    submit: ExerciseAttempt
    retry: void
  }>()

  let selectedAnswers: string[] = []
  let startTime = Date.now()
  let shuffledOptions = content.shuffleOptions 
    ? [...content.options].sort(() => Math.random() - 0.5)
    : content.options

  function toggleAnswer(optionId: string) {
    if (isSubmitted) return

    if (content.allowMultiple) {
      // Multiple selection allowed
      if (selectedAnswers.includes(optionId)) {
        selectedAnswers = selectedAnswers.filter(id => id !== optionId)
      } else {
        selectedAnswers = [...selectedAnswers, optionId]
      }
    } else {
      // Single selection only
      selectedAnswers = [optionId]
    }
  }

  function submitExercise() {
    if (selectedAnswers.length === 0) return

    const answers = {
      type: 'MULTIPLE_CHOICE',
      selectedOptions: selectedAnswers
    }

    const attempt: ExerciseAttempt = {
      exerciseId,
      studentId,
      answers,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      startedAt: new Date(startTime),
      completedAt: new Date()
    }

    dispatch('submit', attempt)
  }

  function retry() {
    selectedAnswers = []
    startTime = Date.now()
    // Re-shuffle if enabled
    if (content.shuffleOptions) {
      shuffledOptions = [...content.options].sort(() => Math.random() - 0.5)
    }
    dispatch('retry')
  }

  function getOptionStatus(optionId: string): 'correct' | 'incorrect' | 'neutral' {
    if (!feedback || !isSubmitted) return 'neutral'
    
    const option = content.options.find(o => o.id === optionId)
    const isSelected = selectedAnswers.includes(optionId)
    
    if (option?.isCorrect && isSelected) return 'correct'
    if (!option?.isCorrect && isSelected) return 'incorrect'
    if (option?.isCorrect && !isSelected) return 'correct' // Show correct answers
    
    return 'neutral'
  }

  function handleKeydown(event: KeyboardEvent, optionId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleAnswer(optionId)
    }
  }

  $: canSubmit = selectedAnswers.length > 0 && !isSubmitted
  $: correctAnswers = content.options.filter(o => o.isCorrect).length
  $: selectedCorrectAnswers = selectedAnswers.filter(id => 
    content.options.find(o => o.id === id)?.isCorrect
  ).length
</script>

<div class="multiple-choice-exercise">
  <div class="exercise-header">
    <h3 class="exercise-title">{content.title || 'Choose the correct answer'}</h3>
    {#if content.instructions}
      <p class="exercise-instructions">{content.instructions}</p>
    {/if}
  </div>

  <!-- Question content -->
  <div class="question-section">
    {#if content.question.type === 'TEXT'}
      <div class="question-text">
        {content.question.content}
      </div>
    {:else if content.question.type === 'IMAGE'}
      <div class="question-image">
        <img 
          src={content.question.content} 
          alt={content.question.alt || 'Question image'} 
          class="question-img"
        />
      </div>
    {:else if content.question.type === 'AUDIO'}
      <div class="question-audio">
        <audio 
          controls 
          src={content.question.content}
          aria-label="Listen to the question"
        >
          Your browser doesn't support audio playback.
        </audio>
      </div>
    {/if}
  </div>

  <!-- Selection type indicator -->
  <div class="selection-info">
    {#if content.allowMultiple}
      <span class="selection-hint">
        📝 Select {correctAnswers > 1 ? 'all correct answers' : 'the correct answer'} 
        ({correctAnswers} correct)
      </span>
    {:else}
      <span class="selection-hint">
        🎯 Select one answer
      </span>
    {/if}
  </div>

  <!-- Answer options -->
  <div class="options-container">
    {#each shuffledOptions as option, index}
      <div 
        class="option-item" 
        class:selected={selectedAnswers.includes(option.id)}
        class:correct={getOptionStatus(option.id) === 'correct'}
        class:incorrect={getOptionStatus(option.id) === 'incorrect'}
        class:disabled={isSubmitted}
        on:click={() => toggleAnswer(option.id)}
        on:keydown={(e) => handleKeydown(e, option.id)}
        tabindex={isSubmitted ? -1 : 0}
        role="button"
        aria-pressed={selectedAnswers.includes(option.id)}
        aria-label="Option {index + 1}: {option.content.content}"
      >
        <div class="option-indicator">
          {#if content.allowMultiple}
            <div class="checkbox" class:checked={selectedAnswers.includes(option.id)}>
              {#if selectedAnswers.includes(option.id)}
                ✓
              {/if}
            </div>
          {:else}
            <div class="radio" class:selected={selectedAnswers.includes(option.id)}>
              {#if selectedAnswers.includes(option.id)}
                <div class="radio-dot"></div>
              {/if}
            </div>
          {/if}
        </div>

        <div class="option-content">
          {#if option.content.type === 'TEXT'}
            <span class="option-text">{option.content.content}</span>
          {:else if option.content.type === 'IMAGE'}
            <img 
              src={option.content.content} 
              alt={option.content.alt || `Option ${index + 1}`} 
              class="option-image"
            />
          {:else if option.content.type === 'AUDIO'}
            <audio 
              controls 
              src={option.content.content}
              aria-label="Listen to option {index + 1}"
            >
              Audio not supported
            </audio>
          {/if}
        </div>

        {#if isSubmitted && feedback}
          <div class="option-feedback">
            {#if option.isCorrect}
              <span class="correct-indicator" aria-label="Correct answer">✅</span>
            {:else if selectedAnswers.includes(option.id)}
              <span class="incorrect-indicator" aria-label="Incorrect choice">❌</span>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Progress indicator -->
  {#if content.allowMultiple}
    <div class="progress-indicator">
      <span class="progress-text">
        {selectedAnswers.length} of {correctAnswers} answers selected
      </span>
      <div class="progress-bar">
        <div 
          class="progress-fill"
          style="width: {Math.min((selectedAnswers.length / correctAnswers) * 100, 100)}%"
        ></div>
      </div>
    </div>
  {/if}

  <!-- Feedback section -->
  {#if feedback}
    <div class="feedback-section" class:success={feedback.isCorrect} class:error={!feedback.isCorrect}>
      <h4 class="feedback-title">
        {feedback.isCorrect ? '🎉 Excellent!' : '🤔 Not quite right'}
      </h4>
      <p class="feedback-message">{feedback.message}</p>
      
      {#if feedback.explanation}
        <p class="feedback-explanation">{feedback.explanation}</p>
      {/if}

      {#if content.allowMultiple && isSubmitted}
        <div class="score-breakdown">
          <p class="score-text">
            Score: {selectedCorrectAnswers}/{correctAnswers} correct answers
          </p>
        </div>
      {/if}

      {#if feedback.improvementTips && feedback.improvementTips.length > 0}
        <div class="improvement-tips">
          <h5>💡 Tips for improvement:</h5>
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
        Submit Answer{selectedAnswers.length > 1 ? 's' : ''}
      </button>
    {:else}
      <button 
        class="retry-btn secondary-btn"
        on:click={retry}
      >
        Try Again
      </button>
    {/if}
  </div>
</div>

<style>
  .multiple-choice-exercise {
    max-width: 700px;
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

  .question-section {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
  }

  .question-text {
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
  }

  .question-img {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
  }

  .question-audio audio {
    width: 100%;
    max-width: 400px;
  }

  .selection-info {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .selection-hint {
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    display: inline-block;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .option-item:hover:not(.disabled) {
    border-color: #2196F3;
    background: #f3f8ff;
    transform: translateX(4px);
  }

  .option-item.selected {
    border-color: #2196F3;
    background: #e3f2fd;
  }

  .option-item.correct {
    border-color: #4CAF50;
    background: #e8f5e8;
  }

  .option-item.incorrect {
    border-color: #f44336;
    background: #ffebee;
  }

  .option-item.disabled {
    cursor: not-allowed;
  }

  .option-indicator {
    flex-shrink: 0;
  }

  .checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  .checkbox.checked {
    background: #4CAF50;
    border-color: #4CAF50;
    color: white;
  }

  .radio {
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .radio.selected {
    border-color: #2196F3;
  }

  .radio-dot {
    width: 10px;
    height: 10px;
    background: #2196F3;
    border-radius: 50%;
  }

  .option-content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .option-text {
    font-size: 1.1rem;
    color: #333;
  }

  .option-image {
    max-width: 100px;
    max-height: 60px;
    object-fit: contain;
    border-radius: 4px;
  }

  .option-feedback {
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .correct-indicator, .incorrect-indicator {
    font-size: 1.2rem;
  }

  .progress-indicator {
    margin-bottom: 1.5rem;
  }

  .progress-text {
    display: block;
    text-align: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #45a049);
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

  .feedback-message {
    margin-bottom: 0.5rem;
    color: #333;
  }

  .feedback-explanation {
    font-style: italic;
    color: #666;
    margin-bottom: 1rem;
  }

  .score-breakdown {
    margin-bottom: 1rem;
  }

  .score-text {
    font-weight: 600;
    color: #333;
    background: rgba(0, 0, 0, 0.05);
    padding: 0.5rem;
    border-radius: 4px;
    display: inline-block;
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
    .multiple-choice-exercise {
      padding: 1rem;
    }
    
    .option-item {
      padding: 0.75rem;
    }
    
    .option-text {
      font-size: 1rem;
    }
    
    .question-text {
      font-size: 1.1rem;
    }
  }
</style>