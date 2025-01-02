<script lang="ts">

    import {wpStore, addItem, removeItem} from '$lib/stores/wpStore';
    import {get} from 'svelte/store';
    import {onMount} from 'svelte';

    interface WPItem {
        name: string;
        type: 'plugin' | 'theme';
        keywords: string;
    }

    let wpItems: { [key: string]: WPItem } = {};
    let apiUrl = '';
    let results: any = {};
    let isReady = false;
    let notice = 0;
    let downloadsData: { [key: string]: any } = {};

    $: apiUrl = `https://api.wpmonitor.dev/wp-json/wpmonitor/v1/plugin-ranking`;

    wpStore.subscribe((value) => {
        wpItems = value;
    });

    onMount(async () => {
        wpItems = get(wpStore);
        if (Object.keys(wpItems).length > 0) {
            await checkCachedData();
        }

    });

    async function checkCachedData() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedData = sessionStorage.getItem(`wpPlugin:info`);
            if (storedData) {
                results = JSON.parse(storedData);
            } else {
                await fetchAllData();
            }
            isReady = true;
        }
    }

    async function fetchAllData() {
        const filteredData = Object.fromEntries(
            Object.entries(wpItems).filter(([key, value]) => value.type === "plugin")
        );

        if (Object.keys(filteredData).length === 0) {
            return;
        }

        for (const [slug, data] of Object.entries(filteredData)) {

            const response = await fetch(`${apiUrl}/${slug}`);
            if (!response.ok) throw new Error('Error fetching data');
            const info = await response.json();
            let isNegativeRanking = false;
            let isNegativePosition = false;
            let trendRanking = info.trend_7d.ranking;
            let trendPosition = info.trend_7d.position;
            let last_updated = info.last_updated;

            if (trendRanking < 0) {
                isNegativeRanking = true;
                trendRanking = trendRanking * -1;
            }

            if (trendPosition < 0) {
                isNegativePosition = true;
                trendPosition = trendPosition * -1;
            }

            results[slug] = data;
            results[slug]['installs'] = parseInt(info.installs).toLocaleString();
            results[slug]['ranking'] = parseInt(info.ranking).toLocaleString();
            results[slug]['position'] = parseInt(info.position).toLocaleString();
            results[slug]['count_installs'] = parseInt(info.count_installs).toLocaleString();
            results[slug]['isNegativeRanking'] = isNegativeRanking;
            results[slug]['trendRanking'] = trendRanking;
            results[slug]['isNegativePosition'] = isNegativePosition;
            results[slug]['trendPosition'] = trendPosition;
            results[slug]['notice'] = checkUpdate(last_updated);

        }

    }

    function checkUpdate(updated: string) {
        const referenceDate: any = new Date(updated);

        const currentDate: any = new Date();

        // Calculate the difference in milliseconds
        const diffInMillis = currentDate - referenceDate;

        // Calculate the difference in weeks
        const oneWeekInMillis = 1000 * 60 * 60 * 24 * 7;
        const diffInWeeks = diffInMillis / oneWeekInMillis;

        if (diffInWeeks >= 4 && diffInWeeks <= 6) {
            return 1;
        } else if (diffInWeeks > 6) {
            return 2;
        } else {
            return 0;
        }
    }


</script>

<div class="rounded-xl border bg-white shadow ">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
                <h5 class="mr-3 font-semibold dark:text-white">Plugins</h5>
            </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Installs
                </th>
                <th scope="col" class="px-6 py-3">
                    Ranking
                </th>
                <th scope="col" class="px-6 py-3">
                    Position
                </th>
                <th scope="col" class="px-6 py-3">
                    Details
                </th>
            </tr>
            </thead>
            <tbody>
            {#if isReady}
                {#each Object.entries(results) as [slug, item]}
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap inline-flex gap-2 items-center">
                            <span class="flex w-2 h-2 rounded-full" class:bg-primary-200={item.notice === 0} class:bg-yellow-100={item.notice === 1} class:bg-red-100={item.notice === 2}></span>
                            {item.name}
                        </th>
                        <td class="px-6 py-4 text-gray-700">
                            {item.installs}
                        </td>
                        <td class="px-6 py-4 text-gray-700">
                            # {item.ranking}
                            <span class="inline-flex ml-2 items-center text-xs gap-1 {item.isNegativePosition ?
                            'text-red-600' : 'text-green-600'}">
                                <svg class="w-2 h-2 " class:rotate-180={item.isNegativePosition} aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                                </svg>
                                {item.trendPosition}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-primary-500">{item.position}</span> / <span
                                class="text-gray-800">{item.count_installs}</span>
                            <span class="inline-flex ml-2 items-center text-xs gap-1 {item.isNegativeRanking ?
                            'text-red-600' : 'text-green-600'}">
                                <svg class="w-2 h-2 " class:rotate-180={item.isNegativeRanking} aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
                                </svg>
                                {item.trendRanking}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <a href="/dashboard/wp/{slug}/plugin/"
                               class="font-medium text-blue-600 dark:text-blue-500 hover:underline" target="_blank">View</a>
                        </td>
                    </tr>
                {/each}
            {:else }
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <div class="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            loading...
                        </div>
                    </th>
                    <td class="px-6 py-4 text-gray-700">
                        <div class="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            loading...
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-700">
                        <div class="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            loading...
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-700">
                        <div class="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            loading...
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-700">
                        <div class="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            loading...
                        </div>
                    </td>
                </tr>
            {/if}
            </tbody>
        </table>
    </div>
</div>