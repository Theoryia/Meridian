<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { RoutesData } from '$lib/types';

    const { data }: { data: RoutesData } = $props();

    // Filter state - using $state() for reactivity
    let airlineFilter = $state('');
    let departureFilter = $state('');
    let arrivalFilter = $state('');
    let aircraftTypeFilter = $state('');
    let minDistance = $state(0);
    let maxDistance = $state(10000);
    let includeCodeshares = $state(true);
    let shareMessage = $state('');
    let showShareMessage = $state(false);

    // Aircraft type options for filter dropdown
    const aircraftTypes = [
        { id: '', name: 'All Aircraft Types' },
        { id: 'B738', name: 'Boeing 737-800' },
        { id: 'A320', name: 'Airbus A320' },
        { id: 'B77W', name: 'Boeing 777-300ER' },
        { id: 'A359', name: 'Airbus A350-900' }
    ];

    // Reset all filters
    function resetFilters() {
        airlineFilter = '';
        departureFilter = '';
        arrivalFilter = '';
        aircraftTypeFilter = '';
        minDistance = 0;
        maxDistance = 10000;
        includeCodeshares = true;
    }

    let initialized = false;
    onMount(() => {
        initialized = true;
    });

    function applyFilters(
        airline = airlineFilter,
        departure = departureFilter,
        arrival = arrivalFilter,
        aircraft = aircraftTypeFilter,
        minDist = minDistance,
        maxDist = maxDistance,
        codeshares = includeCodeshares
    ) {
        if (!initialized) return;
        const params = new URLSearchParams();
        if (airline) params.set('airline', airline);
        if (departure) params.set('departure', departure);
        if (arrival) params.set('arrival', arrival);
        if (aircraft) params.set('aircraft', aircraft);
        if (minDist > 0) params.set('minDist', minDist.toString());
        if (maxDist < 15000) params.set('maxDist', maxDist.toString());
        params.set('codeshares', codeshares.toString());

        // This will trigger a navigation and reload the page data from the server
        goto(`?${params.toString()}`, {
            keepFocus: true,
            replaceState: false,
            noScroll: true
        });
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
            params.set('codeshares', includeCodeshares.toString());

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
        if (params.has('codeshares')) includeCodeshares = params.get('codeshares') === 'true';
    });

    // This will be replaced with actual data from your API
    let loading = $state(false);

    let expandedRoutes = $state<Record<string, boolean>>({});

    function toggleExpand(routeId: string | number) {
        expandedRoutes[routeId] = !expandedRoutes[routeId];
        expandedRoutes = { ...expandedRoutes }; // triggers Svelte reactivity
    }

    $effect(() => {
        applyFilters(
            airlineFilter,
            departureFilter,
            arrivalFilter,
            aircraftTypeFilter,
            minDistance,
            maxDistance,
            includeCodeshares
        );
    });
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-sm">
        <div class="container mx-auto px-4">
            <div class="flex h-16 items-center justify-between">
                <a
                    href="/"
                    class="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-xl font-bold text-transparent"
                >
                    Meridian
                </a>
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-slate-300 transition-colors hover:text-white">Home</a>
                </div>
            </div>
        </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
        <h1 class="mb-4 text-center text-3xl font-bold">Route Match</h1>

        <div class="mx-auto max-w-6xl">
            <!-- Filter Panel -->
            <div class="mb-5 rounded-lg bg-slate-800/60 p-4 shadow-lg">
                <div class="flex flex-wrap items-center gap-3">
                    <!-- Filter Controls -->
                    <div class="grid w-full grid-cols-1 gap-3 md:grid-cols-4">
                        <div>
                            <label for="airline-filter" class="mb-1 block text-xs text-slate-400"
                                >Airline</label
                            >
                            <input
                                id="airline-filter"
                                type="text"
                                bind:value={airlineFilter}
                                placeholder="Any airline"
                                class="w-full rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label for="departure-filter" class="mb-1 block text-xs text-slate-400"
                                >Departure (ICAO)</label
                            >
                            <input
                                id="departure-filter"
                                type="text"
                                bind:value={departureFilter}
                                placeholder="Any departure"
                                class="w-full rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label for="arrival-filter" class="mb-1 block text-xs text-slate-400"
                                >Arrival (ICAO)</label
                            >
                            <input
                                id="arrival-filter"
                                type="text"
                                bind:value={arrivalFilter}
                                placeholder="Any arrival"
                                class="w-full rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                                for="aircraft-type-filter"
                                class="mb-1 block text-xs text-slate-400">Aircraft Type</label
                            >
                            <select
                                id="aircraft-type-filter"
                                bind:value={aircraftTypeFilter}
                                class="w-full rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            >
                                {#each aircraftTypes as option}
                                    <option value={option.id}>{option.name}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <!-- Distance Range -->
                    <div class="mt-2 w-full">
                        <div class="mb-1 flex justify-between">
                            <label for="min-distance-filter" class="text-xs text-slate-400"
                                >Distance Range (km)</label
                            >
                            <div class="text-xs text-slate-300">
                                {minDistance} - {maxDistance} km
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <input
                                id="min-distance-filter"
                                type="range"
                                bind:value={minDistance}
                                min="0"
                                max={maxDistance}
                                step="100"
                                class="w-1/2 accent-blue-500"
                            />
                            <input
                                id="max-distance-filter"
                                type="range"
                                bind:value={maxDistance}
                                min={minDistance}
                                max="15000"
                                step="100"
                                class="w-1/2 accent-blue-500"
                            />
                        </div>
                    </div>

                    <!-- Codeshare Toggle -->
                    <div class="mt-3 w-full">
                        <div class="flex items-center justify-between">
                            <label for="codeshare-toggle" class="block text-xs text-slate-400"
                                >Include Codeshare Flights</label
                            >
                            <div class="relative inline-block w-12 align-middle select-none">
                                <input
                                    type="checkbox"
                                    id="codeshare-toggle"
                                    bind:checked={includeCodeshares}
                                    class="sr-only"
                                />
                                <label
                                    for="codeshare-toggle"
                                    class="block h-6 cursor-pointer overflow-hidden rounded-full bg-slate-700 transition-colors duration-200"
                                >
                                    <span
                                        class="dot block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out"
                                        class:translate-x-6={includeCodeshares}
                                    ></span>
                                </label>
                            </div>
                        </div>
                        <p class="mt-1 text-xs text-slate-500">
                            {includeCodeshares
                                ? 'Showing both operating and codeshare flights'
                                : 'Showing only operating flights'}
                        </p>
                    </div>

                    <!-- Filter Actions -->
                    <div class="mt-3 flex w-full justify-end gap-3">
                        <button
                            onclick={resetFilters}
                            class="rounded bg-slate-700 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-600"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            <!-- Results Table -->
            <div class="overflow-hidden rounded-lg bg-slate-800/60 shadow-lg">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-700/70 text-sm text-slate-300">
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
                                        <div
                                            class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-slate-500 border-t-blue-500"
                                        ></div>
                                    </td>
                                </tr>
                            {:else if data.routes.length}
                                {#each data.routes as route}
                                    <tr
                                        class="text-slate-300 transition-colors hover:bg-slate-700/40"
                                    >
                                        <td class="px-4 py-3 text-sm">
                                            <button
                                                class="mr-2 text-blue-400 hover:underline focus:outline-none"
                                                onclick={() => toggleExpand(route.route_id)}
                                                aria-expanded={expandedRoutes[route.route_id]
                                                    ? 'true'
                                                    : 'false'}
                                                aria-controls={'codeshare-' + route.route_id}
                                                style="font-size:1rem;"
                                            >
                                                {route.codeshares && route.codeshares.length
                                                    ? expandedRoutes[route.route_id]
                                                        ? '▼'
                                                        : '▶'
                                                    : ''}
                                            </button>
                                            {route.airline_name}
                                        </td>
                                        <td class="px-4 py-3 text-sm">{route.departure}</td>
                                        <td class="px-4 py-3 text-sm">{route.arrival}</td>
                                        <td class="px-4 py-3 text-sm">{route.distance}</td>
                                        <td class="px-4 py-3 text-sm">{route.aircraft_type}</td>
                                    </tr>
                                    {#if expandedRoutes[route.route_id] && route.codeshares && route.codeshares.length}
                                        <tr
                                            id={'codeshare-' + route.route_id}
                                            class="bg-slate-700/30"
                                        >
                                            <td colspan="5" class="px-8 py-2">
                                                <div class="text-xs text-slate-300">
                                                    <strong>Codeshare Airlines:</strong>
                                                    <ul class="ml-6 list-disc">
                                                        {#each route.codeshares as cs}
                                                            <li>{cs}</li>
                                                        {/each}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    {/if}
                                {/each}
                            {:else}
                                <tr>
                                    <td colspan="5" class="px-4 py-12 text-center">
                                        No routes matching your criteria. Adjust filters or add
                                        routes.
                                    </td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                </div>

                <!-- Optional: Empty State with guidance text -->
                {#if !loading}
                    <div class="border-t border-slate-700/50 p-6 text-center text-slate-400">
                        Route data will appear here after your query is configured.
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<!-- Add this toast notification anywhere in your component (at the bottom) -->
{#if showShareMessage}
    <div
        class="animate-fadeIn fixed right-4 bottom-4 flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white shadow-lg"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
            />
        </svg>
        {shareMessage}
    </div>
{/if}

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(10px);
        }
    }

    .animate-fadeIn {
        animation:
            fadeIn 0.3s ease-out forwards,
            fadeOut 0.3s ease-in forwards 2.7s;
    }

    /* Toggle button styling */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .dot {
        background-color: white;
    }

    input:checked + label {
        background-color: #4f46e5;
    }

    input:focus + label {
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
    }

    .translate-x-6 {
        transform: translateX(1.5rem);
    }
</style>
