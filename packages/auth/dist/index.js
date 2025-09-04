var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/dotenv/package.json
var require_package = __commonJS({
  "../../node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.6.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// ../../node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "../../node_modules/dotenv/lib/main.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var path2 = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath2) {
      return envPath2[0] === "~" ? path2.join(os.homedir(), envPath2.slice(1)) : envPath2;
    }
    function _configVault(options) {
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (debug || !quiet) {
        const keysCount = Object.keys(parsedAll).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

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

// src/email-service.ts
var import_dotenv = __toESM(require_main(), 1);
import { Resend } from "resend";
import path from "path";
var envPath = path.resolve(process.cwd(), ".env");
import_dotenv.default.config({ path: envPath });
var resend = new Resend(process.env.RESEND_API_KEY);
var EmailService = class {
  static defaultFrom = "Educational App <onboarding@resend.dev>";
  static async send(options) {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey || apiKey === "your-resend-api-key") {
        console.warn("[EMAIL] RESEND_API_KEY not configured, using development mode");
        console.log("[EMAIL] [DEV MODE] Email would be sent to:", options.to);
        console.log("[EMAIL] [DEV MODE] Subject:", options.subject);
        console.log("[EMAIL] [DEV MODE] HTML preview (first 200 chars):", options.html.substring(0, 200) + "...");
        return { success: true, messageId: "dev-mode-" + Date.now() };
      }
      const response = await resend.emails.send({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html
      });
      if (response.error) {
        console.error("[EMAIL] Resend error:", response.error);
        return { success: false, error: response.error.message };
      }
      console.log("[EMAIL] Email sent successfully:", response.data?.id);
      return { success: true, messageId: response.data?.id };
    } catch (error) {
      console.error("[EMAIL] Failed to send email:", error);
      return { success: false, error: "Failed to send email" };
    }
  }
  static async sendPasswordReset(email, resetToken, resetUrl) {
    const html = this.getPasswordResetTemplate(resetToken, resetUrl);
    return this.send({
      to: email,
      subject: "Reset Your Password - Educational App",
      html
    });
  }
  static async sendEmailVerification(email, verificationToken, verificationUrl) {
    const html = this.getEmailVerificationTemplate(verificationToken, verificationUrl);
    return this.send({
      to: email,
      subject: "Verify Your Email Address - Educational App",
      html
    });
  }
  static getPasswordResetTemplate(resetToken, resetUrl) {
    return `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Password Reset</title>
				<style>
					body {
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
						line-height: 1.6;
						color: #333;
						max-width: 600px;
						margin: 0 auto;
						padding: 20px;
					}
					.header {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						color: white;
						padding: 30px 20px;
						text-align: center;
						border-radius: 8px 8px 0 0;
					}
					.content {
						background: #f8fafc;
						padding: 30px 20px;
						border-radius: 0 0 8px 8px;
						border: 1px solid #e2e8f0;
						border-top: none;
					}
					.button {
						display: inline-block;
						background: #4f46e5;
						color: white;
						padding: 12px 30px;
						text-decoration: none;
						border-radius: 6px;
						font-weight: 500;
						margin: 20px 0;
					}
					.token {
						background: #1f2937;
						color: #10b981;
						padding: 15px;
						border-radius: 6px;
						font-family: 'Courier New', monospace;
						font-size: 18px;
						text-align: center;
						margin: 20px 0;
						letter-spacing: 2px;
					}
					.footer {
						text-align: center;
						color: #6b7280;
						font-size: 14px;
						margin-top: 30px;
						padding-top: 20px;
						border-top: 1px solid #e5e7eb;
					}
					.warning {
						background: #fef3cd;
						border: 1px solid #f59e0b;
						color: #92400e;
						padding: 15px;
						border-radius: 6px;
						margin: 20px 0;
					}
				</style>
			</head>
			<body>
				<div class="header">
					<h1>\u{1F393} Educational App</h1>
					<p>Password Reset Request</p>
				</div>
				
				<div class="content">
					<h2>Hello!</h2>
					<p>We received a request to reset your password for your Educational App teacher account.</p>
					
					<p>Click the button below to reset your password:</p>
					<p style="text-align: center;">
						<a href="${resetUrl}" class="button">Reset Your Password</a>
					</p>
					
					<p>Or copy and paste this reset code into the password reset form:</p>
					<div class="token">${resetToken}</div>
					
					<div class="warning">
						<strong>\u26A0\uFE0F Important:</strong> This reset link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
					</div>
					
					<p>If you're having trouble with the button above, you can also visit: <br>
					<a href="${resetUrl}">${resetUrl}</a></p>
				</div>
				
				<div class="footer">
					<p>Educational App Team<br>
					This email was sent automatically. Please do not reply.</p>
				</div>
			</body>
			</html>
		`;
  }
  static getEmailVerificationTemplate(verificationToken, verificationUrl) {
    return `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Verify Your Email</title>
				<style>
					body {
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
						line-height: 1.6;
						color: #333;
						max-width: 600px;
						margin: 0 auto;
						padding: 20px;
					}
					.header {
						background: linear-gradient(135deg, #10b981 0%, #059669 100%);
						color: white;
						padding: 30px 20px;
						text-align: center;
						border-radius: 8px 8px 0 0;
					}
					.content {
						background: #f8fafc;
						padding: 30px 20px;
						border-radius: 0 0 8px 8px;
						border: 1px solid #e2e8f0;
						border-top: none;
					}
					.button {
						display: inline-block;
						background: #10b981;
						color: white;
						padding: 12px 30px;
						text-decoration: none;
						border-radius: 6px;
						font-weight: 500;
						margin: 20px 0;
					}
					.token {
						background: #1f2937;
						color: #10b981;
						padding: 15px;
						border-radius: 6px;
						font-family: 'Courier New', monospace;
						font-size: 18px;
						text-align: center;
						margin: 20px 0;
						letter-spacing: 2px;
					}
					.footer {
						text-align: center;
						color: #6b7280;
						font-size: 14px;
						margin-top: 30px;
						padding-top: 20px;
						border-top: 1px solid #e5e7eb;
					}
					.success {
						background: #d1fae5;
						border: 1px solid #10b981;
						color: #047857;
						padding: 15px;
						border-radius: 6px;
						margin: 20px 0;
					}
				</style>
			</head>
			<body>
				<div class="header">
					<h1>\u{1F393} Educational App</h1>
					<p>Welcome! Please Verify Your Email</p>
				</div>
				
				<div class="content">
					<h2>Verify Your Account</h2>
					<p>Thank you for creating your Educational App teacher account! To complete your registration and access your dashboard, please verify your email address.</p>
					
					<p>Click the button below to verify your email:</p>
					<p style="text-align: center;">
						<a href="${verificationUrl}" class="button">Verify Email Address</a>
					</p>
					
					<p>Or copy and paste this verification code:</p>
					<div class="token">${verificationToken}</div>
					
					<div class="success">
						<strong>\u2728 What's next?</strong> Once verified, you'll be able to:
						<ul>
							<li>Access your teacher dashboard</li>
							<li>Create and manage classes</li>
							<li>Track student progress</li>
							<li>Customize learning modules</li>
						</ul>
					</div>
					
					<p><strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.</p>
					
					<p>If you're having trouble with the button above, you can also visit: <br>
					<a href="${verificationUrl}">${verificationUrl}</a></p>
				</div>
				
				<div class="footer">
					<p>Educational App Team<br>
					This email was sent automatically. Please do not reply.</p>
				</div>
			</body>
			</html>
		`;
  }
};

// src/url-utils.ts
function getBaseUrl(context) {
  const { url } = context;
  const protocol = process.env.NODE_ENV === "production" ? "https" : url.protocol;
  const host = url.host;
  return `${protocol}//${host}`;
}
function getAuthUrl(context, path2) {
  const baseUrl = getBaseUrl(context);
  const cleanPath = path2.startsWith("/") ? path2 : `/${path2}`;
  return `${baseUrl}${cleanPath}`;
}
function getPasswordResetUrl(context, token) {
  return getAuthUrl(context, `/auth/reset-password/${token}`);
}
function getEmailVerificationUrl(context, token) {
  return getAuthUrl(context, `/auth/verify-email/${token}`);
}
function getEnvironmentInfo(context) {
  const { url } = context;
  const isDevelopment = process.env.NODE_ENV !== "production";
  return {
    protocol: url.protocol.replace(":", ""),
    host: url.hostname,
    port: url.port,
    isDevelopment
  };
}

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
  EmailService,
  OfflineQRService,
  OfflineQRWorkerUtils,
  QRAnalyticsService,
  ROLE_PERMISSIONS,
  generateClassQRCodes,
  generatePrintableQRSheet,
  generateStudentQR,
  getAuthUrl,
  getBaseUrl,
  getEmailVerificationUrl,
  getEnvironmentInfo,
  getPasswordResetUrl,
  getTimeRemaining,
  hasPermission,
  isQRExpired,
  isValidRole,
  offlineQRService,
  qrAnalyticsService,
  validateQRData
};
