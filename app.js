const ADMIN_PASSCODE = "rural@admin";
const categories = ["Pottery", "Handloom", "Woodwork", "Metal Craft"];
const placeholderImage =
  "https://images.unsplash.com/photo-1612785042789-6cc3bd8d662b?auto=format&fit=crop&w=900&q=80";

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    name: "Terracotta Village Vase",
    slug: "terracotta-village-vase",
    description: "Hand-thrown terracotta vase with matte red-earth finish and etched rim.",
    price: 1299,
    category: "Pottery",
    stock: "In Stock",
    featured: true,
    newArrival: true,
    artisan: "By Gopal Kumhar, Molela",
    altText: "Terracotta handcrafted village vase",
    popularity: 95,
    images: [
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1616047006789-b7af6f7f58ca?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Handloom Indigo Runner",
    slug: "handloom-indigo-runner",
    description: "Naturally dyed handloom table runner woven by women artisans collective.",
    price: 1899,
    category: "Handloom",
    stock: "Limited",
    featured: false,
    newArrival: true,
    artisan: "By Sita Women Weavers Collective",
    altText: "Handloom indigo table runner",
    popularity: 82,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Carved Neem Jewelry Box",
    slug: "carved-neem-jewelry-box",
    description: "Detailed floral carving with natural polish and hand-forged brass hinges.",
    price: 2499,
    category: "Woodwork",
    stock: "In Stock",
    featured: true,
    newArrival: false,
    artisan: "By Rafiq Chishti, Saharanpur",
    altText: "Hand carved neem wood jewelry box",
    popularity: 74,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Brass Temple Lamp",
    slug: "brass-temple-lamp",
    description: "Cast brass lamp handcrafted with heritage motifs from Tamil artisan clusters.",
    price: 3299,
    category: "Metal Craft",
    stock: "In Stock",
    featured: false,
    newArrival: false,
    artisan: "By Venkatesh Metalworks, Kumbakonam",
    altText: "Traditional brass temple lamp",
    popularity: 88,
    images: [
      "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

const state = {
  products: JSON.parse(localStorage.getItem("ra-products") || "null") || defaultProducts,
  cart: JSON.parse(localStorage.getItem("ra-cart") || "[]"),
  role: localStorage.getItem("ra-role") || "shopper",
  layout: "grid",
  selectedImages: [],
  activeProductId: null,
};

const el = {
  productList: document.getElementById("productList"),
  skeletons: document.getElementById("skeletons"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  priceFilter: document.getElementById("priceFilter"),
  sortFilter: document.getElementById("sortFilter"),
  categoryChips: document.getElementById("categoryChips"),
  cartToggle: document.getElementById("cartToggle"),
  closeCart: document.getElementById("closeCart"),
  cartPanel: document.getElementById("cartPanel"),
  cartCount: document.getElementById("cartCount"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  form: document.getElementById("productForm"),
  statsGrid: document.getElementById("statsGrid"),
  rows: document.getElementById("adminProductRows"),
  imageInput: document.getElementById("images"),
  imagePreview: document.getElementById("imagePreview"),
  cancelEdit: document.getElementById("cancelEdit"),
  dialog: document.getElementById("productDialog"),
  dialogMainImage: document.getElementById("dialogMainImage"),
  dialogThumbs: document.getElementById("dialogThumbs"),
  dialogTitle: document.getElementById("dialogTitle"),
  dialogPrice: document.getElementById("dialogPrice"),
  dialogDescription: document.getElementById("dialogDescription"),
  dialogArtisan: document.getElementById("dialogArtisan"),
  dialogAddToCart: document.getElementById("dialogAddToCart"),
  closeDialog: document.getElementById("closeDialog"),
  adminSection: document.getElementById("adminSection"),
  roleBadge: document.getElementById("roleBadge"),
  roleSwitchBtn: document.getElementById("roleSwitchBtn"),
  continueShopper: document.getElementById("continueShopper"),
  adminLoginForm: document.getElementById("adminLoginForm"),
  adminPasscode: document.getElementById("adminPasscode"),
  adminLoginMsg: document.getElementById("adminLoginMsg"),
};

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function saveState() {
  localStorage.setItem("ra-products", JSON.stringify(state.products));
  localStorage.setItem("ra-cart", JSON.stringify(state.cart));
  localStorage.setItem("ra-role", state.role);
}

function setRole(role) {
  state.role = role;
  saveState();
  applyRoleUI();
}

function applyRoleUI() {
  const isAdmin = state.role === "admin";
  el.roleBadge.textContent = isAdmin ? "Admin Mode" : "Shopper Mode";
  el.roleSwitchBtn.textContent = isAdmin ? "Switch to Shopper" : "Admin Login";
  el.adminSection.classList.toggle("hidden", !isAdmin);
  el.adminSection.setAttribute("aria-hidden", String(!isAdmin));
}

function initCategories() {
  const adminCategory = document.getElementById("category");
  [el.categoryFilter, adminCategory].forEach((select) => {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      select.append(option);
    });
  });

  el.categoryChips.innerHTML = ["all", ...categories]
    .map(
      (category) =>
        `<button class="chip ${category === "all" ? "active" : ""}" data-category="${category}">${
          category === "all" ? "All" : category
        }</button>`,
    )
    .join("");
}

function renderSkeletons() {
  el.skeletons.innerHTML = "";
  for (let i = 0; i < 4; i += 1) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    el.skeletons.append(skeleton);
  }
  setTimeout(() => {
    el.skeletons.innerHTML = "";
  }, 650);
}

function filterProducts() {
  const query = el.searchInput.value.toLowerCase().trim();
  const category = el.categoryFilter.value;
  const range = el.priceFilter.value;
  const sort = el.sortFilter.value;

  let items = [...state.products].filter((product) => {
    const searchable = `${product.name} ${product.description} ${product.artisan || ""}`.toLowerCase();
    const matchesSearch = searchable.includes(query);
    const matchesCategory = category === "all" || product.category === category;
    const [min, max] = range === "all" ? [0, Number.MAX_SAFE_INTEGER] : range.split("-").map(Number);
    const matchesPrice = product.price >= min && product.price <= max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  items.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return b.popularity - a.popularity;
  });

  return items;
}

function stockClass(stock) {
  return stock === "Out of Stock" ? "out" : "in";
}

function renderProducts() {
  const items = filterProducts();
  el.productList.className = `products ${state.layout}`;

  if (!items.length) {
    el.productList.innerHTML = "<p class='muted'>No artifacts match your filters.</p>";
    return;
  }

  el.productList.innerHTML = items
    .map(
      (product) => `
      <article class="product-card" data-id="${product.id}">
        <img src="${product.images[0] || placeholderImage}" alt="${product.altText || product.name}" loading="lazy" />
        <div class="product-meta">
          <h3>${product.name}</h3>
          <p class="muted">${product.category}</p>
          <div class="badges">
            ${product.featured ? '<span class="badge">Featured</span>' : ""}
            ${product.newArrival ? '<span class="badge">New Arrival</span>' : ""}
          </div>
          <p><strong>₹${product.price.toLocaleString("en-IN")}</strong></p>
          <p class="stock ${stockClass(product.stock)}">${product.stock}</p>
          <div class="admin-row">
            <button class="btn btn-primary tiny add-cart" data-id="${product.id}" ${
              product.stock === "Out of Stock" ? "disabled" : ""
            }>Add to Cart</button>
            <button class="btn btn-outline tiny view-product" data-id="${product.id}">View Details</button>
          </div>
        </div>
      </article>
    `,
    )
    .join("");
}

function renderStats() {
  const total = state.products.length;
  const featured = state.products.filter((p) => p.featured).length;
  const lowStock = state.products.filter((p) => p.stock === "Limited").length;
  const out = state.products.filter((p) => p.stock === "Out of Stock").length;

  el.statsGrid.innerHTML = [
    ["Total Products", total],
    ["Featured", featured],
    ["Limited Stock", lowStock],
    ["Out of Stock", out],
  ]
    .map(([label, value]) => `<article class="stat"><p>${label}</p><h3>${value}</h3></article>`)
    .join("");
}

function renderAdminRows() {
  el.rows.innerHTML = state.products
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>₹${p.price.toLocaleString("en-IN")}</td>
        <td>${p.stock}</td>
        <td>${p.featured ? "Featured " : ""}${p.newArrival ? "New" : ""}</td>
        <td>
          <button class="btn btn-outline tiny edit" data-id="${p.id}">Edit</button>
          <button class="btn btn-outline tiny delete" data-id="${p.id}">Delete</button>
        </td>
      </tr>
      `,
    )
    .join("");
}

function renderCart() {
  el.cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);

  if (!state.cart.length) {
    el.cartItems.innerHTML = '<p class="muted">Your cart is empty.</p>';
    el.cartTotal.textContent = "₹0";
    return;
  }

  el.cartItems.innerHTML = state.cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p class="muted">Qty: ${item.qty}</p>
        </div>
        <div>
          <p>₹${(item.price * item.qty).toLocaleString("en-IN")}</p>
          <button class="btn btn-outline tiny remove-cart" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `,
    )
    .join("");

  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  el.cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
}

