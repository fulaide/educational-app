import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import { requireRole } from '$lib/auth/auth-helpers.server';
import { generateUUID } from '$lib/utils/uuid';

// Schema for adding individual student
const addStudentSchema = z.object({
	studentCode: z.string().min(8, 'Student code must be 8 characters').max(8, 'Student code must be 8 characters')
		.regex(/^[A-Za-z0-9]{8}$/, 'Student code must contain only letters and numbers').optional(),
	studentName: z.string().min(1, 'Student name is required').max(100, 'Name too long').optional(),
	mode: z.enum(['existing', 'new'])
});

// Schema for creating multiple students
const createStudentsSchema = z.object({
	studentCount: z.number().int().min(1, 'Must create at least 1 student').max(20, 'Maximum 20 students at once'),
	studentNames: z.string().optional() // Comma-separated names
});

// Schema for removing student
const removeStudentSchema = z.object({
	studentId: z.string().min(1, 'Student ID is required')
});

// Schema for editing student
const editStudentSchema = z.object({
	studentId: z.string().min(1, 'Student ID is required'),
	name: z.string().min(1, 'Student name is required').max(100, 'Name too long'),
	grade: z.number().int().min(1, 'Grade must be at least 1').max(4, 'Grade must be at most 4'),
	isActive: z.boolean()
});

