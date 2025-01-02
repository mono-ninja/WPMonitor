<svelte:head>
    <title>Track WordPress Plugin & Theme Statistics | Add Parameters for Accurate Insights</title>
    <meta name="description"
          content="Effortlessly track your WordPress plugin or theme performance with our tool. Add your plugin/theme name, slug and keywords to get real-time stats on rankings and downloads. Improve visibility on WordPress.org."/>
</svelte:head>

<script lang="ts">
    import Details from '$lib/components/Details.svelte';
    import Alert from '$lib/components/Alert.svelte';

    import {wpStore, addItem, removeItem} from '$lib/stores/wpStore';
    import {get} from 'svelte/store';
    import {onMount} from 'svelte';
    import {isMenuOpen} from '$lib/stores/menuStore';

    let isOpen = false;


    $: isMenuOpen.subscribe((value) => {
        isOpen = value;
    });

    interface WPItem {
        name: string;
        type: 'plugin' | 'theme';
        keywords: string;
    }

    let wpItems: { [key: string]: WPItem } = {};
    let itemName = '';
    let itemSlug = '';
    let itemType: 'plugin' | 'theme' = 'plugin';
    let itemKeywords = '';

    let dialog: HTMLDialogElement | null = null;
    let isEditMode = false;
    let originalSlug = '';

    onMount(() => {
        wpItems = get(wpStore);
    });

    wpStore.subscribe((value) => {
        wpItems = value;
    });

    function addOrUpdateItem() {
        if (itemName.trim() && itemSlug.trim()) {
            if (isEditMode) {
                // Remove the old item if the slug has been changed.
                if (originalSlug !== itemSlug) {
                    removeItem(originalSlug);
                }
                addItem(itemSlug, {name: itemName, type: itemType, keywords: itemKeywords});
            } else {
                addItem(itemSlug, {name: itemName, type: itemType, keywords: itemKeywords});
            }

            resetForm();
            dialog?.close();
        }
    }

    function deleteItem(slug: string) {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            removeItem(slug);
        }
    }

    function openDialog() {
        resetForm();
        dialog?.showModal();
    }

    function openEditDialog(slug: string) {
        const item = wpItems[slug];
        itemName = item.name;
        itemSlug = slug;
        originalSlug = slug;
        itemType = item.type;
        itemKeywords = item.keywords || '';
        isEditMode = true;
        dialog?.showModal();
    }

    function resetForm() {
        itemName = '';
        itemSlug = '';
        itemType = 'plugin';
        itemKeywords = '';
        originalSlug = '';
        isEditMode = false;
    }


</script>

