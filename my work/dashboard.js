// Load user data on dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserDashboard();
    loadCartDisplay();
});

function loadUserDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    // Update user name
    document.getElementById('userName').textContent = currentUser.name;
    
    // Load profile information
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    // Format date
    const joinDate = new Date(currentUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('profileDate').textContent = joinDate;
    
    // Load loyalty points
    document.getElementById('loyaltyPoints').textContent = currentUser.loyaltyPoints || 0;
    document.getElementById('totalPoints').textContent = currentUser.loyaltyPoints || 0;
    
    // Update progress bar
    const points = currentUser.loyaltyPoints || 0;
    const nextReward = (Math.floor(points / 100) + 1) * 100;
    const progress = (points % 100) / 100 * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('nextReward').textContent = nextReward + ' points';
    
    // Load recent orders
    loadRecentOrders(currentUser);
}

function loadRecentOrders(user) {
    const ordersContainer = document.getElementById('recentOrders');
    
    if (!user.orders || user.orders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders yet. <a href="research-peptides.html">Start shopping</a></p>';
        return;
    }
    
    let ordersHTML = '';
    const recentOrders = user.orders.slice(-3).reverse();
    
    recentOrders.forEach((order, index) => {
        ordersHTML += `
            <div class="order-item">
                <strong>Order #${user.orders.length - index}</strong>
                <p>Items: ${order.items.length}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
                <p style="font-size: 0.9rem; color: #888;">
                    ${new Date(order.date).toLocaleDateString()}
                </p>
            </div>
        `;
    });
    
    ordersContainer.innerHTML = ordersHTML;
}

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
                <button onclick="removeFromCart(${index})" style="background: #ff4d4f; color: white; padding: 0.5rem; margin-top: 0.5rem;">Remove</button>
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
    location.reload();
}

function editProfile() {
    alert('Edit profile feature coming soon!');
}

function viewRewards() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const points = currentUser.loyaltyPoints || 0;
    alert(`You have ${points} loyalty points!\n\nEarn rewards:\n- Every $1 spent = 10 points\n- 100 points = $5 discount\n- 500 points = $30 discount\n- 1000 points = Free shipping`);
}

function changePassword() {
    const currentPassword = prompt('Enter your current password:');
    if (!currentPassword) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (btoa(currentPassword) !== currentUser.password) {
        alert('Current password is incorrect!');
        return;
    }
    
    const newPassword = prompt('Enter your new password:');
    if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    const confirmPassword = prompt('Confirm your new password:');
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Update password in users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex].password = btoa(newPassword);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        currentUser.password = btoa(newPassword);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Password changed successfully!');
    }
}

function manageSavedAddresses() {
    alert('Saved Addresses feature coming soon!');
}

function managePaymentMethods() {
    alert('Payment Methods feature coming soon!');
}

function notificationSettings() {
    alert('Notification Settings feature coming soon!');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}
