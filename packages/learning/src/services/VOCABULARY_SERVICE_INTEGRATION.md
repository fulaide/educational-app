# VocabularyService Language Provider Integration

Complete guide for using the enhanced VocabularyService with language provider integration for intelligent distractor generation, mistake analysis, and adaptive difficulty.

## Overview

The VocabularyService now integrates with language providers to offer:
- **Intelligent distractor generation** (phonetic, visual, semantic, grammatical)
- **Automatic exercise generation** (multiple choice, fill-in-blank, spelling)
- **Mistake analysis** with categorization and suggestions
- **Adaptive difficulty** based on student performance
- **Weak area identification** for personalized learning

## Setup

### Default Configuration

The service is automatically configured with the German provider:

```typescript
import { vocabularyService } from '@educational-app/learning'

// German provider is registered by default
// Service is ready to use immediately
```

### Custom Configuration

```typescript
import {
  VocabularyService,
  LanguageProviderRegistry,
  GermanLanguageProvider
} from '@educational-app/learning'

// Create custom registry
const registry = new LanguageProviderRegistry()
registry.register('de', new GermanLanguageProvider())

// Create service with custom registry
const vocabService = new VocabularyService('/api/vocabulary', registry)
```

## Core Features

### 1. Distractor Generation

Generate contextually appropriate wrong answers for exercises:

```typescript
import { vocabularyService } from '@educational-app/learning'

const word = {
  id: 'word-1',
  word: 'Haus',
  translation: 'house',
  category: 'OBJECTS',
  difficulty: 1,
  language: 'de',
  // ... other fields
}

// Generate mixed distractors
const distractors = await vocabularyService.generateDistractors(word, {
  count: 3,
  types: ['PHONETIC', 'SEMANTIC'],
  difficulty: 1,
  category: 'OBJECTS'
})

// Result:
// [
//   { word: 'Maus', type: 'PHONETIC', reason: 'Sounds similar...', similarityScore: 0.75 },
//   { word: 'Baum', type: 'PHONETIC', reason: 'Sounds similar...', similarityScore: 0.6 },
//   { word: 'Tisch', type: 'SEMANTIC', reason: 'Related concept...', similarityScore: 0.5 }
// ]
```

#### Distractor Types

| Type | Description | Use Case |
|------|-------------|----------|
| `PHONETIC` | Similar-sounding words | Testing pronunciation awareness |
| `VISUAL` | Visually similar words | Testing spelling accuracy |
| `SEMANTIC` | Related category words | Testing meaning comprehension |
| `GRAMMATICAL` | Grammar mistakes | Testing grammar rules |

### 2. Exercise Generation

Automatically generate complete exercises with proper distractors:

#### Multiple Choice

```typescript
const exercise = await vocabularyService.generateExercise(
  'word-123',
  'MULTIPLE_CHOICE',
  {
    distractorTypes: ['PHONETIC', 'SEMANTIC'],
    distractorCount: 3,
    difficulty: 1
  }
)

// Returns complete Exercise object with:
// - Question text
// - Correct answer
// - 3 AI-generated distractors
// - Shuffled options
```

#### Fill-in-the-Blank

```typescript
const exercise = await vocabularyService.generateExercise(
  'word-123',
  'FILL_BLANK',
  {
    difficulty: 1
  }
)

// Uses word in context sentence
// "Das ist ein {blank}."
```

#### Spelling

```typescript
const exercise = await vocabularyService.generateExercise(
  'word-123',
  'SPELLING',
  {
    difficulty: 1
  }
)

// Prompts student to spell the translation
// "How do you spell: house?"
```

### 3. Mistake Analysis

Analyze student mistakes and provide targeted feedback:

```typescript
const result = await vocabularyService.analyzeMistake(
  'word-123',     // Word ID
  'die Hund'      // Student's answer
)

// Result:
// {
//   mistakeTypes: ['ARTICLE_ERROR'],
//   suggestions: [
//     'Remember to use the correct article (der/die/das)'
//   ]
// }
```

#### Mistake Types Detected

- `ARTICLE_ERROR` - Wrong article (der/die/das)
- `PLURAL_ERROR` - Incorrect plural form
- `PHONETIC_CONFUSION` - Umlaut confusion (ä/a, ö/o, ü/u)
- `SPELLING_ERROR` - Spelling mistakes
- `GRAMMAR_ERROR` - General grammar errors
- `VISUAL_CONFUSION` - Letter confusion (b/d, m/n)
- `SEMANTIC_CONFUSION` - Meaning confusion

### 4. Adaptive Difficulty

Automatically adjust exercise difficulty based on performance:

```typescript
const performance = {
  correct: true,
  responseTime: 2500,  // milliseconds
  hintsUsed: 0,
  mistakeType: undefined
}

const adjustment = await vocabularyService.adaptDifficulty(
  'word-123',
  performance,
  historicalData  // Optional: previous attempts
)

// Result:
// {
//   newDifficulty: 2,
//   reason: 'Student performed well - increasing difficulty',
//   confidence: 0.9,
//   suggestedDistractorTypes: ['SEMANTIC', 'GRAMMATICAL']
// }
```

