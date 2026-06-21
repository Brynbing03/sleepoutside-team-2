<script lang="ts">
    import type { Product } from "../js/types.mts";
    // import ProductSummary from "./ProductSummary.svelte";

    // Svelte 5 State Runes
    let { onSearch, onClear }: { onSearch: (query: string, results: Product[]) => void; onClear: () => void } = $props();

    let searchQuery = $state('');
    let isSearching = $state(false);
    let errorMessage = $state('');

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.value.trim() === '') {
            onClear();
        }
    }

    async function handleSearch(event: SubmitEvent) {
        event.preventDefault();

        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) return;

        const form = event.target as HTMLFormElement;
        const inputElement = form.querySelector('.search-input') as HTMLInputElement;

        isSearching = true;
        errorMessage = '';

        try {
            const response = await fetch(`http://localhost:3000/api/v1/products?q=${encodeURIComponent(trimmedQuery)}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong");
            }

            const data = await response.json();
            // console.log('Search results:', data.results);
            onSearch(trimmedQuery, data.results || []);

            // Clear the input field
            searchQuery = '';

            if (inputElement) {
                inputElement.blur();
            }
        } catch (err: any) {
            errorMessage = err.message;
            console.error('Search error:', err);
        } finally {
            isSearching = false;
        }
    }

</script>

<form onsubmit={handleSearch} class="search-form">
    <input
        type="search" 
        placeholder="Search products..."
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
        margin-bottom: 1.5rem; 
        width: 100%;
    }
    .search-input { 
        width: 100%;
        padding: 0.5rem; 
        border: 1px solid #ccc; 
        border-radius: 0.25rem; 
        font-size: 1rem;
    }
    .error-message { color: red; }
    .loading-message { color: #666; font-style: italic; }
</style>