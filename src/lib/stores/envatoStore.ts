import { writable } from 'svelte/store';

const stored = typeof window !== 'undefined' && localStorage.getItem('envato:list')
    ? JSON.parse(localStorage.getItem('envato:list') || '{}')
    : {};

export const envStore = writable<{ [key: string]: { username: string; site: string; keywords: string  } }>(stored);

envStore.subscribe((items) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('envato:list', JSON.stringify(items));
    }
});

export function addItem(token: string, itemData: { username: string; site: string; keywords: string }) {
    envStore.update((items) => {
        return { ...items, [token]: itemData };
    });
}

export function removeItem(token: string) {
    envStore.update((items) => {
        const updatedItems = { ...items };
        delete updatedItems[token];
        return updatedItems;
    });
}