<main class="p-4">
    <div class="mx-auto max-w-screen-lg">

        <hgroup class="flex flex-col gap-2">
            <h1 class="font-bold text-base">Track WordPress Plugin & Theme Performance</h1>
            <p class="text-sm text-gray-400 max-w-96">Add your plugin or theme details to
                retrieve real-time statistics and improve your visibility on WordPress.org.</p>
        </hgroup>


        <div class="w-full mt-10">
            <!-- Start coding here -->
            <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
                    <div>
                        <h5 class="mr-3 font-semibold dark:text-white">Plugins and Themes</h5>
                        <p class="text-gray-500 dark:text-gray-400">Manage all your plugins and themes or add a new
                            one</p>
                    </div>
                    <button type="button" class="btn-add" on:click={openDialog}>
                        <svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M5 12h14m-7 7V5"/>
                        </svg>
                        Add new
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">Name</th>
                            <th scope="col" class="px-4 py-3">Slug</th>
                            <th scope="col" class="px-4 py-3">Keywords</th>
                            <th scope="col" class="px-4 py-3">Type</th>
                            <th scope="col" class="px-4 py-3">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each Object.entries(wpItems) as [slug, item]}
                            <tr class="border-b dark:border-gray-700">
                                <th scope="row"
                                    class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <a href="/dashboard/wp/{slug}/{item.type}"
                                       class="underline decoration-primary-500 underline-offset-2 hover:no-underline">
                                        {item.name}
                                    </a>
                                </th>
                                <td class="px-4 py-3"><code class="">{slug}</code>
                                </td>
                                <td class="keywords">
                                    {item.keywords || 'No keywords added'}
                                </td>
                                <td class="px-4 py-3">{item.type}</td>

                                <td class="px-4 py-3 flex items-center justify-end gap-1">
                                    <button class="btn-edit" on:click={() => openEditDialog(slug)}>
                                        <span class="sr-only">Edit</span>
                                        <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                             width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="2"
                                                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                    </button>
                                    <button class="btn-remove" on:click={() => deleteItem(slug)}>
                                        <span class="sr-only">Toggle full view</span>
                                        <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                             width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                  stroke-width="2"
                                                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>

                </div>
            </div>

        </div>

        <section class="w-full bg-white border divide-y rounded divide-slate-200 border-slate-200 mt-16">

            <Details summary="What is the Short Name?">
                <p>The Short Name refers to a simplified name for your WordPress plugin or theme. This name will be
                    displayed in the sidebar navigation menu, making identifying and accessing your plugin easier.</p>
            </Details>
            <Details summary="What is the Slug?">
                <p>The Slug is the unique identifier for your plugin/theme used in URLs and internal WordPress paths.
                    It’s
                    typically a
                    lowercase, hyphen-separated string (e.g., my-custom-plugin) and is used by WordPress to reference
                    your
                    plugin.</p>
                <p><code>https://wordpress.org/plugins/gutenberg/</code> - <small><b>gutenberg</b> is the plugin
                    slug.</small>
                </p>
                <p><code>https://wordpress.org/themes/twentytwentyfour/</code> - <small><b>twentytwentyfour</b> is the
                    plugin
                    slug.</small>
                </p>
            </Details>
            <Details summary="What are Keywords?">
                <p>Keywords are terms or phrases associated with your plugin that users might search for on
                    WordPress.org.
                    WPMonitor
                    will search for your plugin using these keywords and return the plugin’s ranking if it appears
                    within
                    the
                    first
                    25
                    results.</p>
            </Details>

        </section>

        <div class="mt-10">
            <Alert type="info" title="Notice">
                <p>
                    WPMonitor does not track or store any of your personal data or credentials. All information,
                    including
                    your plugin/theme details, is securely saved in your browser’s LocalStorage. This data is only used
                    locally to fetch statistics and is never transmitted to or stored on our servers, ensuring your
                    privacy
                    and security </p>
            </Alert>
        </div>

    </div>

    <dialog bind:this={dialog} class="dialog">
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Update Item' : 'Add New Item'}
            </h3>
            <button type="button" class="btn-close" on:click={() => dialog?.close()}>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
            </button>
        </div>

        <div class="p-4 md:p-5">
            <form on:submit|preventDefault={addOrUpdateItem} class="space-y-4">
                <div>
                    <label for="name">Short Name</label>
                    <input type="text" name="name" id="name" bind:value={itemName} placeholder="Enter Name" required/>
                    <small class="helper">Will display in nav list in sidebar</small>
                </div>

                <div>
                    <label for="slug">Slug</label>
                    <input type="text" name="slug" id="slug" bind:value={itemSlug} placeholder="Enter Slug" required/>
                </div>

                <div>
                    <label for="type">Type</label>
                    <select id="type" bind:value={itemType}>
                        <option value="plugin">Plugin</option>
                        <option value="theme">Theme</option>
                    </select>
                </div>

                <div>
                    <label for="type">Keywords</label>
                    <textarea id="keywords" bind:value={itemKeywords}
                              placeholder="Enter keywords (comma separated)"></textarea>
                </div>

                <div>
                    <button type="submit" class="btn">{isEditMode ? 'Update Item' : 'Add Item'}</button>
                </div>
            </form>
        </div>

    </dialog>


</main>