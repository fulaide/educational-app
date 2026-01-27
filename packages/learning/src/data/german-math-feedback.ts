/**
 * German Math Feedback Phrases
 * Phrases and templates for providing German feedback on math problems
 */

/**
 * Success phrases for correct answers
 */
export const SUCCESS_PHRASES = [
  'Gut gemacht!',
  'Prima!',
  'Super!',
  'Richtig!',
  'Toll gemacht!',
  'Sehr gut!',
  'Ausgezeichnet!',
  'Wunderbar!',
  'Klasse!',
  'Fantastisch!'
] as const

/**
 * Encouragement phrases for incorrect answers
 */
export const ENCOURAGEMENT_PHRASES = [
  'Nicht ganz richtig.',
  'Versuche es noch einmal!',
  'Fast richtig!',
  'Knapp daneben.',
  'Probiere es nochmal!'
] as const

/**
 * Get a random success phrase
 */
export function getRandomSuccessPhrase(): string {
  return SUCCESS_PHRASES[Math.floor(Math.random() * SUCCESS_PHRASES.length)]
}

/**
 * Get a random encouragement phrase
 */
export function getRandomEncouragementPhrase(): string {
  return ENCOURAGEMENT_PHRASES[Math.floor(Math.random() * ENCOURAGEMENT_PHRASES.length)]
}

/**
 * Number bonds to 10 (Verliebte Zahlen)
 * These are pairs that add up to 10
 */
export const VERLIEBTE_ZAHLEN: Record<number, number> = {
  0: 10,
  1: 9,
  2: 8,
  3: 7,
  4: 6,
  5: 5,
  6: 4,
  7: 3,
  8: 2,
  9: 1,
  10: 0
}

/**
 * Get the partner number for "Verliebte Zahlen"
 */
export function getVerliebteZahl(n: number): number {
  if (n < 0 || n > 10) return 0
  return VERLIEBTE_ZAHLEN[n]
}

/**
 * Generate explanation for Zehnerübergang (crossing tens) addition
 * Example: 7 + 5 = 12
 * "7 braucht noch 3 bis zur 10 (Verliebte Zahlen: 7 und 3).
 *  7 + 3 = 10, dann noch 2 dazu: 10 + 2 = 12."
 */
export function generateZehneruebergangAdditionExplanation(
  a: number,
  b: number,
  result: number
): string {
  // Find how much is needed to reach the next ten from a
  const toNextTen = getVerliebteZahl(a % 10)
  const remainder = b - toNextTen
  const nextTen = a + toNextTen

  if (toNextTen === 0 || toNextTen > b) {
    // No Zehnerübergang needed or different approach
    return `${a} + ${b} = ${result}`
  }

  return (
    `Schauen wir uns das zusammen an:\n` +
    `${a} + ${b} - wir teilen die ${b} auf.\n` +
    `${a} braucht noch ${toNextTen} bis zur ${nextTen} (Verliebte Zahlen: ${a % 10} und ${toNextTen}).\n` +
    `${a} + ${toNextTen} = ${nextTen}, dann noch ${remainder} dazu: ${nextTen} + ${remainder} = ${result}.`
  )
}

/**
 * Generate explanation for Zehnerübergang (crossing tens) subtraction
 * Example: 13 - 5 = 8
 * "13 - 5: Wir gehen erst zur 10.
 *  13 - 3 = 10, dann noch 2 abziehen: 10 - 2 = 8."
 */
export function generateZehneruebergangSubtractionExplanation(
  a: number,
  b: number,
  result: number
): string {
  const onesDigit = a % 10
  const toTen = onesDigit
  const remainder = b - toTen
  const ten = a - toTen

  if (onesDigit === 0 || toTen >= b) {
    // No Zehnerübergang or different approach
    return `${a} - ${b} = ${result}`
  }

  return (
    `Schauen wir uns das zusammen an:\n` +
    `${a} - ${b}: Wir gehen erst zur ${ten}.\n` +
    `${a} - ${toTen} = ${ten}, dann noch ${remainder} abziehen: ${ten} - ${remainder} = ${result}.`
  )
}

/**
 * Generate simple explanation without Zehnerübergang
 */
export function generateSimpleExplanation(
  a: number,
  b: number,
  operation: 'addition' | 'subtraction',
  result: number
): string {
  const operatorSymbol = operation === 'addition' ? '+' : '-'
  return `${a} ${operatorSymbol} ${b} = ${result}`
}

