<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { Button, Card, Drawer } from '@educational-app/ui';
	import { BarChart3, BookOpen, Eye, Plus, Users } from 'lucide-svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Drawer state for creating/editing content
	let showCreateClassDrawer = $state(false);
	let showQuickActionsDrawer = $state(false);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getInitials(name: string | null) {
		if (!name) return '?';
		return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
	}
</script>

<svelte:head>
	<title>{$t('dashboard.title')} - {$t('teacher.home.teacher_portal')}</title>
</svelte:head>

<!-- Content is now wrapped by the parent layout -->
		<!-- Welcome Header -->
		<div class="md:flex md:items-center md:justify-between mb-8">
			<div class="flex-1 min-w-0">
				<h2 class="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl sm:truncate">
					{$t('dashboard.welcome_teacher', { values: { name: data.user?.name || 'Lehrer' } })}
				</h2>
				<div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
					<div class="mt-2 flex items-center text-sm text-neutral-500">
						<svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
						</svg>
						{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
					</div>
					{#if data.teacherData?.organization}
						<div class="mt-2 flex items-center text-sm text-neutral-500">
							<svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2h8z" clip-rule="evenodd" />
							</svg>
							{data.teacherData.organization.name}
						</div>
					{/if}
				</div>
			</div>
			<div class="mt-4 flex space-x-3 md:mt-0 md:ml-4">
				<Button
					variant="solid"
					color="primary"
					onclick={() => showCreateClassDrawer = true}
				>
					<Plus class="-ml-1 mr-2 h-4 w-4" />
					Create Class
				</Button>
				<Button
					variant="outline"
					color="secondary"
					onclick={() => showQuickActionsDrawer = true}
				>
					<BarChart3 class="-ml-1 mr-2 h-4 w-4" />
					Quick Actions
				</Button>
			</div>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
			<!-- Total Classes -->
			<Card variant="outlined" padding="lg">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<BookOpen class="h-8 w-8 text-primary-500" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-neutral-500 truncate">Total Classes</dt>
							<dd class="text-2xl font-bold text-neutral-900">{data.totalClasses || 0}</dd>
						</dl>
					</div>
				</div>
				<div class="mt-4">
					<Button
						variant="ghost"
						color="primary"
						size="sm"
						onclick={() => window.location.href = '/classes'}
						class="!p-0"
					>
						<Eye class="mr-1 h-4 w-4" />
						View all classes
					</Button>
				</div>
			</Card>

			<!-- Total Students -->
			<Card variant="outlined" padding="lg">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Users class="h-8 w-8 text-success-500" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-neutral-500 truncate">Total Students</dt>
							<dd class="text-2xl font-bold text-neutral-900">{data.totalStudents || 0}</dd>
						</dl>
					</div>
				</div>
				<div class="mt-4">
					<Button
						variant="ghost"
						color="success"
						size="sm"
						onclick={() => window.location.href = '/students'}
						class="!p-0"
					>
						<Eye class="mr-1 h-4 w-4" />
						Manage students
					</Button>
				</div>
			</Card>

			<!-- Quick Actions -->
			<Card variant="outlined" padding="lg">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<BarChart3 class="h-8 w-8 text-secondary-500" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-neutral-500 truncate">Quick Actions</dt>
							<dd class="text-2xl font-bold text-neutral-900">Ready</dd>
						</dl>
					</div>
				</div>
				<div class="mt-4">
					<Button
						variant="ghost"
						color="secondary"
						size="sm"
						onclick={() => showQuickActionsDrawer = true}
						class="!p-0"
					>
						<Plus class="mr-1 h-4 w-4" />
						Open actions
					</Button>
				</div>
			</Card>
			</div>

			<!-- Recent Classes -->
			<div class="bg-white shadow overflow-hidden sm:rounded-md mb-8">
				<div class="px-4 py-5 sm:px-6">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-lg leading-6 font-medium text-neutral-900">Your Classes</h3>
							<p class="mt-1 max-w-2xl text-sm text-neutral-500">
								{data.totalClasses > 0 ? `Your ${data.totalClasses} class${data.totalClasses !== 1 ? 'es' : ''}` : 'No classes yet'}
							</p>
						</div>
						{#if data.totalClasses > 5}
							<a href="/classes" class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
								View all ({data.totalClasses})
							</a>
						{/if}
					</div>
				</div>
				{#if data.recentClasses.length === 0}
					<div class="text-center py-12">
						<svg class="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
						<h3 class="mt-2 text-sm font-medium text-neutral-900">No classes</h3>
						<p class="mt-1 text-sm text-neutral-500">Get started by creating your first class.</p>
						<div class="mt-6">
							<a
								href="/classes"
								class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
							>
								<svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								Create your first class
							</a>
						</div>
					</div>
				{:else}
					<ul class="divide-y divide-neutral-200">
						{#each data.recentClasses as classItem}
							<li>
								<a href="/classes/{classItem.id}" class="block hover:bg-neutral-50 px-4 py-4 sm:px-6 transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center">
											<div class="flex-shrink-0">
												{#if classItem.avatarUrl}
													<img
														src={classItem.avatarUrl}
														alt="{classItem.name} Logo"
														class="h-10 w-10 rounded-lg object-cover border-2 border-neutral-200"
													/>
												{:else}
													<div class="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center border-2 border-primary-200">
														<span class="text-sm font-medium text-primary-600">
															{classItem.name.charAt(0)}
														</span>
													</div>
												{/if}
											</div>
											<div class="ml-4">
												<div class="flex items-center">
													<p class="text-sm font-medium text-primary-600 truncate">{classItem.name}</p>
													{#if classItem.isActive}
														<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
															Active
														</span>
													{/if}
												</div>
												<div class="mt-1 flex items-center text-sm text-neutral-500">
													<span>Grade {classItem.grade}</span>
													<span class="mx-2">•</span>
													<span>{classItem.students?.length || 0} student{(classItem.students?.length || 0) !== 1 ? 's' : ''}</span>
													<span class="mx-2">•</span>
													<span>Created {formatDate(classItem.createdAt)}</span>
												</div>
											</div>
										</div>
										<div class="flex items-center space-x-2">
											{#if classItem.students && classItem.students.length > 0}
												<div class="flex -space-x-1 overflow-hidden">
													{#each classItem.students.slice(0, 3) as student}
														<div class="inline-block h-6 w-6 rounded-full bg-neutral-300 ring-2 ring-white">
															<div class="h-full w-full rounded-full bg-primary-500 flex items-center justify-center">
																<span class="text-xs font-medium text-white">
																	{getInitials(student.name)}
																</span>
															</div>
														</div>
													{/each}
													{#if classItem.students.length > 3}
														<div class="inline-block h-6 w-6 rounded-full bg-neutral-100 ring-2 ring-white flex items-center justify-center">
															<span class="text-xs font-medium text-neutral-500">
																+{classItem.students.length - 3}
															</span>
														</div>
													{/if}
												</div>
											{:else}
												<span class="text-xs text-neutral-400">No students</span>
											{/if}
											<svg class="h-5 w-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
											</svg>
										</div>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

	<!-- Create Class Drawer -->
	<Drawer 
		bind:open={showCreateClassDrawer} 
		position="right" 
		size="md"
		title="Create New Class"
	>
		<div class="space-y-6">
			<div>
				<label for="className" class="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
				<input 
					id="className" 
					type="text" 
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
					placeholder="e.g., Grade 3A"
				/>
			</div>
			<div>
				<label for="grade" class="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
				<select 
					id="grade" 
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="">Select grade...</option>
					<option value="1">Grade 1</option>
					<option value="2">Grade 2</option>
					<option value="3">Grade 3</option>
					<option value="4">Grade 4</option>
					<option value="5">Grade 5</option>
				</select>
			</div>
			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
				<textarea 
					id="description" 
					rows="3" 
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
					placeholder="Brief description of this class..."
				></textarea>
			</div>
			<div class="flex justify-end space-x-3 pt-4">
				<Button variant="outline" onclick={() => showCreateClassDrawer = false}>
					Cancel
				</Button>
				<Button variant="solid" color="primary">
					Create Class
				</Button>
			</div>
		</div>
	</Drawer>

	<!-- Quick Actions Drawer -->
	<Drawer 
		bind:open={showQuickActionsDrawer} 
		position="right" 
		size="sm"
		title="Quick Actions"
	>
		<div class="space-y-4">
			<button
				onclick={() => window.location.href = '/students/register'}
				class="w-full flex items-center p-4 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
			>
				<Users class="h-6 w-6 text-success-500 mr-3" />
				<div>
					<h3 class="font-medium text-neutral-900">Add Students</h3>
					<p class="text-sm text-neutral-500">Register new students to your classes</p>
				</div>
			</button>

			<button
				onclick={() => window.location.href = '/qr-codes'}
				class="w-full flex items-center p-4 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
			>
				<BarChart3 class="h-6 w-6 text-primary-500 mr-3" />
				<div>
					<h3 class="font-medium text-neutral-900">Generate QR Codes</h3>
					<p class="text-sm text-neutral-500">Create QR codes for student login</p>
				</div>
			</button>

			<button
				onclick={() => showCreateClassDrawer = true && (showQuickActionsDrawer = false)}
				class="w-full flex items-center p-4 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
			>
				<BookOpen class="h-6 w-6 text-secondary-500 mr-3" />
				<div>
					<h3 class="font-medium text-neutral-900">Create Class</h3>
					<p class="text-sm text-neutral-500">Set up a new class for your students</p>
				</div>
			</button>
		</div>
	</Drawer>