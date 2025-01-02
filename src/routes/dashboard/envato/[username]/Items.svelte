<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import {getToken} from '$lib/stores/envatoFinanceStore';

    let type: string = 'Sale';
    let from_date: string = _firstMothDay();
    let to_date: string = _currentDate();
    let site: string = '';
    let apiUrl = '';
    let token: string = '';
    let downloadsData = {};
    let ItemsData = '';
    let isDataReady = false;
    let isLoading = false;

    $: username = $page.params.username;
    $: apiUrl = `https://api.envato.com/v3/market/user/statement`;

    function _firstMothDay() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return firstDayOfMonth.toISOString().slice(0, 10);
    }

    function _currentDate() {
        const today = new Date();
        return today.toISOString().slice(0, 10);
    }

    onMount(() => {
        checkCachedData();
    });

    function checkCachedData() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedData = sessionStorage.getItem(`envato:${username}_items`);
            const formData = sessionStorage.getItem(`envato:${username}_date`);
            if (storedData) {
                downloadsData = JSON.parse(storedData);
                if (formData) {
                    let formsDate = JSON.parse(formData);
                    from_date = formsDate.from_date;
                    to_date = formsDate.to_date;
                }

                generateData(downloadsData);
                isLoading = false;
            }
        }
    }

    async function fetchData() {
        isLoading = true;

        const result = await getToken(username);
        token = result || '';
        if (!token) {
            console.error('No token found');
            return;
        }

        let allResults = [];
        let page = 1;
        let hasNextPage = true;
        const baseUrl = `${apiUrl}?type=${type}&from_date=${from_date}&to_date=${to_date}`;
        let count = 0;

        try {
            while (hasNextPage) {
                const apiUrl = `${baseUrl}&page=${page}`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                allResults = allResults.concat(data.results);

                if (count === allResults.length) {
                    break;
                }

                if (!data.pagination) {
                    hasNextPage = false;
                }

                if (data.count) {
                    count = data.count;
                }

                page += 1;
            }

            sessionStorage.setItem(`envato:${username}_items`, JSON.stringify(allResults));
            const filterDate = {
                'from_date': from_date,
                'to_date': to_date,
            };
            sessionStorage.setItem(`envato:${username}_date`, JSON.stringify(filterDate));
            generateData(allResults);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isLoading = false;
        }
    }

    function generateData(arr) {
        const uniqueOrders = Array.from(new Map(arr.map(item => [item.document, item])).values());

        function cleanDetail(detail) {
            return detail.replace(/\s*\(.*?\)\s*/g, '').trim();
        }

        const salesCount = uniqueOrders.reduce((acc, item) => {
            const cleanName = cleanDetail(item.detail);

            if (!acc[item.item_id]) {
                acc[item.item_id] = {
                    item_id: item.item_id,
                    detail: cleanName,
                    count: 0
                };
            }

            acc[item.item_id].count += 1;
            return acc;
        }, {});

        ItemsData = Object.values(salesCount);
        isDataReady = true;
        isLoading = false;
    }
</script>

<section class="flex items-center mb-12">
    <div class="w-full">
        <!-- Start coding here -->
        <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
            <div class="px-4 divide-y dark:divide-gray-700">
                <div class="flex items-center justify-between py-3">
                    <div class="flex items-center flex-1 space-x-2">
                        <h5 class="font-semibold dark:text-white">Items sales</h5>
                    </div>
                </div>
                <div class="flex flex-col items-stretch py-4 md:flex-row md:items-center">
                    <div class="flex flex-col space-y-3 md:flex-row md:items-center md:w-2/3 md:space-y-0">
                        <div class="flex flex-col space-y-1 md:space-y-0 md:flex-row md:items-center md:mr-5">
                            <div class="relative min-w-[12rem]">

                                <input name="start" type="date" id="from_date" bind:value={from_date}
                                       placeholder="Select start date"
                                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            </div>
                            <span class="mx-auto text-gray-500 md:mx-4">to</span>
                            <div class="relative min-w-[12rem]">
                                <input name="end" type="date" placeholder="Select end date" id="to_date"
                                       bind:value={to_date}
                                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full px-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            </div>
                        </div>
                        <button type="button" on:click={fetchData}
                                class="flex items-center justify-center flex-shrink-0 w-full px-4 py-2 text-sm font-medium text-white rounded-lg md:w-auto bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                            Run
                        </button>
                    </div>
                </div>
            </div>


            <div class="overflow-x-auto">

                {#if isLoading}
                    <div role="status">
                        <svg aria-hidden="true"
                             class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">Item</th>
                            <th scope="col" class="px-4 py-3">Sales</th>
                        </tr>
                        </thead>
                        <tbody>

                        {#each ItemsData as item}
                            <tr class="border-b dark:border-gray-700">
                                <td class="keywords">
                                    {item.detail}
                                </td>
                                <td class="px-4 py-3">{item.count}</td>
                            </tr>
                        {/each}

                        </tbody>
                    </table>
                {/if}
            </div>

        </div>

    </div>
</section>