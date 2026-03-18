const PIZZAS = [
    { id: 1, name: "American Heat", category: "Classic", prices: { Regular: 800, Party: 1550 }, img: "american-heat.png", desc: "Pizza with Jalapenos, Sauce and Cheese." },
    { id: 2, name: "Smokey Wheel", category: "Classic", prices: { Regular: 800, Party: 1550 }, img: "smoky-wheel.png", desc: "Pizza with Olives and Cheese." },
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
    { id: 13, name: "Baked Drummet", category: "Others", prices: { "6 Pieces": 370, "15 Pieces": 1000 }, img: "baked-drummet.png", desc: "Oven-baked chicken drummets." },
    { id: 14, name: "Cola Next", category: "Drinks", prices: { "NR": 80, "1 Litre": 170, "1.5 Litre": 220 }, img: "cold-drink-red.png", desc: "" },
    { id: 15, name: "Smokey Sauce", category: "Sauces", prices: { Standard: 80 }, img: "smokey-sauce.PNG", desc: "" },
    { id: 16, name: "Dynamite Sauce", category: "Sauces", prices: { Standard: 80 }, img: "dynamite-sauce.PNG", desc: "" },
    { id: 17, name: "Masala Fries", category: "Fries", prices: { Standard: 250 }, img: "plain-fries.png", desc: "This image is not of our restaurant." },
    { id: 18, name: "Plain Fries", category: "Fries", prices: { Standard: 200 }, img: "plain-fries.png", desc: "This image is not of our restaurant." }
];

let cart = JSON.parse(localStorage.getItem('dash_cart')) || [];
let orders = JSON.parse(localStorage.getItem('dash_orders')) || [];
let unreadOrdersCount = parseInt(localStorage.getItem('dash_unread_orders')) || 0;
let appliedDiscount = 0; 

