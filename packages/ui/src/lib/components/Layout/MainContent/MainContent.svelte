<script lang="ts">
  import { useLayoutContext } from '../utils/layoutContext.svelte.js';

  interface Props {
    children?: import('svelte').Snippet;
    title?: string;
    subtitle?: string;
    headerActions?: Array<{
      id: string;
      label: string;
      icon?: any;
    }>;
    class?: string;
    padding?: string;
  }
  
  let {
    children,
    title,
    subtitle,
    headerActions,
    class: className = '',
    padding = 'p-4'
  }: Props = $props();

  // Get layout context to react to sidebar state
  const layout = useLayoutContext();
</script>

<!-- Main Content Area - matches layout-debug structure -->
<div class="transition-all duration-300 ease-in-out w-full {layout?.sidebar.isCollapsed ? 'lg:ml-16' : 'lg:ml-64'} md:ml-16">
  <div class="min-h-screen md:ml-8 pt-20 md:pt-4 px-3 py-4 md:p-4 relative">
    
    <!-- Content Container -->
    <div class="bg-white p-3 md:p-8 xl:p-12 rounded-2xl {className}">

			<div class="max-w-8xl mx-auto">

				<!-- Header -->
				{#if title || subtitle}
					<div class="mb-8 mt-4">
						<div class="mb-6">
							{#if title}
								<h1 class="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
							{/if}
							{#if subtitle}
								<h2 class="text-hero text-xl text-gray-600">{subtitle}</h2>
							{/if}
						</div>
					</div>
				{/if}
				
				<!-- Content -->
				<div class="{padding}">
					{#if children}
						{@render children()}
					{/if}
				</div>
			</div>
      
    </div>
  </div>
</div>