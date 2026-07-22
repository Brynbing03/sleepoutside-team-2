import { getLocalStorage, setLocalStorage } from "./utils.mts";
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
  // console.log("cart items:", cartItems);
  const htmlItems = cartItems.map((item: Product) => cartItemTemplate(item));
  const listEl = document.querySelector(".product-list");

  if (listEl) listEl.innerHTML = htmlItems.join("");

  renderCartTotal(cartItems);
  addRemoveListeners();
}

function renderCartTotal(cartItems: Product[]) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector("#cart-total");

  if (!cartFooter || !cartTotal) return;

  if (cartItems.length === 0) {
    cartFooter.classList.add("hide");
    cartTotal.textContent = "";
    return;
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + item.finalPrice;
  }, 0);

  cartFooter.classList.remove("hide");
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function removeCartItem(productId: string) {
  const cartItems = getCartItems();

  const itemIndex = cartItems.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
  }

  setLocalStorage("so-cart", cartItems);

  // Tell the header that the cart contents changed.
  document.dispatchEvent(new CustomEvent("cartUpdated"));

  renderCartContents();
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");

  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.currentTarget as HTMLButtonElement;
      const productId = target.dataset.id;

      if (productId) {
        removeCartItem(productId);
      }
    });
  });
}

function cartItemTemplate(item: Product) {
  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.id}" aria-label="Remove ${item.name} from cart">X</button>

  <a href="#" class="cart-card__image"> 
    <img
      src="${item.images?.primaryMedium}"
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

  // console.log(item);
  return newItem;
}

renderCartContents();
