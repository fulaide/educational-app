import { getContext, setContext } from 'svelte';

export interface ClassData {
	id: string;
	name: string;
	grade: number;
	maxStudents: number;
	isActive: boolean;
	avatarUrl?: string | null;
	avatarType?: 'PRESET' | 'CUSTOM';
	students: Array<{
		id: string;
		name: string | null;
		uuid: string;
		grade: number | null;
		isActive: boolean;
		lastLoginAt: string | null;
	}>;
	organization?: {
		id: string;
		name: string;
	};
	teacher?: {
		id: string;
		name: string | null;
		email: string | null;
	};
	createdAt: string;
	updatedAt: string;
}

export class ClassStore {
	private classData = $state<ClassData>();

	constructor(initialData?: ClassData) {
		if (initialData) {
			this.classData = initialData;
		}
	}

	// Getters
	get data(): ClassData | undefined {
		return this.classData;
	}

	get name(): string {
		return this.classData?.name ?? '';
	}

	get grade(): number {
		return this.classData?.grade ?? 1;
	}

	get maxStudents(): number {
		return this.classData?.maxStudents ?? 30;
	}

	get isActive(): boolean {
		return this.classData?.isActive ?? true;
	}

	get students() {
		return this.classData?.students ?? [];
	}

	get studentCount(): number {
		return this.students.length;
	}

	// Computed properties
	get displayInfo() {
		return {
			name: this.name,
			grade: `Grade ${this.grade}`,
			studentCount: `${this.studentCount} / ${this.maxStudents}`,
			status: this.isActive ? 'Active' : 'Inactive'
		};
	}

	get avatarUrl(): string | null | undefined {
		return this.classData?.avatarUrl;
	}

	get avatarType(): 'PRESET' | 'CUSTOM' | undefined {
		return this.classData?.avatarType;
	}

	// Setters for updates
	updateClass(updates: Partial<Pick<ClassData, 'name' | 'grade' | 'maxStudents' | 'isActive' | 'avatarUrl' | 'avatarType'>>) {
		if (!this.classData) return;

		this.classData = {
			...this.classData,
			...updates,
			updatedAt: new Date().toISOString()
		};
	}

	// Initialize with server data
	initialize(data: ClassData) {
		this.classData = data;
	}

	// Sync with server response after updates
	sync(serverData: ClassData) {
		this.classData = serverData;
	}

	// Student management
	addStudent(student: ClassData['students'][0]) {
		if (!this.classData) return;

		this.classData.students = [...this.classData.students, student];
	}

	removeStudent(studentId: string) {
		if (!this.classData) return;

		this.classData.students = this.classData.students.filter(s => s.id !== studentId);
	}
}

// Context key
const CLASS_STORE_KEY = Symbol('class-store');

// Context helpers
export function setClassStore(initialData?: ClassData) {
	const store = new ClassStore(initialData);
	setContext(CLASS_STORE_KEY, store);
	return store;
}

export function getClassStore(): ClassStore {
	const store = getContext<ClassStore>(CLASS_STORE_KEY);
	if (!store) {
		throw new Error('ClassStore not found. Make sure to call setClassStore() in a parent component.');
	}
	return store;
}