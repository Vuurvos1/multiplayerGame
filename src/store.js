import { writable } from 'svelte/store';

export const socket = writable({});
export const paint = writable({});
export const gameState = writable('');
export const users = writable([]);
