<!-- App.svelte -->
<script>
  import { Bell, Folder, Heart, Home, Mail, PanelRightClose, PanelRightOpen, Search, Settings, User } from 'lucide-svelte';
  
  // Runes for state management
  let isMobileMenuOpen = $state(false);
  let isDesktopCollapsed = $state(false);
  
  // Tooltip state management
  let activeTooltip = $state(null);
  let tooltipPosition = $state({ x: 0, y: 0 });
  
  // Menu items matching navbar.gallery structure
  const menuItems = [
    { icon: Home, label: 'All Types', href: '#', isActive: true },
    { icon: Search, label: 'Static', href: '#' },
    { icon: Folder, label: 'Dropdown', href: '#' },
    { icon: Bell, label: 'Mega Menu', href: '#' },
    { icon: Mail, label: 'Side Bar', href: '#' },
    { icon: Search, label: 'Search Bar', href: '#' },
    { icon: Settings, label: 'Announcement', href: '#' },
    { icon: Heart, label: 'Full Screen', href: '#' },
    { icon: User, label: 'Breadcrumbs', href: '#' }
  ];
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
  
  // Toggle desktop sidebar collapse
  function toggleDesktopSidebar() {
    isDesktopCollapsed = !isDesktopCollapsed;
  }
  
  // Close mobile menu
  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
  
  // Tooltip functions
  function showTooltip(event, label) {
    if (!isDesktopCollapsed) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    tooltipPosition = {
      x: rect.right + 8,
      y: rect.top + rect.height / 2
    };
    activeTooltip = label;
  }
  
  function hideTooltip() {
    activeTooltip = null;
  }
</script>


