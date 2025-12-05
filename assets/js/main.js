// ===== MAIN APPLICATION SCRIPT =====

// ===== CONFIGURATION =====
// Load CONFIG if not already loaded
if (typeof CONFIG === 'undefined') {
    // CONFIG will be loaded from config.js
}

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize components
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    setupFormValidation();

    // Load external dependencies if needed
    loadDependencies();
}

// ===== NAVIGATION =====
function setupNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            // Skip external links
            if (href.startsWith('http') || href.includes('.html')) return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        hide: true
                    });
                }
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// ===== SCROLL EFFECTS =====
function setupScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ===== ANIMATIONS =====
function setupAnimations() {
    // Add loading class to elements initially
    document.querySelectorAll('.animate-on-load').forEach(el => {
        el.classList.add('loading');
    });

    // Remove loading class after page load
    window.addEventListener('load', function() {
        document.querySelectorAll('.loading').forEach(el => {
            el.classList.remove('loading');
        });
    });

    // Add intersection observer for animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    // Add Bootstrap validation classes
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Phone number formatting
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove all non-numeric characters
            let value = e.target.value.replace(/\D/g, '');

            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            e.target.value = value;
        });
    });
}

// ===== DEPENDENCY LOADING =====
function loadDependencies() {
    // Load CONFIG if not loaded
    if (typeof CONFIG === 'undefined') {
        loadScript('config.js');
    }

    // Load cart system on pages that need it
    if (document.querySelector('.cart-badge') || document.querySelector('.cart-drawer')) {
        // Cart is already loaded via HTML
    }
}

// ===== UTILITY FUNCTIONS =====

// Load external script
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
}

// Format currency
function formatCurrency(amount, currency = '₹') {
    return `${currency}${amount.toLocaleString('en-IN')}`;
}

// Format date
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    return new Date(date).toLocaleDateString('en-IN', { ...defaultOptions, ...options });
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
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
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: false });
    toast.show();

    // Auto remove after duration
    setTimeout(() => {
        toast.hide();
        setTimeout(() => toastElement.remove(), 500);
    }, duration);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);

    // Show user-friendly error message for critical errors
    if (e.error && e.error.name === 'TypeError') {
        showToast('Something went wrong. Please refresh the page.', 'danger');
    }
});

// ===== SERVICE WORKER REGISTRATION =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);

                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
}

// Show update notification
function showUpdateNotification() {
    showToast('A new version is available! Refresh to update.', 'info', 10000);

    // Add refresh button to toast if possible
    setTimeout(() => {
        if (confirm('A new version of the app is available. Refresh now?')) {
            window.location.reload();
        }
    }, 1000);
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    }

    // Register service worker
    registerServiceWorker();

    // Mark app as loaded
    document.body.classList.add('app-loaded');
});

// ===== RESPONSIVE UTILITIES =====
function isMobile() {
    return window.innerWidth < 768;
}

function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 992;
}

function isDesktop() {
    return window.innerWidth >= 992;
}

// ===== ACCESSIBILITY =====
function setupAccessibility() {
    // Add focus trap for modals
    // Add keyboard navigation support
    // Add ARIA labels where needed

    // Setup mobile menu functionality
    setupMobileMenu();
}

// ===== MOBILE MENU FUNCTIONALITY =====
function setupMobileMenu() {
    // Only setup mobile menu features on mobile devices
    if (window.innerWidth < 992) {
        setupMobileMenuFeatures();
    }

    // Re-check on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 992) {
            setupMobileMenuFeatures();
        }
    });
}

function setupMobileMenuFeatures() {
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Add close button only if it doesn't exist and we're on mobile
    if (navbarCollapse && !document.querySelector('.mobile-menu-close')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-menu-close';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close menu');

        // Insert close button at the beginning of the menu
        const navbarNav = navbarCollapse.querySelector('.navbar-nav');
        if (navbarNav) {
            navbarCollapse.insertBefore(closeButton, navbarNav);
        } else {
            navbarCollapse.insertBefore(closeButton, navbarCollapse.firstChild);
        }

        // Add close functionality
        closeButton.addEventListener('click', function() {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                hide: true
            });
        });
    }

    // Handle menu show/hide events
    const navbarCollapseElement = document.getElementById('navbarNav');
    if (navbarCollapseElement) {
        navbarCollapseElement.addEventListener('show.bs.collapse', function() {
            document.body.classList.add('mobile-menu-open');
        });

        navbarCollapseElement.addEventListener('hide.bs.collapse', function() {
            document.body.classList.remove('mobile-menu-open');
        });
    }

    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
            }
        });
    });

    // Close menu when clicking on overlay
    if (navbarCollapse) {
        navbarCollapse.addEventListener('click', function(e) {
            // Only close if clicking on the overlay (not on menu content)
            if (e.target === navbarCollapse) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
            }
        });
    }
}

// Initialize accessibility features
setupAccessibility();