/**
 * Generate explanation for an incorrect answer
 */
export function generateIncorrectExplanation(
  a: number,
  b: number,
  operation: 'addition' | 'subtraction',
  correctAnswer: number,
  userAnswer: number,
  hasZehneruebergang: boolean
): string {
  const encouragement = getRandomEncouragementPhrase()
  const operatorSymbol = operation === 'addition' ? '+' : '-'

  let explanation: string
  if (hasZehneruebergang) {
    explanation = operation === 'addition'
      ? generateZehneruebergangAdditionExplanation(a, b, correctAnswer)
      : generateZehneruebergangSubtractionExplanation(a, b, correctAnswer)
  } else {
    explanation = generateSimpleExplanation(a, b, operation, correctAnswer)
  }

  const diff = Math.abs(userAnswer - correctAnswer)
  let hint = ''

  if (diff === 1) {
    hint = 'Du warst ganz nah dran!'
  } else if (diff <= 5) {
    hint = 'Fast richtig!'
  }

  return `${encouragement} ${hint}\n\n${explanation}`
}

/**
 * Generate explanation for a correct answer
 */
export function generateCorrectExplanation(
  a: number,
  b: number,
  operation: 'addition' | 'subtraction',
  result: number,
  hasZehneruebergang: boolean
): string {
  const praise = getRandomSuccessPhrase()

  if (hasZehneruebergang) {
    // Acknowledge the complexity
    return `${praise} Du hast den Zehnerübergang super gemeistert!`
  }

  return praise
}

/**
 * German number words for 0-20
 */
export const GERMAN_NUMBERS: Record<number, string> = {
  0: 'null',
  1: 'eins',
  2: 'zwei',
  3: 'drei',
  4: 'vier',
  5: 'fünf',
  6: 'sechs',
  7: 'sieben',
  8: 'acht',
  9: 'neun',
  10: 'zehn',
  11: 'elf',
  12: 'zwölf',
  13: 'dreizehn',
  14: 'vierzehn',
  15: 'fünfzehn',
  16: 'sechzehn',
  17: 'siebzehn',
  18: 'achtzehn',
  19: 'neunzehn',
  20: 'zwanzig'
}

/**
 * Get German word for a number (supports 0-100)
 */
export function getGermanNumber(n: number): string {
  if (n < 0 || n > 100 || !Number.isInteger(n)) {
    return String(n)
  }

  if (n <= 20) {
    return GERMAN_NUMBERS[n]
  }

  if (n === 100) {
    return 'hundert'
  }

  const tens = Math.floor(n / 10) * 10
  const ones = n % 10

  const tensWords: Record<number, string> = {
    30: 'dreißig',
    40: 'vierzig',
    50: 'fünfzig',
    60: 'sechzig',
    70: 'siebzig',
    80: 'achtzig',
    90: 'neunzig'
  }

  if (ones === 0) {
    return tensWords[tens] || GERMAN_NUMBERS[20]
  }

  // German number construction: ones + "und" + tens
  // e.g., 23 = "dreiundzwanzig" (three and twenty)
  const tensWord = tens === 20 ? 'zwanzig' : tensWords[tens]
  return `${GERMAN_NUMBERS[ones]}und${tensWord}`
}

/**
 * Format a math problem as spoken German
 * e.g., "sieben plus fünf ist gleich?" or "zwölf minus drei ist gleich?"
 */
export function formatProblemAsSpokenGerman(
  a: number,
  b: number,
  operation: 'addition' | 'subtraction',
  unknownPosition: 'left' | 'right' | 'result'
): string {
  const operatorWord = operation === 'addition' ? 'plus' : 'minus'

  if (unknownPosition === 'result') {
    return `${getGermanNumber(a)} ${operatorWord} ${getGermanNumber(b)} ist gleich?`
  }

  if (unknownPosition === 'left') {
    const result = operation === 'addition' ? a + b : a - b
    return `Welche Zahl ${operatorWord} ${getGermanNumber(b)} ergibt ${getGermanNumber(result)}?`
  }

  // unknownPosition === 'right'
  const result = operation === 'addition' ? a + b : a - b
  return `${getGermanNumber(a)} ${operatorWord} welche Zahl ergibt ${getGermanNumber(result)}?`
}
