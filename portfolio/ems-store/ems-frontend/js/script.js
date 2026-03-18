/* =========================================
   EMS Luxe Supply – Global script.js
   Shop + Stethoscopes + Trust
   ========================================= */

"use strict";

/* ---------- CONSTANTS ---------- */
const STORAGE_KEY = "ems_store_cart_v1";
const THEME_KEY = "ems_theme_preference";

/* ---------- PRODUCT DATA ---------- */
const PRODUCTS = [
  // ====== STETHOSCOPES ======
  {
    id: "steth-littmann-classic",
    name: "Classic Acoustic Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-CLASSIC",
    price: 109,
    badge: "Best for Students",
    filters: ["all", "students", "comfort"],
    description:
      "Everyday acoustic performance for EMTs and students. Tunable diaphragm, reliable build, and field-ready comfort.",
    bullets: [
      "Dual-head chestpiece with tunable diaphragm",
      "Latex-free, durable tubing",
      "Soft-seal ear tips for comfort",
      "5-year manufacturer warranty"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1348004602/photo/red-medical-stethoscope-and-bell-on-red-background-medical-service-appointment.jpg?s=612x612&w=0&k=20&c=-iVDAO5BXJotqwTJ5gXkpD7y-gBMph7CCHCEHymjj8M=",
      alt: "Stethoscope lying beside medical textbooks and study materials",
      title: "Student-ready classic stethoscope"
    }
  },
  {
    id: "steth-electronic",
    name: "Electronic Noise-Reducing Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-ELECTRO",
    price: 289,
    badge: "Best in Loud Environments",
    filters: ["all", "loud"],
    description:
      "Electronic stethoscope with active noise reduction to cut through sirens and engine noise in the field.",
    bullets: [
      "Active ambient-noise suppression",
      "Up to 40× sound amplification",
      "Four volume profiles tuned for loud rigs",
      "Protective field case included"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1285018002/photo/diabetic-measurement-tools-and-insulin-pen-on-table.jpg?s=612x612&w=0&k=20&c=bz1-Y413zzoyTFM4Rd6qQJcTOzeWyCGJVRAXqE5DwS0=",
      alt: "Interior of an EMS helicopter with medical equipment",
      title: "Stethoscope tuned for loud EMS environments"
    }
  },
  {
    id: "steth-cardiology-pro",
    name: "Cardiology Pro Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-CARDIO",
    price: 199,
    badge: "Premium",
    filters: ["all", "comfort"],
    description:
      "Advanced stethoscope designed for detailed cardiac assessment. Superior acoustics with lightweight, ergonomic design.",
    bullets: [
      "Advanced dual-frequency tuning system",
      "Precision-crafted diaphragm for clear heart sounds",
      "Extra-soft silicone ear tips",
      "Lifetime quality guarantee"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1091130498/photo/pulse-trace-and-stethoscope.jpg?s=612x612&w=0&k=20&c=MEtVyeQZQauAP4jYgto1V2FUPimEqVI3jQFGaFpgc3g=",
      alt: "Premium stethoscope on medical surface",
      title: "Cardiology professional stethoscope"
    }
  },
  {
    id: "steth-universal-pro",
    name: "Universal Pro Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-UNIVERSAL",
    price: 149,
    badge: "Versatile",
    filters: ["all", "students", "loud", "comfort"],
    description:
      "All-purpose stethoscope for any environment. Balanced acoustics, durability, and comfort for extended use.",
    bullets: [
      "Universal diaphragm compatible",
      "Reinforced Y-tube construction",
      "Color-coded tubing for organization",
      "10-year manufacturer warranty"
    ],
    image: {
      src: "https://media.istockphoto.com/id/474219539/photo/digital-tablet-and-stethoscope-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=w4ZFdM-2RsYp_9VpsYPJojIFmQafrIUQQdrJWeq771g=",
      alt: "Professional multi-use stethoscope",
      title: "Universal pro stethoscope"
    }
  },
  {
    id: "steth-lightweight-student",
    name: "Lightweight Student Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-STUDENT",
    price: 69,
    badge: "Budget Pick",
    filters: ["all", "students"],
    description:
      "Affordable, lightweight stethoscope ideal for skills labs, clinicals, and early ride-alongs.",
    bullets: [
      "Lightweight aluminum chestpiece",
      "Comfortable PVC tubing",
      "Color options for student cohorts",
      "1-year limited warranty"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1155553594/photo/a-female-healthcare-professional-taking-a-reading-using-a-stethoscope-and-carefully-listening.jpg?s=612x612&w=0&k=20&c=dEBySxJgDiPdphMWzCH9rgnrXa4q8SKmRYK2v_BCrKY=",
      alt: "Blue lightweight stethoscope on clipboard",
      title: "Lightweight student stethoscope"
    }
  },
  {
    id: "steth-rig-duty",
    name: "Rig-Duty Hybrid Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-RIG",
    price: 159,
    badge: "Rig Favorite",
    filters: ["all", "loud", "comfort"],
    description:
      "Hybrid acoustic design tuned for use in ambulances and helicopters with improved isolation.",
    bullets: [
      "Angled headset for secure fit while moving",
      "Thicker acoustic tubing to block exterior noise",
      "Reinforced yoke for long-term durability",
      "Includes spare ear tips and ID tag"
    ],
    image: {
      src: "https://media.istockphoto.com/id/183361669/photo/botanist-examining-a-plant.jpg?s=612x612&w=0&k=20&c=JYXx6eMuY_sbB73XJ92ae27t1xiUr2E0d31HKFy3BTY=",
      alt: "Stethoscope hanging in an ambulance",
      title: "Rig-duty hybrid stethoscope"
    }
  },

  // ====== KITS (5+) ======
  {
    id: "kit-student-starter",
    name: "EMT / Paramedic Student Starter Kit",
    category: "Kits",
    sku: "EMS-KIT-STUDENT",
    price: 59,
    badge: "Student Bundle",
    filters: ["all"],
    description:
      "Starter kit aligned with EMT and paramedic coursework: shears, penlight, tape, pupil gauge, and pocket tools.",
    bullets: [
      "Built around NREMT skills checklists",
      "Includes trauma shears and penlight",
      "Compact belt-ready pouch",
      "Ideal for labs and ride-alongs"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1200&q=80",
      alt: "Medical kit with stethoscope, scissors, and diagnostic tools",
      title: "Complete student starter kit for EMT training"
    }
  },
  {
    id: "pack-response-backpack",
    name: "Rapid Response Jump Backpack",
    category: "Kits",
    sku: "EMS-PACK-JUMP",
    price: 189,
    badge: "Agency Favorite",
    filters: ["all"],
    description:
      "Modular EMS backpack with internal organizers for airways, IV, and trauma gear. Built for first-due rigs.",
    bullets: [
      "High-visibility reflective trim",
      "MOLLE webbing and side handles",
      "Internal color-coded dividers",
      "Abrasion-resistant base panel"
    ],
    image: {
      src: "https://media.istockphoto.com/id/2248428896/photo/extra-large-tactical-sanitary-rescue-backpack.jpg?s=612x612&w=0&k=20&c=qqvxOP4Z4b45cXwFon5UzxU5FVBoZIOl8GAmTGgUTgQ=",
      alt: "Red EMS trauma backpack on station floor",
      title: "Rapid response EMS backpack"
    }
  },
  {
    id: "kit-als-airway-roll",
    name: "ALS Airway Roll Kit",
    category: "Kits",
    sku: "EMS-KIT-ALS-AIRWAY",
    price: 129,
    badge: "ALS Ready",
    filters: ["all"],
    description:
      "Roll-out airway kit with compartments for BVM, OPAs, NPAs, supraglottic devices, and adjuncts.",
    bullets: [
      "Roll design with labeled airway pockets",
      "High-visibility interior for night calls",
      "Wipe-clean, fluid-resistant materials",
      "Fits inside standard jump bags"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1461631711/photo/screwdriver-with-replaceable-bits.jpg?s=612x612&w=0&k=20&c=K38pvGYuY1rFSrUmmIpUoH1Nz3LiKTW00rAuMiZ6DPA=",
      alt: "Airway management tools in a rolled EMS kit",
      title: "ALS airway roll kit"
    }
  },
  {
    id: "kit-mci-triage",
    name: "MCI Triage & Tag Kit",
    category: "Kits",
    sku: "EMS-KIT-MCI",
    price: 149,
    badge: "Incident Command",
    filters: ["all"],
    description:
      "Mass-casualty triage kit with tags, tape, and tools for rapid START/JumpSTART triage.",
    bullets: [
      "Includes 100 color-coded triage tags",
      "Pre-printed incident command checklists",
      "High-visibility carry pouch",
      "Ideal for drills and real incidents"
    ],
    image: {
      src: "https://media.istockphoto.com/id/952119162/photo/medical-supplies.jpg?s=612x612&w=0&k=20&c=FFQiImGoXIZFd_5o7e46TBXzPKgIL-vPo42yO2JLaEM=", 
      alt: "Triage equipment laid out on the ground",
      title: "Mass casualty triage kit"
    }
  },
  {
    id: "kit-clinic-diagnostic",
    name: "Clinic Diagnostic Kit",
    category: "Kits",
    sku: "EMS-KIT-CLINIC",
    price: 99,
    badge: "Station Essential",
    filters: ["all"],
    description:
      "Station-side diagnostic kit with BP cuff, otoscope, reflex hammer, and thermometer case.",
    bullets: [
      "Adult and large adult BP cuffs included",
      "LED otoscope with spare specula",
      "Reflex hammer and digital thermometer",
      "Rigid carry case with foam insert"
    ],
    image: {
      src: "https://media.istockphoto.com/id/477984136/vector/first-aid-kit.jpg?s=612x612&w=0&k=20&c=zfKTAwJ6RVhOpvMGKOeTJ6_GyYDXOjwUBNxNZ_17Q1M=",
      alt: "Diagnostic instruments arranged in a kit",
      title: "Clinic diagnostic kit"
    }
  },

  // ====== APPAREL ======
    // ====== APPAREL ======
  {
    id: "pants-5in1-tactical",
    name: "5-in-1 Tactical EMS Pants",
    category: "Apparel",
    sku: "EMS-PANTS-5IN1",
    price: 79,
    badge: "New Arrival",
    filters: ["all"],
    description:
      "Reinforced tactical pants with shears, radio, and glove pockets. Built for long shifts and rough calls.",
    bullets: [
      "Ripstop fabric with DWR coating",
      "Reinforced knees and seat",
      "Dedicated shears & radio pockets",
      "Wrinkle-resistant, machine washable"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1446081026/photo/a-soldier-a-tactical-medic-opens-a-first-aid-kit-close-up-view.jpg?s=612x612&w=0&k=20&c=ed__scBcEWjLPggF2hnjRVDXZpfWGvISYyAocMTH2ho=",
      alt: "Dark tactical pants hanging on a clothing rack",
      title: "5-in-1 tactical EMS pants"
    }
  },
  {
    id: "pants-milspec-cargo",
    name: "Mil‑Spec 8‑Pocket Cargo Pants",
    category: "Apparel",
    sku: "EMS-PANTS-MILSPEC",
    price: 89,
    badge: "High Capacity",
    filters: ["all"],
    description:
      "Military-inspired EMS pants with 8 functional pockets for shears, gloves, markers, and diagnostic tools.",
    bullets: [
      "8 total pockets including dual cargo and phone slots",
      "Bartacked stress points for durability",
      "Adjustable waist tabs for in‑rig comfort",
      "Fade-resistant mil‑spec fabric blend"
    ],
    image: {
      src: "https://media.istockphoto.com/id/173559155/photo/casual-wear.jpg?s=612x612&w=0&k=20&c=d7EmtBKQfdigGXe-JA-IYFk5lIkpYxJTqX7Fs-hX7cI=",
      alt: "Olive green cargo pants folded on a bench",
      title: "Mil-spec multi-pocket EMS cargo pants"
    }
  },
  {
    id: "pants-rugged-rig",
    name: "Rugged Rig Cargo Pants",
    category: "Apparel",
    sku: "EMS-PANTS-RIG",
    price: 99,
    badge: "Field Proven",
    filters: ["all"],
    description:
      "Heavy-duty, rig-ready pants with reinforced seams and 7 multi-depth pockets for tools and supplies.",
    bullets: [
      "7 pockets sized for radios, gloves, and pens",
      "Triple-stitched seams in high-wear zones",
      "Articulated knees for easier kneeling and climbing",
      "Moisture-wicking inner waistband for long shifts"
    ],
    image: {
      src: "https://media.istockphoto.com/id/618546958/photo/man-climbing-a-ladder.jpg?s=612x612&w=0&k=20&c=CsdimmNLuDJzj45k_n0R2_7ekO1hhAmh-6ffpywAHls=",
      alt: "Dark work pants with multiple pockets",
      title: "Rugged multi-pocket rig pants"
    }
  },
  {
    id: "pants-lightweight-duty",
    name: "Lightweight Duty BDU Pants",
    category: "Apparel",
    sku: "EMS-PANTS-LW-BDU",
    price: 69,
    badge: "Summer Shift",
    filters: ["all"],
    description:
      "Breathable, lightweight BDU‑style pants with 6 pockets, ideal for hot climates and busy summer shifts.",
    bullets: [
      "6-pocket BDU layout with cargo and back pockets",
      "Lightweight weave for improved airflow",
      "Drawstring cuffs for secure fit over boots",
      "Colorfast fabric that resists fading and stains"
    ],
    image: {
      src: "https://media.istockphoto.com/id/468832278/photo/police-officer-using-speed-gun.jpg?s=612x612&w=0&k=20&c=Nuiy1KxfdmmhjQPMmWU3RG0urhSafAdpcWKV8-5jQNk=",
      alt: "Lightweight tactical pants hanging on a rack",
      title: "Lightweight EMS duty BDU pants"
    }
  },
  {
    id: "pants-winter-softshell",
    name: "Winter Softshell EMS Pants",
    category: "Apparel",
    sku: "EMS-PANTS-WINTER",
    price: 119,
    badge: "Cold Weather",
    filters: ["all"],
    description:
      "Fleece-lined softshell EMS pants with 5 zipped pockets to secure gear during cold, wet calls.",
    bullets: [
      "Softshell exterior with DWR water resistance",
      "Fleece lining for thermal insulation",
      "5 zipped pockets to secure gear in snow and rain",
      "Gusseted crotch for unrestricted movement"
    ],
    image: {
      src: "https://media.istockphoto.com/id/91099607/photo/snowshoeing-adventure.jpg?s=612x612&w=0&k=20&c=sBvSoB8t0AVFxU7Dc_mxO76NNSzBM8zEv14zT2FNW1Q=",
      alt: "Softshell winter pants with multiple zip pockets",
      title: "Fleece-lined winter EMS pants"
    }
  },
  {
    id: "shorts-cargo-duty",
    name: "Cargo Duty Shorts (Station Use)",
    category: "Apparel",
    sku: "EMS-SHORTS-CARGO",
    price: 54,
    badge: "Station Wear",
    filters: ["all"],
    description:
      "Multi-pocket duty shorts for station and training days, with 6 pockets and reinforced seat.",
    bullets: [
      "6 pockets including dual cargo and utility slots",
      "Reinforced seat panel for long bench sitting",
      "Belt loops sized for duty belts",
      "Quick-dry fabric ideal for hot weather drills"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1430594504/photo/mens-shorts-isolated.jpg?s=612x612&w=0&k=20&c=IvJ9va1uC8CptZpBzWja3IGTq3_gbaUpTRNd9yK5AOY=",
      alt: "Cargo shorts with multiple pockets on a wood surface",
      title: "Multi-pocket cargo duty shorts"
    }
  },

  // ====== TOOLS (5+) ======
  {
    id: "tool-shears-ballistic",
    name: "Ballistic-Rated Trauma Shears",
    category: "Tools",
    sku: "EMS-TOOL-SHEARS",
    price: 19,
    badge: "Essential Tool",
    filters: ["all"],
    description:
      "Hardened trauma shears designed to cut denim, leather, and seatbelts without losing edge.",
    bullets: [
      "Tungsten-carbide serrated edge",
      "Blunt safety tip for patient protection",
      "Non-slip grip handles",
      "Lifetime replacement warranty"
    ],
    image: {
      src: "https://media.istockphoto.com/id/2238279585/photo/creative-contemporary-collage-scissors-cutting-chain-link-symbolizing-fragile-rebellion-and.jpg?s=612x612&w=0&k=20&c=2Aqc_dpf4ILAibYLjSME0esv1qiP5KHI_KxNiQCWxKk=",
      alt: "Black and teal trauma shears on orange background",
      title: "Ballistic-rated trauma shears"
    }
  },
  {
    id: "tool-rescue-multitool",
    name: "Responder Rescue Multitool",
    category: "Tools",
    sku: "EMS-TOOL-MULTI",
    price: 49,
    badge: "Multi-Function",
    filters: ["all"],
    description:
      "Folding rescue multitool with seatbelt cutter, oxygen key, glass punch, and utility blade.",
    bullets: [
      "Integrated seatbelt cutter and window punch",
      "Oxygen tank wrench built into handle",
      "One-hand opening design with pocket clip",
      "Stainless steel construction with textured grip"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1452469768/photo/disaster-supply-kit-for-earthquake-on-black-wooden-table-flat-lay.jpg?s=612x612&w=0&k=20&c=ql1dRG2j9HvOw5w9q6UIX7EZK7gbiMkJPMlMsd8X_rg=",
      alt: "Rescue multitool on dark surface",
      title: "Responder rescue multitool"
    }
  },
  {
    id: "tool-window-punch",
    name: "Spring-Loaded Window Punch",
    category: "Tools",
    sku: "EMS-TOOL-PUNCH",
    price: 15,
    badge: "Extrication",
    filters: ["all"],
    description:
      "One-handed, spring-loaded center punch for rapid tempered glass access during vehicle extrication.",
    bullets: [
      "One-hand thumb activation",
      "Hardened steel tip for tempered glass",
      "Pocket clip and lanyard hole",
      "Tested for thousands of activations"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1273900646/photo/new-awl-with-red-handle-cut-out-on-the-hand.jpg?s=612x612&w=0&k=20&c=xzIRaXhpEfO9XOaTYkvLmYzteIut0GnLBalwwhxcT1M=",
      alt: "Rescue tool placed on car dashboard",
      title: "Spring-loaded window punch"
    }
  },
  {
    id: "tool-penlight-led",
    name: "LED Pupil Penlight",
    category: "Tools",
    sku: "EMS-TOOL-PENLIGHT",
    price: 12,
    badge: "Neuro Exam",
    filters: ["all"],
    description:
      "Aluminum penlight with pupil gauge printing for neuro checks and general assessments.",
    bullets: [
      "Warm-white LED optimized for pupil exams",
      "Pupil gauge printed on barrel",
      "Metal pocket clip with click tail switch",
      "Includes reusable batteries"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1180949169/photo/led-metal-tactical-flashlight-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=fe-Hx91mniEXNBxglMfqZPa3BflSN_D2DSZhDIFNQO8=",
      alt: "LED penlight on a notebook",
      title: "EMS LED pupil penlight"
    }
  },
  {
    id: "tool-tourniquet-combat",
    name: "Combat-Ready Tourniquet",
    category: "Tools",
    sku: "EMS-TOOL-TQ",
    price: 35,
    badge: "Bleeding Control",
    filters: ["all"],
    description:
      "Windlass-style tourniquet with time label for rapid extremity hemorrhage control.",
    bullets: [
      "Hook-and-loop strap with single-routing buckle",
      "Textured windlass rod for gloved grip",
      "Time label for application documentation",
      "Vacuum-packed, compact profile"
    ],
    image: {
      src: "https://media.istockphoto.com/id/1130302444/photo/person-in-black-medical-gloves-applies-the-tourniquet-to-his-hand-to-prevent-bleeding-during.jpg?s=612x612&w=0&k=20&c=9GHA2jpOwj7dKZlwmetKcYEFi42Fv1m4B8N8D5hW75A=",
      alt: "Tourniquet and trauma supplies on table",
      title: "Combat-ready tourniquet"
    }
  }
];


