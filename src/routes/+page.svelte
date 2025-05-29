<script>
  import Navigation from '$lib/components/Navigation.svelte';
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
  <Navigation currentPage="home" />
  
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
      
      <!-- Feature 2: Route-Match -->
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
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="container mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold mb-6">About Meridian</h2>
      <p class="text-slate-300 mb-4">
        Meridian is a browser-based flight simulation assistant designed for long-haul pilots. It helps you plan and manage flights across multiple time zones, ensuring you stay in sync with departure and arrival schedules.
      </p>
      <p class="text-slate-300 mb-4">
        Built with modern web technologies, Meridian provides sophisticated tools for flight planning without requiring any software installation. It's perfect for pilots who want to optimize their flight simulation experience.
      </p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-auto border-t border-slate-800 py-8 bg-slate-900/50">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Meridian</span>
        </div>
        <div class="flex flex-wrap justify-center space-x-6">
          <a href="/" class="text-slate-400 hover:text-white transition-colors text-sm">Home</a>
          <a href="/long-haul-sync" class="text-slate-400 hover:text-white transition-colors text-sm">Long Haul Sync</a>
          <a href="/route-match" class="text-slate-400 hover:text-white transition-colors text-sm">Route Match</a>
          <a href="#about" class="text-slate-400 hover:text-white transition-colors text-sm">About</a>
        </div>
        <div class="mt-4 md:mt-0 text-slate-500 text-sm">
          © 2025 Meridian
        </div>
      </div>
    </div>
  </footer>
</div>