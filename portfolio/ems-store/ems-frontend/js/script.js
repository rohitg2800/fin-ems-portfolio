/* =========================================
   EMS Luxe Supply – script.js
   • Cart + Product grids
   • Mobile nav
   • Hover-zoom images + lazy-load
   • Quick-view modal (replaces alert)
   • Cart-badge “bump” animation
   ========================================= */

const STORAGE_KEY = 'ems_store_cart_v1';

/** ----------  PRODUCT DATA  ---------- */
/** @typedef {{id:string,name:string,category:string,price:number,sku:string,description:string,bullets:string[],badge?:string,img?:string}} Product */
/** @type {Product[]} */
const PRODUCTS = [
  {
    id:'steth-littmann-classic',
    name:'Classic Acoustic Stethoscope',
    category:'Stethoscopes',
    sku:'EMS-STETH-CLASSIC',
    price:109,
    badge:'Best for students',
    description:'Reliable everyday acoustics with durable tubing for academy rotations and busy shifts.',
    bullets:['Dual-head chestpiece','Tunable diaphragm','Latex-free','Comfort ear tips'],
    img:'https://source.unsplash.com/400x300/?stethoscope'
  },
  {
    id:'steth-electronic',
    name:'Electronic Noise-Reducing Stethoscope',
    category:'Stethoscopes',
    sku:'EMS-STETH-ELECTRO',
    price:289,
    badge:'Critical care',
    description:'Built for loud rigs and critical assessments with amplified heart and lung sounds.',
    bullets:['Noise reduction','Volume modes','Battery powered','Field-ready case'],
    img:'https://source.unsplash.com/400x300/?medical,device'
  },
  {
    id:'pants-5in1-tactical',
    name:'5-in-1 Tactical EMS Pants',
    category:'Apparel',
    sku:'EMS-PANTS-5IN1',
    price:79,
    badge:'New',
    description:'Reinforced knees/seat, low-noise hardware, and tool pockets designed for fast draws.',
    bullets:['Ripstop DWR','Gusseted crotch','Shears + radio pocket','Articulated fit'],
    img:'https://source.unsplash.com/400x300/?tactical,pants'
  },
  {
    id:'kit-student-starter',
    name:'EMT/Paramedic Student Starter Kit',
    category:'Kits',
    sku:'EMS-KIT-STUDENT',
    price:59,
    badge:'Bundle',
    description:'Essentials-only loadout aligned to coursework checklists and skills labs.',
    bullets:['Glove pouch','Penlight','Trauma shears','Reference cards'],
    img:'https://source.unsplash.com/400x300/?medical,kit'
  },
  {
    id:'kit-low-sig-trauma',
    name:'Low-Signature Trauma Pouch',
    category:'Kits',
    sku:'EMS-KIT-LOWSIG',
    price:49,
    badge:'Tactical',
    description:'Armor-compatible pouch layout with silent hardware and quick access organization.',
    bullets:['Low-profile','Quiet pulls','Elastic retention','Easy cleaning'],
    img:'https://source.unsplash.com/400x300/?trauma,bag'
  },
  {
    id:'tool-shears-ballistic',
    name:'Ballistic-Rated Trauma Shears',
    category:'Tools',
    sku:'EMS-TOOL-SHEARS',
    price:19,
    description:'Tough shears for denim, webbing, and layered clothing—built for the field.',
    bullets:['Serrated edge','Blunt tip','Rust-resistant','Grip texture'],
    img:'https://source.unsplash.com/400x300/?trauma,shears'
  },
];

/** ----------  CART HELPERS  ---------- */
function loadCart(){try{const j=localStorage.getItem(STORAGE_KEY);return j?JSON.parse(j):{}}catch{return{}}}
function saveCart(c){localStorage.setItem(STORAGE_KEY,JSON.stringify(c))}
const cartCount   = c=>Object.values(c).reduce((s,n)=>s+(Number.isFinite(n)?n:0),0);
const cartTotal   = c=>Object.entries(c).reduce((t,[id,q])=>{
  const p=PRODUCTS.find(x=>x.id===id);return p?t+p.price*q:t},0);
