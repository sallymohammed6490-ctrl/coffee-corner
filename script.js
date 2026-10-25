// Coffee & Corner - shopping cart
// This is a front-end demo: it does not process real payments or orders.

const addButtons = document.querySelectorAll(".add-to-cart");
const cartItemsElement = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const navCartCountElement = document.getElementById("nav-cart-count");
const cartTotalElement = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");
const yearElement = document.getElementById("year");

// Keep one entry per product and track its quantity.

let cart = JSON.parse(localStorage.getItem("coffeeCornerCart")) || [];

function updateCart() {
  cartItemsElement.replaceChildren();

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-cart";
    emptyMessage.textContent = "Your cart is empty.";
    cartItemsElement.appendChild(emptyMessage);
  }

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    const product = document.createElement("div");
    product.className = "cart-product";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const price = document.createElement("small");
    price.textContent = `$${item.price.toFixed(2)} each`;

    product.append(name, price);

    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const minusButton = document.createElement("button");
    minusButton.className = "quantity-button";
    minusButton.type = "button";
    minusButton.textContent = "−";
    minusButton.setAttribute("aria-label", `Remove one ${item.name}`);
    minusButton.addEventListener("click", () => changeQuantity(item.name, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plusButton = document.createElement("button");
    plusButton.className = "quantity-button";
    plusButton.type = "button";
    plusButton.textContent = "+";
    plusButton.setAttribute("aria-label", `Add one ${item.name}`);
    plusButton.addEventListener("click", () => changeQuantity(item.name, 1));

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeProduct(item.name));

    controls.append(minusButton, quantity, plusButton, removeButton);
    row.append(product, controls);
    cartItemsElement.appendChild(row);
  });

  cartCountElement.textContent = totalItems;
  navCartCountElement.textContent = totalItems;
  cartTotalElement.textContent = totalPrice.toFixed(2);
  localStorage.setItem("coffeeCornerCart", JSON.stringify(cart));
}

function addProduct(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCart();
}

function changeQuantity(name, amount) {
  const item = cart.find((product) => product.name === name);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.name !== name);
  }

  updateCart();
}

function removeProduct(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCart();
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (!name || !Number.isFinite(price) || price < 0) return;

    addProduct(name, price);
  });
});

clearCartButton.addEventListener("click", () => {
  cart = [];
  updateCart();
});

yearElement.textContent = new Date().getFullYear();
updateCart();
