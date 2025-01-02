import { writable } from 'svelte/store';

const storedWP = typeof window !== 'undefined' && localStorage.getItem('wp:list')
    ? JSON.parse(localStorage.getItem('wp:list') || '{}')
    : {};

export const wpStore = writable<{ [key: string]: { name: string; type: string } }>(storedWP);

wpStore.subscribe((items) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('wp:list', JSON.stringify(items));
    }
});

export function addItem(slug: string, itemData: { name: string; type: string }) {
    wpStore.update((items) => {
        return { ...items, [slug]: itemData };
    });
}

export function removeItem(slug: string) {
    wpStore.update((items) => {
        const updatedItems = { ...items };
        delete updatedItems[slug];
        return updatedItems;
    });
}