const money       = n=>Number(n||0).toLocaleString(undefined,{style:'currency',currency:'USD'});

/** ----------  DOM UTILS  ---------- */
const el=(tag,attrs={},children=[])=>{
  const node=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') node.className=v;
    else if(k==='text') node.textContent=v;
    else if(k.startsWith('on')&&typeof v==='function') node.addEventListener(k.slice(2).toLowerCase(),v);
    else node.setAttribute(k,String(v));
  });
  children.forEach(c=>node.append(c));
  return node;
};

/** ----------  RENDER PRODUCTS  ---------- */
function pageCategory(){return document.documentElement.getAttribute('data-category')||null;}

function renderProductsInto(target,cat){
  if(!target) return;
  const list = cat ? PRODUCTS.filter(p=>p.category===cat) : PRODUCTS;

  target.replaceChildren(...list.map(p=>{
    const top=el('div',{class:'card-top'},[
      el('img',{src:p.img,alt:p.name,class:'product-img',loading:'lazy'}),
      el('div',{class:'tag',text:p.category}),
    ]);

    const card=el('article',{class:'card'},[
      top,
      el('div',{class:'card-inner'},[
        el('h3',{class:'card-title',text:p.name}),
        el('p',{class:'card-text',text:p.description}),
        el('ul',{class:'small'},p.bullets.map(b=>el('li',{text:b}))),
        el('div',{class:'price-row'},[
          el('div',{},[
            el('div',{class:'price',text:money(p.price)}),
            el('div',{class:'small',text:p.sku}),
          ]),
          p.badge?el('div',{class:'pill',text:p.badge}):el('div')
        ]),
        el('div',{class:'card-actions'},[
          el('button',{class:'btn secondary',onClick:()=>quickView(p.id)},[document.createTextNode('Details')]),
          el('button',{class:'btn',onClick:()=>addToCart(p.id,1)},[document.createTextNode('Add')]),
        ])
      ])
    ]);
    return card;
  }));
}

function renderAllProducts(){
  renderProductsInto(document.getElementById('productGrid'),pageCategory());
  renderProductsInto(document.getElementById('gridStethoscopes'),'Stethoscopes');
  renderProductsInto(document.getElementById('gridKits'),'Kits');
  renderProductsInto(document.getElementById('gridApparel'),'Apparel');
  renderProductsInto(document.getElementById('gridTools'),'Tools');
}

/** ----------  CART UI  ---------- */
function updateCartUI(){
  const cart=loadCart();

  const badge=document.getElementById('cartBadge');
  if(badge){
    badge.textContent=String(cartCount(cart));
    badge.classList.remove('bump');          // restart bump anim
    void badge.offsetWidth;
    badge.classList.add('bump');
  }

  const list=document.getElementById('cartItems');
  const total=document.getElementById('cartTotal');
  if(total) total.textContent=money(cartTotal(cart));
  if(!list) return;

  const ids=Object.keys(cart).filter(id=>cart[id]>0);
  if(ids.length===0){
    list.replaceChildren(el('div',{class:'empty',text:'Your cart is empty.'}));
    return;
  }

  list.replaceChildren(...ids.map(id=>{
    const p=PRODUCTS.find(x=>x.id===id); if(!p) return el('div');
    const qty=cart[id];
    return el('div',{class:'line-item'},[
      el('div',{},[
        el('div',{class:'line-name',text:p.name}),
        el('div',{class:'line-meta',text:`${p.category} • ${money(p.price)} each`}),
      ]),
      el('div',{class:'qty'},[
        el('button',{onClick:()=>addToCart(id,-1)},[document.createTextNode('−')]),
        el('div',{class:'line-name',text:String(qty)}),
        el('button',{onClick:()=>addToCart(id,1)},[document.createTextNode('+')]),
      ])
    ]);
  }).filter(Boolean));
}

