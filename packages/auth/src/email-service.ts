import { Resend } from 'resend'
import dotenv from 'dotenv'
import path from 'path'

// Ensure env vars are loaded
const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
	to: string
	subject: string
	html: string
	from?: string
}

export class EmailService {
	private static defaultFrom = 'Educational App <onboarding@resend.dev>'

	static async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
		try {
			const apiKey = process.env.RESEND_API_KEY
			
			if (!apiKey || apiKey === 'your-resend-api-key') {
				console.warn('[EMAIL] RESEND_API_KEY not configured, using development mode')
				console.log('[EMAIL] [DEV MODE] Email would be sent to:', options.to)
				console.log('[EMAIL] [DEV MODE] Subject:', options.subject)
				console.log('[EMAIL] [DEV MODE] HTML preview (first 200 chars):', options.html.substring(0, 200) + '...')
				
				// Return success in dev mode for testing
				return { success: true, messageId: 'dev-mode-' + Date.now() }
			}

			const response = await resend.emails.send({
				from: options.from || this.defaultFrom,
				to: options.to,
				subject: options.subject,
				html: options.html
			})

			if (response.error) {
				console.error('[EMAIL] Resend error:', response.error)
				return { success: false, error: response.error.message }
			}

			console.log('[EMAIL] Email sent successfully:', response.data?.id)
			return { success: true, messageId: response.data?.id }

		} catch (error) {
			console.error('[EMAIL] Failed to send email:', error)
			return { success: false, error: 'Failed to send email' }
		}
	}

	static async sendPasswordReset(email: string, resetToken: string, resetUrl: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
		const html = this.getPasswordResetTemplate(resetToken, resetUrl)
		
		return this.send({
			to: email,
			subject: 'Reset Your Password - Educational App',
			html
		})
	}

	static async sendEmailVerification(email: string, verificationToken: string, verificationUrl: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
		const html = this.getEmailVerificationTemplate(verificationToken, verificationUrl)
		
		return this.send({
			to: email,
			subject: 'Verify Your Email Address - Educational App',
			html
		})
	}

	static getPasswordResetTemplate(resetToken: string, resetUrl: string): string {
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
					<h1>🎓 Educational App</h1>
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
						<strong>⚠️ Important:</strong> This reset link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
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
		`
	}

	static getEmailVerificationTemplate(verificationToken: string, verificationUrl: string): string {
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
					<h1>🎓 Educational App</h1>
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
						<strong>✨ What's next?</strong> Once verified, you'll be able to:
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
		`
	}
}