function saveState() {
    if (cart.length === 0) appliedDiscount = 0;
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
    if (!barContainer || window.location.hash === "#/cart") { 
        if(barContainer) barContainer.innerHTML = ""; 
        return; 
    }

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    if (totalQty === 0) { barContainer.innerHTML = ""; return; }

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



const router = async (withAnimation = true) => {
    const wave = document.getElementById('wave-transition');
    const routes = [
        { path: "#/", view: HomeView }, 
        { path: "#/cart", view: CartView }, 
        { path: "#/orders", view: OrdersView },
        { path: "#/add-review", view: AddReviewView },
        { path: "#/reviews", view: allReviewsView },
        // { path: "#/login", view: LoginView },
        // { path: "#/signup", view: SignupView }
    ];
    
    const match = routes.find(r => r.path === (location.hash || "#/")) || routes[0];

    // THE FIX: We make render async so it can wait for async views
    const render = async () => {
        window.scrollTo(0, 0);
        
        // 1. Show a loader if the view takes time to fetch
        const app = document.getElementById("app");
        
        // 2. Execute the view function (it might return a string OR a Promise)
        let viewContent = match.view();
        
        // 3. If it's a Promise (async function), wait for it to finish
        if (viewContent instanceof Promise) {
            // Optional: show a quick spinner while waiting
            app.innerHTML = `<div class="flex items-center justify-center min-h-screen"><div class="animate-spin h-8 w-8 border-4 border-[#154BD1] border-t-transparent rounded-full"></div></div>`;
            viewContent = await viewContent;
        }

        // 4. Finally set the HTML
        app.innerHTML = `<main class="min-h-screen pb-32">${viewContent}</main>${renderFooter()}`;
        
        saveState();
        attachListeners();
        
        if (location.hash === "#/orders" && sessionStorage.getItem('order_success_flag')) {
            sessionStorage.removeItem('order_success_flag');
            showOrderSuccessModal();
        }
    };

    if (withAnimation && wave) {
        wave.classList.remove('wave-active');
        void wave.offsetWidth; 
        wave.classList.add('wave-active');
        // We use 'await' here because render is now async
        setTimeout(async () => await render(), 500); 
    } else {
        await render();
    }
};

window.addEventListener("hashchange", () => router(true));
window.addEventListener("load", () => router(true));

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
    let html = `
    <header class="mb-10 px-0">
        <div class="w-full mt-10 h-[180px] rounded-2xl md:h-[300px] flex items-center justify-center bg-[#D89000]">
            <img src="hero-img.jpeg" alt="Banner" class="max-w-full max-h-full object-contain">
        </div>
    </header>`;
    
    ["Classic", "Premium", "Double Dough", "Fries", "Others", "Sauces", "Drinks"].forEach(cat => {
        html += `<section class="mb-20 px-2 md:px-4"><h2 class="text-2xl md:text-3xl font-bold mb-10 border-b-2 border-[#154BD1] inline-block pb-2 uppercase ml-2">${cat}</h2><div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">`;
        PIZZAS.filter(p => p.category === cat).forEach(pizza => {
            const minPrice = Math.min(...Object.values(pizza.prices));
            const hasMultipleSizes = Object.keys(pizza.prices).length > 1;
            const imgRadiusClass = pizza.category === "Fries" ? "rounded-[6px]" : "rounded-2xl";

            html += `<div class="pizza-card bg-yellow-400 rounded-2xl overflow-hidden shadow-2xl border-2 border-white hover:border-[#154BD1] transition flex flex-col">
                <div class="p-3 md:p-5">
                    <div class="${imgRadiusClass} flex items-center justify-center bg-yellow-400 img-container overflow-hidden">
                        <img src="${pizza.img}" class="w-full h-32 md:h-56 object-contain png-fix" loading="lazy">
                    </div>
                </div>
                <div class="p-4 md:p-8 pt-0 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="text-sm md:text-2xl font-black uppercase">${pizza.name}</h3>
                        <p class="text-[10px] md:text-[12px] font-black bg-white px-3 py-3 rounded-md w-fit mt-1 uppercase">
                            ${hasMultipleSizes ? 'FROM ' : ''}RS. ${minPrice}
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

    // ADDED THE FAQ SECTION HERE
    html += renderFAQ();

    return html;
}


function renderFAQ() {
    const faqs = [
        { q: "Which flavors are spicy?", a: "Our **American Heat** & **Dynamite Ranch** are both spicy." },
        { q: "Which Pizza has mild flavor?", a: "The **Mughlai Pizza** has a mild flavor." },
        { q: "What is your most selling Pizza?", a: "The **Dynamite Ranch** is our most selling selling pizza." },
        { q: "Pizza Sizes & Servings?", a: "• **Regular:** 10x8 inches (6 slices) - Servings **2 persons**.<br>• **Party:** 10x15 inches (8 slices) - Servings **3-4 persons**.<br>• **Double Dough:** 10x15 inches - Servings **4-5 persons**." },
        { q: "Delivery Time & Charges?", a: "Standard delivery takes about **35 to 45 minutes**. Charges depend on distance, with a minimum charge of **Rs. 80**." }
    ];

    let faqHtml = `
    <section class="max-w-4xl mx-auto px-4 mt-20 mb-10">
        <h2 class="text-3xl font-black uppercase text-[#154BD1] mb-8 text-center underline decoration-yellow-400">Questions</h2>
        <div class="space-y-4">`;

    faqs.forEach((item, index) => {
        faqHtml += `
        <div class="border-2 border-[#154BD1] rounded-2xl overflow-hidden bg-white shadow-sm">
            <button onclick="toggleFaq(${index})" class="w-full p-5 text-left flex justify-between items-center bg-white hover:bg-[#F3F2D4]/30 transition-colors">
                <span class="font-black uppercase text-[#154BD1] text-sm md:text-base">${item.q}</span>
                <span id="faq-icon-${index}" class="text-[#154BD1] font-black transition-transform duration-300">+</span>
            </button>
            <div id="faq-ans-${index}" class="hidden p-5 pt-0 text-sm md:text-base font-bold text-gray-600 border-t border-[#154BD1]/10">
                ${item.a}
            </div>
        </div>`;
    });

    faqHtml += `</div></section>`;
    return faqHtml;
}

// Global function to handle clicking
window.toggleFaq = (index) => {
    const ans = document.getElementById(`faq-ans-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    
    if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        icon.style.transform = "rotate(45deg)";
        icon.innerText = "×";
    } else {
        ans.classList.add('hidden');
        icon.style.transform = "rotate(0deg)";
        icon.innerText = "+";
    }
};

window.toggleSaveDetails = () => {
    const dot = document.getElementById('save-check-dot');
    const isCurrentlyEnabled = !dot.classList.contains('hidden');
    
    if (isCurrentlyEnabled) {
        dot.classList.add('hidden');
        localStorage.setItem('dash_save_enabled', 'false');
    } else {
        dot.classList.remove('hidden');
        localStorage.setItem('dash_save_enabled', 'true');
        
        // If they have already typed something, save it now
        const name = document.getElementById('cust-name').value;
        if(name) {
            saveCustomerInfo();
        }
    }
};

function saveCustomerInfo() {
    const dot = document.getElementById('save-check-dot');
    
    // Check if the dot exists and is NOT hidden
    if (dot && !dot.classList.contains('hidden')) {
        const info = {
            name: document.getElementById('cust-name').value,
            phone: document.getElementById('cust-phone').value,
            email: document.getElementById('cust-email').value,
            address: document.getElementById('cust-address').value
        };
        localStorage.setItem('dash_customer_info', JSON.stringify(info));
        console.log("Details updated in storage!");
    }
}

// ... Existing functions: updateMenuQty, updateInstruction, CartView, applyPromo, OrdersView, renderOrdersList, addToCart, openSizeModal, confirmAddToCart, closeModal, changeQty, removeItem, showNotification, showOrderSuccessModal, attachListeners, processOrder ...
// Note: Keeping all logic exactly as you provided.

window.updateMenuQty = (id, delta) => {
    const el = document.getElementById(`menu-qty-${id}`);
    if(el) el.innerText = Math.max(1, parseInt(el.innerText) + delta);
};

window.updateInstruction = (id, size, text) => {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) {
        item.instruction = text;
        localStorage.setItem('dash_cart', JSON.stringify(cart));
    }
};

function CartView() {
    if (cart.length === 0) return `<div class="text-center py-20 uppercase font-black opacity-20"><h2>Cart Empty</h2></div>`;
    
    // 1. Pull saved info from localStorage for auto-filling
    const savedInfo = JSON.parse(localStorage.getItem('dash_customer_info')) || {};
    const hasSavedDetails = Object.keys(savedInfo).length > 0;
    
    // The toggle always starts as 'false' (empty) on page load/refresh
    const isSaveEnabled = false; 

    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discountAmount = subtotal * appliedDiscount;
    let finalTotal = subtotal - discountAmount;

    return `<div class="max-w-4xl mt-6 mx-auto px-2">
        <h2 class="text-3xl font-black uppercase mb-10 ml-2">Your Cart</h2>
        
        <div id="cart-items-container">
            ${cart.map(item => {
                const pizza = PIZZAS.find(p => p.id === item.id);
                return `<div class="bg-white p-4 rounded-2xl mb-4 shadow-sm flex flex-col border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <img src="${pizza.img}" class="w-16 h-16 object-contain png-fix">
                            <div>
                                <h4 class="text-xs md:text-xl font-black uppercase">${pizza.name} [${item.size}]</h4>
                                <p class="font-bold opacity-60 text-sm">Rs. ${item.price}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="flex items-center bg-gray-50 rounded-lg px-2">
                                <button onclick="changeQty(${item.id}, '${item.size}', -1)" class="font-black px-3 py-1 text-[#154BD1]">-</button>
                                <span class="font-black w-6 text-center text-sm">${item.qty}</span>
                                <button onclick="changeQty(${item.id}, '${item.size}', 1)" class="font-black px-3 py-1 text-[#154BD1]">+</button>
                            </div>
                            <button onclick="removeItem(${item.id}, '${item.size}')" class="text-red-500 font-bold ml-2">✕</button>
                        </div>
                    </div>
                    <input type="text" placeholder="Special instructions (e.g., no onions)..." 
                        oninput="updateInstruction(${item.id}, '${item.size}', this.value)" 
                        value="${item.instruction || ''}" 
                        class="mt-3 w-full p-2 text-[10px] border-b border-gray-100 focus:outline-none focus:border-[#154BD1] font-bold uppercase opacity-70">
                </div>`;
            }).join("")}
        </div>

        <div class="bg-white p-6 rounded-3xl mt-6 shadow-sm flex flex-col md:flex-row gap-4 items-center border border-gray-100">
            <input type="text" id="promo-input" placeholder="Promo Code" class="w-full p-4 rounded-xl border-2 border-[#154BD1]/10 font-bold uppercase focus:border-[#154BD1] outline-none">
            <button onclick="applyPromo()" class="w-full md:w-40 bg-[#154BD1] text-white py-4 rounded-xl font-black uppercase transition active:scale-95">Apply</button>
        </div>

        <div class="bg-[#154BD1] text-[#F3F2D4] p-8 rounded-[2rem] mt-6 shadow-2xl">
            
            <div class="mb-8 space-y-3 border-b border-white/10 pb-6">
                <div class="flex justify-between items-center opacity-70">
                    <span class="font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                    <span class="font-black">Rs. ${subtotal}</span>
                </div>
                
                ${appliedDiscount > 0 ? `
                <div class="flex justify-between items-center text-yellow-400">
                    <span class="font-bold uppercase text-[10px] tracking-widest">Promo Discount (10%)</span>
                    <span class="font-black">- Rs. ${discountAmount.toFixed(0)}</span>
                </div>` : ''}

                <div class="flex justify-between items-center pt-2">
                    <span class="font-black uppercase text-xl tracking-tighter">Total To Pay</span>
                    <span class="font-black text-3xl">Rs. ${finalTotal.toFixed(0)}</span>
                </div>
            </div>

            ${hasSavedDetails ? `
            <div class="bg-white/10 border border-white/10 rounded-2xl p-4 mb-8 flex items-center gap-3">
                <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span class="text-[10px] font-black uppercase tracking-wider leading-relaxed">
                    Welcome back! Your Details are Saved.
                </span>
            </div>` : ''}

            <form id="order-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" id="cust-name" placeholder="Full Name" required 
                    value="${savedInfo.name || ''}" class="p-4 rounded-xl text-[#154BD1] font-bold outline-none border-2 border-transparent focus:border-yellow-400">
                
                <input type="text" id="cust-phone" placeholder="Phone Number" required 
                    value="${savedInfo.phone || ''}" class="p-4 rounded-xl text-[#154BD1] font-bold outline-none border-2 border-transparent focus:border-yellow-400">
                
                <input type="email" id="cust-email" placeholder="Email Address" required 
                    value="${savedInfo.email || ''}" class="p-4 rounded-xl text-[#154BD1] font-bold md:col-span-2 outline-none border-2 border-transparent focus:border-yellow-400">
                
                <input type="text" id="cust-address" placeholder="Delivery Address" required 
                    value="${savedInfo.address || ''}" class="p-4 rounded-xl text-[#154BD1] font-bold md:col-span-2 outline-none border-2 border-transparent focus:border-yellow-400">
                
                <div class="md:col-span-2 mt-2">
                    <div class="inline-flex items-center gap-3 cursor-pointer group w-fit" onclick="toggleSaveDetails()">
                        <div id="save-check-circle" class="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all group-hover:bg-white/10 group-active:scale-90">
                            <div id="save-check-dot" class="w-3 h-3 bg-white rounded-full hidden"></div>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-widest opacity-80 select-none">
                            ${hasSavedDetails ? 'Update my saved details' : 'Save my details for next time'}
                        </span>
                    </div>
                </div>

                <button type="submit" id="order-btn" class="md:col-span-2 bg-[#F3F2D4] text-[#154BD1] py-5 rounded-xl font-black uppercase text-xl mt-6 shadow-lg transition transform hover:-translate-y-1 active:translate-y-0">
                    Order Now
                </button>
            </form>
        </div>
    </div>`;
}

window.applyPromo = () => {
    const code = document.getElementById('promo-input').value.trim().toLowerCase();
    if (code === "welcome10%") {
        if (appliedDiscount > 0) showNotification("PROMO ALREADY APPLIED");
        else { appliedDiscount = 0.10; showNotification("10% DISCOUNT APPLIED!"); router(false); }
    } else showNotification("INVALID PROMO CODE");
};

function OrdersView() {
    if (orders.length === 0) return `<div class="text-center py-20 uppercase font-black opacity-20"><h2>No History</h2></div>`;
    return `<div class="max-w-3xl mt-6 mx-auto px-4"><h2 class="text-3xl font-black mb-10 uppercase">Order History</h2>${renderOrdersList()}</div>`;
}

function renderOrdersList() {
    return orders.map(order => {
        const orderItemsHtml = order.items.map(item => {
            const pizza = PIZZAS.find(p => p.id === item.id);
            return `<div class="text-[11px] font-bold opacity-80 uppercase">${item.qty}x ${pizza ? pizza.name : 'Pizza'} (${item.size})</div>`;
        }).join("");
        return `<div class="bg-white p-6 rounded-3xl mb-6 shadow-md border-l-8 border-[#154BD1]">
            <p class="text-[10px] font-black text-[#154BD1] uppercase mb-1">${order.date} | ${order.time}</p>
            <div class="my-2 border-y border-gray-100 py-2">${orderItemsHtml}</div>
            <p class="text-xl font-black">Rs. ${order.total}</p>
        </div>`;
    }).join("");
}

window.addToCart = (id) => {
    const pizza = PIZZAS.find(p => p.id === id);
    if (Object.keys(pizza.prices).length > 1) openSizeModal(pizza);
    else confirmAddToCart(pizza.id, Object.keys(pizza.prices)[0], Object.values(pizza.prices)[0], parseInt(document.getElementById(`menu-qty-${id}`).innerText));
};

function openSizeModal(pizza) {
    const menuQty = parseInt(document.getElementById(`menu-qty-${pizza.id}`).innerText);
    const modal = document.createElement('div'); 
    modal.id = 'modal-overlay';
    modal.className = "fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 pointer-events-auto backdrop-blur-sm px-4";
    
    let buttons = Object.entries(pizza.prices).map(([size, price]) => {
        // Determine serving text based on size name
        let servingText = "";
        if (size.toLowerCase() === "regular") servingText = "1-2 PERSONS SERVING";
        else if (size.toLowerCase() === "party") servingText = "3-4 PERSONS SERVING";
        else if (pizza.category === "Double Dough") servingText = "4-5 PERSONS SERVING";

        return `
        <button onclick="confirmAddToCart(${pizza.id}, '${size}', ${price}, ${menuQty})" 
            class="w-full p-4 rounded-2xl border-2 border-[#154BD1] text-[#154BD1] font-black mb-3 hover:bg-[#154BD1] hover:text-[#F3F2D4] transition uppercase bg-white flex flex-col items-center justify-center">
            <span class="text-lg">${size} - RS. ${price}</span>
            ${servingText ? `<span class="text-[9px] opacity-60 mt-1">${servingText}</span>` : ''}
        </button>`;
    }).join('');

    modal.innerHTML = `
    <div class="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-pop text-center border-4 border-[#154BD1]">
        <h2 class="text-2xl font-black mb-6 uppercase text-[#154BD1]">${pizza.name}</h2>
        ${buttons}
        <button onclick="closeModal()" class="mt-2 w-full text-[10px] font-black opacity-30 uppercase tracking-widest">Close</button>
    </div>`;
    
    document.body.appendChild(modal);
}

window.confirmAddToCart = (id, size, price, qty = 1) => {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) item.qty += qty; else cart.push({ id, size, price, qty, instruction: "" });
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

function showNotification(msg) {
    const el = document.createElement('div');
    el.className = `notification-box fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none bg-transparent`;
    el.innerHTML = `<div class="bg-[#154BD1] text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase animate-pop pointer-events-auto">${msg}</div>`;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('opacity-0', 'transition-opacity', 'duration-500'); setTimeout(() => el.remove(), 500); }, 2000);
}