function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(1, 1280 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = URL.createObjectURL(file);
  });
}

async function handleImageSelect(event) {
  const files = [...event.target.files];
  state.selectedImages = [];
  el.imagePreview.innerHTML = "";

  for (const file of files) {
    const compressed = await compressImage(file);
    state.selectedImages.push(compressed);
    const img = document.createElement("img");
    img.src = compressed;
    img.alt = "Selected product preview";
    el.imagePreview.append(img);
  }
}

function readForm() {
  const id = document.getElementById("productId").value || crypto.randomUUID();
  const name = document.getElementById("name").value;

  return {
    id,
    name,
    slug: slugify(name),
    description: document.getElementById("description").value,
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    stock: document.getElementById("stock").value,
    artisan: document.getElementById("artisan").value,
    altText: document.getElementById("altText").value,
    featured: document.getElementById("featured").checked,
    newArrival: document.getElementById("newArrival").checked,
    popularity: Math.floor(Math.random() * 40) + 60,
    images: state.selectedImages.length ? state.selectedImages : [placeholderImage],
  };
}

function clearForm() {
  el.form.reset();
  document.getElementById("productId").value = "";
  state.selectedImages = [];
  el.imagePreview.innerHTML = "";
}

function upsertProduct(product) {
  if (state.role !== "admin") return;
  const idx = state.products.findIndex((p) => p.id === product.id);
  if (idx > -1) {
    const old = state.products[idx];
    state.products[idx] = {
      ...old,
      ...product,
      images: product.images[0] === placeholderImage ? old.images : product.images,
    };
    return;
  }
  state.products.unshift(product);
}

