<script lang="ts">
    import {page} from '$app/stores';
    import {onMount} from 'svelte';
    import { Spinner } from 'flowbite-svelte';


    let slug = '';
    let keywords: string[] = [];
    let keywordResults: { position: number; keyword: string }[] = [];
    let isLoading = true;
    let apiUrl = '';

    $: slug = $page.params.slug;
    $: apiUrl = `https://api.wordpress.org/plugins/info/1.2/?action=query_plugins`;

    onMount(() => {
        checkCachedData();
    });

    $: if (slug) {
        isLoading = true;
        keywordResults = [];
        checkCachedData();
    }

    async function checkCachedData() {
        if (typeof localStorage !== 'undefined' && slug) {
            const wpList = localStorage.getItem('wp:list');
            if (wpList) {
                const parsedList = JSON.parse(wpList);
                if (parsedList[slug]?.keywords) {
                    keywords = parsedList[slug].keywords.split(',').map((kw: string) => kw.trim());
                    await checkCachedKeywords();
                } else {
                    const keywordEntry = {position: '-', keyword: 'No Keywords'};
                    keywordResults.push(keywordEntry);
                    isLoading = false;
                }
            }
        }
    }

    async function checkCachedKeywords() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const storedKeywords = sessionStorage.getItem(`wp:plugin:${slug}_keywords`);
            if (storedKeywords) {
                keywordResults = JSON.parse(storedKeywords);
            } else {
                await fetchKeywordsData();
            }
            isLoading = false;
        }
    }

    async function fetchKeywordsData() {
        const keywordPromises = keywords.map(async (keyword) => {
            const response = await fetch(`${apiUrl}&request[search]=${keyword.trim()}`);
            const result = await response.json();

            if (result.plugins) {
                const index = result.plugins.findIndex((plugin) => plugin.slug === slug);
                if (index !== -1) {
                    const keywordEntry = {position: index + 1, keyword};
                    if (!keywordResults.some((entry) => entry.position === keywordEntry.position && entry.keyword === keywordEntry.keyword)) {
                        keywordResults.push(keywordEntry);
                    }
                } else {
                    const keywordEntry = {position: 0, keyword};
                    if (!keywordResults.some((entry) => entry.position === keywordEntry.position && entry.keyword === keywordEntry.keyword)) {
                        keywordResults.push(keywordEntry);
                    }
                }
            }
        });

        await Promise.all(keywordPromises);
        sessionStorage.setItem(`wp:plugin:${slug}_keywords`, JSON.stringify(keywordResults));
    }
</script>

{#if isLoading}

    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>

{:else}
    <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
        <div class="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div class="flex items-center flex-1 space-x-4">
                <h5>
                    <span class="text-gray-500">Search keywords to 25 position</span>
                </h5>
            </div>
        </div>

    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-4 py-3">Keyword</th>
                <th scope="col" class="px-4 py-3">Position</th>
            </tr>
            </thead>
            <tbody>
            {#each keywordResults as {position, keyword}}
                <tr class="border-b dark:border-gray-700">
                    <th scope="row"
                        class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{keyword}</th>
                    <td class="px-4 py-3">
                        {#if position === 0}
                            N/A
                        {:else}
                            {position}
                        {/if}
                    </td>
                </tr>
            {/each}

            </tbody>
        </table>

    </div>
    </div>

{/if}