function showOrderSuccessModal() {
    const modal = document.createElement('div');
    modal.id = 'modal-overlay';
    modal.className = "fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 pointer-events-auto backdrop-blur-sm";
    modal.innerHTML = `<div class="bg-white p-10 rounded-[3rem] w-full max-w-sm shadow-2xl animate-pop text-center border-4 border-[#154BD1]">
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 class="text-3xl font-black mb-2 uppercase text-[#154BD1]">Order Placed!</h2>
        <button onclick="closeModal()" class="w-full bg-[#154BD1] text-white py-4 rounded-2xl font-black uppercase text-lg shadow-lg">Great!</button>
    </div>`;
    document.body.appendChild(modal);
}

function attachListeners() {
    const form = document.getElementById('order-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.id = 'modal-overlay';
            modal.className = "fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 pointer-events-auto backdrop-blur-sm";
            modal.innerHTML = `<div class="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-pop text-center border-4 border-[#154BD1]">
                <h2 class="text-2xl font-black mb-4 uppercase text-[#154BD1]">Ready?</h2>
                <button id="confirm-final-order" class="w-full bg-[#154BD1] text-white py-4 rounded-xl font-black uppercase mb-3 text-lg">Yes, Place Order</button>
                <button onclick="closeModal()" class="w-full py-2 text-xs font-black opacity-30 uppercase tracking-widest">No, Wait</button>
            </div>`;
            document.body.appendChild(modal);
            document.getElementById('confirm-final-order').onclick = () => { closeModal(); processOrder(); };
        };
    }
}

