import { PrismaClient } from '@prisma/client'
import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

/**
 * Database backup utilities
 */
export class DatabaseUtils {
	private static backupDir = './backups'

	static async ensureBackupDir() {
		try {
			await fs.mkdir(this.backupDir, { recursive: true })
		} catch (error) {
			console.error('Failed to create backup directory:', error)
		}
	}

	/**
	 * Create a database backup
	 */
	static async backup(name?: string): Promise<string> {
		await this.ensureBackupDir()
		
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
		const backupName = name || `backup-${timestamp}`
		const backupPath = path.join(this.backupDir, `${backupName}.sql`)

		return new Promise((resolve, reject) => {
			const databaseUrl = process.env.DATABASE_URL
			if (!databaseUrl) {
				reject(new Error('DATABASE_URL not configured'))
				return
			}

			// Extract connection details from DATABASE_URL
			const url = new URL(databaseUrl)
			
			const pgDump = spawn('pg_dump', [
				'-h', url.hostname,
				'-p', url.port || '5432',
				'-U', url.username,
				'-d', url.pathname.slice(1), // Remove leading slash
				'-f', backupPath,
				'--no-password',
				'--verbose',
				'--schema-only', // Include schema
				'--data-only'     // Include data
			], {
				env: {
					...process.env,
					PGPASSWORD: url.password
				}
			})

			pgDump.stdout.on('data', (data) => {
				console.log(`pg_dump: ${data}`)
			})

			pgDump.stderr.on('data', (data) => {
				console.error(`pg_dump error: ${data}`)
			})

			pgDump.on('close', (code) => {
				if (code === 0) {
					console.log(`✅ Database backup created: ${backupPath}`)
					resolve(backupPath)
				} else {
					reject(new Error(`pg_dump exited with code ${code}`))
				}
			})
		})
	}

	/**
	 * Restore database from backup
	 */
	static async restore(backupPath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const databaseUrl = process.env.DATABASE_URL
			if (!databaseUrl) {
				reject(new Error('DATABASE_URL not configured'))
				return
			}

			const url = new URL(databaseUrl)
			
			const psql = spawn('psql', [
				'-h', url.hostname,
				'-p', url.port || '5432',
				'-U', url.username,
				'-d', url.pathname.slice(1),
				'-f', backupPath,
				'--no-password',
				'--verbose'
			], {
				env: {
					...process.env,
					PGPASSWORD: url.password
				}
			})

			psql.stdout.on('data', (data) => {
				console.log(`psql: ${data}`)
			})

			psql.stderr.on('data', (data) => {
				console.error(`psql error: ${data}`)
			})

			psql.on('close', (code) => {
				if (code === 0) {
					console.log(`✅ Database restored from: ${backupPath}`)
					resolve()
				} else {
					reject(new Error(`psql exited with code ${code}`))
				}
			})
		})
	}

	/**
	 * List available backups
	 */
	static async listBackups(): Promise<string[]> {
		try {
			await this.ensureBackupDir()
			const files = await fs.readdir(this.backupDir)
			return files.filter(file => file.endsWith('.sql'))
		} catch (error) {
			console.error('Failed to list backups:', error)
			return []
		}
	}

	/**
	 * Clean old backups (keep last N backups)
	 */
	static async cleanOldBackups(keepCount: number = 5): Promise<void> {
		try {
			const backups = await this.listBackups()
			if (backups.length <= keepCount) return

			// Sort by name (timestamp) and keep the newest ones
			const sortedBackups = backups.sort().reverse()
			const toDelete = sortedBackups.slice(keepCount)

			for (const backup of toDelete) {
				await fs.unlink(path.join(this.backupDir, backup))
				console.log(`🗑️ Deleted old backup: ${backup}`)
			}
		} catch (error) {
			console.error('Failed to clean old backups:', error)
		}
	}

	/**
	 * Reset database - WARNING: This will delete all data
	 */
	static async resetDatabase(confirm: boolean = false): Promise<void> {
		if (!confirm) {
			throw new Error('Database reset requires explicit confirmation')
		}

		if (process.env.NODE_ENV === 'production') {
			throw new Error('Database reset is not allowed in production')
		}

		console.log('⚠️ Resetting database - all data will be lost!')
		
		// Create backup before reset
		console.log('📦 Creating backup before reset...')
		await this.backup('pre-reset-backup')

		// Delete all data in correct order (respecting foreign keys)
		await prisma.$transaction([
			prisma.studentProgress.deleteMany(),
			prisma.studentAchievement.deleteMany(),
			prisma.parentChild.deleteMany(),
			prisma.task.deleteMany(),
			prisma.learningModule.deleteMany(),
			prisma.class.deleteMany(),
			prisma.session.deleteMany(),
			prisma.account.deleteMany(),
			prisma.user.deleteMany(),
			prisma.achievement.deleteMany(),
			prisma.reward.deleteMany(),
			prisma.organization.deleteMany(),
			prisma.syncOperation.deleteMany(),
			prisma.notificationToken.deleteMany(),
			prisma.verificationToken.deleteMany(),
			prisma.authenticator.deleteMany()
		])

		console.log('✅ Database reset completed')
	}

	/**
	 * Validate database integrity
	 */
	static async validateDatabase(): Promise<{
		isValid: boolean
		errors: string[]
		warnings: string[]
	}> {
		const errors: string[] = []
		const warnings: string[] = []

		try {
			// Check for orphaned records
			console.log('🔍 Checking for orphaned records...')

			// Students without organizations
			const orphanedStudents = await prisma.user.findMany({
				where: {
					role: 'STUDENT',
					organizationId: null
				}
			})
			if (orphanedStudents.length > 0) {
				errors.push(`Found ${orphanedStudents.length} students without organizations`)
			}

			// Progress records with invalid student IDs
			const invalidProgress = await prisma.studentProgress.findMany({
				where: {
					student: null
				}
			})
			if (invalidProgress.length > 0) {
				errors.push(`Found ${invalidProgress.length} progress records with invalid student IDs`)
			}

			// Classes without organizations
			const orphanedClasses = await prisma.class.findMany({
				where: {
					organizationId: null
				}
			})
			if (orphanedClasses.length > 0) {
				errors.push(`Found ${orphanedClasses.length} classes without organizations`)
			}

			// Check for inactive but referenced records
			const inactiveOrgs = await prisma.organization.findMany({
				where: {
					isActive: false,
					users: {
						some: {
							isActive: true
						}
					}
				}
			})
			if (inactiveOrgs.length > 0) {
				warnings.push(`Found ${inactiveOrgs.length} inactive organizations with active users`)
			}

			// Check for students without UUIDs
			const studentsWithoutUUID = await prisma.user.findMany({
				where: {
					role: 'STUDENT',
					uuid: null
				}
			})
			if (studentsWithoutUUID.length > 0) {
				errors.push(`Found ${studentsWithoutUUID.length} students without UUIDs`)
			}

			// Check for duplicate UUIDs
			const duplicateUUIDs = await prisma.user.groupBy({
				by: ['uuid'],
				where: {
					uuid: {
						not: null
					}
				},
				having: {
					uuid: {
						_count: {
							gt: 1
						}
					}
				}
			})
			if (duplicateUUIDs.length > 0) {
				errors.push(`Found ${duplicateUUIDs.length} duplicate UUIDs`)
			}

			console.log('✅ Database validation completed')
			return {
				isValid: errors.length === 0,
				errors,
				warnings
			}
		} catch (error) {
			errors.push(`Database validation failed: ${error.message}`)
			return {
				isValid: false,
				errors,
				warnings
			}
		}
	}

	/**
	 * Get database statistics
	 */
	static async getStats(): Promise<Record<string, number>> {
		const stats = await prisma.$transaction([
			prisma.organization.count(),
			prisma.user.count({ where: { role: 'STUDENT' } }),
			prisma.user.count({ where: { role: 'TEACHER' } }),
			prisma.user.count({ where: { role: 'PARENT' } }),
			prisma.user.count({ where: { role: 'ADMIN' } }),
			prisma.class.count(),
			prisma.learningModule.count(),
			prisma.task.count(),
			prisma.achievement.count(),
			prisma.reward.count(),
			prisma.studentProgress.count(),
			prisma.studentAchievement.count()
		])

		return {
			organizations: stats[0],
			students: stats[1],
			teachers: stats[2],
			parents: stats[3],
			admins: stats[4],
			classes: stats[5],
			learningModules: stats[6],
			tasks: stats[7],
			achievements: stats[8],
			rewards: stats[9],
			progressRecords: stats[10],
			achievementsEarned: stats[11]
		}
	}
}

