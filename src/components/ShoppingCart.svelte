<script lang="ts">
    import { onMount } from "svelte";
    import {
      getLocalStorage,
      setLocalStorage
    } from "../js/utils.mts";
    import type { Product } from "../js/types.mts";
  
    let cartItems: Product[] = $state([]);
  
    let total = $derived(
      cartItems.reduce(
        (sum, item) =>
          sum +
          Number(item.finalPrice || 0) *
            (item.quantity ?? 1),
        0
      )
    );
  
    onMount(() => {
      cartItems = getCartItems();
    });
  
    function getCartItems(): Product[] {
      const storedData = getLocalStorage("so-cart");
  
      if (!storedData) {
        return [];
      }
  
      const storedItems = Array.isArray(storedData)
        ? storedData
        : [storedData];
  
      const combinedItems = new Map<string, Product>();
  
      for (const rawItem of storedItems) {
        if (!rawItem || typeof rawItem !== "object") {
          continue;
        }
  
        // Support current and older product ID formats.
        const productId =
          rawItem.id ??
          rawItem._id ??
          rawItem.Id;
  
        if (!productId) {
          console.warn(
            "Cart item was missing a product ID:",
            rawItem
          );
          continue;
        }
  
        const normalizedItem = {
          ...rawItem,
          id: String(productId),
          quantity: Number(rawItem.quantity ?? 1)
        } as Product;
  
        const existingItem = combinedItems.get(
          normalizedItem.id
        );
  
        if (existingItem) {
          existingItem.quantity =
            (existingItem.quantity ?? 1) +
            (normalizedItem.quantity ?? 1);
        } else {
          combinedItems.set(
            normalizedItem.id,
            normalizedItem
          );
        }
      }
  
      const cleanedCart = Array.from(
        combinedItems.values()
      );
  
      // Save the migrated cart so old duplicate entries
      // become one entry with a quantity.
      setLocalStorage("so-cart", cleanedCart);
  
      document.dispatchEvent(
        new CustomEvent("cartUpdated")
      );
  
      return cleanedCart;
    }
  
    function getColorName(item: Product): string {
      if (Array.isArray(item.colors)) {
        return (
          item.colors[0]?.colorName ||
          "Color not listed"
        );
      }
  
      return "Color not listed";
    }
  
    function getImageUrl(item: Product): string {
      const imageUrl =
        item.images?.primaryMedium ||
        item.images?.primaryLarge ||
        item.images?.primarySmall ||
        "";
  
      if (imageUrl.startsWith("//")) {
        return `https:${imageUrl}`;
      }
  
      return imageUrl;
    }
  
    function removeCartItem(productId: string) {
      cartItems = cartItems.filter(
        (item) => item.id !== productId
      );
  
      setLocalStorage("so-cart", cartItems);
  
      document.dispatchEvent(
        new CustomEvent("cartUpdated")
      );
    }
  </script>
  
  <main class="divider">
    <section class="products">
      <h2>My Cart</h2>
  
      {#if cartItems.length > 0}
        <ul class="product-list">
          {#each cartItems as item (item.id)}
            <li class="cart-card divider">
              <button
                type="button"
                class="cart-card__remove"
                aria-label={`Remove ${item.name} from cart`}
                onclick={() => removeCartItem(item.id)}
              >
                X
              </button>
  
              <a
                href={`/products/${item.id}/`}
                class="cart-card__image"
              >
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                />
              </a>
  
              <a href={`/products/${item.id}/`}>
                <h2 class="card__name">
                  {item.name}
                </h2>
              </a>
  
              <p class="cart-card__color">
                {getColorName(item)}
              </p>
  
              <p class="cart-card__quantity">
                qty: {item.quantity ?? 1}
              </p>
  
              <p class="cart-card__price">
                ${(Number(item.finalPrice) *
                  (item.quantity ?? 1)).toFixed(2)}
              </p>
            </li>
          {/each}
        </ul>
  
        <div class="cart-footer">
          <p class="cart-total">
            Total:
            <span id="cart-total">
              ${total.toFixed(2)}
            </span>
          </p>
        </div>
      {:else}
        <p class="empty-cart-message">
          Your cart is empty
        </p>
      {/if}
    </section>
  </main>