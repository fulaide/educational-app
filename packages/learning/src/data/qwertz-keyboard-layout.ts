/**
 * QWERTZ Keyboard Layout (German)
 *
 * Defines the complete German QWERTZ keyboard layout with finger positions,
 * key zones, and special character mappings.
 */

export type KeyFinger = 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' |
                        'right-index' | 'right-middle' | 'right-ring' | 'right-pinky' | 'thumb'

export type KeyZone = 'left' | 'center' | 'right'

export interface KeyDefinition {
  key: string
  shiftKey?: string
  altGrKey?: string
  finger: KeyFinger
  zone: KeyZone
  label: string
  width?: number // multiplier (1 = normal, 1.5 = wider, 2 = double)
  isSpecial?: boolean // modifier keys, space, etc.
}

export interface KeyRow {
  keys: KeyDefinition[]
  offset?: number // horizontal offset for row alignment
}

/**
 * Complete QWERTZ keyboard layout
 */
export const qwertzLayout: KeyRow[] = [
  // Number row
  {
    keys: [
      { key: '^', shiftKey: '°', label: '^', finger: 'left-pinky', zone: 'left' },
      { key: '1', shiftKey: '!', label: '1', finger: 'left-pinky', zone: 'left' },
      { key: '2', shiftKey: '"', altGrKey: '²', label: '2', finger: 'left-ring', zone: 'left' },
      { key: '3', shiftKey: '§', altGrKey: '³', label: '3', finger: 'left-middle', zone: 'left' },
      { key: '4', shiftKey: '$', label: '4', finger: 'left-index', zone: 'left' },
      { key: '5', shiftKey: '%', label: '5', finger: 'left-index', zone: 'left' },
      { key: '6', shiftKey: '&', label: '6', finger: 'right-index', zone: 'right' },
      { key: '7', shiftKey: '/', altGrKey: '{', label: '7', finger: 'right-index', zone: 'right' },
      { key: '8', shiftKey: '(', altGrKey: '[', label: '8', finger: 'right-middle', zone: 'right' },
      { key: '9', shiftKey: ')', altGrKey: ']', label: '9', finger: 'right-ring', zone: 'right' },
      { key: '0', shiftKey: '=', altGrKey: '}', label: '0', finger: 'right-pinky', zone: 'right' },
      { key: 'ß', shiftKey: '?', altGrKey: '\\', label: 'ß', finger: 'right-pinky', zone: 'right' },
      { key: '´', shiftKey: '`', label: '´', finger: 'right-pinky', zone: 'right' }
    ]
  },
  // Top letter row (QWERTZ)
  {
    keys: [
      { key: 'q', shiftKey: 'Q', altGrKey: '@', label: 'Q', finger: 'left-pinky', zone: 'left' },
      { key: 'w', shiftKey: 'W', label: 'W', finger: 'left-ring', zone: 'left' },
      { key: 'e', shiftKey: 'E', altGrKey: '€', label: 'E', finger: 'left-middle', zone: 'left' },
      { key: 'r', shiftKey: 'R', label: 'R', finger: 'left-index', zone: 'left' },
      { key: 't', shiftKey: 'T', label: 'T', finger: 'left-index', zone: 'left' },
      { key: 'z', shiftKey: 'Z', label: 'Z', finger: 'right-index', zone: 'right' },
      { key: 'u', shiftKey: 'U', label: 'U', finger: 'right-index', zone: 'right' },
      { key: 'i', shiftKey: 'I', label: 'I', finger: 'right-middle', zone: 'right' },
      { key: 'o', shiftKey: 'O', label: 'O', finger: 'right-ring', zone: 'right' },
      { key: 'p', shiftKey: 'P', label: 'P', finger: 'right-pinky', zone: 'right' },
      { key: 'ü', shiftKey: 'Ü', label: 'Ü', finger: 'right-pinky', zone: 'right' },
      { key: '+', shiftKey: '*', altGrKey: '~', label: '+', finger: 'right-pinky', zone: 'right' }
    ],
    offset: 0.25
  },
  // Middle letter row (ASDF - home row)
  {
    keys: [
      { key: 'a', shiftKey: 'A', label: 'A', finger: 'left-pinky', zone: 'left' },
      { key: 's', shiftKey: 'S', label: 'S', finger: 'left-ring', zone: 'left' },
      { key: 'd', shiftKey: 'D', label: 'D', finger: 'left-middle', zone: 'left' },
      { key: 'f', shiftKey: 'F', label: 'F', finger: 'left-index', zone: 'left' },
      { key: 'g', shiftKey: 'G', label: 'G', finger: 'left-index', zone: 'left' },
      { key: 'h', shiftKey: 'H', label: 'H', finger: 'right-index', zone: 'right' },
      { key: 'j', shiftKey: 'J', label: 'J', finger: 'right-index', zone: 'right' },
      { key: 'k', shiftKey: 'K', label: 'K', finger: 'right-middle', zone: 'right' },
      { key: 'l', shiftKey: 'L', label: 'L', finger: 'right-ring', zone: 'right' },
      { key: 'ö', shiftKey: 'Ö', label: 'Ö', finger: 'right-pinky', zone: 'right' },
      { key: 'ä', shiftKey: 'Ä', label: 'Ä', finger: 'right-pinky', zone: 'right' },
      { key: '#', shiftKey: "'", label: '#', finger: 'right-pinky', zone: 'right' }
    ],
    offset: 0.5
  },
  // Bottom letter row (YXCV)
  {
    keys: [
      { key: '<', shiftKey: '>', altGrKey: '|', label: '<', finger: 'left-pinky', zone: 'left' },
      { key: 'y', shiftKey: 'Y', label: 'Y', finger: 'left-pinky', zone: 'left' },
      { key: 'x', shiftKey: 'X', label: 'X', finger: 'left-ring', zone: 'left' },
      { key: 'c', shiftKey: 'C', label: 'C', finger: 'left-middle', zone: 'left' },
      { key: 'v', shiftKey: 'V', label: 'V', finger: 'left-index', zone: 'left' },
      { key: 'b', shiftKey: 'B', label: 'B', finger: 'left-index', zone: 'left' },
      { key: 'n', shiftKey: 'N', label: 'N', finger: 'right-index', zone: 'right' },
      { key: 'm', shiftKey: 'M', altGrKey: 'µ', label: 'M', finger: 'right-index', zone: 'right' },
      { key: ',', shiftKey: ';', label: ',', finger: 'right-middle', zone: 'right' },
      { key: '.', shiftKey: ':', label: '.', finger: 'right-ring', zone: 'right' },
      { key: '-', shiftKey: '_', label: '-', finger: 'right-pinky', zone: 'right' }
    ],
    offset: 0.75
  },
  // Space bar row
  {
    keys: [
      { key: ' ', label: 'Space', finger: 'thumb', zone: 'center', width: 6, isSpecial: true }
    ],
    offset: 3
  }
]

