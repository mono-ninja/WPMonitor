<script lang="ts">

    import Line from './ApexCharts.svelte';
    import {onMount} from 'svelte';
    import {page} from '$app/stores';

    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';


    interface RankingData {
        [key: string]: any;
    }

    let chartOptions = [
        {label: "Last 7 days", value: "7_days"},
        {label: "Last 15 days", value: "15_days"},
        {label: "Last 30 days", value: "1_month"},
    ];

    let selectedChart: any = chartOptions[0];
    selectedChart = chartOptions.find((option) => option.value === $page.url.searchParams.get('filter')) ||
        chartOptions[0];


    let slug = '';
    let rankingData: RankingData = {};
    let rankingOut: any = {};
    let lineChartData: any = [];
    let isLoading = true;
    let apiUrl = '';
    let isDataReady = false;
    let series: any = {};
    let categories: any = [];
    let reversed: boolean = true;
    let filter: any = '';
    let difference: number = 0;
    let diffPosition: number = 0;
    let isNegative = false;
    let isPositionNegative = false;
    $: filter = $page.url.searchParams.get('filter');

    $: slug = $page.params.slug;
    $: apiUrl = `https://api.wpmonitor.dev/wp-json/wpmonitor/v1/plugin-ranking/${slug}`;

    $: if (slug) {
        isDataReady = false;
        rankingData = {};
        rankingOut = {};
        series = {};
        categories = [];
        isLoading = true;
        isNegative = false;
        isPositionNegative = false;
        let difference = 0;
        let diffPosition= 0;
        selectedChart = chartOptions[0];
        checkCachedData();
    }

    onMount(() => {
        checkCachedData();
    });

    async function checkCachedData() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedData = sessionStorage.getItem(`wp:plugin:${slug}_ranking`);
            if (storedData) {
                rankingData = JSON.parse(storedData);
                ranking();
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
            rankingData = data;
            sessionStorage.setItem(`wp:plugin:${slug}_ranking`, JSON.stringify(data));
            ranking();

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isLoading = false;
        }
    }

    function ranking() {
        if (rankingData.code) {
            rankingOut = {
                ranking: 'No Information',
                position: 'No Information',
                category: '',
            };
            isDataReady = false;
        } else {
            rankingOut = {
                ranking: parseInt(rankingData.ranking).toLocaleString('en-US'),
                position: parseInt(rankingData.position).toLocaleString('en-US'),
                category: ' in ' + parseInt(rankingData.installs).toLocaleString('en-US'),
                plugins: parseInt(rankingData.count_installs).toLocaleString('en-US'),
            };
            isDataReady = true;
            generateChartData();
        }
    }

    function generateChartData() {
        isNegative = false;
        isPositionNegative = false;

        const data = rankingData.data;
        const dataPosition = rankingData.dataposition;

        let labelsIn = Object.keys(data);

        let labels = labelsIn.map(labelIn => formatDate(labelIn));
        let values = Object.values(data);

        let position = Object.values(dataPosition);

        if (!filter || filter === '7_days') {
            labels = labels.slice(-7);
            values = values.slice(-7);
            position = position.slice(-7);
        }

        if (filter === '15_days') {
            labels = labels.slice(-15);
            values = values.slice(-15);
            position = position.slice(-15);
        }

        if (filter === '1_month') {
            labels = labels.slice(-30);
            values = values.slice(-30);
            position = position.slice(-30);
        }

        let first: any = values[0];
        let second: any = values[values.length - 1];


        let diff = parseInt(second) - parseInt(first);

        if (diff > 0) {
            isNegative = true;
        }

        let firstPos: any = position[0];
        let secondPos: any = position[position.length - 1];

        let diffPos = parseInt(secondPos) - parseInt(firstPos);
        if (diffPos > 0) {
            isPositionNegative = true;
        }

        difference = Math.abs(diff);
        diffPosition = Math.abs(diffPos);

        series = [
            {name: 'Ranking', data: values},
        ];

        categories = labels;

    }


    function formatDate(dateStr) {
        const [day, month, year] = dateStr.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        const userLocale = navigator.language;
        return date.toLocaleDateString(userLocale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    function chartFilter(selectedFilter: string) {
        filter = selectedFilter;
        generateChartData();
        addParamToURL('filter', selectedFilter);
        selectedChart = chartOptions.find((option) => option.value === selectedFilter);
        // chartOptions = [selectedChart, ...chartOptions.filter((option) => option.value !== selectedFilter)];
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
            <h5 class="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">Ranking</h5>
            <div>

                <Button color="alternative" size="sm">{selectedChart.label }<ChevronDownOutline class="w-6 h-6 ms-2 text-gray-900 dark:text-white" /></Button>
                <Dropdown>
                    {#each chartOptions as option}
                        <DropdownItem>
                            <button on:click={() => chartFilter(option.value)}
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white {option.value === selectedChart.value ? 'font-bold text-blue-600 dark:text-blue-400' : ''}">
                                {option.label}
                            </button>
                        </DropdownItem>
                    {/each}
                </Dropdown>

            </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">

            <div class="rounded border shadow bg-white">
                <div class="py-2 px-4 flex flex-row items-center justify-between space-y-0 pb-0">
                    <div class="tracking-tight text-sm font-medium">Ranking</div>

                    <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-center {!isNegative ?
                    'text-green-500 dark:text-green-500' : 'text-red-500 dark:text--red-500'}">
                        {difference}

                        <svg class="w-3 h-3 ms-1" class:rotate-180={isNegative} aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M5 13V1m0 0L1 5m4-4 4 4"/>
                        </svg>
                    </div>
                </div>
                <div class="py-2 px-4 pt-0">
                    <div class="text-xl font-bold">{rankingOut['ranking']}</div>
                </div>
            </div>

            <div class="rounded border bg-white shadow">
                <div class="py-2 px-4 flex flex-row items-center justify-between space-y-0 pb-0">
                    <div class="tracking-tight text-sm font-medium">Position</div>

                    <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-center {!isPositionNegative ?
                    'text-green-500 dark:text-green-500' : 'text-red-500 dark:text--red-500'}">
                        {diffPosition}

                        <svg class="w-3 h-3 ms-1" class:rotate-180={isPositionNegative} aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M5 13V1m0 0L1 5m4-4 4 4"/>
                        </svg>
                    </div>
                </div>
                <div class="py-2 px-4 pt-0">
                    <div class="text-xl font-bold">{rankingOut['position']}
                    <span class="text-xs text-gray-400">from {rankingOut['plugins']}</span>
                    </div>
                </div>
            </div>

        </div>
        <Line {series} {categories} {reversed}/>
    </div>


{/if}