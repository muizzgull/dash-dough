const PIZZAS = [
    { id: 1, name: "American Heat", category: "Classic", prices: { Regular: 800, Party: 1550 }, img: "american-heat.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 2, name: "Smokey Wheel", category: "Classic", prices: { Regular: 800, Party: 1550 }, img: "smoky-wheel.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 3, name: "Extreme Kababish", category: "Premium", prices: { Regular: 900, Party: 1750 }, img: "extreme-kababish.png", desc: "Pizza with Seekh Kabab and Cheese on Dough." },
    { id: 4, name: "Mughlai Pizza", category: "Premium", prices: { Regular: 900, Party: 1750 }, img: "mughlai-pizza.png", desc: "Pizza with Creamy Sauce, with Cheese." },
    { id: 5, name: "Dynamite Ranch", category: "Premium", prices: { Regular: 900, Party: 1750 }, img: "dynamite-ranch.png", desc: "Pizza with Chicken and Cheese." },
    { id: 6, name: "Double Dough American Heat", category: "Double Dough", prices: { standard: 2100 }, img: "american-heat.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 7, name: "Double Dough Smokey Wheel", category: "Double Dough", prices: { standard: 2100 }, img: "smoky-wheel.png", desc: "Pizza with Jalapenos, Fiery sauce and Cheese." },
    { id: 8, name: "Double Dough Extreme Kababish", category: "Double Dough", prices: { standard: 2100 }, img: "extreme-kababish.png", desc: "Pizza with Seekh Kabab and Cheese on Dough." },
    { id: 9, name: "Double Dough Mughlai Pizza", category: "Double Dough", prices: { standard: 2100 }, img: "mughlai-pizza.png", desc: "Pizza with Creamy Sauce, with Cheese." },
    { id: 10, name: "Double Dough Dynamite Ranch", category: "Double Dough", prices: { standard: 2100 }, img: "dynamite-ranch.png", desc: "Pizza with Chicken and Cheese." },
    { id: 11, name: "10 Pcs Buzz Bites", category: "Others", prices: { Standard: 500 }, img: "buzz-bites.png", desc: "Golden chicken, dip it in the sauce." },
    { id: 12, name: "Small Chocolate Pizza", category: "Others", prices: { Standard: 500 }, img: "chocolate-pizza.png", desc: "Mini Pizza with Chocolate over it." },
    { id: 13, name: "Baked Drummet", category: "Others", prices: { "6 Pieces": 370, "10 Pieces": 1000 }, img: "baked-drummet.png", desc: "Oven-baked chicken drummets seasoned to perfection." }
];

let cart = JSON.parse(localStorage.getItem('dash_cart')) || [];
let orders = JSON.parse(localStorage.getItem('dash_orders')) || [];
let unreadOrdersCount = parseInt(localStorage.getItem('dash_unread_orders')) || 0;
let appliedDiscount = 0; 

function saveState() {
    localStorage.setItem('dash_cart', JSON.stringify(cart));
    localStorage.setItem('dash_orders', JSON.stringify(orders));
    localStorage.setItem('dash_unread_orders', unreadOrdersCount);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) cartBadge.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    const orderBadge = document.getElementById('order-count');
    if (orderBadge) {
        if (window.location.hash === "#/orders") {
            unreadOrdersCount = 0;
            localStorage.setItem('dash_unread_orders', 0);
        }
        orderBadge.innerText = unreadOrdersCount;
        orderBadge.classList.toggle('hidden', unreadOrdersCount === 0);
    }
}

