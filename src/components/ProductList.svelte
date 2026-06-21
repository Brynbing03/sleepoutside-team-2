<script lang="ts">
  import { onMount } from "svelte";
  import { getProducts } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";
  import { getParam } from "../js/utils.mjs";
  import ProductSummary from "./ProductSummary.svelte";
  import ProductSearch from "./ProductSearch.svelte";

  let category = $state(""); 
  let products: Product[] = $state([]);
  let sortBy = $state("name");

  // Search state
  let activeSearchQuery = $state("");
  let searchResults: Product[] = $state([]);

  let sortedProducts = $derived.by(() => {
    const list = activeSearchQuery ? [...searchResults] : [...products];

    if (sortBy === "price") {
      list.sort((a, b) => a.listPrice - b.listPrice);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  });

  function handleSearchResults(query: string, results: Product[]) {
    activeSearchQuery = query;
    searchResults = results;
  }

  function handleClearSearch() {
    activeSearchQuery = "";
    searchResults = [];
  }

  async function init() {
    category = getParam("category") || "";
    const data = await getProducts(category);
    products = data.results;
  }

  onMount(init);
</script>

<ProductSearch onSearch={handleSearchResults} onClear={handleClearSearch} />

{#if activeSearchQuery}
  <h2>Search results for "{activeSearchQuery}"</h2>
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
    {#each sortedProducts as product}
      <ProductSummary {product} />
    {:else}
      {#if activeSearchQuery}
        <p class="no-results">No items found matching "{activeSearchQuery}"</p>
      {/if}
    {/each}
</ul>

<style>
  .sort-controls {
    margin-bottom: 1rem;
  }
</style>