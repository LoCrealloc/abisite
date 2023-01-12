import { writable } from "svelte/store";
export const isLoggedInAdmin = writable(false);
export const userId = writable(null);
