import { StudentQRData } from './qr-generator'

export interface QRUsageEvent {
	id: string
	qrId: string
	studentId: string
	organizationId: string
	eventType: 'GENERATED' | 'SCANNED' | 'EXPIRED' | 'INVALID_ATTEMPT'
	timestamp: number
	metadata?: {
		ipAddress?: string
		userAgent?: string
		location?: string
		errorReason?: string
		nonce?: string // For tracking specific QR instances
	}
}

export interface QRAnalytics {
	totalGenerated: number
	totalScanned: number
	activeQRCodes: number
	expiredQRCodes: number
	scanSuccessRate: number
	dailyUsage: Array<{
		date: string
		generated: number
		scanned: number
		failed: number
	}>
	topStudents: Array<{
		studentId: string
		name: string
		scans: number
		lastScan?: number
	}>
	organizationStats: Array<{
		organizationId: string
		name: string
		generated: number
		scanned: number
		successRate: number
	}>
	securityEvents: Array<{
		timestamp: number
		type: 'INVALID_SIGNATURE' | 'EXPIRED_QR' | 'REPLAY_ATTEMPT' | 'SUSPICIOUS_ACTIVITY'
		details: string
		studentId?: string
		organizationId?: string
	}>
}

/**
 * QR Analytics service for tracking usage and security events
 */
export class QRAnalyticsService {
	private events: QRUsageEvent[] = []
	private usedNonces: Set<string> = new Set()
	
	/**
	 * Log a QR code generation event
	 */
	logGeneration(qrData: StudentQRData, teacherId: string): void {
		const event: QRUsageEvent = {
			id: this.generateEventId(),
			qrId: this.generateQRId(qrData),
			studentId: qrData.uuid,
			organizationId: qrData.organizationId,
			eventType: 'GENERATED',
			timestamp: Date.now(),
			metadata: {
				nonce: qrData.nonce
			}
		}
		
		this.events.push(event)
		this.cleanOldEvents() // Keep only recent events in memory
	}

	/**
	 * Log a QR code scan attempt
	 */
	logScan(qrData: StudentQRData, success: boolean, metadata?: any): void {
		const event: QRUsageEvent = {
			id: this.generateEventId(),
			qrId: this.generateQRId(qrData),
			studentId: qrData.uuid,
			organizationId: qrData.organizationId,
			eventType: success ? 'SCANNED' : 'INVALID_ATTEMPT',
			timestamp: Date.now(),
			metadata: {
				...metadata,
				nonce: qrData.nonce
			}
		}
		
		// Check for replay attacks (same nonce used multiple times)
		if (success && this.usedNonces.has(qrData.nonce)) {
			this.logSecurityEvent('REPLAY_ATTEMPT', 
				`Nonce ${qrData.nonce} reused for student ${qrData.uuid}`, 
				qrData.uuid, qrData.organizationId)
		} else if (success) {
			this.usedNonces.add(qrData.nonce)
		}
		
		this.events.push(event)
		this.cleanOldEvents()
	}

	/**
	 * Log a security event
	 */
	logSecurityEvent(
		type: 'INVALID_SIGNATURE' | 'EXPIRED_QR' | 'REPLAY_ATTEMPT' | 'SUSPICIOUS_ACTIVITY',
		details: string,
		studentId?: string,
		organizationId?: string
	): void {
		// In production, this would be sent to a security monitoring system
		console.warn('QR Security Event:', {
			type,
			details,
			studentId,
			organizationId,
			timestamp: new Date().toISOString()
		})
	}

	/**
	 * Generate comprehensive analytics
	 */
	generateAnalytics(organizationId?: string, days: number = 30): QRAnalytics {
		const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000)
		const relevantEvents = this.events.filter(event => {
			return event.timestamp >= cutoffTime && 
				   (!organizationId || event.organizationId === organizationId)
		})

		const generated = relevantEvents.filter(e => e.eventType === 'GENERATED')
		const scanned = relevantEvents.filter(e => e.eventType === 'SCANNED')
		const failed = relevantEvents.filter(e => e.eventType === 'INVALID_ATTEMPT')

		// Calculate daily usage
		const dailyUsage = this.calculateDailyUsage(relevantEvents, days)

		// Calculate top students
		const topStudents = this.calculateTopStudents(scanned)

		// Calculate organization stats
		const orgStats = this.calculateOrganizationStats(relevantEvents)

		// Get active and expired QR counts (mock implementation)
		const activeQRCodes = this.countActiveQRCodes(generated)
		const expiredQRCodes = generated.length - activeQRCodes

