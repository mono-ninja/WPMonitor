<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/stores';

    let slug = '';
    let isLoading = true;
    let apiUrl = '';
    let itemData = {};
    let transformedData = {};
    let isDataReady = false;
    let notice = 0;
    let noticeColor = '#0000ee'

    $: slug = $page.params.slug;
    $: apiUrl = `https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&slug=${slug}`;

    $: if (slug) {
        isLoading = true;
        checkCachedData();
    }

    onMount(() => {
        checkCachedData();
    });

    async function checkCachedData() {

        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedData = sessionStorage.getItem(`wp:plugin:${slug}_info`);
            if (storedData) {
                itemData = JSON.parse(storedData);
                transformData();
                isLoading = false;
                isDataReady = true;
                return;
            }
        }
        await fetchData();

    }

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Request error: ${response.status}`);
            }
            const data = await response.json();
            itemData = data;

            if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(`wp:plugin:${slug}_info`, JSON.stringify(data));
            }
            transformData();
            isDataReady = true;
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isLoading = false;
        }
    }

    function transformData() {
        transformedData = {};

        if (itemData && typeof itemData === 'object') {
            let rating = (parseInt(itemData.rating) / 100 * 5).toFixed(2);
            let updated = formatDateToISO(itemData.last_updated);
            let install = parseInt(itemData.active_installs).toLocaleString('en-US');
            checkUpdate(itemData.last_updated);


            transformedData = {
                name: itemData.name,
                install: install,
                version: itemData.version,
                link: itemData.homepage,
                rating: rating,
                updated: updated,
                added: itemData.added,
                support: itemData.support_threads,
                resolved: itemData.support_threads_resolved,
            };
        }
    }

    function formatDateToISO(dateString: any) {
        const date = new Date(dateString);
        const userLocale = navigator.language;
        return date.toLocaleDateString(userLocale, {day: '2-digit', month: '2-digit', year: 'numeric'});
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
            notice = 1;
        } else if (diffInWeeks > 6) {
            notice = 2;
        } else {
            notice = 0;
        }
    }
</script>

{#if isDataReady}

    <a href="https://wordpress.org/plugins/{slug}/" target="_blank"
       class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200">
        <span class:bg-primary-200={notice === 0} class:bg-yellow-100={notice === 1} class:bg-red-100={notice === 2}
              class="text-xs rounded-full px-2 py-1.5 mr-3">{transformedData['updated']}</span> <span
            class="text-sm font-medium">Plugin Page</span>
        <svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"></path>
        </svg>
    </a>

    <hgroup class="flex flex-col gap-2">
        <h1 class="font-bold text-base">{@html transformedData['name']}</h1>
    </hgroup>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">

        <div class="rounded border bg-white shadow">
            <div class="p-4 flex flex-row items-center justify-between">
                <div class="tracking-tight text-sm font-medium">Installs</div>
                <div class="font-bold">{transformedData['install']}</div>
            </div>
        </div>

        <div class="rounded border bg-white shadow">
            <div class="p-4 flex flex-row items-center justify-between">
                <div class="tracking-tight text-sm font-medium">Version</div>
                <div class="font-bold">{transformedData['version']}</div>
            </div>
        </div>

        <div class="rounded border bg-white shadow">
            <div class="p-4 flex flex-row items-center justify-between">
                <div class="tracking-tight text-sm font-medium">Rating</div>
                <div class="font-bold">{transformedData['rating']}</div>
            </div>
        </div>

        <div class="rounded border bg-white shadow">
            <div class="p-4 flex flex-row items-center justify-between">
                <div class="tracking-tight text-sm font-medium">Support</div>
                <div class="font-bold"><span class="text-green-500">{transformedData['resolved']}</span>
                    / {transformedData['support']}</div>
            </div>
        </div>

    </div>


{:else}

    <div role="status" class="max-w-sm animate-pulse">
        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
        <span class="sr-only">Loading...</span>
    </div>


{/if}