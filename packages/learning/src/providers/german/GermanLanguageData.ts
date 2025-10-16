/**
 * German language-specific data, patterns, and rules
 */

import type { VocabularyCategory } from '../../types/Vocabulary'

/**
 * German articles by gender
 */
export const GERMAN_ARTICLES = {
  masculine: 'der',
  feminine: 'die',
  neuter: 'das',
  plural: 'die'
} as const

/**
 * German grammatical cases
 */
export const GERMAN_CASES = [
  'Nominativ', // Subject case
  'Akkusativ', // Direct object case
  'Dativ',     // Indirect object case
  'Genitiv'    // Possessive case
] as const

/**
 * Common German vowel substitutions for phonetic distractors
 */
export const VOWEL_SUBSTITUTIONS: Record<string, string[]> = {
  'a': ['ä', 'e', 'o'],
  'ä': ['a', 'e'],
  'e': ['ä', 'i', 'a'],
  'i': ['ie', 'e', 'y'],
  'ie': ['i', 'ih', 'ieh'],
  'o': ['ö', 'u', 'a'],
  'ö': ['o', 'oe'],
  'u': ['ü', 'o'],
  'ü': ['u', 'ue'],
  'au': ['äu', 'eu'],
  'äu': ['au', 'eu'],
  'eu': ['äu', 'au'],
  'ei': ['ai', 'ey'],
  'ai': ['ei', 'ay']
}

/**
 * Common German consonant substitutions for phonetic distractors
 */
export const CONSONANT_SUBSTITUTIONS: Record<string, string[]> = {
  'b': ['p', 'w'],
  'p': ['b', 'f'],
  'd': ['t', 'th'],
  't': ['d', 'th'],
  'g': ['k', 'ch'],
  'k': ['g', 'ck'],
  'w': ['v', 'b'],
  'v': ['f', 'w'],
  'f': ['v', 'ph'],
  's': ['ss', 'ß', 'z'],
  'ss': ['s', 'ß'],
  'ß': ['ss', 's'],
  'z': ['s', 'ts'],
  'ch': ['sch', 'k'],
  'sch': ['ch', 'sh']
}

/**
 * Visually similar letter pairs (common writing mistakes)
 */
export const VISUAL_CONFUSIONS: Array<[string, string]> = [
  ['b', 'd'],
  ['p', 'q'],
  ['m', 'n'],
  ['u', 'v'],
  ['i', 'l'],
  ['o', 'a'],
  ['e', 'c'],
  ['f', 't'],
  ['h', 'k'],
  ['r', 'n']
]

/**
 * Common German plural suffixes
 */
export const PLURAL_SUFFIXES = [
  'e',      // Hund → Hunde
  'en',     // Frau → Frauen
  'n',      // Lampe → Lampen
  'er',     // Kind → Kinder
  's',      // Auto → Autos
  ''        // Unchanged (Fenster → Fenster)
]

/**
 * Common umlaut plurals (with vowel change)
 */
export const UMLAUT_PLURALS: Record<string, string> = {
  'a': 'ä',
  'o': 'ö',
  'u': 'ü',
  'au': 'äu'
}

/**
 * German noun gender patterns (heuristics, not 100% accurate)
 */
export const GENDER_PATTERNS = {
  masculine: [
    /.*er$/,      // Lehrer, Vater
    /.*ling$/,    // Schmetterling
    /.*ig$/,      // König
    /.*ich$/      // Teppich
  ],
  feminine: [
    /.*ung$/,     // Zeitung
    /.*heit$/,    // Freiheit
    /.*keit$/,    // Möglichkeit
    /.*schaft$/,  // Freundschaft
    /.*ion$/,     // Nation
    /.*tät$/,     // Universität
    /.*e$/        // Lampe (many, not all)
  ],
  neuter: [
    /.*chen$/,    // Mädchen
    /.*lein$/,    // Tischlein
    /.*um$/,      // Museum
    /.*ment$/     // Instrument
  ]
}

/**
 * Category-specific vocabulary patterns
 * Used for semantic distractor generation
 */
