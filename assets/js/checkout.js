// ===== CHECKOUT SYSTEM =====

class CheckoutManager {
    constructor() {
        this.checkoutData = null;
        this.init();
    }

    init() {
        // Load checkout data from sessionStorage
        this.loadCheckoutData();

        // If no checkout data, redirect to menu
        if (!this.checkoutData || this.checkoutData.items.length === 0) {
            alert('Your cart is empty. Please add items to your cart first.');
            window.location.href = 'menu.html';
            return;
        }

        // Populate checkout UI
        this.populateOrderSummary();
        this.setupFormHandlers();
        this.toggleAddressField();
    }

    // Load checkout data from sessionStorage
    loadCheckoutData() {
        try {
            const data = sessionStorage.getItem('checkoutData');
            this.checkoutData = data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading checkout data:', error);
            this.checkoutData = null;
        }
    }

    // Populate order summary
    populateOrderSummary() {
        const checkoutItems = document.getElementById('checkoutItems');
        const checkoutSubtotal = document.getElementById('checkoutSubtotal');
        const checkoutGST = document.getElementById('checkoutGST');
        const checkoutDelivery = document.getElementById('checkoutDelivery');
        const checkoutTotal = document.getElementById('checkoutTotal');

        if (!checkoutItems || !this.checkoutData) return;

        // Populate items
        checkoutItems.innerHTML = this.checkoutData.items.map(item => `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <img src="assets/images/menu/placeholder/${item.image}"
                     alt="${item.name}" class="me-3 rounded" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="flex-grow-1">
                    <div class="fw-bold">${item.name}</div>
                    <small class="text-muted">₹${item.price} × ${item.quantity}</small>
                </div>
                <div class="fw-bold">₹${item.price * item.quantity}</div>
            </div>
        `).join('');

        // Populate totals
        checkoutSubtotal.textContent = `₹${this.checkoutData.totals.subtotal}`;
        checkoutGST.textContent = `₹${this.checkoutData.totals.gst}`;
        checkoutDelivery.textContent = `₹${this.checkoutData.totals.deliveryFee}`;
        checkoutTotal.textContent = `₹${this.checkoutData.totals.total}`;
    }

