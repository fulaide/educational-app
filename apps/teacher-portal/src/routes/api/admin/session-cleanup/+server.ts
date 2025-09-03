import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { cleanupExpiredSessions, cleanupInactiveSessions, getSessionStats } from '$lib/server/session-cleanup'

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Simple authentication check - in production this should be more secure
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== 'Bearer admin-cleanup-token') {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expiredResult = await cleanupExpiredSessions()
    const inactiveResult = await cleanupInactiveSessions()
    const stats = await getSessionStats()

    return json({
      success: true,
      expiredSessionsDeleted: expiredResult.deleted,
      inactiveSessionsDeleted: inactiveResult.deleted,
      stats
    })
  } catch (error) {
    console.error('[API] Session cleanup failed:', error)
    return json(
      { 
        success: false, 
        error: 'Failed to cleanup sessions' 
      }, 
      { status: 500 }
    )
  }
}

export const GET: RequestHandler = async ({ request }) => {
  try {
    // Simple authentication check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== 'Bearer admin-cleanup-token') {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getSessionStats()
    return json({ stats })
  } catch (error) {
    console.error('[API] Failed to get session stats:', error)
    return json(
      { 
        success: false, 
        error: 'Failed to get session stats' 
      }, 
      { status: 500 }
    )
  }
}