import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { v4 as uuid } from 'uuid'

const prisma = new PrismaClient()

async function main() {
	console.log('🌱 Seeding authentication users...')

	// Create a test organization first
	const organization = await prisma.organization.upsert({
		where: { code: 'TEST_SCHOOL' },
		update: {},
		create: {
			name: 'Test Elementary School',
			code: 'TEST_SCHOOL',
			type: 'SCHOOL',
			isActive: true,
			settings: {}
		}
	})

	// Create test teacher
	const hashedPassword = await bcryptjs.hash('password123', 10)
	
	const teacher = await prisma.user.upsert({
		where: { email: 'teacher@test.com' },
		update: {},
		create: {
			email: 'teacher@test.com',
			name: 'Test Teacher',
			role: 'TEACHER',
			password: hashedPassword,
			organizationId: organization.id,
			isActive: true,
			isVerified: true,
			settings: {
				theme: 'light',
				language: 'en',
				notifications: true
			}
		}
	})

	// Create test parent
	const parent = await prisma.user.upsert({
		where: { email: 'parent@test.com' },
		update: {},
		create: {
			email: 'parent@test.com',
			name: 'Test Parent',
			role: 'PARENT',
			password: hashedPassword,
			organizationId: organization.id,
			isActive: true,
			isVerified: true,
			settings: {
				theme: 'light',
				language: 'en',
				notifications: true
			}
		}
	})

	// Create test admin
	const admin = await prisma.user.upsert({
		where: { email: 'admin@test.com' },
		update: {},
		create: {
			email: 'admin@test.com',
			name: 'Test Admin',
			role: 'ADMIN',
			password: hashedPassword,
			organizationId: organization.id,
			isActive: true,
			isVerified: true,
			settings: {
				theme: 'light',
				language: 'en',
				notifications: true
			}
		}
	})

	// Create test students with UUIDs
	const students = []
	for (let i = 1; i <= 3; i++) {
		const studentUuid = uuid()
		const student = await prisma.user.upsert({
			where: { uuid: studentUuid },
			update: {},
			create: {
				name: `Test Student ${i}`,
				role: 'STUDENT',
				uuid: studentUuid,
				grade: Math.floor(Math.random() * 6) + 1, // Grades 1-6
				organizationId: organization.id,
				isActive: true,
				settings: {
					theme: 'light',
					language: 'de', // German default for students
					soundEnabled: true,
					vibrationEnabled: true
				}
			}
		})
		students.push(student)
	}

	// Create a test class and assign users
	const testClass = await prisma.class.upsert({
		where: { code: 'TEST_CLASS_1A' },
		update: {},
		create: {
			name: 'Class 1A',
			code: 'TEST_CLASS_1A',
			grade: 1,
			organizationId: organization.id,
			settings: {}
		}
	})

	console.log('✅ Authentication users seeded successfully!')
	console.log('\n📋 Test Credentials:')
	console.log('Teacher: teacher@test.com / password123')
	console.log('Parent: parent@test.com / password123')
	console.log('Admin: admin@test.com / password123')
	console.log('\n🎓 Student UUIDs:')
	students.forEach((student, index) => {
		console.log(`Student ${index + 1}: ${student.uuid}`)
	})
	console.log('\n🏫 Organization: ' + organization.name + ' (' + organization.code + ')')
}

main()
	.catch((e) => {
		console.error('❌ Error seeding users:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})