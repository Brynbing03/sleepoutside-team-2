import type { Product } from "./types.mts";
import { setLocalStorage, getLocalStorage } from "./utils.mts";
import { findProductById } from "./productData.mts";

function addProductToCart(product: Product) {
  const currentCart = getLocalStorage("so-cart") || [];
  const updatedCart = Array.isArray(currentCart)
    ? [...currentCart, product]
    : [product];
  setLocalStorage("so-cart", updatedCart);
}

// add to cart button event handler
async function addToCartHandler(e: Event) {
  const target = e.target as HTMLButtonElement;

  if (target.dataset.id) {
    const product = await findProductById(target.dataset.id);

    addProductToCart(product);

    const cartIcon = document.querySelector(".cart");

    if (cartIcon) {
      cartIcon.classList.remove("animate");

      // forces browser to restart da animation
      void (cartIcon as HTMLElement).offsetWidth;

      cartIcon.classList.add("animate");

      setTimeout(() => {
        cartIcon.classList.remove("animate");
      }, 600);
    }
  }
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  ?.addEventListener("click", addToCartHandler);
