// Type definitions for translation system

/**
 * Supported locale codes
 */
export type SupportedLocale = 'de' | 'en'

/**
 * Translation object structure
 */
export interface TranslationObject {
  [key: string]: string | TranslationObject
}

/**
 * Complete translation structure matching our JSON files
 */
export interface Translations {
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    back: string
    next: string
    previous: string
    close: string
    yes: string
    no: string
    welcome: string
  }
  auth: {
    login: string
    logout: string
    student_login: string
    teacher_login: string
    parent_login: string
    scan_qr_prompt: string
    enter_code_manually: string
    student_code: string
    password: string
    email: string
    login_failed: string
    invalid_credentials: string
    camera_access_denied: string
    qr_expired: string
    invalid_qr: string
    processing_qr: string
    login_successful: string
    redirecting: string
  }
  qr: {
    management: string
    generate: string
    generated: string
    expires_in: string
    expired: string
    active: string
    refresh: string
    print: string
    copy: string
    batch_generate: string
    print_sheet: string
    analytics: string
    total_generated: string
    total_scanned: string
    active_codes: string
    success_rate: string
    show_analytics: string
    hide_analytics: string
    expires_label: string
    class_selection: string
    no_qr_generated: string
    help_title: string
    help_step_1: string
    help_step_2: string
    help_step_3: string
    help_step_4: string
  }
  dashboard: {
    title: string
    welcome_student: string
    welcome_teacher: string
    my_classes: string
    my_progress: string
    recent_activities: string
    quick_actions: string
  }
  learning: {
    modules: string
    vocabulary: string
    exercises: string
    progress: string
    achievements: string
    rewards: string
    completed: string
    in_progress: string
    not_started: string
    difficulty: {
      beginner: string
      intermediate: string
      advanced: string
    }
    categories: {
      animals: string
      colors: string
      numbers: string
      family: string
      objects: string
      food: string
    }
  }
  navigation: {
    dashboard: string
    learning: string
    progress: string
    profile: string
    settings: string
    help: string
    qr_codes: string
    students: string
    classes: string
    reports: string
  }
  settings: {
    title: string
    language: string
    notifications: string
    privacy: string
    account: string
    appearance: string
    theme: string
    light: string
    dark: string
    system: string
  }
  errors: {
    generic: string
    network: string
    offline: string
    permission_denied: string
    not_found: string
    validation_failed: string
    try_again: string
    contact_support: string
  }
  time: {
    now: string
    minutes_ago: string
    hours_ago: string
    days_ago: string
    today: string
    yesterday: string
    this_week: string
    last_week: string
  }
}

/**
 * Translation key paths for type-safe access
 */
export type TranslationKey = 
  | `common.${keyof Translations['common']}`
  | `auth.${keyof Translations['auth']}`
  | `qr.${keyof Translations['qr']}`
  | `dashboard.${keyof Translations['dashboard']}`
  | `learning.${keyof Translations['learning']}`
  | `learning.difficulty.${keyof Translations['learning']['difficulty']}`
  | `learning.categories.${keyof Translations['learning']['categories']}`
  | `navigation.${keyof Translations['navigation']}`
  | `settings.${keyof Translations['settings']}`
  | `errors.${keyof Translations['errors']}`
  | `time.${keyof Translations['time']}`

/**
 * Localized content structure for database storage
 */
export interface LocalizedContent {
  de: string
  en: string
  [locale: string]: string // Allow for future locales
}

/**
 * Learning content with localization support
 */
export interface LocalizedLearningContent {
  name: LocalizedContent
  description: LocalizedContent
  instructions?: LocalizedContent
}

/**
 * Vocabulary word with full localization
 */
export interface LocalizedVocabulary {
  word: LocalizedContent // The word in different languages
  translation: LocalizedContent // Translations/explanations
  phonetic?: LocalizedContent // Phonetic pronunciation
  definition?: LocalizedContent // Detailed definition
  example?: LocalizedContent // Usage example
}

/**
 * Achievement with localization
 */
export interface LocalizedAchievement {
  name: LocalizedContent
  description: LocalizedContent
  congratulation?: LocalizedContent // Celebration message
}

/**
 * User role translations
 */
export type UserRole = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'

export interface RoleTranslations {
  [K in UserRole]: LocalizedContent
}

/**
 * Formatting options for localized content
 */
export interface LocaleFormatOptions {
  dateStyle?: 'short' | 'medium' | 'long' | 'full'
  timeStyle?: 'short' | 'medium' | 'long' | 'full'
  numberStyle?: 'decimal' | 'currency' | 'percent'
  currencyCode?: string
}

/**
 * Context for dynamic translations
 */
export interface TranslationContext {
  count?: number
  name?: string
  hours?: number
  minutes?: number
  [key: string]: string | number | undefined
}