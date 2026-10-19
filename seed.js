require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  // ==========================================
  // ELECTRONICS (6 Products)
  // ==========================================
  {
    brand: 'Sony',
    name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling Headphones',
    description: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented active noise cancellation and exceptional call quality with 4 beamforming microphones.',
    mrp: 34990,
    price: 26990,
    rating: 4.8,
    reviewCount: 3240,
    category: 'Electronics',
    image: 'images/products/elec-1-1.jpg',
    images: [
      'images/products/elec-1-1.jpg',
      'images/products/elec-1-2.jpg',
      'images/products/elec-1-3.jpg'
    ],
    stock: 22,
    highlights: [
      'Industry-leading active noise cancellation with 8 microphones',
      'Magnificent sound engineered with high-resolution audio support',
      'Up to 30-hour battery life with quick charge (3 min for 3 hours)',
      'Multipoint connection lets you pair two devices simultaneously'
    ],
    specifications: {
      'Headphone Type': 'Over-Ear',
      'Connectivity': 'Bluetooth 5.2 / 3.5mm Aux',
      'Battery Life': 'Up to 30 Hours (NC On)',
      'Weight': '250 grams',
      'Warranty': '1 Year Domestic Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Apple',
    name: 'Apple Watch Series 9 GPS 45mm with Midnight Sport Band',
    description: 'Apple Watch Series 9 helps you stay connected, active, healthy, and safe. Featuring the S9 SiP for a super-bright display, precision finding for iPhone, and the magical double-tap gesture to interact without touching the screen.',
    mrp: 44900,
    price: 38999,
    rating: 4.7,
    reviewCount: 1820,
    category: 'Electronics',
    image: 'images/products/elec-2-1.jpg',
    images: [
      'images/products/elec-2-1.jpg',
      'images/products/elec-2-2.jpg',
      'images/products/elec-2-3.jpg'
    ],
    stock: 14,
    highlights: [
      'S9 SiP chip with 64-bit dual-core processor',
      'Always-On Retina display up to 2000 nits brightness',
      'Advanced health sensors: ECG, Blood Oxygen, Temperature sensing',
      'Water resistant 50 metres (Swimproof)'
    ],
    specifications: {
      'Dial Size': '45 mm',
      'Display': 'Always-On OLED Retina Display',
      'Sensors': 'Optical Heart Rate, Electrical Heart Sensor, SpO2, Accelerometer',
      'Battery Life': 'Up to 18 Hours (Normal), 36 Hours (Low Power)',
      'Warranty': '1 Year Apple Manufacturer Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Keychron',
    name: 'Keychron K2 V2 Wireless Bluetooth Mechanical Keyboard RGB Backlit',
    description: 'A 75% compact wireless mechanical keyboard designed for Mac and Windows. Features hot-swappable Gateron G Pro mechanical switches, wireless and wired modes, and customizable per-key dynamic RGB backlighting.',
    mrp: 8999,
    price: 6499,
    rating: 4.6,
    reviewCount: 940,
    category: 'Electronics',
    image: 'images/products/elec-3-1.jpg',
    images: [
      'images/products/elec-3-1.jpg',
      'images/products/elec-3-2.jpg',
      'images/products/elec-3-3.jpg'
    ],
    stock: 18,
    highlights: [
      '75% layout (84 keys) saving 15% more desktop space',
      'Connects with up to 3 devices via Bluetooth 5.1 or Type-C cable',
      'Huge 4000 mAh rechargeable battery lasting up to 240 hours',
      'Inclined bottom frame with ergonomic 9-degree rubber feet'
    ],
    specifications: {
      'Switch Type': 'Gateron G Pro Brown Tactile Switches',
      'Layout': '75% Compact Tenkeyless (84 Keys)',
      'Connectivity': 'Bluetooth 5.1 & USB Type-C',
      'Backlight': '18 Types of RGB Backlight Modes',
      'Warranty': '1 Year Replacement Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Logitech',
    name: 'Logitech MX Master 3S Wireless Performance Mouse with Quiet Clicks',
    description: 'Logitech MX Master 3S is an iconic ergonomic mouse remastered. Now with Quiet Clicks and 8,000 DPI track-on-glass sensor for ultimate precision, fluid scrolling with MagSpeed electromagnetic wheel, and multi-computer Flow control.',
    mrp: 10995,
    price: 8495,
    rating: 4.9,
    reviewCount: 4120,
    category: 'Electronics',
    image: 'images/products/elec-4-1.jpg',
    images: [
      'images/products/elec-4-1.jpg',
      'images/products/elec-4-2.jpg',
      'images/products/elec-4-3.jpg'
    ],
    stock: 25,
    highlights: [
      '8000 DPI Darkfield optical sensor tracks on any surface including glass',
      'MagSpeed electromagnetic scroll wheel scrolls 1,000 lines in 1 second',
      'Quiet Click switches deliver 90% less click noise',
      'Fast USB-C charging: 1 minute charge gives 3 hours of use'
    ],
    specifications: {
      'Sensor Technology': 'Darkfield High Precision Optical (200-8000 DPI)',
      'Buttons': '7 Buttons (Left/Right-click, Back/Forward, App-Switch, Wheel, Middle)',
      'Wireless Range': '10 meters (Logi Bolt & Bluetooth LE)',
      'Weight': '141 grams',
      'Warranty': '1 Year Limited Hardware Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'boAt',
    name: 'boAt Stone 1200 14W Portable Bluetooth Speaker with RGB LED Lights',
    description: 'Get ready for thunderous bass and stereo sound with the boAt Stone 1200. Boasting 14W RMS stereo output, dynamic RGB LEDs, IPX7 water resistance rating, and dual EQ modes for indoor clarity or outdoor bass punch.',
    mrp: 6990,
    price: 3499,
    rating: 4.3,
    reviewCount: 5410,
    category: 'Electronics',
    image: 'images/products/elec-5-1.jpg',
    images: [
      'images/products/elec-5-1.jpg',
      'images/products/elec-5-2.jpg',
      'images/products/elec-5-3.jpg'
    ],
    stock: 40,
    highlights: [
      '14W RMS immersive stereo sound with passive bass radiators',
      'IPX7 water & splash resistance built for rugged travel and pool parties',
      'Up to 9 hours of playback with 3600 mAh battery',
      'TWS feature lets you connect two Stone 1200 speakers for 2x audio'
    ],
    specifications: {
      'Output Power': '14 Watts RMS',
      'Bluetooth Version': 'v5.0 with 10m Range',
      'Water Resistance': 'IPX7 Certified Waterproof',
      'Battery Capacity': '3600 mAh Li-ion',
      'Warranty': '1 Year Brand Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Dell',
    name: 'Dell UltraSharp U2723QE 27-inch 4K UHD IPS Black Monitor with USB-C Hub',
    description: 'Elevate your creative precision with Dell UltraSharp 27 4K USB-C Hub monitor. Features IPS Black technology with a 2,000:1 contrast ratio, 98% DCI-P3 color gamut, ComfortView Plus hardware low blue light, and 90W USB-C power delivery.',
    mrp: 54990,
    price: 41990,
    rating: 4.8,
    reviewCount: 680,
    category: 'Electronics',
    image: 'images/products/elec-6-1.jpg',
    images: [
      'images/products/elec-6-1.jpg',
      'images/products/elec-6-2.jpg',
      'images/products/elec-6-3.jpg'
    ],
    stock: 9,
    highlights: [
      '27-inch 4K UHD (3840 x 2160) at 60Hz with IPS Black technology',
      '2000:1 contrast ratio for deep blacks and vibrant contrast',
      'USB-C hub delivers 90W power, RJ45 Ethernet, and DP daisy chaining',
      'VESA DisplayHDR 400 certified with 98% DCI-P3 wide color coverage'
    ],
    specifications: {
      'Panel Type': 'IPS Black (Anti-glare 3H coating)',
      'Resolution': '4K UHD 3840 x 2160 at 60 Hz',
      'Ports': 'HDMI, DisplayPort 1.4, USB-C (90W PD), 4x USB 3.2, RJ45 Ethernet',
      'Stand Adjustments': 'Height, Pivot, Swivel, Tilt',
      'Warranty': '3 Years Premium Panel Exchange Service'
    },
    freeDelivery: true
  },

  // ==========================================
  // FASHION (6 Products)
  // ==========================================
  {
    brand: "Levi's",
    name: "Levi's Men's Standard Trucker Denim Jacket in Classic Indigo",
    description: 'The original jean jacket since 1967. Levi’s Trucker Jacket is a blank canvas for self-expression. Crafted from 100% heavyweight cotton with metal shank buttons, chest flap pockets, and side welt pockets for timeless outerwear style.',
    mrp: 4999,
    price: 2999,
    rating: 4.5,
    reviewCount: 1420,
    category: 'Fashion',
    image: 'images/products/fash-1-1.jpg',
    images: [
      'images/products/fash-1-1.jpg',
      'images/products/fash-1-2.jpg',
      'images/products/fash-1-3.jpg'
    ],
    stock: 28,
    highlights: [
      '100% pure premium denim cotton with authentic washed finish',
      'Regular fit hitting straight at the hips',
      'Point collar with front button placket and branded copper shanks',
      'Machine washable and pre-shrunk for consistent fit'
    ],
    specifications: {
      'Material': '100% Cotton Denim',
      'Fit': 'Regular Fit',
      'Closure': 'Metal Button Placket',
      'Care Instructions': 'Machine wash cold with like colors',
      'Country of Origin': 'India'
    },
    freeDelivery: true
  },
  {
    brand: 'Puma',
    name: 'Puma Unisex Smash v2 Leather Low-Top Casual Sneakers',
    description: 'Inspired by tennis heritage, Puma Smash v2 brings clean street style to your daily wardrobe. Features a soft leather upper, durable non-marking rubber outsole, and the cushioned SoftFoam+ sockliner for cloud-like step-in comfort.',
    mrp: 3999,
    price: 1999,
    rating: 4.4,
    reviewCount: 2890,
    category: 'Fashion',
    image: 'images/products/fash-2-1.jpg',
    images: [
      'images/products/fash-2-1.jpg',
      'images/products/fash-2-2.jpg',
      'images/products/fash-2-3.jpg'
    ],
    stock: 35,
    highlights: [
      'Premium soft leather upper with iconic Puma Formstrip overlay',
      'SoftFoam+ comfort insert provides all-day cushioning underfoot',
      'Durable textured rubber outsole provides superior grip',
      'Padded collar and tongue for ankle support'
    ],
    specifications: {
      'Upper Material': 'Genuine Leather & Synthetic Overlays',
      'Sole Material': 'Non-marking Vulcanized Rubber',
      'Closure': 'Lace-Up',
      'Insole': 'SoftFoam+ Dual-density Insole',
      'Warranty': '90 Days Manufacturer Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'U.S. Polo Assn.',
    name: 'U.S. Polo Assn. Men Solid Slim Fit Pure Pique Cotton Polo T-Shirt',
    description: 'An iconic classic, this U.S. Polo Assn. polo is tailored from breathable honeycomb pique cotton. Accented with the signature embroidered double horseman logo, ribbed collar, and two-button placket for sporty weekend elegance.',
    mrp: 1899,
    price: 999,
    rating: 4.3,
    reviewCount: 1750,
    category: 'Fashion',
    image: 'images/products/fash-3-1.jpg',
    images: [
      'images/products/fash-3-1.jpg',
      'images/products/fash-3-2.jpg',
      'images/products/fash-3-3.jpg'
    ],
    stock: 50,
    highlights: [
      '100% combed cotton pique fabric with moisture-wicking weave',
      'Modern slim fit silhouette with side vent hemline',
      'Signature embroidered polo logo on left chest',
      'Colorfast dyes resistant to wash fading'
    ],
    specifications: {
      'Fabric': '100% Combed Pique Cotton',
      'Fit': 'Slim Fit',
      'Collar Style': 'Ribbed Polo Collar with 2 Buttons',
      'Sleeve Length': 'Short Sleeves with Ribbed Cuffs',
      'Country of Origin': 'India'
    },
    freeDelivery: true
  },
  {
    brand: 'Ray-Ban',
    name: 'Ray-Ban Polarized Aviator Classic Sunglasses with Green G-15 Lenses',
    description: 'Originally created for U.S. aviators in 1937, the Ray-Ban Aviator Classic is one of the most iconic sunglasses in history. Combines great aviator styling with exceptional optical clarity and 100% UV polarized eye protection.',
    mrp: 9590,
    price: 6990,
    rating: 4.7,
    reviewCount: 1105,
    category: 'Fashion',
    image: 'images/products/fash-4-1.jpg',
    images: [
      'images/products/fash-4-1.jpg',
      'images/products/fash-4-2.jpg',
      'images/products/fash-4-3.jpg'
    ],
    stock: 15,
    highlights: [
      'Polarized green classic G-15 mineral crystal lenses',
      'Blocks 99% of reflected glare and 100% of harmful UVA/UVB rays',
      'Ultra-lightweight gold-tone metal monel alloy frame',
      'Includes original Ray-Ban leather protective case and microfiber cloth'
    ],
    specifications: {
      'Frame Material': 'Corrosion-Resistant Metal Alloy',
      'Lens Technology': 'Polarized Crystal G-15',
      'Eye Size': '58 mm (Standard)',
      'Bridge Width': '14 mm | Temple Length: 135 mm',
      'Warranty': '2 Years International Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Fastrack',
    name: 'Fastrack Limitless FS1 Pro Chronograph Analog Watch with Blue Dial',
    description: 'Add bold contemporary flair to your wrist with the Fastrack Limitless FS1 Pro. Features a rugged octagonal bezel, multi-function sub-dials, scratch-resistant mineral glass, and water resistance up to 50 meters.',
    mrp: 3995,
    price: 2195,
    rating: 4.2,
    reviewCount: 2310,
    category: 'Fashion',
    image: 'images/products/fash-5-1.jpg',
    images: [
      'images/products/fash-5-1.jpg',
      'images/products/fash-5-2.jpg',
      'images/products/fash-5-3.jpg'
    ],
    stock: 32,
    highlights: [
      'Precision Japanese quartz chronograph movement with date window',
      'Deep sunray navy blue dial with luminescent indices and hands',
      'Sturdy stainless steel case and link bracelet with fold-over clasp',
      'Water resistant up to 5 ATM / 50 meters'
    ],
    specifications: {
      'Movement': 'Quartz Multi-Function Analog',
      'Case Diameter': '44 mm',
      'Strap Material': '316L Solid Stainless Steel',
      'Water Resistance': '50 Meters (5 ATM)',
      'Warranty': '2 Years Titan Company Ltd Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Tommy Hilfiger',
    name: 'Tommy Hilfiger Men Genuine Leather RFID-Blocking Bifold Wallet',
    description: 'Crafted from 100% supple genuine cowhide leather with a burnished finish, this Tommy Hilfiger bifold wallet features RFID blocking lining to safeguard your contactless credit cards, 6 card slots, 2 bill pockets, and a removable ID passcase.',
    mrp: 2499,
    price: 1499,
    rating: 4.6,
    reviewCount: 1640,
    category: 'Fashion',
    image: 'images/products/fash-6-1.jpg',
    images: [
      'images/products/fash-6-1.jpg',
      'images/products/fash-6-2.jpg',
      'images/products/fash-6-3.jpg'
    ],
    stock: 45,
    highlights: [
      '100% handcrafted genuine full-grain leather that patinas beautifully',
      'RFID blocking technology protects cards against digital identity theft',
      'Slim bifold design slips smoothly into front or rear trouser pockets',
      'Signature Tommy Hilfiger embossed red, white, and navy metal ribbon logo'
    ],
    specifications: {
      'Material': '100% Genuine Full Grain Leather',
      'Slots': '6 Card Slots, 2 Currency Compartments, 1 Transparent ID Window',
      'Dimensions': '11.5 cm x 9 cm x 1.5 cm',
      'Special Feature': 'RFID Shielding Frequency 13.56 MHz',
      'Warranty': '6 Months Brand Warranty'
    },
    freeDelivery: true
  },

  // ==========================================
  // HOME & KITCHEN (6 Products)
  // ==========================================
  {
    brand: 'Philips',
    name: 'Philips Daily Collection HD4928/01 2100W Electromagnetic Induction Cooktop',
    description: 'Cook delicious meals quickly and cleanly with the Philips HD4928 Induction Cooktop. Delivers 2100W of instant heating power that seals nutrition into food. Programmed for authentic Indian recipes with timed touch controls.',
    mrp: 4295,
    price: 2899,
    rating: 4.4,
    reviewCount: 3410,
    category: 'Home',
    image: 'images/products/home-1-1.jpg',
    images: [
      'images/products/home-1-1.jpg',
      'images/products/home-1-2.jpg',
      'images/products/home-1-3.jpg'
    ],
    stock: 20,
    highlights: [
      '2100 Watts fast heating seals vitamins and nutrients into food',
      'Programmed with 6 Indian cooking presets (Roti, Dosa, Gravy, Milk, Dal, Fry)',
      'Cool-to-touch full glass ceramic cooking plate is easy to wipe clean',
      'Auto-off program safely shuts down cooker when pan is lifted'
    ],
    specifications: {
      'Power Wattage': '2100 Watts',
      'Control Panel': 'Push Button with Digital LED Display',
      'Cord Length': '1.2 meters',
      'Body Material': 'Microcrystal A-Grade Ceramic Glass',
      'Warranty': '1 Year Philips India Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Hario',
    name: 'Hario V60 Ceramic Pour-Over Coffee Dripper Size 02 in Matte White',
    description: 'The world-standard brew method preferred by barista champions. The Hario V60 conical ceramic dripper features internal spiral ribs that maximize air flow and coffee extraction, brewing up to 4 cups of exceptionally clean pour-over coffee.',
    mrp: 2199,
    price: 1599,
    rating: 4.8,
    reviewCount: 890,
    category: 'Home',
    image: 'images/products/home-2-1.jpg',
    images: [
      'images/products/home-2-1.jpg',
      'images/products/home-2-2.jpg',
      'images/products/home-2-3.jpg'
    ],
    stock: 16,
    highlights: [
      'Handcrafted high-fired Arita ware ceramic with excellent heat retention',
      'Signature 60-degree conical shape allows deeper coffee bed layers',
      'Single large extraction hole lets you regulate brew speed by pour pace',
      'Brew capacity: 1 to 4 cups per batch'
    ],
    specifications: {
      'Material': 'Arita Ceramic Porcelain (Microwave & Dishwasher Safe)',
      'Capacity': '1 - 4 Cups (Size 02)',
      'Dimensions': '14 cm x 12 cm x 10.2 cm',
      'Country of Origin': 'Japan',
      'Includes': 'Coffee Measuring Scoop'
    },
    freeDelivery: true
  },
  {
    brand: 'Wipro',
    name: 'Wipro Garnet 12W Smart Dimmable LED Desk Lamp with 3 Color Modes',
    description: 'Protect your eyesight during late-night work and study sessions with the Wipro Garnet LED Desk Lamp. Features touch-sensitive stepless dimming, 3 color temperatures (Warm, Natural, Cool White), and a flexible 360-degree silicone neck.',
    mrp: 2490,
    price: 1299,
    rating: 4.3,
    reviewCount: 1980,
    category: 'Home',
    image: 'images/products/home-3-1.jpg',
    images: [
      'images/products/home-3-1.jpg',
      'images/products/home-3-2.jpg',
      'images/products/home-3-3.jpg'
    ],
    stock: 30,
    highlights: [
      'Flicker-free eye protection LEDs with zero UV emissions',
      '3 tunable color temperatures: 3000K Warm, 4500K Neutral, 6500K Daylight',
      'Smart touch control for smooth brightness dimming',
      'Flexible goose-neck arm allows directional beam adjustment at any angle'
    ],
    specifications: {
      'Power Wattage': '12 Watts Energy-Saving LED',
      'Luminous Flux': '700 Lumens',
      'Color Temperature': '3000K to 6500K Adjustable',
      'Power Source': 'AC Adapter Plug-in (Included)',
      'Warranty': '1 Year Wipro Consumer Care Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'SleepyCat',
    name: 'SleepyCat Ergonomic Memory Foam Contour Orthopedic Cervical Pillow',
    description: 'Say goodbye to stiff neck and morning spine fatigue. The SleepyCat Contour Orthopedic pillow is sculpted from high-density memory foam with dual-height curves for side and back sleepers, infused with cooling gel beads and a washable bamboo fabric cover.',
    mrp: 2989,
    price: 1699,
    rating: 4.5,
    reviewCount: 2150,
    category: 'Home',
    image: 'images/products/home-4-1.jpg',
    images: [
      'images/products/home-4-1.jpg',
      'images/products/home-4-2.jpg',
      'images/products/home-4-3.jpg'
    ],
    stock: 24,
    highlights: [
      'Therapeutic dual-wave contour height (10cm and 12cm) aligns cervical spine',
      'Zero-pressure high density memory foam rebounds smoothly without sagging',
      'Cooling gel infusion dissipates body heat throughout the night',
      'Naturally antibacterial and hypoallergenic bamboo knit cover'
    ],
    specifications: {
      'Core Material': '100% High Density Viscoelastic Memory Foam',
      'Outer Cover': 'Removable Zippered Breathable Bamboo Fabric',
      'Dimensions': '60 cm x 38 cm x 12/10 cm',
      'Ideal Sleep Positions': 'Back & Side Sleepers',
      'Warranty': '1 Year Warranty against sagging'
    },
    freeDelivery: true
  },
  {
    brand: 'Milton',
    name: 'Milton Thermosteel Flip Lid 1000ml Double-Wall Vacuum Insulated Flask',
    description: 'Keep beverages piping hot for 24 hours or icy cold for 24 hours with Milton Thermosteel. Built with 18/8 food-grade stainless steel inside and outside, leak-proof flip lid, and copper coating for maximum thermal insulation.',
    mrp: 1260,
    price: 899,
    rating: 4.6,
    reviewCount: 8720,
    category: 'Home',
    image: 'images/products/home-5-1.jpg',
    images: [
      'images/products/home-5-1.jpg',
      'images/products/home-5-2.jpg',
      'images/products/home-5-3.jpg'
    ],
    stock: 55,
    highlights: [
      'Double-wall vacuum insulation with inner copper layer for 24h temp retention',
      '100% food-grade rust-free 304 stainless steel construction',
      'Push-button flip lid with lock mechanism doubles as drinking cup',
      'Comes with durable fabric thermal carry pouch with shoulder strap'
    ],
    specifications: {
      'Capacity': '1000 ml (1 Litre)',
      'Material': 'Grade 304 (18/8) Stainless Steel',
      'Thermal Performance': '24 Hours Hot / 24 Hours Cold',
      'Leak Proof': 'Yes (Silicone Gasket Sealed)',
      'Warranty': '1 Year Milton Domestic Warranty'
    },
    freeDelivery: true
  },
  {
    brand: 'Prestige',
    name: 'Prestige Iris 750W Heavy Duty Mixer Grinder with 4 Stainless Steel Jars',
    description: 'Power through tough Indian kitchen grinding with Prestige Iris. Equipped with a heavy-duty 750-watt motor, overload protection, razor-sharp multi-function stainless steel blades, and 4 specialized jars including a transparent juicer extractor jar.',
    mrp: 6195,
    price: 3299,
    rating: 4.2,
    reviewCount: 6490,
    category: 'Home',
    image: 'images/products/home-6-1.jpg',
    images: [
      'images/products/home-6-1.jpg',
      'images/products/home-6-2.jpg',
      'images/products/home-6-3.jpg'
    ],
    stock: 19,
    highlights: [
      'High-torque 750 Watts pure copper motor operating at 20,000 RPM',
      '4 jars included: 1.5L Wet Jar, 1.0L Dry Jar, 300ml Chutney Jar & 1.5L Juicer Jar',
      'Ergonomic jar handles and secure lock lids preventing spills',
      'Overload protection switch safeguards motor against voltage surges'
    ],
    specifications: {
      'Motor Power': '750 Watts Copper Motor (230V / 50Hz)',
      'Speed Control': '3 Speeds with Pulse Switch',
      'Jars Included': '3 Stainless Steel Jars + 1 Transparent Polycarbonate Juicer Jar',
      'Blade Material': 'High Grade Surgical Stainless Steel',
      'Warranty': '2 Years Prestige India Warranty'
    },
    freeDelivery: true
  },

  // ==========================================
  // SPORTS & FITNESS (6 Products)
  // ==========================================
  {
    brand: 'Boldfit',
    name: 'Boldfit Pro Eco Non-Slip 6mm Yoga Mat with Body Alignment Lines',
    description: 'Master your yoga asanas with stability. The Boldfit Pro 6mm yoga mat is manufactured with eco-friendly TPE material featuring embossed dual-sided wave textures for slip resistance on tile and wood floors, complete with laser-etched alignment guides.',
    mrp: 1999,
    price: 999,
    rating: 4.5,
    reviewCount: 3820,
    category: 'Sports',
    image: 'images/products/sport-1-1.jpg',
    images: [
      'images/products/sport-1-1.jpg',
      'images/products/sport-1-2.jpg',
      'images/products/sport-1-3.jpg'
    ],
    stock: 45,
    highlights: [
      '6mm high-density cushioning protects knees, joints, and elbows',
      'Laser-etched alignment markings keep your hands and feet centered',
      '100% non-toxic, latex-free, and odorless recyclable TPE material',
      'Includes elastic carry strap for effortless transport to class'
    ],
    specifications: {
      'Thickness': '6 mm High Density Cushion',
      'Dimensions': '183 cm (6 ft) Length x 61 cm Width',
      'Material': 'Eco-Friendly Biodegradable TPE',
      'Weight': '850 grams',
      'Care': 'Wipe clean with damp cloth and mild soap'
    },
    freeDelivery: true
  },
  {
    brand: 'Nivia',
    name: 'Nivia Storm Football Rubber Molded Size 5 with Reinforced Bladder',
    description: 'Built for intense outdoor play on rough grounds, grass, and artificial turf. Nivia Storm features 32 machine-molded rubber panels with a heavy-duty reinforced latex bladder that ensures shape retention and true aerodynamic flight.',
    mrp: 860,
    price: 499,
    rating: 4.3,
    reviewCount: 4210,
    category: 'Sports',
    image: 'images/products/sport-2-1.jpg',
    images: [
      'images/products/sport-2-1.jpg',
      'images/products/sport-2-2.jpg',
      'images/products/sport-2-3.jpg'
    ],
    stock: 4, // Intentionally low stock (< 5) to test low-stock warning
    highlights: [
      'Official Match Size 5 (suitable for ages 12 and above)',
      '32 rubber molded panels built to withstand hard concrete and turf',
      'Reinforced butyl bladder maintains air pressure for weeks',
      'High contrast aerodynamic panel design for supreme visibility in flight'
    ],
    specifications: {
      'Size': 'Standard Size 5 (Circumference 68-70 cm)',
      'Outer Material': 'Abrasion Resistant Natural Rubber',
      'Construction': 'Molded 32-Panel Construction',
      'Recommended Surface': 'Hard Ground, Concrete, Grass, Artificial Turf',
      'Weight': '420 - 440 grams'
    },
    freeDelivery: false
  },
  {
    brand: 'Yonex',
    name: 'Yonex Muscle Power 29 Light Full Graphite Badminton Racquet with Full Cover',
    description: 'Dominate the badminton court with the Yonex Muscle Power 29 Light. Constructed with High Modulus full carbon graphite, Isometric head shape for enlarged sweet spot, and Muscle Power frame that locks strings smoothly into arched contact grommets.',
    mrp: 3190,
    price: 2190,
    rating: 4.6,
    reviewCount: 2940,
    category: 'Sports',
    image: 'images/products/sport-3-1.jpg',
    images: [
      'images/products/sport-3-1.jpg',
      'images/products/sport-3-2.jpg',
      'images/products/sport-3-3.jpg'
    ],
    stock: 22,
    highlights: [
      'Isometric square head shape expands the sweet spot by 7%',
      'Muscle Power frame eliminates stress concentration across string bed',
      'Ultra-light 85g 3U weight for swift defensive smashes and net drop shots',
      'Pre-strung at optimal 24-26 lbs tension with padded full zipper cover'
    ],
    specifications: {
      'Frame Material': 'Full Carbon High Modulus Graphite',
      'Weight / Grip Size': '3U (Avg. 85g) / G4',
      'Balance': 'Even Balance (All-Round Play)',
      'String Tension': '24 - 30 lbs Maximum',
      'Includes': 'Full Zipper Head & Handle Thermal Cover'
    },
    freeDelivery: true
  },
  {
    brand: 'Strauss',
    name: 'Strauss Resistance Loop Exercise Bands Set of 5 Tension Levels with Pouch',
    description: 'Transform your home fitness routine with Strauss Resistance Loop Bands. Set of 5 color-coded bands ranging from Extra Light to Extra Heavy tension, crafted from 100% natural Malaysian latex that stretches up to 3x without snapping.',
    mrp: 999,
    price: 449,
    rating: 4.4,
    reviewCount: 1530,
    category: 'Sports',
    image: 'images/products/sport-4-1.jpg',
    images: [
      'images/products/sport-4-1.jpg',
      'images/products/sport-4-2.jpg',
      'images/products/sport-4-3.jpg'
    ],
    stock: 60,
    highlights: [
      '5 distinct resistance levels: X-Light (5 lbs), Light (10 lbs), Medium (15 lbs), Heavy (20 lbs), X-Heavy (30 lbs)',
      '100% natural snap-resistant eco latex with skin-friendly touch',
      'Targets glutes, legs, shoulders, abs, and physical therapy rehabilitation',
      'Compact breathable mesh drawstring bag included'
    ],
    specifications: {
      'Band Count': '5 Loop Bands with Varying Thickness',
      'Material': '100% Natural Malaysian Latex',
      'Band Dimensions': '30 cm x 5 cm',
      'Application': 'CrossFit, Yoga, Pilates, Strength Conditioning, Physio',
      'Warranty': '6 Months Warranty'
    },
    freeDelivery: false
  },
  {
    brand: 'Cosco',
    name: 'Cosco High Speed Ball Bearing Adjustable Skipping Rope with Foam Handles',
    description: 'Burn calories and boost cardio stamina with Cosco High Speed Skipping Rope. Engineered with 360-degree dual ball bearings in aluminum handles for ultra-fast spin without tangling, and a steel wire cable coated in durable PVC.',
    mrp: 450,
    price: 249,
    rating: 4.2,
    reviewCount: 1220,
    category: 'Sports',
    image: 'images/products/sport-5-1.jpg',
    images: [
      'images/products/sport-5-1.jpg',
      'images/products/sport-5-2.jpg',
      'images/products/sport-5-3.jpg'
    ],
    stock: 3, // Intentionally low stock (< 5) to test low-stock warning
    highlights: [
      'Double ball bearing swivel mechanism delivers smooth 360-degree rotation',
      'Braided steel wire cable coated in wear-resistant polyurethane',
      'Fully adjustable 3-meter cable with screw stops for all heights',
      'Ergonomic sweat-absorbing memory foam anti-slip grip handles'
    ],
    specifications: {
      'Rope Length': '300 cm (Adjustable)',
      'Cable Diameter': '4 mm Steel Core with PVC Coating',
      'Handle Material': 'Non-slip Foam Padded Grip',
      'Weight': '160 grams',
      'Country of Origin': 'India'
    },
    freeDelivery: false
  },
  {
    brand: 'Speedo',
    name: 'Speedo Fastskin Elite Anti-Fog UV Protection Mirror Swimming Goggles',
    description: 'Engineered for competitive swimmers and lap training, Speedo Fastskin features low-profile hydrodynamic curved lenses for 180-degree peripheral vision, mirrored coating that reduces outdoor solar glare, and a 3D IQfit seal that prevents water leakage.',
    mrp: 1699,
    price: 1099,
    rating: 4.7,
    reviewCount: 940,
    category: 'Sports',
    image: 'images/products/sport-6-1.jpg',
    images: [
      'images/products/sport-6-1.jpg',
      'images/products/sport-6-2.jpg',
      'images/products/sport-6-3.jpg'
    ],
    stock: 0, // Intentionally Out of stock to test out-of-stock badge and disabled Add to Cart
    highlights: [
      'IQfit 3D goggle seal ensures a snug, leak-free fit with reduced marks around eyes',
      'Anti-fog coated mirrored polycarbonate lenses with 100% UV400 shield',
      'Hydrodynamic low-profile profile minimizes drag resistance through water',
      'Includes 3 interchangeable nose bridge sizes and tension-scale strap'
    ],
    specifications: {
      'Lens Type': 'Mirrored Anti-Fog Polycarbonate',
      'Strap & Seal': '100% High Grade Hypoallergenic Silicone',
      'UV Protection': 'UV 400 Rated',
      'Includes': '3 Interchangeable Nose Bridges & Carry Pouch',
      'Warranty': '1 Year Speedo Warranty'
    },
    freeDelivery: true
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_store';
    const safeHost = mongoUri.includes('@') ? mongoUri.split('@')[1] : mongoUri.replace(/^mongodb:\/\//, '');
    console.log(`Connecting to MongoDB... (${safeHost})`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing product inventory...');
    const deleteResult = await Product.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing products.`);

    console.log(`Inserting ${sampleProducts.length} full-scale marketplace products...`);
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${inserted.length} products!\n`);

    inserted.forEach((p, idx) => {
      const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      console.log(`  ${idx + 1}. [${p.category}] ${p.brand} - ${p.name.substring(0, 38)}...`);
      console.log(`     ₹${p.price} (MRP: ₹${p.mrp}, ${discount}% OFF) | Rating: ★${p.rating} (${p.reviewCount}) | Stock: ${p.stock}`);
    });

    console.log('\nSeeding completed successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDB();
