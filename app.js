const PIZZAS = [
    { id: 1, name: "American Heat", category: "Classic", prices: { Regular: 800, Party: 1550 }, img: "american-heat.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 2, name: "Smokey Wheel", category: "Classic", prices: { Regular: 800, Party: 1550 }, img: "smoky-wheel.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 3, name: "Extreme Kababish", category: "Premium", prices: { Regular: 900, Party: 1750 }, img: "extreme-kababish.png", desc: "Pizza with Seekh Kabab and Cheese on Dough." },
    { id: 4, name: "Mughlai Pizza", category: "Premium", prices: { Regular: 900, Party: 1750 }, img: "mughlai-pizza.png", desc: "Pizza with Creamy Sauce, with Cheese." },
    { id: 5, name: "Dynamite Ranch", category: "Premium", prices: { Regular: 900, Party: 1750 }, img: "dynamite-ranch.png", desc: "Pizza with Chicken and Cheese." },
    { id: 6, name: "Double Dough American Heat", category: "Double Dough", prices: { standard: 2100 }, img: "american-heat.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 7, name: "Double Dough Smokey Wheel", category: "Double Dough", prices: { standard: 2100 }, img: "smoky-wheel.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 8, name: "Double Dough Extreme Kababish", category: "Double Dough", prices: { standard: 2100 }, img: "smoky-wheel.png", desc: "Pizza with Seekh Kabab and Cheese on Dough." },
    { id: 9, name: "Double Dough Mughlai Pizza", category: "Double Dough", prices: { standard: 2100 }, img: "mughlai-pizza.png", desc: "Pizza with Creamy Sauce, with Cheese." },
    { id: 10, name: "Double Dough Dynamite Ranch", category: "Double Dough", prices: { standard: 2100 }, img: "dynamite-ranch.png", desc: "Pizza with Chicken and Cheese." },
    { id: 11, name: "10 Pcs Buzz Bites", category: "Others", prices: { Standard: 500 }, img: "buzz-bites.png", desc: "Golden chicken, dip it in the sauce." },
    { id: 12, name: "Small Chocolate Pizza", category: "Others", prices: { Standard: 500 }, img: "chocolate-pizza.png", desc: "Mini Pizza with Chocolate over it." },
    { id: 13, name: "Baked Drummet", category: "Others", prices: { "6 Pieces": 370, "15 Pieces": 1000 }, img: "baked-drummet.png", desc: "Oven-baked chicken drummets." }
];

let cart = JSON.parse(localStorage.getItem('dash_cart')) || [];
let orders = JSON.parse(localStorage.getItem('dash_orders')) || [];
let unreadOrdersCount = parseInt(localStorage.getItem('dash_unread_orders')) || 0;
let appliedDiscount = 0; 

function saveState() {
    if (cart.length === 0) {
        appliedDiscount = 0;
    }
    localStorage.setItem('dash_cart', JSON.stringify(cart));
    localStorage.setItem('dash_orders', JSON.stringify(orders));
    localStorage.setItem('dash_unread_orders', unreadOrdersCount);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) cartBadge.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    const orderBadge = document.getElementById('order-count');
    if (orderBadge) {
        if (window.location.hash === "#/orders") { unreadOrdersCount = 0; localStorage.setItem('dash_unread_orders', 0); }
        orderBadge.innerText = unreadOrdersCount;
        orderBadge.classList.toggle('hidden', unreadOrdersCount === 0);
    }
    renderFloatingCart();
}

function isStoreOpen() {
    const now = new Date();
    const pkTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Karachi"}));
    const hours = pkTime.getHours();
    const minutes = pkTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes >= 1020 || totalMinutes <= 165); 
}

function renderFloatingCart() {
    const barContainer = document.getElementById('floating-cart-bar');
    if (!barContainer) return;
    if (cart.length === 0 || window.location.hash === "#/cart") { barContainer.innerHTML = ""; return; }

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    barContainer.innerHTML = `
        <div class="pointer-events-auto cursor-pointer flex flex-col items-center mb-1" onclick="location.hash='#/cart'">
            <div class="w-24 h-24 md:w-32 md:h-32 bg-[#154BD1] text-[#F3F2D4] rounded-[2.5rem] shadow-[0_20px_50px_rgba(21,75,209,0.5)] flex flex-col items-center justify-center border-4 border-white transform transition duration-300 hover:scale-110 active:scale-95">
                <div class="relative mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 md:h-9 md:w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <span class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] md:text-xs w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-black border-2 border-[#154BD1]">${totalQty}</span>
                </div>
                <span class="font-black text-[10px] md:text-xs uppercase tracking-tighter mb-1">View Cart</span>
                <span class="font-black text-xs md:text-base">Rs. ${totalPrice}</span>
            </div>
        </div>`;
}

