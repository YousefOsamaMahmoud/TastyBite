let cart = [];

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('tastybite-cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('tastybite-cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  saveCart();
  updateCartDisplay();

  const button = document.querySelector(`[data-item="${id}"]`);
  if (button) {
    button.classList.add('added');
    button.textContent = 'Added!';
    setTimeout(() => {
      button.classList.remove('added');
      button.textContent = 'Add to Cart';
    }, 1000);
  }
}

// Remove one unit of item
function removeFromCart(id) {
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartDisplay();
  }
}

// Remove item completely
function removeItemCompletely(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartDisplay();
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    saveCart();
    updateCartDisplay();
  }
}

// Update all cart displays
function updateCartDisplay() {
  updateCartCounter();
  updateCartModal();
  updateCartTotal();
}

// Update cart counter badge
function updateCartCounter() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const counter = document.getElementById('cartCounter');
  if (counter) {
    counter.textContent = totalItems;
    counter.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

// Update cart modal content
function updateCartModal() {
  const cartItemsList = document.getElementById('cartItemsList');
  if (!cartItemsList) return;
  cartItemsList.innerHTML = '';

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cart.forEach(item => {
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="removeFromCart('${item.id}')">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">+</button>
          <button class="remove-item" onclick="removeItemCompletely('${item.id}')">Remove</button>
        </div>
      `;
      cartItemsList.appendChild(cartItemElement);
    });
  }
}

// Update total price
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalElement = document.getElementById('cartTotal');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
}

// Toggle cart modal visibility
function toggleCart() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    updateCartDisplay();
  }
}

// Checkout process
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let orderSummary = 'Order Summary:\n\n';
  cart.forEach(item => {
    orderSummary += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
  });
  orderSummary += `\nTotal: $${total.toFixed(2)}\n\nProceed with checkout?`;

  if (confirm(orderSummary)) {
    alert('Thank you for your order!');
    cart = [];
    saveCart();
    updateCartDisplay();
    toggleCart();
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  loadCart();
  updateCartDisplay();
});