const router = () => {
    const routes = [{ path: "#/", view: HomeView }, { path: "#/cart", view: CartView }, { path: "#/orders", view: OrdersView }];
    const currentHash = location.hash || "#/";
    const match = routes.find(r => r.path === currentHash) || routes[0];
    if (currentHash === "#/orders") unreadOrdersCount = 0;
    window.scrollTo(0, 0);
    document.getElementById("app").innerHTML = `<main class="min-h-screen pb-20">${match.view()}</main>${renderFooter()}`;
    saveState();
    attachListeners();
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

function renderFooter() {
    return `<footer class="mt-20 border-t-4 border-[#154BD1] bg-white rounded-t-[3rem] pt-16 pb-8 px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-[#154BD1]">
            <div>
                <a href="#/" onclick="window.scrollTo(0,0)" class="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 block">Dash Dough</a>
            </div>
            <div>
                <h4 class="text-xs font-black uppercase mb-6 opacity-40">Links</h4>
                <ul class="flex flex-col gap-3 font-bold uppercase">
                    <li><a href="#/" onclick="window.scrollTo(0,0)">Explore Menu</a></li>
                    <li><a href="#/cart">Your Cart</a></li>
                    <li><a href="#/orders">Your Orders</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-xs font-black uppercase mb-6 opacity-40">Contact</h4>
                <p class="font-black text-lg opacity-80">0300-1234567</p>
                <p class="font-bold opacity-70">dashdough4@gmail.com</p>
            </div>
        </div>
    </footer>`;
}

function HomeView() {
    // We use object-contain so the image never crops or stretches
    // The bg-[#D89000] fills the rest of the wide banner space
    let html = `<header class="mb-10 px-0">
                    <div class="w-full mt-10 h-[180px] rounded-2xl md:h-[300px] flex items-center justify-center" style="background-color: #D89000;">
                        <img src="hero-img.jpeg" 
                             alt="Dash Dough Banner" 
                             class="max-w-full max-h-full object-contain block">
                    </div>
                </header>`;
                
    ["Classic", "Premium", "Double Dough", "Others"].forEach(cat => {
        html += `<section class="mb-20 px-2 md:px-4">
                    <h2 class="text-2xl md:text-3xl font-bold mb-10 border-b-2 border-[#154BD1] inline-block pb-2 uppercase ml-2">${cat}</h2>
                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">`;
        PIZZAS.filter(p => p.category === cat).forEach(pizza => {
            html += `<div class="pizza-card bg-white rounded-2xl overflow-hidden shadow-2xl border border-transparent hover:border-[#154BD1] transition flex flex-col">
                <div class="p-3 md:p-5">
                    <div class="bg-gray-50 rounded-2xl flex items-center justify-center">
                        <img src="${pizza.img}" class="w-full h-32 md:h-56 object-contain">
                    </div>
                </div>
                <div class="p-4 md:p-8 pt-0 md:pt-0 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="text-sm md:text-2xl font-black uppercase mb-2 h-10 md:h-16 overflow-hidden">${pizza.name}</h3>
                        <p class="text-[10px] md:text-xs font-bold opacity-80 mb-4 line-clamp-2">${pizza.desc}</p>
                    </div>
                    <div class="flex items-center justify-between gap-2 mb-4 bg-gray-100 p-2 rounded-xl">
                        <button onclick="updateMenuQty(${pizza.id}, -1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg font-black text-[#154BD1] shadow-sm">-</button>
                        <span id="menu-qty-${pizza.id}" class="font-black text-lg">1</span>
                        <button onclick="updateMenuQty(${pizza.id}, 1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg font-black text-[#154BD1] shadow-sm">+</button>
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
    let current = parseInt(el.innerText);
    current = Math.max(1, current + delta);
    el.innerText = current;
};

function CartView() {
    if (cart.length === 0) return `<div class="text-center py-20 uppercase font-black opacity-20"><h2>Cart Empty</h2></div>`;
    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discountAmount = subtotal * appliedDiscount;
    let finalTotal = subtotal - discountAmount;

    return `<div class="max-w-4xl mx-auto px-2">
        <h2 class="text-3xl font-black uppercase mb-10">Your Cart</h2>
        <div id="cart-items-container">
        ${cart.map(item => {
            const pizza = PIZZAS.find(p => p.id === item.id);
            return `<div id="item-${item.id}-${item.size.replace(/\s/g, '')}" class="flex items-center justify-between bg-white p-4 rounded-2xl mb-4 shadow-sm transition-all duration-300">
                <div class="flex items-center gap-4"><img src="${pizza.img}" class="w-16 h-16 rounded-lg object-contain bg-gray-50"><div><h4 class="text-xs md:text-xl font-black uppercase">${pizza.name} [${item.size}]</h4><p class="font-bold opacity-60">Rs. ${item.price}</p></div></div>
                <div class="flex items-center gap-4">
                    <button onclick="changeQty(${item.id}, '${item.size}', -1)" class="font-black px-2">-</button><span class="font-black">${item.qty}</span><button onclick="changeQty(${item.id}, '${item.size}', 1)" class="font-black px-2">+</button>
                    <button onclick="removeItem(${item.id}, '${item.size}')" class="text-red-500 font-bold ml-4">✕</button>
                </div>
            </div>`;
        }).join("")}
        </div>

        <div class="bg-white p-6 rounded-3xl mt-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <input type="text" id="promo-input" placeholder="Enter Promo Code" class="w-full p-4 rounded-xl border-2 border-[#154BD1]/10 font-bold uppercase text-[#154BD1]">
            <button onclick="applyPromo()" class="w-full md:w-40 bg-[#154BD1] text-white py-4 rounded-xl font-black uppercase">Apply</button>
        </div>

        <div class="bg-[#154BD1] text-[#F3F2D4] p-8 rounded-[2rem] mt-6">
            <div class="flex justify-between items-center border-b border-white/20 pb-2 mb-2">
                <span class="font-bold uppercase opacity-70">Subtotal</span>
                <span class="font-black">Rs. ${subtotal}</span>
            </div>
            ${appliedDiscount > 0 ? `
            <div class="flex justify-between items-center border-b border-white/20 pb-2 mb-2 text-green-300">
                <span class="font-bold uppercase">Discount (10%)</span>
                <span class="font-black">- Rs. ${discountAmount.toFixed(0)}</span>
            </div>` : ''}
            <h3 class="text-2xl font-black mb-2 uppercase pb-4">Total: Rs. ${finalTotal.toFixed(0)}</h3>
            <p class="text-[10px] font-black uppercase mb-6 opacity-60 tracking-widest italic">Online payment coming soon</p>
            <form id="order-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" id="cust-name" placeholder="Full Name" required class="p-4 rounded-xl text-[#154BD1] font-bold">
                <input type="text" id="cust-phone" placeholder="Phone" required class="p-4 rounded-xl text-[#154BD1] font-bold">
                <input type="email" id="cust-email" placeholder="Gmail (example@gmail.com)" required class="p-4 rounded-xl text-[#154BD1] font-bold md:col-span-2">
                <input type="text" id="cust-address" placeholder="Delivery Address" required class="p-4 rounded-xl text-[#154BD1] font-bold md:col-span-2">
                <button type="submit" id="order-btn" class="md:col-span-2 bg-[#F3F2D4] text-[#154BD1] py-5 rounded-xl font-black uppercase text-xl mt-4 transition-all">Order Now</button>
            </form>
        </div>
    </div>`;
}

window.applyPromo = () => {
    const code = document.getElementById('promo-input').value.trim().toLowerCase();
    if (code === "welcome10%") {
        appliedDiscount = 0.10;
        showNotification("10% DISCOUNT APPLIED!");
        router();
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
        const itemDetails = order.items.map(i => `${i.qty}x ${PIZZAS.find(p=>p.id===i.id).name} (${i.size})`).join('<br>');
        return `<div class="bg-white p-6 rounded-3xl mb-6 shadow-md border-l-8 border-[#154BD1]">
            <div class="flex justify-between items-start mb-4">
                <div><p class="text-[10px] opacity-40 font-black uppercase">ID: ${order.id}</p><p class="text-xl font-black">Rs. ${order.total}</p></div>
                <div class="text-right">
                    ${timeLeft > 0 ? `<p class="text-xs text-red-500 font-black uppercase mb-2 animate-pulse">${min}:${sec < 10 ? '0' : ''}${sec}</p><button onclick="askCancelOrder('${order.id}')" class="bg-red-500 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase">Cancel</button>` : `<span class="bg-green-100 text-green-600 px-4 py-2 rounded-xl font-black uppercase text-xs">Confirmed</span>`}
                </div>
            </div>
            <div class="text-xs font-bold opacity-70 bg-gray-50 p-3 rounded-xl border border-gray-100">${itemDetails}</div>
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
    const modal = document.createElement('div'); modal.id = 'modal-overlay';
    let buttons = Object.entries(pizza.prices).map(([size, price]) =>
        `<button onclick="confirmAddToCart(${pizza.id}, '${size}', ${price}, ${menuQty})" class="w-full p-4 rounded-2xl border-2 border-[#154BD1] text-[#154BD1] font-black mb-2 hover:bg-[#154BD1] hover:text-[#F3F2D4] transition uppercase">${size} - Rs. ${price}</button>`
    ).join('');
    modal.innerHTML = `<div class="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-pop text-center">
        <h2 class="text-2xl font-black mb-1 uppercase text-[#154BD1]">${pizza.name}</h2>
        <p class="text-xs font-bold opacity-60 mb-4 px-2">${pizza.desc}</p>
        <p class="mb-6 font-bold opacity-50 uppercase text-xs">Quantity: ${menuQty}</p>
        ${buttons}
        <button onclick="closeModal()" class="mt-4 w-full text-[10px] font-black opacity-30 uppercase">Close</button>
    </div>`;
    document.body.appendChild(modal);
}

window.confirmAddToCart = (id, size, price, qty = 1) => {
    if (typeof qty !== 'number') qty = parseInt(document.getElementById(`menu-qty-${id}`).innerText);
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) item.qty += qty; else cart.push({ id, size, price, qty });
    const menuQtyEl = document.getElementById(`menu-qty-${id}`);
    if (menuQtyEl) menuQtyEl.innerText = 1;
    saveState(); closeModal(); showNotification("Added to Cart!");
};

window.closeModal = () => { const m = document.getElementById('modal-overlay'); if (m) m.remove(); };

window.changeQty = (id, size, delta) => {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) { item.qty += delta; if (item.qty <= 0) return removeItem(id, size); }
    saveState(); router();
};

window.removeItem = (id, size) => {
    const pizza = PIZZAS.find(p => p.id === id);
    const elementId = `item-${id}-${size.replace(/\s/g, '')}`;
    const element = document.getElementById(elementId);
    if (element) {
        element.style.transform = "translateX(100px)"; element.style.opacity = "0";
        setTimeout(() => {
            cart = cart.filter(i => !(i.id === id && i.size === size));
            saveState(); router(); showNotification(`REMOVED: ${pizza.name}`);
        }, 300);
    } else { cart = cart.filter(i => !(i.id === id && i.size === size)); saveState(); router(); }
};

window.askCancelOrder = (orderId) => {
    const modal = document.createElement('div'); modal.id = 'modal-overlay';
    modal.innerHTML = `<div class="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-pop text-center">
        <h2 class="text-2xl font-black mb-4 uppercase text-red-500">Cancel Order?</h2>
        <p class="font-bold opacity-60 mb-6">Are you sure you want to cancel this order? This cannot be undone.</p>
        <button onclick="processCancellation('${orderId}')" id="confirm-cancel-btn" class="w-full bg-red-500 text-white py-4 rounded-xl font-black uppercase mb-3">Yes, Cancel</button>
        <button onclick="closeModal()" class="w-full text-xs font-black opacity-30 uppercase">No, Go Back</button>
    </div>`;
    document.body.appendChild(modal);
};

window.processCancellation = (orderId) => {
    const btn = document.getElementById('confirm-cancel-btn');
    btn.innerText = "CANCELLING...";
    btn.disabled = true;
    
    setTimeout(() => {
        const order = orders.find(o => o.id === orderId);
        const cancelParams = { order_id: order.id, customer_name: order.customer.name, customer_phone: order.customer.phone, total_price: order.total };
        emailjs.send('service_xzcd8eq', 'template_sla381a', cancelParams);
        
        orders = orders.filter(o => o.id !== orderId);
        saveState(); router(); closeModal(); showNotification("Order Cancelled!");
    }, 1500);
};

function showNotification(msg) {
    const container = document.getElementById('notification-area');
    if (!container) return;
    const el = document.createElement('div'); el.className = `notification-box animate-pop`;
    el.innerText = msg.toUpperCase(); container.appendChild(el);
    setTimeout(() => { el.remove(); }, 2000);
}

function showOrderTimerPopup() {
    let timeLeft = 5;
    const timerEl = document.createElement('div');
    timerEl.className = "fixed inset-0 m-auto flex flex-col items-center justify-center w-fit h-fit bg-[#154BD1] text-[#F3F2D4] px-10 py-5 rounded-3xl shadow-2xl z-[100] font-black uppercase cursor-pointer animate-pop text-center min-w-[300px]";
    
    const updateHTML = () => {
        timerEl.innerHTML = `<div>ORDER PLACED! VIEW STATUS</div> <div class="text-3xl mt-1">${timeLeft}s</div>`;
    };
    
    updateHTML();
    timerEl.onclick = () => { clearInterval(itv); timerEl.remove(); location.hash = "#/orders"; };
    document.body.appendChild(timerEl);
    
    const itv = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) { clearInterval(itv); timerEl.remove(); }
        else updateHTML();
    }, 1000);
}

function attachListeners() {
    const form = document.getElementById('order-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const emailValue = document.getElementById('cust-email').value;
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            
            if (!gmailRegex.test(emailValue)) { showNotification("Error: Must be @gmail.com"); return; }

            const btn = document.getElementById('order-btn');
            btn.innerText = "PLACING ORDER...";
            btn.disabled = true;

            setTimeout(() => {
                const orderId = "DASH-" + Date.now().toString().slice(-4);
                const name = document.getElementById('cust-name').value;
                const phone = document.getElementById('cust-phone').value;
                const address = document.getElementById('cust-address').value;
                
                const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
                const total = Math.round(subtotal - (subtotal * appliedDiscount));

                const itemDetails = cart.map(i => `${i.qty}x ${PIZZAS.find(p=>p.id===i.id).name} (${i.size}) - Rs. ${i.price * i.qty}`).join('\n');

                const templateParams = { 
                    order_id: orderId, 
                    customer_name: name, 
                    customer_phone: phone, 
                    customer_email: emailValue, 
                    delivery_address: address, 
                    item_details: itemDetails + (appliedDiscount > 0 ? `\n(Applied welcome10% Promo)` : ''), 
                    total_price: total 
                };
                
                emailjs.send('service_xzcd8eq', 'template_cl3np7j', templateParams);

                orders.unshift({ id: orderId, items: [...cart], total: total, timestamp: Date.now(), customer: { name, phone, email: emailValue, address } });
                unreadOrdersCount++;
                cart = []; 
                appliedDiscount = 0; 
                saveState(); 
                router(); 
                showOrderTimerPopup();
            }, 2000);
        };
    }
}
setInterval(() => { if (location.hash === '#/orders') router(); }, 1000);