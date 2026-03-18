// ═══ EMS LUXE SUPPLY — COMPLETE PRODUCT MAP ════════════════════════
// All products for cart/checkout across ALL pages

const PRODUCT_MAP = {
  // ====== STETHOSCOPES ======
  "steth-littmann-classic": {
    name: "Classic Acoustic Stethoscope",
    sku: "EMS-STETH-CLASSIC",
    price: 109,
    image: "https://media.istockphoto.com/id/1348004602/photo/red-medical-stethoscope-and-bell-on-red-background-medical-service-appointment.jpg?s=612x612&w=0&k=20&c=-iVDAO5BXJotqwTJ5gXkpD7y-gBMph7CCHCEHymjj8M=",
    category: "Stethoscopes"
  },
  "steth-electronic": {
    name: "Electronic Noise-Reducing Stethoscope",
    sku: "EMS-STETH-ELECTRO",
    price: 289,
    image: "https://media.istockphoto.com/id/1285018002/photo/diabetic-measurement-tools-and-insulin-pen-on-table.jpg?s=612x612&w=0&k=20&c=bz1-Y413zzoyTFM4Rd6qQJcTOzeWyCGJVRAXqE5DwS0=",
    category: "Stethoscopes"
  },
  "steth-cardiology-pro": {
    name: "Cardiology Pro Stethoscope",
    sku: "EMS-STETH-CARDIO",
    price: 199,
    image: "https://media.istockphoto.com/id/1091130498/photo/pulse-trace-and-stethoscope.jpg?s=612x612&w=0&k=20&c=MEtVyeQZQauAP4jYgto1V2FUPimEqVI3jQFGaFpgc3g=",
    category: "Stethoscopes"
  },
  "steth-universal-pro": {
    name: "Universal Pro Stethoscope",
    sku: "EMS-STETH-UNIVERSAL",
    price: 149,
    image: "https://media.istockphoto.com/id/474219539/photo/digital-tablet-and-stethoscope-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=w4ZFdM-2RsYp_9VpsYPJojIFmQafrIUQQdrJWeq771g=",
    category: "Stethoscopes"
  },
  "steth-lightweight-student": {
    name: "Lightweight Student Stethoscope",
    sku: "EMS-STETH-STUDENT",
    price: 69,
    image: "https://media.istockphoto.com/id/1155553594/photo/a-female-healthcare-professional-taking-a-reading-using-a-stethoscope-and-carefully-listening.jpg?s=612x612&w=0&k=20&c=dEBySxJgDiPdphMWzCH9rgnrXa4q8SKmRYK2v_BCrKY=",
    category: "Stethoscopes"
  },
  "steth-rig-duty": {
    name: "Rig-Duty Hybrid Stethoscope",
    sku: "EMS-STETH-RIG",
    price: 159,
    image: "https://media.istockphoto.com/id/183361669/photo/botanist-examining-a-plant.jpg?s=612x612&w=0&k=20&c=JYXx6eMuY_sbB73XJ92ae27t1xiUr2E0d31HKFy3BTY=",
    category: "Stethoscopes"
  },

  // ====== KITS ======
  "kit-student-starter": {
    name: "EMT / Paramedic Student Starter Kit",
    sku: "EMS-KIT-STUDENT",
    price: 59,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1200&q=80",
    category: "Kits"
  },
  "pack-response-backpack": {
    name: "Rapid Response Jump Backpack",
    sku: "EMS-PACK-JUMP",
    price: 189,
    image: "https://media.istockphoto.com/id/2248428896/photo/extra-large-tactical-sanitary-rescue-backpack.jpg?s=612x612&w=0&k=20&c=qqvxOP4Z4b45cXwFon5UzxU5FVBoZIOl8GAmTGgUTgQ=",
    category: "Kits"
  },
  "kit-als-airway-roll": {
    name: "ALS Airway Roll Kit",
    sku: "EMS-KIT-ALS-AIRWAY",
    price: 129,
    image: "https://media.istockphoto.com/id/1461631711/photo/screwdriver-with-replaceable-bits.jpg?s=612x612&w=0&k=20&c=K38pvGYuY1rFSrUmmIpUoH1Nz3LiKTW00rAuMiZ6DPA=",
    category: "Kits"
  },
  "kit-mci-triage": {
    name: "MCI Triage & Tag Kit",
    sku: "EMS-KIT-MCI",
    price: 149,
    image: "https://media.istockphoto.com/id/952119162/photo/medical-supplies.jpg?s=612x612&w=0&k=20&c=FFQiImGoXIZFd_5o7e46TBXzPKgIL-vPo42yO2JLaEM=",
    category: "Kits"
  },
  "kit-clinic-diagnostic": {
    name: "Clinic Diagnostic Kit",
    sku: "EMS-KIT-CLINIC",
    price: 99,
    image: "https://media.istockphoto.com/id/477984136/vector/first-aid-kit.jpg?s=612x612&w=0&k=20&c=zfKTAwJ6RVhOpvMGKOeTJ6_GyYDXOjwUBNxNZ_17Q1M=",
    category: "Kits"
  },

  // ====== APPAREL ======
  "pants-5in1-tactical": {
    name: "5-in-1 Tactical EMS Pants",
    sku: "EMS-PANTS-5IN1",
    price: 79,
    image: "https://media.istockphoto.com/id/1446081026/photo/a-soldier-a-tactical-medic-opens-a-first-aid-kit-close-up-view.jpg?s=612x612&w=0&k=20&c=ed__scBcEWjLPggF2hnjRVDXZpfWGvISYyAocMTH2ho=",
    category: "Apparel"
  },
  "pants-milspec-cargo": {
    name: "Mil‑Spec 8‑Pocket Cargo Pants",
    sku: "EMS-PANTS-MILSPEC",
    price: 89,
    image: "https://media.istockphoto.com/id/173559155/photo/casual-wear.jpg?s=612x612&w=0&k=20&c=d7EmtBKQfdigGXe-JA-IYFk5lIkpYxJTqX7Fs-hX7cI=",
    category: "Apparel"
  },
  "pants-rugged-rig": {
    name: "Rugged Rig Cargo Pants",
    sku: "EMS-PANTS-RIG",
    price: 99,
    image: "https://media.istockphoto.com/id/618546958/photo/man-climbing-a-ladder.jpg?s=612x612&w=0&k=20&c=CsdimmNLuDJzj45k_n0R2_7ekO1hhAmh-6ffpywAHls=",
    category: "Apparel"
  },
  "pants-lightweight-duty": {
    name: "Lightweight Duty BDU Pants",
    sku: "EMS-PANTS-LW-BDU",
    price: 69,
    image: "https://media.istockphoto.com/id/468832278/photo/police-officer-using-speed-gun.jpg?s=612x612&w=0&k=20&c=Nuiy1KxfdmmhjQPMmWU3RG0urhSafAdpcWKV8-5jQNk=",
    category: "Apparel"
  },
  "pants-winter-softshell": {
    name: "Winter Softshell EMS Pants",
    sku: "EMS-PANTS-WINTER",
    price: 119,
    image: "https://media.istockphoto.com/id/91099607/photo/snowshoeing-adventure.jpg?s=612x612&w=0&k=20&c=sBvSoB8t0AVFxU7Dc_mxO76NNSzBM8zEv14zT2FNW1Q=",
    category: "Apparel"
  },
  "shorts-cargo-duty": {
    name: "Cargo Duty Shorts (Station Use)",
    sku: "EMS-SHORTS-CARGO",
    price: 54,
    image: "https://media.istockphoto.com/id/1430594504/photo/mens-shorts-isolated.jpg?s=612x612&w=0&k=20&c=IvJ9va1uC8CptZpBzWja3IGTq3_gbaUpTRNd9yK5AOY=",
    category: "Apparel"
  },

  // ====== TOOLS ======
  "tool-shears-ballistic": {
    name: "Ballistic-Rated Trauma Shears",
    sku: "EMS-TOOL-SHEARS",
    price: 19,
    image: "https://media.istockphoto.com/id/2238279585/photo/creative-contemporary-collage-scissors-cutting-chain-link-symbolizing-fragile-rebellion-and.jpg?s=612x612&w=0&k=20&c=2Aqc_dpf4ILAibYLjSME0esv1qiP5KHI_KxNiQCWxKk=",
    category: "Tools"
  },
  "tool-rescue-multitool": {
    name: "Responder Rescue Multitool",
    sku: "EMS-TOOL-MULTI",
    price: 49,
    image: "https://media.istockphoto.com/id/1452469768/photo/disaster-supply-kit-for-earthquake-on-black-wooden-table-flat-lay.jpg?s=612x612&w=0&k=20&c=ql1dRG2j9HvOw5w9q6UIX7EZK7gbiMkJPMlMsd8X_rg=",
    category: "Tools"
  },
  "tool-window-punch": {
    name: "Spring-Loaded Window Punch",
    sku: "EMS-TOOL-PUNCH",
    price: 15,
    image: "https://media.istockphoto.com/id/1273900646/photo/new-awl-with-red-handle-cut-out-on-the-hand.jpg?s=612x612&w=0&k=20&c=xzIRaXhpEfO9XOaTYkvLmYzteIut0GnLBalwwhxcT1M=",
    category: "Tools"
  },
  "tool-penlight-led": {
    name: "LED Pupil Penlight",
    sku: "EMS-TOOL-PENLIGHT",
    price: 12,
    image: "https://media.istockphoto.com/id/1180949169/photo/led-metal-tactical-flashlight-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=fe-Hx91mniEXNBxglMfqZPa3BflSN_D2DSZhDIFNQO8=",
    category: "Tools"
  },
  "tool-tourniquet-combat": {
    name: "Combat-Ready Tourniquet",
    sku: "EMS-TOOL-TQ",
    price: 35,
    image: "https://media.istockphoto.com/id/1130302444/photo/person-in-black-medical-gloves-applies-the-tourniquet-to-his-hand-to-prevent-bleeding-during.jpg?s=612x612&w=0&k=20&c=9GHA2jpOwj7dKZlwmetKcYEFi42Fv1m4B8N8D5hW75A=",
    category: "Tools"
  }
};

// Export for other scripts
window.PRODUCT_MAP = PRODUCT_MAP;
console.log("✅ Loaded", Object.keys(PRODUCT_MAP).length, "EMS products");