async function processOrder() {
    if (!isStoreOpen()) { showNotification("CLOSED. <br> OPEN 5PM - 2:45AM"); return; }
    
    // SAVE OR UPDATE CUSTOMER INFO BEFORE PROCESSING
    saveCustomerInfo();

    const btn = document.getElementById('order-btn');
    btn.innerText = "SENDING ORDER..."; btn.disabled = true;
    const orderId = "DASH-" + Date.now().toString().slice(-6);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const total = Math.round(cart.reduce((acc, i) => acc + (i.price * i.qty), 0) * (1 - appliedDiscount));
    const itemDetails = cart.map(i => `${i.qty}x ${PIZZAS.find(p=>p.id===i.id).name} (${i.size})`).join('\n');

    try {
        await emailjs.send('service_g7du1xb', 'template_4xyaqxx', { 
            order_id: orderId, 
            customer_name: document.getElementById('cust-name').value, 
            customer_phone: document.getElementById('cust-phone').value, 
            customer_email: document.getElementById('cust-email').value, 
            delivery_address: document.getElementById('cust-address').value, 
            item_details: itemDetails, 
            total_price: total, 
            order_time: `${dateStr} ${timeStr}` 
        });
        orders.unshift({ id: orderId, items: [...cart], total, timestamp: Date.now(), date: dateStr, time: timeStr });
        unreadOrdersCount++; cart = []; appliedDiscount = 0; saveState();
        sessionStorage.setItem('order_success_flag', 'true');
        location.hash = "#/orders"; 
    } catch (error) {
        showNotification("ORDER FAILED."); btn.innerText = "ORDER NOW"; btn.disabled = false;
    }
}

