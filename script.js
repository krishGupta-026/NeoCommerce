// NeoCommerce Cart System with Indian Rupees
class NeoCommerceCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("neoCommerceCart")) || [];
    // Update the products object in your existing cart system
    this.products = {
      1: {
        id: 1,
        name: "Luminous Solar On-Grid/GTI Solar Inverter",
        price: 45769,
        image:
          "solar invereter.webp",
        category: "Gaming",
      },
      2: {
        id: 2,
        name: "Luminous Solar Combo",
        price: 25769,
        image:
          "solar combo.jpg",
        category: "Fashion",
      },
      3: {
        id: 3,
        name: "Solar Charge Controller",
        price: 1000,
        image:
          "controllernew.webp",
        category: "Tech",
      },
      4: {
        id: 4,
        name: "Neural Enhancement Glasses",
        price: 74699,
        image:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=200&fit=crop",
        category: "Wearables",
      },
      5: {
        id: 5,
        name: "Gravity-Defying Sneakers",
        price: 41499,
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop",
        category: "Footwear",
      },
      // New Products 6-15
      6: {
        id: 6,
        name: "Quantum Gaming Mouse",
        price: 8299,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop&sat=-100&hue=240",
        category: "Gaming",
      },
      7: {
        id: 7,
        name: "Holographic Smartwatch",
        price: 49999,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
        category: "Wearables",
      },
      8: {
        id: 8,
        name: "VR Gaming Headset Pro",
        price: 83299,
        image:
          "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=300&h=200&fit=crop",
        category: "Gaming",
      },
      9: {
        id: 9,
        name: "Smart Contact Lenses",
        price: 124999,
        image:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=200&fit=crop",
        category: "Wearables",
      },
      10: {
        id: 10,
        name: "Neon Tech Backpack",
        price: 12499,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
        category: "Accessories",
      },
      11: {
        id: 11,
        name: "Cyber Running Shoes",
        price: 33299,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
        category: "Footwear",
      },
      12: {
        id: 12,
        name: "Quantum Wireless Earbuds",
        price: 16599,
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop",
        category: "Tech",
      },
      13: {
        id: 13,
        name: "Holographic Fashion Ring",
        price: 7999,
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
        category: "Accessories",
      },
      14: {
        id: 14,
        name: "Cyberpunk Gaming Chair",
        price: 58999,
        image:
          "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=300&h=200&fit=crop",
        category: "Gaming",
      },
      15: {
        id: 15,
        name: "Neon Bomber Jacket",
        price: 22499,
        image:
          "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=300&h=200&fit=crop",
        category: "Fashion",
      },
    };

    this.init();
  }

  // Format price in Indian rupee format
  formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Alternative formatting for Indian numbering system
  formatPriceIndian(amount) {
    const formatter = new Intl.NumberFormat("en-IN");
    return `₹${formatter.format(amount)}`;
  }

  init() {
    this.updateCartCount();
    this.setupEventListeners();
    this.updateCartDisplay();
  }

  setupEventListeners() {
    // Cart link click
    document.querySelector(".cart-link").addEventListener("click", (e) => {
      e.preventDefault();
      this.openCart();
    });

    // Close cart button
    document.getElementById("closeCartBtn").addEventListener("click", () => {
      this.closeCart();
    });

    // Cart overlay click to close
    document.getElementById("cartOverlay").addEventListener("click", (e) => {
      if (e.target.id === "cartOverlay") {
        this.closeCart();
      }
    });

    // Escape key to close cart
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCart();
      }
    });
  }

  addToCart(productId) {
    const product = this.products[productId];
    if (!product) return;

    const existingItem = this.cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.updateCartDisplay();
    this.showToast(
      "success",
      "Added to cart!",
      `${product.name} has been added to your cart.`
    );
    this.animateAddToCart(productId);
  }

  removeFromCart(productId) {
    const itemIndex = this.cart.findIndex((item) => item.id === productId);
    if (itemIndex > -1) {
      const product = this.cart[itemIndex];
      this.cart.splice(itemIndex, 1);
      this.saveCart();
      this.updateCartCount();
      this.updateCartDisplay();
      this.showToast(
        "error",
        "Removed from cart",
        `${product.name} has been removed from your cart.`
      );
    }
  }

  updateQuantity(productId, newQuantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
      this.saveCart();
      this.updateCartCount();
      this.updateCartDisplay();
    } else if (newQuantity <= 0) {
      this.removeFromCart(productId);
    }
  }

  clearCart() {
    if (this.cart.length === 0) return;

    if (confirm("Are you sure you want to clear your cart?")) {
      this.cart = [];
      this.saveCart();
      this.updateCartCount();
      this.updateCartDisplay();
      this.showToast(
        "success",
        "Cart cleared",
        "All items have been removed from your cart."
      );
    }
  }

  openCart() {
    const overlay = document.getElementById("cartOverlay");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeCart() {
    const overlay = document.getElementById("cartOverlay");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cartCount");

    cartCountEl.textContent = totalItems;
    cartCountEl.classList.toggle("hidden", totalItems === 0);
  }

  updateCartDisplay() {
    const emptyCart = document.getElementById("emptyCart");
    const cartItems = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartFooter");

    if (this.cart.length === 0) {
      emptyCart.style.display = "block";
      cartItems.innerHTML = "";
      cartFooter.style.display = "none";
    } else {
      emptyCart.style.display = "none";
      cartFooter.style.display = "block";
      this.renderCartItems();
      this.updateCartTotal();
    }
  }

  renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = "";

    this.cart.forEach((item) => {
      const cartItemEl = document.createElement("div");
      cartItemEl.className = "cart-item";
      cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${this.formatPriceIndian(
                      item.price
                    )}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cart.updateQuantity(${
                              item.id
                            }, ${item.quantity - 1})">−</button>
                            <span class="quantity-display">${
                              item.quantity
                            }</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity(${
                              item.id
                            }, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item-btn" onclick="cart.removeFromCart(${
                          item.id
                        })">Remove</button>
                    </div>
                </div>
            `;
      cartItemsContainer.appendChild(cartItemEl);
    });
  }

  updateCartTotal() {
    const total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    document.getElementById("cartTotal").textContent =
      this.formatPriceIndian(total);
  }

  animateAddToCart(productId) {
    const button = document.querySelector(
      `[data-product-id="${productId}"] .add-to-cart-btn`
    );
    if (button) {
      button.classList.add("added");
      button.textContent = "Added!";

      setTimeout(() => {
        button.classList.remove("added");
        button.textContent = "Add to Cart";
      }, 1500);
    }
  }

  showToast(type, title, description) {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
            <div class="toast-message">${title}</div>
            <div class="toast-description">${description}</div>
        `;

    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  checkout() {
    if (this.cart.length === 0) {
      this.showToast(
        "error",
        "Cart is empty",
        "Add some products before checkout."
      );
      return;
    }

    const total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    // Simulate checkout process
    this.showToast(
      "success",
      "Checkout initiated!",
      `Processing ${itemCount} items worth ${this.formatPriceIndian(total)}`
    );

    setTimeout(() => {
      alert(
        `🚀 Welcome to the Future of Checkout!\n\nOrder Summary:\n${itemCount} items\nTotal: ${this.formatPriceIndian(
          total
        )}\n\nThis is a demo - checkout functionality would be implemented here with payment processing!\n\n💳 Payment methods: UPI, Cards, Net Banking, Wallets`
      );

      // Clear cart after successful checkout
      this.cart = [];
      this.saveCart();
      this.updateCartCount();
      this.updateCartDisplay();
      this.closeCart();

      this.showToast(
        "success",
        "Order placed!",
        "Your futuristic products are on the way!"
      );
    }, 1500);
  }

  saveCart() {
    localStorage.setItem("neoCommerceCart", JSON.stringify(this.cart));
  }

  getCartItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// Initialize cart system
const cart = new NeoCommerceCart();

// Global functions for HTML onclick events
function addToCart(productId) {
  cart.addToCart(productId);
}

function clearCart() {
  cart.clearCart();
}

function checkout() {
  cart.checkout();
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Enhanced Interactive Features
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#cart") return; // Cart handled by cart system

      e.preventDefault();
      const targetId = this.getAttribute("href");

      if (targetId === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (targetId === "#products") {
        document
          .getElementById("products")
          .scrollIntoView({ behavior: "smooth" });
      }

      // Update active navigation
      navLinks.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Enhanced product cards with hover effects
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Feature cards animation
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.05)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Enhanced button interactions
  const buttons = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .view-details-btn, .view-all-btn"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Parallax effect for hero section
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector(".particles-bg");
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.8s ease-out forwards";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll(
    ".section-header, .product-card, .feature-card"
  );
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Product rating interaction
  const ratings = document.querySelectorAll(".rating");
  ratings.forEach((rating) => {
    rating.addEventListener("mouseenter", function () {
      const star = this.querySelector(".star");
      star.style.transform = "scale(1.2) rotate(360deg)";
      star.style.transition = "transform 0.5s ease";
    });

    rating.addEventListener("mouseleave", function () {
      const star = this.querySelector(".star");
      star.style.transform = "scale(1) rotate(0deg)";
    });
  });

  // Logout button functionality
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        cart.showToast("success", "Logged out", "See you in the future!");
        // Logout functionality would be implemented here
      }
    });
  }

  console.log("🚀 NeoCommerce with full cart functionality loaded!");
  console.log(`✨ Cart items: ${cart.getCartItemCount()}`);
  console.log(`💰 Cart total: ${cart.formatPriceIndian(cart.getCartTotal())}`);
});