const router = (withAnimation = true) => {
    const wave = document.getElementById('wave-transition');
    const routes = [{ path: "#/", view: HomeView }, { path: "#/cart", view: CartView }, { path: "#/orders", view: OrdersView }];
    const match = routes.find(r => r.path === (location.hash || "#/")) || routes[0];

    if (withAnimation && wave) {
        wave.classList.remove('wave-active');
        void wave.offsetWidth; 
        wave.classList.add('wave-active');
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.getElementById("app").innerHTML = `<main class="min-h-screen pb-32">${match.view()}</main>${renderFooter()}`;
            saveState();
            attachListeners();
        }, 500); 
    } else {
        document.getElementById("app").innerHTML = `<main class="min-h-screen pb-32">${match.view()}</main>${renderFooter()}`;
        saveState();
        attachListeners();
    }
};

window.addEventListener("hashchange", () => router(true));
window.addEventListener("load", () => router(true));
setInterval(() => { if (location.hash === '#/orders') router(false); }, 1000);

function renderFooter() {
    return `<footer class="mt-20 border-t-4 border-[#154BD1] bg-white rounded-t-[3rem] pt-16 pb-8 px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-[#154BD1]">
            <div><a href="#/" class="text-3xl md:text-4xl font-black uppercase mb-4 block">Dash Dough</a></div>
            <div>
                <h4 class="text-xs font-black uppercase mb-6 opacity-40">Links</h4>
                <ul class="flex flex-col gap-3 font-bold uppercase">
                    <li><a href="#/">Explore Menu</a></li>
                    <li><a href="#/cart">Your Cart</a></li>
                    <li><a href="#/orders">Your Orders</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-xs font-black uppercase mb-6 opacity-40">Contact</h4>
                <p class="font-black text-lg opacity-80">0370-3302022</p>
                <p class="font-bold opacity-70">dashdough4@gmail.com</p>
            </div>
        </div>
    </footer>`;
}

function HomeView() {
    let html = `<header class="mb-10 px-0"><div class="w-full mt-10 h-[180px] rounded-2xl md:h-[300px] flex items-center justify-center bg-[#D89000]"><img src="hero-img.jpeg" alt="Banner" class="max-w-full max-h-full object-contain"></div></header>`;
    ["Classic", "Premium", "Double Dough", "Others"].forEach(cat => {
        html += `<section class="mb-20 px-2 md:px-4"><h2 class="text-2xl md:text-3xl font-bold mb-10 border-b-2 border-[#154BD1] inline-block pb-2 uppercase ml-2">${cat}</h2><div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">`;
        PIZZAS.filter(p => p.category === cat).forEach(pizza => {
            const minPrice = Math.min(...Object.values(pizza.prices));
            const showFrom = (cat === "Classic" || cat === "Premium" || pizza.name === "Baked Drummet");
            
            html += `<div class="pizza-card bg-yellow-400 rounded-2xl overflow-hidden shadow-2xl border-2 border-white hover:border-[#154BD1] transition flex flex-col">
                <div class="p-3 md:p-5">
                    <div class="rounded-2xl flex items-center justify-center bg-yellow-400 img-container">
                        <img src="${pizza.img}" class="w-full h-32 md:h-56 object-contain png-fix" loading="lazy">
                    </div>
                </div>
                <div class="p-4 md:p-8 pt-0 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="text-sm md:text-2xl font-black uppercase">${pizza.name}</h3>
                        <p class="text-[10px] md:text-[12px] font-black bg-white px-3 py-3 rounded-md w-fit mt-1 uppercase">
                            ${showFrom ? 'FROM ' : ''}RS. ${minPrice}
                        </p>
                        <p class="text-[10px] md:text-xs font-bold opacity-80 my-4 line-clamp-2">${pizza.desc}</p>
                    </div>
                    <div class="flex items-center justify-between gap-2 mb-4 bg-white/50 p-2 rounded-xl">
                        <button onclick="updateMenuQty(${pizza.id}, -1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg font-black">-</button>
                        <span id="menu-qty-${pizza.id}" class="font-black text-lg">1</span>
                        <button onclick="updateMenuQty(${pizza.id}, 1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg font-black">+</button>
                    </div>
                    <button onclick="addToCart(${pizza.id})" class="w-full bg-[#154BD1] text-[#F3F2D4] py-2 md:py-4 rounded-xl font-black uppercase">Add to Cart</button>
                </div>
            </div>`;
        });
        html += `</div></section>`;
    });
    return html;
}

