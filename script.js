// Завантаження кошика з пам'яті браузера (щоб він не зникав при переході між сторінками)
let cart = JSON.parse(localStorage.getItem('motorx_cart')) || [];

// Елементи DOM
const buyButtons = document.querySelectorAll('.buy-btn');
const cartBadge = document.getElementById('cartBadge');
const cartContainer = document.getElementById('cartContainer');
const cartSummary = document.getElementById('cartSummary');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const notification = document.getElementById('notification');
const notifDesc = document.getElementById('notifDesc');
const checkoutBtn = document.getElementById('checkoutBtn');

// Оновлюємо бейдж одразу при завантаженні сторінки
updateCartBadge();

// Додавання товару в кошик за кліком на "Купити"
buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        const img = card.dataset.img;

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }

        saveCart();
        updateCartBadge();
        showNotification();
    });
});

// Зберігання кошика в localStorage
function saveCart() {
    localStorage.setItem('motorx_cart', JSON.stringify(cart));
}

// Оновлення лише цифри на іконці кошика в шапці
function updateCartBadge() {
    if (cartBadge) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalCount;
    }
}

// Функція оновлення сторінки кошика (якщо ми на сторінці cart.html)
if (cartContainer) {
    renderCartPage();
}

function renderCartPage() {
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart-msg">Ваш кошик порожній</div>';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.classList.add('cart-item');
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} грн</div>
                </div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                <span><strong>${itemTotal.toLocaleString()} грн</strong></span>
                <button class="remove-btn" onclick="removeItem('${item.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        cartContainer.appendChild(cartItemEl);
    });

    if (cartTotalPrice) cartTotalPrice.textContent = totalPrice.toLocaleString() + ' грн';
    if (cartSummary) cartSummary.style.display = 'flex';
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        updateCartBadge();
        renderCartPage();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
    renderCartPage();
}

function showNotification() {
    if (!notification) return;
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000);
    notifDesc.textContent = `Ваш товар буде № ${randomOrderNumber}`;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        const randomOrderNumber = Math.floor(10000 + Math.random() * 90000);
        alert(`Дякуємо за замовлення! Ваше замовлення №${randomOrderNumber} успішно оформлено.`);
        cart = [];
        saveCart();
        updateCartBadge();
        renderCartPage();
    });
}