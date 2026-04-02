// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if owner/admin is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isOwner) {
        alert('Access denied. Only the website owner can access this page.');
        window.location.href = 'index.html';
        return;
    }

    // Initialize default products if needed
    initializeDefaultProducts();

    // Initialize dashboard
    loadDashboardStats();
    loadVisitors();
    loadRegistrations();
    loadLogins();
    loadProducts();
    loadOrders();

    // Set up tab switching
    setupTabs();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));

            // Show selected tab content
            const tabId = this.getAttribute('onclick').match(/switchTab\('(\w+)'\)/)[1];
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function switchTab(tabName) {
    // This function is called from HTML onclick
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });

    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// Initialize default products if none exist
function initializeDefaultProducts() {
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (existingProducts.length === 0) {
        const defaultProducts = [
            { name: 'GHK-Cu', price: 75, description: 'Copper tripeptide known for its anti-aging properties, wound healing, and skin regeneration. Research shows benefits for hair growth and tissue repair.', mg: '10mg', purity: '99%+' },
            { name: 'BPC-157', price: 120, description: 'Body Protection Compound that accelerates healing of tendons, ligaments, muscles, and skin. Known for its regenerative properties and injury recovery.', mg: '15mg', purity: '99%+' },
            { name: 'TB-500', price: 110, description: 'Thymosin Beta-4 peptide that promotes healing, reduces inflammation, and enhances tissue repair. Research indicates benefits for muscle recovery and endurance.', mg: '10mg', purity: '99%+' },
            { name: 'CJC-1295', price: 140, description: 'Growth hormone secretagogue that increases GH production. Research shows benefits for muscle growth, fat loss, and recovery from intense training.', mg: '5mg', purity: '99%+' },
            { name: 'Ipamorelin', price: 130, description: 'Selective growth hormone secretagogue that stimulates GH release. Known for its ability to promote lean muscle growth and fat metabolism.', mg: '5mg', purity: '99%+' },
            { name: 'MGF (Mechano Growth Factor)', price: 150, description: 'Muscle repair peptide that activates satellite cells for muscle regeneration. Research indicates accelerated recovery and hypertrophy benefits.', mg: '5mg', purity: '98%+' },
            { name: 'Semaglutide (GLP-1)', price: 280, description: 'GLP-1 receptor agonist renowned for metabolic research. Studies show significant benefits for weight management, glucose regulation, and metabolic health.', mg: '30mg', purity: '99.9%' },
            { name: 'Tirzepatide', price: 320, description: 'Dual GLP-1/GIP receptor agonist. Research indicates superior metabolic effects compared to single agonists, with enhanced weight loss and glycemic control.', mg: '25mg', purity: '99.9%' },
            { name: 'PT-141 (Bremelanotide)', price: 180, description: 'Melanocortin receptor agonist studied for sexual wellness and arousal research. Known for its unique mechanism of action in neural pathways.', mg: '20mg', purity: '99%+' },
            { name: 'AOD-9604', price: 160, description: 'HGH fragment specifically designed for adipose tissue research. Studies focus on targeted fat metabolism without affecting growth or blood glucose.', mg: '20mg', purity: '99%+' },
            { name: 'Tesamorelin', price: 220, description: 'Growth hormone releasing hormone analog. Research applications include metabolic studies and visceral adipose tissue reduction.', mg: '15mg', purity: '99%+' },
            { name: 'Selank', price: 95, description: 'Nootropic peptide with anxiolytic properties. Research explores cognitive enhancement, stress reduction, and neurotransmitter regulation.', mg: '15mg', purity: '99%+' },
            { name: 'Epithalamin (Epitalon)', price: 125, description: 'Telomerase activator studied for anti-aging research. Investigations focus on cellular longevity, DNA protection, and age-related conditions.', mg: '15mg', purity: '99%+' },
            { name: 'Thymosin Alpha-1', price: 170, description: 'Immune system modulator. Research applications include immune enhancement, viral infection studies, and autoimmune condition investigations.', mg: '15mg', purity: '99%+' },
            { name: 'PEG-MGF', price: 190, description: 'Pegylated Mechano Growth Factor with extended half-life. Research indicates prolonged muscle repair activation and enhanced recovery protocols.', mg: '5mg', purity: '98%+' },
            { name: 'GHRP-6', price: 115, description: 'Growth hormone releasing peptide that stimulates appetite and GH release. Research explores metabolic effects and growth hormone pathways.', mg: '10mg', purity: '99%+' },
            { name: 'IGF-1 LR3', price: 250, description: 'Long-acting Insulin-like Growth Factor analog. Studies focus on muscle hypertrophy, tissue repair, and anabolic signaling pathways.', mg: '5mg', purity: '99%+' },
            { name: 'MT-II (Melanotan II)', price: 105, description: 'Melanocortin receptor agonist. Research applications include pigmentation studies, photoprotection, and appetite regulation.', mg: '10mg', purity: '99%+' },
            { name: 'DSIP', price: 100, description: 'Delta sleep-inducing peptide. Research explores sleep regulation, stress response modulation, and neuroprotective properties.', mg: '10mg', purity: '99%+' },
            { name: 'CJC-1295/Ipamorelin Combo', price: 240, description: 'Popular combination of growth hormone secretagogues. Research indicates synergistic effects for enhanced GH release and metabolic benefits.', mg: '5mg/5mg', purity: '99%+' },
            { name: 'CPC-157', price: 135, description: 'Body Protection Compound variant with enhanced stability. Research focuses on gastrointestinal healing, tissue repair, and regenerative medicine.', mg: '10mg', purity: '99%+' }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

function loadDashboardStats() {
    const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const registrations = JSON.parse(localStorage.getItem('users')) || [];
    const logins = JSON.parse(localStorage.getItem('logins')) || [];

    // Calculate revenue from orders
    let totalRevenue = 0;
    registrations.forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                totalRevenue += order.total || 0;
            });
        }
    });

    document.getElementById('totalVisitors').textContent = visitors.length;
    document.getElementById('totalRegistrations').textContent = registrations.length;
    document.getElementById('totalLogins').textContent = logins.length;
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
}

