// USER AUTHENTICATION SYSTEM
let cart = [];

// Create admin user if not exists
function createAdminUser() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const ownerExists = users.find(user => user.email === 'owner@forgepeptides.com');

    if (!ownerExists) {
        const ownerUser = {
            id: 'owner-' + Date.now(),
            name: 'Website Owner',
            email: 'owner@forgepeptides.com',
            password: btoa('ForgeOwner2026!'), // Secure password for owner
            createdAt: new Date().toISOString(),
            orders: [],
            loyaltyPoints: 0,
            isOwner: true,
            isAdmin: true
        };
        users.push(ownerUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Owner account created: owner@forgepeptides.com / ForgeOwner2026!');
    }
}

// Auto-login for owner via URL parameter
function checkAutoLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const autoLogin = urlParams.get('autologin');

    if (autoLogin === 'owner') {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const owner = users.find(user => user.isOwner);

        if (owner) {
            // Auto-login the owner
            localStorage.setItem('currentUser', JSON.stringify(owner));

            // Record login
            const logins = JSON.parse(localStorage.getItem('logins')) || [];
            logins.push({
                email: owner.email,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                autoLogin: true
            });
            localStorage.setItem('logins', JSON.stringify(logins));

            // Redirect to admin dashboard
            window.location.href = 'admin.html';
            return true;
        }
    }
    return false;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    createAdminUser();

    // Check for auto-login first
    if (!checkAutoLogin()) {
        loadUserData();
        loadCartDisplay();
    }
});

// Notify admin of visitor
function notifyVisitor() {
    const existingVisitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const visitTimestamp = new Date().toLocaleString();
    const newVisitor = {
        id: Date.now(),
        timestamp: visitTimestamp,
        userAgent: navigator.userAgent,
        viewed: false
    };
    
    existingVisitors.push(newVisitor);
    localStorage.setItem('visitors', JSON.stringify(existingVisitors));
    
    // Show notification on admin.html
    console.log('New visitor detected at:', visitTimestamp);
}

// Toggle between sign in and register forms
function toggleAuthForm(event) {
    event.preventDefault();
    const signInForm = document.getElementById('signInForm');
    const registerForm = document.getElementById('registerForm');
    
    signInForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const rememberMe = document.getElementById('register-remember-checkbox').checked;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert('This email is already registered!');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: btoa(password), // Simple encoding (not secure for production)
        createdAt: new Date().toLocaleString(),
        orders: [],
        loyaltyPoints: 0
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log the new user in
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    if (rememberMe) {
        localStorage.setItem('rememberMeEmail', email);
        localStorage.setItem('rememberMePassword', btoa(password));
    }
    
    // Show enhanced success message with auto-redirect
    showSuccessMessage('🎉 Account Created Successfully!', 'Welcome to ForgePeptides, ' + name + '! Your account is ready and you\'re now logged in. Redirecting you to explore our premium peptides...', true);

    // Auto-redirect after 3 seconds
    setTimeout(() => {
        redirectToDashboard();
    }, 3000);
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    registrations.push({
        userId: newUser.id,
        name: name,
        email: email,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

// Handle sign in
function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const rememberMe = document.getElementById('remember-checkbox').checked;
    
    // Get users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user by email
    const user = users.find(u => u.email === email && u.password === btoa(password));
    
    if (!user) {
        alert('Invalid email or password!');
        return;
    }
    
    // Log user in
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (rememberMe) {
        localStorage.setItem('rememberMeEmail', email);
        localStorage.setItem('rememberMePassword', btoa(password));
    }
    
    // Show enhanced success message with auto-redirect
    showSuccessMessage('👋 Welcome Back!', 'Hello ' + user.name + '! You\'re now signed in and ready to explore our premium peptides. Redirecting to your dashboard...', true);

    // Auto-redirect after 2 seconds for sign-in
    setTimeout(() => {
        redirectToDashboard();
    }, 2000);
    const logins = JSON.parse(localStorage.getItem('logins')) || [];
    logins.push({
        userId: user.id,
        email: email,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('logins', JSON.stringify(logins));
}

// Show success message
function showSuccessMessage(title, text, autoRedirect = false) {
    const signInForm = document.getElementById('signInForm');
    const registerForm = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');

    signInForm.classList.add('hidden');
    registerForm.classList.add('hidden');

    document.getElementById('successTitle').textContent = title;
    document.getElementById('successText').textContent = text;

    successMessage.classList.remove('hidden');

    // Add countdown for auto-redirect
    if (autoRedirect) {
        let countdown = 3;
        const countdownElement = document.createElement('p');
        countdownElement.id = 'countdown';
        countdownElement.style.cssText = 'color: #666; font-size: 14px; margin-top: 10px;';
        countdownElement.textContent = `Redirecting in ${countdown} seconds...`;

        const successText = document.getElementById('successText');
        successText.appendChild(countdownElement);

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownElement.textContent = `Redirecting in ${countdown} seconds...`;
            } else {
                clearInterval(countdownInterval);
                countdownElement.textContent = 'Redirecting now...';
            }
        }, 1000);
    }
}

// Redirect to dashboard
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Handle forgot password
function handleForgotPassword(event) {
    event.preventDefault();
    alert('Password reset functionality coming soon! For now, please contact support at support@forgepeptides.com');
}

// Load user data on page load
function loadUserData() {
    const rememberMeEmail = localStorage.getItem('rememberMeEmail');
    const rememberMePassword = localStorage.getItem('rememberMePassword');
    if (rememberMeEmail) {
        document.getElementById('signin-email').value = rememberMeEmail;
        document.getElementById('remember-checkbox').checked = true;
        if (rememberMePassword) {
            document.getElementById('signin-password').value = atob(rememberMePassword);
        }
    }
    
    // Notify of visitor
    notifyVisitor();
}

// Load cart
function loadCart() {
    let saved = localStorage.getItem('cart');
    if (saved) {
        try {
            cart = JSON.parse(saved) || [];
        } catch (e) {
            cart = [];
        }
    }
    updateCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    saveCart();
}

function updateCart() {
    let items = document.getElementById("cart-items");
    let total = 0;
    items.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price;
        items.innerHTML += `<div class="cart-item">${item.name} - $${item.price} <button onclick="removeFromCart(${index})" style="margin-left:10px; background:#ff4d4f; color:#fff; border-radius:4px;">Remove</button></div>`;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("count").innerText = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCart();
}

function clearCart() {
    cart = [];
    updateCart();
    saveCart();
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("active");
}

function checkout() {
    let message = "Hello, I want to order:%0A";

    cart.forEach(item => {
        message += `${item.name} - $${item.price}%0A`;
    });

    message += "%0AConfirm my order.";
    let phone = "+19085701335";

    window.open(`https://wa.me/${phone}?text=${message}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadCart();
});
