const foods = [
  {id:1,name:"Margherita Pizza",category:"Pizza",price:249,rating:"4.8",tag:"Bestseller",desc:"Classic cheese, basil & tomato.",img:"https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600&q=80"},
  {id:2,name:"Classic Smash Burger",category:"Burgers",price:199,rating:"4.9",tag:"Popular",desc:"Juicy patty with our house sauce.",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"},
  {id:3,name:"Chicken Biryani",category:"Indian",price:289,rating:"4.9",tag:"Chef's pick",desc:"Aromatic rice, spices & tender chicken.",img:"https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600&q=80"},
  {id:4,name:"Loaded French Fries",category:"Sides",price:129,rating:"4.7",tag:"Crispy!",desc:"Golden fries with a cheesy topping.",img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80"},
  {id:5,name:"Chocolate Brownie",category:"Desserts",price:149,rating:"4.8",tag:"Sweet treat",desc:"Rich, fudgy and totally irresistible.",img:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80"},
  {id:6,name:"Iced Cold Coffee",category:"Drinks",price:119,rating:"4.6",tag:"Chilled",desc:"Smooth coffee with a creamy finish.",img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80"},
  {id:7,name:"Farmhouse Pizza",category:"Pizza",price:329,rating:"4.8",tag:"Veg favourite",desc:"Loaded with fresh veggies & mozzarella.",img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80"},
  {id:8,name:"Paneer Tikka Bowl",category:"Indian",price:229,rating:"4.7",tag:"Veg delight",desc:"Smoky paneer with fragrant rice.",img:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80"}
];
let cart = [];
let activeCategory = "All";
const grid = document.getElementById("foodGrid");
const search = document.getElementById("searchInput");
const toastEl = document.getElementById("toast");
let toastTimer;

function money(n){return "₹"+n.toLocaleString("en-IN")}
function showToast(message){
  toastEl.textContent=message;toastEl.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove("show"),2200);
}
function renderFoods(){
  const term=search.value.trim().toLowerCase();
  const visible=foods.filter(f=>(activeCategory==="All"||f.category===activeCategory)&&
    (f.name.toLowerCase().includes(term)||f.desc.toLowerCase().includes(term)||f.category.toLowerCase().includes(term)));
  document.getElementById("resultsLabel").textContent=term?`Search results (${visible.length})`:activeCategory==="All"?"Popular right now":`${activeCategory} favourites`;
  grid.innerHTML=visible.map(f=>`<article class="food-card">
    <div class="food-photo"><img src="${f.img}" alt="${f.name}" loading="lazy"><span class="food-badge">${f.tag}</span></div>
    <div class="food-info"><div class="food-title-row"><h3>${f.name}</h3><span class="rating">★ ${f.rating}</span></div>
    <p class="food-desc">${f.desc}</p><div class="food-foot"><span class="price">${money(f.price)}</span><button class="add-btn" data-add="${f.id}">+ Add</button></div></div></article>`).join("");
  document.getElementById("emptyState").hidden=visible.length!==0;
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;else cart.push({id,qty:1});
  renderCart();showToast("Added to your cart ✨");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  renderCart();
}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("drawerCount").textContent=`(${count})`;
  const items=document.getElementById("cartItems");
  const bottom=document.getElementById("cartBottom");
  if(!count){
    items.innerHTML='<div class="cart-empty"><span>🛍️</span><h3>Your cart is empty</h3><p>Add something delicious to get started.</p></div>';
    bottom.hidden=true;return;
  }
  bottom.hidden=false;
  items.innerHTML=cart.map(c=>{const f=foods.find(x=>x.id===c.id);return `<div class="cart-line">
    <img src="${f.img}" alt=""><div class="cart-line-info"><strong>${f.name}</strong><small>${money(f.price)} each</small>
    <div class="qty"><button data-qty="${f.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${c.qty}</span><button data-qty="${f.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div>
    <span class="line-price">${money(f.price*c.qty)}</span></div>`}).join("");
  const subtotal=cart.reduce((s,c)=>s+foods.find(f=>f.id===c.id).price*c.qty,0);
  document.getElementById("subtotal").textContent=money(subtotal);
  document.getElementById("total").textContent=money(subtotal+30);
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true")}
grid.addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(Number(btn.dataset.add))});
document.getElementById("categories").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b===btn));renderFoods()});
search.addEventListener("input",renderFoods);
document.getElementById("searchToggle").addEventListener("click",()=>{search.focus();document.getElementById("menu").scrollIntoView({behavior:"smooth"})});
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("cartItems").addEventListener("click",e=>{const btn=e.target.closest("[data-qty]");if(btn)changeQty(Number(btn.dataset.qty),Number(btn.dataset.delta))});
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!cart.length)return;showToast("Order demo complete! Thanks for trying CraveBite 🎉");cart=[];renderCart();closeCart()});
document.getElementById("copyCode").addEventListener("click",async()=>{try{await navigator.clipboard.writeText("FIRSTBITE");showToast("Coupon code copied!")}catch{showToast("Your code: FIRSTBITE")}});
document.getElementById("year").textContent=new Date().getFullYear();
renderFoods();renderCart();