<div class="wrapper bg-gray-100 mx-auto w-full flex font-family-primary ">
	<!-- Desktop Sidebar - Dynamic width with collapse toggle (lg+) -->
	<aside id="Sidebar" class="navbar fixed inset-y-4 z-50  mx-4 rounded-2xl shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] overflow-hidden   hidden lg:flex lg:flex-col bg-gray-300/30 backdrop-blur-md text-white transition-all duration-300 ease-in-out {isDesktopCollapsed ? 'lg:w-16' : 'lg:w-64'}" style="">
		<div class="flex flex-col flex-1 min-h-0">
			
			<!-- Header -->
			<div class="">
				<div class=" flex items-center justify-between h-16 px-4 bg-white/10">
					<a href="/" aria-current="page" class="hide-text w-inline-block w--current flex items-center {isDesktopCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} transition-all duration-200">
						<div class="text-size-regular text-gray-700 no-wrap text-xl font-semibold whitespace-nowrap">SparkLabs</div>
					</a>

					<div class="">
						<button
							onclick={toggleDesktopSidebar}
							class="p-2 flex items-center justify-center rounded hover:bg-gray-500/10 transition-colors"
							aria-label="Toggle sidebar"
						>	
							{#if isDesktopCollapsed}
								<PanelRightClose class="w-5 h-5 text-gray-600" />
								{:else}
								<PanelRightOpen class="w-5 h-5 text-gray-600" />
							{/if}
							<!-- <Menu class="w-5 h-5 text-gray-600" /> -->
						</button>
					</div>

				</div>
				<div class=" border-t  border-gray-500/20 w-full h-px"></div>
			</div>
			
			<!-- Navigation Links -->
			<div class="nav__links flex-1 px-2 py-6 space-y-1 overflow-y-auto">
				{#each menuItems as item}
					<div class="relative group">
						<a 
							href={item.href}
							class=" group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 {item.isActive ? 'bg-gray-300/20 text-gray-900 border border-gray-500/20' : 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-900'}"
							onmouseenter={(e) => showTooltip(e, item.label)}
							onmouseleave={hideTooltip}
						>
							<div class="mr-3 w-6 h-6 bg-gray-300/70 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
								<div class="flex items-center justify-center">
									<svelte:component this={item.icon} class="w-4 h-4" />
								</div>
							</div>
							<div class="hide-text is--nav flex-1 {isDesktopCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} transition-all duration-200">
								<p class="mb-0 whitespace-nowrap">{item.label}</p>
							</div>
						</a>
					</div>
				{/each}
				
				<!-- Additional Links Section -->
				<div class=" flex flex-col space-y-1 mt-8 pt-4 border-t border-gray-500/20 {isDesktopCollapsed ? 'hidden' : 'block'}">
					<div class=" text-gray-500 py-2 px-3 text-sm hover:text-gray-700  transition-colors cursor-pointer">About</div>
					<div class=" text-gray-500 py-2 px-3 text-sm hover:text-gray-700 transition-colors cursor-pointer">Submit</div>
				</div>
			</div>
			
			<!-- Footer -->
			<div class="flex-shrink-0 p-4  space-y-4 {isDesktopCollapsed ? 'px-2' : 'px-4'}">
				<div class=" border-t  border-gray-500/20 w-full h-px mb-4"></div>

				<div class="w-full {isDesktopCollapsed ? 'h-12' : 'h-20'} bg-gray-300/30 backdrop-blur-3xl rounded-lg border border-gray-500/20 flex items-center justify-center text-gray-500 text-sm transition-all duration-200">
					{isDesktopCollapsed ? 'Ad' : 'Sponsored Ad Space'}
				</div>

				<div class="flex items-center {isDesktopCollapsed ? 'gap-0 ' : 'gap-3  '}">
					<div class="w-12 h-12 bg-gray-300/80 border border-gray-500/20 rounded-full overflow-hidden ">
						<!-- Avatar -->
					</div>

					<div class="overflow-hidden {isDesktopCollapsed ? 'w-0 hidden' : 'w-auto '}}">
						<p class="text-gray-800 mb-0.5 text-sm " >Teacher Name</p>
						<span class="text-gray-500 text-xs">teacher@email.com</span>
					</div>

				</div>
			</div>
			
		</div>
	</aside>
	
	<!-- Tablet Sidebar - Collapsed to icons (md to lg) -->
	<div class="navbar fixed inset-y-4  mx-4 shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)]  rounded-2xl overflow-hidden  z-50 hidden md:flex lg:hidden md:w-16 md:flex-col bg-gray-300/30  backdrop-blur-md text-white">
		<div class="flex flex-col flex-1 min-h-0">
			
			<!-- Header - Icon only -->
			<div class="">
				<div class="flex items-center justify-center h-16 bg-white/10">
					<div class="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
						<span class="text-gray-800 font-bold text-sm">S</span>
					</div>
				</div>
				<div class="border-t border-gray-500/20  w-full h-px"></div>
			</div>
			
			<!-- Navigation - Icons only with tooltips -->
			<div class="nav__links flex-1 px-2 py-6 space-y-1 overflow-y-scroll overflow-x-hidden">
				{#each menuItems as item}
					<div class="relative group">
						<a 
							href={item.href}
							class="flex items-center justify-center p-3 rounded-lg transition-colors duration-200 {item.isActive ? 'bg-gray-300/20 text-gray-900 border border-gray-500/20' : 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-900'}"
						>
							<div class="w-6 h-6 bg-gray-300/70 rounded flex items-center justify-center">
								<svelte:component this={item.icon} class="w-4 h-4" />
							</div>
						</a>
						
						<!-- Tooltip -->
						<div class="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-white/90 backdrop-blur-md text-gray-800 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap border border-white/70 shadow-lg">
							{item.label}
							<div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/90 border-l border-b border-white/70 rotate-45"></div>
						</div>
					</div>
				{/each}
			</div>
			
			<!-- Footer - Compact -->
			<div class="flex-shrink-0 p-2 space-y-4">
				<div class=" border-t  border-gray-500/20 w-full h-px mb-4"></div>

				<div class=" w-12 h-12 bg-gray-300/30 backdrop-blur-3xl rounded border border-gray-500/20 flex items-center justify-center">
					<span class="text-gray-500 text-xs">Ad</span>
				</div>

				<div class="flex items-center {isDesktopCollapsed ? 'gap-0 ' : 'gap-3  '}">
					<div class="w-12 h-12 bg-gray-300/80 border border-gray-500/20 rounded-full overflow-hidden ">
						<!-- Avatar -->
					</div>
				</div>
			</div>
			
		</div>
	</div>
	
	<!-- Mobile Navigation Bar (md:hidden) -->
	<div class="md:hidden fixed top-0 left-0 right-0 z-30 bg-gray-300/30 backdrop-blur-md border border-white/30 rounded-2xl m-4 shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)]">
		<div class="flex items-center justify-between h-16 px-6">
			<div class="text-gray-800 text-xl font-semibold">SparkLabs</div>
			<button
				onclick={toggleMobileMenu}
				class="p-2 rounded-lg  hover:bg-gray-500/10  transition-colors flex items-center justify-center"
				aria-label="Toggle navigation"
			>
				{#if isMobileMenuOpen}
					<PanelRightClose class="w-5 h-5 text-gray-600" />
				{:else}
					<PanelRightOpen class="w-5 h-5 text-gray-600" />
				{/if}
			</button>
		</div>
	</div>
	
	<!-- Mobile Menu Overlay -->
	<div class=" md:hidden fixed inset-0 z-40 {isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}">
		<!-- Backdrop - only visible when menu is open -->
		{#if isMobileMenuOpen}
			<div 
				class="fixed inset-0 bg-white/5  transition-opacity duration-300 ease-in-out"
				onclick={closeMobileMenu}
			></div>
		{/if}
		
		<!-- Mobile Sidebar Panel -->
		<div class="navbar fixed inset-y-0 left-0 w-80 bg-gray-300/30 backdrop-blur-3xl text-white transform transition-transform duration-300 ease-in-out shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}">
			<div class="flex flex-col h-full">
				
				<!-- Navigation - No header duplication -->
				<div class="nav__links flex-1 px-3 py-6 space-y-1 overflow-y-auto">
					{#each menuItems as item}
						<a 
							href={item.href}
							onclick={closeMobileMenu}
							class=" group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 {item.isActive ? 'bg-gray-300/20 text-gray-900 border border-gray-500/20' : 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-900'}"
						>
							<div class=" mr-3 w-6 h-6 bg-gray-300/70  rounded flex items-center justify-center">
								<div class="">
									<svelte:component this={item.icon} class="w-4 h-4" />
								</div>
							</div>
							<div class="hide-text is--nav flex-1">
								<p class="mb-0">{item.label}</p>
							</div>
						</a>
					{/each}
					
					<!-- Mobile Additional Links -->
					<div class="flex flex-col space-y-1 mt-8 pt-4 border-t border-gray-500/20">
						<div class=" text-gray-500 py-3 px-3 text-sm hover:text-gray-700 transition-colors cursor-pointer">About</div>
						<div class=" text-gray-500 py-3 px-3 text-sm hover:text-gray-700 transition-colors cursor-pointer">Submit</div>
						
					</div>
				</div>
				
				<!-- Footer -->
				<div class="flex-shrink-0 p-4 space-y-4 border-t border-gray-500/20 ">
					<div class=" w-full h-32bg-gray-300/30 backdrop-blur-3xl rounded-lg border border-gray-500/20 flex items-center justify-center p-4 text-gray-500 text-sm">
						<div class="text-center">
							<div class="font-semibold text-gray-800 mb-2">Never run out of design inspiration again.</div>
							<div class="text-xs">Featuring over 1,200 iOS, Android & Web apps on Mobbin.com</div>
						</div>
					</div>

					<div class="flex items-center {isDesktopCollapsed ? 'gap-0 ' : 'gap-3  '}">
						<div class="w-12 h-12 bg-gray-300/80 border border-gray-500/20 rounded-full overflow-hidden ">
							<!-- Avatar -->
						</div>
						<div class="overflow-hidden {isDesktopCollapsed ? 'w-0 hidden' : 'w-auto '}}">
							<p class="text-gray-800 mb-0.5 text-sm " >Teacher Name</p>
							<span class="text-gray-500 text-xs">teacher@email.com</span>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>


	
	
	<!-- Main Content Area -->
	<div class=" transition-all duration-300 ease-in-out  {isDesktopCollapsed ? 'lg:ml-16' : 'lg:ml-64'} md:ml-16">
		<div class="min-h-screen   md:ml-8  pt-24 md:pt-4 p-4 relative">


			<!-- Sticky header optional for actions -->
			<!-- <div class="w-full sticky inset-4  md:inset-4 rounded-2xl overflow-hidden max-width max-w-7xl mx-auto bg-white px-4 md:px-8 xl:px-12 min-h-12 mb-4 py-4 ">  
				<h2 class="leading-4 text-md py-2">Action Bar</h2>
			</div> -->
			
			<!-- Content Container -->
			<div class="max-width max-w-7xl mx-auto bg-white p-4 md:p-8 xl:p-12 rounded-2xl ">
				
				<!-- Header -->
				<div class="mb-8 mt-4">
					<div class=" mb-6">
						<h1 class="text-4xl font-bold text-gray-900 mb-4">Responsive Sidebar Demo</h1>
						<h2 class="text-hero text-xl text-gray-600">
							Recreating the navbar.gallery sidebar behavior with desktop collapse toggle, tablet icon view, and mobile top bar navigation.
						</h2>
					</div>
					
					<div class="mt_2 g_1 mb-1 flex gap-4">
						<button class="button is--white bg-white text-gray-900 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
							Subscribe
						</button>
						<button class="button bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
							Submit
						</button>
					</div>
				</div>
				
				<!-- Responsive Behavior Cards -->
				<div class="">
					<div class="work_list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
						
						<!-- Desktop Card -->
						<div class="work_item bg-white rounded-lg p-6 shadow-sm border border-gray-200">
							<div class="work_content-wrap">
								<div class="work_title-wrap mb-4">
									<div class="work_title text-xl font-semibold text-gray-900">Desktop (1024px+)</div>
								</div>
								<p class="text-gray-600 mb-4">
									Sidebar with hamburger toggle - expands to 16rem or collapses to 4rem with tooltips.
								</p>
								<div class="individual-card-details">
									<span class="text-sm text-gray-500">• Toggle between 256px/64px width</span>
									<span class="text-sm text-gray-500">• Hamburger button in header</span>
									<span class="text-sm text-gray-500">• Smooth animations</span>
								</div>
							</div>
						</div>
						
						<!-- Tablet Card -->
						<div class="work_item bg-white rounded-lg p-6 shadow-sm border border-gray-200">
							<div class="work_content-wrap">
								<div class="work_title-wrap mb-4">
									<div class="work_title text-xl font-semibold text-gray-900">Tablet (768-1023px)</div>
								</div>
								<p class="text-gray-600 mb-4">
									Fixed collapsed sidebar with 4rem width, icons only with hover tooltips.
								</p>
								<div class="individual-card-details">
									<span class="text-sm text-gray-500">• Fixed 64px width</span>
									<span class="text-sm text-gray-500">• Icons only</span>
									<span class="text-sm text-gray-500">• Hover tooltips</span>
								</div>
							</div>
						</div>
						
						<!-- Mobile Card -->
						<div class="work_item bg-white rounded-lg p-6 shadow-sm border border-gray-200">
							<div class="work_content-wrap">
								<div class="work_title-wrap mb-4">
									<div class="work_title text-xl font-semibold text-gray-900">Mobile (0-767px)</div>
								</div>
								<p class="text-gray-600 mb-4">
									Top navigation bar with title and hamburger menu triggering slide-out sidebar.
								</p>
								<div class="individual-card-details">
									<span class="text-sm text-gray-500">• Horizontal top bar</span>
									<span class="text-sm text-gray-500">• Slide-out overlay sidebar</span>
									<span class="text-sm text-gray-500">• Full mobile navigation</span>
								</div>
							</div>
						</div>
						
					</div>
				</div>
				
				<!-- Sample Content Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{#each Array(12) as _, i}
						<div class=" bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
							<div class="">
								<div class="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
									<span class="text-gray-500 font-medium">Item {i + 1}</span>
								</div>
								<div class="p-4">
									<div class="">
										<div class=" font-semibold text-gray-900 mb-2">Content Block {i + 1}</div>
									</div>
									<p class="text-gray-600 text-sm">Sample placeholder content demonstrating the responsive grid layout.</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
				
			</div>
		</div>
	</div>
</div>

<!-- Tooltip Portal -->
{#if activeTooltip && isDesktopCollapsed}
	<div 
		class="fixed z-[200] px-3 py-2 bg-white/95 backdrop-blur-md text-gray-800 text-sm rounded-lg border border-white/70 shadow-xl whitespace-nowrap pointer-events-none"
		style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px; transform: translateY(-50%);"
	>
		{activeTooltip}
		<div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/95 border-l border-b border-white/70 rotate-45"></div>
	</div>
{/if}




<style>

	 /* Custom scrollbar for sidebar */
  .navbar, .nav__links {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  .navbar::-webkit-scrollbar, .nav__links::-webkit-scrollbar {
    width: 0px;
    display: none; /* Safari and Chrome */
  }
  
  .navbar::-webkit-scrollbar-track, .nav__links::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .navbar::-webkit-scrollbar-thumb, .nav__links::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
  }
  
  .navbar::-webkit-scrollbar-thumb:hover, .nav__links::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
	.wrapper {
		/* background-image: url(https://img.freepik.com/free-vector/gradient-comic-book-city-background_52683-156231.jpg?t=st=1758609210~exp=1758612810~hmac=b27bb287f3bfde5d06658e09a1435b60e01f66f9f87aa95d57820c446f9e2f21&w=2000); */
		background-repeat: no-repeat;
		background-size: cover;
		/* background-color: #EEF5E5; */
	}

	:global(html, body ){
		background-color: var(--color-gray-100);
	}
	
</style> 