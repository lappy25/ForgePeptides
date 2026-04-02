// Cart functionality
let cart = [];

function loadCart(){
    let saved = localStorage.getItem('cart');
    if(saved){
        try{ cart = JSON.parse(saved) || []; } catch(e){ cart = []; }
    }
    updateCart();
}

function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price){
    cart.push({name, price});
    updateCart();
    saveCart();
}

function updateCart(){
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

function removeFromCart(index){
    cart.splice(index, 1);
    updateCart();
    saveCart();
}

function clearCart(){
    cart = [];
    updateCart();
    saveCart();
}

function toggleCart(){
    document.getElementById("cart").classList.toggle("active");
}

function checkout(){
    let message = "Hello, I want to order:%0A";

    cart.forEach(item => {
        message += `${item.name} - $${item.price}%0A`;
    });

    message += "%0AConfirm my order.";

    // 🔥 PUT YOUR WHATSAPP NUMBER HERE
    let phone = "+19085701335";

    window.open(`https://wa.me/${phone}?text=${message}`);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', loadCart);