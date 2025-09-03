import { PrismaClient } from '@educational-app/database'

// Create prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Clean up expired sessions from the database
 * This should be run periodically to remove stale session records
 */
export async function cleanupExpiredSessions(): Promise<{ deleted: number }> {
  try {
    const result = await prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    if (result.count > 0) {
      console.log(`[SESSION-CLEANUP] Deleted ${result.count} expired sessions`)
    }
    
    return { deleted: result.count }
  } catch (error) {
    console.error('[SESSION-CLEANUP] Error cleaning up expired sessions:', error)
    return { deleted: 0 }
  }
}

/**
 * Clean up sessions that haven't been active for a specified number of days
 * @param inactiveDays Number of days of inactivity before cleanup (default: 7)
 */
export async function cleanupInactiveSessions(inactiveDays: number = 7): Promise<{ deleted: number }> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays)
    
    const result = await prisma.userSession.deleteMany({
      where: {
        lastActive: {
          lt: cutoffDate
        }
      }
    })
    
    if (result.count > 0) {
      console.log(`[SESSION-CLEANUP] Deleted ${result.count} inactive sessions (older than ${inactiveDays} days)`)
    }
    
    return { deleted: result.count }
  } catch (error) {
    console.error('[SESSION-CLEANUP] Error cleaning up inactive sessions:', error)
    return { deleted: 0 }
  }
}

/**
 * Get session statistics for monitoring
 */
export async function getSessionStats() {
  try {
    const totalSessions = await prisma.userSession.count()
    const activeSessions = await prisma.userSession.count({
      where: {
        expiresAt: {
          gt: new Date()
        }
      }
    })
    const expiredSessions = totalSessions - activeSessions
    
    return {
      total: totalSessions,
      active: activeSessions,
      expired: expiredSessions
    }
  } catch (error) {
    console.error('[SESSION-CLEANUP] Error getting session stats:', error)
    return { total: 0, active: 0, expired: 0 }
  }
}

// Auto-cleanup configuration
let lastCleanup = 0
const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Perform automatic session cleanup if enough time has passed
 * This is called on each request to ensure periodic cleanup without cron jobs
 */
export async function autoCleanupSessions() {
  const now = Date.now()
  
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now
    
    // Run both expired and inactive session cleanups
    const expiredResult = await cleanupExpiredSessions()
    const inactiveResult = await cleanupInactiveSessions()
    
    const stats = await getSessionStats()
    console.log(`[SESSION-CLEANUP] Auto cleanup completed. Active: ${stats.active}, Expired: ${stats.expired}`)
    
    return {
      expiredDeleted: expiredResult.deleted,
      inactiveDeleted: inactiveResult.deleted,
      stats
    }
  }
  
  return null
}