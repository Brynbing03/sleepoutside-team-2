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
  
    function saveCart() {
      setLocalStorage("so-cart", cartItems);
  
      document.dispatchEvent(
        new CustomEvent("cartUpdated")
      );
    }
  
    function removeCartItem(productId: string) {
      cartItems = cartItems.filter(
        (item) => item.id !== productId
      );
  
      saveCart();
    }
  
    function increaseQuantity(productId: string) {
      cartItems = cartItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: (item.quantity ?? 1) + 1
            }
          : item
      );
  
      saveCart();
    }
  
    function decreaseQuantity(productId: string) {
      cartItems = cartItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: (item.quantity ?? 1) - 1
              }
            : item
        )
        .filter((item) => (item.quantity ?? 1) > 0);
  
      saveCart();
    }
  </script>
  
  <main class="divider">
    <section class="products">
      <h2>My Cart</h2>
  
      {#if cartItems.length > 0}
        <ul class="product-list cart-product-list">
          {#each cartItems as item (item.id)}
            <li class="cart-card divider">
              <a
                href={`/products/${item.id}/`}
                class="cart-card__image"
              >
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                />
              </a>
  
              <a
                href={`/products/${item.id}/`}
                class="cart-card__name-link"
              >
                <h2 class="card__name">
                  {item.name}
                </h2>
              </a>
  
              <p class="cart-card__color">
                {getColorName(item)}
              </p>
  
              <div class="cart-card__actions">
                <div class="cart-card__quantity-controls">
                  <button
                    type="button"
                    class="quantity-button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onclick={() => decreaseQuantity(item.id)}
                  >
                    <span aria-hidden="true">−</span>
                  </button>
  
                  <span class="cart-card__quantity">
                    {item.quantity ?? 1}
                  </span>
  
                  <button
                    type="button"
                    class="quantity-button"
                    aria-label={`Increase quantity of ${item.name}`}
                    onclick={() => increaseQuantity(item.id)}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
  
                <button
                  type="button"
                  class="cart-card__remove"
                  aria-label={`Remove all ${item.name} from cart`}
                  title="Remove item"
                  onclick={() => removeCartItem(item.id)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
  
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
  
  <style>
    .cart-card__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.65rem;
    }
  
    .cart-card__quantity-controls {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      overflow: hidden;
      border: 1px solid #b7b7b7;
      border-radius: 0.4rem;
      background: #fff;
    }
  
    .quantity-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.4rem;
      height: 2.4rem;
      margin: 0;
      padding: 0;
      border: none;
      border-radius: 0;
      background: #f4f4f4;
      color: #222;
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
    }
  
    .quantity-button:first-child {
      border-right: 1px solid #b7b7b7;
    }
  
    .quantity-button:last-child {
      border-left: 1px solid #b7b7b7;
    }
  
    .quantity-button:hover {
      background: #e7e7e7;
    }
  
    .quantity-button:focus-visible,
    .cart-card__remove:focus-visible {
      outline: 3px solid #f4a261;
      outline-offset: 2px;
    }
  
    .cart-card__quantity {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.75rem;
      height: 2.4rem;
      padding: 0 0.35rem;
      background: #fff;
      color: #222;
      font-weight: 700;
      text-align: center;
    }
  
    .cart-card__remove {
      position: static;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.4rem;
      height: 2.4rem;
      margin: 0;
      padding: 0;
      border: 1px solid #c8c8c8;
      border-radius: 0.4rem;
      background: #fff;
      color: #555;
      font-size: 1.35rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
    }
  
    .cart-card__remove:hover {
      border-color: #b42318;
      background: #fff1f0;
      color: #b42318;
    }
  </style>