window.updateMenuQty = (id, delta) => {
    const el = document.getElementById(`menu-qty-${id}`);
    if(el) el.innerText = Math.max(1, parseInt(el.innerText) + delta);
};

function CartView() {
    if (cart.length === 0) return `<div class="text-center py-20 uppercase font-black opacity-20"><h2>Cart Empty</h2></div>`;
    
    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discountAmount = subtotal * appliedDiscount;
    let finalTotal = subtotal - discountAmount;

    return `<div class="max-w-4xl mx-auto px-2"><h2 class="text-3xl font-black uppercase mb-10">Your Cart</h2><div id="cart-items-container">
        ${cart.map(item => {
            const pizza = PIZZAS.find(p => p.id === item.id);
            return `<div class="flex items-center justify-between bg-white p-4 rounded-2xl mb-4 shadow-sm">
                <div class="flex items-center gap-4"><img src="${pizza.img}" class="w-16 h-16 object-contain png-fix"><div><h4 class="text-xs md:text-xl font-black uppercase">${pizza.name} [${item.size}]</h4><p class="font-bold opacity-60">Rs. ${item.price}</p></div></div>
                <div class="flex items-center gap-4"><button onclick="changeQty(${item.id}, '${item.size}', -1)" class="font-black px-2">-</button><span class="font-black">${item.qty}</span><button onclick="changeQty(${item.id}, '${item.size}', 1)" class="font-black px-2">+</button><button onclick="removeItem(${item.id}, '${item.size}')" class="text-red-500 font-bold ml-4">✕</button></div>
            </div>`;
        }).join("")}
        </div>
        <div class="bg-white p-6 rounded-3xl mt-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <input type="text" id="promo-input" placeholder="Promo Code" class="w-full p-4 rounded-xl border-2 border-[#154BD1]/10 font-bold uppercase">
            <button onclick="applyPromo()" class="w-full md:w-40 bg-[#154BD1] text-white py-4 rounded-xl font-black uppercase">Apply</button>
        </div>
        <div class="bg-[#154BD1] text-[#F3F2D4] p-8 rounded-[2rem] mt-6">
            <div class="mb-6 space-y-2 border-b border-white/20 pb-4">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-bold uppercase opacity-70">Subtotal</span>
                    <span class="font-black">Rs. ${subtotal}</span>
                </div>
                ${appliedDiscount > 0 ? `
                <div class="flex justify-between items-center text-green-300">
                    <span class="text-sm font-bold uppercase">Promo (10% Off)</span>
                    <span class="font-black">- Rs. ${discountAmount.toFixed(0)}</span>
                </div>` : ''}
            </div>
            
            <div class="mb-4">
                <p class="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Notice</p>
                <p class="text-xs font-bold uppercase">Online payment coming soon. <br> Delivery charges will be applied upon confirmation.</p>
            </div>
            <h3 class="text-2xl font-black mb-6 uppercase flex items-baseline gap-2">
                Total: Rs. ${finalTotal.toFixed(0)} 
                <span class="text-xs opacity-70 font-bold italic">+ Delivery Charges</span>
            </h3>
            <form id="order-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" id="cust-name" placeholder="Full Name" required class="p-4 rounded-xl text-[#154BD1] font-bold">
                <input type="text" id="cust-phone" placeholder="Phone" required class="p-4 rounded-xl text-[#154BD1] font-bold">
                <input type="email" id="cust-email" placeholder="Gmail" required class="p-4 rounded-xl text-[#154BD1] font-bold md:col-span-2">
                <input type="text" id="cust-address" placeholder="Address" required class="p-4 rounded-xl text-[#154BD1] font-bold md:col-span-2">
                <button type="submit" id="order-btn" class="md:col-span-2 bg-[#F3F2D4] text-[#154BD1] py-5 rounded-xl font-black uppercase text-xl mt-4">Order Now</button>
            </form>
        </div>
    </div>`;
}

window.applyPromo = () => {
    const code = document.getElementById('promo-input').value.trim().toLowerCase();
    
    if (code === "welcome10%") {
        if (appliedDiscount > 0) {
            showNotification("PROMO CODE IS ALREADY APPLIED");
        } else {
            appliedDiscount = 0.10;
            showNotification("10% DISCOUNT APPLIED!");
            router(false);
        }
    } else {
        showNotification("INVALID PROMO CODE");
    }
};

