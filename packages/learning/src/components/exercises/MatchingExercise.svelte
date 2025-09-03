<script lang="ts">
  import type { MatchingExerciseContent, ExerciseAttempt, ExerciseFeedback } from '../../types'
  import { createEventDispatcher } from 'svelte'

  export let content: MatchingExerciseContent
  export let exerciseId: string
  export let studentId: string
  export let isSubmitted = false
  export let feedback: ExerciseFeedback | null = null

  const dispatch = createEventDispatcher<{
    submit: ExerciseAttempt
    retry: void
  }>()

  let selectedPairs: Array<{ leftId: string, rightId: string }> = []
  let draggedItem: { id: string, side: 'left' | 'right' } | null = null
  let startTime = Date.now()
  let shuffledRightItems = content.shuffleOptions 
    ? [...content.pairs.map(p => ({ ...p.right, pairId: p.id }))]
        .sort(() => Math.random() - 0.5)
    : content.pairs.map(p => ({ ...p.right, pairId: p.id }))

  function handleDragStart(event: DragEvent, itemId: string, side: 'left' | 'right') {
    draggedItem = { id: itemId, side }
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', itemId)
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  function handleDrop(event: DragEvent, targetId: string, targetSide: 'left' | 'right') {
    event.preventDefault()
    
    if (!draggedItem) return
    
    // Only allow matching between different sides
    if (draggedItem.side === targetSide) return
    
    const leftId = draggedItem.side === 'left' ? draggedItem.id : targetId
    const rightId = draggedItem.side === 'right' ? draggedItem.id : targetId
    
    // Remove any existing pairs with these items
    selectedPairs = selectedPairs.filter(pair => 
      pair.leftId !== leftId && pair.rightId !== rightId
    )
    
    // Add new pair
    selectedPairs = [...selectedPairs, { leftId, rightId }]
    
    draggedItem = null
  }

  function handleClick(itemId: string, side: 'left' | 'right') {
    // Simple click-to-match interface for mobile/accessibility
    const existingSelection = selectedPairs.find(pair => 
      pair.leftId === itemId || pair.rightId === itemId
    )
    
    if (existingSelection) {
      // Remove existing pair
      selectedPairs = selectedPairs.filter(pair => pair !== existingSelection)
    } else {
      // Try to create new pair with first unmatched item from opposite side
      if (side === 'left') {
        const availableRight = shuffledRightItems.find(item => 
          !selectedPairs.some(pair => pair.rightId === item.pairId)
        )
        if (availableRight) {
          selectedPairs = [...selectedPairs, { leftId: itemId, rightId: availableRight.pairId }]
        }
      } else {
        const availableLeft = content.pairs.find(pair => 
          !selectedPairs.some(p => p.leftId === pair.id)
        )
        if (availableLeft) {
          selectedPairs = [...selectedPairs, { leftId: availableLeft.id, rightId: itemId }]
        }
      }
    }
  }

  function removePair(pairToRemove: { leftId: string, rightId: string }) {
    selectedPairs = selectedPairs.filter(pair => 
      !(pair.leftId === pairToRemove.leftId && pair.rightId === pairToRemove.rightId)
    )
  }

  function submitExercise() {
    if (selectedPairs.length === 0) return

    const answers = {
      type: 'MATCHING',
      pairs: selectedPairs
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
    selectedPairs = []
    startTime = Date.now()
    dispatch('retry')
  }

  function isPairSelected(itemId: string): boolean {
    return selectedPairs.some(pair => 
      pair.leftId === itemId || pair.rightId === itemId
    )
  }

  function getMatchedItem(itemId: string, side: 'left' | 'right'): string | null {
    const pair = selectedPairs.find(p => 
      side === 'left' ? p.leftId === itemId : p.rightId === itemId
    )
    return pair ? (side === 'left' ? pair.rightId : pair.leftId) : null
  }

  function isCorrectPair(leftId: string, rightId: string): boolean | null {
    if (!feedback) return null
    const correctPair = content.pairs.find(p => p.id === leftId)
    return correctPair ? correctPair.id === rightId : false
  }
</script>

<div class="matching-exercise">
  <div class="exercise-header">
    <h3 class="exercise-title">{content.title || 'Match the pairs'}</h3>
    {#if content.instructions}
      <p class="exercise-instructions">{content.instructions}</p>
    {/if}
  </div>

  <div class="matching-container">
    <!-- Left side items -->
    <div class="matching-column left-column">
      <h4 class="column-header">Items</h4>
      {#each content.pairs as pair}
        <div 
          class="matching-item left-item" 
          class:selected={isPairSelected(pair.id)}
          class:correct={feedback && isCorrectPair(pair.id, getMatchedItem(pair.id, 'left') || '')}
          class:incorrect={feedback && selectedPairs.some(p => p.leftId === pair.id) && !isCorrectPair(pair.id, getMatchedItem(pair.id, 'left') || '')}
          draggable="true"
          on:dragstart={(e) => handleDragStart(e, pair.id, 'left')}
          on:click={() => handleClick(pair.id, 'left')}
          on:keydown={(e) => e.key === 'Enter' && handleClick(pair.id, 'left')}
          tabindex="0"
          role="button"
          aria-label="Drag or click to match: {pair.left.content}"
        >
          {#if pair.left.type === 'TEXT'}
            <span class="text-content">{pair.left.content}</span>
          {:else if pair.left.type === 'IMAGE'}
            <img 
              src={pair.left.content} 
              alt={pair.left.alt || 'Matching item'} 
              class="image-content"
            />
          {/if}
          
          {#if isPairSelected(pair.id)}
            <div class="connection-line"></div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Connection area -->
    <div class="connection-area">
      {#each selectedPairs as pair}
        <div class="pair-connection">
          <button 
            class="remove-pair-btn"
            on:click={() => removePair(pair)}
            aria-label="Remove this match"
            disabled={isSubmitted}
          >
            ✕
          </button>
        </div>
      {/each}
    </div>

    <!-- Right side items -->
    <div 
      class="matching-column right-column"
      on:dragover={handleDragOver}
      on:drop={(e) => handleDrop(e, 'right-column', 'right')}
    >
      <h4 class="column-header">Matches</h4>
      {#each shuffledRightItems as item}
        <div 
          class="matching-item right-item" 
          class:selected={isPairSelected(item.pairId)}
          class:correct={feedback && isCorrectPair(getMatchedItem(item.pairId, 'right') || '', item.pairId)}
          class:incorrect={feedback && selectedPairs.some(p => p.rightId === item.pairId) && !isCorrectPair(getMatchedItem(item.pairId, 'right') || '', item.pairId)}
          draggable="true"
          on:dragstart={(e) => handleDragStart(e, item.pairId, 'right')}
          on:dragover={handleDragOver}
          on:drop={(e) => handleDrop(e, item.pairId, 'right')}
          on:click={() => handleClick(item.pairId, 'right')}
          on:keydown={(e) => e.key === 'Enter' && handleClick(item.pairId, 'right')}
          tabindex="0"
          role="button"
          aria-label="Drag or click to match: {item.content}"
        >
          {#if item.type === 'TEXT'}
            <span class="text-content">{item.content}</span>
          {:else if item.type === 'IMAGE'}
            <img 
              src={item.content} 
              alt={item.alt || 'Matching item'} 
              class="image-content"
            />
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Progress indicator -->
  <div class="progress-indicator">
    <span class="progress-text">
      {selectedPairs.length} of {content.pairs.length} pairs matched
    </span>
    <div class="progress-bar">
      <div 
        class="progress-fill"
        style="width: {(selectedPairs.length / content.pairs.length) * 100}%"
      ></div>
    </div>
  </div>

  <!-- Feedback section -->
  {#if feedback}
    <div class="feedback-section" class:success={feedback.isCorrect} class:error={!feedback.isCorrect}>
      <h4 class="feedback-title">
        {feedback.isCorrect ? '✅ Excellent!' : '❌ Not quite right'}
      </h4>
      <p class="feedback-message">{feedback.message}</p>
      {#if feedback.explanation}
        <p class="feedback-explanation">{feedback.explanation}</p>
      {/if}
      {#if feedback.improvementTips && feedback.improvementTips.length > 0}
        <ul class="improvement-tips">
          {#each feedback.improvementTips as tip}
            <li>{tip}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  <!-- Action buttons -->
  <div class="action-buttons">
    {#if !isSubmitted}
      <button 
        class="submit-btn primary-btn"
        on:click={submitExercise}
        disabled={selectedPairs.length !== content.pairs.length}
      >
        Submit Answer
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
  .matching-exercise {
    max-width: 800px;
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

  .matching-container {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .matching-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .column-header {
    font-size: 1.1rem;
    font-weight: 600;
    color: #444;
    text-align: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .matching-item {
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: #f9f9f9;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .matching-item:hover {
    border-color: #4CAF50;
    background: #f0f8f0;
    transform: translateY(-1px);
  }

  .matching-item.selected {
    border-color: #2196F3;
    background: #e3f2fd;
  }

  .matching-item.correct {
    border-color: #4CAF50;
    background: #e8f5e8;
  }

  .matching-item.incorrect {
    border-color: #f44336;
    background: #ffebee;
  }

  .text-content {
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
  }

  .image-content {
    max-width: 100%;
    max-height: 80px;
    object-fit: contain;
    border-radius: 4px;
  }

  .connection-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    min-width: 60px;
  }

  .pair-connection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
  }

  .remove-pair-btn {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }

  .remove-pair-btn:hover {
    background: #cc0000;
  }

  .remove-pair-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
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

  .improvement-tips {
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
    .matching-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .connection-area {
      order: -1;
      flex-direction: row;
      min-width: auto;
      min-height: 40px;
    }
    
    .matching-exercise {
      padding: 1rem;
    }
  }
</style>