<script lang="ts">
  import { error } from "console";
  import type { Product } from "../js/types.mts";
  import { searchState } from "./searchStore.ts";
  // import ProductSummary from "./ProductSummary.svelte";

  // Svelte 5 State Runes
  //   let {
  //     onSearch,
  //     onClear,
  //   }: {
  //     onSearch: (query: string, results: Product[]) => void;
  //     onClear: () => void;
  //   } = $props();

  let searchQuery = $state("");
  let isSearching = $state(false);
  let errorMessage = $state("");

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value.trim() === "") {
      //   onClear();
      searchState.set({
        results: [],
        query: "",
      });
    }
  }

  async function handleSearch(event: SubmitEvent) {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    const form = event.target as HTMLFormElement;
    const inputElement = form.querySelector(
      ".search-input",
    ) as HTMLInputElement;

    isSearching = true;
    errorMessage = "";

    try {
      const response = await fetch(
        `http://localhost:4321/api/v1/products?q=${encodeURIComponent(trimmedQuery)}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        searchState.set({
          results: [],
          query: trimmedQuery,
        });
        errorMessage = "No products found.";
        return;
      }

      searchState.set({
        results: data.results,
        query: trimmedQuery,
      });

      searchState.set({
        results: data.results || [],
        query: trimmedQuery,
      });

      // window.location.href = "/product-list";

      searchQuery = "";

      if (inputElement) {
        inputElement.blur();
      }

      errorMessage = "No products found.";
      return;
      
    } catch (err: any) {
      errorMessage = err.message;
      console.error("Search error:", err);
    } finally {
      isSearching = false;
    }
  }
</script>

<form onsubmit={handleSearch} class="search-form">
  <label for="search">Search</label>
  <input
    type="search"
    placeholder="Find products..."
    bind:value={searchQuery}
    disabled={isSearching}
    class="search-input"
  />
</form>

{#if errorMessage}
  <p class="error-message">{errorMessage}</p>
{/if}

{#if isSearching}
  <p class="loading-message">Searching...</p>
{/if}

<style>
  .search-form {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
    flex-direction: row;
    margin-right: 10px;

    label {
      font-size: 15px;
    }
  }

  .search-input {
    width: 100%;
    padding: 0.2rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
  }
  .error-message {
    color: red;
    font-size: small;
    margin: 1px;
  }
  .loading-message {
    color: #666;
    font-style: italic;
    font-size: 10px;
  }
</style>
