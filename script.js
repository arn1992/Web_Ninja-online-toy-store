document.addEventListener('DOMContentLoaded', () => {

    // --- Product Data from Database --- 
    const featuredProducts = [
        {
            id: 1,
            name: 'Arts & Crafts Kit',
            price: 29.99,
            imageUrl: 'https://greattoysdistribution.com/wp-content/uploads/Classic-Wooden-Building-Blocks-Archemedes-1-1.png.webp',
            badge: 'New!'
        },
        {
            id: 2,
            name: 'Robotics Building Set',
            price: 59.99,
            imageUrl: 'images/robotics_kit.jpg',
            badge: 'Best Seller'
        },
        {
            id: 3,
            name: 'Dinosaur Excavation Kit',
            price: 24.99,
            imageUrl: 'https://lh3.googleusercontent.com/d/1BOE2c46OY6yDuL7b-MrHHem4Z8IEG-gj',
            badge: null
        },
        {
            id: 4,
            name: 'Magical Castle Playset',
            price: 79.99,
            imageUrl: 'images/castle_playset.jpg',
            badge: 'Limited'
        },
        {
            id: 5,
            name: 'Building Blocks Set',
            price: 29.99,
            imageUrl: 'images/building_blocks.jpg',
            badge: null
        },
        {
            id: 6,
            name: 'Remote Control Car',
            price: 45.50,
            imageUrl: 'images/rc_car.jpg',
            badge: 'Hot'
        }
    ];

    // --- Sticky Header --- 
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Cart State ---
    let cart = [];

    // --- Cart Drawer Elements ---
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBody = document.querySelector('.cart-body');
    const cartTotalElement = document.querySelector('.cart-total span:last-child');

    // --- Cart Drawer Functionality ---
    const openCart = () => {
        if (cartDrawer) cartDrawer.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('open');
    };

    const closeCart = () => {
        if (cartDrawer) cartDrawer.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('open');
    };

    if (cartButton) cartButton.addEventListener('click', openCart);
    if (closeCartButton) closeCartButton.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // --- Dynamic Product Grid ---
    const productGrid = document.getElementById('product-grid');

    function renderProducts() {
        if (!productGrid) return;

        productGrid.innerHTML = ''; // Clear existing products

        featuredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            let badgeHtml = '';
            if (product.badge) {
                badgeHtml = `<div class="product-badge">${product.badge}</div>`;
            }

            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
                ${badgeHtml}
            `;
            productGrid.appendChild(productCard);
        });
    }

    // --- Cart Logic ---
    function addToCart(productId) {
        const productToAdd = featuredProducts.find(p => p.id === productId);
        if (!productToAdd) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }

        updateCart();
        openCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    function updateCart() {
        renderCartItems();
        updateCartTotal();
    }

    function renderCartItems() {
        if (!cartBody) return;
        if (cart.length === 0) {
            cartBody.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cartBody.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img" loading="lazy">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">&times;</button>
            `;
            cartBody.appendChild(cartItem);
        });
    }

    function updateCartTotal() {
        if (!cartTotalElement) return;
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    // --- Event Listeners ---
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.dataset.id, 10);
                addToCart(productId);
            }
        });
    }

    if (cartBody) {
        cartBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const productId = parseInt(e.target.dataset.id, 10);
                removeFromCart(productId);
            }
        });
    }

    // --- Initial Load ---
    renderProducts();

});