function fillForm(product) {
  document.getElementById("productId").value = product.id;
  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("price").value = product.price;
  document.getElementById("category").value = product.category;
  document.getElementById("stock").value = product.stock;
  document.getElementById("artisan").value = product.artisan || "";
  document.getElementById("altText").value = product.altText || "";
  document.getElementById("featured").checked = product.featured;
  document.getElementById("newArrival").checked = product.newArrival;

  state.selectedImages = [...product.images];
  el.imagePreview.innerHTML = product.images.map((src) => `<img src="${src}" alt="Existing product preview" />`).join("");
}

function addToCart(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product || product.stock === "Out of Stock") return;

  const existing = state.cart.find((item) => item.id === productId);
  if (existing) existing.qty += 1;
  else state.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });

  saveState();
  renderCart();
}

function openDialog(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  state.activeProductId = product.id;
  el.dialogTitle.textContent = product.name;
  el.dialogPrice.textContent = `₹${product.price.toLocaleString("en-IN")}`;
  el.dialogDescription.textContent = product.description;
  el.dialogArtisan.textContent = product.artisan || "";
  el.dialogMainImage.src = product.images[0] || placeholderImage;
  el.dialogMainImage.alt = product.altText || product.name;

  el.dialogThumbs.innerHTML = product.images
    .map(
      (src) =>
        `<button class="thumb-btn" data-src="${src}" aria-label="Select image"><img src="${src}" alt="${
          product.altText || product.name
        } thumbnail" /></button>`,
    )
    .join("");

  el.dialog.showModal();
}