// CSS Animation for ripple effect
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);
// Session Management System for NeoCommerce
class SessionManager {
  constructor() {
    this.user = null;
    this.init();
  }

  init() {
    this.checkLoginStatus();
    this.setupSessionHandlers();
    this.updateUIBasedOnLoginStatus();
  }

  // Check if user is logged in on page load
  checkLoginStatus() {
    const userData = localStorage.getItem("neoCommerceUser");
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        // Validate session hasn't expired (optional - set expiry time)
        if (this.isSessionValid()) {
          this.onUserLoggedIn();
        } else {
          this.logout();
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        this.logout();
      }
    } else {
      this.onUserLoggedOut();
    }
  }

  // Check if session is still valid
  isSessionValid() {
    if (!this.user) return false;

    // Check if session has expired (24 hours by default)
    const loginTime = new Date(this.user.loginTime || this.user.signupTime);
    const expiryTime = new Date(loginTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const now = new Date();

    return now < expiryTime;
  }

  // When user is logged in
  onUserLoggedIn() {
    console.log("User logged in:", this.user);
    this.updateHeaderForLoggedInUser();
    this.showWelcomeMessage();
    this.updateCartWithUser();
  }

  // When user is logged out
  onUserLoggedOut() {
    console.log("User not logged in");
    this.updateHeaderForLoggedOutUser();
  }

  // Update header for logged-in user
  updateHeaderForLoggedInUser() {
    const userSection = document.querySelector(".user-section");
    if (userSection) {
      const userName = this.user.firstName
        ? `${this.user.firstName} ${this.user.lastName || ""}`.trim()
        : this.user.name || this.user.email.split("@")[0];

      userSection.innerHTML = `
                <div class="user-info logged-in">
                    <div class="user-avatar">
                        <span class="avatar-icon">${userName
                          .charAt(0)
                          .toUpperCase()}</span>
                    </div>
                    <div class="user-details">
                        <span class="username">${userName}</span>
                        <span class="user-status">Welcome back!</span>
                    </div>
                </div>
                <div class="user-dropdown">
                    <button class="user-menu-btn" id="userMenuBtn">
                        <span class="menu-icon">▼</span>
                    </button>
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="#profile" class="dropdown-item">
                            <span class="item-icon">👤</span>
                            My Profile
                        </a>
                        <a href="#orders" class="dropdown-item">
                            <span class="item-icon">📦</span>
                            My Orders
                        </a>
                        <a href="#wishlist" class="dropdown-item">
                            <span class="item-icon">❤️</span>
                            Wishlist
                        </a>
                        <a href="#settings" class="dropdown-item">
                            <span class="item-icon">⚙️</span>
                            Settings
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item logout-item" onclick="sessionManager.logout()">
                            <span class="item-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            `;

      // Setup dropdown functionality
      this.setupUserDropdown();
    }
  }

  // Update header for logged-out user
  updateHeaderForLoggedOutUser() {
    const userSection = document.querySelector(".user-section");
    if (userSection) {
      userSection.innerHTML = `
                <div class="auth-buttons">
                    <a href="login.html" class="login-btn">Sign In</a>
                    <a href="signup.html" class="signup-btn">Join Now</a>
                </div>
            `;
    }
  }

  // Setup user dropdown menu
  setupUserDropdown() {
    const menuBtn = document.getElementById("userMenuBtn");
    const dropdown = document.getElementById("userDropdown");

    if (menuBtn && dropdown) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove("show");
        }
      });
    }
  }

  // Show personalized welcome message
  showWelcomeMessage() {
    const userName = this.user.firstName || this.user.name || "there";

    // Update hero section if exists
    const heroTitle = document.querySelector(".hero-title .title-white");
    if (
      (heroTitle && window.location.pathname.includes("index.html")) ||
      window.location.pathname === "/"
    ) {
      heroTitle.innerHTML = `Welcome Back, ${userName}!<br>Experience Tomorrow`;
    }

    // Show personalized toast
    setTimeout(() => {
      this.showToast(
        "success",
        `Welcome back, ${userName}!`,
        "Ready to explore the future of shopping?"
      );
    }, 1000);
  }

  // Update cart with user information
  updateCartWithUser() {
    if (window.cart) {
      window.cart.user = this.user;
      // You can add user-specific cart functionality here
    }
  }

  // Setup session event handlers
  setupSessionHandlers() {
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", (e) => {
      if (e.key === "neoCommerceUser") {
        this.checkLoginStatus();
      }
    });

    // Handle beforeunload to update last activity
    window.addEventListener("beforeunload", () => {
      if (this.user) {
        this.updateLastActivity();
      }
    });
  }

  // Update last activity time
  updateLastActivity() {
    if (this.user) {
      this.user.lastActivity = new Date().toISOString();
      localStorage.setItem("neoCommerceUser", JSON.stringify(this.user));
    }
  }

  // Logout function
  logout() {
    // Clear user data
    localStorage.removeItem("neoCommerceUser");

    // Clear cart if needed
    if (window.cart) {
      window.cart.clearCart();
    }

    // Update UI
    this.user = null;
    this.onUserLoggedOut();

    // Show logout message
    this.showToast(
      "success",
      "Logged Out",
      "You have been successfully logged out."
    );

    // Redirect to login page after a delay
    setTimeout(() => {
      if (
        confirm(
          "You have been logged out. Would you like to go to the login page?"
        )
      ) {
        window.location.href = "login.html";
      } else {
        // Refresh the page to show logged-out state
        window.location.reload();
      }
    }, 2000);
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.user !== null;
  }

  // Update UI based on login status
  updateUIBasedOnLoginStatus() {
    const body = document.body;

    if (this.isLoggedIn()) {
      body.classList.add("user-logged-in");
      body.classList.remove("user-logged-out");

      // Show user-specific content
      document.querySelectorAll(".logged-in-only").forEach((el) => {
        el.style.display = "block";
      });

      document.querySelectorAll(".logged-out-only").forEach((el) => {
        el.style.display = "none";
      });
    } else {
      body.classList.add("user-logged-out");
      body.classList.remove("user-logged-in");

      // Hide user-specific content
      document.querySelectorAll(".logged-in-only").forEach((el) => {
        el.style.display = "none";
      });

      document.querySelectorAll(".logged-out-only").forEach((el) => {
        el.style.display = "block";
      });
    }
  }

  // Show toast notification
  showToast(type, title, message) {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      // Create toast container if it doesn't exist
      const container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      container.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 3000;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            `;
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">${message}</div>
        `;

    document.getElementById("toastContainer").appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }
}

// Initialize session manager
let sessionManager;
document.addEventListener("DOMContentLoaded", () => {
  sessionManager = new SessionManager();
  window.sessionManager = sessionManager; // Make it globally accessible
});
