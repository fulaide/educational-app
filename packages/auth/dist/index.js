// src/qr-generator.ts
import QRCode from "qrcode";
import { createHash, randomBytes } from "crypto";
function generateSignature(data, secretKey) {
  const dataString = `${data.uuid}:${data.expires}:${data.nonce}:${data.organizationId}:${data.version}`;
  return createHash("sha256").update(dataString + secretKey).digest("hex").substring(0, 16);
}
async function generateStudentQR(studentData, options = {}) {
  const {
    expiresInHours = 24,
    size = 256,
    margin = 2,
    color = { dark: "#000000", light: "#FFFFFF" },
    secretKey = process.env.QR_SECRET_KEY || "default-secret-key-change-in-production"
  } = options;
  const nonce = randomBytes(8).toString("hex");
  const expires = Date.now() + expiresInHours * 60 * 60 * 1e3;
  const version = 1;
  const dataForSigning = {
    ...studentData,
    expires,
    nonce,
    version
  };
  const signature = generateSignature(dataForSigning, secretKey);
  const qrData = {
    ...dataForSigning,
    signature
  };
  const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
    width: size,
    margin,
    color,
    errorCorrectionLevel: "H"
    // High error correction for security
  });
  return {
    qrCodeDataURL,
    qrData,
    plainUuid: studentData.uuid
  };
}
async function generateClassQRCodes(students, className, options = {}) {
  const qrCodes = [];
  for (const student of students) {
    const { qrCodeDataURL, qrData } = await generateStudentQR(
      {
        uuid: student.uuid,
        studentName: student.name,
        className,
        organizationId: student.organizationId
      },
      options
    );
    qrCodes.push({
      studentId: student.uuid,
      studentName: student.name,
      qrCodeDataURL,
      qrData
    });
  }
  return qrCodes;
}
function validateQRData(qrDataString, secretKey = process.env.QR_SECRET_KEY || "default-secret-key-change-in-production") {
  try {
    const data = JSON.parse(qrDataString);
    if (!data.uuid || !data.studentName || !data.organizationId || !data.expires || !data.nonce || !data.signature || data.version === void 0) {
      return {
        isValid: false,
        error: "Missing required fields in QR data"
      };
    }
    if (data.version !== 1) {
      return {
        isValid: false,
        error: "Unsupported QR code version"
      };
    }
    if (Date.now() > data.expires) {
      return {
        isValid: false,
        error: "QR code has expired"
      };
    }
    const expectedSignature = generateSignature({
      uuid: data.uuid,
      studentName: data.studentName,
      className: data.className,
      organizationId: data.organizationId,
      expires: data.expires,
      nonce: data.nonce,
      version: data.version
    }, secretKey);
    if (expectedSignature !== data.signature) {
      return {
        isValid: false,
        error: "Invalid QR code signature"
      };
    }
    return {
      isValid: true,
      data
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid QR code format"
    };
  }
}
function isQRExpired(qrData) {
  return Date.now() > qrData.expires;
}
function getTimeRemaining(qrData) {
  const now = Date.now();
  const remaining = qrData.expires - now;
  if (remaining <= 0) {
    return { expired: true, hours: 0, minutes: 0, totalMinutes: 0 };
  }
  const totalMinutes = Math.floor(remaining / (1e3 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { expired: false, hours, minutes, totalMinutes };
}
async function generatePrintableQRSheet(students, className, options = {}) {
  const qrCodes = await generateClassQRCodes(students, className, {
    ...options,
    size: 200
    // Smaller size for print
  });
  const html = `
<!DOCTYPE html>
<html>
<head>
	<title>Student Login QR Codes - ${className}</title>
	<style>
		@page {
			size: A4;
			margin: 1cm;
		}
		body {
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 20px;
		}
		.header {
			text-align: center;
			margin-bottom: 30px;
		}
		.qr-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
		}
		.qr-item {
			border: 2px solid #ddd;
			border-radius: 8px;
			padding: 15px;
			text-align: center;
			background: #f9f9f9;
			break-inside: avoid;
		}
		.student-name {
			font-weight: bold;
			margin-bottom: 10px;
			font-size: 16px;
		}
		.qr-image {
			margin: 10px 0;
		}
		.instructions {
			font-size: 12px;
			color: #666;
			margin-top: 10px;
		}
		.footer {
			margin-top: 30px;
			font-size: 12px;
			color: #666;
			text-align: center;
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>Student Login QR Codes</h1>
		<h2>${className}</h2>
		<p>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString()}</p>
	</div>
	
	<div class="qr-grid">
		${qrCodes.map((qr) => `
			<div class="qr-item">
				<div class="student-name">${qr.studentName}</div>
				<div class="qr-image">
					<img src="${qr.qrCodeDataURL}" alt="QR Code for ${qr.studentName}" />
				</div>
				<div class="instructions">
					Scan this QR code to log in<br>
					Student ID: ${qr.studentId.substring(0, 8)}...
				</div>
			</div>
		`).join("")}
	</div>
	
	<div class="footer">
		<p>QR codes expire in 24 hours. Keep these codes secure.</p>
		<p>Educational App Platform - QR Authentication System</p>
	</div>
</body>
</html>
`;
  return html;
}

// src/qr-analytics.ts
var QRAnalyticsService = class {
  events = [];
  usedNonces = /* @__PURE__ */ new Set();
  /**
   * Log a QR code generation event
   */
  logGeneration(qrData, teacherId) {
    const event = {
      id: this.generateEventId(),
      qrId: this.generateQRId(qrData),
      studentId: qrData.uuid,
      organizationId: qrData.organizationId,
      eventType: "GENERATED",
      timestamp: Date.now(),
      metadata: {
        nonce: qrData.nonce
      }
    };
    this.events.push(event);
    this.cleanOldEvents();
  }
  /**
   * Log a QR code scan attempt
   */
  logScan(qrData, success, metadata) {
    const event = {
      id: this.generateEventId(),
      qrId: this.generateQRId(qrData),
      studentId: qrData.uuid,
      organizationId: qrData.organizationId,
      eventType: success ? "SCANNED" : "INVALID_ATTEMPT",
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        nonce: qrData.nonce
      }
    };
    if (success && this.usedNonces.has(qrData.nonce)) {
      this.logSecurityEvent(
        "REPLAY_ATTEMPT",
        `Nonce ${qrData.nonce} reused for student ${qrData.uuid}`,
        qrData.uuid,
        qrData.organizationId
      );
    } else if (success) {
      this.usedNonces.add(qrData.nonce);
    }
    this.events.push(event);
    this.cleanOldEvents();
  }
  /**
   * Log a security event
   */
  logSecurityEvent(type, details, studentId, organizationId) {
    console.warn("QR Security Event:", {
      type,
      details,
      studentId,
      organizationId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  /**
   * Generate comprehensive analytics
   */
  generateAnalytics(organizationId, days = 30) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1e3;
    const relevantEvents = this.events.filter((event) => {
      return event.timestamp >= cutoffTime && (!organizationId || event.organizationId === organizationId);
    });
    const generated = relevantEvents.filter((e) => e.eventType === "GENERATED");
    const scanned = relevantEvents.filter((e) => e.eventType === "SCANNED");
    const failed = relevantEvents.filter((e) => e.eventType === "INVALID_ATTEMPT");
    const dailyUsage = this.calculateDailyUsage(relevantEvents, days);
    const topStudents = this.calculateTopStudents(scanned);
    const orgStats = this.calculateOrganizationStats(relevantEvents);
    const activeQRCodes = this.countActiveQRCodes(generated);
    const expiredQRCodes = generated.length - activeQRCodes;
    return {
      totalGenerated: generated.length,
      totalScanned: scanned.length,
      activeQRCodes,
      expiredQRCodes,
      scanSuccessRate: generated.length > 0 ? scanned.length / generated.length * 100 : 0,
      dailyUsage,
      topStudents,
      organizationStats: orgStats,
      securityEvents: []
      // Would come from security log in production
    };
  }
  calculateDailyUsage(events, days) {
    const dailyStats = {};
    for (let i = 0; i < days; i++) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyStats[dateStr] = { generated: 0, scanned: 0, failed: 0 };
    }
    events.forEach((event) => {
      const dateStr = new Date(event.timestamp).toISOString().split("T")[0];
      if (dailyStats[dateStr]) {
        switch (event.eventType) {
          case "GENERATED":
            dailyStats[dateStr].generated++;
            break;
          case "SCANNED":
            dailyStats[dateStr].scanned++;
            break;
          case "INVALID_ATTEMPT":
            dailyStats[dateStr].failed++;
            break;
        }
      }
    });
    return Object.entries(dailyStats).map(([date, stats]) => ({ date, ...stats })).sort((a, b) => a.date.localeCompare(b.date));
  }
  calculateTopStudents(scannedEvents) {
    const studentStats = {};
    scannedEvents.forEach((event) => {
      if (!studentStats[event.studentId]) {
        studentStats[event.studentId] = { scans: 0, lastScan: 0 };
      }
      studentStats[event.studentId].scans++;
      studentStats[event.studentId].lastScan = Math.max(
        studentStats[event.studentId].lastScan,
        event.timestamp
      );
    });
    return Object.entries(studentStats).map(([studentId, stats]) => ({
      studentId,
      name: `Student ${studentId.substring(0, 8)}`,
      // Mock name
      scans: stats.scans,
      lastScan: stats.lastScan
    })).sort((a, b) => b.scans - a.scans).slice(0, 10);
  }
  calculateOrganizationStats(events) {
    const orgStats = {};
    events.forEach((event) => {
      if (!orgStats[event.organizationId]) {
        orgStats[event.organizationId] = { generated: 0, scanned: 0 };
      }
      if (event.eventType === "GENERATED") {
        orgStats[event.organizationId].generated++;
      } else if (event.eventType === "SCANNED") {
        orgStats[event.organizationId].scanned++;
      }
    });
    return Object.entries(orgStats).map(([organizationId, stats]) => ({
      organizationId,
      name: `Organization ${organizationId}`,
      // Mock name
      generated: stats.generated,
      scanned: stats.scanned,
      successRate: stats.generated > 0 ? stats.scanned / stats.generated * 100 : 0
    }));
  }
  countActiveQRCodes(generatedEvents) {
    const recentGenerated = generatedEvents.filter(
      (event) => event.timestamp > Date.now() - 24 * 60 * 60 * 1e3
      // Within 24 hours
    );
    return recentGenerated.length;
  }
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
  generateQRId(qrData) {
    return `qr_${qrData.uuid}_${qrData.nonce}`;
  }
  cleanOldEvents() {
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1e3;
    this.events = this.events.filter((event) => event.timestamp >= cutoff);
    const oldNonces = Array.from(this.usedNonces).filter((nonce) => {
      const relatedEvent = this.events.find((e) => e.metadata?.nonce === nonce);
      return !relatedEvent || relatedEvent.timestamp < cutoff;
    });
    oldNonces.forEach((nonce) => this.usedNonces.delete(nonce));
  }
  /**
   * Export analytics data for reporting
   */
  exportAnalytics(organizationId, format = "json") {
    const analytics = this.generateAnalytics(organizationId);
    if (format === "csv") {
      return this.convertToCSV(analytics);
    }
    return JSON.stringify(analytics, null, 2);
  }
  convertToCSV(analytics) {
    const headers = ["Date", "Generated", "Scanned", "Failed"];
    const rows = analytics.dailyUsage.map(
      (day) => [day.date, day.generated, day.scanned, day.failed].join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }
};
var qrAnalyticsService = new QRAnalyticsService();

// src/qr-offline.ts
var OfflineQRService = class {
  cache = /* @__PURE__ */ new Map();
  CACHE_DURATION = 24 * 60 * 60 * 1e3;
  // 24 hours
  STORAGE_KEY = "qr_offline_cache";
  constructor() {
    this.loadFromLocalStorage();
  }
  /**
   * Update offline cache with organization data
   */
  updateCache(organizationId, students) {
    const cache = {
      organizationId,
      validStudents: students,
      trustedSignatures: [],
      // Would be populated with known good signatures
      lastUpdated: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION
    };
    this.cache.set(organizationId, cache);
    this.saveToLocalStorage();
  }
  /**
   * Validate QR code offline using cached data
   */
  validateOffline(qrDataString, allowExpiredCache = false) {
    try {
      const standardResult = validateQRData(qrDataString);
      if (!standardResult.isValid || !standardResult.data) {
        return {
          isValid: false,
          error: standardResult.error || "Invalid QR code",
          offline: true,
          cached: false
        };
      }
      const qrData = standardResult.data;
      const cache = this.cache.get(qrData.organizationId);
      if (!cache) {
        return {
          isValid: false,
          error: "No offline data available for this organization",
          offline: true,
          cached: false
        };
      }
      if (!allowExpiredCache && Date.now() > cache.expiresAt) {
        return {
          isValid: false,
          error: "Offline data is outdated. Please connect to internet to refresh.",
          offline: true,
          cached: true
        };
      }
      const student = cache.validStudents.find((s) => s.uuid === qrData.uuid);
      if (!student) {
        return {
          isValid: false,
          error: "Student not found in offline database",
          offline: true,
          cached: true
        };
      }
      if (!student.active) {
        return {
          isValid: false,
          error: "Student account is inactive",
          offline: true,
          cached: true
        };
      }
      if (this.isQRTooOld(qrData)) {
        return {
          isValid: false,
          error: "QR code is too old for offline validation",
          offline: true,
          cached: true
        };
      }
      return {
        isValid: true,
        studentData: {
          uuid: student.uuid,
          name: student.name,
          className: student.className
        },
        offline: true,
        cached: true
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Failed to validate QR code offline",
        offline: true,
        cached: false
      };
    }
  }
  /**
   * Check if device is online
   */
  isOnline() {
    return typeof navigator !== "undefined" && navigator.onLine;
  }
  /**
   * Hybrid validation - try online first, fallback to offline
   */
  async validateHybrid(qrDataString, onlineValidator) {
    if (this.isOnline() && onlineValidator) {
      try {
        const onlineResult = await onlineValidator(qrDataString);
        if (onlineResult.isValid) {
          return {
            ...onlineResult,
            offline: false,
            cached: false
          };
        }
      } catch (error) {
        console.warn("Online validation failed, falling back to offline:", error);
      }
    }
    return this.validateOffline(qrDataString, this.isOnline());
  }
  /**
   * Get cache status for an organization
   */
  getCacheStatus(organizationId) {
    const cache = this.cache.get(organizationId);
    if (!cache) {
      return { exists: false };
    }
    return {
      exists: true,
      lastUpdated: cache.lastUpdated,
      expiresAt: cache.expiresAt,
      studentCount: cache.validStudents.length,
      isExpired: Date.now() > cache.expiresAt
    };
  }
  /**
   * Clear expired caches
   */
  clearExpiredCaches() {
    const now = Date.now();
    let cleared = 0;
    for (const [orgId, cache] of this.cache) {
      if (now > cache.expiresAt) {
        this.cache.delete(orgId);
        cleared++;
      }
    }
    if (cleared > 0) {
      this.saveToLocalStorage();
    }
    return cleared;
  }
  /**
   * Get all cached organizations
   */
  getCachedOrganizations() {
    return Array.from(this.cache.entries()).map(([orgId, cache]) => ({
      organizationId: orgId,
      studentCount: cache.validStudents.length,
      lastUpdated: cache.lastUpdated,
      expiresAt: cache.expiresAt,
      isExpired: Date.now() > cache.expiresAt
    }));
  }
  /**
   * Force refresh cache from server
   */
  async refreshCache(organizationId, fetchFunction) {
    try {
      const students = await fetchFunction();
      this.updateCache(organizationId, students);
      return true;
    } catch (error) {
      console.error("Failed to refresh cache:", error);
      return false;
    }
  }
  isQRTooOld(qrData) {
    const maxOfflineAge = 2 * 60 * 60 * 1e3;
    const qrAge = Date.now() - (qrData.expires - 24 * 60 * 60 * 1e3);
    return qrAge > maxOfflineAge;
  }
  saveToLocalStorage() {
    if (typeof localStorage !== "undefined") {
      try {
        const cacheData = Object.fromEntries(this.cache);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        console.warn("Failed to save offline cache to localStorage:", error);
      }
    }
  }
  loadFromLocalStorage() {
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const cacheData = JSON.parse(stored);
          this.cache = new Map(Object.entries(cacheData));
          this.clearExpiredCaches();
        }
      } catch (error) {
        console.warn("Failed to load offline cache from localStorage:", error);
      }
    }
  }
  /**
   * Export cache for debugging
   */
  exportCache() {
    return JSON.stringify(Object.fromEntries(this.cache), null, 2);
  }
  /**
   * Get cache size for monitoring
   */
  getCacheSize() {
    const totalStudents = Array.from(this.cache.values()).reduce((sum, cache) => sum + cache.validStudents.length, 0);
    const memoryUsage = JSON.stringify(Object.fromEntries(this.cache)).length;
    return {
      organizations: this.cache.size,
      totalStudents,
      memoryUsage
    };
  }
};
var offlineQRService = new OfflineQRService();
var OfflineQRWorkerUtils = {
  /**
   * Register service worker for offline capabilities
   */
  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/qr-offline-sw.js");
        return true;
      } catch (error) {
        console.error("Service worker registration failed:", error);
        return false;
      }
    }
    return false;
  },
  /**
   * Check if app is running in standalone mode (PWA)
   */
  isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  },
  /**
   * Show offline status to user
   */
  createOfflineIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "offline-indicator";
    indicator.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			background: #f59e0b;
			color: white;
			padding: 8px;
			text-align: center;
			font-size: 14px;
			z-index: 9999;
			display: none;
		`;
    indicator.textContent = "\u26A0\uFE0F Offline mode - Limited functionality available";
    const updateStatus = () => {
      indicator.style.display = navigator.onLine ? "none" : "block";
    };
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
    return indicator;
  }
};

// src/index.ts
var AUTH_PROVIDERS = {
  TEACHER: "teacher-login",
  PARENT: "parent-login",
  STUDENT: "student-login"
};
var ROLE_PERMISSIONS = {
  STUDENT: ["read:own-progress", "write:own-activities"],
  TEACHER: ["read:class-data", "write:assessments", "manage:students"],
  PARENT: ["read:child-progress", "communicate:teachers"],
  ADMIN: ["manage:all", "system:admin"]
};
function hasPermission(userRole, requiredPermission) {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions?.includes(requiredPermission) || false;
}
function isValidRole(role) {
  return role in ROLE_PERMISSIONS;
}
export {
  AUTH_PROVIDERS,
  OfflineQRService,
  OfflineQRWorkerUtils,
  QRAnalyticsService,
  ROLE_PERMISSIONS,
  generateClassQRCodes,
  generatePrintableQRSheet,
  generateStudentQR,
  getTimeRemaining,
  hasPermission,
  isQRExpired,
  isValidRole,
  offlineQRService,
  qrAnalyticsService,
  validateQRData
};
