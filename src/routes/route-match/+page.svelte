<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';

  let { data }: { data: PageData } = $props();
  
  // Filter state - using $state() for reactivity
  let airlineFilter = $state('');
  let departureFilter = $state('');
  let arrivalFilter = $state('');
  let aircraftTypeFilter = $state('');
  let minDistance = $state(0);
  let maxDistance = $state(10000);
  let shareMessage = $state('');
  let showShareMessage = $state(false);
  
  // Aircraft type options for filter dropdown
  const aircraftTypes = [
    { id: '', name: 'All Aircraft Types' },
    { id: 'B738', name: 'Boeing 737-800' },
    { id: 'A320', name: 'Airbus A320' },
    { id: 'B77W', name: 'Boeing 777-300ER' },
    { id: 'A359', name: 'Airbus A350-900' },
  ];
  
  // Reset all filters
  function resetFilters() {
    airlineFilter = '';
    departureFilter = '';
    arrivalFilter = '';
    aircraftTypeFilter = '';
    minDistance = 0;
    maxDistance = 10000;
  }
  
  // Share current filters
  async function shareFilters() {
    try {
      // Create a query string with current filters
      const params = new URLSearchParams();
      if (airlineFilter) params.set('airline', airlineFilter);
      if (departureFilter) params.set('departure', departureFilter);
      if (arrivalFilter) params.set('arrival', arrivalFilter);
      if (aircraftTypeFilter) params.set('aircraft', aircraftTypeFilter);
      if (minDistance > 0) params.set('minDist', minDistance.toString());
      if (maxDistance < 15000) params.set('maxDist', maxDistance.toString());
      
      // Generate the shareable URL
      const shareableUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      
      // Show success message
      shareMessage = 'Link copied to clipboard!';
      showShareMessage = true;
      
      // Hide message after 3 seconds
      setTimeout(() => {
        showShareMessage = false;
      }, 3000);
    } catch (e) {
      shareMessage = 'Failed to copy link';
      showShareMessage = true;
      
      setTimeout(() => {
        showShareMessage = false;
      }, 3000);
    }
  }
  
  // Load filters from URL if present
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('airline')) airlineFilter = params.get('airline') || '';
    if (params.has('departure')) departureFilter = params.get('departure') || '';
    if (params.has('arrival')) arrivalFilter = params.get('arrival') || '';
    if (params.has('aircraft')) aircraftTypeFilter = params.get('aircraft') || '';
    if (params.has('minDist')) minDistance = parseInt(params.get('minDist') || '0');
    if (params.has('maxDist')) maxDistance = parseInt(params.get('maxDist') || '10000');
  });
  
  // This will be replaced with actual data from your API
  let loading = $state(false);
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <!-- Navigation -->
  <nav class="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800/80">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          Meridian
        </a>
        <div class="flex items-center space-x-8">
          <a href="/" class="text-slate-300 hover:text-white transition-colors">Home</a>
        </div>
      </div>
    </div>
  </nav>

  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4 text-center">Route Match</h1>
    
    <div class="max-w-6xl mx-auto">
      <!-- Filter Panel -->
      <div class="bg-slate-800/60 rounded-lg p-4 mb-5 shadow-lg">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter Controls -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Airline</label>
              <input 
                type="text" 
                bind:value={airlineFilter}
                placeholder="Any airline" 
                class="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Departure (ICAO)</label>
              <input 
                type="text" 
                bind:value={departureFilter}
                placeholder="Any departure" 
                class="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Arrival (ICAO)</label>
              <input 
                type="text" 
                bind:value={arrivalFilter}
                placeholder="Any arrival" 
                class="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Aircraft Type</label>
              <select 
                bind:value={aircraftTypeFilter}
                class="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {#each aircraftTypes as option}
                  <option value={option.id}>{option.name}</option>
                {/each}
              </select>
            </div>
          </div>
          
          <!-- Distance Range -->
          <div class="w-full mt-2">
            <div class="flex justify-between mb-1">
              <label class="text-xs text-slate-400">Distance Range (km)</label>
              <div class="text-xs text-slate-300">
                {minDistance} - {maxDistance} km
              </div>
            </div>
            <div class="flex gap-3 items-center">
              <input 
                type="range" 
                bind:value={minDistance}
                min="0" 
                max={maxDistance} 
                step="100"
                class="w-1/2 accent-blue-500" 
              />
              <input 
                type="range" 
                bind:value={maxDistance}
                min={minDistance} 
                max="15000" 
                step="100"
                class="w-1/2 accent-blue-500" 
              />
            </div>
          </div>
          
          <!-- Filter Actions -->
          <div class="w-full flex justify-between gap-3 mt-3">
            <!-- Left side: Share button -->
            <button 
              on:click={shareFilters}
              class="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors flex items-center gap-2"
              title="Share current filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            
            <!-- Right side: Reset and Apply buttons -->
            <div class="flex gap-3">
              <button 
                on:click={resetFilters}
                class="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
              >
                Reset Filters
              </button>
              <button 
                class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Results Table -->
      <div class="bg-slate-800/60 rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-700/70 text-slate-300 text-sm">
              <tr>
                <th class="px-4 py-3">Airline</th>
                <th class="px-4 py-3">Departure</th>
                <th class="px-4 py-3">Arrival</th>
                <th class="px-4 py-3">Distance</th>
                <th class="px-4 py-3">Aircraft</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              {#if loading}
                <tr>
                  <td colspan="5" class="px-4 py-12 text-center">
                    <div class="inline-block w-8 h-8 border-2 border-slate-500 border-t-blue-500 rounded-full animate-spin"></div>
                  </td>
                </tr>
              {:else}
                <!-- Placeholder rows - will be replaced with actual data -->
                <tr class="text-slate-300 hover:bg-slate-700/40 transition-colors">
                  <td class="px-4 py-3 text-sm" colspan="5">No routes matching your criteria. Adjust filters or add routes.</td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
        
        <!-- Optional: Empty State with guidance text -->
        {#if !loading}
          <div class="p-6 text-center text-slate-400 border-t border-slate-700/50">
            Route data will appear here after your query is configured.
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Add this toast notification anywhere in your component (at the bottom) -->
{#if showShareMessage}
  <div class="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
    {shareMessage}
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards, fadeOut 0.3s ease-in forwards 2.7s;
  }
</style>