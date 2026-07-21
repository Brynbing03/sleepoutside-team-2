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
        (sum, item) => sum + Number(item.finalPrice || 0),
        0
      )
    );
  
    onMount(() => {
      cartItems = getCartItems();
    });
  
    function getCartItems(): Product[] {
      const data = getLocalStorage("so-cart");
  
      if (!data) {
        return [];
      }
  
      if (Array.isArray(data)) {
        return data.filter((item) => item && item.id);
      }
  
      if (data && data.id) {
        return [data];
      }
  
      return [];
    }
  
    function getColorName(item: Product): string {
      const colors = item.colors as any;
  
      if (Array.isArray(colors)) {
        return colors[0]?.colorName || "Color not listed";
      }
  
      return colors?.colorName || "Color not listed";
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
          {#each cartItems as item, index (`${item.id}-${index}`)}
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
                  src={item.images?.primaryMedium}
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
                qty: 1
              </p>
  
              <p class="cart-card__price">
                ${Number(item.finalPrice).toFixed(2)}
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