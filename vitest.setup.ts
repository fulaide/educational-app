import { vi } from 'vitest';

// Mock global objects that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
	root: null,
	rootMargin: '',
	thresholds: []
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// Mock Capacitor for mobile tests
vi.mock('@capacitor/core', () => ({
	Capacitor: {
		getPlatform: vi.fn(() => 'web'),
		isNativePlatform: vi.fn(() => false),
		isPluginAvailable: vi.fn(() => false)
	},
	registerPlugin: vi.fn()
}));

// Mock crypto for UUID generation in tests
Object.defineProperty(global, 'crypto', {
	value: {
		randomUUID: vi.fn(() => 'test-uuid-1234-5678-9012-123456789012'),
		getRandomValues: vi.fn((arr) => {
			for (let i = 0; i < arr.length; i++) {
				arr[i] = Math.floor(Math.random() * 256);
			}
			return arr;
		})
	}
});

// Mock navigator.clipboard for QR code tests
Object.defineProperty(navigator, 'clipboard', {
	value: {
		writeText: vi.fn(() => Promise.resolve())
	}
});

// Extend expect with custom matchers
expect.extend({
	toHaveAccessibleName(received, expected) {
		const element = received as HTMLElement;
		const accessibleName = element.getAttribute('aria-label') || 
							   element.getAttribute('aria-labelledby') ||
							   element.textContent;
		
		const pass = accessibleName === expected;
		
		if (pass) {
			return {
				message: () => `Expected element not to have accessible name "${expected}"`,
				pass: true
			};
		} else {
			return {
				message: () => `Expected element to have accessible name "${expected}", but got "${accessibleName}"`,
				pass: false
			};
		}
	}
});

// Educational app specific test utilities
export const mockStudent = {
	id: 'test-student-id',
	uuid: 'test-uuid-1234-5678-9012-123456789012',
	role: 'STUDENT' as const,
	grade: 1,
	organizationId: 'test-org',
	isActive: true,
	createdAt: new Date(),
	updatedAt: new Date(),
	settings: {
		soundEnabled: true,
		vibrationEnabled: true,
		theme: 'auto' as const,
		language: 'de'
	}
};

export const mockTeacher = {
	id: 'test-teacher-id',
	role: 'TEACHER' as const,
	email: 'teacher@test.com',
	name: 'Test Teacher',
	organizationId: 'test-org',
	isVerified: true,
	classes: ['test-class-id'],
	createdAt: new Date(),
	updatedAt: new Date()
};

export const mockTask = {
	id: 'test-task-id',
	moduleId: 'test-module-id',
	type: 'VOCABULARY' as const,
	title: 'Test Vocabulary Task',
	instructions: 'Test instructions',
	content: { word: 'Test' },
	correctAnswer: 'test',
	hints: ['This is a test'],
	maxAttempts: 3,
	timeLimit: null,
	xpReward: 10,
	isPublished: true,
	createdAt: new Date(),
	updatedAt: new Date()
};