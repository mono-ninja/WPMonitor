<svelte:head>
    <meta name="robots" content="noindex, nofollow"/>
</svelte:head>

<script lang="ts">
    import {page} from '$app/stores';
    import Heading from "./Heading.svelte";
    import Analytics from "./Analytics.svelte";
    import Keywords from "./Keywords.svelte";
    import {isMenuOpen} from '$lib/stores/menuStore';

    let isOpen = false;

    $: isMenuOpen.subscribe((value) => {
        isOpen = value;
    });

    let currentHash = '';
    let component = Analytics;

    $: currentHash = $page.url.hash;

    $: {
        if (currentHash === '#analytics' || !currentHash) {
            component = Analytics;
        } else if (currentHash === '#keywords') {
            component = Keywords;
        }
    }

    $: slug = $page.params.slug;

    function clearCache() {
        sessionStorage.removeItem(`wp:plugin:${slug}_downloads`);
        sessionStorage.removeItem(`wp:plugin:${slug}_historical`);
        sessionStorage.removeItem(`wp:plugin:${slug}_keywords`);
        sessionStorage.removeItem(`wp:plugin:${slug}_ranking`);

        location.reload();
    }

</script>

<main class="p-4 bg-gray-50 flex-1 pb-48">
    <div class="mx-auto max-w-screen-lg">
        <Heading></Heading>

        <div class="flex justify-between my-12">

            <div class="border-b border-gray-200">
                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                    <li class="me-2">
                        <a href="#analytics" class="{currentHash === '#analytics' || !currentHash ?
                       'inline-flex items-center justify-center p-4 text-primary-600 border-b-2 border-primary-600 rounded-t-lg active  group' : 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300  group'}"
                           aria-current={currentHash === '#analytics' ? 'page' : undefined}>
                            <svg class="{currentHash === '#analytics' || !currentHash ?
                                'w-4 h-4 me-2 text-primary-600 dark:text-primary-500' :
                                'w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500'}"
                                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"/>
                            </svg>
                            Statistic
                        </a>
                    </li>
                    <li class="me-2">
                        <a href="#keywords"
                           class="{currentHash === '#keywords' ? 'inline-flex items-center justify-center p-4 text-primary-600 border-b-2 border-primary-600 rounded-t-lg active  group' : 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300  group'}"
                           aria-current={currentHash === '#keywords' ? 'page' : undefined}>

                            <svg class="{currentHash === '#keywords' ? 'w-4 h-4 me-2 text-primary-600 dark:text-primary-500' :
                                'w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500'}"
                                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                            </svg>
                            Keywords
                        </a>
                    </li>
                </ul>
            </div>

            <button class="font-medium text-sm flex items-end text-red-700 hover:underline"
                    on:click={clearCache}>
                Clear
                cache
            </button>
        </div>


        <svelte:component this={component}/>

    </div>

</main>