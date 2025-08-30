import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export interface MigrationInfo {
	name: string
	appliedAt?: Date
	checksum?: string
	executionTime?: number
}

/**
 * Migration management utilities
 */
export class MigrationUtils {
	private static migrationDir = './prisma/migrations'

	/**
	 * Get list of all migrations
	 */
	static async getAllMigrations(): Promise<string[]> {
		try {
			const migrations = await fs.readdir(this.migrationDir)
			return migrations
				.filter(dir => dir !== 'migration_lock.toml')
				.sort()
		} catch (error) {
			console.error('Failed to read migrations directory:', error)
			return []
		}
	}

	/**
	 * Get applied migrations from database
	 */
	static async getAppliedMigrations(): Promise<MigrationInfo[]> {
		try {
			// Note: Prisma doesn't expose migration table directly
			// This would require raw SQL queries in a real implementation
			const result = await prisma.$queryRaw`
				SELECT migration_name, finished_at, checksum, execution_time
				FROM _prisma_migrations
				ORDER BY finished_at ASC
			` as any[]

			return result.map(row => ({
				name: row.migration_name,
				appliedAt: row.finished_at,
				checksum: row.checksum,
				executionTime: row.execution_time
			}))
		} catch (error) {
			console.log('Migration table not available or accessible')
			return []
		}
	}

	/**
	 * Get pending migrations
	 */
	static async getPendingMigrations(): Promise<string[]> {
		const allMigrations = await this.getAllMigrations()
		const appliedMigrations = await this.getAppliedMigrations()
		const appliedNames = appliedMigrations.map(m => m.name)

		return allMigrations.filter(migration => !appliedNames.includes(migration))
	}

	/**
	 * Create a new migration (wrapper around Prisma CLI)
	 */
	static async createMigration(name: string): Promise<void> {
		const { spawn } = await import('child_process')
		
		return new Promise((resolve, reject) => {
			const process = spawn('npx', ['prisma', 'migrate', 'dev', '--name', name], {
				stdio: 'inherit',
				shell: true
			})

			process.on('close', (code) => {
				if (code === 0) {
					console.log(`✅ Migration created: ${name}`)
					resolve()
				} else {
					reject(new Error(`Migration creation failed with code ${code}`))
				}
			})
		})
	}

	/**
	 * Apply pending migrations
	 */
	static async applyMigrations(): Promise<void> {
		const { spawn } = await import('child_process')
		
		return new Promise((resolve, reject) => {
			const process = spawn('npx', ['prisma', 'migrate', 'deploy'], {
				stdio: 'inherit',
				shell: true
			})

			process.on('close', (code) => {
				if (code === 0) {
					console.log('✅ Migrations applied successfully')
					resolve()
				} else {
					reject(new Error(`Migration apply failed with code ${code}`))
				}
			})
		})
	}

	/**
	 * Reset migrations (WARNING: This will delete all data)
	 */
	static async resetMigrations(confirm: boolean = false): Promise<void> {
		if (!confirm) {
			throw new Error('Migration reset requires explicit confirmation')
		}

		if (process.env.NODE_ENV === 'production') {
			throw new Error('Migration reset is not allowed in production')
		}

		const { spawn } = await import('child_process')
		
		return new Promise((resolve, reject) => {
			const process = spawn('npx', ['prisma', 'migrate', 'reset', '--force'], {
				stdio: 'inherit',
				shell: true
			})

			process.on('close', (code) => {
				if (code === 0) {
					console.log('✅ Migrations reset completed')
					resolve()
				} else {
					reject(new Error(`Migration reset failed with code ${code}`))
				}
			})
		})
	}

	/**
	 * Get migration status
	 */
	static async getMigrationStatus(): Promise<{
		totalMigrations: number
		appliedMigrations: number
		pendingMigrations: number
		lastApplied?: MigrationInfo
	}> {
		const allMigrations = await this.getAllMigrations()
		const appliedMigrations = await this.getAppliedMigrations()
		const pendingMigrations = await this.getPendingMigrations()

		return {
			totalMigrations: allMigrations.length,
			appliedMigrations: appliedMigrations.length,
			pendingMigrations: pendingMigrations.length,
			lastApplied: appliedMigrations[appliedMigrations.length - 1]
		}
	}

