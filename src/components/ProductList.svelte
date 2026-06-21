<script lang="ts">
  import { onMount } from "svelte";
  import { getProducts } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";
  import { getParam } from "../js/utils.mjs";
  import ProductSummary from "./ProductSummary.svelte";

// declare these out here as state so we can us it in our template below
  let category = $state(""); 
  let products:Product[] = $state([]);

  let sortBy = $state("name");

  let sortedProducts = $derived.by(() => {
    const list = [...products];

    if(sortBy === "price") {
      list.sort((a, b) => a.listPrice - b.listPrice);
    } else if(sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
      // list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  });

  async function init() {
    category = getParam("category") || "";
    const data = await getProducts(category);
    products = data.results;
    // console.log(data);
  }

  onMount(init);
</script>

<h2>Top products: {category.charAt(0).toUpperCase() + category.slice(1)}</h2>

<div class="sort-controls">
  <label for="sort-by">Sort by:</label>
  <select id="sort-by" bind:value={sortBy}>
    <option value="name">Name</option>
    <option value="price">Price (Low to High)</option>
  </select>
</div>


<!-- {JSON.stringify(products)} -->
<ul class="product-list">
    {#each sortedProducts as product}
      <ProductSummary {product} />
    {/each}
</ul>

<style>
  .sort-controls {
    margin-bottom: 1rem;
  }
</style>