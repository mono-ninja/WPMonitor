<svelte:head>
    <meta name="robots" content="noindex, nofollow"/>
</svelte:head>

<script lang="ts">
    import Earnings from "./Earnings.svelte";
    import Items from "./Items.svelte";
    import {page} from '$app/stores';
    import {isMenuOpen} from '$lib/stores/menuStore';

    let isOpen = false;

    $: isMenuOpen.subscribe((value) => {
        isOpen = value;
    });

    $: currentHash = $page.url.hash;

    let username = '';

    $: username = $page.params.username;
    let component = Earnings;


    $: {
        switch (currentHash) {
            case '#items':
                component = Items;
                break;
            default:
                component = Earnings;
        }
    }


</script>


<main class="p-4 bg-gray-50 flex-1 pb-48">

    <div class="mx-auto max-w-screen-lg">

        <hgroup class="flex flex-col gap-2">
            <h1 class="font-bold text-base">{username}</h1>
        </hgroup>


        <div class="border-b border-gray-200 my-12">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                <li class="me-2">
                    <a href="#api" class="{currentHash === '#api' || !currentHash ?
                       'inline-flex items-center justify-center p-4 text-primary-600 border-b-2 border-primary-600 rounded-t-lg active  group' : 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300  group'}"
                       aria-current={currentHash === '#api' ? 'page' : undefined}>

                        <svg class="{currentHash === '#api' || !currentHash ?
                                'w-4 h-4 me-2 text-primary-600 dark:text-primary-500' :
                                'w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500'}"
                             aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                  d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                                  clip-rule="evenodd"/>
                        </svg>
                        Earnings
                    </a>
                </li>
                <li class="me-2">
                    <a href="#items"
                       class="{currentHash === '#items' ? 'inline-flex items-center justify-center p-4 text-primary-600 border-b-2 border-primary-600 rounded-t-lg active  group' : 'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300  group'}"
                       aria-current={currentHash === '#items' ? 'page' : undefined}>

                        <svg class="{currentHash === '#items' ? 'w-4 h-4 me-2 text-primary-600 dark:text-primary-500' :
                                'w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500'}"
                             aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                             viewBox="0 0 18 18">
                            <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                        </svg>
                        Items
                    </a>
                </li>
            </ul>
        </div>


        <svelte:component this={component}/>

    </div>
</main>





