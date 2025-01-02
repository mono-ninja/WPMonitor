<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {get} from 'svelte/store';
    import {Envato} from '$lib/stores/envatoFinanceStore';

    let items: object = {};
    let apiUrl = '';
    let isReady =false;
    let downloadsData: { [key: string]: any } = {};

    $: apiUrl = `https://api.envato.com/v1/market/private/user/earnings-and-sales-by-month.json`;

    onMount(async () => {
        items = get(Envato); // Отримуємо об'єкт із динамічними ключами
        if (Object.keys(items).length > 0) {
            await checkCachedData();
        }
    });

    async function checkCachedData() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {

            for (const key in items) {
                const username: string = items[key];
                const storedData = sessionStorage.getItem(`envato:${username}_earning`);

                if (storedData) {
                    downloadsData[username] = JSON.parse(storedData);
                }
                else {
                    await fetchData(key, username);
                }
            }

            isReady = true;
        }
    }

    async function fetchData(token:string, username:string) {
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
            downloadsData[username] = data;
            sessionStorage.setItem(`envato:${username}_earning`, JSON.stringify(data));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isReady = true;
        }
    }

</script>

{#if isReady}
    {#if Object.keys(downloadsData).length > 0}
        {#each Object.entries(downloadsData) as [name, data]}

            <div class="rounded-xl border bg-white shadow">
                <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <div class="tracking-tight text-sm font-medium">{name}</div>

                    <svg class="w-4 h-4 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M19.4,0.1c1.1,0.5,5.5,10,1.7,18.2c-3,6.6-10.7,6.6-14.6,4.3c-3.3-2-8.4-8.2-2.8-15.9 c0.2-0.3,0.8-0.3,0.7,0.6c-0.1,0.6-0.9,5.1,0.6,7c0.7,1,0.9,0.3,0.9,0.3S5.9,8.1,10.9,3.2C14.1,0.2,18.6-0.3,19.4,0.1z"></path>
                    </svg>
                </div>
                <div class="p-6 pt-0">
                    <div
                            class="text-2xl font-bold">{(data['earnings-and-sales-by-month'][data['earnings-and-sales-by-month'].length - 1].earnings).toLocaleString("en-US", {
                      style:
                          "currency", currency: "USD"
                    })}</div>
                    <p class="text-xs text-muted-foreground">{(data['earnings-and-sales-by-month'][data['earnings-and-sales-by-month'].length - 1].sales).toLocaleString()} sales</p>
                </div>
            </div>

        {/each}

    {/if}
{/if}