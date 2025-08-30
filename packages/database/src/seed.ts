import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { v4 as uuid } from 'uuid'

const prisma = new PrismaClient()

// Sample data constants
const SAMPLE_ORGANIZATIONS = [
	{
		name: 'Sunshine Elementary School',
		code: 'SUNSHINE_ELEM',
		type: 'SCHOOL' as const,
		address: '123 Education Street, Learning City, LC 12345',
		phone: '+1-555-0123',
		email: 'contact@sunshine-elementary.edu'
	},
	{
		name: 'Riverside Learning Center', 
		code: 'RIVERSIDE_LC',
		type: 'PRIVATE' as const,
		address: '456 River Road, Education Town, ET 67890',
		phone: '+1-555-0456',
		email: 'info@riverside-learning.edu'
	},
	{
		name: 'Metropolitan School District',
		code: 'METRO_DISTRICT',
		type: 'DISTRICT' as const,
		address: '789 District Avenue, Metro City, MC 11111',
		phone: '+1-555-0789',
		email: 'admin@metro-schools.edu'
	}
]

const SAMPLE_CLASSES = [
	{ name: 'Class 1A', code: 'SUN_1A', grade: 1 },
	{ name: 'Class 1B', code: 'SUN_1B', grade: 1 },
	{ name: 'Class 2A', code: 'SUN_2A', grade: 2 },
	{ name: 'Class 2B', code: 'SUN_2B', grade: 2 },
	{ name: 'Class 3A', code: 'SUN_3A', grade: 3 },
	{ name: 'Riverside Beginners', code: 'RIV_BEGIN', grade: 1 },
	{ name: 'Riverside Advanced', code: 'RIV_ADV', grade: 2 }
]

const GERMAN_VOCABULARY_WORDS = [
	{ word: 'Hund', translation: 'Dog', category: 'animals' },
	{ word: 'Katze', translation: 'Cat', category: 'animals' },
	{ word: 'Haus', translation: 'House', category: 'objects' },
	{ word: 'Auto', translation: 'Car', category: 'transport' },
	{ word: 'Buch', translation: 'Book', category: 'objects' },
	{ word: 'Apfel', translation: 'Apple', category: 'food' },
	{ word: 'Wasser', translation: 'Water', category: 'food' },
	{ word: 'Schule', translation: 'School', category: 'places' },
	{ word: 'Familie', translation: 'Family', category: 'people' },
	{ word: 'Freund', translation: 'Friend', category: 'people' },
	{ word: 'Rot', translation: 'Red', category: 'colors' },
	{ word: 'Blau', translation: 'Blue', category: 'colors' },
	{ word: 'Grün', translation: 'Green', category: 'colors' },
	{ word: 'Gelb', translation: 'Yellow', category: 'colors' },
	{ word: 'Eins', translation: 'One', category: 'numbers' },
	{ word: 'Zwei', translation: 'Two', category: 'numbers' },
	{ word: 'Drei', translation: 'Three', category: 'numbers' },
	{ word: 'Vier', translation: 'Four', category: 'numbers' },
	{ word: 'Fünf', translation: 'Five', category: 'numbers' },
	{ word: 'Mama', translation: 'Mom', category: 'family' },
	{ word: 'Papa', translation: 'Dad', category: 'family' }
]

const SAMPLE_ACHIEVEMENTS = [
	{
		name: 'First Steps',
		description: 'Complete your first learning activity',
		type: 'MILESTONE' as const,
		criteria: { lessonsCompleted: 1 },
		reward: { points: 50, badge: 'first-steps' }
	},
	{
		name: 'Vocabulary Master',
		description: 'Learn 10 new German words',
		type: 'MASTERY' as const,
		criteria: { vocabularyLearned: 10 },
		reward: { points: 100, badge: 'vocab-master' }
	},
	{
		name: 'Week Warrior',
		description: 'Login every day for a week',
		type: 'STREAK' as const,
		criteria: { loginStreak: 7 },
		reward: { points: 200, badge: 'week-warrior' }
	},
	{
		name: 'Reading Star',
		description: 'Complete 5 reading exercises',
		type: 'MILESTONE' as const,
		criteria: { readingCompleted: 5 },
		reward: { points: 150, badge: 'reading-star' }
	},
	{
		name: 'Perfect Score',
		description: 'Get 100% on any assessment',
		type: 'SPECIAL' as const,
		criteria: { perfectScore: 1 },
		reward: { points: 300, badge: 'perfect-score' }
	}
]

