# German Language Provider

Comprehensive German language provider for vocabulary learning with distractor generation, mistake analysis, and difficulty adaptation.

## Features

### 1. Phonetic Distractors
- Vowel substitutions (a/ä, o/ö, u/ü, ei/ai, au/äu)
- Consonant substitutions (b/p, d/t, s/ß/ss, ch/sch)
- Rhyming words
- Pre-defined phonetic groups

### 2. Visual Distractors
- Letter confusion patterns (b/d, m/n, u/v, i/l)
- Letter transposition (swap adjacent letters)
- Double letter mistakes (mm → m, n → nn)
- Missing/extra letters

### 3. Semantic Distractors
- Same category words
- Related category words
- Similar difficulty and length

### 4. Grammatical Distractors
- Wrong articles (der/die/das)
- Incorrect plural forms
- Wrong umlaut usage
- Compound word mistakes

### 5. Mistake Analysis
- Article errors
- Plural errors
- Phonetic confusion (umlauts)
- Spelling errors (ß vs ss)
- Capitalization errors

## Usage

### Basic Setup

```typescript
import { GermanLanguageProvider } from '@educational-app/learning'
import { languageProviderRegistry } from '@educational-app/learning'

// Register the German provider
const germanProvider = new GermanLanguageProvider()
languageProviderRegistry.register('de', germanProvider)

// Or use lazy registration
languageProviderRegistry.registerConstructor('de', GermanLanguageProvider)
```

### Generate Distractors

```typescript
const word = {
  id: '1',
  organizationId: 'org1',
  word: 'Haus',
  translation: 'house',
  category: 'OBJECTS',
  difficulty: 1,
  // ... other fields
}

// Generate mixed distractors
const distractors = await germanProvider.generateDistractors(word, {
  count: 3,
  types: ['PHONETIC', 'SEMANTIC'],
  difficulty: 1
})

// Result: [
//   { word: 'Maus', type: 'PHONETIC', reason: 'Sounds similar to "Haus"', similarityScore: 0.75 },
//   { word: 'Baum', type: 'PHONETIC', reason: 'Sounds similar to "Haus"', similarityScore: 0.6 },
//   { word: 'Tisch', type: 'SEMANTIC', reason: 'Related concept to "Haus"', similarityScore: 0.5 }
// ]
```

### Analyze Mistakes

```typescript
const targetWord = {
  word: 'Haus',
  // ... other fields
}

const studentAnswer = 'Maus'

const mistakes = germanProvider.analyzeMistake(targetWord, studentAnswer)
// Result: ['PHONETIC_CONFUSION']

// Wrong article
const mistakes2 = germanProvider.analyzeMistake(
  { word: 'der Hund', ... },
  'die Hund'
)
// Result: ['ARTICLE_ERROR']
```

### Get Language-Specific Data

```typescript
const word = {
  word: 'Hund',
  // ... other fields
}

const langData = germanProvider.getLanguageSpecificData(word)
// Result: {
//   language: 'de',
//   gender: 'masculine',
//   article: 'der',
//   plural: 'Hunde',
//   pronunciationHints: [...],
//   commonMistakes: [
//     { mistake: 'Hünd', mistakeType: 'SPELLING_ERROR', frequency: 7 }
//   ]
// }
```

### Adapt Difficulty

```typescript
const performance = {
  correct: true,
  responseTime: 2500, // milliseconds
  hintsUsed: 0,
}

const adjustment = germanProvider.adaptDifficulty(
  word,
  performance,
  historicalData // optional
)
// Result: {
//   newDifficulty: 2,
//   reason: 'Student performed well - increasing difficulty',
//   confidence: 0.9,
//   suggestedDistractorTypes: ['SEMANTIC', 'PHONETIC']
// }
```

### Identify Weak Areas

