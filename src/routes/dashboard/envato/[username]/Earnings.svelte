<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import {getToken} from '$lib/stores/envatoFinanceStore';

    import Bar from './ApexCharts.svelte';
    import {Button, Dropdown, DropdownItem} from 'flowbite-svelte';
    import {ChevronDownOutline} from 'flowbite-svelte-icons';

    let chartOptions = [
        {label: "Last year", value: "1_year"},
        {label: "Last 3 month", value: "3_month"},
        {label: "All Time", value: "all"},
    ];

    let selectedChart: any = chartOptions[0];
    selectedChart = chartOptions.find((option) => option.value === $page.url.searchParams.get('filter')) ||
        chartOptions[0];

    let username = '';
    let token: string = '';
    let downloadsData = {};
    let chartData: any = {};
    let thisMontEarning: string = '';
    let thisMontSales: string = '';
    let isLoading = true;
    let apiUrl = '';
    let itemData = {};
    let isDataReady = false;
    let series: any = {};
    let filter: any = '';
    $: filter = $page.url.searchParams.get('filter');

    $: username = $page.params.username;
    $: apiUrl = `https://api.envato.com/v1/market/private/user/earnings-and-sales-by-month.json`;

    onMount(async () => {
        const result = await getToken(username);
        token = result || '';
        if (token) {
            await checkCachedData();
        }
    });

    async function checkCachedData() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedData = sessionStorage.getItem(`envato:${username}_earning`);
            if (storedData) {
                downloadsData = JSON.parse(storedData);
                generateChartData(downloadsData);
                isLoading = false;
            } else {
                await fetchData();
            }
        }
    }

    async function fetchData() {
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Request error: ${response.status}`);
            }
            const data = await response.json();
            downloadsData = data;
            sessionStorage.setItem(`envato:${username}_earning`, JSON.stringify(data));
            generateChartData();
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isLoading = false;
        }
    }

    function generateChartData() {
        let labels = downloadsData['earnings-and-sales-by-month'].map((data: any) => _formatDate(data.month));
        let earningsData = downloadsData['earnings-and-sales-by-month'].map((data: any) => parseFloat(data.earnings));
        let salesData = downloadsData['earnings-and-sales-by-month'].map((data: any) => parseInt(data.sales));

        if (!filter || filter === '1_year') {
            labels = labels.slice(-12);
            earningsData = earningsData.slice(-12);
            salesData = salesData.slice(-12);
        }

        if (filter === '3_month') {
            labels = labels.slice(-3);
            earningsData = earningsData.slice(-3);
            salesData = salesData.slice(-3);
        }


        thisMontEarning = earningsData[earningsData.length - 1];
        thisMontSales = salesData[earningsData.length - 1];

        isDataReady = true;

        const formattedEarnings = labels.map((label, index) => ({
            x: label,
            y: earningsData[index]
        }));

        const formattedSales = labels.map((label, index) => ({
            x: label,
            y: salesData[index]
        }));

        series = [
            {
                name: "Earnings",
                color: "#1a56db",
                data: formattedEarnings,
            },
            {
                name: "Sales",
                color: "#fdba8c",
                data: formattedSales,
            },
        ];
    }

    function _formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleString('default', {month: 'short', year: 'numeric'});
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

{#if !isDataReady}
    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>
{/if}

{#if isDataReady}

    <div class="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
        <div class="flex flex-col md:flex-row gap-4 flex-wrap justify-between">

            <div class="flex-1">

                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div class="rounded border bg-white shadow">
                        <div class="p-4 flex flex-row items-center justify-between">
                            <div class="tracking-tight text-sm font-medium">This Month Earning</div>
                            <div class="font-bold">{thisMontEarning}</div>
                        </div>
                    </div>
                    <div class="rounded border bg-white shadow">
                        <div class="p-4 flex flex-row items-center justify-between">
                            <div class="tracking-tight text-sm font-medium">This Month Sales</div>
                            <div class="font-bold">{thisMontSales}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Button color="alternative" size="sm">{selectedChart.label }
                    <ChevronDownOutline class="w-6 h-6 ms-2 text-gray-900 dark:text-white"/>
                </Button>
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

        <Bar {series}/>
    </div>

{/if}