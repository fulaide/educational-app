# 🗄️ Database System Documentation

## Overview

The Educational App platform uses PostgreSQL with Prisma ORM for robust data management, featuring comprehensive migrations, seeding, backup utilities, and data validation systems.

## 🚀 Quick Start

### 1. Environment Setup

Configure your database connection in `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/educational_app?schema=public"
NODE_ENV="development"
```

### 2. Database Initialization

```bash
# Generate Prisma client
npm run db:generate

# Run initial migration
npm run db:migrate

# Seed with comprehensive sample data
npm run db:seed
```

### 3. Verify Setup

```bash
# Check database statistics
npm run db:stats

# Validate data integrity
npm run db:validate

# Open Prisma Studio
npm run db:studio
```

## 📊 Database Schema

### Core Models

#### Users & Organizations
- **Organization**: Schools, districts, private institutions
- **User**: Students, teachers, parents, admins with role-based access
- **Class**: Classroom organization with grade-level grouping
- **ParentChild**: Family relationship mapping

#### Learning System
- **LearningModule**: Structured learning content with German focus
- **Task**: Individual exercises (vocabulary, reading, writing)
- **StudentProgress**: Detailed progress tracking per module
- **Achievement**: Gamification milestones and rewards
- **Reward**: Virtual and digital incentives

#### Authentication (Auth.js Integration)
- **Account**: OAuth provider accounts
- **Session**: User session management  
- **VerificationToken**: Email verification tokens
- **Authenticator**: 2FA device registration

## 🌱 Seed Data System

### Environment-Specific Seeding

The seed system adapts to different environments:

```typescript
// Development: Full sample data
npm run db:seed

// Testing: Minimal test data  
NODE_ENV=testing npm run db:seed

// Production: Only achievements/rewards
NODE_ENV=production npm run db:seed
```

### Seed Data Contents

**Development Environment:**
- 3 Organizations (schools/districts)
- 6 Teachers with realistic German names
- 12 Parents with family relationships  
- 36 Students with UUID authentication
- 8 Classes across grade levels 1-3
- 8 Learning modules with German vocabulary
- Sample progress and achievement data
- Comprehensive achievement and reward systems

**Sample Vocabulary Categories:**
- Animals (Tiere): Hund, Katze, Vogel, Fisch
- Colors (Farben): Rot, Blau, Grün, Gelb
- Numbers (Zahlen): Eins, Zwei, Drei, Vier
- Family (Familie): Mama, Papa, Bruder, Schwester
- Objects (Objekte): Haus, Auto, Buch, Tisch
- Food (Essen): Apfel, Brot, Wasser, Milch

## 🛠️ Database Utilities

### Migration Management

```bash
# Create new migration
npm run migrate:create migration-name

# Apply pending migrations
npm run migrate:apply

# Check migration status
npm run migrate:status

# Validate migrations
npm run migrate:validate

# Reset migrations (development only)
npm run migrate:reset
```

### Data Management

```bash
# Create database backup
npm run db:backup [backup-name]

# Restore from backup
npm run db:restore backup-file.sql

# Reset database with confirmation
npm run db:reset

# Validate data integrity
npm run db:validate

# Show database statistics
npm run db:stats
```

### Prisma Commands

```bash
# Generate Prisma client
npm run db:generate

# Apply schema changes
npm run db:push

# Run migrations in development
npm run db:migrate

# Deploy migrations to production
npm run db:deploy

# Open Prisma Studio
npm run db:studio
```

## 📈 Data Validation & Integrity

### Automatic Checks

The validation system automatically detects:

- **Orphaned Records**: Students without organizations
- **Invalid References**: Progress records with invalid student IDs
- **Missing UUIDs**: Students without required UUID fields
- **Duplicate UUIDs**: Conflicting student identifiers
- **Inactive Relationships**: Inactive organizations with active users

### Manual Validation

```bash
npm run db:validate
```

Example output:
```
🔍 Database Validation Results:
Status: ✅ Valid

✅ Database is healthy!
```

## 🔄 Backup & Recovery

### Automated Backups

```bash
# Create timestamped backup
npm run db:backup

# Create named backup
npm run db:backup my-backup

# List available backups
ls packages/database/backups/
```

### Backup Management

```typescript
import { DatabaseUtils } from './src/db-utils'

// Create backup before major changes
await DatabaseUtils.backup('before-migration')

// Clean old backups (keep 5 most recent)
await DatabaseUtils.cleanOldBackups(5)

// Restore from specific backup
await DatabaseUtils.restore('./backups/backup-2025-01-01.sql')
```

## 📊 Database Statistics

Track database growth and usage:

```bash
npm run db:stats
```

