import type { Product } from "./types.mts";
import { setLocalStorage, getLocalStorage } from "./utils.mts";
import { findProductById } from "./productData.mts";

function addProductToCart(product: Product) {
  const currentCart = getLocalStorage("so-cart") || [];

  const updatedCart = Array.isArray(currentCart)
    ? [...currentCart, product]
    : [product];

  setLocalStorage("so-cart", updatedCart);

  // Tell the header that the cart contents changed.
  document.dispatchEvent(new CustomEvent("cartUpdated"));
}

// Add to cart button event handler
async function addToCartHandler(event: Event) {
  const target = event.currentTarget as HTMLButtonElement;
  const productId = target.dataset.id;

  if (!productId) return;

  try {
    const product = await findProductById(productId);

    addProductToCart(product);

    const cartIcon = document.querySelector(".cart");

    if (cartIcon) {
      cartIcon.classList.remove("animate");

      // Force the browser to restart the animation.
      void (cartIcon as HTMLElement).offsetWidth;

      cartIcon.classList.add("animate");

      setTimeout(() => {
        cartIcon.classList.remove("animate");
      }, 600);
    }
  } catch (error) {
    console.error("Unable to add product to cart:", error);
  }
}

// Add listener to the Add to Cart button.
document
  .getElementById("addToCart")
  ?.addEventListener("click", addToCartHandler);