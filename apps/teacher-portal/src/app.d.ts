// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: string
				email?: string
				name?: string
				role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'
				organizationId?: string
				uuid?: string
				grade?: number
			}
			auth(): Promise<{
				user?: {
					id: string
					email?: string
					name?: string
					role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'
					organizationId?: string
					uuid?: string
					grade?: number
				}
			} | null>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			id: string
			email?: string
			name?: string
			role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'
			organizationId?: string
			uuid?: string
			grade?: number
		}
	}

	interface User {
		id: string
		email?: string
		name?: string
		role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'
		organizationId?: string
		uuid?: string
		grade?: number
	}
}