	/**
	 * Validate migration consistency
	 */
	static async validateMigrations(): Promise<{
		isValid: boolean
		issues: string[]
	}> {
		const issues: string[] = []

		try {
			// Check if migration directory exists
			try {
				await fs.access(this.migrationDir)
			} catch {
				issues.push('Migration directory does not exist')
				return { isValid: false, issues }
			}

			// Check migration file consistency
			const allMigrations = await this.getAllMigrations()
			
			for (const migration of allMigrations) {
				const migrationPath = path.join(this.migrationDir, migration)
				try {
					const stat = await fs.stat(migrationPath)
					if (!stat.isDirectory()) {
						issues.push(`Migration ${migration} is not a directory`)
					} else {
						// Check for required files
						const migrationSqlPath = path.join(migrationPath, 'migration.sql')
						try {
							await fs.access(migrationSqlPath)
						} catch {
							issues.push(`Migration ${migration} is missing migration.sql file`)
						}
					}
				} catch (error) {
					issues.push(`Cannot access migration ${migration}: ${error.message}`)
				}
			}

			// Check database state
			try {
				await prisma.$queryRaw`SELECT 1`
			} catch (error) {
				issues.push(`Database connection failed: ${error.message}`)
			}

			return {
				isValid: issues.length === 0,
				issues
			}
		} catch (error) {
			issues.push(`Migration validation failed: ${error.message}`)
			return { isValid: false, issues }
		}
	}
}

// CLI functions
export async function createMigration(name: string) {
	try {
		await MigrationUtils.createMigration(name)
	} catch (error) {
		console.error('Failed to create migration:', error)
		process.exit(1)
	}
}

export async function applyMigrations() {
	try {
		await MigrationUtils.applyMigrations()
	} catch (error) {
		console.error('Failed to apply migrations:', error)
		process.exit(1)
	}
}

export async function resetMigrations() {
	try {
		await MigrationUtils.resetMigrations(true)
	} catch (error) {
		console.error('Failed to reset migrations:', error)
		process.exit(1)
	}
}

export async function migrationStatus() {
	try {
		const status = await MigrationUtils.getMigrationStatus()
		console.log('\n📊 Migration Status:')
		console.log(`Total migrations: ${status.totalMigrations}`)
		console.log(`Applied: ${status.appliedMigrations}`)
		console.log(`Pending: ${status.pendingMigrations}`)
		
		if (status.lastApplied) {
			console.log(`Last applied: ${status.lastApplied.name}`)
			if (status.lastApplied.appliedAt) {
				console.log(`Applied at: ${status.lastApplied.appliedAt.toISOString()}`)
			}
		}

		if (status.pendingMigrations > 0) {
			console.log('\n⚠️ There are pending migrations. Run "npm run db:migrate" to apply them.')
		} else {
			console.log('\n✅ All migrations are up to date.')
		}
	} catch (error) {
		console.error('Failed to get migration status:', error)
		process.exit(1)
	}
}

export async function validateMigrations() {
	try {
		const result = await MigrationUtils.validateMigrations()
		console.log('\n🔍 Migration Validation Results:')
		console.log(`Status: ${result.isValid ? '✅ Valid' : '❌ Issues Found'}`)
		
		if (result.issues.length > 0) {
			console.log('\n❌ Issues:')
			result.issues.forEach(issue => console.log(`  - ${issue}`))
		} else {
			console.log('\n✅ All migrations are valid!')
		}
	} catch (error) {
		console.error('Migration validation failed:', error)
		process.exit(1)
	}
}

// CLI handler
if (require.main === module) {
	const command = process.argv[2]
	const arg = process.argv[3]

	switch (command) {
		case 'create':
			if (!arg) {
				console.error('Please provide migration name')
				process.exit(1)
			}
			createMigration(arg)
			break
		case 'apply':
			applyMigrations()
			break
		case 'reset':
			resetMigrations()
			break
		case 'status':
			migrationStatus()
			break
		case 'validate':
			validateMigrations()
			break
		default:
			console.log('Usage: node migration-utils.js [create|apply|reset|status|validate] [args]')
			console.log('  create <name>     - Create new migration')
			console.log('  apply             - Apply pending migrations')
			console.log('  reset             - Reset all migrations (development only)')
			console.log('  status            - Show migration status')
			console.log('  validate          - Validate migration consistency')
	}
}