// --- NEW AUTH VIEWS ---

// const login = async (event) => {
//     event.preventDefault();

//     const email = document.getElementById('email').value.toLowerCase();
//     const password = document.getElementById('password').value;

//     const res = await fetch('https://dash-dough-backend.vercel.app/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include'

//     })

//     const data = await res.json()

//     if (!data.success) {
//         alert(data.message || "Login failed. Please try again.");
//         return false;
//     }

//     alert("Login successful!");

// }

// function LoginView() {

    

//     return `
//     <div class="max-w-md mx-auto mt-10 px-4">
//         <div class="bg-white p-8 rounded-[2.5rem] border-4 border-[#154BD1] shadow-2xl">
//             <h2 class="text-3xl font-black uppercase text-[#154BD1] mb-2 text-center">Welcome Back</h2>
//             <p class="text-[10px] font-black opacity-40 mb-8 uppercase text-center tracking-widest">Login to your account</p>
            
//             <form onsubmit="login(event)" class="space-y-4">
//                 <div>
//                     <label class="block text-[10px] font-black uppercase mb-1 ml-2 opacity-60">Email Address</label>
//                     <input type="email" placeholder="dash@dough.com" required class="w-full p-4 rounded-2xl bg-[#F3F2D4]/30 border-2 border-[#154BD1]/10 focus:border-[#154BD1] outline-none font-bold text-[#154BD1]" id="email">
//                 </div>
//                 <div>
//                     <label class="block text-[10px] font-black uppercase mb-1 ml-2 opacity-60">Password</label>
//                     <input type="password" placeholder="••••••••" required class="w-full p-4 rounded-2xl bg-[#F3F2D4]/30 border-2 border-[#154BD1]/10 focus:border-[#154BD1] outline-none font-bold text-[#154BD1]" id="password">
//                 </div>
//                 <button type="submit" class="w-full bg-[#154BD1] text-white py-4 rounded-2xl font-black uppercase text-lg shadow-lg hover:scale-[1.02] transition-transform">Sign In</button>
//             </form>
            
