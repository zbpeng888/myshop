const products = [
  {
    name: "Microfibre Mop & Bucket Set",
    category: "Housekeeping",
    price: 34.95,
    tag: "Best seller",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=700&q=78",
  },
  {
    name: "All-Purpose Cleaning Spray Trio",
    category: "Housekeeping",
    price: 18.5,
    tag: "Kitchen + bath",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=700&q=78",
  },
  {
    name: "Heavy-Duty Garden Gloves",
    category: "Garden",
    price: 16.95,
    tag: "Outdoor ready",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=78",
  },
  {
    name: "Pruning Snips & Trowel Pack",
    category: "Garden",
    price: 29.0,
    tag: "Weekend jobs",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=78",
  },
  {
    name: "Wooden Stacking Blocks",
    category: "Kids",
    price: 24.95,
    tag: "Ages 2+",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=700&q=78",
  },
  {
    name: "Rainy Day Craft Box",
    category: "Kids",
    price: 21.5,
    tag: "Mess-friendly",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=78",
  },
  {
    name: "Men's Grooming Basics Kit",
    category: "Essentials",
    price: 32.0,
    tag: "Daily care",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=78",
  },
  {
    name: "Women's Travel Toiletry Set",
    category: "Essentials",
    price: 27.95,
    tag: "Handbag size",
    image: "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=700&q=78",
  },
];

const bundleItems = {
  "Apartment Moving-in Kit": 79,
  "Weekend Garden Reset": 69,
  "Family Week Sorted": 58,
};

const productGrid = document.querySelector("[data-product-grid]");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const searchInput = document.querySelector("[data-search]");
const cartPanel = document.querySelector("[data-cart-panel]");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const cartTotal = document.querySelector("[data-cart-total]");
const deliverySummary = document.querySelector("[data-delivery-summary]");
const cart = new Map();

let activeFilter = "All";

const money = (value) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeFilter === "All" || product.category === activeFilter;
    const matchesSearch = [product.name, product.category, product.tag]
      .join(" ")
      .toLowerCase()
      .includes(query);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = visibleProducts.length
    ? visibleProducts
        .map(
          (product) => `
            <article class="product-card">
              <span class="product-image" style="background-image: url('${product.image}')" role="img" aria-label="${product.name}"></span>
              <div class="content">
                <div class="product-meta">
                  <span>${product.category === "Essentials" ? "Men's & Women's" : product.category}</span>
                  <span>${product.tag}</span>
                </div>
                <h3>${product.name}</h3>
                <div class="price-row">
                  <span class="price">${money(product.price)}</span>
                  <button class="add-button" type="button" data-add="${product.name}" aria-label="Add ${product.name} to cart">+</button>
                </div>
              </div>
            </article>
          `
        )
        .join("")
    : `<p class="empty-cart">No products match that search yet. Try another everyday staple.</p>`;
}

function addToCart(name, price) {
  const current = cart.get(name) || { name, price, quantity: 0 };
  current.quantity += 1;
  cart.set(name, current);
  renderCart();
  openCart();
}

function changeQuantity(name, delta) {
  const item = cart.get(name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart.delete(name);
  } else {
    cart.set(name, item);
  }
  renderCart();
}

function renderCart() {
  const items = [...cart.values()];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = money(total);
  cartItems.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <div class="cart-row">
              <div>
                <strong>${item.name}</strong>
                <small>${money(item.price)} each</small>
              </div>
              <div class="qty-controls" aria-label="Quantity for ${item.name}">
                <button type="button" data-qty="${item.name}" data-delta="-1" aria-label="Remove one ${item.name}">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-qty="${item.name}" data-delta="1" aria-label="Add one more ${item.name}">+</button>
              </div>
            </div>
          `
        )
        .join("")
    : `<p class="empty-cart">Your cart is ready when you are.</p>`;
}

function openCart() {
  document.body.classList.add("cart-open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => {
    const requestedCategory = link.dataset.categoryLink;
    const button = filterButtons.find((item) => item.dataset.filter === requestedCategory);
    button?.click();
  });
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find((item) => item.name === button.dataset.add);
  addToCart(product.name, product.price);
});

document.querySelectorAll("[data-bundle]").forEach((button) => {
  button.addEventListener("click", () => {
    const bundleName = button.dataset.bundle;
    addToCart(bundleName, bundleItems[bundleName]);
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-qty]");
  if (!button) return;
  changeQuantity(button.dataset.qty, Number(button.dataset.delta));
});

document.querySelector("[data-cart-toggle]").addEventListener("click", openCart);
document.querySelector("[data-cart-close]").addEventListener("click", closeCart);
document.querySelector("[data-scrim]").addEventListener("click", closeCart);

document.querySelectorAll("input[name='delivery']").forEach((input) => {
  input.addEventListener("change", () => {
    deliverySummary.textContent = input.value;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();

