// Search and Filter Management System
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchClear = document.getElementById('searchClear');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.searchResultsInfo = document.getElementById('searchResultsInfo');
        this.searchResultsText = document.getElementById('searchResultsText');
        this.noResults = document.getElementById('noResults');
        this.productsGrid = document.getElementById('productsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sortSelect');
        
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentSearchTerm = '';
        this.currentFilter = 'all';
        this.currentSort = 'default';
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
    }

    // Load all products data
    loadProducts() {
        const productCards = document.querySelectorAll('.product-card');
        this.allProducts = Array.from(productCards).map(card => ({
            id: parseInt(card.dataset.productId),
            element: card,
            name: card.dataset.name.toLowerCase(),
            category: card.dataset.category,
            price: parseInt(card.dataset.price),
            rating: parseFloat(card.dataset.rating),
            title: card.querySelector('.product-title').textContent,
            description: card.querySelector('.product-description').textContent.toLowerCase()
        }));
        
        this.filteredProducts = [...this.allProducts];
    }

    // Setup all event listeners
    setupEventListeners() {
        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.length > 0) {
                this.showSuggestions();
            }
        });

        this.searchInput.addEventListener('blur', () => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });

        // Search button click
        this.searchBtn.addEventListener('click', () => {
            this.performSearch();
        });

        // Clear search
        this.searchClear.addEventListener('click', () => {
            this.clearSearch();
        });

        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });

        // Sort dropdown
        this.sortSelect.addEventListener('change', (e) => {
            this.handleSort(e.target.value);
        });

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchSuggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    // Handle search input with debouncing
    handleSearch(searchTerm) {
        clearTimeout(this.searchTimeout);
        this.currentSearchTerm = searchTerm.toLowerCase().trim();
        
        // Show/hide clear button
        if (this.currentSearchTerm.length > 0) {
            this.searchClear.style.display = 'flex';
        } else {
            this.searchClear.style.display = 'none';
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            if (this.currentSearchTerm.length > 0) {
                this.showSuggestions();
                this.performSearch();
            } else {
                this.hideSuggestions();
                this.clearSearch();
            }
        }, 300);
    }

    // Perform the actual search
    performSearch() {
        this.showSearchResults();
        this.filterAndDisplayProducts();
        this.hideSuggestions();
    }

    // Clear search
    clearSearch() {
        this.searchInput.value = '';
        this.currentSearchTerm = '';
        this.searchClear.style.display = 'none';
        this.hideSearchResults();
        this.hideSuggestions();
        this.filterAndDisplayProducts();
        
        // Clear any highlights
        this.allProducts.forEach(product => {
            this.clearHighlights(product.element);
        });
    }

    // Handle category filter
    handleFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.filterAndDisplayProducts();
    }

    // Handle sorting
    handleSort(sortType) {
        this.currentSort = sortType;
        this.filterAndDisplayProducts();
    }

    // Filter and display products based on current criteria
    filterAndDisplayProducts() {
        let filtered = [...this.allProducts];

        // Apply search filter
        if (this.currentSearchTerm) {
            filtered = filtered.filter(product => 
                product.name.includes(this.currentSearchTerm) ||
                product.title.toLowerCase().includes(this.currentSearchTerm) ||
                product.description.includes(this.currentSearchTerm) ||
                product.category.toLowerCase().includes(this.currentSearchTerm)
            );
        }

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(product => 
                product.category === this.currentFilter
            );
        }

        // Apply sorting
        this.applySorting(filtered);

        // Update display
        this.displayProducts(filtered);
        
        // Update search results info
        if (this.currentSearchTerm) {
            this.updateSearchResultsInfo(filtered.length);
        }
    }

    // Apply sorting to filtered products
    applySorting(products) {
        switch (this.currentSort) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                products.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                // Keep original order
                break;
        }
    }

    // Display filtered products
    displayProducts(filteredProducts) {
        // Hide all products first
        this.allProducts.forEach(product => {
            product.element.classList.add('hidden');
            product.element.classList.remove('search-match', 'highlight');
        });

        // Show filtered products
        if (filteredProducts.length > 0) {
            filteredProducts.forEach((product, index) => {
                product.element.classList.remove('hidden');
                
                // Highlight search matches
                if (this.currentSearchTerm) {
                    product.element.classList.add('search-match');
                    this.highlightSearchTerms(product.element);
                    
                    // Add staggered animation
                    setTimeout(() => {
                        product.element.classList.add('highlight');
                    }, index * 100);
                }
            });
            
            this.noResults.style.display = 'none';
        } else {
            this.noResults.style.display = 'block';
        }
    }

    // Show search suggestions
    showSuggestions() {
        if (this.currentSearchTerm.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestions = this.generateSuggestions(this.currentSearchTerm);
        
        if (suggestions.length > 0) {
            this.renderSuggestions(suggestions);
            this.searchSuggestions.classList.add('show');
        } else {
            this.hideSuggestions();
        }
    }

    // Generate search suggestions
    generateSuggestions(searchTerm) {
        const suggestions = new Set();
        const maxSuggestions = 5;

        // Product name suggestions
        this.allProducts.forEach(product => {
            if (product.name.includes(searchTerm)) {
                suggestions.add({
                    text: product.title,
                    type: 'product',
                    icon: '🛍️'
                });
            }
        });

        // Category suggestions
        const categories = ['gaming', 'fashion', 'tech', 'wearables', 'footwear', 'accessories'];
        categories.forEach(category => {
            if (category.includes(searchTerm)) {
                suggestions.add({
                    text: category.charAt(0).toUpperCase() + category.slice(1),
                    type: 'category',
                    icon: '📂'
                });
            }
        });

        // Common search terms
        const commonTerms = ['headset', 'jacket', 'monitor', 'glasses', 'sneakers', 'wireless', 'smart', 'cyber', 'quantum', 'holographic'];
        commonTerms.forEach(term => {
            if (term.includes(searchTerm) && !Array.from(suggestions).some(s => s.text.toLowerCase().includes(term))) {
                suggestions.add({
                    text: `Search for "${term}"`,
                    type: 'term',
                    icon: '🔍'
                });
            }
        });

        return Array.from(suggestions).slice(0, maxSuggestions);
    }

    // Render suggestions in the dropdown
    renderSuggestions(suggestions) {
        this.searchSuggestions.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-suggestion="${suggestion.text}" data-type="${suggestion.type}">
                <span class="suggestion-icon">${suggestion.icon}</span>
                <span class="suggestion-text">${suggestion.text}</span>
            </div>
        `).join('');

        // Add click handlers to suggestions
        this.searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const suggestionText = item.dataset.suggestion;
                const suggestionType = item.dataset.type;
                
                if (suggestionType === 'category') {
                    this.handleFilter(suggestionText.toLowerCase());
                    this.searchInput.value = '';
                } else if (suggestionType === 'product') {
                    this.searchInput.value = suggestionText;
                } else {
                    this.searchInput.value = suggestionText.replace('Search for "', '').replace('"', '');
                }
                
                this.performSearch();
            });
        });
    }

    // Hide search suggestions
    hideSuggestions() {
        this.searchSuggestions.classList.remove('show');
    }

    // Show search results info
    showSearchResults() {
        if (this.currentSearchTerm) {
            this.searchResultsInfo.style.display = 'block';
        }
    }

    // Hide search results info
    hideSearchResults() {
        this.searchResultsInfo.style.display = 'none';
    }

    // Update search results info text
    updateSearchResultsInfo(count) {
        this.searchResultsText.textContent = `Found ${count} product${count !== 1 ? 's' : ''} for "${this.currentSearchTerm}"`;
    }

    // Highlight search terms in product cards
    highlightSearchTerms(productElement) {
        if (!this.currentSearchTerm) return;

        const titleElement = productElement.querySelector('.product-title');
        const descriptionElement = productElement.querySelector('.product-description');

        this.highlightText(titleElement, this.currentSearchTerm);
        this.highlightText(descriptionElement, this.currentSearchTerm);
    }

    // Highlight specific text in an element
    highlightText(element, searchTerm) {
        const originalText = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="search-highlight">$1</span>');
        
        if (highlightedText !== originalText) {
            element.innerHTML = highlightedText;
        }
    }

    // Clear highlights from product elements
    clearHighlights(productElement) {
        const highlightedElements = productElement.querySelectorAll('.search-highlight');
        highlightedElements.forEach(element => {
            element.outerHTML = element.textContent;
        });
    }
}

// Clear all filters function
function clearAllFilters() {
    if (window.searchManager) {
        window.searchManager.clearSearch();
        window.searchManager.handleFilter('all');
        window.searchManager.sortSelect.value = 'default';
        window.searchManager.handleSort('default');
    }
}

// Initialize search manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for products to be loaded
    setTimeout(() => {
        window.searchManager = new SearchManager();
        console.log('🔍 Search functionality initialized!');
    }, 500);
});