		return {
			totalGenerated: generated.length,
			totalScanned: scanned.length,
			activeQRCodes,
			expiredQRCodes,
			scanSuccessRate: generated.length > 0 ? 
				(scanned.length / generated.length) * 100 : 0,
			dailyUsage,
			topStudents,
			organizationStats: orgStats,
			securityEvents: [] // Would come from security log in production
		}
	}

	private calculateDailyUsage(events: QRUsageEvent[], days: number) {
		const dailyStats: { [date: string]: { generated: number; scanned: number; failed: number } } = {}
		
		// Initialize all days
		for (let i = 0; i < days; i++) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const dateStr = date.toISOString().split('T')[0]
			dailyStats[dateStr] = { generated: 0, scanned: 0, failed: 0 }
		}

		// Count events per day
		events.forEach(event => {
			const dateStr = new Date(event.timestamp).toISOString().split('T')[0]
			if (dailyStats[dateStr]) {
				switch (event.eventType) {
					case 'GENERATED':
						dailyStats[dateStr].generated++
						break
					case 'SCANNED':
						dailyStats[dateStr].scanned++
						break
					case 'INVALID_ATTEMPT':
						dailyStats[dateStr].failed++
						break
				}
			}
		})

		return Object.entries(dailyStats)
			.map(([date, stats]) => ({ date, ...stats }))
			.sort((a, b) => a.date.localeCompare(b.date))
	}

	private calculateTopStudents(scannedEvents: QRUsageEvent[]) {
		const studentStats: { [studentId: string]: { scans: number; lastScan: number } } = {}
		
		scannedEvents.forEach(event => {
			if (!studentStats[event.studentId]) {
				studentStats[event.studentId] = { scans: 0, lastScan: 0 }
			}
			studentStats[event.studentId].scans++
			studentStats[event.studentId].lastScan = Math.max(
				studentStats[event.studentId].lastScan, 
				event.timestamp
			)
		})

		return Object.entries(studentStats)
			.map(([studentId, stats]) => ({
				studentId,
				name: `Student ${studentId.substring(0, 8)}`, // Mock name
				scans: stats.scans,
				lastScan: stats.lastScan
			}))
			.sort((a, b) => b.scans - a.scans)
			.slice(0, 10)
	}

	private calculateOrganizationStats(events: QRUsageEvent[]) {
		const orgStats: { [orgId: string]: { generated: number; scanned: number } } = {}
		
		events.forEach(event => {
			if (!orgStats[event.organizationId]) {
				orgStats[event.organizationId] = { generated: 0, scanned: 0 }
			}
			
			if (event.eventType === 'GENERATED') {
				orgStats[event.organizationId].generated++
			} else if (event.eventType === 'SCANNED') {
				orgStats[event.organizationId].scanned++
			}
		})

		return Object.entries(orgStats).map(([organizationId, stats]) => ({
			organizationId,
			name: `Organization ${organizationId}`, // Mock name
			generated: stats.generated,
			scanned: stats.scanned,
			successRate: stats.generated > 0 ? (stats.scanned / stats.generated) * 100 : 0
		}))
	}

	private countActiveQRCodes(generatedEvents: QRUsageEvent[]): number {
		// Mock implementation - in production, would check actual expiration times
		const recentGenerated = generatedEvents.filter(event => 
			event.timestamp > Date.now() - (24 * 60 * 60 * 1000) // Within 24 hours
		)
		return recentGenerated.length
	}

	private generateEventId(): string {
		return `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`
	}

	private generateQRId(qrData: StudentQRData): string {
		return `qr_${qrData.uuid}_${qrData.nonce}`
	}

	private cleanOldEvents(): void {
		// Keep only events from the last 90 days to prevent memory bloat
		const cutoff = Date.now() - (90 * 24 * 60 * 60 * 1000)
		this.events = this.events.filter(event => event.timestamp >= cutoff)
		
		// Clean old nonces as well
		const oldNonces = Array.from(this.usedNonces).filter(nonce => {
			const relatedEvent = this.events.find(e => e.metadata?.nonce === nonce)
			return !relatedEvent || relatedEvent.timestamp < cutoff
		})
		oldNonces.forEach(nonce => this.usedNonces.delete(nonce))
	}

	/**
	 * Export analytics data for reporting
	 */
	exportAnalytics(organizationId?: string, format: 'json' | 'csv' = 'json'): string {
		const analytics = this.generateAnalytics(organizationId)
		
		if (format === 'csv') {
			return this.convertToCSV(analytics)
		}
		
		return JSON.stringify(analytics, null, 2)
	}

	private convertToCSV(analytics: QRAnalytics): string {
		const headers = ['Date', 'Generated', 'Scanned', 'Failed']
		const rows = analytics.dailyUsage.map(day => 
			[day.date, day.generated, day.scanned, day.failed].join(',')
		)
		return [headers.join(','), ...rows].join('\n')
	}
}

// Global analytics service instance
export const qrAnalyticsService = new QRAnalyticsService()