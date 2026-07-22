<script lang="ts">
  import { onMount } from "svelte";
  import { getProducts } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";
  import { getParam } from "../js/utils.mjs";
  import ProductSummary from "./ProductSummary.svelte";
  import { searchState } from "./searchStore.ts";

  let category = $state("");
  let products: Product[] = $state([]);
  let sortBy = $state("name");

  let sortedProducts = $derived.by(() => {
    // const list = activeSearchQuery ? [...searchResults] : [...products];

    const list = $searchState.query ? [...$searchState.results] : [...products];

    if (sortBy === "price") {
      list.sort((a, b) => a.listPrice - b.listPrice);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  });

  // function handleSearchResults(query: string, results: Product[]) {
  //   activeSearchQuery = query;
  //   searchResults = results;
  // }

  // function handleClearSearch() {
  //   activeSearchQuery = "";
  //   searchResults = [];
  // }

  async function init() {
    category = getParam("category") || "";
    const data = await getProducts(category);
    products = data.results;
  }

  onMount(init);
</script>

<!-- <ProductSearch onSearch={handleSearchResults} onClear={handleClearSearch} /> -->

{#if $searchState.query}
  <h2>Search results for "{$searchState.query}"</h2>
{:else}
  <h2>Top products: {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
{/if}

{#if sortedProducts.length > 0}
  <div class="sort-controls">
    <label for="sort-by">Sort by:</label>
    <select id="sort-by" bind:value={sortBy}>
      <option value="name">Name</option>
      <option value="price">Price (Low to High)</option>
    </select>
  </div>
{/if}

<ul class="product-list">
  {#if sortedProducts.length > 0}
    {#each sortedProducts as product}
      <ProductSummary {product} />
    {/each}
  {:else if $searchState.query}
    <p class="no-results">No items found matching "{$searchState.query}"</p>
  {/if}
</ul>

<style>
  .sort-controls {
    margin-bottom: 1rem;
  }
</style>
