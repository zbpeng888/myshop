"use client";

import { useMemo, useState } from "react";

type Category =
  | "Housekeeping"
  | "Gardening"
  | "Kids Toys"
  | "Men's Essentials"
  | "Women's Essentials"
  | "Kitchen";

type CategoryFilter = "All" | Category;
type SortMode = "featured" | "price-low" | "price-high" | "rating";

type Product = {
  name: string;
  category: Category;
  price: number;
  rating: number;
  tag: string;
  image: string;
  images?: string[];
  description: string;
};

type CartItem = Product & {
  quantity: number;
};

const categories: CategoryFilter[] = [
  "All",
  "Housekeeping",
  "Gardening",
  "Kids Toys",
  "Men's Essentials",
  "Women's Essentials",
  "Kitchen",
];

const products: Product[] = [
  {
    name: "Microfiber Deep-Clean Kit",
    category: "Housekeeping",
    price: 24.99,
    rating: 4.9,
    tag: "Best seller",
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=700&q=80",
    description:
      "Color-coded cloths, scrub pads, and glass towels for weekly cleaning.",
  },
  {
    name: "Telescoping Dust Mop",
    category: "Housekeeping",
    price: 31.5,
    rating: 4.7,
    tag: "Lightweight",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=700&q=80",
    description:
      "Reaches baseboards, corners, ceiling fans, and smooth floors.",
  },
  {
    name: "Bypass Pruner Set",
    category: "Gardening",
    price: 19.95,
    rating: 4.8,
    tag: "Sharp cut",
    image:
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=700&q=80",
    description:
      "Comfort-grip pruners for herbs, shrubs, flowers, and small branches.",
  },
  {
    name: "Compact Garden Tool Caddy",
    category: "Gardening",
    price: 42,
    rating: 4.6,
    tag: "Organized",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80",
    description:
      "Hand trowel, cultivator, gloves, and tote for weekend yard work.",
  },
  {
    name: "Wooden Building Blocks",
    category: "Kids Toys",
    price: 27.75,
    rating: 4.9,
    tag: "Ages 3+",
    image: "/assets/kids-toys-blocks.png",
    images: [
      "/assets/kids-toys-blocks.png",
      "/assets/kids-toys-soft.png",
      "/assets/kids-toys-vehicles.png",
      "/assets/kids-toys-outdoor.png",
    ],
    description:
      "Bright stacking blocks for creative play, sorting, and simple patterns.",
  },
  {
    name: "Outdoor Chalk & Bubble Pack",
    category: "Kids Toys",
    price: 15.49,
    rating: 4.5,
    tag: "Play day",
    image: "/assets/kids-toys-outdoor.png",
    images: [
      "/assets/kids-toys-outdoor.png",
      "/assets/kids-toys-vehicles.png",
      "/assets/kids-toys-blocks.png",
      "/assets/kids-toys-soft.png",
    ],
    description:
      "Sidewalk chalk, bubble wands, and refill mix for backyard afternoons.",
  },
  {
    name: "Men's Grooming Travel Roll",
    category: "Men's Essentials",
    price: 38,
    rating: 4.7,
    tag: "Travel ready",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=80",
    description:
      "Compact toiletry storage with sections for razor, comb, brush, and care items.",
  },
  {
    name: "Daily Shave & Skin Set",
    category: "Men's Essentials",
    price: 29.25,
    rating: 4.6,
    tag: "Daily care",
    image:
      "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=700&q=80",
    description:
      "Shave cream, aftercare balm, face towel, and brush for morning routines.",
  },
  {
    name: "Women's Everyday Care Pouch",
    category: "Women's Essentials",
    price: 34.8,
    rating: 4.8,
    tag: "Refill pick",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
    description:
      "A tidy pouch for skincare, hair ties, wipes, and daily personal basics.",
  },
  {
    name: "Soft Hair & Body Basics",
    category: "Women's Essentials",
    price: 22.4,
    rating: 4.5,
    tag: "Gentle",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
    description:
      "Soft towel wrap, detangling brush, and bath staples for easy routines.",
  },
  {
    name: "Stackable Pantry Containers",
    category: "Kitchen",
    price: 32.99,
    rating: 4.7,
    tag: "Airtight",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=700&q=80",
    description:
      "Clear containers for cereals, snacks, flour, pasta, and leftovers.",
  },
  {
    name: "Dish Brush & Sink Tray",
    category: "Kitchen",
    price: 17.9,
    rating: 4.4,
    tag: "Sink tidy",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80",
    description:
      "Quick-dry brush, scraper, and tray for a cleaner dish station.",
  },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6h15l-1.5 8.5H8L6 3H3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 6h14" />
      <path d="M7 12h10" />
      <path d="M7 18h6" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [checkoutText, setCheckoutText] = useState("Checkout");

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products
      .filter((product) => {
        const categoryMatch =
          activeCategory === "All" || product.category === activeCategory;
        const text =
          `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return categoryMatch && (!query || text.includes(query));
      })
      .sort((a, b) => {
        if (sortMode === "price-low") return a.price - b.price;
        if (sortMode === "price-high") return b.price - a.price;
        if (sortMode === "rating") return b.rating - a.rating;
        return products.indexOf(a) - products.indexOf(b);
      });
  }, [activeCategory, searchQuery, sortMode]);

  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current[product.name];
      return {
        ...current,
        [product.name]: {
          ...product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  }

  function handleCheckout() {
    if (totalItems === 0) return;
    setCheckoutText("Basket ready");
    window.setTimeout(() => setCheckoutText("Checkout"), 1400);
  }

  return (
    <>
      <header className="topbar">
        <nav className="shell nav" aria-label="Main navigation">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <HomeIcon />
            </span>
            Everyday Goods Co.
          </div>
          <div className="nav-links">
            <a href="#shop">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#cart">Basket</a>
            <a href="#support">Support</a>
          </div>
          <div className="cart-pill" aria-live="polite">
            <CartIcon />
            <span>{totalItems}</span> items
          </div>
        </nav>
      </header>

      <main>
        <section className="shell hero" aria-labelledby="pageTitle">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Home, garden, play, and daily care</p>
              <h1 id="pageTitle">Everyday products for busy homes.</h1>
              <p>
                Browse practical picks for cleaning, repairs, gardening, kids,
                grooming, personal care, kitchen basics, and pet-friendly
                routines.
              </p>
              <div className="hero-actions">
                <a className="button" href="#shop">
                  <ArrowIcon />
                  Shop essentials
                </a>
                <a className="button secondary" href="#categories">
                  <GridIcon />
                  View categories
                </a>
              </div>
            </div>
            <div className="hero-media" aria-label="Featured product categories">
              <figure className="image-tile large">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
                  alt="Organized household cleaning products and tools"
                />
                <figcaption className="tile-label">
                  Housekeeping tools
                </figcaption>
              </figure>
              <figure className="image-tile">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80"
                  alt="Gardening tools and plants arranged outdoors"
                />
                <figcaption className="tile-label">Garden care</figcaption>
              </figure>
              <figure className="image-tile">
                <img
                  src="/assets/kids-toys-blocks.png"
                  alt="Colorful kids toys arranged in a playroom"
                />
                <figcaption className="tile-label">Kids toys</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="shell stats" aria-label="Store highlights">
          <div className="stat">
            <strong>120+</strong>
            <span>daily-use picks</span>
          </div>
          <div className="stat">
            <strong>8</strong>
            <span>home categories</span>
          </div>
          <div className="stat">
            <strong>24 hr</strong>
            <span>fast dispatch</span>
          </div>
          <div className="stat">
            <strong>4.8</strong>
            <span>average rating</span>
          </div>
        </section>

        <section className="shell" id="categories" aria-labelledby="categoryTitle">
          <div className="section-head">
            <div>
              <h2 id="categoryTitle">Shop By Need</h2>
              <p>
                Jump into the routines that keep a household moving: clean
                rooms, cared-for yards, stocked bathrooms, quick fixes, and
                rainy-day play.
              </p>
            </div>
          </div>
          <div className="mini-categories">
            <div className="mini-card">
              <span className="mini-icon green">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 21h10" />
                  <path d="M12 3v18" />
                  <path d="M5 10h14" />
                  <path d="M7 10l2 11" />
                  <path d="M17 10l-2 11" />
                </svg>
              </span>
              <strong>Housekeeping</strong>
              <span>Cleaning kits, mops, dusters</span>
            </div>
            <div className="mini-card">
              <span className="mini-icon blue">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 22V8" />
                  <path d="M5 12c0-4 3-8 7-10 4 2 7 6 7 10a7 7 0 0 1-14 0Z" />
                </svg>
              </span>
              <strong>Gardening</strong>
              <span>Pruners, hoses, soil gear</span>
            </div>
            <div className="mini-card">
              <span className="mini-icon coral">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 9h14v10H5z" />
                  <path d="M8 9V6a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <strong>Kids Toys</strong>
              <span>Crafts, blocks, outdoor play</span>
            </div>
            <div className="mini-card">
              <span className="mini-icon gold">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 3h12l-1 18H7L6 3Z" />
                  <path d="M8 7h8" />
                  <path d="M9 11h6" />
                </svg>
              </span>
              <strong>Personal Care</strong>
              <span>Men&apos;s and women&apos;s basics</span>
            </div>
            <div className="mini-card">
              <span className="mini-icon dark">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h16" />
                  <path d="M6 8h12" />
                  <path d="M8 4h8" />
                  <path d="M7 12l1.5 8h7L17 12" />
                </svg>
              </span>
              <strong>Kitchen</strong>
              <span>Storage, prep, dish care</span>
            </div>
          </div>
        </section>

        <section className="shell" id="shop" aria-labelledby="shopTitle">
          <div className="section-head">
            <div>
              <h2 id="shopTitle">Popular Products</h2>
              <p>
                Filter the catalog and build a quick basket for everyday
                errands, house projects, weekend yard work, and family restocks.
              </p>
            </div>
          </div>

          <div className="controls" aria-label="Product filters">
            <label className="control">
              <span className="sr-only">Search products</span>
              <SearchIcon />
              <input
                type="search"
                placeholder="Search tools, toys, essentials..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <label className="control">
              <span className="sr-only">Sort products</span>
              <SortIcon />
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>

          <div className="category-row" aria-label="Category filters">
            {categories.map((category) => (
              <button
                className={`category-button ${
                  activeCategory === category ? "active" : ""
                }`}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category === "All" ? "All products" : category}
              </button>
            ))}
          </div>

          <div className="main-layout">
            <div>
              <div className="product-grid" aria-live="polite">
                {visibleProducts.map((product) => {
                  const images = product.images ?? [product.image];
                  return (
                    <article className="product-card" key={product.name}>
                      <div
                        className={`product-photo ${
                          product.images ? "rotating-photo" : ""
                        }`}
                      >
                        {images.map((image, index) => (
                          <img
                            src={image}
                            alt={index === 0 ? product.name : ""}
                            key={image}
                            style={{ animationDelay: `${index * 4}s` }}
                          />
                        ))}
                        <span className="badge">{product.tag}</span>
                      </div>
                      <div className="product-body">
                        <div className="product-meta">
                          <span>{product.category}</span>
                          <span className="rating">
                            {product.rating.toFixed(1)} stars
                          </span>
                        </div>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="product-footer">
                          <span className="price">{money(product.price)}</span>
                          <button
                            className="add-button"
                            type="button"
                            aria-label={`Add ${product.name} to basket`}
                            title="Add to basket"
                            onClick={() => addToCart(product)}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <p
                className="no-results"
                style={{ display: visibleProducts.length ? "none" : "block" }}
              >
                No products match that filter. Try another category or search
                term.
              </p>
            </div>

            <aside className="cart-panel" id="cart" aria-labelledby="basketTitle">
              <header>
                <h2 id="basketTitle">Quick Basket</h2>
                <p>
                  Choose products from the catalog and the basket will update
                  here.
                </p>
              </header>
              <div className="cart-list">
                {cartItems.length ? (
                  cartItems.map((item) => (
                    <div className="cart-item" key={item.name}>
                      <strong>{item.name}</strong>
                      <span>{money(item.price * item.quantity)}</span>
                      <span>
                        {item.quantity} x {money(item.price)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="empty-cart">Your basket is empty.</p>
                )}
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
              <button
                className="checkout"
                type="button"
                disabled={totalItems === 0}
                onClick={handleCheckout}
              >
                {checkoutText}
              </button>
            </aside>
          </div>
        </section>

        <section className="shell promo-band" id="support">
          <div>
            <h2>Restock the whole household in one pass.</h2>
            <p>
              Combine cleaning supplies, yard tools, toys, grooming basics, and
              kitchen helpers in a single practical shop.
            </p>
          </div>
          <a className="button" href="#shop">
            <ArrowIcon />
            Browse products
          </a>
        </section>
      </main>

      <footer>
        <div className="shell">
          Everyday Goods Co. Sample HTML storefront for everyday household
          products.
        </div>
      </footer>
    </>
  );
}
