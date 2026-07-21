import type { Product } from "./types.mts";
import { setLocalStorage, getLocalStorage } from "./utils.mts";
import { findProductById } from "./productData.mts";

function addProductToCart(product: Product) {
  const storedCart = getLocalStorage("so-cart");

  const currentCart: Product[] = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart]
      : [];

  const existingItemIndex = currentCart.findIndex(
    (item) => item.id === product.id
  );

  if (existingItemIndex !== -1) {
    const existingItem = currentCart[existingItemIndex];

    currentCart[existingItemIndex] = {
      ...existingItem,
      quantity: (existingItem.quantity ?? 1) + 1
    };
  } else {
    currentCart.push({
      ...product,
      quantity: 1
    });
  }

  setLocalStorage("so-cart", currentCart);

  document.dispatchEvent(new CustomEvent("cartUpdated"));
}

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

document
  .getElementById("addToCart")
  ?.addEventListener("click", addToCartHandler);