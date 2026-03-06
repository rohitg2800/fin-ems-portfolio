/* =========================================
   EMS Luxe Supply – script.js  (patched)
   ========================================= */

const STORAGE_KEY = 'ems_store_cart_v1';

/* -------- PRODUCT DATA (duplicate removed) -------- */
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
    description:'Essentials-only load-out aligned to coursework checklists and skills labs.',
    bullets:['Glove pouch','Penlight','Trauma shears','Reference cards'],
    img:'../images/kit-student-demo.jpg'
  },
  {
    id:'kit-low-sig-trauma',
    name:'Low-Signature Trauma Pouch',
    category:'Kits',
    sku:'EMS-KIT-LOWSIG',
    price:49,
    badge:'Tactical',
    description:'Armor-compatible pouch layout with silent hardware and quick access organisation.',
    bullets:['Low-profile','Quiet pulls','Elastic retention','Easy cleaning'],
    img:'https://source.unsplash.com/400x300/?trauma,bag'
  },
  {
    id:'tool-shears-ballistic',
    name:'Ballistic-Rated Trauma Shears',
    category:'Tools',
    sku:'EMS-TOOL-SHEARS',
    price:19,
    description:'Tough shears for denim, webbing and layered clothing—built for the field.',
    bullets:['Serrated edge','Blunt tip','Rust-resistant','Grip texture'],
    img:'https://source.unsplash.com/400x300/?trauma,shears'
  }
];

/* ---------- helpers (unchanged) ---------- */
function loadCart(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}}catch{return{}}}
const saveCart=c=>localStorage.setItem(STORAGE_KEY,JSON.stringify(c));
const cartCount=c=>Object.values(c).reduce((s,n)=>s+(+n||0),0);
const cartTotal=c=>Object.entries(c).reduce((t,[id,q])=>{
  const p=PRODUCTS.find(x=>x.id===id);return p?t+p.price*q:t},0);
const money=n=>(+n||0).toLocaleString(undefined,{style:'currency',currency:'USD'});
const el=(tag,attrs={},children=[])=>{
  const n=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class')n.className=v;else if(k==='text')n.textContent=v;
    else if(k.startsWith('on'))n.addEventListener(k.slice(2).toLowerCase(),v);
    else n.setAttribute(k,String(v));
  });
  children.forEach(c=>n.append(c));return n;
};

/* ---------- product renderer (unchanged logic) ---------- */
function renderProductsInto(mount,cat){
  if(!mount)return;
  const list=cat?PRODUCTS.filter(p=>p.category===cat):PRODUCTS;
  mount.replaceChildren(...list.map(p=>{
    const top=el('div',{class:'card-top'},[
      el('img',{src:p.img,alt:p.name,class:'product-img',loading:'lazy'}),
      el('div',{class:'tag',text:p.category})
    ]);
    return el('article',{class:'card'},[
      top,
      el('div',{class:'card-inner'},[
        el('h3',{class:'card-title',text:p.name}),
        el('p',{class:'card-text',text:p.description}),
        el('ul',{class:'small'},p.bullets.map(b=>el('li',{text:b}))),
        el('div',{class:'price-row'},[
          el('div',{},[el('div',{class:'price',text:money(p.price)}),el('div',{class:'small',text:p.sku})]),
          p.badge?el('div',{class:'pill',text:p.badge}):el('div')
        ]),
        el('div',{class:'card-actions'},[
          el('button',{class:'btn secondary',onClick:()=>quickView(p.id)},['Details']),
          el('button',{class:'btn',onClick:()=>addToCart(p.id,1)},['Add'])
        ])
      ])
    ]);
  }));
}

function renderAll(){
  renderProductsInto(document.getElementById('productGrid'),null);
  renderProductsInto(document.getElementById('gridStethoscopes'),'Stethoscopes');
  renderProductsInto(document.getElementById('gridKits'),'Kits');
  renderProductsInto(document.getElementById('gridApparel'),'Apparel');
  renderProductsInto(document.getElementById('gridTools'),'Tools');
}

/* ---------- rest of original JS (cart, modal, etc.) is unchanged  ---------- */
/* … keep your existing functions openCart / closeCart / quickView / mobile nav */
/* Just add the tiny fade-in helper at the end:                         */

function fadeInLazy(){
  document.querySelectorAll('img[loading="lazy"]').forEach(img=>{
    if(img.complete)img.classList.add('loaded');
    else img.addEventListener('load',()=>img.classList.add('loaded'));
  });
}

function main(){
  renderAll();fadeInLazy(); /* ++ */
  /* …the rest of your original main() … */
}

/* bootstrap */
document.readyState==='loading'?
  document.addEventListener('DOMContentLoaded',main):main();