//             <div class="mt-8 text-center border-t border-gray-100 pt-6">
//                 <p class="text-[10px] font-black opacity-40 uppercase mb-2">Don't have an account?</p>
//                 <a href="#/signup" class="text-sm font-black uppercase text-[#154BD1] hover:underline">Create Account</a>
//             </div>
//         </div>
//     </div>`;
// }

// const signup = async (event) => {
//     event.preventDefault();

//     const name = document.getElementById('fullname').value;
//     const phone = document.getElementById('phone').value;
//     const email = document.getElementById('email').value.toLowerCase();
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirm-password').value;

//     if(password !== confirmPassword) {
//         alert("Passwords do not match.");
//         return false;
//     }

//     const res = await fetch('https://dash-dough-backend.vercel.app/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, phone, email, password, confirmPassword }),
//         credentials: 'include'

//     })

//     const data = await res.json()

//     if (!data.success) {
//         alert(data.message || "Signup failed. Please try again.");
//         return false;
//     }

//     alert("Signup successful! Please log in.");



// }

// function SignupView() {

    
//     return `
//     <div class="max-w-md mx-auto mt-10 px-4">
//         <div class="bg-white p-8 rounded-[2.5rem] border-4 border-[#154BD1] shadow-2xl">
//             <h2 class="text-3xl font-black uppercase text-[#154BD1] mb-2 text-center">Join the Club</h2>
//             <p class="text-[10px] font-black opacity-40 mb-8 uppercase text-center tracking-widest">Create a new account</p>
            
