<script lang="ts">
  import {
  	AppLayout,
  	Button,
  	Drawer,
  	MainContent,
  	Sidebar,
  	type NavigationSection
  } from '@educational-app/ui';
  import {
  	BarChart3,
  	Bell,
  	Edit,
  	FileText,
  	GraduationCap,
  	Search,
  	Share,
  	TrendingUp,
  	UserRoundCog,
  	Users
  } from 'lucide-svelte';
  import { onMount } from 'svelte';

  // Layout state
  let currentView = $state('overview');
  let drawerOpen = $state(false);
  
  // Sample navigation data (reactive) - using actual icon components
  let navigation = $derived([
    {
      title: 'Main',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: BarChart3,
          isActive: currentView === 'dashboard'
        },
        { 
          id: 'classes', 
          label: 'Classes', 
          icon: GraduationCap,
          badge: 3,
          isActive: currentView === 'classes'
        },
        { 
          id: 'students', 
          label: 'Students', 
          icon: Users,
          isActive: currentView === 'students'
        }
      ]
    },
    {
      title: 'Tools',
      items: [
        { 
          id: 'assignments', 
          label: 'Assignments', 
          icon: FileText,
          isActive: currentView === 'assignments'
        },
        { 
          id: 'reports', 
          label: 'Reports', 
          icon: TrendingUp,
          isActive: currentView === 'reports'
        }
      ]
    }
  ] as NavigationSection[]);
  
  // Header actions - using actual icon components
  const headerActions = [
    {
      id: 'search',
      label: 'Search',
      icon: Search
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: '5'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: UserRoundCog
    }
  ];
  
  // Sample data for testing
  const sampleCards = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: 'This is a sample card for testing responsive layouts.',
    status: ['Active', 'Pending', 'Complete'][i % 3],
    value: Math.floor(Math.random() * 100)
  }));
  
  // Test different screen sizes
  let currentBreakpoint = $state('desktop');
  let screenWidth = $state(1024);
  
  onMount(() => {
    function updateScreenInfo() {
      screenWidth = window.innerWidth;
      if (screenWidth < 768) currentBreakpoint = 'mobile';
      else if (screenWidth < 1024) currentBreakpoint = 'tablet';
      else if (screenWidth < 1440) currentBreakpoint = 'desktop';
      else currentBreakpoint = 'wide';
    }
    
    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    
    return () => window.removeEventListener('resize', updateScreenInfo);
  });
  
  function handleNavigation(item: any) {
    currentView = item.id;
    console.log('Navigate to:', item.id);
  }
</script>

<AppLayout theme="auto">
  <!-- Sidebar -->
  <Sidebar
    {navigation}
    brand={{ name: 'SparkLabs', logo: '🎓' }}
    footer={{
      user: {
        name: 'Bla Teacher',
        email: 'teacher@test.com',
        avatar: '👩‍🏫'
      },
      actions: [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'logout', label: 'Logout', icon: '🚪' }
      ]
    }}
    onNavigate={handleNavigation}
  />
  
  <!-- Main Content Area -->
  <MainContent
    title="Layout System Test"
    subtitle={`Current: ${currentBreakpoint} (${screenWidth}px)`}
    {headerActions}
  >
      <!-- Test Content -->
      <div class="space-y-8">
        <!-- Screen Size Indicator -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-900 mb-2">Current Breakpoint</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div class="p-3 rounded {currentBreakpoint === 'mobile' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}">
              <div class="font-medium">Mobile</div>
              <div class="text-gray-600">&lt; 768px</div>
            </div>
            <div class="p-3 rounded {currentBreakpoint === 'tablet' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}">
              <div class="font-medium">Tablet</div>
              <div class="text-gray-600">768px - 1024px</div>
            </div>
            <div class="p-3 rounded {currentBreakpoint === 'desktop' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}">
              <div class="font-medium">Desktop</div>
              <div class="text-gray-600">1024px - 1440px</div>
            </div>
            <div class="p-3 rounded {currentBreakpoint === 'wide' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}">
              <div class="font-medium">Wide</div>
              <div class="text-gray-600">&ge; 1440px</div>
            </div>
          </div>
        </div>
        
        <!-- Control Panel -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Layout Controls</h3>
          <div class="flex flex-wrap gap-4">
            <button 
              onclick={() => drawerOpen = !drawerOpen}
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {drawerOpen ? 'Close' : 'Open'} Drawer
            </button>
            
            <select 
              bind:value={currentView}
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="dashboard">Dashboard</option>
              <option value="classes">Classes</option>
              <option value="students">Students</option>
            </select>
          </div>
        </div>
        
        <!-- Sample Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5  gap-6">
          {#each sampleCards as card (card.id)}
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-gray-900">{card.title}</h4>
                <span class="px-2 py-1 text-xs font-medium rounded-full {
                  card.status === 'Active' ? 'bg-green-100 text-green-800' :
                  card.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }">
                  {card.status}
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-4">{card.description}</p>
              <div class="flex items-center justify-between">
                <div class="text-2xl font-bold text-blue-600">{card.value}%</div>
                <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </MainContent>
    
    <!-- Test Drawer -->
    <Drawer
      isOpen={drawerOpen}
      position="right"
      size="xl"
      title="Test Drawer"
      onClose={() => drawerOpen = false}
      headerActions={[
        { id: 'edit', label: 'Edit', icon: Edit },
        { id: 'share', label: 'Share', icon: Share }
      ]}
    >
      <div class="p-6 space-y-4">
        <h4 class="font-semibold text-gray-900">Drawer Content</h4>
        <p class="text-gray-600">
          This drawer slides in from the right and supports swipe gestures on mobile devices.
          Try swiping right to close it on touch devices.
        </p>
        
        <div class="space-y-3">
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-sm text-gray-900">Feature 1</div>
            <div class="text-xs text-gray-600">Working correctly ✅</div>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-sm text-gray-900">Feature 2</div>
            <div class="text-xs text-gray-600">Working correctly ✅</div>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-sm text-gray-900">Feature 3</div>
            <div class="text-xs text-gray-600">Working correctly ✅</div>
          </div>
        </div>
      </div>

      {#snippet footer()}
        <div class="flex justify-between items-center">
          <!-- Cancel button on the left -->
          <Button 
            size="sm"
            variant="ghost"
            onclick={() => drawerOpen = false}
          >
            Cancel
          </Button>
          
          <!-- Primary actions on the right -->
          <div class="flex items-center gap-3">
            <Button 
              size="sm"
              variant="outline"
              onclick={() => console.log('Secondary action')}
            >
              Secondary
            </Button>
            <Button 
              size="sm"
              variant="solid"
              color="primary"
              onclick={() => console.log('Primary action')}
            >
              Primary
            </Button>
          </div>
        </div>
      {/snippet}
    </Drawer>
</AppLayout>

<style>
  /* Test responsive text scaling */
  :global(.responsive-text-test) {
    font-size: 1rem;
  }
  
  @media (min-width: 768px) {
    :global(.responsive-text-test) {
      font-size: 1.125rem;
    }
  }
  
  @media (min-width: 1024px) {
    :global(.responsive-text-test) {
      font-size: 1.25rem;
    }
  }
</style>