function rerenderAll() {
  renderProducts();
  renderStats();
  renderAdminRows();
  renderCart();
}

function bindEvents() {
  [el.searchInput, el.categoryFilter, el.priceFilter, el.sortFilter].forEach((field) => {
    field.addEventListener("input", renderProducts);
    field.addEventListener("change", renderProducts);
  });

  el.categoryChips.addEventListener("click", (event) => {
    const button = event.target.closest(".chip");
    if (!button) return;
    const { category } = button.dataset;
    el.categoryFilter.value = category;
    document.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    renderProducts();
  });

  document.querySelectorAll(".layout-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".layout-btn").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      state.layout = button.dataset.layout;
      renderProducts();
    });
  });

  el.productList.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-cart");
    const viewButton = event.target.closest(".view-product");
    if (addButton) addToCart(addButton.dataset.id);
    if (viewButton) openDialog(viewButton.dataset.id);
  });

  el.form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.role !== "admin") return;
    const product = readForm();
    upsertProduct(product);
    saveState();
    clearForm();
    rerenderAll();
  });

  el.imageInput.addEventListener("change", handleImageSelect);
  el.cancelEdit.addEventListener("click", clearForm);

  el.rows.addEventListener("click", (event) => {
    if (state.role !== "admin") return;
    const edit = event.target.closest(".edit");
    const del = event.target.closest(".delete");

    if (edit) {
      const product = state.products.find((p) => p.id === edit.dataset.id);
      if (!product) return;
      fillForm(product);
      el.form.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (del) {
      state.products = state.products.filter((p) => p.id !== del.dataset.id);
      state.cart = state.cart.filter((item) => item.id !== del.dataset.id);
      saveState();
      rerenderAll();
    }
  });

  el.continueShopper.addEventListener("click", () => {
    setRole("shopper");
    el.adminLoginMsg.textContent = "You are in shopper mode.";
  });

  el.adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (el.adminPasscode.value === ADMIN_PASSCODE) {
      setRole("admin");
      el.adminPasscode.value = "";
      el.adminLoginMsg.textContent = "Admin authenticated. Catalogue editing enabled.";
      document.getElementById("adminSection").scrollIntoView({ behavior: "smooth" });
    } else {
      setRole("shopper");
      el.adminLoginMsg.textContent = "Invalid passcode. Staying in shopper mode.";
    }
  });

  el.roleSwitchBtn.addEventListener("click", () => {
    if (state.role === "admin") {
      setRole("shopper");
      el.adminLoginMsg.textContent = "Switched to shopper mode.";
      return;
    }
    document.getElementById("onboarding").scrollIntoView({ behavior: "smooth" });
    el.adminPasscode.focus();
  });

  el.cartToggle.addEventListener("click", () => {
    el.cartPanel.classList.add("open");
    el.cartPanel.setAttribute("aria-hidden", "false");
  });

  el.closeCart.addEventListener("click", () => {
    el.cartPanel.classList.remove("open");
    el.cartPanel.setAttribute("aria-hidden", "true");
  });

  el.cartItems.addEventListener("click", (event) => {
    const remove = event.target.closest(".remove-cart");
    if (!remove) return;
    state.cart = state.cart.filter((item) => item.id !== remove.dataset.id);
    saveState();
    renderCart();
  });

  el.closeDialog.addEventListener("click", () => el.dialog.close());
  el.dialogThumbs.addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumb-btn");
    if (!thumb) return;
    el.dialogMainImage.src = thumb.dataset.src;
  });
  el.dialogAddToCart.addEventListener("click", () => {
    if (state.activeProductId) addToCart(state.activeProductId);
  });
}

function init() {
  initCategories();
  renderSkeletons();
  applyRoleUI();
  bindEvents();
  rerenderAll();
}

init();