async function main() {
	console.log('🌱 Starting comprehensive database seeding...')

	// Clean existing data in development
	if (process.env.NODE_ENV !== 'production') {
		console.log('🧹 Cleaning existing data...')
		await prisma.$transaction([
			prisma.studentProgress.deleteMany(),
			prisma.studentAchievement.deleteMany(),
			prisma.task.deleteMany(),
			prisma.learningModule.deleteMany(),
			prisma.class.deleteMany(),
			prisma.user.deleteMany(),
			prisma.achievement.deleteMany(),
			prisma.reward.deleteMany(),
			prisma.organization.deleteMany()
		])
	}

	console.log('🏢 Creating sample organizations...')
	const organizations = []
	for (const orgData of SAMPLE_ORGANIZATIONS) {
		const organization = await prisma.organization.create({
			data: {
				...orgData,
				isActive: true,
				settings: {
					allowParentAccess: true,
					enableNotifications: true,
					language: 'de'
				}
			}
		})
		organizations.push(organization)
		console.log(`  ✅ Created: ${organization.name}`)
	}

	console.log('🏆 Creating sample achievements...')
	const achievements = []
	for (const achData of SAMPLE_ACHIEVEMENTS) {
		const achievement = await prisma.achievement.create({
			data: {
				...achData,
				isActive: true
			}
		})
		achievements.push(achievement)
		console.log(`  ✅ Created: ${achievement.name}`)
	}

	console.log('🎁 Creating sample rewards...')
	const rewards = []
	const sampleRewards = [
		{ name: 'Golden Star', type: 'VIRTUAL' as const, cost: 100, description: 'A shiny golden star badge' },
		{ name: 'Rainbow Badge', type: 'VIRTUAL' as const, cost: 150, description: 'Beautiful rainbow colored badge' },
		{ name: 'Super Student Certificate', type: 'VIRTUAL' as const, cost: 200, description: 'Official certificate of achievement' },
		{ name: 'Learning Crown', type: 'VIRTUAL' as const, cost: 300, description: 'Crown for exceptional learners' },
		{ name: 'Bonus Time', type: 'DIGITAL' as const, cost: 50, description: '10 extra minutes of game time' }
	]

	for (const rewardData of sampleRewards) {
		const reward = await prisma.reward.create({
			data: {
				...rewardData,
				isActive: true
			}
		})
		rewards.push(reward)
		console.log(`  ✅ Created: ${reward.name}`)
	}

	console.log('👥 Creating sample users...')
	const hashedPassword = await bcryptjs.hash('password123', 10)
	
	// Create teachers for each organization
	const teachers = []
	for (let i = 0; i < organizations.length; i++) {
		const org = organizations[i]
		const teacher = await prisma.user.create({
			data: {
				email: `teacher${i + 1}@${org.code.toLowerCase().replace('_', '-')}.edu`,
				name: `Teacher ${['Anna', 'Marcus', 'Julia'][i]}`,
				role: 'TEACHER',
				password: hashedPassword,
				organizationId: org.id,
				isActive: true,
				isVerified: true,
				settings: {
					theme: 'light',
					language: 'de',
					notifications: true,
					emailUpdates: true
				}
			}
		})
		teachers.push(teacher)
		console.log(`  ✅ Created teacher: ${teacher.name}`)
	}

	// Create parents
	const parents = []
	for (let i = 0; i < 8; i++) {
		const parent = await prisma.user.create({
			data: {
				email: `parent${i + 1}@example.com`,
				name: `${['Maria', 'Stefan', 'Lisa', 'Thomas', 'Sarah', 'Michael', 'Emma', 'David'][i]} ${['Schmidt', 'Mueller', 'Weber', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch'][i]}`,
				role: 'PARENT',
				password: hashedPassword,
				organizationId: organizations[i % organizations.length].id,
				isActive: true,
				isVerified: true,
				settings: {
					theme: 'light',
					language: 'de',
					notifications: true,
					childProgressAlerts: true
				}
			}
		})
		parents.push(parent)
		console.log(`  ✅ Created parent: ${parent.name}`)
	}

	// Create admin user
	const admin = await prisma.user.create({
		data: {
			email: 'admin@educational-app.com',
			name: 'Platform Administrator',
			role: 'ADMIN',
			password: hashedPassword,
			organizationId: organizations[0].id,
			isActive: true,
			isVerified: true,
			settings: {
				theme: 'dark',
				language: 'en',
				notifications: true,
				adminAlerts: true
			}
		}
	})
	console.log(`  ✅ Created admin: ${admin.name}`)

	console.log('🏫 Creating sample classes...')
	const classes = []
	for (let i = 0; i < SAMPLE_CLASSES.length; i++) {
		const classData = SAMPLE_CLASSES[i]
		const org = organizations[i < 5 ? 0 : 1] // First 5 classes in first org
		const teacher = teachers[i % teachers.length]
		
		const classObj = await prisma.class.create({
			data: {
				name: classData.name,
				code: classData.code,
				grade: classData.grade,
				organizationId: org.id,
				settings: {
					maxStudents: 25,
					allowParentView: true,
					language: 'de'
				}
			}
		})
		classes.push(classObj)
		console.log(`  ✅ Created class: ${classObj.name}`)
	}

	console.log('🎓 Creating sample students...')
	const students = []
	const germanNames = [
		'Alexander', 'Anna', 'Ben', 'Clara', 'David', 'Emma', 'Felix', 'Greta',
		'Hans', 'Ida', 'Jakob', 'Klara', 'Leon', 'Mia', 'Noah', 'Olivia',
		'Paul', 'Quinn', 'Rebecca', 'Simon', 'Tina', 'Ulrich', 'Vera', 'Wilhelm'
	]
	
	for (let i = 0; i < 24; i++) {
		const studentUuid = uuid()
		const parent = parents[Math.floor(i / 3)] // 3 children per parent on average
		const classObj = classes[i % classes.length]
		
		const student = await prisma.user.create({
			data: {
				name: germanNames[i],
				role: 'STUDENT',
				uuid: studentUuid,
				grade: classObj.grade,
				organizationId: classObj.organizationId,
				isActive: true,
				settings: {
					theme: 'light',
					language: 'de',
					soundEnabled: true,
					vibrationEnabled: true,
					difficultyLevel: 'BEGINNER'
				}
			}
		})
		students.push(student)
		
		// Add parent-child relationship
		await prisma.parentChild.create({
			data: {
				parentId: parent.id,
				childId: student.id,
				relationship: 'PARENT',
				isActive: true
			}
		})
		
		console.log(`  ✅ Created student: ${student.name} (UUID: ${studentUuid.substring(0, 8)}...)`)
	}

	console.log('📚 Creating sample learning modules and content...')
	const modules = []
	const moduleData = [
		{
			title: 'German Animals',
			description: 'Learn the names of common animals in German',
			difficulty: 'BEGINNER' as const,
			estimatedDuration: 15,
			vocabulary: GERMAN_VOCABULARY_WORDS.filter(w => w.category === 'animals')
		},
		{
			title: 'Colors and Numbers',
			description: 'Learn basic colors and numbers in German',
			difficulty: 'BEGINNER' as const,
			estimatedDuration: 20,
			vocabulary: GERMAN_VOCABULARY_WORDS.filter(w => ['colors', 'numbers'].includes(w.category))
		},
		{
			title: 'Family and Friends',
			description: 'Learn about family members and social relationships',
			difficulty: 'INTERMEDIATE' as const,
			estimatedDuration: 25,
			vocabulary: GERMAN_VOCABULARY_WORDS.filter(w => ['family', 'people'].includes(w.category))
		},
		{
			title: 'Home and School',
			description: 'Learn words related to home and school environment',
			difficulty: 'INTERMEDIATE' as const,
			estimatedDuration: 30,
			vocabulary: GERMAN_VOCABULARY_WORDS.filter(w => ['objects', 'places'].includes(w.category))
		}
	]

	for (let i = 0; i < moduleData.length; i++) {
		const moduleInfo = moduleData[i]
		const module = await prisma.learningModule.create({
			data: {
				title: moduleInfo.title,
				description: moduleInfo.description,
				difficulty: moduleInfo.difficulty,
				estimatedDuration: moduleInfo.estimatedDuration,
				isActive: true,
				language: 'de',
				content: {
					vocabulary: moduleInfo.vocabulary,
					exercises: [`${moduleInfo.title.toLowerCase().replace(' ', '-')}-matching`, `${moduleInfo.title.toLowerCase().replace(' ', '-')}-spelling`],
					objectives: [`Learn ${moduleInfo.vocabulary.length} new words`, 'Complete all exercises', 'Pass final quiz']
				},
				createdById: teachers[i % teachers.length].id
			}
		})
		modules.push(module)
		console.log(`  ✅ Created module: ${module.title}`)

		// Create tasks for each module
		for (let j = 0; j < 3; j++) {
			const taskTypes = ['VOCABULARY', 'READING', 'WRITING'] as const
			const task = await prisma.task.create({
				data: {
					title: `${moduleInfo.title} - ${taskTypes[j]} Exercise`,
					description: `Practice ${taskTypes[j].toLowerCase()} skills with ${moduleInfo.title.toLowerCase()}`,
					type: taskTypes[j],
					difficulty: moduleInfo.difficulty,
					instructions: `Complete the ${taskTypes[j].toLowerCase()} exercise using the vocabulary from ${moduleInfo.title}`,
					content: {
						words: moduleInfo.vocabulary.slice(0, 5 + j * 2),
						exerciseType: taskTypes[j].toLowerCase(),
						timeLimit: 300 + j * 120
					},
					points: 50 + j * 25,
					estimatedDuration: 10 + j * 5,
					learningModuleId: module.id,
					createdById: teachers[i % teachers.length].id,
					isActive: true
				}
			})
			console.log(`    ✅ Created task: ${task.title}`)
		}
	}

	console.log('📊 Creating sample progress data...')
	// Create some sample progress for students
	for (let i = 0; i < Math.min(students.length, 10); i++) {
		const student = students[i]
		const module = modules[i % modules.length]
		
		const progress = await prisma.studentProgress.create({
			data: {
				studentId: student.id,
				learningModuleId: module.id,
				status: i < 3 ? 'COMPLETED' : i < 7 ? 'IN_PROGRESS' : 'NOT_STARTED',
				score: i < 3 ? 85 + Math.floor(Math.random() * 15) : i < 7 ? 45 + Math.floor(Math.random() * 40) : 0,
				timeSpent: i < 3 ? 15 + Math.floor(Math.random() * 10) : i < 7 ? 5 + Math.floor(Math.random() * 10) : 0,
				completedAt: i < 3 ? new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) : undefined,
				data: {
					exercisesCompleted: i < 3 ? 3 : i < 7 ? 1 + Math.floor(Math.random() * 2) : 0,
					vocabularyLearned: i < 3 ? 8 + Math.floor(Math.random() * 5) : i < 7 ? 2 + Math.floor(Math.random() * 4) : 0,
					mistakes: Math.floor(Math.random() * 3)
				}
			}
		})
		
		// Award some achievements
		if (i < 3) {
			await prisma.studentAchievement.create({
				data: {
					studentId: student.id,
					achievementId: achievements[0].id, // First Steps
					earnedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
					progress: 100
				}
			})
		}
		
		console.log(`  ✅ Created progress for: ${student.name}`)
	}

	console.log('✅ Database seeding completed successfully!')
	console.log('\n📊 Summary:')
	console.log(`🏢 Organizations: ${organizations.length}`)
	console.log(`🏫 Classes: ${classes.length}`)
	console.log(`👨‍🏫 Teachers: ${teachers.length}`)
	console.log(`👨‍👩‍👧‍👦 Parents: ${parents.length}`)
	console.log(`🎓 Students: ${students.length}`)
	console.log(`📚 Learning Modules: ${modules.length}`)
	console.log(`🏆 Achievements: ${achievements.length}`)
	console.log(`🎁 Rewards: ${rewards.length}`)

	console.log('\n🔑 Sample Login Credentials:')
	console.log('Teachers:')
	teachers.forEach((teacher, i) => {
		console.log(`  ${teacher.name}: ${teacher.email} / password123`)
	})
	console.log('\nParents:')
	parents.slice(0, 3).forEach((parent) => {
		console.log(`  ${parent.name}: ${parent.email} / password123`)
	})
	console.log(`  ... and ${parents.length - 3} more parents`)
	console.log('\nAdmin:')
	console.log(`  ${admin.name}: ${admin.email} / password123`)
	console.log('\nStudents (UUID login):')
	students.slice(0, 5).forEach((student) => {
		console.log(`  ${student.name}: ${student.uuid}`)
	})
	console.log(`  ... and ${students.length - 5} more students`)
}

main()
	.catch((e) => {
		console.error('❌ Error during seeding:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})