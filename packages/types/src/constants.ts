// App-wide constants
export const APP_CONFIG = {
  name: 'Lexi',
  version: '1.0.0',
  description: 'Educational Learning Platform'
} as const

// Portal-specific constants
export const PORTALS = {
  student: {
    name: 'Lexi Student',
    description: 'Interactive learning for students'
  },
  teacher: {
    name: 'Lexi Teacher Portal', 
    description: 'Manage classes and track student progress'
  },
  parent: {
    name: 'Lexi Parent Portal',
    description: 'Track your child\'s learning progress'
  },
  admin: {
    name: 'Lexi Admin Dashboard',
    description: 'System administration and analytics'
  }
} as const

// Export commonly used values
export const APP_NAME = APP_CONFIG.name