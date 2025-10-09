import { Home, Users, BookOpen, BarChart3, Settings, LogOut, GraduationCap, UserPlus } from 'lucide-svelte';

export interface NavigationItem {
	id: string;
	label: string;
	href: string;
	icon: any;
	badge?: number | string;
	isActive?: boolean;
}

export interface NavigationSection {
	items: NavigationItem[];
}

/**
 * Creates the main teacher navigation structure
 * @param currentPath - Current route path to determine active item
 * @param badges - Optional badge counts for navigation items
 */
export function createTeacherNavigation(
	currentPath: string,
	badges?: {
		classes?: number;
		students?: number;
	}
): NavigationSection[] {
	return [
		{
			items: [
				{
					id: 'dashboard',
					label: 'Dashboard',
					href: '/dashboard',
					icon: Home,
					isActive: currentPath === '/dashboard'
				},
				{
					id: 'classes',
					label: 'Classes',
					href: '/classes',
					icon: BookOpen,
					badge: badges?.classes,
					isActive: currentPath.startsWith('/classes')
				},
				{
					id: 'students',
					label: 'Students',
					href: '/students',
					icon: Users,
					badge: badges?.students,
					isActive: currentPath.startsWith('/students')
				},
				{
					id: 'qr-codes',
					label: 'QR Codes',
					href: '/qr-codes',
					icon: BarChart3,
					isActive: currentPath === '/qr-codes'
				}
			]
		}
	];
}

/**
 * Creates the account/settings navigation
 * @param currentPath - Current route path to determine active item
 */
export function createAccountNavigation(currentPath: string): NavigationSection[] {
	return [
		{
			items: [
				{
					id: 'settings',
					label: 'Settings',
					href: '/settings',
					icon: Settings,
					isActive: currentPath.startsWith('/settings')
				},
				{
					id: 'profile',
					label: 'Profile',
					href: '/profile',
					icon: GraduationCap,
					isActive: currentPath === '/profile'
				},
				{
					id: 'signout',
					label: 'Sign Out',
					href: '/auth/signout',
					icon: LogOut
				}
			]
		}
	];
}

/**
 * Creates quick action items for drawers/modals
 */
export function createQuickActions(): Array<{
	id: string;
	label: string;
	description: string;
	icon: any;
	action: string;
	color: string;
}> {
	return [
		{
			id: 'add-students',
			label: 'Add Students',
			description: 'Register new students to your classes',
			icon: UserPlus,
			action: '/students/register',
			color: 'green'
		},
		{
			id: 'generate-qr',
			label: 'Generate QR Codes',
			description: 'Create QR codes for student login',
			icon: BarChart3,
			action: '/qr-codes',
			color: 'blue'
		},
		{
			id: 'create-class',
			label: 'Create Class',
			description: 'Set up a new class for your students',
			icon: BookOpen,
			action: 'create-class',
			color: 'purple'
		}
	];
}

/**
 * Helper to get current page title based on path
 */
export function getPageTitle(currentPath: string): string {
	const pathMap: Record<string, string> = {
		'/dashboard': 'Dashboard',
		'/classes': 'My Classes',
		'/students': 'Students',
		'/qr-codes': 'QR Codes',
		'/settings': 'Settings',
		'/profile': 'Profile'
	};

	// Handle dynamic routes
	if (currentPath.startsWith('/classes/')) {
		return 'Class Details';
	}
	if (currentPath.startsWith('/students/')) {
		return 'Student Management';
	}

	return pathMap[currentPath] || 'Teacher Portal';
}