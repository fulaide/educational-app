<script lang="ts">
  import {
    AppLayout,
    Drawer,
    MainContent,
    ResponsiveContainer,
    Sidebar,
    type NavigationSection
  } from '@educational-app/ui';
  import { onMount } from 'svelte';
  
  // Layout state
  let sidebarOpen = $state(false);
  let drawerOpen = $state(false);
  let currentView = $state('snippets');
  let showCustomHeader = $state(true);
  let showGlobalFAB = $state(true);
  let showCustomFooter = $state(true);
  let showCustomNavigation = $state(false);
  
  // Sample navigation data (reactive) - can be completely overridden by snippets
  let navigation = $derived([
    {
      title: 'Main',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: '📊',
          isActive: currentView === 'dashboard'
        },
        { 
          id: 'classes', 
          label: 'Classes', 
          icon: '🎓',
          badge: '3',
          isActive: currentView === 'classes'
        },
        { 
          id: 'snippets', 
          label: 'Snippets Demo', 
          icon: '🧩',
          isActive: currentView === 'snippets'
        }
      ]
    },
    {
      title: 'Tools',
      items: [
        { 
          id: 'assignments', 
          label: 'Assignments', 
          icon: '📝',
          isActive: currentView === 'assignments'
        },
        { 
          id: 'reports', 
          label: 'Reports', 
          icon: '📈',
          isActive: currentView === 'reports'
        }
      ]
    }
  ] as NavigationSection[]);
  
  function handleNavigation(item: any) {
    currentView = item.id;
    console.log('Navigate to:', item.id);
  }
  
  function toggleOption(option: string) {
    switch(option) {
      case 'header':
        showCustomHeader = !showCustomHeader;
        break;
      case 'fab':
        showGlobalFAB = !showGlobalFAB;
        break;
      case 'footer':
        showCustomFooter = !showCustomFooter;
        break;
      case 'navigation':
        showCustomNavigation = !showCustomNavigation;
        break;
    }
  }
</script>

