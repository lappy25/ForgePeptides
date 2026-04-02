// Toggle FAQ items
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    
    // Close other open items in the same category
    const siblings = faqItem.parentElement.querySelectorAll('.faq-item');
    siblings.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    faqItem.classList.toggle('active');
}

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCartDisplay();
});

function loadCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('count');
    cartCount.textContent = cart.length;
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('active');
    
    if (cart.classList.contains('active')) {
        displayCartItems();
    }
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888;">Your cart is empty</p>';
        totalElement.textContent = '0';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong>
                <p>Quantity: ${item.quantity}</p>
                <p class="price">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})" style="background: #ff4d4f; color: white; padding: 0.5rem; margin-top: 0.5rem; font-size: 0.9rem;">Remove</button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    totalElement.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    loadCartDisplay();
    displayCartItems();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        loadCartDisplay();
        displayCartItems();
    }
}

function checkout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        alert('Please sign in first to checkout!');
        window.location.href = 'auth.html';
        return;
    }
    
    // Calculate total
    let total = 0;
    let cartDetails = '';
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        cartDetails += `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    // Create WhatsApp message
    const message = `Hello ForgePeptides!\n\nI would like to place an order:\n\n${cartDetails}\n\nTotal: $${total.toFixed(2)}\n\nCustomer: ${currentUser.name}\nEmail: ${currentUser.email}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Save order to user data
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        const order = {
            items: cart,
            total: total,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        
        users[userIndex].orders.push(order);
        users[userIndex].loyaltyPoints = (users[userIndex].loyaltyPoints || 0) + Math.floor(total * 10);
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        const updatedUser = users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    // Clear cart
    localStorage.removeItem('cart');
    loadCartDisplay();
    displayCartItems();
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    alert('Order sent! Please complete the order on WhatsApp.');
}

// Smooth scroll to FAQ sections
function scrollToCategory(categoryTitle) {
    const categories = document.querySelectorAll('.faq-category h2');
    for (let category of categories) {
        if (category.textContent.includes(categoryTitle)) {
            category.scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
        }
    }
}
