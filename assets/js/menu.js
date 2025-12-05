// ===== MENU SYSTEM =====

let menuData = null;
let currentCategory = 'all';
let searchQuery = '';

class MenuManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Load menu data
            await this.loadMenuData();

            // Load config if not loaded
            if (typeof CONFIG === 'undefined') {
                await this.loadConfig();
            }

            // Make menuData globally available
            window.menuData = menuData;

            // Initialize UI
            this.setupFilters();
            this.setupSearch();
            this.renderMenu();

            // Re-setup cart event listeners in case they weren't ready before
            if (typeof setupCartEventListeners === 'function') {
                setTimeout(setupCartEventListeners, 100);
            }

        } catch (error) {
            console.error('Error initializing menu:', error);
            this.showError('Failed to load menu. Please refresh the page.');
        }
    }

    // Load menu data from JSON file
    async loadMenuData() {
        try {
            // Check if menuData is already available (loaded as script)
            if (typeof window.menuData !== 'undefined' && window.menuData) {
                menuData = window.menuData;
                console.log('Using pre-loaded menu data');
                return;
            }

            const response = await fetch('menu.json');
            if (!response.ok) {
                throw new Error('Failed to load menu data');
            }
            menuData = await response.json();
            console.log('Fetched menu data from server');
        } catch (error) {
            console.error('Error loading menu data:', error);
            throw error;
        }
    }

    // Load config if not already loaded
    async loadConfig() {
        try {
            const response = await fetch('config.js');
            if (!response.ok) {
                throw new Error('Failed to load config');
            }
            const configText = await response.text();
            // Execute config script
            eval(configText.replace('if (typeof module !== \'undefined\' && module.exports) { module.exports = CONFIG; }', ''));
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }

    // Setup category filters
    setupFilters() {
        const categoryDropdownMenu = document.getElementById('categoryDropdownMenu');
        const selectedCategoryText = document.getElementById('selectedCategoryText');

        if (!categoryDropdownMenu || !menuData) return;

        // Add "All" option first
        const allItem = document.createElement('li');
        const allLink = document.createElement('a');
        allLink.className = 'dropdown-item active';
        allLink.setAttribute('data-category', 'all');
        allLink.href = '#';
        allLink.textContent = 'All Categories';
        allLink.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.filterByCategory('all');
            this.updateDropdownActiveState('all');
            if (selectedCategoryText) selectedCategoryText.textContent = 'All Categories';
            // Close dropdown after selection
            this.closeDropdown();
        };
        allItem.appendChild(allLink);
        categoryDropdownMenu.appendChild(allItem);

        // Add category options
        menuData.categories.forEach((category, index) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'dropdown-item';
            link.setAttribute('data-category', category.id);
            link.href = '#';
            link.textContent = category.name;
            
            // Handle both click and mousedown for better reliability
            const handleSelection = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.filterByCategory(category.id);
                this.updateDropdownActiveState(category.id);
                if (selectedCategoryText) selectedCategoryText.textContent = category.name;
                // Small delay before closing to ensure click registers
                setTimeout(() => {
                    this.closeDropdown();
                }, 100);
            };
            
            link.onclick = handleSelection;
            link.onmousedown = handleSelection;
            
            // Add extra class for last item
            if (index === menuData.categories.length - 1) {
                link.classList.add('last-dropdown-item');
            }
            
            item.appendChild(link);
            categoryDropdownMenu.appendChild(item);
        });
    }

    // Close dropdown
    closeDropdown() {
        const dropdownButton = document.getElementById('categoryDropdown');
        const dropdownMenu = document.getElementById('categoryDropdownMenu');
        if (dropdownButton && dropdownMenu) {
            // Try Bootstrap 5 method
            if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownButton);
                if (dropdownInstance) {
                    dropdownInstance.hide();
                    return;
                }
            }
            // Fallback: manually hide dropdown
            dropdownMenu.classList.remove('show');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.classList.remove('show');
        }
    }

    // Update dropdown active state
    updateDropdownActiveState(categoryId) {
        const dropdownItems = document.querySelectorAll('#categoryDropdownMenu .dropdown-item');
        dropdownItems.forEach(item => {
            if (item.getAttribute('data-category') === categoryId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');

        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            this.renderMenu();
        });
    }

    // Filter by category
    filterByCategory(categoryId) {
        currentCategory = categoryId;
        searchQuery = ''; // Clear search when filtering by category

        // Update dropdown active state
        this.updateDropdownActiveState(categoryId);

        // Update selected category text
        const selectedCategoryText = document.getElementById('selectedCategoryText');
        if (selectedCategoryText) {
            if (categoryId === 'all') {
                selectedCategoryText.textContent = 'All Categories';
            } else {
                const category = menuData.categories.find(cat => cat.id === categoryId);
                if (category) {
                    selectedCategoryText.textContent = category.name;
                }
            }
        }

        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        this.renderMenu();
    }

    // Clear search
    clearSearch() {
        searchQuery = '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.renderMenu();
    }

    // Render menu items
    renderMenu() {
        const menuContainer = document.getElementById('menuContainer');

        if (!menuContainer || !menuData) return;

        // Filter items
        let filteredItems = menuData.items;

        // Apply category filter
        if (currentCategory !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === currentCategory);
        }

        // Apply search filter
        if (searchQuery) {
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery) ||
                item.description.toLowerCase().includes(searchQuery)
            );
        }

        // Render items
        if (filteredItems.length === 0) {
            menuContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No items found</h4>
                    <p class="text-muted">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        menuContainer.innerHTML = filteredItems.map(item => this.createMenuItemHTML(item)).join('');
    }

    // Create HTML for menu item
    createMenuItemHTML(item) {
        const vegIcon = item.veg ?
            '<i class="fas fa-circle text-success" title="Vegetarian"></i>' :
            '<i class="fas fa-circle text-danger" title="Non-Vegetarian"></i>';

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="menu-item-card glass-card h-100">
                    <!-- Image Gallery -->
                    <div class="image-gallery position-relative mb-3">
                        <div id="carousel-${item.id}" class="carousel slide" data-bs-ride="false">
                            <div class="carousel-inner rounded-3 overflow-hidden">
                                ${item.images.map((image, index) => `
                                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                        <img src="assets/images/menu/placeholder/${image}"
                                             class="d-block w-100 menu-item-image"
                                             alt="${item.name}"
                                             loading="lazy"
                                             style="height: 250px; object-fit: cover;">
                                    </div>
                                `).join('')}
                            </div>

                            <!-- Carousel Controls (only if multiple images) -->
                            ${item.images.length > 1 ? `
                                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${item.id}" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon"></span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carousel-${item.id}" data-bs-slide="next">
                                    <span class="carousel-control-next-icon"></span>
                                </button>

                                <!-- Image Indicators -->
                                <div class="carousel-indicators position-absolute bottom-0 mb-2">
                                    ${item.images.map((_, index) => `
                                        <button type="button" data-bs-target="#carousel-${item.id}"
                                                data-bs-slide-to="${index}"
                                                class="${index === 0 ? 'active' : ''}"
                                                style="width: 8px; height: 8px; border-radius: 50%;"></button>
                                    `).join('')}
                                </div>
                            ` : ''}

                            <!-- Veg/Non-Veg Badge -->
                            <div class="veg-indicator">
                                ${vegIcon}
                            </div>
                        </div>
                    </div>

                    <!-- Item Details -->
                    <div class="item-details p-3">
                        <h5 class="item-title mb-2">${item.name}</h5>
                        <p class="item-description text-muted small mb-3">${item.description}</p>

                        <div class="d-flex justify-content-between align-items-center">
                            <div class="item-price">
                                <span class="price-amount">₹${item.price}</span>
                            </div>

                            <!-- Add to Cart Button -->
                            <div class="add-to-cart-section">
                                <button class="btn btn-primary btn-sm add-to-cart-btn"
                                        onclick="addToCart('${item.id}')">
                                    <i class="fas fa-cart-plus me-1"></i>Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        const menuContainer = document.getElementById('menuContainer');
        if (menuContainer) {
            menuContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4 class="text-danger">Error</h4>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }
}

