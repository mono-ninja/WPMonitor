<script lang="ts">
    import {Envato, addItem, removeItem} from '$lib/stores/envatoFinanceStore';
    import {onMount, onDestroy} from 'svelte';
    import {get} from 'svelte/store';

    type Item = { key: string; username: string; };  // Define Item type for better type safety


    let items: Item[] = [];
    let username = '';
    let token = '';
    let dialog: HTMLDialogElement | null = null;
    let isEditMode = false;
    let origToken = '';
    let unsubscribe: () => void;  // For unsubscribing


    onMount(() => {
        items = get(Envato);
        unsubscribe = Envato.subscribe((value) => {
            items = value;
        });
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();  // Unsubscribe on component destroy
        }
    });

    function setItem() {
        if (username.trim() && token.trim()) {
            if (isEditMode && origToken) {
                if (origToken !== token) {
                    removeItem(origToken);
                }
                addItem(token, username);
            } else {
                addItem(token, username);
            }
            resetForm();
            dialog?.close();
        }
    }

    function resetForm() {
        username = '';
        token = '';
        origToken = '';
        isEditMode = false;
    }

    function deleteItem(token: string) {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            removeItem(token);
        }
    }

    function openDialog() {
        resetForm();
        dialog?.showModal();
    }

    function openEditDialog(token: string) {
        username = items[token];
        token = token;
        origToken = token;
        isEditMode = true;
        dialog?.showModal();
    }
</script>

<div class="w-full mt-10">

    <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
        <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
                <h5 class="mr-3 font-semibold dark:text-white">Envato API</h5>
                <p class="text-gray-500 dark:text-gray-400">Manage all your Envato API or add a new one</p>
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
                    <th scope="col" class="px-4 py-3">Username</th>
                    <th scope="col" class="px-4 py-3">Token</th>
                    <th scope="col" class="px-4 py-3">
                        <span class="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {#each Object.entries(items) as [token, username]}
                    <tr class="border-b dark:border-gray-700">
                        <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <a href="/dashboard/envato/{username}" class="underline decoration-primary-500 underline-offset-2 hover:no-underline">
                                {username}
                            </a>
                        </th>
                        <td class="px-4 py-3"><input type="text" value="{token}" readonly class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"></td>
                        <td class="px-4 py-3 flex items-center justify-end gap-1">
                            <button class="btn-edit" on:click={() => openEditDialog(token)}>
                                <span class="sr-only">Edit</span>
                                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                </svg>
                            </button>
                            <button class="btn-remove" on:click={() => deleteItem(token)}>
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
            {isEditMode ? 'Update' : 'Add New'}
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
    <form on:submit|preventDefault={setItem} class="space-y-4">

        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" bind:value={username} placeholder="Enter Username" required/>
        </div>

        <div>
            <label for="token">Token</label>
            <input type="text" name="token" id="token" bind:value={token} placeholder="Envato API Token" required/>
        </div>

        <div>
            <button type="submit" class="btn">{isEditMode ? 'Update' : 'Add'}</button>
        </div>
    </form>
    </div>
</dialog>