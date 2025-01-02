<script lang="ts">
    import {eddStore, add, remove} from '$lib/stores/eddStore';
    import {onMount} from "svelte";
    import {get} from "svelte/store";

    import Details from '$lib/components/Details.svelte';
    import Alert from '$lib/components/Alert.svelte';

    interface InfoInterface {
        site: string;
        key: string;
        token: string;
    }

    let info: { [name: string]: InfoInterface } = {};
    let name = '';
    let site = '';
    let key = '';
    let token = '';

    let dialog: HTMLDialogElement | null = null;
    let isEditMode = false;
    let originalName = '';

    onMount(() => {
        info = get(eddStore);
    });

    eddStore.subscribe((value) => {
        info = value;
    });

    function addInfo() {
        if (name.trim() && site.trim()) {
            if (isEditMode) {
                // Remove the old item if the slug has been changed.
                if (originalName !== name) {
                    remove(originalName);
                }
                add(name, {site: site, key: key, token: token});
            } else {
                add(name, {site: site, key: key, token: token});
            }

            resetForm();
            dialog?.close();
        }
    }

    function removeInfo(name: string) {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            remove(name);
        }
    }

    function resetForm() {
        name = '';
        site = '';
        key = '';
        token = '';
        originalName = '';
        isEditMode = false;
    }

    function openDialog() {
        resetForm();
        dialog?.showModal();
    }

    function openEditDialog(name: string) {
        const item = info[name];
        site = item.site;
        name = name;
        originalName = name;
        key = item.key;
        token = item.token;
        isEditMode = true;
        dialog?.showModal();
    }

</script>


<div class="w-full mt-10">

    <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">

        <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
                <h5 class="mr-3 font-semibold dark:text-white">EDD Sites</h5>
                <p class="text-gray-500 dark:text-gray-400">Manage all your EDD sites or add a new one</p>
            </div>
            <button type="button" class="btn-add" on:click={openDialog}>
                <svg class="h-3.5 w-3.5 mr-2 -ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24" fill="none" viewBox="0 0 24 24">
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
                    <th scope="col" class="px-4 py-3">Site</th>
                    <th scope="col" class="px-4 py-3">Key</th>
                    <th scope="col" class="px-4 py-3">Token</th>
                    <th scope="col" class="px-4 py-3">
                        <span class="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {#each Object.entries(info) as [name, item]}
                    <tr class="border-b dark:border-gray-700">
                        <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {name}
                        </th>
                        <td class="px-4 py-3">{item.site}</td>
                        <td class="px-4 py-3"><input type="text" readonly value="{item.key}" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"></td>
                        <td class="px-4 py-3"><input type="text" readonly value="{item.token}" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"></td>
                        <td class="px-4 py-3 flex items-center justify-end gap-1">
                            <button class="btn-edit" on:click={() => openEditDialog(name)}>
                                <span class="sr-only">Edit</span>
                                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                </svg>
                            </button>
                            <button class="btn-remove" on:click={() => removeInfo(name)}>
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


<dialog bind:this={dialog} class="dialog">
    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Update Item' : 'Add New Item'}
        </h3>
        <button type="button" class="btn-close" on:click={() => dialog?.close()}>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
        </button>
    </div>

    <div class="p-4 md:p-5">
        <form on:submit|preventDefault={addInfo} class="space-y-4">
            <div>
                <label for="name">Site Name</label>
                <input type="text" name="name" id="name" bind:value={name} placeholder="Enter Name" required/>
            </div>

            <div>
                <label for="slug">URL</label>
                <input type="text" name="slug" id="slug" bind:value={site} placeholder="Enter Site URL" required/>
                <small>Like <code>https://yoursite.com</code></small>
            </div>

            <div>
                <label for="key">Public Key</label>
                <input type="text" name="key" id="key" bind:value={key} placeholder="Enter Key" required/>
            </div>

            <div>
                <label for="token">Token</label>
                <input type="text" name="token" id="token" bind:value={token} placeholder="Enter Token" required/>
            </div>

            <div>
                <button type="submit" class="btn">{isEditMode ? 'Update' : 'Add'}</button>
            </div>
        </form>
    </div>
</dialog>


<section class="w-full bg-white border divide-y rounded divide-slate-200 border-slate-200 mt-16">

    <Details summary="What is the Name?">
        <p>
            The Name refers to the name of your store site. This is the name that helps identify the store you’re
            tracking,
            and it should be clear and descriptive, especially if you manage multiple stores. </p>
    </Details>

    <Details summary="What is the Site?">
        <p>
            The Site is the full web address (URL) where your Easy Digital Downloads store is located. Be sure to enter
            the
            complete and correct URL (e.g., <code>https://yourstore.com</code>) to ensure proper connection and
            tracking. </p>
    </Details>

    <Details summary="Where can I find the Key and Token?">
        <p>
            To track sales and earnings, you’ll need to use the Public Key and Token generated by your Easy Digital
            Downloads store. These keys are created in the store’s admin area under the API settings. For more details,
            you
            can refer to the official documentation here: <a
                href="https://easydigitaldownloads.com/docs/edd-rest-api-introduction/" rel="noopener noreferrer"
                target="_blank" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">Easy
            Digital Downloads REST API Introduction</a>.</p>
    </Details>

</section>


<div class="mt-10">
    <Alert type="info" title="Notice">
        <p>WPMonitor does not track or store any of your personal data or credentials. All sensitive information, such
            as
            your API Key and Token, is securely saved in your browser’s LocalStorage and is only used locally to fetch
            your
            data. This ensures your data privacy and security.</p>
    </Alert>
</div>