//             <form onsubmit="signup(event)" class="space-y-4">
//                 <div>
//                     <label class="block text-[10px] font-black uppercase mb-1 ml-2 opacity-60">Full Name</label>
//                     <input type="text" placeholder="John Doe" required class="w-full p-4 rounded-2xl bg-[#F3F2D4]/30 border-2 border-[#154BD1]/10 focus:border-[#154BD1] outline-none font-bold text-[#154BD1]" id="fullname">
//                 </div>
//                 <div>
//                     <label class="block text-[10px] font-black uppercase mb-1 ml-2 opacity-60">Phone</label>
//                     <input type="tel" placeholder="03XXXXXXXXX" required class="w-full p-4 rounded-2xl bg-[#F3F2D4]/30 border-2 border-[#154BD1]/10 focus:border-[#154BD1] outline-none font-bold text-[#154BD1]" id="phone">
//                 </div>
//                 <div>
//                     <label class="block text-[10px] font-black uppercase mb-1 ml-2 opacity-60">Email</label>
//                     <input type="email" placeholder="dash@dough.com" required class="w-full p-4 rounded-2xl bg-[#F3F2D4]/30 border-2 border-[#154BD1]/10 focus:border-[#154BD1] outline-none font-bold text-[#154BD1]" id="email">
//                 </div>
//                 <div>
//                     <label class="block text-[10px] font-black uppercase mb-1 ml-2 opacity-60">Password</label>
//                     <input type="password" placeholder="••••••••" required class="w-full p-4 rounded-2xl bg-[#F3F2D4]/30 border-2 border-[#154BD1]/10 focus:border-[#154BD1] outline-none font-bold text-[#154BD1]" id="password">
//                 </div>
//                 <div>
//                     <label class="block text-[10px] font-black uppercase mb-1 ml-2 opacity-60">Confirm Password</label>
//                     <input type="password" placeholder="••••••••" required class="w-full p-4 rounded-2xl bg-[#F3F2D4]/30 border-2 border-[#154BD1]/10 focus:border-[#154BD1] outline-none font-bold text-[#154BD1]" id="confirm-password">
//                 </div>
//                 <button type="submit" class="w-full bg-[#154BD1] text-white py-4 rounded-2xl font-black uppercase text-lg shadow-lg hover:scale-[1.02] transition-transform" >Register</button>
//             </form>
            
//             <div class="mt-8 text-center border-t border-gray-100 pt-6">
//                 <p class="text-[10px] font-black opacity-40 uppercase mb-2">Already a member?</p>
//                 <a href="#/login" class="text-sm font-black uppercase text-[#154BD1] hover:underline">Log In Instead</a>
//             </div>
//         </div>
//     </div>`;
// }


function setRating(starCount) {
    

    if(starCount > 5) return;
    

    if(starCount === 5) {
        document.querySelectorAll('#star-rating .star-btn').forEach(btn => btn.classList.add('text-yellow-400'));
    } else {
        for(let i = 1; i <= starCount; i++) {
            document.getElementById(`star-${i}`).classList.add('text-yellow-400');
            
            for(let j = starCount + 1; j <= 5; j++) {
                document.getElementById(`star-${j}`).classList.remove('text-yellow-400');
            }   
        }
    }
}

async function submitReview(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const starBtns = document.querySelectorAll('#star-rating .star-btn');
    const rating = Array.from(starBtns).filter(btn => btn.classList.contains('text-yellow-400')).length;

    const reviewText = document.getElementById('review-text').value;

    const res = await fetch('https://dash-dough-backend.vercel.app/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName:name, email, rating, review: reviewText }),
        credentials: 'include'
    })

    const data = await res.json();

    if (!data.success) {
        alert(data.message || "Failed to submit review. Please try again.");
        console.log(data);
        return false;
    }

    else{
        alert("Thank you for your feedback!");
        document.getElementById('review-form').reset();
        setRating(1);
    }
    
}


