/**
 * Environment-specific seed configurations
 */

export interface SeedConfig {
	organizations: number
	teachers: number
	parents: number
	students: number
	classes: number
	modules: number
	progressSamples: number
	achievements: boolean
	rewards: boolean
	cleanExisting: boolean
}

export const SEED_CONFIGS: Record<string, SeedConfig> = {
	development: {
		organizations: 3,
		teachers: 6,
		parents: 12,
		students: 36,
		classes: 8,
		modules: 8,
		progressSamples: 15,
		achievements: true,
		rewards: true,
		cleanExisting: true
	},
	testing: {
		organizations: 2,
		teachers: 4,
		parents: 8,
		students: 16,
		classes: 4,
		modules: 4,
		progressSamples: 8,
		achievements: true,
		rewards: true,
		cleanExisting: true
	},
	staging: {
		organizations: 5,
		teachers: 15,
		parents: 30,
		students: 90,
		classes: 15,
		modules: 12,
		progressSamples: 30,
		achievements: true,
		rewards: true,
		cleanExisting: false
	},
	production: {
		organizations: 0,
		teachers: 0,
		parents: 0,
		students: 0,
		classes: 0,
		modules: 0,
		progressSamples: 0,
		achievements: true, // Only create achievements and rewards in production
		rewards: true,
		cleanExisting: false
	}
}

export function getSeedConfig(environment?: string): SeedConfig {
	const env = environment || process.env.NODE_ENV || 'development'
	return SEED_CONFIGS[env] || SEED_CONFIGS.development
}

