"use strict";

const STORAGE_KEY = "ems_store_cart_v1";
const THEME_KEY = "ems_theme_preference";

/* ---------- THE 43-ITEM MASSIVE INVENTORY ---------- */
let PRODUCTS = [
  // --- MEDICINES & OTC (8) ---
  { id: "med-01", name: "Oral Glucose Gel (15g, 3-Pack)", category: "Medicines", sku: "MED-GLU-01", price: 18.50, badge: "Restocked", stock_level: 150, description: "Rapid-absorbing lemon flavored glucose gel for treating conscious patients with suspected hypoglycemia.", bullets: ["15 grams per tube", "Easy twist-off cap", "Fast absorption formula"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Oral Glucose" } },
  { id: "med-02", name: "Chewable Baby Aspirin (81mg, 36ct)", category: "Medicines", sku: "MED-ASP-02", price: 9.99, stock_level: 210, description: "Standard 81mg chewable aspirin for early administration during suspected acute myocardial infarction (AMI).", bullets: ["Cherry flavored", "Chewable for rapid onset", "Standard protocol dosage"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Aspirin Bottle" } },
  { id: "med-03", name: "Naloxone (Narcan) Training Device", category: "Medicines", sku: "MED-NAL-03", price: 24.00, badge: "Training", stock_level: 85, description: "Inert, non-medicated training device that replicates the exact weight and mechanism of a real Naloxone nasal spray.", bullets: ["Reusable spring mechanism", "Zero medication (inert)", "Perfect for CPR/BLS classes"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Naloxone Trainer" } },
  { id: "med-04", name: "Activated Charcoal Suspension", category: "Medicines", sku: "MED-CHR-04", price: 22.00, stock_level: 40, description: "25g/120mL aqueous suspension of activated charcoal for the emergency treatment of specific oral poisonings.", bullets: ["Pre-mixed suspension", "Includes sorbitol", "Sealed leak-proof bottle"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Activated Charcoal" } },
  { id: "med-05", name: "Ammonia Inhalants (Box of 10)", category: "Medicines", sku: "MED-AMM-05", price: 14.00, stock_level: 300, description: "Respiratory stimulant ampules (smelling salts) to treat and prevent fainting.", bullets: ["0.33cc crushable glass ampules", "Protective webbed sleeve", "Fast-acting vapor"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Ammonia Inhalants" } },
  { id: "med-06", name: "Triple Antibiotic Ointment (144 Packets)", category: "Medicines", sku: "MED-ABO-06", price: 26.50, stock_level: 180, description: "Single-use 0.9g foil packets of Bacitracin, Neomycin, and Polymyxin B for minor wound care.", bullets: ["Prevents cross-contamination", "Tear-top foil packs", "Compact for jump bags"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Antibiotic Ointment" } },
  { id: "med-07", name: "Sterile Eye Wash Irrigant (4oz, 2-Pack)", category: "Medicines", sku: "MED-EYE-07", price: 12.99, stock_level: 220, description: "Purified, isotonic buffered saline solution for flushing debris and chemicals from eyes.", bullets: ["Squeeze bottle applicator", "Isotonic saline", "Tamper-evident seal"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Eye Wash" } },
  { id: "med-08", name: "Water-Jel Burn Dressing (4x4, 5-Pack)", category: "Medicines", sku: "MED-BRN-08", price: 34.00, badge: "Trauma", stock_level: 95, description: "Medical-grade cooling gel infused into a sterile carrier dressing to halt burn progression and relieve pain.", bullets: ["Contains Hyaluronic Acid", "Does not stick to wounds", "Provides instant cooling"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Burn Gel" } },
  
  // --- STETHOSCOPES (8) ---
  { id: "steth-01", name: "Classic Acoustic Stethoscope", category: "Stethoscopes", sku: "STETH-CLS-01", price: 109, badge: "Best Seller", stock_level: 45, description: "Everyday acoustic performance for EMTs and students. Tunable diaphragm and field-ready comfort.", bullets: ["Dual-head chestpiece", "Latex-free tubing", "Soft-seal ear tips"], image: { src: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=80", alt: "Classic Stethoscope" } },
  { id: "steth-02", name: "Electronic Noise-Reducing Stethoscope", category: "Stethoscopes", sku: "STETH-ELE-02", price: 289, badge: "Flight Medics", stock_level: 12, description: "Active noise reduction cuts through sirens and rotor wash.", bullets: ["40x Amplification", "Bluetooth connectivity", "Volume profiles"], image: { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80", alt: "Electronic Steth" } },
  { id: "steth-03", name: "Cardiology Pro III", category: "Stethoscopes", sku: "STETH-CAR-03", price: 199, badge: "ALS Ready", stock_level: 28, description: "Advanced dual-frequency tuning for detailed cardiac and pulmonary assessment.", bullets: ["Stainless steel head", "Dual-lumen tubing", "Non-chill rim"], image: { src: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80", alt: "Cardio Steth" } },
  { id: "steth-04", name: "Lightweight Student Model", category: "Stethoscopes", sku: "STETH-STU-04", price: 59, badge: "Budget", stock_level: 105, description: "Perfect for skills labs and clinical rotations. Lightweight aluminum design.", bullets: ["Aluminum chestpiece", "Tear-drop shape", "Anatomical headset"], image: { src: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80", alt: "Student Steth" } },
  { id: "steth-05", name: "Pediatric & Infant Dual Stethoscope", category: "Stethoscopes", sku: "STETH-PED-05", price: 145, stock_level: 18, description: "Specifically sized for pediatric and neonatal patients with exceptional acoustic clarity.", bullets: ["1-inch traditional bell", "Floating diaphragm", "Machined stainless"], image: { src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80", alt: "Pediatric Steth" } },
  { id: "steth-06", name: "Rig-Duty Hybrid Tactical", category: "Stethoscopes", sku: "STETH-TAC-06", price: 169, badge: "Rugged", stock_level: 33, description: "Blackout design with thicker acoustic tubing to block out highway noise.", bullets: ["All-black tactical finish", "Extra-thick PVC tubing", "Reinforced yoke"], image: { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80", alt: "Tactical Steth" } },
  { id: "steth-07", name: "Digital AI Stethoscope", category: "Stethoscopes", sku: "STETH-DIG-07", price: 349, badge: "New Tech", stock_level: 8, description: "Visualizes waveforms on a built-in screen and detects murmurs using onboard AI.", bullets: ["OLED display screen", "Murmur detection AI", "Rechargeable battery"], image: { src: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80", alt: "Digital Steth" } },
  { id: "steth-08", name: "Veterinary Responder Stethoscope", category: "Stethoscopes", sku: "STETH-VET-08", price: 119, stock_level: 20, description: "Longer 32-inch tubing to accommodate K9 and tactical animal rescue ops.", bullets: ["32-inch long tubing", "High acoustic sensitivity", "Brass construction"], image: { src: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&w=600&q=80", alt: "Vet Steth" } },

  // --- KITS & BAGS (8) ---
  { id: "kit-01", name: "Rapid Response Jump Backpack", category: "Kits", sku: "KIT-BAG-01", price: 189, badge: "Agency Favorite", stock_level: 22, description: "Modular EMS backpack with internal organizers for airways, IV, and trauma gear.", bullets: ["High-vis reflective trim", "MOLLE webbing", "Color-coded dividers"], image: { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80", alt: "Jump Bag" } },
  { id: "kit-02", name: "Advanced Stop-The-Bleed Kit", category: "Kits", sku: "KIT-STB-02", price: 85, badge: "Essential", stock_level: 150, description: "Vacuum-sealed bleeding control kit containing CAT tourniquet and hemostatic gauze.", bullets: ["Windlass Tourniquet", "QuikClot dressing", "Chest seal included"], image: { src: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80", alt: "Bleed Kit" } },
  { id: "kit-03", name: "ALS Airway Roll Kit", category: "Kits", sku: "KIT-AIR-03", price: 129, stock_level: 40, description: "Roll-out airway kit with compartments for BVM, OPAs, NPAs, and intubation adjuncts.", bullets: ["Wipe-clean material", "Clear vinyl pockets", "Fits inside main bag"], image: { src: "https://images.unsplash.com/photo-1584308666744-24d5e45a05b3?auto=format&fit=crop&w=600&q=80", alt: "Airway Roll" } },
  { id: "kit-04", name: "Mass Casualty Triage Pack", category: "Kits", sku: "KIT-MCI-04", price: 149, badge: "Command", stock_level: 15, description: "Complete MCI triage kit with tags, tape, and tools for rapid START/JumpSTART.", bullets: ["100 triage tags", "Command checklists", "High-visibility pouch"], image: { src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80", alt: "MCI Pack" } },
  { id: "kit-05", name: "EMT Student Starter Kit", category: "Kits", sku: "KIT-STU-05", price: 59, stock_level: 200, description: "Includes shears, penlight, tape, pupil gauge, and BP cuff for clinicals.", bullets: ["NREMT compliant", "Belt-ready pouch", "Basic diagnostics"], image: { src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80", alt: "Student Kit" } },
  { id: "kit-06", name: "Burn Management Module", category: "Kits", sku: "KIT-BRN-06", price: 95, stock_level: 30, description: "Specialized burn dressings, sterile water, and non-adherent wraps for thermal trauma.", bullets: ["Water-Jel dressings", "Sterile burn sheets", "Cooling gel packs"], image: { src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80", alt: "Burn Kit" } },
  { id: "kit-07", name: "O2 Cylinder Sling Bag", category: "Kits", sku: "KIT-OXY-07", price: 65, stock_level: 60, description: "Padded shoulder sling designed specifically to carry a D-size oxygen cylinder securely.", bullets: ["Padded interior", "Wrench side-pocket", "Heavy duty zippers"], image: { src: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=600&q=80", alt: "O2 Bag" } },
  { id: "kit-08", name: "Infection Control PPE Kit", category: "Kits", sku: "KIT-PPE-08", price: 45, stock_level: 300, description: "Grab-and-go sealed PPE pack including N95, gown, face shield, and double gloves.", bullets: ["Tear-open design", "Bio-hazard bag included", "AAMI Level 3 gown"], image: { src: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=600&q=80", alt: "PPE Kit" } },

  // --- APPAREL (9) ---
  { id: "app-01", name: "5-in-1 Tactical EMS Pants", category: "Apparel", sku: "APP-PNT-01", price: 89, badge: "Top Rated", stock_level: 120, description: "Ripstop tactical pants with dedicated shears, radio, and glove pockets.", bullets: ["Teflon coated", "Reinforced knees", "Expandable waist"], image: { src: "https://images.unsplash.com/photo-1622519407650-3cb983cedb75?auto=format&fit=crop&w=600&q=80", alt: "Tactical Pants" } },
  { id: "app-02", name: "High-Vis Response Jacket", category: "Apparel", sku: "APP-JAC-02", price: 145, badge: "Winter", stock_level: 40, description: "ANSI Class 3 certified waterproof jacket with zip-out fleece liner.", bullets: ["3M Reflective tape", "Waterproof shell", "Radio mic loops"], image: { src: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=600&q=80", alt: "Hi-Vis Jacket" } },
  { id: "app-03", name: "Station Duty Polo", category: "Apparel", sku: "APP-POL-03", price: 45, stock_level: 250, description: "Moisture-wicking, anti-odor performance polo perfect for 24-hour shifts.", bullets: ["Pen pockets on sleeve", "No-roll collar", "Snag resistant"], image: { src: "https://images.unsplash.com/photo-1586363104862-3a5e228e10ea?auto=format&fit=crop&w=600&q=80", alt: "Duty Polo" } },
  { id: "app-04", name: "Side-Zip Tactical Boots (8-Inch)", category: "Apparel", sku: "APP-BOT-04", price: 135, badge: "Footwear", stock_level: 80, description: "Blood-borne pathogen resistant composite toe boots with rapid side-zipper.", URL: "", bullets: ["Slip-resistant sole", "Composite safety toe", "YKK heavy duty zipper"], image: { src: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80", alt: "Tactical Boots" } },
  { id: "app-05", name: "Mil-Spec Cargo Shorts", category: "Apparel", sku: "APP-SHR-05", price: 54, stock_level: 90, description: "For hot weather deployments and bike medics. 8 pockets and gusseted crotch.", bullets: ["9-inch inseam", "Fade resistant", "Double-thick seat"], image: { src: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80", alt: "Cargo Shorts" } },
  { id: "app-06", name: "Fleece-Lined Winter Pants", category: "Apparel", sku: "APP-WIN-06", price: 110, stock_level: 35, description: "Softshell exterior stops wind and rain, micro-fleece interior keeps you warm.", bullets: ["Windproof", "Water repellent", "Ankle zips over boots"], image: { src: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80", alt: "Winter Pants" } },
  { id: "app-07", name: "Reflective PT Vest", category: "Apparel", sku: "APP-VST-07", price: 25, stock_level: 150, description: "Break-away safety vest for roadside incidents. Meets public safety standards.", bullets: ["5-point breakaway", "Adjustable sizing", "Clear ID pocket"], image: { src: "https://images.unsplash.com/photo-1599557613589-97ce71bb5fe9?auto=format&fit=crop&w=600&q=80", alt: "Safety Vest" } },
  { id: "app-08", name: "Moisture-Wicking Base Layer", category: "Apparel", sku: "APP-BAS-08", price: 30, stock_level: 200, description: "Compression fit base layer shirt designed to be worn under body armor.", bullets: ["Odor control", "Flatlock seams", "4-way stretch"], image: { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", alt: "Base Layer" } },
  { id: "app-09", name: "EMS Duty Belt", category: "Apparel", sku: "APP-BLT-09", price: 35, stock_level: 110, description: "Rigid nylon web belt that supports holsters, radio clips, and heavy gear.", bullets: ["Aircraft-grade buckle", "1.5 inch width", "Velcro adjustment"], image: { src: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80", alt: "Duty Belt" } },

  // --- TOOLS & DIAGNOSTICS (10) ---
  { id: "tool-01", name: "Ballistic Trauma Shears", category: "Tools", sku: "TOL-SHR-01", price: 25, badge: "Indestructible", stock_level: 400, description: "Titanium-coated blades that cut through leather, denim, and pennies.", bullets: ["7.5 inch length", "Autoclavable", "Blunt safety tip"], image: { src: "https://images.unsplash.com/photo-1587370560942-12f94c0349b6?auto=format&fit=crop&w=600&q=80", alt: "Trauma Shears" } },
  { id: "tool-02", name: "Folding Rescue Multitool", category: "Tools", sku: "TOL-MUL-02", price: 85, badge: "Premium", stock_level: 60, description: "Features shears, strap cutter, glass breaker, and oxygen tank wrench in one.", bullets: ["One-handed deployment", "Pocket clip", "MOLLE sheath included"], image: { src: "https://images.unsplash.com/photo-1586810165620-af3ba1e847dc?auto=format&fit=crop&w=600&q=80", alt: "Multitool" } },
  { id: "tool-03", name: "LED Pupil Penlight", category: "Tools", sku: "TOL-PEN-03", price: 15, stock_level: 500, description: "Warm-white LED optimized for neuro exams without blinding the patient.", bullets: ["Pupil gauge printed", "Aluminum barrel", "AAA batteries included"], image: { src: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=600&q=80", alt: "Penlight" } },
  { id: "tool-04", name: "Spring-Loaded Window Punch", category: "Tools", sku: "TOL-PUN-04", price: 18, stock_level: 150, description: "One-handed center punch for rapid vehicle extrication.", bullets: ["Hardened steel tip", "Adjustable tension", "Textured grip"], image: { src: "https://images.unsplash.com/photo-1533423996375-f91441ea5d28?auto=format&fit=crop&w=600&q=80", alt: "Window Punch" } },
  { id: "tool-05", name: "Fingertip Pulse Oximeter", category: "Tools", sku: "TOL-OXI-05", price: 45, badge: "Diagnostic", stock_level: 80, description: "Clinical grade SPO2 and pulse rate monitor with multi-directional OLED.", bullets: ["Plethysmograph waveform", "Silicone finger pad", "Auto-off function"], image: { src: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=600&q=80", alt: "Pulse Oximeter" } },
  { id: "tool-06", name: "Aneroid Sphygmomanometer", category: "Tools", sku: "TOL-BPC-06", price: 55, stock_level: 110, description: "Manual blood pressure cuff with adult and large-adult cuffs included.", bullets: ["Latex-free", "Luminescent dial", "Zip carry case"], image: { src: "https://images.unsplash.com/photo-1628348070830-dfa05bc1dd3e?auto=format&fit=crop&w=600&q=80", alt: "BP Cuff" } },
  { id: "tool-07", name: "Manual Ring Cutter", category: "Tools", sku: "TOL-RNG-07", price: 35, stock_level: 40, description: "Used in trauma situations to safely remove swollen rings from fingers.", bullets: ["Chrome plated", "Safety lever", "Replaceable saw blade"], image: { src: "https://images.unsplash.com/photo-1611078731307-e54e4bb25032?auto=format&fit=crop&w=600&q=80", alt: "Ring Cutter" } },
  { id: "tool-08", name: "Aluminum Oxygen Key", category: "Tools", sku: "TOL-KEY-08", price: 8, stock_level: 600, description: "Essential universal key for opening D and E size oxygen cylinders.", bullets: ["Built-in pocket clip", "Anodized aluminum", "Slotted design"], image: { src: "https://images.unsplash.com/photo-1584820927503-4f9977f6b92a?auto=format&fit=crop&w=600&q=80", alt: "Oxygen Key" } },
  { id: "tool-09", name: "Tactical Headlamp (400 Lumen)", category: "Tools", sku: "TOL-LMP-09", price: 65, stock_level: 90, description: "Hands-free illumination with white, red, and flashing modes for night operations.", bullets: ["USB Rechargeable", "Helmet compatible", "Waterproof IPX7"], image: { src: "https://images.unsplash.com/photo-1550147661-39575e0ee37e?auto=format&fit=crop&w=600&q=80", alt: "Headlamp" } },
  { id: "tool-10", name: "Digital Tympanic Thermometer", category: "Tools", sku: "TOL-TMP-10", price: 49, stock_level: 130, description: "Rapid 1-second infrared ear thermometer with hygienic probe covers.", bullets: ["Memory recall", "Fever alarm", "20 covers included"], image: { src: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80", alt: "Thermometer" } }
];

const DEFAULT_BULLETS = [
  "Field-ready construction",
  "Professional-grade materials",
  "Trusted by EMS teams"
];

let PRODUCT_MAP = {};

function rebuildProductMap() {
  PRODUCT_MAP = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
}

rebuildProductMap();

let activeCategory = "All";
let lastChangedProductId = null;

/* ---------- HELPERS ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const money = (n) => (parseFloat(n) || 0).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const safeText = (val) => String(val ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function normalizeProduct(dbProduct) {
  if (!dbProduct) return null;
  const price = Number(dbProduct.price) || 0;
  return {
    id: dbProduct.id,
    name: dbProduct.name || "Unnamed Product",
    category: dbProduct.category || "Uncategorized",
    sku: dbProduct.sku || `SKU-${dbProduct.id}`,
    price,
    badge: dbProduct.badge || "",
    stock_level: Number(dbProduct.stock_level ?? 0),
    description: dbProduct.description || "Field-ready gear built for real-world EMS demands.",
    bullets: Array.isArray(dbProduct.bullets) && dbProduct.bullets.length ? dbProduct.bullets : DEFAULT_BULLETS,
    image: {
      src: dbProduct.image_url || "https://placehold.co/600x400/572403/ffd977?text=EMS+Gear",
      alt: dbProduct.name || "EMS product"
    }
  };
}

/* ---------- RENDER ENGINE ---------- */
function productCardHTML(p) {
  return `
    <article class="card">
      <div class="card-top">
        <img src="${p.image.src}" alt="${safeText(p.name)}" class="product-img" loading="lazy">
        <div class="tag">${safeText(p.category)}</div>
      </div>
      <div class="card-inner">
        <h3 class="card-title">${safeText(p.name)}</h3>
        <p class="card-text">${safeText(p.description.substring(0, 75))}...</p>
        <div class="price-row">
          <div class="price">${money(p.price)}</div>
          <div class="sku-small">Stock: ${p.stock_level}</div>
        </div>
        <div class="card-actions">
          <button type="button" class="btn secondary" onclick="openProductModal('${p.id}')">Details</button>
          <button type="button" class="btn" onclick="addToCart('${p.id}', 1)">Add</button>
        </div>
      </div>
    </article>
  `;
}

function renderGrids(filter = "All") {
  activeCategory = filter;
  const unified = $("#unifiedShopGrid");
  const home = $("#productGrid");
  const steth = $("#stethGrid");

  if (unified) {
    const filtered = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
    unified.innerHTML = filtered.map(productCardHTML).join("");
  }
  if (home) home.innerHTML = PRODUCTS.slice(0, 6).map(productCardHTML).join("");
  if (steth) steth.innerHTML = PRODUCTS.filter(p => p.category === "Stethoscopes").map(productCardHTML).join("");
}

function resolveApiBase() {
  const PROD_API_BASE = "https://fin-ems-backend.onrender.com/api";
  const FRONTEND_HOSTS = new Set(["fin-ems-frontend.onrender.com"]);
  if (window.EMS_API_BASE) return window.EMS_API_BASE;
  const origin = window.location?.origin;
  if (origin && origin.startsWith("http")) {
    const host = window.location?.host;
    if (host && FRONTEND_HOSTS.has(host)) {
      return PROD_API_BASE;
    }
    const isLocal = /localhost|127\.0\.0\.1/.test(origin);
    const port = window.location?.port;
    if (isLocal && port && port !== "3000" && port !== "4000") {
      return "http://localhost:4000/api";
    }
    return `${origin}/api`;
  }
  return "http://localhost:4000/api";
}

async function hydrateProducts() {
  let data = null;

  if (typeof window.getProductsFromDB === "function") {
    data = await window.getProductsFromDB();
  } else {
    try {
      const res = await fetch(`${resolveApiBase()}/products`);
      if (res.ok) data = await res.json();
    } catch (err) {
      data = null;
    }
  }

  if (Array.isArray(data) && data.length) {
    PRODUCTS = data.map(normalizeProduct).filter(Boolean);
    rebuildProductMap();
    renderGrids(activeCategory);
    updateCartBadge({ cleanUnknown: true });
    renderCart({ cleanUnknown: true });
  }
}

/* ---------- THEME SYSTEM ---------- */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeUI(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeUI(next);
}

function updateThemeUI(theme) {
  const icon = $("#themeIcon");
  const text = $("#themeText");
  if (icon) icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  if (text) text.textContent = theme === "dark" ? "Light" : "Dark";
}

/* ---------- CART ENGINE ---------- */
function normalizeCart(cart) {
  if (!cart || typeof cart !== "object" || Array.isArray(cart)) return {};

  return Object.fromEntries(
    Object.entries(cart)
      .map(([id, qty]) => [String(id), parseInt(qty, 10)])
      .filter(([id, qty]) => id && Number.isFinite(qty) && qty > 0)
  );
}

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const normalized = normalizeCart(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (err) {
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCart(cart)));
}

function filterCartToKnownProducts(cart) {
  return Object.fromEntries(
    Object.entries(cart).filter(([id]) => Boolean(PRODUCT_MAP[id]))
  );
}

function updateCartBadge(options = {}) {
  const cart = options.cleanUnknown ? filterCartToKnownProducts(loadCart()) : loadCart();
  if (options.cleanUnknown) saveCart(cart);
  const count = Object.values(cart).reduce((sum, q) => sum + (parseInt(q, 10) || 0), 0);
  const badge = $("#cartBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

function addToCart(productId, quantity = 1) {
  const cart = loadCart();
  cart[productId] = (parseInt(cart[productId], 10) || 0) + quantity;
  saveCart(cart);
  updateCartBadge();
  renderCart();
  showNotification("Item added to cart", "success");
}

function renderCart(options = {}) {
  const body = $("#cartItems");
  const totalEl = $("#cartTotal");
  const checkoutBtn = $("#checkoutBtn");
  if (!body || !totalEl) return;

  const cart = options.cleanUnknown ? filterCartToKnownProducts(loadCart()) : loadCart();
  if (options.cleanUnknown) saveCart(cart);
  const entries = Object.entries(cart);

  if (!entries.length) {
    body.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-bag-shopping"></i>
        <div class="empty-cart-title">Your cart is empty</div>
        <div class="empty-cart-sub">Add field gear to start checkout.</div>
      </div>
    `;
    totalEl.textContent = money(0);
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.setAttribute("aria-disabled", "true");
    }
    return;
  }

  let total = 0;
  body.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCT_MAP[id];
    if (!p) return "";
    total += (p.price * qty);
    const lineTotal = p.price * qty;
    const highlightClass = id === lastChangedProductId ? " cart-item-pulse" : "";
    return `
      <div class="cart-item${highlightClass}" data-cart-id="${id}">
        <img src="${p.image?.src || 'https://placehold.co/200x200/572403/ffd977?text=EMS'}" alt="${safeText(p.name)}" class="cart-item-img">
        <div class="cart-item-main">
          <div class="cart-item-top">
            <div class="cart-item-title">${safeText(p.name)}</div>
            <div class="cart-item-total">${money(lineTotal)}</div>
          </div>
          <div class="cart-item-meta">
            <span class="cart-item-price">${money(p.price)}</span>
            <span class="cart-item-sku">${safeText(p.sku)}</span>
          </div>
          <div class="cart-item-controls">
            <button onclick="changeCartQty('${p.id}', -1)" class="qty-btn" aria-label="Decrease quantity">−</button>
            <span class="qty-count">${qty}</span>
            <button onclick="changeCartQty('${p.id}', 1)" class="qty-btn" aria-label="Increase quantity">+</button>
            <button onclick="removeFromCart('${p.id}')" class="remove-btn" aria-label="Remove item">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (lastChangedProductId) {
    const el = body.querySelector(`[data-cart-id="${lastChangedProductId}"]`);
    if (el) {
      setTimeout(() => {
        el.classList.remove("cart-item-pulse");
      }, 350);
    }
    lastChangedProductId = null;
  }
  totalEl.textContent = money(total);
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.removeAttribute("aria-disabled");
  }
}

function changeCartQty(id, delta) {
  const cart = loadCart();
  cart[id] = (parseInt(cart[id], 10) || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  lastChangedProductId = id;
  updateCartBadge();
  renderCart();
}

function removeFromCart(id) {
  const cart = loadCart();
  if (!cart[id]) return;
  delete cart[id];
  saveCart(cart);
  lastChangedProductId = id;
  updateCartBadge();
  renderCart();
}

/* ---------- CHECKOUT ENGINE ---------- */
async function submitOrder(e) {
  if (e) e.preventDefault();
  const cart = loadCart();
  if (Object.keys(cart).length === 0) return showNotification("Cart is empty", "danger");

  const btn = $("#checkoutSubmitBtn");
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
  btn.disabled = true;

  const name = $("#checkoutName")?.value?.trim();
  const email = $("#checkoutEmail")?.value?.trim();
  const phone = $("#checkoutPhone")?.value?.trim();
  const address = $("#checkoutAddress")?.value?.trim();
  const errorEl = $("#checkoutError");

  if (!name || !email || !phone || !address) {
    if (errorEl) errorEl.textContent = "Please complete all checkout fields.";
    btn.innerHTML = originalHtml;
    btn.disabled = false;
    return;
  }

  try {
    const token = window.Auth?.getToken?.();
    const user = window.Auth?.getUser?.();
    const payload = {
      name,
      email,
      phone,
      address,
      items: cart,
      user_id: user?.id || null
    };

    const res = await fetch(`${resolveApiBase()}/checkout/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.url) {
      if (res.status === 401 || res.status === 403) {
        if (errorEl) errorEl.textContent = "Please log in to complete checkout.";
      } else {
        if (errorEl) errorEl.textContent = data.error || data.message || "Checkout failed. Please try again.";
      }
      return;
    }

    if (errorEl) errorEl.textContent = "";
    window.location.href = data.url;
  } catch (err) {
    if (errorEl) errorEl.textContent = "Network error. Please try again.";
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

/* ---------- MODALS & INTERACTIVITY ---------- */
function openProductModal(id) {
  const p = PRODUCT_MAP[id];
  if (!p) return;
  $("#modalProductName").textContent = p.name;
  $("#modalProductDescription").textContent = p.description;
  $("#modalProductPrice").textContent = money(p.price);
  $("#modalProductImage").src = p.image.src;
  $("#modalProductSku").textContent = p.sku;
  const badgeEl = $("#modalProductBadge");
  if (badgeEl) {
    badgeEl.textContent = p.badge || "";
    badgeEl.style.display = p.badge ? "inline-flex" : "none";
  }
  $("#modalProductFeatures").innerHTML = (p.bullets || []).map(b => `<li>${safeText(b)}</li>`).join("");
  
  $("#productModal").dataset.productId = id;
  $("#modalBackdrop").classList.add("active");
  document.body.classList.add("no-scroll");
}

function showNotification(msg, type = "success") {
  const n = document.createElement("div");
  n.style.cssText = `position:fixed; bottom:20px; right:20px; background:var(--${type === 'success' ? 'success' : 'danger'}); color:white; padding:12px 24px; border-radius:10px; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-weight:600;`;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

/* ---------- MOBILE NAV ---------- */
function closeMobileMenu() {
  const nav = $("#mainNav");
  const toggle = $("#menuToggle");
  if (!nav || !toggle) return;

  nav.classList.remove("nav-open");
  toggle.setAttribute("aria-expanded", "false");
}

function initMobileMenu() {
  const nav = $("#mainNav");
  const toggle = $("#menuToggle");
  if (!nav || !toggle) return;

  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = !nav.classList.contains("nav-open");
    nav.classList.toggle("nav-open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      closeMobileMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 768 || !nav.classList.contains("nav-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

/* ---------- INIT SYSTEM ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initMobileMenu();
  renderGrids(activeCategory);
  updateCartBadge();
  renderCart();
  await hydrateProducts();

  // Category Filter Wiring
  const filterBtns = $$(".cat-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      renderGrids(e.target.dataset.category);
    });
  });

  // Modal Closers
  $("#modalClose")?.addEventListener("click", () => { $("#modalBackdrop").classList.remove("active"); document.body.classList.remove("no-scroll"); });
  $("#cartClose")?.addEventListener("click", () => { $("#cartDrawer").classList.remove("open"); $("#cartOverlay").style.display = "none"; });
  $("#checkoutClose")?.addEventListener("click", () => { $("#checkoutModal").classList.remove("active"); });

  // Button Wiring
  $("#themeToggle")?.addEventListener("click", toggleTheme);
  $("#cartBtn")?.addEventListener("click", () => { $("#cartDrawer").classList.add("open"); $("#cartOverlay").style.display = "block"; });
  $("#checkoutBtn")?.addEventListener("click", () => { $("#checkoutModal").classList.add("active"); });
  $("#checkoutForm")?.addEventListener("submit", submitOrder);

  $("#modalAddToCart")?.addEventListener("click", () => {
    addToCart($("#productModal").dataset.productId, 1);
    $("#modalBackdrop").classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
});