function addToCart(id,delta){
  const cart=loadCart();
  const next=Math.max(0,(cart[id]||0)+delta);
  if(next===0) delete cart[id]; else cart[id]=next;
  saveCart(cart); updateCartUI();
}

/** ----------  CART OPEN/CLOSE  ---------- */
const openCart = ()=>{document.getElementById('cartBackdrop')?.classList.add('open');document.getElementById('cartDrawer')?.classList.add('open');updateCartUI();}
const closeCart= ()=>{document.getElementById('cartBackdrop')?.classList.remove('open');document.getElementById('cartDrawer')?.classList.remove('open');}
const toggleCart=()=>{
  const d=document.getElementById('cartDrawer');
  d?.classList.contains('open')?closeCart():openCart();
};

/** ----------  QUICK-VIEW MODAL  ---------- */
function ensureModal(){
  if(document.getElementById('quickBackdrop')) return;
  const back=el('div',{id:'quickBackdrop',class:'modal-backdrop'});
  const modal=el('div',{id:'quickModal',class:'modal'});
  back.append(modal);
  document.body.append(back);
  back.addEventListener('click',e=>{if(e.target===back)back.classList.remove('open')});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')back.classList.remove('open')});
}
function quickView(id){
  ensureModal();
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  const back=document.getElementById('quickBackdrop');
  const m=document.getElementById('quickModal');
  m.replaceChildren(
    el('img',{src:p.img,alt:p.name,loading:'lazy'}),
    el('div',{class:'modal-title',text:p.name}),
    el('div',{class:'modal-desc',text:p.description}),
    el('ul',{class:'small'},p.bullets.map(b=>el('li',{text:b}))),
    el('div',{class:'price',text:money(p.price)}),
    el('div',{class:'modal-actions'},[
      el('button',{class:'btn',onClick:()=>{addToCart(id,1);back.classList.remove('open');}},[document.createTextNode('Add to cart')]),
      el('button',{class:'btn secondary',onClick:()=>back.classList.remove('open')},[document.createTextNode('Close')])
    ])
  );
  back.classList.add('open');
}

/** ----------  NEWSLETTER & CHECKOUT  ---------- */
function wireCheckout(){
  document.getElementById('checkoutBtn')?.addEventListener('click',()=>{
    const c=loadCart(); if(cartCount(c)===0){alert('Cart is empty');return;}
    alert('Checkout demo — integrate Stripe here.');
    closeCart();
  });
}
function wireNewsletter(){
  const form=document.getElementById('newsletterForm');
  const out=document.getElementById('newsletterOut');
  form?.addEventListener('submit',e=>{
    e.preventDefault(); if(out) out.textContent='You’re in — thanks!';
    form.reset();
  });
}

/** ----------  MOBILE MENU  ---------- */
function wireMobileMenu(){
  const t=document.getElementById('menuToggle'); const nav=document.querySelector('.nav');
  if(!t||!nav) return;
  t.addEventListener('click',()=>{nav.classList.toggle('active');t.classList.toggle('active');});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('active');t.classList.remove('active');}));
  document.addEventListener('click',e=>{
    if(nav.classList.contains('active')&&!nav.contains(e.target)&&!t.contains(e.target)){
      nav.classList.remove('active');t.classList.remove('active');
    }
  });
}

/** ----------  IMAGE LAZY-LOAD (fade-in) ---------- */
function wireLazy(){
  const imgs=[...document.querySelectorAll('img[loading="lazy"]')];
  imgs.forEach(img=>{
    if(img.complete) img.classList.add('loaded');
    else img.addEventListener('load',()=>img.classList.add('loaded'));
  });
}

/** ----------  MAIN ---------- */
function main(){
  renderAllProducts();
  wireLazy();
  updateCartUI();
  wireCheckout();
  wireNewsletter();
  wireMobileMenu();

  /* cart buttons */
  document.getElementById('cartBtn')?.addEventListener('click',toggleCart);
  document.getElementById('cartClose')?.addEventListener('click',closeCart);
  document.getElementById('cartBackdrop')?.addEventListener('click',closeCart);

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart();});
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',main):main();