    // Setup form event handlers
    setupFormHandlers() {
        const checkoutForm = document.getElementById('checkoutForm');
        const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleOrderSubmit(e));
        }

        // Toggle address field based on order type
        orderTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.toggleAddressField());
        });
    }

    // Toggle address field visibility
    toggleAddressField() {
        const addressSection = document.getElementById('addressSection');
        const deliveryAddress = document.getElementById('deliveryAddress');
        const deliveryRadio = document.getElementById('delivery');

        if (addressSection && deliveryAddress) {
            if (deliveryRadio.checked) {
                addressSection.style.display = 'block';
                deliveryAddress.required = true;
            } else {
                addressSection.style.display = 'none';
                deliveryAddress.required = false;
                deliveryAddress.value = '';
            }
        }
    }

    // Handle order submission
    async handleOrderSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Generate order ID
            const orderId = this.generateOrderId();

            // Collect form data
            const formData = this.collectFormData();

            // Generate WhatsApp message
            const whatsappMessage = this.generateWhatsAppMessage(orderId, formData);

            // Send to WhatsApp
            await this.sendToWhatsApp(whatsappMessage);

            // Show success message
            this.showOrderSuccess(orderId);

            // Clear cart
            this.clearCart();

        } catch (error) {
            console.error('Order submission error:', error);
            alert('There was an error placing your order. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    // Validate checkout form
    validateForm() {
        const customerName = document.getElementById('customerName').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const termsCheck = document.getElementById('termsCheck').checked;
        const deliveryRadio = document.getElementById('delivery');
        const deliveryAddress = document.getElementById('deliveryAddress').value.trim();

        if (!customerName) {
            alert('Please enter your full name.');
            return false;
        }

        if (!customerPhone || !this.isValidPhone(customerPhone)) {
            alert('Please enter a valid phone number.');
            return false;
        }

        if (deliveryRadio.checked && !deliveryAddress) {
            alert('Please enter your delivery address.');
            return false;
        }

        if (!termsCheck) {
            alert('Please accept the Terms & Conditions.');
            return false;
        }

        return true;
    }

    // Validate phone number
    isValidPhone(phone) {
        // Basic Indian phone number validation
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    // Collect form data
    collectFormData() {
        return {
            customerName: document.getElementById('customerName').value.trim(),
            customerPhone: document.getElementById('customerPhone').value.trim(),
            orderType: document.querySelector('input[name="orderType"]:checked').value,
            deliveryAddress: document.getElementById('deliveryAddress').value.trim(),
            specialInstructions: document.getElementById('specialInstructions').value.trim()
        };
    }

    // Generate unique order ID
    generateOrderId() {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        return `OD-${dateStr}-${randomNum}`;
    }

    // Generate WhatsApp message
    generateWhatsAppMessage(orderId, formData) {
        let message = `*🔔 NEW ORDER - ${CONFIG.restaurantName}*\n\n`;
        message += `*Order ID:* ${orderId}\n`;
        message += `*Date:* ${new Date().toLocaleString()}\n\n`;

        message += `*👤 Customer Details:*\n`;
        message += `Name: ${formData.customerName}\n`;
        message += `Phone: ${formData.customerPhone}\n`;
        message += `Order Type: ${formData.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Takeaway'}\n`;

        if (formData.orderType === 'delivery') {
            message += `Address: ${formData.deliveryAddress}\n`;
        }

        if (formData.specialInstructions) {
            message += `Special Instructions: ${formData.specialInstructions}\n`;
        }

        message += `\n*📋 Order Items:*\n`;

        this.checkoutData.items.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*`;
            if (!item.veg) {
                message += ` (Non-Veg)`;
            }
            message += `\n   Quantity: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n\n`;
        });

        message += `*💰 Order Summary:*\n`;
        message += `Subtotal: ₹${this.checkoutData.totals.subtotal}\n`;
        message += `GST (${CONFIG.gstPercentage}%): ₹${this.checkoutData.totals.gst}\n`;
        message += `Delivery Fee: ₹${this.checkoutData.totals.deliveryFee}\n`;
        message += `*Total Amount: ₹${this.checkoutData.totals.total}*\n\n`;

        message += `*📞 Contact:*\n`;
        message += `Restaurant: ${CONFIG.phone}\n`;
        message += `Email: ${CONFIG.email}\n\n`;

        message += `*Please confirm this order. Thank you! 🍕*`;

        return encodeURIComponent(message);
    }

    // Send message to WhatsApp
    async sendToWhatsApp(message) {
        const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;

        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');

        // Small delay to ensure WhatsApp opens
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Show order success message
    showOrderSuccess(orderId) {
        const checkoutForm = document.getElementById('checkoutForm');
        const orderSuccess = document.getElementById('orderSuccess');
        const orderIdDisplay = document.getElementById('orderIdDisplay');

        if (checkoutForm) checkoutForm.style.display = 'none';
        if (orderSuccess) orderSuccess.style.display = 'block';
        if (orderIdDisplay) orderIdDisplay.textContent = orderId;

        // Scroll to success message
        orderSuccess.scrollIntoView({ behavior: 'smooth' });
    }

    // Clear cart after successful order
    clearCart() {
        try {
            localStorage.removeItem('bellaVistaCart');
            sessionStorage.removeItem('checkoutData');
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    }

    // Set loading state for submit button
    setLoadingState(loading) {
        const submitBtn = document.getElementById('placeOrderBtn');

        if (!submitBtn) return;

        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Order...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fab fa-whatsapp me-2"></i>Place Order via WhatsApp';
        }
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load CONFIG if not already loaded
    if (typeof CONFIG === 'undefined') {
        // Try to load config from external file
        const configScript = document.createElement('script');
        configScript.src = 'config.js';
        configScript.onload = function() {
            new CheckoutManager();
        };
        document.head.appendChild(configScript);
    } else {
        new CheckoutManager();
    }
});

// ===== UTILITY FUNCTIONS =====

// Format currency
function formatCurrency(amount) {
    return `₹${amount}`;
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