function loadVisitors() {
    const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const tableBody = document.getElementById('visitorsTable');

    if (visitors.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">No visitors yet</td></tr>';
        return;
    }

    let html = '';
    visitors.forEach(visitor => {
        const date = new Date(visitor.timestamp).toLocaleString();
        const viewed = visitor.viewed ? '✅ Viewed' : '👁️ Not Viewed';
        html += `
            <tr>
                <td>${date}</td>
                <td>${visitor.userAgent.substring(0, 50)}...</td>
                <td>${viewed}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function loadRegistrations() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('registrationsTable');

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #888;">No registrations yet</td></tr>';
        return;
    }

    let html = '';
    users.forEach(user => {
        const joinDate = new Date(user.createdAt).toLocaleDateString();
        const orderCount = user.orders ? user.orders.length : 0;
        html += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${joinDate}</td>
                <td>${orderCount}</td>
                <td>
                    <button onclick="viewUserDetails('${user.email}')" class="primary-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">View</button>
                    <button onclick="deleteUser('${user.email}')" class="danger-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Delete</button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function loadLogins() {
    const logins = JSON.parse(localStorage.getItem('logins')) || [];
    const tableBody = document.getElementById('loginsTable');

    if (logins.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">No logins yet</td></tr>';
        return;
    }

    let html = '';
    logins.slice(-50).reverse().forEach(login => { // Show last 50 logins
        const date = new Date(login.timestamp).toLocaleString();
        const device = login.userAgent ? login.userAgent.split(' ').slice(-2).join(' ') : 'Unknown';
        html += `
            <tr>
                <td>${login.email}</td>
                <td>${date}</td>
                <td>${device}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('list');

    if (products.length === 0) {
        productList.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">No products added yet</p>';
        return;
    }

    let html = '';
    products.forEach((product, index) => {
        const specs = product.mg && product.purity ? `${product.mg} • ${product.purity} Purity` : '';
        html += `
            <div class="product-item">
                <div>
                    <h4>${product.name}</h4>
                    ${specs ? `<p class="specs">${specs}</p>` : ''}
                    <p>${product.description || 'No description'}</p>
                    <p class="price">$${product.price}</p>
                </div>
                <button onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
    });

    productList.innerHTML = html;
}

function loadOrders() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('ordersTable');

    let allOrders = [];
    users.forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                allOrders.push({
                    ...order,
                    customer: user.name,
                    email: user.email
                });
            });
        }
    });

    if (allOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #888;">No orders yet</td></tr>';
        return;
    }

    // Sort by date (newest first)
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = '';
    allOrders.forEach((order, index) => {
        const date = new Date(order.date).toLocaleDateString();
        const status = order.status || 'pending';
        html += `
            <tr>
                <td>#${String(index + 1).padStart(4, '0')}</td>
                <td>${order.customer}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>${date}</td>
                <td><span style="color: ${status === 'completed' ? '#00e5ff' : '#ff9800'};">${status}</span></td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Product Management
function addProduct() {
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value.trim();

    if (!name || !price || price <= 0) {
        alert('Please enter valid product name and price');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ name, price, description });
    localStorage.setItem('products', JSON.stringify(products));

    // Clear form
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';

    loadProducts();
    alert('Product added successfully!');
}

function deleteProduct(index) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));

    loadProducts();
}

// User Management
function viewUserDetails(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        alert('User not found');
        return;
    }

    let details = `Name: ${user.name}\nEmail: ${user.email}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}\nLoyalty Points: ${user.loyaltyPoints || 0}\n\nOrders: ${user.orders ? user.orders.length : 0}`;

    if (user.orders && user.orders.length > 0) {
        details += '\n\nOrder History:';
        user.orders.forEach((order, index) => {
            details += `\nOrder ${index + 1}: $${order.total.toFixed(2)} (${new Date(order.date).toLocaleDateString()})`;
        });
    }

    alert(details);
}