// CLI functions for direct usage
export async function createBackup(name?: string) {
	try {
		const backupPath = await DatabaseUtils.backup(name)
		console.log(`Backup created: ${backupPath}`)
	} catch (error) {
		console.error('Backup failed:', error)
		process.exit(1)
	}
}

export async function restoreBackup(backupPath: string) {
	try {
		await DatabaseUtils.restore(backupPath)
		console.log('Restore completed successfully')
	} catch (error) {
		console.error('Restore failed:', error)
		process.exit(1)
	}
}

export async function resetDatabase() {
	try {
		await DatabaseUtils.resetDatabase(true)
		console.log('Database reset completed')
	} catch (error) {
		console.error('Reset failed:', error)
		process.exit(1)
	}
}

export async function validateDatabase() {
	try {
		const result = await DatabaseUtils.validateDatabase()
		console.log('\n📊 Database Validation Results:')
		console.log(`Status: ${result.isValid ? '✅ Valid' : '❌ Issues Found'}`)
		
		if (result.errors.length > 0) {
			console.log('\n❌ Errors:')
			result.errors.forEach(error => console.log(`  - ${error}`))
		}
		
		if (result.warnings.length > 0) {
			console.log('\n⚠️ Warnings:')
			result.warnings.forEach(warning => console.log(`  - ${warning}`))
		}

		if (result.isValid) {
			console.log('\n✅ Database is healthy!')
		}
	} catch (error) {
		console.error('Validation failed:', error)
		process.exit(1)
	}
}

export async function showStats() {
	try {
		const stats = await DatabaseUtils.getStats()
		console.log('\n📊 Database Statistics:')
		Object.entries(stats).forEach(([key, value]) => {
			console.log(`  ${key}: ${value}`)
		})
	} catch (error) {
		console.error('Failed to get stats:', error)
		process.exit(1)
	}
}

// If running directly from command line (ESM compatible check)
if (import.meta.url === `file://${process.argv[1]}`) {
	const command = process.argv[2]
	const arg = process.argv[3]

	switch (command) {
		case 'backup':
			createBackup(arg)
			break
		case 'restore':
			if (!arg) {
				console.error('Please provide backup file path')
				process.exit(1)
			}
			restoreBackup(arg)
			break
		case 'reset':
			resetDatabase()
			break
		case 'validate':
			validateDatabase()
			break
		case 'stats':
			showStats()
			break
		default:
			console.log('Usage: node db-utils.js [backup|restore|reset|validate|stats] [args]')
			console.log('  backup [name]     - Create database backup')
			console.log('  restore <path>    - Restore from backup')
			console.log('  reset             - Reset database (development only)')
			console.log('  validate          - Validate database integrity')
			console.log('  stats             - Show database statistics')
	}
}