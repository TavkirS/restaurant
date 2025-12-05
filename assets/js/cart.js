// ===== CART MANAGEMENT SYSTEM =====

// Cart data structure in localStorage
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateUI();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const cart = localStorage.getItem('bellaVistaCart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('bellaVistaCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(item, quantity = 1) {
        const existingItem = this.cart.find(cartItem =>
            cartItem.id === item.id
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.images[0], // First image as thumbnail
                quantity: quantity,
                veg: item.veg
            });
        }

        this.saveCart();
        this.updateUI();
        this.showAddToCartAnimation();
    }

    // Remove item from cart
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateUI();
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(itemId);
            return;
        }

        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateUI();
        }
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateUI();
    }

    // Get cart totals
    getTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const gst = Math.round(subtotal * (CONFIG.gstPercentage / 100));
        const deliveryFee = subtotal > 0 ? CONFIG.deliveryFee : 0;
        const total = subtotal + gst + deliveryFee;

        return {
            subtotal,
            gst,
            deliveryFee,
            total
        };
    }

    // Get cart item count
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Update UI elements
    updateUI() {
        this.updateCartBadge();
        this.updateCartDrawer();
    }

    // Update cart badge
    updateCartBadge() {
        const itemCount = this.getItemCount();

        // Update mobile cart badge
        const mobileBadge = document.querySelector('.cart-badge-mobile');
        const mobileCount = document.getElementById('cartCountMobile');
        if (mobileBadge) {
            mobileBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
        if (mobileCount) {
            mobileCount.textContent = itemCount;
        }

        // Update desktop cart badge
        const desktopBadge = document.querySelector('.cart-badge-desktop');
        const desktopCount = document.getElementById('cartCountDesktop');
        if (desktopBadge) {
            desktopBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
        if (desktopCount) {
            desktopCount.textContent = itemCount;
        }
    }

    // Update cart drawer content
    updateCartDrawer() {
        const cartItems = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <p class="text-muted small">Add some delicious items from our menu!</p>
                </div>
            `;
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }

        // Render cart items
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item d-flex align-items-center p-3 border-bottom">
                <img src="assets/images/menu/placeholder/${item.image}"
                     alt="${item.name}" class="cart-item-image me-3" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted small mb-1">₹${item.price} each</p>
                    <div class="quantity-controls d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-3 fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold">₹${item.price * item.quantity}</div>
                    <button class="btn btn-sm btn-outline-danger mt-2" onclick="cartManager.removeItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Show cart footer with totals
        if (cartFooter) {
            cartFooter.style.display = 'block';
            const totals = this.getTotals();

            document.getElementById('cartSubtotal').textContent = `₹${totals.subtotal}`;
            document.getElementById('cartGST').textContent = `₹${totals.gst}`;
            document.getElementById('cartDelivery').textContent = `₹${totals.deliveryFee}`;
            document.getElementById('cartTotal').textContent = `₹${totals.total}`;
        }
    }

    // Show add to cart animation
    showAddToCartAnimation() {
        // Add bounce animation to cart badge
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            cartBadge.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                cartBadge.style.animation = '';
            }, 500);
        }

        // Show toast notification
        this.showToast('Item added to cart!', 'success');
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast element if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Auto remove after 3 seconds
        setTimeout(() => {
            toastElement.remove();
        }, 3000);
    }

    // Get cart data for checkout
    getCartData() {
        return {
            items: this.cart,
            totals: this.getTotals(),
            itemCount: this.getItemCount()
        };
    }
}

// Global cart manager instance
let cartManager;

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart regardless of CONFIG (it will handle missing CONFIG gracefully)
    if (!cartManager) {
        try {
            cartManager = new CartManager();
            setupCartEventListeners();
        } catch (error) {
            console.warn('Cart initialization failed, retrying:', error);
            // Retry after a short delay
            setTimeout(function() {
                try {
                    cartManager = new CartManager();
                    setupCartEventListeners();
                } catch (retryError) {
                    console.error('Cart initialization failed:', retryError);
                }
            }, 500);
        }
    }
});

// Setup cart event listeners
function setupCartEventListeners() {
    // Remove any existing listeners first to prevent duplicates
    const existingBadges = document.querySelectorAll('.cart-badge-mobile, .cart-badge-desktop');
    existingBadges.forEach(badge => {
        badge.removeEventListener('click', handleCartClick);
    });

    // Add click handlers to all cart badges (both mobile and desktop)
    const cartBadges = document.querySelectorAll('.cart-badge-mobile, .cart-badge-desktop');
    cartBadges.forEach(badge => {
        badge.addEventListener('click', handleCartClick);
        badge.style.cursor = 'pointer'; // Ensure cursor shows clickable
    });
}

// Separate click handler function
function handleCartClick(e) {
    e.preventDefault();
    toggleCart();
}

// Cart drawer functions
function toggleCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    if (cartDrawer && cartDrawer.classList.contains('open')) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cartManager.clearCart();
    }
}

function proceedToCheckout() {
    // Save cart data to sessionStorage for checkout page
    sessionStorage.setItem('checkoutData', JSON.stringify(cartManager.getCartData()));

    // Redirect to checkout page (we'll create this)
    window.location.href = 'checkout.html';
}

// Add to cart function for menu items
function addToCart(itemId) {
    // Check if cartManager is initialized
    if (typeof cartManager === 'undefined' || !cartManager) {
        console.error('Cart manager not initialized yet. Please wait for the page to load completely.');
        return;
    }

    // Function to add item once menuData is available
    function addItemWhenReady() {
        // Check if menuData is available (either from menu.js or window.menuData)
        const data = menuData || window.menuData;

        if (data && data.items) {
            const item = data.items.find(item => item.id === itemId);
            if (item) {
                cartManager.addItem(item);
                console.log('Added item to cart:', item.name);
            } else {
                console.error('Menu item not found:', itemId);
                // Fallback for missing items
                const fallbackItem = {
                    id: itemId,
                    name: itemId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    price: 250,
                    veg: Math.random() > 0.5,
                    images: ['imgthree.webp']
                };
                cartManager.addItem(fallbackItem);
            }
        } else {
            // Wait a bit more for menuData to load
            console.log('Waiting for menu data to load...');
            setTimeout(addItemWhenReady, 100);
        }
    }

    // Start the process
    addItemWhenReady();
}

// ===== CART DRAWER STYLES =====
const cartStyles = `
<style>
.cart-drawer {
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
}

.cart-drawer.open {
    right: 0;
}

.cart-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-body {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

.cart-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    background: #f8f9fa;
}

.cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.cart-overlay.active {
    opacity: 1;
    visibility: visible;
}

.empty-cart {
    padding: 40px 20px;
}

.cart-item {
    transition: background-color 0.2s ease;
}

.cart-item:hover {
    background-color: #f8f9fa;
}

.quantity-controls .btn {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-container {
    z-index: 9999;
}

@media (max-width: 576px) {
    .cart-drawer {
        width: 100%;
        right: -100%;
    }
}
</style>
`;

// Inject cart styles
document.head.insertAdjacentHTML('beforeend', cartStyles);
