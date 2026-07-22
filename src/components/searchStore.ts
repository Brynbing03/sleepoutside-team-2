import { writable } from "svelte/store";
import type { Product } from "../js/types.mts";

export const searchState = writable({
  results: [] as Product[],
  query: "",
});