function AddReviewView() {
    return `<div class="max-w-4xl mx-auto p-4 md:p-8 font-sans">
    <div class="mb-8">
        <h2 class="text-4xl font-black uppercase text-[#154BD1]">Rate Your Experience</h2>
        <p class="font-bold opacity-60">YOUR REVIEW WILL GET SHOWN TO OTHER PEOPLE.</p>
    </div>

    <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <form id="review-form" onsubmit="submitReview(event)">
            
            <div class="mb-8">
                <label class="block text-xs font-black uppercase mb-2 opacity-50">Your Name</label>
                <input type="text" required id="name" class="w-full p-4 rounded-xl border-2 border-[#154BD1]/10 font-bold uppercase focus:outline-none focus:border-[#154BD1]">
                    
            </div>

             <div class="mb-8">
                <label class="block text-xs font-black uppercase mb-2 opacity-50">Email (optional)</label>
                <input type="text" id="email" class="w-full p-4 rounded-xl border-2 border-[#154BD1]/10 font-bold uppercase focus:outline-none focus:border-[#154BD1]">
                    
            </div>

            <div class="mb-8">
                <label class="block text-xs font-black uppercase mb-2 opacity-50">The Rating</label>
                <div class="flex gap-2" id="star-rating">
                    <button type="button" id="star-1" value="1" onclick="setRating(1)" class="star-btn text-3xl text-gray-200 text-yellow-400">★</button>
                    <button type="button" id="star-2" value="2" onclick="setRating(2)" class="star-btn text-3xl text-gray-200">★</button>
                    <button type="button" id="star-3" value="3" onclick="setRating(3)" class="star-btn text-3xl text-gray-200">★</button>
                    <button type="button" id="star-4" value="4" onclick="setRating(4)" class="star-btn text-3xl text-gray-200">★</button>
                    <button type="button" id="star-5" value="5" onclick="setRating(5)" class="star-btn text-3xl text-gray-200">★</button>
                </div>
                <input type="hidden" id="rating-value" value="0" required>
            </div>

            <div class="mb-8">
                <label class="block text-xs font-black uppercase mb-2 opacity-50">Your Thoughts</label>
                <textarea id="review-text" rows="4" placeholder="HOW WAS THE CHEESE? THE FLAVOR? THE VIBE?" 
                    class="w-full p-4 rounded-xl border-2 border-[#154BD1]/10 font-bold uppercase focus:outline-none focus:border-[#154BD1]"></textarea>
            </div>

           
            <button type="submit" class="w-full bg-[#154BD1] text-[#F3F2D4] py-5 rounded-2xl font-black uppercase text-xl shadow-lg hover:opacity-90 transition-all">
                Post Review
            </button>
        </form>
    </div>
</div>`;
}


async function allReviewsView() {

    const res = await fetch("https://dash-dough-backend.vercel.app/api/review/");

    const data = await res.json();

    console.log("Fetched reviews:", reviews);

    // if (!data.success) {
    //     alert(data.message || "Failed to fetch reviews. Please try again.");
    //     console.log(data);
    //     return false;
    // }

    const reviews = data.reviews;

    console.log("Fetched reviews:", reviews);

   

    // const reviews = [
    //     { userName: "John Doe", email: "john.doe@example.com", rating: 4, review: "THE BEST PIZZA IN TOWN! THE CRUST WAS PERFECTLY CRISPY AND THE CHEESE WAS MELTY HEAVEN." },
    //     { userName: "Alice Smith", rating: 3, review: "GOOD FLAVOR BUT THE PIZZA WAS A BIT TOO GREASY FOR MY TASTE. STILL ENJOYED IT THOUGH." }
    // ];

    const reviewsContent = reviews.map(r => {
        return `<div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">${r.userName.charAt(0).toUpperCase()}</div>
                <div>
                    <h4 class="font-black uppercase">${r.userName}</h4>
                    <p class="text-xs opacity-60 font-bold">${r.email || ''}</p>
                    <div class="flex gap-1 text-yellow-400">
                        ${[...Array(5)].map((_, i) => `<span class="text-lg">${i < r.rating ? '★' : '☆'}</span>`).join("")}
                    </div>
                </div>
            </div>
            <p class="font-bold uppercase opacity-80">${r.review}</p>
        </div>`
    })


    return `<div class="max-w-4xl mx-auto p-4 md:p-8 font-sans">
    <div class="mb-8">
        <h2 class="text-4xl font-black uppercase text-[#154BD1]">Reviews</h2>
        <p class="font-bold opacity-60">WHAT PEOPLE ARE SAYING ABOUT US.</p>
    </div>

    <div id="reviews-container" class="space-y-6">
        
       ${reviewsContent.join("")}
    </div>
</div>`;
}