Sample output:
```
📊 Database Statistics:
  organizations: 3
  students: 36
  teachers: 6
  parents: 12
  admins: 1
  classes: 8
  learningModules: 8
  tasks: 24
  achievements: 8
  rewards: 8
  progressRecords: 15
  achievementsEarned: 12
```

## 🔐 Security & Privacy

### COPPA Compliance
- Student records use UUIDs instead of email addresses
- No personal information collection from minors
- Parent-controlled access to student data
- Secure session management with Auth.js

### Data Protection
- Password hashing with bcryptjs
- Secure session storage
- Foreign key constraints for data integrity
- Audit logging for sensitive operations

## 🌍 Localization Support

### German-First Design
- Primary vocabulary in German language
- German naming conventions for sample data
- Localized achievement and reward descriptions
- Multi-language content structure preparation

### Content Structure
```typescript
{
  vocabulary: [
    { 
      word: 'Hund', 
      translation: 'Dog', 
      category: 'animals',
      difficulty: 'BEGINNER' 
    }
  ],
  achievements: [
    {
      name: 'Erste Schritte',
      description: 'Complete your first learning activity',
      type: 'MILESTONE'
    }
  ]
}
```

## 🧪 Testing Support

### Test Data Generation

```bash
# Generate minimal test data
NODE_ENV=testing npm run db:seed

# Reset for clean testing
npm run db:reset && npm run db:seed
```

### Data Fixtures

The seed system provides consistent test data:
- Predictable user credentials
- Consistent UUID patterns for students
- Reproducible progress states
- Standard achievement configurations

## 📝 Development Workflow

### Daily Development

```bash
# Start with fresh database
npm run db:reset
npm run db:seed

# Make schema changes in schema.prisma
# Create migration
npm run db:migrate

# Validate changes
npm run db:validate
npm run db:stats
```

### Schema Changes

1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Update seed data if needed
4. Test with `npm run db:seed`
5. Validate with `npm run db:validate`

### Production Deployment

```bash
# Apply migrations
npm run db:deploy

# Seed production data (achievements/rewards only)
NODE_ENV=production npm run db:seed

# Validate deployment
npm run db:validate
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Environment
NODE_ENV="development|testing|staging|production"

# Backup settings (optional)
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE="0 2 * * *"  # Daily at 2 AM
```

### Seed Configuration

Customize seed data per environment in `src/seed-config.ts`:

```typescript
export const SEED_CONFIGS = {
  development: {
    organizations: 3,
    teachers: 6,
    parents: 12,
    students: 36,
    // ... more config
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**"Database connection failed"**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify credentials and permissions

**"Migration failed"**
- Check for schema conflicts
- Ensure database is accessible
- Review migration files for errors

**"Seed data creation failed"**
- Check for duplicate key violations
- Ensure proper foreign key relationships
- Validate seed data consistency

**"Backup/restore failed"**
- Ensure pg_dump/psql are installed
- Check PostgreSQL connection permissions
- Verify backup file integrity

### Debug Commands

```bash
# Check database connection
npm run db:validate

# View detailed migration status
npm run migrate:status

# Check data consistency
npm run db:stats

# View raw database
npm run db:studio
```

## 📚 API Reference

### DatabaseUtils Class

```typescript
import { DatabaseUtils } from './src/db-utils'

// Backup operations
await DatabaseUtils.backup('my-backup')
await DatabaseUtils.restore('./backup.sql')
await DatabaseUtils.listBackups()
await DatabaseUtils.cleanOldBackups(5)

// Database operations  
await DatabaseUtils.resetDatabase(true)
await DatabaseUtils.validateDatabase()
await DatabaseUtils.getStats()
```

### MigrationUtils Class

```typescript
import { MigrationUtils } from './src/migration-utils'

// Migration operations
await MigrationUtils.createMigration('add-new-field')
await MigrationUtils.applyMigrations()
await MigrationUtils.getMigrationStatus()
await MigrationUtils.validateMigrations()
```

## 🎯 Best Practices

### Schema Design
- Use descriptive model and field names
- Always include created/updated timestamps
- Use enums for constrained values
- Add proper indexes for performance

### Migration Safety
- Always backup before migrations
- Test migrations on staging first
- Use descriptive migration names
- Keep migrations atomic and reversible

### Data Seeding
- Separate seed data by environment
- Use consistent, realistic test data
- Include proper foreign key relationships
- Validate seed data after creation

### Performance
- Use database indexes appropriately
- Implement pagination for large datasets
- Monitor query performance
- Regular database maintenance

---

**🎉 Database System Status**: ✅ **Fully Implemented and Production Ready**

The database system provides:
- ✅ Complete schema with all educational models
- ✅ Comprehensive migration system
- ✅ Environment-specific seed data
- ✅ Backup and recovery utilities
- ✅ Data validation and integrity checks
- ✅ COPPA-compliant student authentication
- ✅ German vocabulary and localization support