function OrdersView() {
    if (orders.length === 0) return `<div class="text-center py-20 uppercase font-black opacity-20"><h2>No History</h2></div>`;
    return `<div class="max-w-3xl mx-auto px-4"><h2 class="text-3xl font-black mb-10 uppercase">Order History</h2>${renderOrdersList()}</div>`;
}

function renderOrdersList() {
    const now = Date.now();
    return orders.map(order => {
        const timeLeft = Math.max(0, 300000 - (now - order.timestamp));
        const min = Math.floor(timeLeft / 60000), sec = Math.floor((timeLeft % 60000) / 1000);
        
        const orderItemsHtml = order.items.map(item => {
            const pizza = PIZZAS.find(p => p.id === item.id);
            return `<div class="text-[11px] font-bold opacity-80 uppercase">${item.qty}x ${pizza ? pizza.name : 'Pizza'} (${item.size})</div>`;
        }).join("");

        return `<div class="bg-white p-6 rounded-3xl mb-6 shadow-md border-l-8 border-[#154BD1]">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-[10px] opacity-40 font-black uppercase">ID: ${order.id}</p>
                    <div class="my-2 border-y border-gray-100 py-2">${orderItemsHtml}</div>
                    <p class="text-xl font-black">Rs. ${order.total}</p>
                </div>
                <div class="text-right">
                    ${timeLeft > 0 ? `<p class="text-xs text-red-500 font-black uppercase animate-pulse">${min}:${sec < 10 ? '0' : ''}${sec}</p><button onclick="askCancelOrder('${order.id}')" class="bg-red-500 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase mt-1">Cancel</button>` : `<span class="bg-green-100 text-green-600 px-4 py-2 rounded-xl font-black uppercase text-xs">Confirmed</span>`}
                </div>
            </div>
        </div>`;
    }).join("");
}

window.addToCart = (id) => {
    const pizza = PIZZAS.find(p => p.id === id);
    if (Object.keys(pizza.prices).length > 1) openSizeModal(pizza);
    else confirmAddToCart(pizza.id, Object.keys(pizza.prices)[0], Object.values(pizza.prices)[0]);
};

function openSizeModal(pizza) {
    const menuQty = parseInt(document.getElementById(`menu-qty-${pizza.id}`).innerText);
    const modal = document.createElement('div'); 
    modal.id = 'modal-overlay';
    modal.className = "fixed inset-0 z-[1000] flex items-center justify-center bg-transparent pointer-events-auto";
    
    let buttons = Object.entries(pizza.prices).map(([size, price]) => {
        let servingText = "";
        if (size.toLowerCase() === "regular") servingText = `<div class="text-[10px] opacity-70">Serving for 1-2 people</div>`;
        if (size.toLowerCase() === "party") servingText = `<div class="text-[10px] opacity-70">Serving for 3-4 people</div>`;
        
        return `<button onclick="confirmAddToCart(${pizza.id}, '${size}', ${price}, ${menuQty})" class="w-full p-4 rounded-2xl border-2 border-[#154BD1] text-[#154BD1] font-black mb-2 hover:bg-[#154BD1] hover:text-[#F3F2D4] transition uppercase bg-white">
            ${size} - Rs. ${price}
            ${servingText}
        </button>`;
    }).join('');

    modal.innerHTML = `
    <div class="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-pop text-center border-4 border-[#154BD1]">
        <h2 class="text-2xl font-black mb-1 uppercase text-[#154BD1]">${pizza.name}</h2>
        <p class="text-xs font-bold opacity-60 mb-6">Quantity: ${menuQty}</p>
        ${buttons}
        <button onclick="closeModal()" class="mt-4 w-full text-[10px] font-black opacity-30 uppercase">Close</button>
    </div>`;
    document.body.appendChild(modal);
}

window.confirmAddToCart = (id, size, price, qty = 1) => {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) item.qty += qty; else cart.push({ id, size, price, qty });
    saveState(); closeModal(); showNotification("Added to Cart!");
};

window.closeModal = () => { const m = document.getElementById('modal-overlay'); if (m) m.remove(); };

window.changeQty = (id, size, delta) => {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) { item.qty += delta; if (item.qty <= 0) return removeItem(id, size); }
    saveState(); router(false);
};

window.removeItem = (id, size) => {
    cart = cart.filter(i => !(i.id === id && i.size === size));
    saveState(); router(false);
};

