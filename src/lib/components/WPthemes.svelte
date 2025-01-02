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
            const storedData = sessionStorage.getItem(`wpThemes:info`);
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
            Object.entries(wpItems).filter(([key, value]) => value.type === "theme")
        );

        if (Object.keys(filteredData).length === 0) {
            return;
        }

        for (const [slug, data] of Object.entries(filteredData)) {
            results[slug] = data;
        }

    }



</script>

<div class="rounded-xl border bg-white shadow ">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
                <h5 class="mr-3 font-semibold dark:text-white">Themes</h5>
            </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Keywords
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
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {item.name}
                        </th>
                        <td class="keywords">
                            {item.keywords || 'No keywords added'}
                        </td>
                        <td class="px-6 py-4">
                            <a href="/dashboard/wp/{slug}/theme/"
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
                </tr>
            {/if}
            </tbody>
        </table>
    </div>
</div>