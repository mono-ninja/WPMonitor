import { writable } from 'svelte/store';

const stored = typeof window !== 'undefined' && localStorage.getItem('envato')
    ? JSON.parse(localStorage.getItem('envato') || '{}')
    : {};

export const Envato = writable<{ token: string; username: string; }[]>(stored);

Envato.subscribe((items) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('envato', JSON.stringify(items));
    }
});

export function addItem(token: string, username: string) {
    Envato.update((items) => {
        return { ...items, [token]: username };
    });
}

export function removeItem(token: any) {
    Envato.update((items) => {
        const updatedItems = { ...items };
        delete updatedItems[token];
        return updatedItems;
    });
}

export function getToken(username: string): Promise<string | undefined> {
    return new Promise((resolve) => {
        Envato.subscribe((items) => {
            const token = Object.keys(items).find(key => (items as Record<string, any>)[key] === username);
            resolve(token);
        })();
    });
}
