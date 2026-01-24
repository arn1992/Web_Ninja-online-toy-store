document.addEventListener('DOMContentLoaded', () => {
    console.log('Online Toy Store script loaded.');

    // --- DOM Element Selectors ---
    const mainContent = document.getElementById('main-content');
    const checkoutPage = document.getElementById('checkout-page');
    const productsPage = document.getElementById('products-page');
    const cartToggle = document.getElementById('cart-toggle');
    const homeLink = document.getElementById('home-link');
    const productsLink = document.getElementById('products-link');
    const logo = document.querySelector('.logo');
    const payNowBtn = document.querySelector('.pay-now-btn');
    const cartCountElement = document.getElementById('cart-count');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartBody = document.getElementById('cart-body');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const bestSellersSection = document.querySelector('.best-sellers');
    const productsPageSection = document.querySelector('.products-page-section');

    // --- State Management ---
    let cart = [];

    // --- Page View Management ---
    function showMainContent() {
        mainContent.style.display = 'block';
        checkoutPage.style.display = 'none';
        productsPage.style.display = 'none';
        window.scrollTo(0, 0);
    }

    function showCheckoutPage() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before proceeding to checkout.');
            return;
        }
        closeCart();
        mainContent.style.display = 'none';
        checkoutPage.style.display = 'block';
        productsPage.style.display = 'none';
        populateCheckoutSummary();
        window.scrollTo(0, 0);
    }

    function showProductsPage() {
        mainContent.style.display = 'none';
        checkoutPage.style.display = 'none';
        productsPage.style.display = 'block';
        window.scrollTo(0, 0);
    }

    // --- Cart Drawer Management ---
    function openCart() {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
    }

    function closeCart() {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
    }

    // --- Cart Logic ---
    function addToCart(product) {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
        openCart();
    }

    function updateCart() {
        renderCartItems();
        updateCartCount();
        updateCartSubtotal();
    }

    function updateCartCount() {
        if (!cartCountElement) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    function updateCartSubtotal() {
        if (!cartSubtotalElement) return;
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    function renderCartItems() {
        if (!cartBody) return;
        cartBody.innerHTML = '';

        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.productId = item.id;

            const imageElement = item.image
                ? `<img src="${item.image}" alt="${item.name}" class="cart-item-img">`
                : `<div class="cart-item-img"></div>`;

            cartItem.innerHTML = `
                ${imageElement}
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-qty">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-qty">+</button>
                        </div>
                        <button class="remove-item-btn">Remove</button>
                    </div>
                </div>
            `;
            cartBody.appendChild(cartItem);
        });
    }

    function handleCartActions(e) {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const productId = cartItem.dataset.productId;
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex === -1) return;

        if (target.classList.contains('increase-qty')) {
            cart[productIndex].quantity++;
        } else if (target.classList.contains('decrease-qty')) {
            cart[productIndex].quantity--;
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
        } else if (target.classList.contains('remove-item-btn')) {
            cart.splice(productIndex, 1);
        }

        updateCart();
    }

    // --- Checkout Logic ---
    const summaryItemsContainer = document.getElementById('summary-items-container');
    const summaryTotalContainer = document.getElementById('summary-total-container');

    function populateCheckoutSummary() {
        if (!summaryItemsContainer || !summaryTotalContainer) return;

        summaryItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            summaryItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            summaryItemsContainer.appendChild(summaryItem);
        });

        const shipping = 15.00; // Fixed shipping for now
        const total = subtotal + shipping;

        summaryTotalContainer.innerHTML = `
            <div class="summary-line">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Shipping</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-line total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
    }

    // --- Event Listeners ---
    if (cartToggle) cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    if (homeLink) homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showMainContent();
    });

    if (productsLink) productsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showProductsPage();
    });

    if (logo) logo.addEventListener('click', showMainContent);

    if (cartBody) cartBody.addEventListener('click', handleCartActions);

    if (checkoutBtn) checkoutBtn.addEventListener('click', showCheckoutPage);

    if (payNowBtn) {
        payNowBtn.closest('form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your order! (This is a demo)');
            cart = [];
            updateCart();
            showMainContent();
        });
    }

    function handleProductGridClick(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productCard = e.target.closest('.product-card');
            const imageElement = productCard.querySelector('img');
            const product = {
                id: productCard.dataset.productId,
                name: productCard.dataset.productName,
                price: parseFloat(productCard.dataset.price),
                image: imageElement ? imageElement.src : null
            };
            addToCart(product);
        }
    }

    if (bestSellersSection) {
        bestSellersSection.addEventListener('click', handleProductGridClick);
    }

    if (productsPageSection) {
        productsPageSection.addEventListener('click', handleProductGridClick);
    }

    // --- Hero Slideshow ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero .slide');
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 1) {
        setInterval(nextSlide, slideInterval);
    }

    // --- Product Page Filtering and Sorting ---
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter = document.getElementById('brand-filter');
    const sortBy = document.getElementById('sort-by');
    const productGrid = document.querySelector('.products-page-section .product-grid');

    function filterAndSortProducts() {
        if (!productGrid) return; // Only run on products page

        const products = Array.from(productGrid.querySelectorAll('.product-card'));
        const categoryValue = categoryFilter.value;
        const brandValue = brandFilter.value;
        const sortValue = sortBy.value;

        // 1. Filter
        products.forEach(product => {
            const matchesCategory = (categoryValue === 'all') || (product.dataset.category === categoryValue);
            const matchesBrand = (brandValue === 'all') || (product.dataset.brand === brandValue);

            if (matchesCategory && matchesBrand) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });

        // 2. Sort
        const sortedProducts = products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);

            if (sortValue === 'price-asc') {
                return priceA - priceB;
            } else if (sortValue === 'price-desc') {
                return priceB - priceA;
            }
            // For 'default', maintain original order by product ID
            return parseInt(a.dataset.productId) - parseInt(b.dataset.productId);
        });

        // 3. Re-append to grid
        sortedProducts.forEach(product => {
            productGrid.appendChild(product);
        });
    }

    if (categoryFilter && brandFilter && sortBy) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
        brandFilter.addEventListener('change', filterAndSortProducts);
        sortBy.addEventListener('change', filterAndSortProducts);
    }

    // --- Initial Setup ---
    updateCart(); // Initialize cart count on page load
});