export const load = (async ({ locals, params }) => {
	const session = await requireRole(locals, 'TEACHER');
	const classId = params.id;

	try {
		// Get class details with students
		const classItem = await prisma.class.findUnique({
			where: {
				id: classId,
				teacherId: session.user.id // Ensure teacher owns this class
			},
			include: {
				students: {
					select: {
						id: true,
						name: true,
						uuid: true,
						grade: true,
						isActive: true,
						lastLoginAt: true,
						createdAt: true,
						studentQRCodes: {
							where: {
								expiresAt: {
									gt: new Date() // Only non-expired QR codes
								}
							},
							orderBy: {
								createdAt: 'desc'
							},
							take: 1 // Get the most recent active QR code
						}
					},
					orderBy: { name: 'asc' }
				},
				organization: {
					select: { id: true, name: true }
				}
			}
		});

		if (!classItem) {
			throw error(404, 'Class not found');
		}

		// Get unassigned students from the same organization and grade
		const availableStudents = await prisma.user.findMany({
			where: {
				role: 'STUDENT',
				organizationId: session.user.organizationId,
				grade: classItem.grade,
				isActive: true,
				NOT: {
					studentClasses: {
						some: {
							id: classId
						}
					}
				}
			},
			select: {
				id: true,
				name: true,
				uuid: true,
				grade: true
			},
			orderBy: { name: 'asc' },
			take: 50 // Limit for performance
		});

		// Initialize forms
		const addStudentForm = await superValidate(zod(addStudentSchema));
		const createStudentsForm = await superValidate(zod(createStudentsSchema));
		const removeStudentForm = await superValidate(zod(removeStudentSchema));
		const editStudentForm = await superValidate(zod(editStudentSchema));

		return {
			classItem,
			availableStudents,
			addStudentForm,
			createStudentsForm,
			removeStudentForm,
			editStudentForm
		};
	} catch (err) {
		console.error('Failed to load class students:', err);
		if (err instanceof Error && err.message === 'Class not found') {
			throw error(404, 'Class not found');
		}
		throw error(500, 'Failed to load class data');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	// Add existing student to class
	addExisting: async ({ request, locals, params }) => {
		const session = await requireRole(locals, 'TEACHER');
		const classId = params.id;

		const form = await superValidate(request, zod(addStudentSchema));

		if (!form.valid || !form.data.studentCode) {
			return fail(400, { form });
		}

		try {
			// Verify teacher owns the class
			const classItem = await prisma.class.findUnique({
				where: { id: classId, teacherId: session.user.id },
				include: { students: true }
			});

			if (!classItem) {
				throw error(404, 'Class not found');
			}

			// Check if class is at capacity
			if (classItem.students.length >= classItem.maxStudents) {
				return message(form, `Class is at maximum capacity (${classItem.maxStudents} students)`, {
					status: 400
				});
			}

			// Find student by UUID
			const student = await prisma.user.findUnique({
				where: {
					uuid: form.data.studentCode.toUpperCase(),
					role: 'STUDENT'
				},
				include: {
					studentClasses: {
						where: { id: classId }
					}
				}
			});

			if (!student) {
				return message(form, 'Student not found. Please check the student code.', {
					status: 400
				});
			}

			if (!student.isActive) {
				return message(form, 'Student account is not active.', {
					status: 400
				});
			}

			// Check if student is already in this class
			if (student.studentClasses.length > 0) {
				return message(form, `${student.name || 'Student'} is already in this class.`, {
					status: 400
				});
			}

			// Add student to class
			await prisma.class.update({
				where: { id: classId },
				data: {
					students: {
						connect: { id: student.id }
					}
				}
			});

			console.log(`[CLASSES] Student ${student.name} (${student.uuid}) added to class ${classItem.name}`);

			return message(form, `${student.name || 'Student'} added to class successfully!`);
		} catch (err) {
			console.error('Failed to add student to class:', err);
			return message(form, 'Failed to add student. Please try again.', {
				status: 500
			});
		}
	},

	// Create new students for the class
	createNew: async ({ request, locals, params }) => {
		const session = await requireRole(locals, 'TEACHER');
		const classId = params.id;

		const form = await superValidate(request, zod(createStudentsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Verify teacher owns the class
			const classItem = await prisma.class.findUnique({
				where: { id: classId, teacherId: session.user.id },
				include: { students: true }
			});

			if (!classItem) {
				throw error(404, 'Class not found');
			}

			const { studentCount, studentNames } = form.data;
			
			// Check if adding these students would exceed capacity
			if (classItem.students.length + studentCount > classItem.maxStudents) {
				return message(form, `Adding ${studentCount} students would exceed class capacity (${classItem.maxStudents - classItem.students.length} spots remaining)`, {
					status: 400
				});
			}

			// Parse names if provided
			const names = studentNames 
				? studentNames.split(',').map(name => name.trim()).filter(name => name.length > 0)
				: [];

			// Generate students
			const studentsToCreate = [];
			for (let i = 0; i < studentCount; i++) {
				const uuid = generateUUID();
				const name = names[i] || `Student ${classItem.students.length + i + 1}`;

				studentsToCreate.push({
					role: 'STUDENT' as const,
					name,
					uuid,
					grade: classItem.grade,
					organizationId: session.user.organizationId!,
					isActive: true,
					isVerified: true,
					settings: JSON.stringify({
						createdBy: session.user.id,
						createdForClass: classId,
						createdAt: new Date().toISOString()
					})
				});
			}

			// Create students in a transaction
			const result = await prisma.$transaction(async (tx) => {
				// Create students
				const createdStudents = [];
				for (const studentData of studentsToCreate) {
					const student = await tx.user.create({
						data: studentData
					});
					createdStudents.push(student);
				}

				// Add all students to the class
				await tx.class.update({
					where: { id: classId },
					data: {
						students: {
							connect: createdStudents.map(s => ({ id: s.id }))
						}
					}
				});

				return createdStudents;
			});

			console.log(`[CLASSES] Created ${result.length} new students for class ${classItem.name}`);

			return message(form, `Successfully created ${result.length} new student(s) and added them to the class!`);
		} catch (err) {
			console.error('Failed to create students:', err);
			return message(form, 'Failed to create students. Please try again.', {
				status: 500
			});
		}
	},

	// Remove student from class
	remove: async ({ request, locals, params }) => {
		const session = await requireRole(locals, 'TEACHER');
		const classId = params.id;

		const form = await superValidate(request, zod(removeStudentSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Verify teacher owns the class and get student info
			const classItem = await prisma.class.findUnique({
				where: { id: classId, teacherId: session.user.id },
				include: {
					students: {
						where: { id: form.data.studentId },
						select: { id: true, name: true, uuid: true }
					}
				}
			});

			if (!classItem) {
				throw error(404, 'Class not found');
			}

			if (classItem.students.length === 0) {
				return message(form, 'Student not found in this class.', {
					status: 400
				});
			}

			const student = classItem.students[0];

			// Remove student from class
			await prisma.class.update({
				where: { id: classId },
				data: {
					students: {
						disconnect: { id: student.id }
					}
				}
			});

			console.log(`[CLASSES] Student ${student.name} removed from class ${classId}`);

			return message(form, `${student.name || 'Student'} removed from class.`);
		} catch (err) {
			console.error('Failed to remove student from class:', err);
			return message(form, 'Failed to remove student. Please try again.', {
				status: 500
			});
		}
	},

	// Edit student details
	edit: async ({ request, locals, params }) => {
		const session = await requireRole(locals, 'TEACHER');
		const classId = params.id;

		const form = await superValidate(request, zod(editStudentSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Verify teacher owns the class and student is in it
			const classItem = await prisma.class.findUnique({
				where: { id: classId, teacherId: session.user.id },
				include: {
					students: {
						where: { id: form.data.studentId },
						select: { id: true, name: true, uuid: true }
					}
				}
			});

			if (!classItem || classItem.students.length === 0) {
				return message(form, 'Student not found in this class.', {
					status: 400
				});
			}

			const student = classItem.students[0];

			// Update student
			const updatedStudent = await prisma.user.update({
				where: { id: student.id },
				data: {
					name: form.data.name,
					grade: form.data.grade,
					isActive: form.data.isActive
				}
			});

			console.log(`[CLASSES] Student ${updatedStudent.name} (${updatedStudent.uuid}) updated by teacher ${session.user.id}`);

			return message(form, `${updatedStudent.name} updated successfully!`);
		} catch (err) {
			console.error('Failed to update student:', err);
			return message(form, 'Failed to update student. Please try again.', {
				status: 500
			});
		}
	}
};
