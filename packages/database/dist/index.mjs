// src/index.ts
import { PrismaClient as PrismaClient3 } from "@prisma/client";
export * from "@prisma/client";

// src/db-utils.ts
import { PrismaClient } from "@prisma/client";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
var prisma = new PrismaClient();
var DatabaseUtils = class {
  static backupDir = "./backups";
  static async ensureBackupDir() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create backup directory:", error);
    }
  }
  /**
   * Create a database backup
   */
  static async backup(name) {
    await this.ensureBackupDir();
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const backupName = name || `backup-${timestamp}`;
    const backupPath = path.join(this.backupDir, `${backupName}.sql`);
    return new Promise((resolve, reject) => {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        reject(new Error("DATABASE_URL not configured"));
        return;
      }
      const url = new URL(databaseUrl);
      const pgDump = spawn("pg_dump", [
        "-h",
        url.hostname,
        "-p",
        url.port || "5432",
        "-U",
        url.username,
        "-d",
        url.pathname.slice(1),
        // Remove leading slash
        "-f",
        backupPath,
        "--no-password",
        "--verbose",
        "--schema-only",
        // Include schema
        "--data-only"
        // Include data
      ], {
        env: {
          ...process.env,
          PGPASSWORD: url.password
        }
      });
      pgDump.stdout.on("data", (data) => {
        console.log(`pg_dump: ${data}`);
      });
      pgDump.stderr.on("data", (data) => {
        console.error(`pg_dump error: ${data}`);
      });
      pgDump.on("close", (code) => {
        if (code === 0) {
          console.log(`\u2705 Database backup created: ${backupPath}`);
          resolve(backupPath);
        } else {
          reject(new Error(`pg_dump exited with code ${code}`));
        }
      });
    });
  }
  /**
   * Restore database from backup
   */
  static async restore(backupPath) {
    return new Promise((resolve, reject) => {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        reject(new Error("DATABASE_URL not configured"));
        return;
      }
      const url = new URL(databaseUrl);
      const psql = spawn("psql", [
        "-h",
        url.hostname,
        "-p",
        url.port || "5432",
        "-U",
        url.username,
        "-d",
        url.pathname.slice(1),
        "-f",
        backupPath,
        "--no-password",
        "--verbose"
      ], {
        env: {
          ...process.env,
          PGPASSWORD: url.password
        }
      });
      psql.stdout.on("data", (data) => {
        console.log(`psql: ${data}`);
      });
      psql.stderr.on("data", (data) => {
        console.error(`psql error: ${data}`);
      });
      psql.on("close", (code) => {
        if (code === 0) {
          console.log(`\u2705 Database restored from: ${backupPath}`);
          resolve();
        } else {
          reject(new Error(`psql exited with code ${code}`));
        }
      });
    });
  }
  /**
   * List available backups
   */
  static async listBackups() {
    try {
      await this.ensureBackupDir();
      const files = await fs.readdir(this.backupDir);
      return files.filter((file) => file.endsWith(".sql"));
    } catch (error) {
      console.error("Failed to list backups:", error);
      return [];
    }
  }
  /**
   * Clean old backups (keep last N backups)
   */
  static async cleanOldBackups(keepCount = 5) {
    try {
      const backups = await this.listBackups();
      if (backups.length <= keepCount) return;
      const sortedBackups = backups.sort().reverse();
      const toDelete = sortedBackups.slice(keepCount);
      for (const backup of toDelete) {
        await fs.unlink(path.join(this.backupDir, backup));
        console.log(`\u{1F5D1}\uFE0F Deleted old backup: ${backup}`);
      }
    } catch (error) {
      console.error("Failed to clean old backups:", error);
    }
  }
  /**
   * Reset database - WARNING: This will delete all data
   */
  static async resetDatabase(confirm = false) {
    if (!confirm) {
      throw new Error("Database reset requires explicit confirmation");
    }
    if (process.env.NODE_ENV === "production") {
      throw new Error("Database reset is not allowed in production");
    }
    console.log("\u26A0\uFE0F Resetting database - all data will be lost!");
    console.log("\u{1F4E6} Creating backup before reset...");
    await this.backup("pre-reset-backup");
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
    ]);
    console.log("\u2705 Database reset completed");
  }
  /**
   * Validate database integrity
   */
  static async validateDatabase() {
    const errors = [];
    const warnings = [];
    try {
      console.log("\u{1F50D} Checking for orphaned records...");
      const orphanedStudents = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          organizationId: null
        }
      });
      if (orphanedStudents.length > 0) {
        errors.push(`Found ${orphanedStudents.length} students without organizations`);
      }
      const invalidProgress = await prisma.studentProgress.findMany({
        where: {
          student: null
        }
      });
      if (invalidProgress.length > 0) {
        errors.push(`Found ${invalidProgress.length} progress records with invalid student IDs`);
      }
      const orphanedClasses = await prisma.class.findMany({
        where: {
          organizationId: null
        }
      });
      if (orphanedClasses.length > 0) {
        errors.push(`Found ${orphanedClasses.length} classes without organizations`);
      }
      const inactiveOrgs = await prisma.organization.findMany({
        where: {
          isActive: false,
          users: {
            some: {
              isActive: true
            }
          }
        }
      });
      if (inactiveOrgs.length > 0) {
        warnings.push(`Found ${inactiveOrgs.length} inactive organizations with active users`);
      }
      const studentsWithoutUUID = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          uuid: null
        }
      });
      if (studentsWithoutUUID.length > 0) {
        errors.push(`Found ${studentsWithoutUUID.length} students without UUIDs`);
      }
      const duplicateUUIDs = await prisma.user.groupBy({
        by: ["uuid"],
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
      });
      if (duplicateUUIDs.length > 0) {
        errors.push(`Found ${duplicateUUIDs.length} duplicate UUIDs`);
      }
      console.log("\u2705 Database validation completed");
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      errors.push(`Database validation failed: ${error.message}`);
      return {
        isValid: false,
        errors,
        warnings
      };
    }
  }
  /**
   * Get database statistics
   */
  static async getStats() {
    const stats = await prisma.$transaction([
      prisma.organization.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.count({ where: { role: "PARENT" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.class.count(),
      prisma.learningModule.count(),
      prisma.task.count(),
      prisma.achievement.count(),
      prisma.reward.count(),
      prisma.studentProgress.count(),
      prisma.studentAchievement.count()
    ]);
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
    };
  }
};
async function createBackup(name) {
  try {
    const backupPath = await DatabaseUtils.backup(name);
    console.log(`Backup created: ${backupPath}`);
  } catch (error) {
    console.error("Backup failed:", error);
    process.exit(1);
  }
}
async function restoreBackup(backupPath) {
  try {
    await DatabaseUtils.restore(backupPath);
    console.log("Restore completed successfully");
  } catch (error) {
    console.error("Restore failed:", error);
    process.exit(1);
  }
}
async function resetDatabase() {
  try {
    await DatabaseUtils.resetDatabase(true);
    console.log("Database reset completed");
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
}
async function validateDatabase() {
  try {
    const result = await DatabaseUtils.validateDatabase();
    console.log("\n\u{1F4CA} Database Validation Results:");
    console.log(`Status: ${result.isValid ? "\u2705 Valid" : "\u274C Issues Found"}`);
    if (result.errors.length > 0) {
      console.log("\n\u274C Errors:");
      result.errors.forEach((error) => console.log(`  - ${error}`));
    }
    if (result.warnings.length > 0) {
      console.log("\n\u26A0\uFE0F Warnings:");
      result.warnings.forEach((warning) => console.log(`  - ${warning}`));
    }
    if (result.isValid) {
      console.log("\n\u2705 Database is healthy!");
    }
  } catch (error) {
    console.error("Validation failed:", error);
    process.exit(1);
  }
}
async function showStats() {
  try {
    const stats = await DatabaseUtils.getStats();
    console.log("\n\u{1F4CA} Database Statistics:");
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } catch (error) {
    console.error("Failed to get stats:", error);
    process.exit(1);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const arg = process.argv[3];
  switch (command) {
    case "backup":
      createBackup(arg);
      break;
    case "restore":
      if (!arg) {
        console.error("Please provide backup file path");
        process.exit(1);
      }
      restoreBackup(arg);
      break;
    case "reset":
      resetDatabase();
      break;
    case "validate":
      validateDatabase();
      break;
    case "stats":
      showStats();
      break;
    default:
      console.log("Usage: node db-utils.js [backup|restore|reset|validate|stats] [args]");
      console.log("  backup [name]     - Create database backup");
      console.log("  restore <path>    - Restore from backup");
      console.log("  reset             - Reset database (development only)");
      console.log("  validate          - Validate database integrity");
      console.log("  stats             - Show database statistics");
  }
}

// src/migration-utils.ts
import { PrismaClient as PrismaClient2 } from "@prisma/client";
import fs2 from "fs/promises";
import path2 from "path";
var prisma2 = new PrismaClient2();
var MigrationUtils = class {
  static migrationDir = "./prisma/migrations";
  /**
   * Get list of all migrations
   */
  static async getAllMigrations() {
    try {
      const migrations = await fs2.readdir(this.migrationDir);
      return migrations.filter((dir) => dir !== "migration_lock.toml").sort();
    } catch (error) {
      console.error("Failed to read migrations directory:", error);
      return [];
    }
  }
  /**
   * Get applied migrations from database
   */
  static async getAppliedMigrations() {
    try {
      const result = await prisma2.$queryRaw`
				SELECT migration_name, finished_at, checksum, execution_time
				FROM _prisma_migrations
				ORDER BY finished_at ASC
			`;
      return result.map((row) => ({
        name: row.migration_name,
        appliedAt: row.finished_at,
        checksum: row.checksum,
        executionTime: row.execution_time
      }));
    } catch (error) {
      console.log("Migration table not available or accessible");
      return [];
    }
  }
  /**
   * Get pending migrations
   */
  static async getPendingMigrations() {
    const allMigrations = await this.getAllMigrations();
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedNames = appliedMigrations.map((m) => m.name);
    return allMigrations.filter((migration) => !appliedNames.includes(migration));
  }
  /**
   * Create a new migration (wrapper around Prisma CLI)
   */
  static async createMigration(name) {
    const { spawn: spawn2 } = await import("child_process");
    return new Promise((resolve, reject) => {
      const process2 = spawn2("npx", ["prisma", "migrate", "dev", "--name", name], {
        stdio: "inherit",
        shell: true
      });
      process2.on("close", (code) => {
        if (code === 0) {
          console.log(`\u2705 Migration created: ${name}`);
          resolve();
        } else {
          reject(new Error(`Migration creation failed with code ${code}`));
        }
      });
    });
  }
  /**
   * Apply pending migrations
   */
  static async applyMigrations() {
    const { spawn: spawn2 } = await import("child_process");
    return new Promise((resolve, reject) => {
      const process2 = spawn2("npx", ["prisma", "migrate", "deploy"], {
        stdio: "inherit",
        shell: true
      });
      process2.on("close", (code) => {
        if (code === 0) {
          console.log("\u2705 Migrations applied successfully");
          resolve();
        } else {
          reject(new Error(`Migration apply failed with code ${code}`));
        }
      });
    });
  }
  /**
   * Reset migrations (WARNING: This will delete all data)
   */
  static async resetMigrations(confirm = false) {
    if (!confirm) {
      throw new Error("Migration reset requires explicit confirmation");
    }
    if (process.env.NODE_ENV === "production") {
      throw new Error("Migration reset is not allowed in production");
    }
    const { spawn: spawn2 } = await import("child_process");
    return new Promise((resolve, reject) => {
      const process2 = spawn2("npx", ["prisma", "migrate", "reset", "--force"], {
        stdio: "inherit",
        shell: true
      });
      process2.on("close", (code) => {
        if (code === 0) {
          console.log("\u2705 Migrations reset completed");
          resolve();
        } else {
          reject(new Error(`Migration reset failed with code ${code}`));
        }
      });
    });
  }
  /**
   * Get migration status
   */
  static async getMigrationStatus() {
    const allMigrations = await this.getAllMigrations();
    const appliedMigrations = await this.getAppliedMigrations();
    const pendingMigrations = await this.getPendingMigrations();
    return {
      totalMigrations: allMigrations.length,
      appliedMigrations: appliedMigrations.length,
      pendingMigrations: pendingMigrations.length,
      lastApplied: appliedMigrations[appliedMigrations.length - 1]
    };
  }
  /**
   * Validate migration consistency
   */
  static async validateMigrations() {
    const issues = [];
    try {
      try {
        await fs2.access(this.migrationDir);
      } catch {
        issues.push("Migration directory does not exist");
        return { isValid: false, issues };
      }
      const allMigrations = await this.getAllMigrations();
      for (const migration of allMigrations) {
        const migrationPath = path2.join(this.migrationDir, migration);
        try {
          const stat = await fs2.stat(migrationPath);
          if (!stat.isDirectory()) {
            issues.push(`Migration ${migration} is not a directory`);
          } else {
            const migrationSqlPath = path2.join(migrationPath, "migration.sql");
            try {
              await fs2.access(migrationSqlPath);
            } catch {
              issues.push(`Migration ${migration} is missing migration.sql file`);
            }
          }
        } catch (error) {
          issues.push(`Cannot access migration ${migration}: ${error.message}`);
        }
      }
      try {
        await prisma2.$queryRaw`SELECT 1`;
      } catch (error) {
        issues.push(`Database connection failed: ${error.message}`);
      }
      return {
        isValid: issues.length === 0,
        issues
      };
    } catch (error) {
      issues.push(`Migration validation failed: ${error.message}`);
      return { isValid: false, issues };
    }
  }
};
async function createMigration(name) {
  try {
    await MigrationUtils.createMigration(name);
  } catch (error) {
    console.error("Failed to create migration:", error);
    process.exit(1);
  }
}
async function applyMigrations() {
  try {
    await MigrationUtils.applyMigrations();
  } catch (error) {
    console.error("Failed to apply migrations:", error);
    process.exit(1);
  }
}
async function resetMigrations() {
  try {
    await MigrationUtils.resetMigrations(true);
  } catch (error) {
    console.error("Failed to reset migrations:", error);
    process.exit(1);
  }
}
async function migrationStatus() {
  try {
    const status = await MigrationUtils.getMigrationStatus();
    console.log("\n\u{1F4CA} Migration Status:");
    console.log(`Total migrations: ${status.totalMigrations}`);
    console.log(`Applied: ${status.appliedMigrations}`);
    console.log(`Pending: ${status.pendingMigrations}`);
    if (status.lastApplied) {
      console.log(`Last applied: ${status.lastApplied.name}`);
      if (status.lastApplied.appliedAt) {
        console.log(`Applied at: ${status.lastApplied.appliedAt.toISOString()}`);
      }
    }
    if (status.pendingMigrations > 0) {
      console.log('\n\u26A0\uFE0F There are pending migrations. Run "npm run db:migrate" to apply them.');
    } else {
      console.log("\n\u2705 All migrations are up to date.");
    }
  } catch (error) {
    console.error("Failed to get migration status:", error);
    process.exit(1);
  }
}
async function validateMigrations() {
  try {
    const result = await MigrationUtils.validateMigrations();
    console.log("\n\u{1F50D} Migration Validation Results:");
    console.log(`Status: ${result.isValid ? "\u2705 Valid" : "\u274C Issues Found"}`);
    if (result.issues.length > 0) {
      console.log("\n\u274C Issues:");
      result.issues.forEach((issue) => console.log(`  - ${issue}`));
    } else {
      console.log("\n\u2705 All migrations are valid!");
    }
  } catch (error) {
    console.error("Migration validation failed:", error);
    process.exit(1);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const arg = process.argv[3];
  switch (command) {
    case "create":
      if (!arg) {
        console.error("Please provide migration name");
        process.exit(1);
      }
      createMigration(arg);
      break;
    case "apply":
      applyMigrations();
      break;
    case "reset":
      resetMigrations();
      break;
    case "status":
      migrationStatus();
      break;
    case "validate":
      validateMigrations();
      break;
    default:
      console.log("Usage: node migration-utils.js [create|apply|reset|status|validate] [args]");
      console.log("  create <name>     - Create new migration");
      console.log("  apply             - Apply pending migrations");
      console.log("  reset             - Reset all migrations (development only)");
      console.log("  status            - Show migration status");
      console.log("  validate          - Validate migration consistency");
  }
}

// src/seed-config.ts
var SEED_CONFIGS = {
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
    achievements: true,
    // Only create achievements and rewards in production
    rewards: true,
    cleanExisting: false
  }
};
function getSeedConfig(environment) {
  const env = environment || process.env.NODE_ENV || "development";
  return SEED_CONFIGS[env] || SEED_CONFIGS.development;
}
var SAMPLE_DATA = {
  germanNames: [
    "Alexander",
    "Anna",
    "Ben",
    "Clara",
    "David",
    "Emma",
    "Felix",
    "Greta",
    "Hans",
    "Ida",
    "Jakob",
    "Klara",
    "Leon",
    "Mia",
    "Noah",
    "Olivia",
    "Paul",
    "Quinn",
    "Rebecca",
    "Simon",
    "Tina",
    "Ulrich",
    "Vera",
    "Wilhelm",
    "Xaver",
    "Yvonne",
    "Zacharias",
    "Adelaide",
    "Bruno",
    "Celine",
    "Dietrich",
    "Elsa"
  ],
  teacherNames: [
    { first: "Anna", last: "Schmidt" },
    { first: "Marcus", last: "Mueller" },
    { first: "Julia", last: "Weber" },
    { first: "Thomas", last: "Wagner" },
    { first: "Sarah", last: "Becker" },
    { first: "Michael", last: "Schulz" },
    { first: "Lisa", last: "Hoffmann" },
    { first: "David", last: "Koch" },
    { first: "Maria", last: "Richter" },
    { first: "Stefan", last: "Klein" }
  ],
  parentNames: [
    { first: "Maria", last: "Schmidt" },
    { first: "Stefan", last: "Mueller" },
    { first: "Lisa", last: "Weber" },
    { first: "Thomas", last: "Wagner" },
    { first: "Sarah", last: "Becker" },
    { first: "Michael", last: "Schulz" },
    { first: "Emma", last: "Hoffmann" },
    { first: "David", last: "Koch" },
    { first: "Anna", last: "Richter" },
    { first: "Marcus", last: "Klein" },
    { first: "Julia", last: "Wolf" },
    { first: "Felix", last: "Schroeder" },
    { first: "Clara", last: "Neumann" },
    { first: "Ben", last: "Schwarz" },
    { first: "Greta", last: "Zimmermann" }
  ],
  organizations: [
    {
      name: "Sunshine Elementary School",
      code: "SUNSHINE_ELEM",
      type: "SCHOOL",
      address: "123 Education Street, Learning City, LC 12345",
      phone: "+49-89-123456",
      email: "contact@sunshine-elementary.de"
    },
    {
      name: "Riverside Learning Center",
      code: "RIVERSIDE_LC",
      type: "PRIVATE",
      address: "456 River Road, Education Town, ET 67890",
      phone: "+49-89-234567",
      email: "info@riverside-learning.de"
    },
    {
      name: "Metropolitan School District",
      code: "METRO_DISTRICT",
      type: "DISTRICT",
      address: "789 District Avenue, Metro City, MC 11111",
      phone: "+49-89-345678",
      email: "admin@metro-schools.de"
    },
    {
      name: "Waldorf Primary School",
      code: "WALDORF_PRIMARY",
      type: "PRIVATE",
      address: "321 Nature Lane, Green Valley, GV 22222",
      phone: "+49-89-456789",
      email: "contact@waldorf-primary.de"
    },
    {
      name: "International School Berlin",
      code: "IS_BERLIN",
      type: "PRIVATE",
      address: "654 Global Street, Berlin, BE 33333",
      phone: "+49-30-567890",
      email: "admissions@is-berlin.de"
    }
  ],
  vocabularyCategories: {
    animals: [
      { word: "Hund", translation: "Dog", difficulty: "BEGINNER" },
      { word: "Katze", translation: "Cat", difficulty: "BEGINNER" },
      { word: "Vogel", translation: "Bird", difficulty: "BEGINNER" },
      { word: "Fisch", translation: "Fish", difficulty: "BEGINNER" },
      { word: "Pferd", translation: "Horse", difficulty: "INTERMEDIATE" },
      { word: "Kuh", translation: "Cow", difficulty: "INTERMEDIATE" },
      { word: "Schwein", translation: "Pig", difficulty: "INTERMEDIATE" },
      { word: "Schaf", translation: "Sheep", difficulty: "INTERMEDIATE" }
    ],
    colors: [
      { word: "Rot", translation: "Red", difficulty: "BEGINNER" },
      { word: "Blau", translation: "Blue", difficulty: "BEGINNER" },
      { word: "Gr\xFCn", translation: "Green", difficulty: "BEGINNER" },
      { word: "Gelb", translation: "Yellow", difficulty: "BEGINNER" },
      { word: "Orange", translation: "Orange", difficulty: "BEGINNER" },
      { word: "Lila", translation: "Purple", difficulty: "INTERMEDIATE" },
      { word: "Rosa", translation: "Pink", difficulty: "INTERMEDIATE" },
      { word: "Schwarz", translation: "Black", difficulty: "INTERMEDIATE" },
      { word: "Wei\xDF", translation: "White", difficulty: "INTERMEDIATE" }
    ],
    numbers: [
      { word: "Eins", translation: "One", difficulty: "BEGINNER" },
      { word: "Zwei", translation: "Two", difficulty: "BEGINNER" },
      { word: "Drei", translation: "Three", difficulty: "BEGINNER" },
      { word: "Vier", translation: "Four", difficulty: "BEGINNER" },
      { word: "F\xFCnf", translation: "Five", difficulty: "BEGINNER" },
      { word: "Sechs", translation: "Six", difficulty: "INTERMEDIATE" },
      { word: "Sieben", translation: "Seven", difficulty: "INTERMEDIATE" },
      { word: "Acht", translation: "Eight", difficulty: "INTERMEDIATE" },
      { word: "Neun", translation: "Nine", difficulty: "INTERMEDIATE" },
      { word: "Zehn", translation: "Ten", difficulty: "INTERMEDIATE" }
    ],
    family: [
      { word: "Familie", translation: "Family", difficulty: "BEGINNER" },
      { word: "Mama", translation: "Mom", difficulty: "BEGINNER" },
      { word: "Papa", translation: "Dad", difficulty: "BEGINNER" },
      { word: "Kind", translation: "Child", difficulty: "BEGINNER" },
      { word: "Bruder", translation: "Brother", difficulty: "INTERMEDIATE" },
      { word: "Schwester", translation: "Sister", difficulty: "INTERMEDIATE" },
      { word: "Gro\xDFmutter", translation: "Grandmother", difficulty: "ADVANCED" },
      { word: "Gro\xDFvater", translation: "Grandfather", difficulty: "ADVANCED" }
    ],
    objects: [
      { word: "Haus", translation: "House", difficulty: "BEGINNER" },
      { word: "Auto", translation: "Car", difficulty: "BEGINNER" },
      { word: "Buch", translation: "Book", difficulty: "BEGINNER" },
      { word: "Tisch", translation: "Table", difficulty: "BEGINNER" },
      { word: "Stuhl", translation: "Chair", difficulty: "BEGINNER" },
      { word: "Fenster", translation: "Window", difficulty: "INTERMEDIATE" },
      { word: "T\xFCre", translation: "Door", difficulty: "INTERMEDIATE" },
      { word: "Computer", translation: "Computer", difficulty: "INTERMEDIATE" }
    ],
    food: [
      { word: "Apfel", translation: "Apple", difficulty: "BEGINNER" },
      { word: "Brot", translation: "Bread", difficulty: "BEGINNER" },
      { word: "Wasser", translation: "Water", difficulty: "BEGINNER" },
      { word: "Milch", translation: "Milk", difficulty: "BEGINNER" },
      { word: "Banane", translation: "Banana", difficulty: "BEGINNER" },
      { word: "K\xE4se", translation: "Cheese", difficulty: "INTERMEDIATE" },
      { word: "Fleisch", translation: "Meat", difficulty: "INTERMEDIATE" },
      { word: "Gem\xFCse", translation: "Vegetables", difficulty: "INTERMEDIATE" }
    ]
  },
  achievements: [
    {
      name: "Erste Schritte",
      description: "Complete your first learning activity",
      type: "MILESTONE",
      criteria: { lessonsCompleted: 1 },
      reward: { points: 50, badge: "erste-schritte" }
    },
    {
      name: "Wortschatz-Meister",
      description: "Learn 25 new German words",
      type: "MASTERY",
      criteria: { vocabularyLearned: 25 },
      reward: { points: 200, badge: "wortschatz-meister" }
    },
    {
      name: "Flei\xDFiger Sch\xFCler",
      description: "Login every day for a week",
      type: "STREAK",
      criteria: { loginStreak: 7 },
      reward: { points: 300, badge: "fleissiger-schueler" }
    },
    {
      name: "Lese-Star",
      description: "Complete 10 reading exercises",
      type: "MILESTONE",
      criteria: { readingCompleted: 10 },
      reward: { points: 250, badge: "lese-star" }
    },
    {
      name: "Perfekte Punktzahl",
      description: "Get 100% on any assessment",
      type: "SPECIAL",
      criteria: { perfectScore: 1 },
      reward: { points: 500, badge: "perfekte-punktzahl" }
    },
    {
      name: "Schreiber",
      description: "Complete 5 writing exercises",
      type: "MILESTONE",
      criteria: { writingCompleted: 5 },
      reward: { points: 175, badge: "schreiber" }
    },
    {
      name: "Ausdauer",
      description: "Study for 30 days in total",
      type: "STREAK",
      criteria: { totalStudyDays: 30 },
      reward: { points: 750, badge: "ausdauer" }
    },
    {
      name: "Helfer",
      description: "Help 3 classmates with exercises",
      type: "SPECIAL",
      criteria: { helpedClassmates: 3 },
      reward: { points: 400, badge: "helfer" }
    }
  ],
  rewards: [
    { name: "Goldener Stern", type: "VIRTUAL", cost: 100, description: "A shiny golden star badge" },
    { name: "Regenbogen-Abzeichen", type: "VIRTUAL", cost: 150, description: "Beautiful rainbow colored badge" },
    { name: "Super-Sch\xFCler Zertifikat", type: "VIRTUAL", cost: 200, description: "Official certificate of achievement" },
    { name: "Lern-Krone", type: "VIRTUAL", cost: 300, description: "Crown for exceptional learners" },
    { name: "Bonus-Zeit", type: "DIGITAL", cost: 50, description: "10 extra minutes of game time" },
    { name: "Lieblings-Avatar", type: "VIRTUAL", cost: 125, description: "Unlock special avatar customization" },
    { name: "Musik-Pause", type: "DIGITAL", cost: 75, description: "5 minutes of music break" },
    { name: "Freunde-Nachricht", type: "DIGITAL", cost: 25, description: "Send a message to a classmate" }
  ]
};

// src/index.ts
var globalForPrisma = globalThis;
var prisma3 = globalForPrisma.prisma ?? new PrismaClient3({
  log: ["query"]
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma3;
export {
  DatabaseUtils,
  MigrationUtils,
  PrismaClient3 as PrismaClient,
  SAMPLE_DATA,
  SEED_CONFIGS,
  applyMigrations,
  createBackup,
  createMigration,
  getSeedConfig,
  migrationStatus,
  prisma3 as prisma,
  resetDatabase,
  resetMigrations,
  restoreBackup,
  showStats,
  validateDatabase,
  validateMigrations
};