export const SAMPLE_DATA = {
	germanNames: [
		'Alexander', 'Anna', 'Ben', 'Clara', 'David', 'Emma', 'Felix', 'Greta',
		'Hans', 'Ida', 'Jakob', 'Klara', 'Leon', 'Mia', 'Noah', 'Olivia',
		'Paul', 'Quinn', 'Rebecca', 'Simon', 'Tina', 'Ulrich', 'Vera', 'Wilhelm',
		'Xaver', 'Yvonne', 'Zacharias', 'Adelaide', 'Bruno', 'Celine', 'Dietrich', 'Elsa'
	],
	teacherNames: [
		{ first: 'Anna', last: 'Schmidt' },
		{ first: 'Marcus', last: 'Mueller' },
		{ first: 'Julia', last: 'Weber' },
		{ first: 'Thomas', last: 'Wagner' },
		{ first: 'Sarah', last: 'Becker' },
		{ first: 'Michael', last: 'Schulz' },
		{ first: 'Lisa', last: 'Hoffmann' },
		{ first: 'David', last: 'Koch' },
		{ first: 'Maria', last: 'Richter' },
		{ first: 'Stefan', last: 'Klein' }
	],
	parentNames: [
		{ first: 'Maria', last: 'Schmidt' },
		{ first: 'Stefan', last: 'Mueller' },
		{ first: 'Lisa', last: 'Weber' },
		{ first: 'Thomas', last: 'Wagner' },
		{ first: 'Sarah', last: 'Becker' },
		{ first: 'Michael', last: 'Schulz' },
		{ first: 'Emma', last: 'Hoffmann' },
		{ first: 'David', last: 'Koch' },
		{ first: 'Anna', last: 'Richter' },
		{ first: 'Marcus', last: 'Klein' },
		{ first: 'Julia', last: 'Wolf' },
		{ first: 'Felix', last: 'Schroeder' },
		{ first: 'Clara', last: 'Neumann' },
		{ first: 'Ben', last: 'Schwarz' },
		{ first: 'Greta', last: 'Zimmermann' }
	],
	organizations: [
		{
			name: 'Sunshine Elementary School',
			code: 'SUNSHINE_ELEM',
			type: 'SCHOOL' as const,
			address: '123 Education Street, Learning City, LC 12345',
			phone: '+49-89-123456',
			email: 'contact@sunshine-elementary.de'
		},
		{
			name: 'Riverside Learning Center',
			code: 'RIVERSIDE_LC',
			type: 'PRIVATE' as const,
			address: '456 River Road, Education Town, ET 67890',
			phone: '+49-89-234567',
			email: 'info@riverside-learning.de'
		},
		{
			name: 'Metropolitan School District',
			code: 'METRO_DISTRICT',
			type: 'DISTRICT' as const,
			address: '789 District Avenue, Metro City, MC 11111',
			phone: '+49-89-345678',
			email: 'admin@metro-schools.de'
		},
		{
			name: 'Waldorf Primary School',
			code: 'WALDORF_PRIMARY',
			type: 'PRIVATE' as const,
			address: '321 Nature Lane, Green Valley, GV 22222',
			phone: '+49-89-456789',
			email: 'contact@waldorf-primary.de'
		},
		{
			name: 'International School Berlin',
			code: 'IS_BERLIN',
			type: 'PRIVATE' as const,
			address: '654 Global Street, Berlin, BE 33333',
			phone: '+49-30-567890',
			email: 'admissions@is-berlin.de'
		}
	],
	vocabularyCategories: {
		animals: [
			{ word: 'Hund', translation: 'Dog', difficulty: 'BEGINNER' },
			{ word: 'Katze', translation: 'Cat', difficulty: 'BEGINNER' },
			{ word: 'Vogel', translation: 'Bird', difficulty: 'BEGINNER' },
			{ word: 'Fisch', translation: 'Fish', difficulty: 'BEGINNER' },
			{ word: 'Pferd', translation: 'Horse', difficulty: 'INTERMEDIATE' },
			{ word: 'Kuh', translation: 'Cow', difficulty: 'INTERMEDIATE' },
			{ word: 'Schwein', translation: 'Pig', difficulty: 'INTERMEDIATE' },
			{ word: 'Schaf', translation: 'Sheep', difficulty: 'INTERMEDIATE' }
		],
		colors: [
			{ word: 'Rot', translation: 'Red', difficulty: 'BEGINNER' },
			{ word: 'Blau', translation: 'Blue', difficulty: 'BEGINNER' },
			{ word: 'Grün', translation: 'Green', difficulty: 'BEGINNER' },
			{ word: 'Gelb', translation: 'Yellow', difficulty: 'BEGINNER' },
			{ word: 'Orange', translation: 'Orange', difficulty: 'BEGINNER' },
			{ word: 'Lila', translation: 'Purple', difficulty: 'INTERMEDIATE' },
			{ word: 'Rosa', translation: 'Pink', difficulty: 'INTERMEDIATE' },
			{ word: 'Schwarz', translation: 'Black', difficulty: 'INTERMEDIATE' },
			{ word: 'Weiß', translation: 'White', difficulty: 'INTERMEDIATE' }
		],
		numbers: [
			{ word: 'Eins', translation: 'One', difficulty: 'BEGINNER' },
			{ word: 'Zwei', translation: 'Two', difficulty: 'BEGINNER' },
			{ word: 'Drei', translation: 'Three', difficulty: 'BEGINNER' },
			{ word: 'Vier', translation: 'Four', difficulty: 'BEGINNER' },
			{ word: 'Fünf', translation: 'Five', difficulty: 'BEGINNER' },
			{ word: 'Sechs', translation: 'Six', difficulty: 'INTERMEDIATE' },
			{ word: 'Sieben', translation: 'Seven', difficulty: 'INTERMEDIATE' },
			{ word: 'Acht', translation: 'Eight', difficulty: 'INTERMEDIATE' },
			{ word: 'Neun', translation: 'Nine', difficulty: 'INTERMEDIATE' },
			{ word: 'Zehn', translation: 'Ten', difficulty: 'INTERMEDIATE' }
		],
		family: [
			{ word: 'Familie', translation: 'Family', difficulty: 'BEGINNER' },
			{ word: 'Mama', translation: 'Mom', difficulty: 'BEGINNER' },
			{ word: 'Papa', translation: 'Dad', difficulty: 'BEGINNER' },
			{ word: 'Kind', translation: 'Child', difficulty: 'BEGINNER' },
			{ word: 'Bruder', translation: 'Brother', difficulty: 'INTERMEDIATE' },
			{ word: 'Schwester', translation: 'Sister', difficulty: 'INTERMEDIATE' },
			{ word: 'Großmutter', translation: 'Grandmother', difficulty: 'ADVANCED' },
			{ word: 'Großvater', translation: 'Grandfather', difficulty: 'ADVANCED' }
		],
		objects: [
			{ word: 'Haus', translation: 'House', difficulty: 'BEGINNER' },
			{ word: 'Auto', translation: 'Car', difficulty: 'BEGINNER' },
			{ word: 'Buch', translation: 'Book', difficulty: 'BEGINNER' },
			{ word: 'Tisch', translation: 'Table', difficulty: 'BEGINNER' },
			{ word: 'Stuhl', translation: 'Chair', difficulty: 'BEGINNER' },
			{ word: 'Fenster', translation: 'Window', difficulty: 'INTERMEDIATE' },
			{ word: 'Türe', translation: 'Door', difficulty: 'INTERMEDIATE' },
			{ word: 'Computer', translation: 'Computer', difficulty: 'INTERMEDIATE' }
		],
		food: [
			{ word: 'Apfel', translation: 'Apple', difficulty: 'BEGINNER' },
			{ word: 'Brot', translation: 'Bread', difficulty: 'BEGINNER' },
			{ word: 'Wasser', translation: 'Water', difficulty: 'BEGINNER' },
			{ word: 'Milch', translation: 'Milk', difficulty: 'BEGINNER' },
			{ word: 'Banane', translation: 'Banana', difficulty: 'BEGINNER' },
			{ word: 'Käse', translation: 'Cheese', difficulty: 'INTERMEDIATE' },
			{ word: 'Fleisch', translation: 'Meat', difficulty: 'INTERMEDIATE' },
			{ word: 'Gemüse', translation: 'Vegetables', difficulty: 'INTERMEDIATE' }
		]
	},
	achievements: [
		{
			name: 'Erste Schritte',
			description: 'Complete your first learning activity',
			type: 'MILESTONE' as const,
			criteria: { lessonsCompleted: 1 },
			reward: { points: 50, badge: 'erste-schritte' }
		},
		{
			name: 'Wortschatz-Meister',
			description: 'Learn 25 new German words',
			type: 'MASTERY' as const,
			criteria: { vocabularyLearned: 25 },
			reward: { points: 200, badge: 'wortschatz-meister' }
		},
		{
			name: 'Fleißiger Schüler',
			description: 'Login every day for a week',
			type: 'STREAK' as const,
			criteria: { loginStreak: 7 },
			reward: { points: 300, badge: 'fleissiger-schueler' }
		},
		{
			name: 'Lese-Star',
			description: 'Complete 10 reading exercises',
			type: 'MILESTONE' as const,
			criteria: { readingCompleted: 10 },
			reward: { points: 250, badge: 'lese-star' }
		},
		{
			name: 'Perfekte Punktzahl',
			description: 'Get 100% on any assessment',
			type: 'SPECIAL' as const,
			criteria: { perfectScore: 1 },
			reward: { points: 500, badge: 'perfekte-punktzahl' }
		},
		{
			name: 'Schreiber',
			description: 'Complete 5 writing exercises',
			type: 'MILESTONE' as const,
			criteria: { writingCompleted: 5 },
			reward: { points: 175, badge: 'schreiber' }
		},
		{
			name: 'Ausdauer',
			description: 'Study for 30 days in total',
			type: 'STREAK' as const,
			criteria: { totalStudyDays: 30 },
			reward: { points: 750, badge: 'ausdauer' }
		},
		{
			name: 'Helfer',
			description: 'Help 3 classmates with exercises',
			type: 'SPECIAL' as const,
			criteria: { helpedClassmates: 3 },
			reward: { points: 400, badge: 'helfer' }
		}
	],
	rewards: [
		{ name: 'Goldener Stern', type: 'VIRTUAL' as const, cost: 100, description: 'A shiny golden star badge' },
		{ name: 'Regenbogen-Abzeichen', type: 'VIRTUAL' as const, cost: 150, description: 'Beautiful rainbow colored badge' },
		{ name: 'Super-Schüler Zertifikat', type: 'VIRTUAL' as const, cost: 200, description: 'Official certificate of achievement' },
		{ name: 'Lern-Krone', type: 'VIRTUAL' as const, cost: 300, description: 'Crown for exceptional learners' },
		{ name: 'Bonus-Zeit', type: 'DIGITAL' as const, cost: 50, description: '10 extra minutes of game time' },
		{ name: 'Lieblings-Avatar', type: 'VIRTUAL' as const, cost: 125, description: 'Unlock special avatar customization' },
		{ name: 'Musik-Pause', type: 'DIGITAL' as const, cost: 75, description: '5 minutes of music break' },
		{ name: 'Freunde-Nachricht', type: 'DIGITAL' as const, cost: 25, description: 'Send a message to a classmate' }
	]
}