const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

/* ---------- HELPERS ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const money = (n) =>
  (parseFloat(n) || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

/* ---------- THEME (DAY / NIGHT) ---------- */

function initTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeUI(theme);
  } catch (err) {
    console.warn("Theme init failed:", err);
  }
}

function toggleTheme() {
  try {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeUI(next);
  } catch (err) {
    console.error("Theme toggle failed:", err);
  }
}

function updateThemeUI(theme) {
  const icon = $("#themeIcon");
  const text = $("#themeText");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  if (text) {
    text.textContent = theme === "dark" ? "Light" : "Dark";
  }
}

/* ---------- CART STORAGE ---------- */

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.warn("Cart load failed:", err);
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Cart save failed:", err);
  }
}

function cartCount(cart) {
  return Object.values(cart).reduce((sum, q) => sum + (parseInt(q, 10) || 0), 0);
}

function cartTotal(cart) {
  return Object.entries(cart).reduce((total, [id, qty]) => {
    const p = PRODUCT_MAP[id];
    return p ? total + p.price * (parseInt(qty, 10) || 0) : total;
  }, 0);
}

/* ---------- NOTIFICATIONS ---------- */

function showNotification(message, type = "success") {
  try {
    $$(".notification").forEach((n) => n.remove());

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");
    notification.innerHTML = `
      <i class="fa-solid ${
        type === "success"
          ? "fa-check-circle"
          : type === "error"
          ? "fa-exclamation-circle"
          : "fa-info-circle"
      }" aria-hidden="true"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  } catch (err) {
    console.error("Notification failed:", err);
  }
}

/* ---------- CART OPERATIONS ---------- */

function updateCartBadge() {
  try {
    const badge = $("#cartBadge");
    if (!badge) return;
    const count = cartCount(loadCart());
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  } catch (err) {
    console.warn("Cart badge update failed:", err);
  }
}

function addToCart(productId, quantity = 1) {
  try {
    const product = PRODUCT_MAP[productId];
    if (!product) {
      showNotification("Product not found", "error");
      return;
    }
    const cart = loadCart();
    cart[productId] = (parseInt(cart[productId], 10) || 0) + quantity;
    saveCart(cart);
    updateCartBadge();
    showNotification(`${product.name} added to cart`, "success");
  } catch (err) {
    console.error("Add to cart failed:", err);
    showNotification("Error adding to cart", "error");
  }
}

function removeFromCart(productId) {
  try {
    const cart = loadCart();
    const product = PRODUCT_MAP[productId];
    delete cart[productId];
    saveCart(cart);
    updateCartBadge();
    renderCart();
    if (product) {
      showNotification(`${product.name} removed`, "info");
    }
  } catch (err) {
    console.error("Remove from cart failed:", err);
  }
}

function changeCartQty(productId, delta) {
  try {
    const cart = loadCart();
    if (!cart[productId]) return;
    cart[productId] = (parseInt(cart[productId], 10) || 0) + delta;
    if (cart[productId] <= 0) delete cart[productId];
    saveCart(cart);
    updateCartBadge();
    renderCart();
  } catch (err) {
    console.error("Change cart quantity failed:", err);
  }
}

/* ---------- CART RENDERING ---------- */

function renderCart() {
  try {
    const body = $("#cartItems");
    const totalEl = $("#cartTotal");
    if (!body || !totalEl) return;

    const cart = loadCart();
    const entries = Object.entries(cart);

    if (!entries.length) {
      body.innerHTML = `
        <div class="empty-cart">
          <i class="fa-solid fa-cart-shopping"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      totalEl.textContent = money(0);
      return;
    }

    body.innerHTML = entries
      .map(([id, qty]) => {
        const p = PRODUCT_MAP[id];
        if (!p) return "";
        const img = p.image?.src || "https://placehold.co/100x100/572403/ffd977?text=EMS";
        const alt = p.image?.alt || p.name;
        return `
          <div class="cart-item">
            <img src="${img}" alt="${alt}" loading="lazy" width="90" height="90">
            <div style="flex: 1;">
              <div class="cart-item-title">${p.name}</div>
              <div class="cart-item-price">${money(p.price)}</div>
              <div class="cart-item-quantity">
                <button onclick="changeCartQty('${id}', -1)" aria-label="Decrease quantity">−</button>
                <span>${qty}</span>
                <button onclick="changeCartQty('${id}', 1)" aria-label="Increase quantity">+</button>
                <button class="cart-item-remove" onclick="removeFromCart('${id}')" aria-label="Remove ${p.name}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    totalEl.textContent = money(cartTotal(cart));
  } catch (err) {
    console.error("Render cart failed:", err);
  }
}

/* ---------- CART OPEN/CLOSE (overlay + drawer) ---------- */

function toggleCart() {
  try {
    const overlay = document.getElementById("cartOverlay"); // from HTML
    const drawer  = document.getElementById("cartDrawer");
    if (!overlay || !drawer) {
      console.warn("Cart elements not found (cartOverlay/cartDrawer).");
      return;
    }

    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      drawer.classList.remove("open");
      overlay.style.display = "none";
      document.body.classList.remove("no-scroll");
    } else {
      renderCart(); // refresh items each time it opens
      drawer.classList.add("open");
      overlay.style.display = "block";
      document.body.classList.add("no-scroll");
    }
  } catch (err) {
    console.error("Toggle cart failed:", err);
  }
}

// Backwards compatibility if something still calls openCart/closeCart
function openCart()  { toggleCart(); }
function closeCart() { toggleCart(); }


/* ---------- PRODUCT MODAL ---------- */

function openProductModal(productId) {
  try {
    const p = PRODUCT_MAP[productId];
    if (!p) {
      showNotification("Product not found", "error");
      return;
    }

    const modal = $("#productModal");
    const backdrop = $("#modalBackdrop");
    if (!modal || !backdrop) return;

    const imgEl = $("#modalProductImage");
    const nameEl = $("#modalProductName");
    const priceEl = $("#modalProductPrice");
    const skuWrapper = $("#modalProductSku");
    const descEl = $("#modalProductDescription");
    const badgeEl = $("#modalProductBadge");
    const featsEl = $("#modalProductFeatures");

    const imgSrc = p.image?.src || "https://placehold.co/800x600/572403/ffd977?text=EMS";
    const imgAlt = p.image?.alt || p.name;

    if (imgEl) {
      imgEl.src = imgSrc;
      imgEl.alt = imgAlt;
      if (p.image?.title) imgEl.title = p.image.title;
    }
    if (nameEl) nameEl.textContent = p.name;
    if (priceEl) priceEl.textContent = money(p.price);

    if (skuWrapper) {
      if (skuWrapper.tagName === "SPAN") {
        skuWrapper.textContent = p.sku;
      } else {
        skuWrapper.textContent = `SKU: ${p.sku}`;
      }
    }

    if (descEl) descEl.textContent = p.description;

    if (badgeEl) {
      if (p.badge) {
        badgeEl.textContent = p.badge;
        badgeEl.style.display = "inline-block";
      } else {
        badgeEl.style.display = "none";
      }
    }

    if (featsEl) {
      featsEl.innerHTML = p.bullets.map((b) => `<li>${b}</li>`).join("");
    }

    modal.dataset.productId = productId;
    backdrop.classList.add("active");
    document.body.classList.add("no-scroll");
  } catch (err) {
    console.error("Open modal failed:", err);
  }
}

function closeProductModal() {
  try {
    const backdrop = $("#modalBackdrop");
    if (backdrop) backdrop.classList.remove("active");
    document.body.classList.remove("no-scroll");
  } catch (err) {
    console.error("Close modal failed:", err);
  }
}

/* ---------- FILTERING (Stethoscopes page) ---------- */

let currentFilter = "all";

function filterProducts(filterName) {
  try {
    currentFilter = filterName;
    $$(".filter-btn").forEach((btn) => {
      const isActive = btn.dataset.filter === filterName;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });
    renderProducts();
  } catch (err) {
    console.error("Filter products failed:", err);
  }
}

/* ---------- PRODUCT CARD HTML ---------- */

function productCardHTML(p) {
  const shortDesc =
    p.description.length > 130 ? p.description.slice(0, 128) + "…" : p.description;
  const imgSrc = p.image?.src || "https://placehold.co/600x400/572403/ffd977?text=EMS";
  const imgAlt = p.image?.alt || p.name;

  return `
    <article class="card" role="listitem">
      <div class="card-top">
        <img src="${imgSrc}" alt="${imgAlt}" class="product-img" loading="lazy" width="600" height="400">
        <div class="tag">${p.category}</div>
      </div>
      <div class="card-inner">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-text">${shortDesc}</p>
        <ul class="feature-list-compact">
          ${p.bullets.slice(0, 3).map((b) => `<li>${b}</li>`).join("")}
        </ul>
        <div class="price-row">
          <div>
            <div class="price">${money(p.price)}</div>
            <div class="sku-small">${p.sku}</div>
          </div>
          ${p.badge ? `<div class="pill">${p.badge}</div>` : "<div></div>"}
        </div>
        <div class="card-actions">
          <button class="btn secondary" onclick="openProductModal('${p.id}')">
            <i class="fa-solid fa-eye"></i> Details
          </button>
          <button class="btn" onclick="addToCart('${p.id}', 1)">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ---------- PRODUCT RENDERING FOR ALL PAGES ---------- */

function renderProducts() {
  try {
    const homeGrid = $("#productGrid");
    const stethPageGrid = $("#stethGrid");

    const gridStethoscopes = $("#gridStethoscopes");
    const gridKits = $("#gridKits");
    const gridApparel = $("#gridApparel");
    const gridTools = $("#gridTools");

    // SHOP PAGE: category grids
    if (gridStethoscopes || gridKits || gridApparel || gridTools) {
      if (gridStethoscopes) {
        const items = PRODUCTS.filter((p) => p.category === "Stethoscopes");
        gridStethoscopes.innerHTML = items.map(productCardHTML).join("");
      }
      if (gridKits) {
        const items = PRODUCTS.filter((p) => p.category === "Kits");
        gridKits.innerHTML = items.map(productCardHTML).join("");
      }
      if (gridApparel) {
        const items = PRODUCTS.filter((p) => p.category === "Apparel");
        gridApparel.innerHTML = items.map(productCardHTML).join("");
      }
      if (gridTools) {
        const items = PRODUCTS.filter((p) => p.category === "Tools");
        gridTools.innerHTML = items.map(productCardHTML).join("");
      }
      return;
    }

    // STETHOSCOPES PAGE: only stethoscopes + filters
    if (stethPageGrid) {
      const items = PRODUCTS.filter((p) => {
        if (p.category !== "Stethoscopes") return false;
        if (currentFilter === "all") return true;
        return p.filters && p.filters.includes(currentFilter);
      });
      stethPageGrid.innerHTML = items.map(productCardHTML).join("");
      return;
    }

    // HOME PAGE: generic Featured grid
   // HOME PAGE: show ALL products
if (homeGrid) {
  homeGrid.innerHTML = PRODUCTS.map(productCardHTML).join("");
}
  } catch (err) {
    console.error("Render products failed:", err);
  }
}

/* ---------- MOBILE NAV ---------- */

function initMobileNav() {
  try {
    const toggle = $("#menuToggle");
    const nav = $("#mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  } catch (err) {
    console.warn("Mobile nav init failed:", err);
  }
}

/* ---------- INIT ---------- */

function main() {
  try {
    initTheme();
    initMobileNav();
    renderProducts();
    updateCartBadge();

    const themeToggle   = $("#themeToggle");
    const cartBtn       = $("#cartBtn");
    const cartClose     = $("#cartClose");
    const cartOverlay   = $("#cartOverlay"); 
    const modalBackdrop = $("#modalBackdrop");
    const modalClose    = $("#modalClose");
    const modalAdd      = $("#modalAddToCart");
    const checkoutBtn   = $("#checkoutBtn");

    if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
    if (cartBtn)      cartBtn.addEventListener("click", openCart);
    if (cartClose)    cartClose.addEventListener("click", closeCart);
    if (cartOverlay) {
  cartOverlay.addEventListener("click", (e) => {
    // click on dark background closes cart
    if (e.target === cartOverlay) toggleCart();
  });
}
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeProductModal();
      });
    }
    if (modalClose)   modalClose.addEventListener("click", closeProductModal);
    if (modalAdd) {
      modalAdd.addEventListener("click", () => {
        const modal = $("#productModal");
        if (!modal) return;
        const productId = modal.dataset.productId;
        if (!productId) return;
        addToCart(productId, 1);
        closeProductModal();
        setTimeout(openCart, 250);
      });
    }
      if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        const cart = loadCart();
        const total = cartTotal(cart);
        if (total === 0) {
          showNotification("Your cart is empty", "error");
        } else {
          openCheckout();
        }
      });
    }


    // Stethoscope filter buttons
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterProducts(btn.dataset.filter);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeProductModal();
        closeCart();
      }
    });
  } catch (err) {
    console.error("Main init failed:", err);
  }
}