<AppLayout theme="auto">
  <!-- Global FAB snippet -->
  {#snippet globalActions()}
    {#if showGlobalFAB}
      <div class="flex flex-col gap-3">
        <button 
          class="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          onclick={() => alert('Quick Action 1!')}
          title="Quick Action 1"
        >
          ✨
        </button>
        <button 
          class="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          onclick={() => alert('Quick Action 2!')}
          title="Quick Action 2"
        >
          ➕
        </button>
      </div>
    {/if}
  {/snippet}
  
  <!-- Custom Sidebar with Snippet Injection -->
  <Sidebar
    {navigation}
    brand={{ name: 'Snippet Demo', logo: '🧩' }}
    footer={{
      user: {
        name: 'Demo Teacher',
        email: 'demo@example.com',
        avatar: '👨‍🏫'
      },
      actions: [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'logout', label: 'Logout', icon: '🚪' }
      ]
    }}
    onNavigate={handleNavigation}
  >
    <!-- Custom header snippet -->
    {#snippet beforeBrand()}
      <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-xs font-bold mr-3">
        v2
      </div>
    {/snippet}
    
    {#snippet afterBrand()}
      <div class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
        DEMO
      </div>
    {/snippet}
    
    <!-- Custom navigation content if enabled -->
    {#snippet beforeNavigation()}
      <div class="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg mx-4">
        <div class="flex items-center space-x-2 text-blue-700">
          <span class="text-sm">📢</span>
          <span class="text-xs font-medium">Custom navigation snippet injection!</span>
        </div>
      </div>
    {/snippet}
    
    {#snippet afterNavigation()}
      <div class="p-4 mt-4 mx-4">
        <div class="border-t border-gray-200 pt-4">
          <button 
            class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onclick={() => alert('Custom action!')}
          >
            <span>⚡</span>
            <span>Custom Action</span>
          </button>
        </div>
      </div>
    {/snippet}
    
    <!-- Completely custom footer -->
    {#snippet footerContent()}
      {#if showCustomFooter}
        <div class="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div class="text-center">
            <div class="text-sm font-medium">🎨 Custom Footer</div>
            <div class="text-xs opacity-90 mt-1">Injected via snippet</div>
            <button 
              class="mt-2 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs transition-colors"
              onclick={() => toggleOption('footer')}
            >
              Toggle Me
            </button>
          </div>
        </div>
      {/if}
    {/snippet}
  </Sidebar>
  
  <!-- Main Content with Custom Snippets -->
  <MainContent
    title="Flexible Snippet Injection Demo"
    subtitle="Demonstrating the power of Svelte 5 snippets for layout customization"
    showMobileHeader={true}
  >
    <!-- Custom header actions -->
    {#snippet headerActions()}
      {#if showCustomHeader}
        <div class="flex items-center space-x-2">
          <button 
            class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
            onclick={() => alert('Custom Header Action!')}
          >
            🎯 Custom Action
          </button>
          <button 
            class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
            onclick={() => toggleOption('header')}
          >
            🔄 Toggle
          </button>
        </div>
      {/if}
    {/snippet}
    
    <!-- Before content snippet -->
    {#snippet beforeContent()}
      <div class="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <div class="flex items-center space-x-2 text-green-700 mb-2">
          <span class="text-lg">🎉</span>
          <span class="font-semibold">Before Content Injection</span>
        </div>
        <p class="text-sm text-green-600">
          This content is injected before the main content area using the <code class="bg-green-100 px-1 rounded">beforeContent</code> snippet.
        </p>
      </div>
    {/snippet}
    
    <!-- Main content -->
    <div class="space-y-8">
      <!-- Controls -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">🎛️ Snippet Controls</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onclick={() => toggleOption('header')}
            class="p-3 rounded-lg border-2 transition-all {showCustomHeader ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}"
          >
            <div class="text-sm font-medium">Custom Header</div>
            <div class="text-xs text-gray-600 mt-1">{showCustomHeader ? '✅ Active' : '❌ Inactive'}</div>
          </button>
          
          <button 
            onclick={() => toggleOption('fab')}
            class="p-3 rounded-lg border-2 transition-all {showGlobalFAB ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}"
          >
            <div class="text-sm font-medium">Global FAB</div>
            <div class="text-xs text-gray-600 mt-1">{showGlobalFAB ? '✅ Active' : '❌ Inactive'}</div>
          </button>
          
          <button 
            onclick={() => toggleOption('footer')}
            class="p-3 rounded-lg border-2 transition-all {showCustomFooter ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}"
          >
            <div class="text-sm font-medium">Custom Footer</div>
            <div class="text-xs text-gray-600 mt-1">{showCustomFooter ? '✅ Active' : '❌ Inactive'}</div>
          </button>
          
          <button 
            onclick={() => toggleOption('navigation')}
            class="p-3 rounded-lg border-2 transition-all {showCustomNavigation ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}"
          >
            <div class="text-sm font-medium">Custom Navigation</div>
            <div class="text-xs text-gray-600 mt-1">{showCustomNavigation ? '✅ Active' : '❌ Inactive'}</div>
          </button>
        </div>
      </div>
      
      <!-- Snippet Examples -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">🧩 Available Snippet Injection Points</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- AppLayout Snippets -->
          <div class="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <h4 class="font-medium text-purple-900 mb-2">AppLayout</h4>
            <ul class="text-sm text-purple-700 space-y-1">
              <li>• <code>beforeLayout</code></li>
              <li>• <code>afterLayout</code></li>
              <li>• <code>overlay</code></li>
              <li>• <code>globalActions</code> ✅</li>
            </ul>
          </div>
          
          <!-- Sidebar Snippets -->
          <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 class="font-medium text-blue-900 mb-2">Sidebar</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• <code>headerContent</code></li>
              <li>• <code>beforeBrand</code> ✅</li>
              <li>• <code>afterBrand</code> ✅</li>
              <li>• <code>navigationContent</code></li>
              <li>• <code>beforeNavigation</code> ✅</li>
              <li>• <code>afterNavigation</code> ✅</li>
              <li>• <code>footerContent</code> ✅</li>
            </ul>
          </div>
          
          <!-- MainContent Snippets -->
          <div class="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 class="font-medium text-green-900 mb-2">MainContent</h4>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• <code>header</code></li>
              <li>• <code>beforeHeader</code></li>
              <li>• <code>afterHeader</code></li>
              <li>• <code>headerActions</code> ✅</li>
              <li>• <code>beforeContent</code> ✅</li>
              <li>• <code>afterContent</code></li>
              <li>• <code>loadingContent</code></li>
              <li>• <code>errorContent</code></li>
              <li>• <code>footer</code></li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Code Examples -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">💻 Usage Examples</h3>
        
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Custom Sidebar Header</h4>
            <pre class="text-sm text-gray-700 overflow-x-auto"><code>&lt;Sidebar&gt;
  &#123;#snippet beforeBrand()&#125;
    &lt;div class="version-badge"&gt;v2&lt;/div&gt;
  &#123;/snippet&#125;
  
  &#123;#snippet afterBrand()&#125;
    &lt;span class="demo-badge"&gt;DEMO&lt;/span&gt;
  &#123;/snippet&#125;
&lt;/Sidebar&gt;</code></pre>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Custom Header Actions</h4>
            <pre class="text-sm text-gray-700 overflow-x-auto"><code>&lt;MainContent&gt;
  &#123;#snippet headerActions()&#125;
    &lt;button class="custom-btn"&gt;Custom Action&lt;/button&gt;
  &#123;/snippet&#125;
&lt;/MainContent&gt;</code></pre>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Global Floating Actions</h4>
            <pre class="text-sm text-gray-700 overflow-x-auto"><code>&lt;AppLayout&gt;
  &#123;#snippet globalActions()&#125;
    &lt;button class="fab"&gt;+&lt;/button&gt;
  &#123;/snippet&#125;
&lt;/AppLayout&gt;</code></pre>
          </div>
        </div>
      </div>
      
      <!-- Sample Cards -->
      <ResponsiveContainer
        grid={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}
        gap={{ mobile: 'gap-4', tablet: 'gap-6' }}
        staggerChildren={true}
        staggerDelay={100}
      >
        {#each Array.from({ length: 8 }) as _, i}
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-900">Snippet Feature {i + 1}</h4>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Active
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              This card demonstrates how content flows naturally around injected snippets.
            </p>
            <div class="flex items-center justify-between">
              <div class="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 100)}%</div>
              <button 
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onclick={() => alert(`Clicked card ${i + 1}`)}
              >
                Interact →
              </button>
            </div>
          </div>
        {/each}
      </ResponsiveContainer>
    </div>
    
    <!-- After content snippet -->
    {#snippet afterContent()}
      <div class="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
        <div class="flex items-center space-x-2 text-orange-700 mb-2">
          <span class="text-lg">🏁</span>
          <span class="font-semibold">After Content Injection</span>
        </div>
        <p class="text-sm text-orange-600">
          This content appears after the main content area using the <code class="bg-orange-100 px-1 rounded">afterContent</code> snippet.
        </p>
      </div>
    {/snippet}
  </MainContent>
</AppLayout>

<style>
  code {
    font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: 0.875em;
  }
  
  pre {
    font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
    line-height: 1.5;
  }
  
  .version-badge {
    @apply flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-xs font-bold;
  }
  
  .demo-badge {
    @apply px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full;
  }
</style>