/**
 * Finger to color mapping for visual guidance
 */
export const fingerColors: Record<KeyFinger, string> = {
  'left-pinky': 'bg-pink-200 text-pink-900',
  'left-ring': 'bg-purple-200 text-purple-900',
  'left-middle': 'bg-blue-200 text-blue-900',
  'left-index': 'bg-green-200 text-green-900',
  'right-index': 'bg-yellow-200 text-yellow-900',
  'right-middle': 'bg-orange-200 text-orange-900',
  'right-ring': 'bg-red-200 text-red-900',
  'right-pinky': 'bg-rose-200 text-rose-900',
  'thumb': 'bg-neutral-200 text-neutral-900'
}

/**
 * Finger to border color mapping for active state
 */
export const fingerBorderColors: Record<KeyFinger, string> = {
  'left-pinky': 'border-pink-500',
  'left-ring': 'border-purple-500',
  'left-middle': 'border-blue-500',
  'left-index': 'border-green-500',
  'right-index': 'border-yellow-500',
  'right-middle': 'border-orange-500',
  'right-ring': 'border-red-500',
  'right-pinky': 'border-rose-500',
  'thumb': 'border-neutral-500'
}

/**
 * Get key definition for a given character
 */
export function findKeyForChar(char: string): KeyDefinition | null {
  for (const row of qwertzLayout) {
    for (const key of row.keys) {
      if (key.key === char || key.shiftKey === char || key.altGrKey === char) {
        return key
      }
    }
  }
  return null
}

/**
 * Check if character requires shift key
 */
export function requiresShift(char: string): boolean {
  for (const row of qwertzLayout) {
    for (const key of row.keys) {
      if (key.shiftKey === char) {
        return true
      }
    }
  }
  return false
}

/**
 * Check if character requires AltGr key
 */
export function requiresAltGr(char: string): boolean {
  for (const row of qwertzLayout) {
    for (const key of row.keys) {
      if (key.altGrKey === char) {
        return true
      }
    }
  }
  return false
}

/**
 * Get home row keys (ASDF JKL;)
 */
export function getHomeRowKeys(): KeyDefinition[] {
  return qwertzLayout[2].keys.filter(k =>
    ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö'].includes(k.key)
  )
}

/**
 * Keyboard zones for hint system
 */
export const keyboardZones = {
  left: 'Left hand zone (Q-T, A-G, Y-B)',
  center: 'Center zone (Space)',
  right: 'Right hand zone (Z-P, H-Ä, N-_)'
} as const
