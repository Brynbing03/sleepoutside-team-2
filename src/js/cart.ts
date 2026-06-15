import { getLocalStorage } from "./utils.mjs";
import type { Product } from "./types.mts";

function getCartItems(): Product[] {
  const data = getLocalStorage("so-cart") || [];

  if (!data) {
    return [];
  }

  if (!Array.isArray(data)) {
    return [data];
  }

  return data;
}

function renderCartContents() {
  const cartItems = getCartItems();
  const htmlItems = cartItems.map((item: Product) => cartItemTemplate(item));
  const listEl = document.querySelector(".product-list");
  if (listEl) listEl.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item: Product) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image"> 
    <img
      src="${item.images}"
      alt="${item.name}" 
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.name}</h2>
  </a>
  <p class="cart-card__color">${item.colors[0].colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.finalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