// Global functions for HTML onclick handlers
function filterByCategory(categoryId) {
    if (window.menuManager) {
        window.menuManager.filterByCategory(categoryId);
    }
}

function clearSearch() {
    if (window.menuManager) {
        window.menuManager.clearSearch();
    }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for cartManager to be available before initializing menu
    function initializeMenu() {
        if (typeof cartManager !== 'undefined' && cartManager) {
            window.menuManager = new MenuManager();
        } else {
            // Retry after a short delay
            setTimeout(initializeMenu, 100);
        }
    }

    initializeMenu();
});

// Make menuData globally available for addToCart function
window.menuData = null;

// ===== MENU ITEM STYLES =====
const menuStyles = `
<style>
.menu-item-card {
    transition: var(--transition-normal);
    overflow: hidden;
    cursor: pointer;
}

.menu-item-card:hover {
    transform: translateY(-5px);
}

.image-gallery {
    position: relative;
}

.menu-item-image {
    transition: transform 0.3s ease;
}

.menu-item-card:hover .menu-item-image {
    transform: scale(1.05);
}

.carousel-indicators {
    justify-content: center;
}

.carousel-indicators button {
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.8);
}

.carousel-indicators button.active {
    background-color: var(--primary-color);
}

.veg-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;
}

.item-title {
    font-weight: 600;
    color: var(--dark-color);
}

.item-description {
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.price-amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color);
}

.add-to-cart-btn {
    border-radius: 20px;
    padding: 6px 16px;
    font-weight: 600;
    transition: var(--transition-fast);
}

.add-to-cart-btn:hover {
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .menu-item-card {
        margin-bottom: 20px;
    }

    .image-gallery {
        margin-bottom: 15px;
    }

    .item-details {
        padding: 20px;
    }
}
</style>
`;

// Inject menu styles
document.head.insertAdjacentHTML('beforeend', menuStyles);
