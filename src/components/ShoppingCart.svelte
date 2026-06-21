<script lang="ts">
    import { onMount } from "svelte";
    import { getLocalStorage, setLocalStorage } from "../js/utils.mts";
    import type { Product } from "../js/types.mts";

    let cartItems: Product[] = [];

    $: total = cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

    onMount(async () => {
        cartItems = getCartItems();
    });

    function getCartItems(): Product[] {
        const data = getLocalStorage("so-cart") || [];
        if (!data) return [];
        if (!Array.isArray(data)) return [data];
        return data;
    }

    function removeCartItem(productId: string) {
        const itemIndex = cartItems.findIndex((item) => item.id === productId);
        if (itemIndex !== -1) {
            cartItems.splice(itemIndex, 1);
            setLocalStorage("so-cart", cartItems);
            window.location.reload();
        }
    }
</script>

<main class="divider">
    <section class="products">
        <h2>My Cart</h2>
        <ul class="product-list">
            {#each cartItems as item (item.id)}
                <li class="cart-card divider">
                    <button
                        class="cart-card__remove"
                        aria-label="Remove {item.name} from cart"
                        on:click={() => removeCartItem(item.id)}
                    >
                        X
                    </button>
                    
                    <a href="#" class="cart-card__image">
                        <img
                            src={item.images?.primaryMedium}
                            alt={item.name}
                        />
                    </a>

                    <a href="#">
                        <h2 class="card__name">{item.name}</h2>
                    </a>
                    
                    <p class="cart-card__color">{item.colors[0].colorName}</p>
                    <p class="cart-card__quantity">qty: 1</p>
                    <p class="cart-card__price">${item.finalPrice}</p>
                </li>
            {:else}
                <p>Your cart is empty</p>
            {/each}
        </ul>

        {#if cartItems.length > 0}
            <div class="cart-footer">
                <p class="cart-total">Total: <span id="cart-total">{total}</span></p>
            </div>
        {/if}

    </section>
</main>