if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
} 

/* ========== EMAIL CHECKOUT (EmailJS) ========== */

const EMAILJS_CONFIG = {
  publicKey:  "N5mzHg4TQmKz_T-1Z",
  serviceId:  "service_gv3zi4q",
  templateId: "template_5lpqoc7"
};

let emailInitialized = false;

function ensureEmailInitialized() {
  if (!emailInitialized) {
    emailjs.init(EMAILJS_CONFIG.publicKey); // EmailJS docs: init once before send [web:181][web:184]
    emailInitialized = true;
  }
}

function setCheckoutError(msg) {
  const box = document.getElementById("checkoutError");
  if (!box) {
    if (msg) showNotification(msg, "error");
    return;
  }
  if (!msg) {
    box.style.display = "none";
    box.textContent = "";
  } else {
    box.style.display = "block";
    box.textContent = msg;
  }
}

// Simple validation: required fields + email/phone format
function validateCheckoutFormSimple() {
  const nameEl    = document.getElementById("checkoutName");
  const emailEl   = document.getElementById("checkoutEmail");
  const phoneEl   = document.getElementById("checkoutPhone");
  const addressEl = document.getElementById("checkoutAddress");

  const name    = nameEl?.value.trim()    || "";
  const email   = emailEl?.value.trim()   || "";
  const phone   = phoneEl?.value.trim()   || "";
  const address = addressEl?.value.trim() || "";

  if (!name)   return setCheckoutError("Please enter your name"), false;
  if (!email)  return setCheckoutError("Please enter your email"), false;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    setCheckoutError("Please enter a valid email address");
    return false;
  }

  if (!phone) {
    setCheckoutError("Please enter your phone number");
    return false;
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    setCheckoutError("Please enter a valid phone number (10+ digits)");
    return false;
  }

  if (!address || address.length < 10) {
    setCheckoutError("Please enter a complete delivery address");
    return false;
  }

  setCheckoutError("");
  return true;
}

