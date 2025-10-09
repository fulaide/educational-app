import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	console.log('🌱 Seeding authentication users...')

	// Create a test organization first
	let organization = await prisma.organization.findFirst({
		where: { name: 'Test Elementary School' }
	});

	if (!organization) {
		organization = await prisma.organization.create({
			data: {
				name: 'Test Elementary School',
				type: 'SCHOOL',
				country: 'US',
				timezone: 'America/New_York',
				settings: {}
			}
		});
	}

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

	// Generate 8-character student code
	function generateStudentCode(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 8; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	// Create test students with 8-character codes
	const students = []
	for (let i = 1; i <= 3; i++) {
		const studentUuid = generateStudentCode()
		
		// Check if student already exists
		let student = await prisma.user.findUnique({
			where: { uuid: studentUuid }
		});
		
		if (!student) {
			student = await prisma.user.create({
				data: {
					name: `Test Student ${i}`,
					role: 'STUDENT',
					uuid: studentUuid,
					grade: Math.floor(Math.random() * 6) + 1, // Grades 1-6
					organizationId: organization.id,
					isActive: true,
					isVerified: true,
					settings: {
						theme: 'light',
						language: 'de', // German default for students
						soundEnabled: true,
						vibrationEnabled: true
					}
				}
			});
		}
		students.push(student)
	}

	// Create a test class and assign users
	let testClass = await prisma.class.findFirst({
		where: { 
			name: 'Class 1A',
			organizationId: organization.id,
			teacherId: teacher.id
		}
	});

	if (!testClass) {
		testClass = await prisma.class.create({
			data: {
				name: 'Class 1A',
				grade: 1,
				maxStudents: 30,
				organizationId: organization.id,
				teacherId: teacher.id,
				isActive: true,
				settings: {}
			}
		});
	}

	// Add the students to the test class
	if (testClass && students.length > 0) {
		await prisma.class.update({
			where: { id: testClass.id },
			data: {
				students: {
					connect: students.map(student => ({ id: student.id }))
				}
			}
		});
		console.log(`[SEED] Added ${students.length} students to class ${testClass.name}`);
	}

	console.log('✅ Authentication users seeded successfully!')
	console.log('\n📋 Test Credentials:')
	console.log('Teacher: teacher@test.com / password123')
	console.log('Parent: parent@test.com / password123')
	console.log('Admin: admin@test.com / password123')
	console.log('\n🎓 Student UUIDs:')
	students.forEach((student, index) => {
		console.log(`Student ${index + 1}: ${student.uuid}`)
	})
	console.log('\n🏫 Organization: ' + organization.name + ' (ID: ' + organization.id + ')')
}

main()
	.catch((e) => {
		console.error('❌ Error seeding users:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})