function deleteUser(email) {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filteredUsers = users.filter(u => u.email !== email);
    localStorage.setItem('users', JSON.stringify(users));

    loadRegistrations();
    loadDashboardStats();
    alert('User deleted successfully');
}

// Data Management
function clearVisitors() {
    if (!confirm('Are you sure you want to clear all visitor data?')) return;

    localStorage.removeItem('visitors');
    loadVisitors();
    loadDashboardStats();
    alert('Visitor data cleared');
}

function clearLogins() {
    if (!confirm('Are you sure you want to clear all login history?')) return;

    localStorage.removeItem('logins');
    loadLogins();
    loadDashboardStats();
    alert('Login history cleared');
}

// Export Functions
function exportRegistrations() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let csv = 'Name,Email,Join Date,Orders,Loyalty Points\n';

    users.forEach(user => {
        const joinDate = new Date(user.createdAt).toLocaleDateString();
        const orders = user.orders ? user.orders.length : 0;
        const points = user.loyaltyPoints || 0;
        csv += `"${user.name}","${user.email}","${joinDate}",${orders},${points}\n`;
    });

    downloadCSV(csv, 'registrations.csv');
}

function exportOrders() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let csv = 'Order ID,Customer,Email,Total,Date,Status\n';

    let orderId = 1;
    users.forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                const date = new Date(order.date).toLocaleDateString();
                const status = order.status || 'pending';
                csv += `${orderId},"${user.name}","${user.email}",${order.total},"${date}","${status}"\n`;
                orderId++;
            });
        }
    });

    downloadCSV(csv, 'orders.csv');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}