```typescript
const recentAttempts = [
  {
    word: { word: 'der Hund', category: 'ANIMALS', ... },
    performance: { correct: false, mistakeType: 'ARTICLE_ERROR', ... }
  },
  {
    word: { word: 'die Katze', category: 'ANIMALS', ... },
    performance: { correct: false, mistakeType: 'ARTICLE_ERROR', ... }
  },
  // ... more attempts
]

const weakAreas = germanProvider.identifyWeakAreas('student-123', recentAttempts)
// Result: {
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

## German-Specific Features

### Grammar Rules

The provider includes comprehensive German grammar rules:

```typescript
germanProvider.grammarRules
// {
//   hasGrammaticalGender: true,
//   genders: ['masculine', 'feminine', 'neuter'],
//   hasCases: true,
//   cases: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],
//   pluralRules: [...],
//   articleRules: [...]
// }
```

### Compound Words

Automatically detects and splits compound words:

```typescript
const word = { word: 'Haustür', ... }
const langData = germanProvider.getLanguageSpecificData(word)
// langData.compoundParts = ['Haus', 'Tür']
```

### Umlaut Handling

Proper handling of German umlauts (ä, ö, ü):

```typescript
// Phonetic substitutions
'Haus' → 'Häus' (umlaut substitution)
'Mutter' → 'Mütter' (plural with umlaut)

// Mistake detection
germanProvider.analyzeMistake(
  { word: 'Äpfel', ... },
  'Apfel'
) // Returns: ['PHONETIC_CONFUSION']
```

### ß (Eszett) Support

```typescript
// Proper handling of sharp S
'Straße' vs 'Strasse'

// Mistake detection
germanProvider.analyzeMistake(
  { word: 'Straße', ... },
  'Strasse'
) // Returns: ['SPELLING_ERROR']
```

## German Vocabulary Categories

The provider supports all vocabulary categories with German-specific patterns:

- **ANIMALS** (Tiere): Hund, Katze, Vogel
- **COLORS** (Farben): Rot, Blau, Grün
- **NUMBERS** (Zahlen): Eins, Zwei, Drei
- **FAMILY** (Familie): Mutter, Vater, Kind
- **OBJECTS** (Gegenstände): Tisch, Stuhl, Buch
- **FOOD** (Essen): Brot, Apfel, Wasser
- **CLOTHING** (Kleidung): Hose, Hemd, Schuh
- **BODY_PARTS** (Körperteile): Hand, Fuß, Kopf
- **WEATHER** (Wetter): Sonne, Regen, Wind
- **TIME** (Zeit): Tag, Woche, Jahr
- **PLACES** (Orte): Schule, Haus, Park
- **ACTIONS** (Tätigkeiten): Laufen, Essen, Schlafen

## Performance Considerations

### Caching
The provider can be registered once and reused:

```typescript
// Singleton instance
languageProviderRegistry.register('de', new GermanLanguageProvider())

// Reuse across requests
const provider = languageProviderRegistry.get('de')
```

### Lazy Loading
Use constructor registration for lazy instantiation:

```typescript
// Only instantiated when first accessed
languageProviderRegistry.registerConstructor('de', GermanLanguageProvider)
```

### Distractor Generation
Distractor generation is async to allow for future database lookups or API calls:

```typescript
// All methods return Promises
await germanProvider.generatePhoneticDistractors(word, 3)
await germanProvider.generateSemanticDistractors(word, 3, allWords)
```

## Testing

Example test cases:

```typescript
import { GermanLanguageProvider } from './GermanLanguageProvider'

describe('GermanLanguageProvider', () => {
  const provider = new GermanLanguageProvider()

  test('generates phonetic distractors', async () => {
    const word = { word: 'Haus', category: 'OBJECTS', difficulty: 1, ... }
    const distractors = await provider.generatePhoneticDistractors(word, 3)

    expect(distractors).toHaveLength(3)
    expect(distractors).toContain('Maus') // Similar sound
  })

  test('detects article errors', () => {
    const target = { word: 'der Hund', ... }
    const mistakes = provider.analyzeMistake(target, 'die Hund')

    expect(mistakes).toContain('ARTICLE_ERROR')
  })

  test('infers gender correctly', () => {
    const word = { word: 'Lehrer', ... } // ends with -er (masculine)
    const langData = provider.getLanguageSpecificData(word)

    expect(langData.gender).toBe('masculine')
    expect(langData.article).toBe('der')
  })
})
```

## Future Enhancements

- [ ] Machine learning-based distractor ranking
- [ ] Context-aware semantic distractors
- [ ] Regional dialect support (Austrian, Swiss German)
- [ ] Advanced compound word analysis
- [ ] Integration with audio pronunciation
- [ ] Student-specific distractor adaptation