### 5. Weak Area Identification

Identify student's struggling areas for personalized learning:

```typescript
const weakAreas = await vocabularyService.identifyWeakAreas(
  'student-123',
  'de',    // language
  50       // number of recent attempts to analyze
)

// Result:
// {
//   studentId: 'student-123',
//   language: 'de',
//   mistakePatterns: [
//     {
//       type: 'ARTICLE_ERROR',
//       frequency: 0.6,
//       affectedCategories: ['ANIMALS', 'OBJECTS']
//     }
//   ],
//   difficultCategories: ['ANIMALS'],
//   recommendations: [
//     'Focus on ARTICLE_ERROR - occurs in 60% of mistakes',
//     'Practice vocabulary in categories: ANIMALS'
//   ]
// }
```

### 6. Common Mistakes

Get pre-defined common mistakes for a word:

```typescript
const commonMistakes = await vocabularyService.getCommonMistakes('word-123')

// Result:
// [
//   {
//     mistake: 'Häus',
//     mistakeType: 'SPELLING_ERROR',
//     frequency: 7
//   },
//   {
//     mistake: 'Hous',
//     mistakeType: 'VISUAL_CONFUSION',
//     frequency: 5
//   }
// ]
```

## Integration Patterns

### Teacher Challenge Builder

```typescript
// 1. Teacher selects words
const words = await vocabularyService.getVocabularyWords('ANIMALS', 'BEGINNER', 10)

// 2. Auto-generate exercises with distractors
const exercises = await Promise.all(
  words.map(word =>
    vocabularyService.generateExercise(word.id, 'MULTIPLE_CHOICE', {
      distractorTypes: ['SEMANTIC', 'PHONETIC'],
      distractorCount: 3
    })
  )
)

// 3. Teacher can customize distractors if needed
const customDistractors = await vocabularyService.generateDistractors(words[0], {
  count: 5,
  types: ['GRAMMATICAL'],
  difficulty: 2
})
```

### Student Learning Flow

```typescript
// 1. Get words due for review
const reviewWords = await vocabularyService.getWordsForReview('student-123', 10)

// 2. Generate exercise for each word
for (const wordWithProgress of reviewWords) {
  // Adapt difficulty based on progress
  const difficulty = wordWithProgress.progress.masteryLevel === 'MASTERED' ? 3 : 1

  const exercise = await vocabularyService.generateExercise(
    wordWithProgress.id,
    'MULTIPLE_CHOICE',
    { difficulty }
  )

  // Show exercise to student
  // ...

  // 3. Analyze student's answer
  if (!isCorrect) {
    const analysis = await vocabularyService.analyzeMistake(
      wordWithProgress.id,
      studentAnswer
    )

    // Show targeted feedback
    console.log('Suggestions:', analysis.suggestions)
  }

  // 4. Adapt difficulty for next time
  const adjustment = await vocabularyService.adaptDifficulty(
    wordWithProgress.id,
    {
      correct: isCorrect,
      responseTime,
      hintsUsed,
      mistakeType: analysis?.mistakeTypes[0]
    }
  )

  console.log('Next difficulty:', adjustment.newDifficulty)
}
```

### Teacher Insights Dashboard

```typescript
// Get student's weak areas
const weakAreas = await vocabularyService.identifyWeakAreas('student-123', 'de')

// Display insights
console.log('Mistake Patterns:')
for (const pattern of weakAreas.mistakePatterns) {
  console.log(`- ${pattern.type}: ${Math.round(pattern.frequency * 100)}%`)
  console.log(`  Affected: ${pattern.affectedCategories.join(', ')}`)
}

console.log('\nRecommendations:')
weakAreas.recommendations.forEach(rec => console.log(`- ${rec}`))

// Get difficult categories
console.log('\nDifficult Categories:')
weakAreas.difficultCategories.forEach(cat => console.log(`- ${cat}`))
```

## API Reference

### `generateDistractors(word, options)`

Generate distractors for a vocabulary word.

**Parameters:**
- `word: VocabularyWord` - Target word
- `options: DistractorOptions`
  - `count: number` - Number of distractors (default: 3)
  - `types: DistractorType[]` - Types to generate
  - `difficulty: DifficultyLevel` - Target difficulty
  - `category?: VocabularyCategory` - Category filter
  - `excludeWords?: string[]` - Words to exclude

**Returns:** `Promise<Distractor[]>`

### `generateExercise(wordId, exerciseType, options)`

Generate complete exercise with distractors.

**Parameters:**
- `wordId: string` - Word identifier
- `exerciseType: ExerciseType` - Type of exercise
- `options: object`
  - `language?: LanguageCode` - Target language
  - `distractorTypes?: DistractorType[]` - Distractor types
  - `distractorCount?: number` - Number of distractors
  - `difficulty?: DifficultyLevel` - Exercise difficulty
  - `allWords?: VocabularyWord[]` - Available words pool

