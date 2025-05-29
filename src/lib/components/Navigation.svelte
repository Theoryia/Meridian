<script>
  let { currentPage = "" } = $props();
  let sidebarOpen = false;
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  function isCurrentPage(page) {
    return currentPage === page;
  }
</script>

<!-- Navigation -->
<nav class="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800/80">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Meridian</a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="flex items-center space-x-8">
          <a 
            href="/long-haul-sync" 
            class="text-sm font-medium uppercase tracking-wider transition-colors {isCurrentPage('long-haul-sync') ? 'text-white' : 'text-slate-300 hover:text-white'}"
          >
            Long Haul Sync
          </a>
          <a 
            href="/route-match" 
            class="text-sm font-medium uppercase tracking-wider transition-colors {isCurrentPage('route-match') ? 'text-white' : 'text-slate-300 hover:text-white'}"
          >
            Route Match
          </a>
          <a 
            href="/#about" 
            class="text-sm font-medium uppercase tracking-wider transition-colors {isCurrentPage('about') ? 'text-white' : 'text-slate-300 hover:text-white'}"
          >
            About
          </a>
        </div>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          on:click={toggleSidebar} 
          aria-label="Toggle navigation menu"
          class="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>

<!-- Mobile Sidebar -->
<div class="md:hidden">
  <div 
    class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out {sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
    on:click={toggleSidebar}
    role="button"
    tabindex="-1"
  ></div>
  <div 
    class="fixed top-0 right-0 w-64 h-full bg-slate-800 z-50 transform transition-transform duration-300 ease-in-out {sidebarOpen ? 'translate-x-0' : 'translate-x-full'}"
  >
    <div class="p-5">
      <div class="flex justify-between items-center mb-6">
        <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Meridian</span>
        <button on:click={toggleSidebar} class="text-slate-400 hover:text-white" aria-label="Toggle sidebar">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex flex-col space-y-4">
        <a 
          href="/long-haul-sync" 
          class="py-2 uppercase text-sm font-medium tracking-wider transition-colors {isCurrentPage('long-haul-sync') ? 'text-white' : 'text-slate-300 hover:text-white'}"
        >
          Long Haul Sync
        </a>
        <a 
          href="/route-match" 
          class="py-2 uppercase text-sm font-medium tracking-wider transition-colors {isCurrentPage('route-match') ? 'text-white' : 'text-slate-300 hover:text-white'}"
        >
          Route Match
        </a>
        <a 
          href="/#about" 
          class="py-2 uppercase text-sm font-medium tracking-wider transition-colors {isCurrentPage('about') ? 'text-white' : 'text-slate-300 hover:text-white'}"
        >
          About
        </a>
      </div>
    </div>
  </div>
</div>