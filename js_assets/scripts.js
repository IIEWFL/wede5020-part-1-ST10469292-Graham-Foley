// ===========================
// BATTERLY WEBSITE SCRIPT
// ===========================

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------
    // PRODUCT SEARCH (Products page)
    // ---------------------------
    const productsList = document.querySelector('.products-list');
    if (productsList) {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search products...';
        searchInput.id = 'product-search';
        searchInput.style.marginBottom = '1rem';
        productsList.parentNode.insertBefore(searchInput, productsList);

        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const cards = productsList.querySelectorAll('.product-card');
            cards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                card.style.display = title.includes(filter) ? '' : 'none';
            });
        });
    }

    // ---------------------------
    // CART DYNAMIC CONTENT (Cart page)
    // ---------------------------
    const cartList = document.getElementById('cart-list');
    const addButtons = document.querySelectorAll('.add-to-cart-btn');

    function createCartItem(card) {
        const newItem = document.createElement('div');
        newItem.classList.add('cart-item');
        newItem.innerHTML = `
            <h3 class="product-title">${card.querySelector('.product-title').textContent}</h3>
            <div class="stars">${card.querySelector('.stars').textContent}</div>
            <p class="product-desc">${card.querySelector('.product-desc').textContent}</p>
            <div class="quantity-adjust">
                <button class="decrease-qty-btn">-</button>
                <input type="number" class="qty-input" value="1" min="1">
                <button class="increase-qty-btn">+</button>
            </div>
            <button class="remove-from-cart-btn">Remove</button>
        `;
        attachCartItemEvents(newItem);
        newItem.style.opacity = 0;
        cartList.appendChild(newItem);
        setTimeout(() => newItem.style.opacity = 1, 10);
    }

    function attachCartItemEvents(item) {
        const removeBtn = item.querySelector('.remove-from-cart-btn');
        removeBtn.addEventListener('click', () => {
            item.style.opacity = 0;
            setTimeout(() => item.remove(), 300);
        });

        const decreaseBtn = item.querySelector('.decrease-qty-btn');
        const increaseBtn = item.querySelector('.increase-qty-btn');
        const qtyInput = item.querySelector('.qty-input');

        decreaseBtn.addEventListener('click', () => {
            qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
        });
        increaseBtn.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
    }

    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (cartList) createCartItem(btn.closest('.product-card'));
        });
    });

    // ---------------------------
    // CART STORAGE USING LOCALSTORAGE
    // ---------------------------
    const CART_KEY = 'batterlyCart';

    // Retrieve cart from localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }

    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    // Add item to cart
    function addToCart(product) {
        const cart = getCart();
        // Check if product already exists
        const existing = cart.find(item => item.title === product.title);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(product);
        }
        saveCart(cart);
        alert(`${product.title} added to cart!`);
    }
    // Add click events for all add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = {
                title: btn.dataset.title,
                stars: btn.dataset.stars,
                desc: btn.dataset.desc,
                quantity: 1
            };
            addToCart(product);
        });
    });

    // ---------------------------
    // LIGHTBOX FOR RECIPES PAGE
    // ---------------------------
    const recipeImages = document.querySelectorAll('.recipe-images img');
    if (recipeImages.length) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = `
            position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,0,0.8); display:flex; justify-content:center; 
            align-items:center; opacity:0; pointer-events:none; transition: opacity 0.3s;
            z-index: 9999;
        `;
        const lightboxImg = document.createElement('img');
        lightboxImg.style.maxWidth = '90%';
        lightboxImg.style.maxHeight = '90%';
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);

        recipeImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.style.opacity = 1;
                lightbox.style.pointerEvents = 'auto';
            });
        });

        lightbox.addEventListener('click', () => {
            lightbox.style.opacity = 0;
            lightbox.style.pointerEvents = 'none';
        });
    }

    // ---------------------------
    // PRODUCT MODAL (Products & Homepage cards)
    // ---------------------------
    const modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.7); display:flex; justify-content:center;
        align-items:center; opacity:0; pointer-events:none; transition: opacity 0.3s; z-index: 9999;
    `;
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background:#fff; padding:20px; max-width:500px; border-radius:10px; text-align:center;
    `;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const allProductCards = document.querySelectorAll('.product-card');
    allProductCards.forEach(card => {
        card.addEventListener('dblclick', () => {
            const title = card.querySelector('.product-title').textContent;
            const desc = card.querySelector('.product-desc').textContent;
            modalContent.innerHTML = `<h2>${title}</h2><p>${desc}</p>`;
            modal.style.opacity = 1;
            modal.style.pointerEvents = 'auto';
        });
    });

    modal.addEventListener('click', () => {
        modal.style.opacity = 0;
        modal.style.pointerEvents = 'none';
    });

    // ---------------------------
    // REVIEW HOVER EFFECT (Reviews page)
    // ---------------------------
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        card.style.transition = 'transform 0.3s, opacity 0.3s';
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.03)';
            card.style.opacity = 0.9;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.opacity = 1;
        });
    });

    // ---------------------------
    // Smooth scroll for bottom nav links
    // ---------------------------
    const bottomNavLinks = document.querySelectorAll('.bottom-nav a');
    bottomNavLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

});