window.askCancelOrder = (orderId) => {
    const modal = document.createElement('div'); 
    modal.id = 'modal-overlay';
    modal.className = "fixed inset-0 z-[1000] flex items-center justify-center bg-transparent pointer-events-auto";
    modal.innerHTML = `
    <div class="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-pop text-center border-4 border-red-500">
        <h2 class="text-2xl font-black mb-4 uppercase text-red-500">Cancel Order?</h2>
        <button onclick="processCancellation('${orderId}')" id="confirm-cancel-btn" class="w-full bg-red-500 text-white py-4 rounded-xl font-black uppercase mb-3">Yes, Cancel</button>
        <button onclick="closeModal()" class="w-full text-xs font-black opacity-30 uppercase">No</button>
    </div>`;
    document.body.appendChild(modal);
};

window.processCancellation = (orderId) => {
    const btn = document.getElementById('confirm-cancel-btn');
    btn.innerText = "CANCELLING..."; btn.disabled = true;
    setTimeout(() => {
        const order = orders.find(o => o.id === orderId);
        emailjs.send('service_g7du1xb', 'template_rf9qcz8', { order_id: order.id, customer_name: order.customer.name, total_price: order.total });
        orders = orders.filter(o => o.id !== orderId);
        saveState(); router(false); closeModal(); showNotification("Order Cancelled!");
    }, 1500);
};

function showNotification(msg) {
    const existing = document.querySelectorAll('.notification-box');
    existing.forEach(el => el.remove());

    const el = document.createElement('div');
    el.className = `notification-box fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none bg-transparent`;
    
    el.innerHTML = `
        <div class="bg-[#154BD1] text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase animate-pop pointer-events-auto">
            ${msg}
        </div>
    `;
    
    document.body.appendChild(el);
    setTimeout(() => { 
        el.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => el.remove(), 500);
    }, 2000);
}

function showOrderTimerPopup() {
    let timeLeft = 5;
    const timerEl = document.createElement('div');
    timerEl.className = "fixed inset-0 m-auto flex flex-col items-center justify-center w-fit h-fit bg-[#154BD1] text-[#F3F2D4] px-10 py-5 rounded-3xl shadow-2xl z-[100] font-black uppercase animate-pop text-center min-w-[300px]";
    const updateHTML = () => { timerEl.innerHTML = `<div>ORDER PLACED!</div> <div class="text-3xl mt-1">${timeLeft}s</div>`; };
    updateHTML(); document.body.appendChild(timerEl);
    const itv = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) { clearInterval(itv); timerEl.remove(); location.hash = "#/orders"; }
        else updateHTML();
    }, 1000);
}

function attachListeners() {
    const form = document.getElementById('order-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            if (!isStoreOpen()) { showNotification("CLOSED. <br> OPEN 5PM - 2:45AM"); return; }
            const emailValue = document.getElementById('cust-email').value;
            if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailValue)) { showNotification("Error: Must be @gmail.com"); return; }
            const btn = document.getElementById('order-btn');
            btn.innerText = "PLACING ORDER..."; btn.disabled = true;
            
            setTimeout(() => {
                // NEW UNIQUE ID LOGIC: "DASH-" + Timestamp + Random String
                const orderId = "DASH-" + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase();
                
                const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
                const total = Math.round(subtotal - (subtotal * appliedDiscount));
                const itemDetails = cart.map(i => `${i.qty}x ${PIZZAS.find(p=>p.id===i.id).name} (${i.size})`).join('\n');
                
                const promoStatusText = appliedDiscount > 0 ? "PROMO APPLIED: 10% DISCOUNT (WELCOME10%)" : "NO PROMO CODE USED";

                emailjs.send('service_g7du1xb', 'template_4xyaqxx', { 
                    order_id: orderId, 
                    customer_name: document.getElementById('cust-name').value, 
                    customer_phone: document.getElementById('cust-phone').value, 
                    customer_email: emailValue, 
                    delivery_address: document.getElementById('cust-address').value, 
                    item_details: itemDetails, 
                    total_price: total,
                    promo_status: promoStatusText 
                });

                orders.unshift({ id: orderId, items: [...cart], total: total, timestamp: Date.now(), customer: { name: document.getElementById('cust-name').value, phone: document.getElementById('cust-phone').value, email: emailValue, address: document.getElementById('cust-address').value } });
                unreadOrdersCount++; cart = []; appliedDiscount = 0; saveState(); router(true); showOrderTimerPopup();
            }, 2000);
        };
    }
}