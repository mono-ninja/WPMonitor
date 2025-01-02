import {writable} from 'svelte/store';

const stored = typeof window !== 'undefined' && localStorage.getItem('edd:list')
    ? JSON.parse(localStorage.getItem('edd:list') || '{}')
    : {};

export const eddStore = writable<{ [name: string]: { site: string; key: string, token: string } }>(stored);

eddStore.subscribe((items) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('edd:list', JSON.stringify(items));
    }
});

export function add(name: string, itemData: { site: string; key: string, token: string }) {
    eddStore.update((items) => {
        return {...items, [name]: itemData};
    });
}

export function remove(name: string) {
    eddStore.update((items) => {
        const updatedItems = {...items};
        delete updatedItems[name];
        return updatedItems;
    });
}

export function getAll() {
    let allItems;
    eddStore.subscribe((items) => {
        allItems = items;
    })();
    return allItems;
}