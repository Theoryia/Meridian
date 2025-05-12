<script lang="ts">
  import { onMount } from 'svelte';
  import { DateTime } from 'luxon';
  
  // --- Types ---
  interface TimeDisplay {
    time: string;
    date: string;
    full: string;
    timezone: string;
    userLocalTime?: TimeDisplay;
  }
  
  interface AirportInfo {
    isValid: boolean;
    error?: string;
    code?: string;
    region?: string;
    timezone?: string;
  }
  
  // --- Form Inputs with Better Defaults ---
  const now = DateTime.local();
  let departureIcao = "";
  let arrivalIcao = "";
  let departureDateStr = now.toISODate() || "";
  let departureTimeStr = now.toFormat('HH:mm');
  let flightLength = "";
  
  // --- Validation and Display States ---
  let departureInfo: AirportInfo | null = null;
  let arrivalInfo: AirportInfo | null = null;
  let departureTimeDisplay: TimeDisplay | null = null;
  let arrivalTimeDisplay: TimeDisplay | null = null;
  let userLocalTimeDisplay: TimeDisplay | null = null;
  let distance_km: number = 0;
  
  // --- Theme Styles ---
  let departureCardStyle = "";
  let arrivalCardStyle = "";
  
  // --- Loading and Error States ---
  let isLoadingFlightTime = false;
  let flightTimeError = "";
  
  // --- Data Maps ---
  // Moved the large data objects to the bottom of the script section for better readability
  
  // --- Core Functions ---
  
  // Format flight length input to ensure proper format
  function formatFlightLength(input: string): string {
    input = input.replace(/[^0-9:]/g, '');
    
    if (/^\d{1,2}$/.test(input)) return `${input}:00`;
    if (/^\d{1,2}:$/.test(input)) return `${input}00`;
    if (/^\d{1,2}:[0-5]$/.test(input)) return `${input}0`;
    if (/^\d{1,2}:[0-5][0-9]$/.test(input)) return input;
    
    if (/^\d{3,4}$/.test(input)) {
      return input.length === 3 ? 
        `${input[0]}:${input.slice(1)}` : 
        `${input.slice(0, 2)}:${input.slice(2)}`;
    }
    
    return input;
  }
  
  // Process ICAO code and return airport info
  function processIcao(icao: string): AirportInfo | null {
    if (!icao) return null;
    
    icao = icao.toUpperCase();
    
    if (!/^[A-Z]{4}$/.test(icao)) {
      return { isValid: false, error: "Must be 4 uppercase letters" };
    }
    
    let region: string | null = null;
    let timezone: string | null = null;

    // Check for two-letter prefix first, then single letter
    if (icaoRegions[icao.substring(0, 2)]) {
      region = icaoRegions[icao.substring(0, 2)];
      timezone = regionTimezones[icao.substring(0, 2)];
    } else if (icaoRegions[icao.charAt(0)]) {
      region = icaoRegions[icao.charAt(0)];
      timezone = regionTimezones[icao.charAt(0)];
    }
    
    return {
      isValid: true,
      code: icao,
      region: region || "Unknown region",
      timezone: timezone || "UTC"
    };
  }
  
  // Fetch flight time from API
  async function fetchFlightTime(): Promise<void> {
    if (!departureIcao || !arrivalIcao || !departureInfo?.isValid || !arrivalInfo?.isValid) {
      return;
    }
    
    try {
      isLoadingFlightTime = true;
      flightTimeError = '';
      
      const response = await fetch(`http://127.0.0.1:5000/flight-time?departure=${departureIcao}&arrival=${arrivalIcao}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store the distance from the API response
      distance_km = data.distance_km;
      
      // Format the flight time from the API response [hours, minutes] to "HH:MM"
      const [hours, minutes] = data.flight_time;
      flightLength = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Recalculate times with the new flight length
      calculateTimes();
      
    } catch (error) {
      console.error("Failed to fetch flight time:", error);
      flightTimeError = "Couldn't fetch flight time";
    } finally {
      isLoadingFlightTime = false;
    }
  }
  
  // --- Event Handlers ---
  function handleFlightLengthInput(): void {
    flightLength = formatFlightLength(flightLength);
    calculateTimes();
  }
  
  function updateDepartureInfo(): void {
    departureInfo = processIcao(departureIcao);
    
    // Try to fetch flight time if both airports are valid
    if (departureInfo?.isValid && arrivalInfo?.isValid) {
      fetchFlightTime();
    } else {
      calculateTimes();
    }
  }
  
  function updateArrivalInfo(): void {
    arrivalInfo = processIcao(arrivalIcao);
    
    // Try to fetch flight time if both airports are valid
    if (departureInfo?.isValid && arrivalInfo?.isValid) {
      fetchFlightTime();
    } else {
      calculateTimes();
    }
  }
  
  function updateDepartureDateTime(): void {
    calculateTimes();
  }
  
  // --- Main Calculation Logic ---
  function calculateTimes(): void {
    if (!departureInfo?.isValid || !arrivalInfo?.isValid || !departureDateStr || !departureTimeStr || !flightLength) {
      return;
    }

    try {
      // Parse flight length
      const [hours, minutes] = flightLength.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return;
      
      const flightLengthMinutes = (hours * 60) + minutes;
      
      // Calculate times with proper timezone handling
      const departureDateTime = DateTime.fromISO(`${departureDateStr}T${departureTimeStr}:00`, {
        zone: departureInfo.timezone || "UTC"
      });
      
      const arrivalDateTime = departureDateTime
        .plus({ minutes: flightLengthMinutes })
        .setZone(arrivalInfo.timezone || "UTC");
      
      // Calculate user's local time at arrival
      const userLocalArrivalTime = arrivalDateTime.toLocal();
      
      // Calculate user's local time at departure (different!)
      const userLocalDepartureTime = departureDateTime.toLocal();
      
      // Format displays
      departureTimeDisplay = formatTimeDisplay(departureDateTime);
      arrivalTimeDisplay = formatTimeDisplay(arrivalDateTime);
      
      // Store user's local time at arrival for the main display
      userLocalTimeDisplay = formatTimeDisplay(userLocalArrivalTime, true);
      
      // Set time-based styles
      departureCardStyle = getTimeBasedStyle(departureDateTime.hour);
      arrivalCardStyle = getTimeBasedStyle(arrivalDateTime.hour);
      
      // Additional property for departure card
      departureTimeDisplay.userLocalTime = formatTimeDisplay(userLocalDepartureTime, true);
      
    } catch (error) {
      console.error("Error calculating times:", error);
    }
  }
  
  // --- Helper Functions ---
  function formatTimeDisplay(dt: DateTime, isLocal = false): TimeDisplay {
    return {
      time: dt.toFormat('EEE h:mm a'),
      date: dt.toFormat('d LLL yyyy'),
      full: dt.toFormat('EEE h:mm a - d LLL yyyy'),
      timezone: isLocal ? (DateTime.local().zoneName || "Local") : (dt.zoneName || "UTC")
    };
  }
  
  // Get time-based background style
  function getTimeBasedStyle(hour: number): string {
    // Night (9PM-5AM)
    if (hour >= 21 || hour < 5) {
      return "background: linear-gradient(135deg, #0f172a, #312e81); border-color: #4f46e5;";
    } 
    // Dawn (5AM-8AM)
    else if (hour >= 5 && hour < 8) {
      return "background: linear-gradient(135deg, #92400e, #b45309); border-color: #f59e0b;";
    } 
    // Morning (8AM-11AM)
    else if (hour >= 8 && hour < 11) {
      return "background: linear-gradient(135deg, #2563eb, #3b82f6); border-color: #60a5fa;";
    }
    // Midday (11AM-4PM)
    else if (hour >= 11 && hour < 16) {
      return "background: linear-gradient(135deg, #0284c7, #06b6d4); border-color: #22d3ee;";
    }
    // Afternoon (4PM-7PM)
    else if (hour >= 16 && hour < 19) {
      return "background: linear-gradient(135deg, #ea580c, #ef4444); border-color: #f87171;";
    }
    // Dusk (7PM-9PM)
    else {
      return "background: linear-gradient(135deg, #452164, #5B2260); border-color: #48134F;";
    }
  }
  
  // --- Data --- 
  // ICAO region prefixes
  const icaoRegions: Record<string, string> = {
    "A": "South/Western Asia", "B": "Iceland, Greenland", "C": "Canada", 
    "D": "West Africa", "E": "Northern Europe", "ED": "Germany", 
    "EG": "United Kingdom", "EH": "Netherlands", "EI": "Ireland", 
    "F": "Central Africa", "G": "Western Africa", "H": "Northeast Africa", 
    "K": "United States", "L": "Southern Europe", "LF": "France", 
    "M": "Central America", "N": "Pacific", "O": "Southwest Asia", 
    "P": "Eastern Pacific", "R": "East Asia", "S": "South America", 
    "T": "Caribbean", "U": "Russia, Former USSR", "V": "South/Southeast Asia", 
    "W": "Southeast Asia", "Y": "Australia", "Z": "East Asia"
  };
  
  // Time zone estimates by region
  const regionTimezones: Record<string, string> = {
    "A": "Asia/Dubai", "B": "Atlantic/Reykjavik", "C": "America/Toronto", 
    "D": "Africa/Lagos", "E": "Europe/London", "ED": "Europe/Berlin", 
    "EG": "Europe/London", "EH": "Europe/Amsterdam", "EI": "Europe/Dublin", 
    "F": "Africa/Kinshasa", "G": "Africa/Accra", "H": "Africa/Cairo", 
    "K": "America/New_York", "L": "Europe/Rome", "LF": "Europe/Paris", 
    "M": "America/Mexico_City", "N": "Pacific/Honolulu", "O": "Asia/Karachi", 
    "P": "Pacific/Guam", "R": "Asia/Tokyo", "S": "America/Sao_Paulo", 
    "T": "America/Port_of_Spain", "U": "Europe/Moscow", "V": "Asia/Bangkok", 
    "W": "Asia/Jakarta", "Y": "Australia/Sydney", "Z": "Asia/Shanghai"
  };
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
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

  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-6 text-center">Long Haul Sync</h1>
    
    <div class="bg-slate-800/40 rounded-xl p-6 max-w-5xl mx-auto">
      <p class="text-slate-300 mb-8 text-center">
        Plan your long-haul flights and monitor local times across different time zones.
      </p>
      
      <!-- Flight Planning Form -->
      <div class="mb-12 p-8 bg-slate-700/30 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-8 text-center">Flight Planner</h2>
        
        <form class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Airport Inputs Row -->
            <div class="space-y-2">
              <label for="departure" class="block text-sm font-medium text-slate-300">
                Departure Airport (ICAO)
              </label>
              <input 
                type="text" 
                id="departure" 
                bind:value={departureIcao} 
                on:input={updateDepartureInfo}
                placeholder="EGLL"
                class="w-full px-4 py-3 rounded-md bg-slate-700 border border-slate-600 
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                      {departureInfo && !departureInfo.isValid ? 'border-red-500' : ''}"
                maxlength="4"
              />
              <div class="h-12">
                {#if departureInfo && !departureInfo.isValid}
                  <p class="text-red-400 text-sm">{departureInfo.error}</p>
                {:else if departureInfo && departureInfo.isValid}
                  <p class="text-green-400 text-sm">Region: {departureInfo.region}</p>
                  <p class="text-slate-400 text-xs">Timezone: {departureInfo.timezone?.replace('_', ' ') ?? 'Unknown timezone'}</p>
                {/if}
              </div>
            </div>
            
            <div class="space-y-2">
              <label for="arrival" class="block text-sm font-medium text-slate-300">
                Arrival Airport (ICAO)
              </label>
              <input 
                type="text" 
                id="arrival" 
                bind:value={arrivalIcao}
                on:input={updateArrivalInfo}
                placeholder="YSSY"
                class="w-full px-4 py-3 rounded-md bg-slate-700 border border-slate-600 
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                      {arrivalInfo && !arrivalInfo.isValid ? 'border-red-500' : ''}"
                maxlength="4"
              />
              <div class="h-12">
                {#if arrivalInfo && !arrivalInfo.isValid}
                  <p class="text-red-400 text-sm">{arrivalInfo.error}</p>
                {:else if arrivalInfo && arrivalInfo.isValid}
                  <p class="text-green-400 text-sm">Region: {arrivalInfo.region}</p>
                  <p class="text-slate-400 text-xs">Timezone: {arrivalInfo.timezone?.replace('_', ' ') ?? 'Unknown timezone'}</p>
                {/if}
              </div>
            </div>
            
            <!-- Time Inputs Row -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-300">
                Departure Time
              </label>
              <div class="grid grid-cols-2 gap-2">
                <input 
                  type="date" 
                  bind:value={departureDateStr}
                  on:change={updateDepartureDateTime}
                  class="px-4 py-3 rounded-md bg-slate-700 border border-slate-600 
                        text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="time" 
                  bind:value={departureTimeStr}
                  on:change={updateDepartureDateTime}
                  step="60"
                  class="px-4 py-3 rounded-md bg-slate-700 border border-slate-600 
                        text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p class="text-slate-400 text-xs h-12">Local time at departure airport</p>
            </div>
            
            <!-- Flight Length Input - Now read-only by default -->
            <div class="space-y-2">
              <label for="flight-length" class="block text-sm font-medium text-slate-300 flex justify-between">
                <span>Flight Length</span>
                {#if departureInfo?.isValid && arrivalInfo?.isValid}
                  <button 
                    type="button" 
                    on:click={fetchFlightTime}
                    class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Refresh from API
                  </button>
                {/if}
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  id="flight-length"
                  bind:value={flightLength}
                  placeholder="Calculating..."
                  class="w-full px-4 py-3 rounded-md bg-slate-700 border border-slate-600 
                        text-white placeholder-slate-400 focus:outline-none {flightTimeError ? 'border-red-400' : 'border-green-600'}"
                  readonly
                />
                {#if isLoadingFlightTime}
                  <div class="absolute right-3 top-3">
                    <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                {/if}
              </div>
              <div class="h-12">
                {#if flightTimeError}
                  <p class="text-red-400 text-xs">{flightTimeError}</p>
                {:else if distance_km && distance_km > 0}
                  <p class="text-slate-300 text-xs">Distance: ~{Math.round(distance_km)} km</p>
                {:else}
                  <p class="text-slate-400 text-xs">Flight time will be calculated automatically</p>
                {/if}
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Results Display -->
      {#if departureTimeDisplay && arrivalTimeDisplay && userLocalTimeDisplay && departureInfo && arrivalInfo}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <!-- Departure Time Box - More compact -->
          <div style={departureCardStyle} class="p-5 rounded-xl border-2 shadow-lg text-white">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold">Departure</h3>
              <div class="flex items-center space-x-3">
                <span class="text-slate-300 text-xs">Duration: {flightLength}</span>
                <div class="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-bold">
                  {departureInfo.code}
                </div>
              </div>
            </div>
            
            <div class="flex items-end justify-between">
              <div>
                <div class="text-3xl font-bold mb-1">{departureTimeDisplay.time}</div>
                <div class="text-lg opacity-90 -mt-1">{departureTimeDisplay.date}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-white/70">{departureInfo.region}</div>
                <div class="text-xs text-white/70">{departureInfo.timezone?.replace('_', ' ')}</div>
              </div>
            </div>
            
            <div class="mt-2 pt-2 border-t border-white/20">
              <div class="flex items-center justify-between">
                <div class="text-white/70 text-xs">Your local time:</div>
                <div class="text-white/90 text-sm">{departureTimeDisplay.userLocalTime?.time}</div>
              </div>
            </div>
          </div>
          
          <!-- Arrival Time Box - More compact -->
          <div style={arrivalCardStyle} class="p-5 rounded-xl border-2 shadow-lg text-white">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold">Arrival</h3>
              <div class="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-bold">
                {arrivalInfo.code}
              </div>
            </div>
            
            <div class="flex items-end justify-between">
              <div>
                <div class="text-3xl font-bold mb-1">{arrivalTimeDisplay.time}</div>
                <div class="text-lg opacity-90 -mt-1">{arrivalTimeDisplay.date}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-white/70">{arrivalInfo.region}</div>
                <div class="text-xs text-white/70">{arrivalInfo.timezone?.replace('_', ' ')}</div>
              </div>
            </div>
            
            <div class="mt-2 pt-2 border-t border-white/20">
              <div class="flex items-center justify-between">
                <div class="text-white/70 text-xs">Your local time:</div>
                <div class="text-white/90 text-sm flex items-center">
                  {userLocalTimeDisplay.time}
                  <div class="w-2 h-2 rounded-full bg-green-400 ml-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="bg-slate-800/50 text-center rounded-xl p-6 my-4 border border-slate-700">
          <div class="text-slate-400">Enter flight details above to calculate times</div>
        </div>
      {/if}
    </div>
  </div>
</div>