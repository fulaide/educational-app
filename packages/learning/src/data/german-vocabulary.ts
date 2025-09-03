import type { VocabularyWordInput, VocabularyCategory } from '../types'

/**
 * Comprehensive German vocabulary for primary school students
 * Organized by category with proper translations, phonetics, and examples
 */

export const GERMAN_VOCABULARY: Record<VocabularyCategory, VocabularyWordInput[]> = {
  ANIMALS: [
    {
      word: 'Hund',
      translation: 'Dog',
      phonetic: '[hʊnt]',
      category: 'ANIMALS',
      difficulty: 'BEGINNER',
      frequency: 9,
      tags: ['pets', 'domestic'],
      translations: {
        de: 'Hund',
        en: 'Dog'
      },
      examples: [
        {
          german: 'Der Hund ist sehr freundlich.',
          english: 'The dog is very friendly.'
        },
        {
          german: 'Mein Hund heißt Bello.',
          english: 'My dog is called Bello.'
        }
      ]
    },
    {
      word: 'Katze',
      translation: 'Cat',
      phonetic: '[ˈkatsə]',
      category: 'ANIMALS',
      difficulty: 'BEGINNER',
      frequency: 8,
      tags: ['pets', 'domestic'],
      translations: {
        de: 'Katze',
        en: 'Cat'
      },
      examples: [
        {
          german: 'Die Katze schläft auf dem Sofa.',
          english: 'The cat sleeps on the sofa.'
        }
      ]
    },
    {
      word: 'Vogel',
      translation: 'Bird',
      phonetic: '[ˈfoːɡəl]',
      category: 'ANIMALS',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['wild', 'flying'],
      translations: {
        de: 'Vogel',
        en: 'Bird'
      },
      examples: [
        {
          german: 'Der Vogel singt schön.',
          english: 'The bird sings beautifully.'
        }
      ]
    },
    {
      word: 'Fisch',
      translation: 'Fish',
      phonetic: '[fɪʃ]',
      category: 'ANIMALS',
      difficulty: 'BEGINNER',
      frequency: 6,
      tags: ['water', 'swimming'],
      translations: {
        de: 'Fisch',
        en: 'Fish'
      },
      examples: [
        {
          german: 'Der Fisch schwimmt im Wasser.',
          english: 'The fish swims in the water.'
        }
      ]
    },
    {
      word: 'Pferd',
      translation: 'Horse',
      phonetic: '[pfeːɐ̯t]',
      category: 'ANIMALS',
      difficulty: 'INTERMEDIATE',
      frequency: 5,
      tags: ['farm', 'large'],
      translations: {
        de: 'Pferd',
        en: 'Horse'
      },
      examples: [
        {
          german: 'Das Pferd läuft schnell.',
          english: 'The horse runs fast.'
        }
      ]
    },
    {
      word: 'Kuh',
      translation: 'Cow',
      phonetic: '[kuː]',
      category: 'ANIMALS',
      difficulty: 'BEGINNER',
      frequency: 6,
      tags: ['farm', 'milk'],
      translations: {
        de: 'Kuh',
        en: 'Cow'
      },
      examples: [
        {
          german: 'Die Kuh gibt Milch.',
          english: 'The cow gives milk.'
        }
      ]
    }
  ],

  COLORS: [
    {
      word: 'Rot',
      translation: 'Red',
      phonetic: '[roːt]',
      category: 'COLORS',
      difficulty: 'BEGINNER',
      frequency: 10,
      tags: ['primary', 'basic'],
      translations: {
        de: 'Rot',
        en: 'Red'
      },
      examples: [
        {
          german: 'Die Rose ist rot.',
          english: 'The rose is red.'
        }
      ]
    },
    {
      word: 'Blau',
      translation: 'Blue',
      phonetic: '[blaʊ̯]',
      category: 'COLORS',
      difficulty: 'BEGINNER',
      frequency: 9,
      tags: ['primary', 'basic'],
      translations: {
        de: 'Blau',
        en: 'Blue'
      },
      examples: [
        {
          german: 'Der Himmel ist blau.',
          english: 'The sky is blue.'
        }
      ]
    },
    {
      word: 'Grün',
      translation: 'Green',
      phonetic: '[ɡryːn]',
      category: 'COLORS',
      difficulty: 'BEGINNER',
      frequency: 8,
      tags: ['primary', 'nature'],
      translations: {
        de: 'Grün',
        en: 'Green'
      },
      examples: [
        {
          german: 'Das Gras ist grün.',
          english: 'The grass is green.'
        }
      ]
    },
    {
      word: 'Gelb',
      translation: 'Yellow',
      phonetic: '[ɡɛlp]',
      category: 'COLORS',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['primary', 'bright'],
      translations: {
        de: 'Gelb',
        en: 'Yellow'
      },
      examples: [
        {
          german: 'Die Sonne ist gelb.',
          english: 'The sun is yellow.'
        }
      ]
    },
    {
      word: 'Schwarz',
      translation: 'Black',
      phonetic: '[ʃvaʁts]',
      category: 'COLORS',
      difficulty: 'INTERMEDIATE',
      frequency: 6,
      tags: ['dark', 'basic'],
      translations: {
        de: 'Schwarz',
        en: 'Black'
      },
      examples: [
        {
          german: 'Die Nacht ist schwarz.',
          english: 'The night is black.'
        }
      ]
    },
    {
      word: 'Weiß',
      translation: 'White',
      phonetic: '[vaɪ̯s]',
      category: 'COLORS',
      difficulty: 'INTERMEDIATE',
      frequency: 6,
      tags: ['light', 'basic'],
      translations: {
        de: 'Weiß',
        en: 'White'
      },
      examples: [
        {
          german: 'Der Schnee ist weiß.',
          english: 'The snow is white.'
        }
      ]
    }
  ],

  NUMBERS: [
    {
      word: 'Eins',
      translation: 'One',
      phonetic: '[aɪ̯ns]',
      category: 'NUMBERS',
      difficulty: 'BEGINNER',
      frequency: 10,
      tags: ['counting', 'basic'],
      translations: {
        de: 'Eins',
        en: 'One'
      },
      examples: [
        {
          german: 'Ich habe einen Apfel.',
          english: 'I have one apple.'
        }
      ]
    },
    {
      word: 'Zwei',
      translation: 'Two',
      phonetic: '[tsvaɪ̯]',
      category: 'NUMBERS',
      difficulty: 'BEGINNER',
      frequency: 10,
      tags: ['counting', 'basic'],
      translations: {
        de: 'Zwei',
        en: 'Two'
      },
      examples: [
        {
          german: 'Ich habe zwei Hände.',
          english: 'I have two hands.'
        }
      ]
    },
    {
      word: 'Drei',
      translation: 'Three',
      phonetic: '[draɪ̯]',
      category: 'NUMBERS',
      difficulty: 'BEGINNER',
      frequency: 9,
      tags: ['counting', 'basic'],
      translations: {
        de: 'Drei',
        en: 'Three'
      },
      examples: [
        {
          german: 'Es gibt drei Bälle.',
          english: 'There are three balls.'
        }
      ]
    },
    {
      word: 'Vier',
      translation: 'Four',
      phonetic: '[fiːɐ̯]',
      category: 'NUMBERS',
      difficulty: 'BEGINNER',
      frequency: 8,
      tags: ['counting', 'basic'],
      translations: {
        de: 'Vier',
        en: 'Four'
      },
      examples: [
        {
          german: 'Der Tisch hat vier Beine.',
          english: 'The table has four legs.'
        }
      ]
    },
    {
      word: 'Fünf',
      translation: 'Five',
      phonetic: '[fʏnf]',
      category: 'NUMBERS',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['counting', 'basic'],
      translations: {
        de: 'Fünf',
        en: 'Five'
      },
      examples: [
        {
          german: 'Ich habe fünf Finger.',
          english: 'I have five fingers.'
        }
      ]
    }
  ],

  FAMILY: [
    {
      word: 'Mama',
      translation: 'Mom',
      phonetic: '[ˈmaːma]',
      category: 'FAMILY',
      difficulty: 'BEGINNER',
      frequency: 10,
      tags: ['parent', 'family'],
      translations: {
        de: 'Mama',
        en: 'Mom'
      },
      examples: [
        {
          german: 'Mama kocht das Essen.',
          english: 'Mom cooks the food.'
        }
      ]
    },
    {
      word: 'Papa',
      translation: 'Dad',
      phonetic: '[ˈpaːpa]',
      category: 'FAMILY',
      difficulty: 'BEGINNER',
      frequency: 10,
      tags: ['parent', 'family'],
      translations: {
        de: 'Papa',
        en: 'Dad'
      },
      examples: [
        {
          german: 'Papa spielt mit mir.',
          english: 'Dad plays with me.'
        }
      ]
    },
    {
      word: 'Bruder',
      translation: 'Brother',
      phonetic: '[ˈbruːdɐ]',
      category: 'FAMILY',
      difficulty: 'BEGINNER',
      frequency: 8,
      tags: ['sibling', 'family'],
      translations: {
        de: 'Bruder',
        en: 'Brother'
      },
      examples: [
        {
          german: 'Mein Bruder ist älter.',
          english: 'My brother is older.'
        }
      ]
    },
    {
      word: 'Schwester',
      translation: 'Sister',
      phonetic: '[ˈʃvɛstɐ]',
      category: 'FAMILY',
      difficulty: 'INTERMEDIATE',
      frequency: 8,
      tags: ['sibling', 'family'],
      translations: {
        de: 'Schwester',
        en: 'Sister'
      },
      examples: [
        {
          german: 'Meine Schwester ist jünger.',
          english: 'My sister is younger.'
        }
      ]
    },
    {
      word: 'Oma',
      translation: 'Grandma',
      phonetic: '[ˈoːma]',
      category: 'FAMILY',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['grandparent', 'family'],
      translations: {
        de: 'Oma',
        en: 'Grandma'
      },
      examples: [
        {
          german: 'Oma backt Kuchen.',
          english: 'Grandma bakes cake.'
        }
      ]
    },
    {
      word: 'Opa',
      translation: 'Grandpa',
      phonetic: '[ˈoːpa]',
      category: 'FAMILY',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['grandparent', 'family'],
      translations: {
        de: 'Opa',
        en: 'Grandpa'
      },
      examples: [
        {
          german: 'Opa erzählt Geschichten.',
          english: 'Grandpa tells stories.'
        }
      ]
    }
  ],

  OBJECTS: [
    {
      word: 'Haus',
      translation: 'House',
      phonetic: '[haʊ̯s]',
      category: 'OBJECTS',
      difficulty: 'BEGINNER',
      frequency: 9,
      tags: ['building', 'home'],
      translations: {
        de: 'Haus',
        en: 'House'
      },
      examples: [
        {
          german: 'Das Haus ist groß.',
          english: 'The house is big.'
        }
      ]
    },
    {
      word: 'Auto',
      translation: 'Car',
      phonetic: '[ˈaʊ̯to]',
      category: 'OBJECTS',
      difficulty: 'BEGINNER',
      frequency: 8,
      tags: ['vehicle', 'transport'],
      translations: {
        de: 'Auto',
        en: 'Car'
      },
      examples: [
        {
          german: 'Das Auto fährt schnell.',
          english: 'The car drives fast.'
        }
      ]
    },
    {
      word: 'Buch',
      translation: 'Book',
      phonetic: '[buːx]',
      category: 'OBJECTS',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['school', 'reading'],
      translations: {
        de: 'Buch',
        en: 'Book'
      },
      examples: [
        {
          german: 'Ich lese ein Buch.',
          english: 'I read a book.'
        }
      ]
    },
    {
      word: 'Tisch',
      translation: 'Table',
      phonetic: '[tɪʃ]',
      category: 'OBJECTS',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['furniture', 'home'],
      translations: {
        de: 'Tisch',
        en: 'Table'
      },
      examples: [
        {
          german: 'Der Tisch ist rund.',
          english: 'The table is round.'
        }
      ]
    },
    {
      word: 'Stuhl',
      translation: 'Chair',
      phonetic: '[ʃtuːl]',
      category: 'OBJECTS',
      difficulty: 'BEGINNER',
      frequency: 6,
      tags: ['furniture', 'home'],
      translations: {
        de: 'Stuhl',
        en: 'Chair'
      },
      examples: [
        {
          german: 'Der Stuhl ist bequem.',
          english: 'The chair is comfortable.'
        }
      ]
    },
    {
      word: 'Ball',
      translation: 'Ball',
      phonetic: '[bal]',
      category: 'OBJECTS',
      difficulty: 'BEGINNER',
      frequency: 6,
      tags: ['toy', 'sport'],
      translations: {
        de: 'Ball',
        en: 'Ball'
      },
      examples: [
        {
          german: 'Der Ball ist rund.',
          english: 'The ball is round.'
        }
      ]
    }
  ],

  FOOD: [
    {
      word: 'Apfel',
      translation: 'Apple',
      phonetic: '[ˈapfəl]',
      category: 'FOOD',
      difficulty: 'BEGINNER',
      frequency: 8,
      tags: ['fruit', 'healthy'],
      translations: {
        de: 'Apfel',
        en: 'Apple'
      },
      examples: [
        {
          german: 'Der Apfel ist rot.',
          english: 'The apple is red.'
        }
      ]
    },
    {
      word: 'Brot',
      translation: 'Bread',
      phonetic: '[broːt]',
      category: 'FOOD',
      difficulty: 'BEGINNER',
      frequency: 9,
      tags: ['staple', 'bakery'],
      translations: {
        de: 'Brot',
        en: 'Bread'
      },
      examples: [
        {
          german: 'Ich esse Brot zum Frühstück.',
          english: 'I eat bread for breakfast.'
        }
      ]
    },
    {
      word: 'Wasser',
      translation: 'Water',
      phonetic: '[ˈvasɐ]',
      category: 'FOOD',
      difficulty: 'BEGINNER',
      frequency: 10,
      tags: ['drink', 'essential'],
      translations: {
        de: 'Wasser',
        en: 'Water'
      },
      examples: [
        {
          german: 'Ich trinke Wasser.',
          english: 'I drink water.'
        }
      ]
    },
    {
      word: 'Milch',
      translation: 'Milk',
      phonetic: '[mɪlç]',
      category: 'FOOD',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['drink', 'dairy'],
      translations: {
        de: 'Milch',
        en: 'Milk'
      },
      examples: [
        {
          german: 'Die Milch ist weiß.',
          english: 'The milk is white.'
        }
      ]
    },
    {
      word: 'Käse',
      translation: 'Cheese',
      phonetic: '[ˈkɛːzə]',
      category: 'FOOD',
      difficulty: 'INTERMEDIATE',
      frequency: 6,
      tags: ['dairy', 'protein'],
      translations: {
        de: 'Käse',
        en: 'Cheese'
      },
      examples: [
        {
          german: 'Der Käse schmeckt gut.',
          english: 'The cheese tastes good.'
        }
      ]
    },
    {
      word: 'Ei',
      translation: 'Egg',
      phonetic: '[aɪ̯]',
      category: 'FOOD',
      difficulty: 'BEGINNER',
      frequency: 7,
      tags: ['protein', 'breakfast'],
      translations: {
        de: 'Ei',
        en: 'Egg'
      },
      examples: [
        {
          german: 'Das Ei ist rund.',
          english: 'The egg is round.'
        }
      ]
    }
  ],

  // Empty categories for future expansion
  CLOTHING: [],
  BODY_PARTS: [],
  WEATHER: [],
  TIME: [],
  PLACES: [],
  ACTIONS: []
}

/**
 * Get vocabulary words by category and difficulty
 */
export function getVocabularyByCategory(
  category: VocabularyCategory, 
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
): VocabularyWordInput[] {
  const words = GERMAN_VOCABULARY[category]
  if (!difficulty) return words
  
  return words.filter(word => word.difficulty === difficulty)
}

/**
 * Get all vocabulary words as a flat array
 */
export function getAllVocabulary(): VocabularyWordInput[] {
  return Object.values(GERMAN_VOCABULARY).flat()
}

/**
 * Get vocabulary words by difficulty level
 */
export function getVocabularyByDifficulty(
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
): VocabularyWordInput[] {
  return getAllVocabulary().filter(word => word.difficulty === difficulty)
}

/**
 * Get high-frequency vocabulary words (good for beginners)
 */
export function getHighFrequencyVocabulary(minFrequency = 7): VocabularyWordInput[] {
  return getAllVocabulary().filter(word => word.frequency >= minFrequency)
}