// Open checkout modal
function openCheckout() {
  try {
    const cart  = loadCart();
    const total = cartTotal(cart);
    if (!Object.keys(cart).length || total <= 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    const modal = document.getElementById("checkoutModal");
    if (!modal) {
      console.warn("checkoutModal not found in DOM.");
      return;
    }

    // If using display:none style
    modal.style.display = "flex";
    modal.classList.add("active");

    const totalEl = document.getElementById("modalCartTotal") || document.getElementById("checkoutTotal");
    if (totalEl) totalEl.textContent = total.toFixed(2);

    document.body.classList.add("no-scroll");
  } catch (err) {
    console.error("Open checkout failed:", err);
    showNotification("Unable to open checkout", "error");
  }
}

function closeCheckout() {
  try {
    const modal = document.getElementById("checkoutModal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("active");
    }
    document.body.classList.remove("no-scroll");
  } catch (err) {
    console.error("Close checkout failed:", err);
  }
}

async function submitOrder(event) {
  if (event && event.preventDefault) event.preventDefault();

  const cart  = loadCart();
  const total = cartTotal(cart);
  if (!Object.keys(cart).length || total <= 0) {
    showNotification("Your cart is empty", "error");
    return;
  }

  if (!validateCheckoutFormSimple()) return;

  const btn = document.getElementById("checkoutSubmitBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
  }

  const name    = document.getElementById("checkoutName")?.value.trim()    || "";
  const email   = document.getElementById("checkoutEmail")?.value.trim()   || "";
  const phone   = document.getElementById("checkoutPhone")?.value.trim()   || "";
  const address = document.getElementById("checkoutAddress")?.value.trim() || "";

  const orderId = "EMS-" + Date.now();
  const order   = {
    orderId,
    date:   new Date().toISOString(),
    name,
    email,
    phone,
    address,
    items: cart,
    total
  };

  // Save for admin page (ems_orders)
  try {
    const existing = JSON.parse(localStorage.getItem("ems_orders") || "[]");
    existing.push(order);
    localStorage.setItem("ems_orders", JSON.stringify(existing));
  } catch (err) {
    console.error("Saving order failed:", err);
  }

  // Send confirmation email through EmailJS
  try {
    ensureEmailInitialized();

    const itemsText = Object.entries(order.items)
      .map(([id, qty]) => `${PRODUCT_MAP[id]?.name || id} × ${qty}`)
      .join("\n");

    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        customer_name:    order.name,
        customer_email:   order.email,
        customer_phone:   order.phone,
        customer_address: order.address,
        order_id:         order.orderId,
        order_date:       new Date(order.date).toLocaleString("en-IN"),
        order_items:      itemsText || "No item details",
        order_total:      `$${order.total.toFixed(2)}`
      }
    );

    showNotification(`Order ${orderId} confirmed! Email sent.`, "success");
  } catch (err) {
    console.error("EmailJS error:", err);
    showNotification(`Order ${orderId} saved, but email failed.`, "info");
    setCheckoutError("Order saved, but confirmation email could not be sent.");
  }

  // Clear cart + reset UI
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Cart clear failed:", err);
  }
  updateCartBadge();
  renderCart();
  closeCheckout();
  document.getElementById("checkoutForm")?.reset();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Place Order & Send Email';
  }
}
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", submitOrder);
}