export const CATEGORY_PATTERNS: Record<VocabularyCategory, {
  typicalLength: [number, number], // [min, max]
  commonEndings: string[]
}> = {
  ANIMALS: {
    typicalLength: [3, 10],
    commonEndings: ['e', 'el', 'er', 'en']
  },
  COLORS: {
    typicalLength: [3, 8],
    commonEndings: []
  },
  NUMBERS: {
    typicalLength: [3, 8],
    commonEndings: ['zehn', 'zig']
  },
  FAMILY: {
    typicalLength: [4, 10],
    commonEndings: ['er', 'ter', 'mutter', 'vater']
  },
  OBJECTS: {
    typicalLength: [3, 12],
    commonEndings: ['e', 'er', 'el']
  },
  FOOD: {
    typicalLength: [3, 10],
    commonEndings: ['e', 'el', 'en']
  },
  CLOTHING: {
    typicalLength: [3, 10],
    commonEndings: ['e', 'el', 'en']
  },
  BODY_PARTS: {
    typicalLength: [3, 8],
    commonEndings: ['e', 'el', 'er']
  },
  WEATHER: {
    typicalLength: [4, 10],
    commonEndings: ['en', 'e']
  },
  TIME: {
    typicalLength: [3, 10],
    commonEndings: ['e', 'en', 'tag', 'zeit']
  },
  PLACES: {
    typicalLength: [3, 12],
    commonEndings: ['e', 'en', 'platz']
  },
  ACTIONS: {
    typicalLength: [4, 12],
    commonEndings: ['en', 'n']
  }
}

/**
 * Common German word beginnings
 */
export const COMMON_PREFIXES = [
  'be', 'ge', 'ver', 'ent', 'er', 'zer', 'über', 'unter', 'vor', 'zu'
]

/**
 * Grade-level difficulty markers
 */
export const DIFFICULTY_MARKERS = {
  1: {
    maxLength: 6,
    allowsCompounds: false,
    allowsUmlauts: false
  },
  2: {
    maxLength: 8,
    allowsCompounds: false,
    allowsUmlauts: true
  },
  3: {
    maxLength: 10,
    allowsCompounds: true,
    allowsUmlauts: true
  },
  4: {
    maxLength: 12,
    allowsCompounds: true,
    allowsUmlauts: true
  }
}

/**
 * Common compound word components
 */
export const COMPOUND_COMPONENTS = [
  'Haus', 'Auto', 'Schul', 'Kinder', 'Buch', 'Tisch', 'Stuhl',
  'Zimmer', 'Tür', 'Fenster', 'Baum', 'Garten', 'Wasser'
]

/**
 * Phonetic similarity groups (words that sound similar)
 */
export const PHONETIC_GROUPS: Record<string, string[]> = {
  'haus': ['Maus', 'raus', 'Klaus', 'aus'],
  'baum': ['Raum', 'Traum', 'kaum'],
  'kind': ['Wind', 'sind', 'blind'],
  'tisch': ['Fisch', 'frisch', 'misch'],
  'buch': ['Tuch', 'such', 'Uch'],
  'tag': ['mag', 'sag', 'lag'],
  'rot': ['tot', 'Not', 'Boot'],
  'blau': ['grau', 'schlau', 'genau']
}

/**
 * Category relationship mapping for semantic distractors
 */
export const RELATED_CATEGORIES: Record<VocabularyCategory, VocabularyCategory[]> = {
  ANIMALS: ['BODY_PARTS', 'FOOD'],
  COLORS: ['OBJECTS', 'CLOTHING'],
  NUMBERS: ['TIME'],
  FAMILY: ['BODY_PARTS'],
  OBJECTS: ['PLACES', 'ACTIONS'],
  FOOD: ['OBJECTS', 'ANIMALS'],
  CLOTHING: ['COLORS', 'OBJECTS'],
  BODY_PARTS: ['ANIMALS', 'FAMILY'],
  WEATHER: ['TIME', 'PLACES'],
  TIME: ['NUMBERS', 'WEATHER'],
  PLACES: ['OBJECTS', 'WEATHER'],
  ACTIONS: ['OBJECTS', 'BODY_PARTS']
}
