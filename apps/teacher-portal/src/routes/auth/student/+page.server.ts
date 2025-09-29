import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import { generateUUID } from '$lib/utils/uuid';
import jwt from 'jsonwebtoken';

// Validation schemas
const studentLoginSchema = z.object({
	uuid: z.string().min(8, 'Code must be at least 8 characters').max(8, 'Code must be exactly 8 characters')
		.regex(/^[A-Za-z0-9]{8}$/, 'Code must contain only letters and numbers')
});

const studentRegisterSchema = z.object({
	name: z.string().min(1, 'Please enter your name').max(100, 'Name too long'),
	grade: z.number().int().min(1, 'Please select your grade').max(12, 'Invalid grade')
});

export const load = (async ({ locals, url }) => {
	// If already logged in as student, redirect to student portal
	const sessionToken = locals.cookies?.get('session');
	if (sessionToken) {
		try {
			const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key';
			const decoded = jwt.verify(sessionToken, JWT_SECRET) as any;
			if (decoded.role === 'STUDENT') {
				throw redirect(303, '/student-portal');
			}
		} catch (error) {
			// Invalid token, continue with login page
		}
	}

	// Initialize forms
	const loginForm = await superValidate(zod(studentLoginSchema));
	const registerForm = await superValidate(zod(studentRegisterSchema));

	return {
		loginForm,
		registerForm
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// Student login action
	login: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(studentLoginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { uuid } = form.data;

			// Find student by UUID
			const student = await prisma.user.findUnique({
				where: {
					uuid: uuid.toUpperCase(),
					role: 'STUDENT'
				},
				include: {
					organization: {
						select: { id: true, name: true }
					},
					studentClasses: {
						include: {
							teacher: {
								select: { id: true, name: true, email: true }
							}
						}
					}
				}
			});

			if (!student) {
				return message(form, 'Invalid student code. Please check your code and try again.', {
					status: 400
				});
			}

			if (!student.isActive) {
				return message(form, 'This student account is not active. Please contact your teacher.', {
					status: 400
				});
			}

			// Update last login
			await prisma.user.update({
				where: { id: student.id },
				data: { lastLoginAt: new Date() }
			});

			// Create JWT session token
			const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key';
			const sessionPayload = {
				id: student.id,
				email: student.email,
				name: student.name,
				role: student.role,
				organizationId: student.organizationId,
				uuid: student.uuid,
				grade: student.grade,
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
			};

			const sessionToken = jwt.sign(sessionPayload, JWT_SECRET);

			// Set session cookie
			cookies.set('session', sessionToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 24 * 60 * 60 // 24 hours
			});

			// TODO: Create session record in database (when DB is fully set up)
			// await prisma.userSession.create({
			//   data: {
			//     userId: student.id,
			//     tokenId: sessionPayload.jti,
			//     expiresAt: new Date(sessionPayload.exp * 1000),
			//     // Add device info if available
			//   }
			// });

			console.log(`[AUTH] Student login successful: ${student.name} (${student.uuid})`);

			// Redirect to student portal
			throw redirect(303, '/student-portal');

		} catch (error) {
			console.error('Student login error:', error);
			return message(form, 'Login failed. Please try again.', {
				status: 500
			});
		}
	},

	// Student registration action
	register: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(studentRegisterSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { name, grade } = form.data;

			// Generate unique UUID for student
			let uuid: string;
			let attempts = 0;
			do {
				uuid = generateUUID();
				attempts++;
				if (attempts > 10) {
					throw new Error('Failed to generate unique UUID');
				}
				// Check if UUID already exists
				const existing = await prisma.user.findUnique({
					where: { uuid }
				});
				if (!existing) break;
			} while (true);

			// Create new student account
			const newStudent = await prisma.user.create({
				data: {
					role: 'STUDENT',
					name: name.trim(),
					uuid: uuid,
					grade,
					isActive: true,
					isVerified: true, // Students don't need email verification
					settings: JSON.stringify({
						selfRegistered: true,
						createdAt: new Date().toISOString()
					})
				}
			});

			console.log(`[AUTH] Student self-registration successful: ${newStudent.name} (${newStudent.uuid})`);

			// Create JWT session token and log them in immediately
			const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key';
			const sessionPayload = {
				id: newStudent.id,
				email: newStudent.email,
				name: newStudent.name,
				role: newStudent.role,
				organizationId: newStudent.organizationId,
				uuid: newStudent.uuid,
				grade: newStudent.grade,
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
			};

			const sessionToken = jwt.sign(sessionPayload, JWT_SECRET);

			// Set session cookie
			cookies.set('session', sessionToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 24 * 60 * 60 // 24 hours
			});

			// Show success message with their new code
			return message(form, `Account created successfully! Your student code is: ${uuid}. Save this code - you'll need it to log in!`, {
				status: 200
			});

		} catch (error) {
			console.error('Student registration error:', error);
			return message(form, 'Failed to create account. Please try again.', {
				status: 500
			});
		}
	}
};
