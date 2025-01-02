<script lang="ts">

    import Line from './ApexCharts.svelte';
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import Historical from "./Historical.svelte";

    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';

    interface DownloadsData {
        [key: string]: number;
    }

    let chartOptions = [
        {label: "Last 7 days", value: "7_days"},
        {label: "Last 15 days", value: "15_days"},
        {label: "Last 30 days", value: "1_month"},
        {label: "Last 90 days", value: "3_months"},
        {label: "Last year", value: "1_year"},
    ];


    let selectedChart: any = chartOptions[3];
    selectedChart = chartOptions.find((option) => option.value === $page.url.searchParams.get('filterDownloads')) || chartOptions[3];


    let slug = '';
    let downloadsData: DownloadsData = {};
    let isLoading = true;
    let isDataReady = false;
    let series: any = {};
    let categories: any = [];
    let apiUrl = '';
    let filterDownloads: any = '';
    const userLocale = navigator.language;

    $: filterDownloads = $page.url.searchParams.get('filterDownloads');
    $: slug = $page.params.slug;
    $: apiUrl = `https://api.wpmonitor.dev/wp-json/wpmonitor/v1/wp/themes/${slug}/downloads`;

    $: if (slug) {
        isLoading = true;
        selectedChart = chartOptions[3];
        checkCachedData();
    }

    onMount(async () => {
        await checkCachedData();
    });


    async function checkCachedData() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedData = sessionStorage.getItem(`wp:theme:${slug}_downloads`);
            if (storedData) {
                downloadsData = JSON.parse(storedData);
                generateChartData();
                isLoading = false;
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
            downloadsData = data;
            sessionStorage.setItem(`wp:theme:${slug}_downloads`, JSON.stringify(data));
            generateChartData();
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isLoading = false;
        }
    }

    function calculateMidnightUTC(): number {
        const now = new Date();
        const nextMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
        return nextMidnightUTC.getTime();
    }

    function generateChartData() {
        const data = downloadsData;

        let labelsIn = Object.keys(data);

        let labels = labelsIn.map(labelIn => formatDate(labelIn));
        let values = Object.values(data);

        if (filterDownloads === '7_days') {
            labels = labels.slice(-7);
            values = values.slice(-7);
        }

        if (filterDownloads === '15_days') {
            labels = labels.slice(-15);
            values = values.slice(-15);
        }

        if (filterDownloads === '1_month') {
            labels = labels.slice(-30);
            values = values.slice(-30);
        }

        if (filterDownloads === '3_months' || !filterDownloads) {
            labels = labels.slice(-90);
            values = values.slice(-90);
        }

        series = [
            {name: 'Downloads', data: values},
        ];

        categories = labels;

        const monthlyData = groupDataByMonth(data);


        isDataReady = true;
    }

    function groupDataByMonth(data: DownloadsData) {
        return Object.entries(data).reduce((acc, [date, value]) => {
            // Витягуємо місяць у форматі "YYYY-MM"
            const yearMonth = date.slice(0, 7);

            // Створюємо об'єкт Date і форматуємо його у "MMM yyyy"
            const formattedMonth = new Date(yearMonth + '-01').toLocaleDateString(userLocale, {
                month: 'short',
                year: 'numeric'
            });

            // Перетворюємо value у число і додаємо до відповідного місяця
            acc[formattedMonth] = (acc[formattedMonth] || 0) + Number(value);

            return acc;
        }, {} as Record<string, number>); // Зазначаємо тип вихідного об'єкта
    }

    function formatDate(dateStr:any) {
        const date = new Date(dateStr);


        return date.toLocaleDateString(userLocale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    function formatYearMonth(dateStr:any) {
        // Додаємо день, щоб створити об'єкт Date (припустимо, що це 1-ше число)
        const date = new Date(dateStr + '-01');

        // Повертаємо дату у форматі 'MMM yyyy' (наприклад, 'Oct 2024')
        return date.toLocaleDateString(userLocale, {
            month: 'short',
            year: 'numeric'
        });
    }

    function chartfilterDownloads(selectedfilterDownloads: string) {
        filterDownloads = selectedfilterDownloads;
        generateChartData();
        addParamToURL('filterDownloads', selectedfilterDownloads);
        selectedChart = chartOptions.find((option) => option.value === selectedfilterDownloads);
    }

    function addParamToURL(name: string, value: string) {
        // Create a new URL object based on the current URL
        const url = new URL($page.url);

        // Set the new parameter
        url.searchParams.set(name, value);

        // Use history.replaceState to update the URL without reloading the page
        history.replaceState(null, '', url);
    }

</script>

{#if isDataReady}
    <div class="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
        <div class="flex flex-wrap gap-4 justify-between pb-4 border-b ">
            <h5 class="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">Downloads</h5>
            <div>
                <Button color="alternative" size="sm">{selectedChart.label }<ChevronDownOutline class="w-6 h-6 ms-2 text-gray-900 dark:text-white" /></Button>
                <Dropdown>
                    {#each chartOptions as option}
                        <DropdownItem>
                            <button on:click={() => chartfilterDownloads(option.value)}
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white {option.value === selectedChart.value ? 'font-bold text-blue-600 dark:text-blue-400' : ''}">
                                {option.label}
                            </button>
                        </DropdownItem>
                    {/each}
                </Dropdown>
            </div>

        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Historical></Historical>
        </div>
        <Line {series} {categories}/>
    </div>

{/if}