**Returns:** `Promise<Exercise>`

### `adaptDifficulty(wordId, performance, historicalData?)`

Adapt difficulty based on performance.

**Parameters:**
- `wordId: string` - Word identifier
- `performance: PerformanceData` - Current attempt data
- `historicalData?: PerformanceData[]` - Previous attempts

**Returns:** `Promise<DifficultyAdjustment>`

### `identifyWeakAreas(studentId, language, limit)`

Identify student's weak areas.

**Parameters:**
- `studentId: string` - Student identifier
- `language: LanguageCode` - Target language (default: 'de')
- `limit: number` - Recent attempts to analyze (default: 50)

**Returns:** `Promise<WeakAreas>`

### `analyzeMistake(wordId, studentAnswer)`

Analyze student mistake.

**Parameters:**
- `wordId: string` - Word identifier
- `studentAnswer: string` - Student's answer

**Returns:** `Promise<{ mistakeTypes: string[], suggestions: string[] }>`

### `getCommonMistakes(wordId)`

Get common mistakes for a word.

**Parameters:**
- `wordId: string` - Word identifier

**Returns:** `Promise<Array<{ mistake: string, mistakeType: string, frequency: number }>>`

## Best Practices

### 1. Distractor Quality

```typescript
// ✅ Use mixed distractor types for better quality
const distractors = await service.generateDistractors(word, {
  count: 3,
  types: ['PHONETIC', 'SEMANTIC'],  // Mix types
  difficulty: word.difficulty
})

// ❌ Don't use only one type
const distractors = await service.generateDistractors(word, {
  count: 3,
  types: ['PHONETIC'],  // Limited variety
  difficulty: word.difficulty
})
```

### 2. Adaptive Difficulty

```typescript
// ✅ Use historical data for better adaptation
const adjustment = await service.adaptDifficulty(
  wordId,
  currentPerformance,
  last10Attempts  // Include history
)

// ❌ Don't adapt without context
const adjustment = await service.adaptDifficulty(
  wordId,
  currentPerformance
  // No historical data
)
```

### 3. Error Handling

```typescript
// ✅ Handle provider not configured
try {
  const distractors = await service.generateDistractors(word, options)
} catch (error) {
  if (error.message.includes('provider registry not configured')) {
    // Fallback to simple distractor generation
    const fallbackDistractors = await generateSimpleDistractors(word)
  } else {
    throw error
  }
}
```

### 4. Performance

```typescript
// ✅ Generate exercises in parallel
const exercises = await Promise.all(
  words.map(word =>
    service.generateExercise(word.id, 'MULTIPLE_CHOICE')
  )
)

// ❌ Don't generate sequentially
const exercises = []
for (const word of words) {
  exercises.push(await service.generateExercise(word.id, 'MULTIPLE_CHOICE'))
}
```

## Troubleshooting

### Provider Not Found

```
Error: No provider registered for language: de
```

**Solution:** Register the language provider

```typescript
import { GermanLanguageProvider, languageProviderRegistry } from '@educational-app/learning'

languageProviderRegistry.register('de', new GermanLanguageProvider())
```

### No Distractors Generated

If distractor generation returns empty arrays, check:

1. **Word pool**: Ensure sufficient vocabulary exists
2. **Category match**: Verify category has related words
3. **Difficulty range**: Check difficulty isn't too restrictive

```typescript
// Widen search criteria
const distractors = await service.generateDistractors(word, {
  count: 3,
  types: ['PHONETIC', 'SEMANTIC', 'VISUAL'],  // More types
  difficulty: word.difficulty,
  // Don't filter by category for more options
})
```

## Migration Guide

### From Simple Distractor Generation

**Before:**
```typescript
const distractors = [
  'random word 1',
  'random word 2',
  'random word 3'
]
```

**After:**
```typescript
const distractors = await vocabularyService.generateDistractors(word, {
  count: 3,
  types: ['SEMANTIC'],
  difficulty: word.difficulty
})
```

### From Manual Exercise Creation

**Before:**
```typescript
const exercise = {
  type: 'MULTIPLE_CHOICE',
  question: word.word,
  options: [
    word.translation,
    'manual distractor 1',
    'manual distractor 2',
    'manual distractor 3'
  ]
}
```

**After:**
```typescript
const exercise = await vocabularyService.generateExercise(
  word.id,
  'MULTIPLE_CHOICE',
  {
    distractorTypes: ['PHONETIC', 'SEMANTIC'],
    distractorCount: 3
  }
)
```

## Performance Considerations

- **Caching**: Consider caching generated distractors for frequently used words
- **Batching**: Generate exercises in parallel when possible
- **Lazy loading**: Use lazy provider registration for better startup time
- **Fallbacks**: Implement fallback distractor generation for offline mode

## Future Enhancements

- [ ] Multi-language mix exercises (translate between languages)
- [ ] Audio-based distractor generation
- [ ] Image-based distractor selection
- [ ] Machine learning-based distractor ranking
- [ ] Student-specific distractor adaptation
- [ ] Context-aware semantic distractors
