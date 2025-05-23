<script>
  let sidebarOpen = false;
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <!-- Navigation -->
  <nav class="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800/80">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Meridian</span>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-8">
            <a href="#about" class="text-slate-300 hover:text-white transition-colors">About</a>
            <a href="/long-haul-sync" class="text-slate-300 hover:text-white transition-colors">Long Haul Sync</a>
            <a href="#compatibility" class="text-slate-300 hover:text-white transition-colors">Compatibility</a>
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
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out {sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
      on:click={toggleSidebar}
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
          <a href="#about" class="text-slate-300 hover:text-white transition-colors py-2">About</a>
          <a href="/long-haul-sync" class="text-slate-300 hover:text-white transition-colors py-2">Long Haul Sync</a>
          <a href="#compatibility" class="text-slate-300 hover:text-white transition-colors py-2">Compatibility</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Hero Section -->
  <header class="container mx-auto px-4 py-16 md:py-24">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
        Meridian
      </h1>
      <p class="text-xl md:text-2xl text-slate-300 mb-10">
        A flight simulation tool for long haul pilots
      </p>
    </div>
  </header>

  <!-- Feature Cards -->
  <section id="features" class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <!-- Feature 1 -->
      <a href="/long-haul-sync" class="bg-slate-800/40 rounded-xl p-6 hover:bg-slate-800/80 transition-all group">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold group-hover:text-blue-400 transition-colors">Long Haul Sync</h3>
        </div>
        <p class="text-slate-400 group-hover:text-slate-300">Calculate time zones and flight times for long-haul trips.</p>
      </a>
      
      <!-- NEW Feature: Route-Match -->
      <a href="/route-match" class="bg-slate-800/40 rounded-xl p-6 hover:bg-slate-800/80 transition-all group">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold group-hover:text-green-400 transition-colors">Route Match</h3>
        </div>
        <p class="text-slate-400 group-hover:text-slate-300">Find suitable routes based on your aircraft type and specifications.</p>
      </a>
      
      <!-- Feature placeholder -->
      <div class="bg-slate-800/20 rounded-xl p-6 flex items-center justify-center">
        <span class="text-slate-500">More features coming soon</span>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="container mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold mb-6">About Meridian</h2>
      <p class="text-slate-300 mb-4">
        A browser-based flight simulation assistant designed for long-haul pilots. Meridian runs directly in your browser and integrates with popular flight simulators.
      </p>
    </div>
  </section>

  <!-- Compatibility Section -->
  <section id="compatibility" class="container mx-auto px-4 py-16 bg-slate-800/30">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-8">Compatible Simulators</h2>
      <div class="flex flex-wrap justify-center gap-8">
        <div class="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center">MSFS</div>
        <div class="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center">X-Plane</div>
        <div class="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center">P3D</div>
        <div class="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center">FSX</div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-800 py-8">
    <div class="container mx-auto px-4 text-center text-slate-500">
      <p>© 2025 Meridian</p>
    </div>
  </footer>
</div>