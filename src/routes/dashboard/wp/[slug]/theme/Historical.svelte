<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/stores';

    interface HistoricalData {
        [key: string]: string;
    }

    interface FormattedHistoricalData {
        [key: string]: string;
    }

    const keyMappings: { [key: string]: string } = {
        today: 'Today',
        yesterday: 'Yesterday',
        last_week: 'Last Week',
        all_time: 'All Time',
    };

    let slug = '';
    let historicalData: HistoricalData = {};
    let formattedHistoricalData: FormattedHistoricalData = {};
    let isLoading = true;
    let apiUrl = '';
    let isDataReady = false;

    $: slug = $page.params.slug;
    $: apiUrl = `https://api.wpmonitor.dev/wp-json/wpmonitor/v1/wp/themes/${slug}/stats`;

    $: if (slug) {
        isLoading = true;
        checkCachedData();
    }

    onMount(() => {
        checkCachedData();
    });

    async function checkCachedData() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedData = sessionStorage.getItem(`wp:theme:${slug}_historical`);
            if (storedData) {
                historicalData = JSON.parse(storedData);
                formatData();
                isLoading = false;
                isDataReady = true;
            } else {
                await fetchData();
            }
        }
    }

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Request error: ${response.status}`);
            }
            const data = await response.json();
            historicalData = data;
            sessionStorage.setItem(`wp:theme:${slug}_historical`, JSON.stringify(data));
            formatData();
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isLoading = false;
        }
    }

    function formatData() {
        formattedHistoricalData = {};
        for (const [key, value] of Object.entries(historicalData)) {
            formattedHistoricalData[key] = parseInt(value).toLocaleString('en-US'); // Додаємо форматоване значення до нового об'єкта
        }
    }
</script>

{#if Object.keys(formattedHistoricalData).length > 0}
    {#each Object.entries(formattedHistoricalData) as [key, formattedSumm]}
        <div class="rounded border bg-white shadow">
            <div class="p-4 flex flex-row items-center justify-between">
                <div class="tracking-tight text-sm font-medium">{keyMappings[key] || key}</div>
                <div class="font-bold">{formattedSumm}</div>
            </div>
        </div>
    {/each}
{/if}
