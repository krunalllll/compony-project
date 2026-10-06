import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';

dotenv.config();

const products = [
  // ==========================================
  // MEN CATEGORY (6 Products)
  // ==========================================
  {
    name: "APEX HEAVYWEIGHT BOX HOODIE",
    description: "Constructed from 480GSM loopback organic French terry cotton. Engineered boxy silhouette, dropped shoulders, double-layer structured hood, and subtle tonal embroidery on the chest. Designed to maintain its shape over years of wear.",
    price: 135,
    discount: 15,
    category: "Men",
    subcategory: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Slate Black", "Off-White", "Acid Grey"],
    brand: "Apex Collective",
    ratings: 4.9,
    reviewsCount: 14,
    soldCount: 320,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2, sourceType: 'url' }
    ],
    stock: 35,
    reviews: []
  },
  {
    name: "UTILITY PARATROOPER CARGO PANTS",
    description: "Heavy cotton-twill cargo pants with functional tactical utility. Features modular bellows storage pockets, reinforced knee articulation pleats, custom YKK zip hardware, and adjustable bungee toggle cuffs.",
    price: 145,
    discount: 0,
    category: "Men",
    subcategory: "Cargo",
    sizes: ["30", "32", "34", "36"],
    colors: ["Olive Drab", "Midnight Black", "Desert Sand"],
    brand: "Terrain Labs",
    ratings: 4.8,
    reviewsCount: 9,
    soldCount: 240,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2, sourceType: 'url' }
    ],
    stock: 22,
    reviews: []
  },
  {
    name: "ACID-WASH BOX-FIT GRAPHIC TEE",
    description: "Cut from 260GSM combed compact cotton jersey. Hand-treated acid wash treatment ensures each piece has a unique marbled patina. Features high-density rubberized typographic art on chest and rear shoulders.",
    price: 68,
    discount: 10,
    category: "Men",
    subcategory: "T Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal Grey", "Chalk White", "Obsidian Black"],
    brand: "Asphalt Rebel",
    ratings: 4.7,
    reviewsCount: 18,
    soldCount: 410,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2, sourceType: 'url' }
    ],
    stock: 45,
    reviews: []
  },
  {
    name: "VINTAGE DISTRESSED RELAXED DENIM",
    description: "14oz Japanese selvedge denim in a relaxed 90s skater cut. Detailed hand-distressed whiskers, custom branded metal rivets, button-fly closure, and an effortless stack over bulky sneaker silhouettes.",
    price: 165,
    discount: 0,
    category: "Men",
    subcategory: "Jeans",
    sizes: ["30", "32", "34", "36"],
    colors: ["Stone Wash Grey", "Deep Indigo Blue"],
    brand: "Terrain Labs",
    ratings: 4.9,
    reviewsCount: 12,
    soldCount: 195,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 18,
    reviews: []
  },
  {
    name: "TACTICAL RIPSTOP FLIGHT JACKET",
    description: "Hybrid technical bomber crafted from durable diamond ripstop nylon. Lightweight PrimaLoft insulation, magnetic storm flap closures, dual inner gadget holsters, and heavy-gauge two-way front zipper.",
    price: 230,
    discount: 20,
    category: "Men",
    subcategory: "Jackets",
    sizes: ["M", "L", "XL"],
    colors: ["Carbon Grey", "Midnight Black"],
    brand: "Apex Collective",
    ratings: 5.0,
    reviewsCount: 7,
    soldCount: 110,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 14,
    reviews: []
  },
  {
    name: "OVERSIZED LINEN RESORT SHIRT",
    description: "Breathable 100% Belgian flax linen tailored with a modern dropped camp collar and boxy torso cut. Features natural mother-of-pearl buttons and deep side-vent hem slits.",
    price: 88,
    discount: 0,
    category: "Men",
    subcategory: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Chalk White", "Desert Sand", "Olive Drab"],
    brand: "Apex Collective",
    ratings: 4.6,
    reviewsCount: 6,
    soldCount: 140,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 28,
    reviews: []
  },

  // ==========================================
  // WOMEN CATEGORY (6 Products)
  // ==========================================
  {
    name: "CYBER-CHIC OVERSIZED CROPPED HOODIE",
    description: "Cropped heavyweight fleece hoodie featuring dramatic wide bell sleeves, raw cut raw hem edge, and high-density reflective chest crest. Tailored for effortless streetwear layering.",
    price: 115,
    discount: 15,
    category: "Women",
    subcategory: "Hoodies",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Solar Flare Yellow", "Midnight Black", "Cyber Pink"],
    brand: "Apex Collective",
    ratings: 4.9,
    reviewsCount: 22,
    soldCount: 380,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2, sourceType: 'url' }
    ],
    stock: 30,
    reviews: []
  },
  {
    name: "TECHNICAL PARACHUTE CARGO PANTS",
    description: "Ultra-lightweight micro-ripstop parachute pants featuring balloon leg geometry, adjustable toggle drawstrings at waist and hems, deep dimensional cargo pockets, and sleek matte finish.",
    price: 135,
    discount: 0,
    category: "Women",
    subcategory: "Cargo",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Matte Black", "Off-White", "Desert Sand"],
    brand: "Terrain Labs",
    ratings: 4.8,
    reviewsCount: 15,
    soldCount: 290,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 25,
    reviews: []
  },
  {
    name: "NEON-DISTRICT WASHED BABY TEE",
    description: "Vintage 90s baby tee silhouette crafted from soft ribbed modal-cotton blend. Features retro chrome emblem print across front chest and subtle distressed contrast collar stitching.",
    price: 52,
    discount: 10,
    category: "Women",
    subcategory: "T Shirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Chalk White", "Cyber Pink", "Slate Black"],
    brand: "Asphalt Rebel",
    ratings: 4.7,
    reviewsCount: 19,
    soldCount: 460,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 40,
    reviews: []
  },
  {
    name: "OVERSIZED MINIMALIST TRENCH COAT",
    description: "Modern architectural trench coat tailored from double-faced waterproof gabardine cotton. Features exaggerated storm shield, broad notch lapels, self-fabric belt with gunmetal hardware, and clean vent.",
    price: 275,
    discount: 20,
    category: "Women",
    subcategory: "Jackets",
    sizes: ["S", "M", "L"],
    colors: ["Desert Sandstone", "Matte Black"],
    brand: "Apex Collective",
    ratings: 5.0,
    reviewsCount: 11,
    soldCount: 140,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 12,
    reviews: []
  },
  {
    name: "TEXTURED HEAVY KNIT MOCK-NECK",
    description: "Chunky ribbed knit pullover spun from merino wool blend. Features sculpted drop shoulders, tactile fisherman knit ribbing, and structured mock neck collar for cold city evenings.",
    price: 130,
    discount: 0,
    category: "Women",
    subcategory: "Knit",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Off-White", "Carbon Grey", "Slate Black"],
    brand: "Apex Collective",
    ratings: 4.8,
    reviewsCount: 8,
    soldCount: 175,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 20,
    reviews: []
  },
  {
    name: "MODULAR TECHWEAR CARGO DRESS",
    description: "Utility apron dress crafted from structured water-resistant nylon. Features webbed shoulder straps with quick-release clips, zippered front kangaroo pouch, and cinched toggle side pockets.",
    price: 155,
    discount: 10,
    category: "Women",
    subcategory: "Dresses",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Midnight Black", "Olive Drab"],
    brand: "Terrain Labs",
    ratings: 4.7,
    reviewsCount: 7,
    soldCount: 130,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 16,
    reviews: []
  },

  // ==========================================
  // KIDS CATEGORY (6 Products)
  // ==========================================
  {
    name: "APEX MINI STREET HOODIE SET",
    description: "Scaled-down edition of our signature heavyweight hoodie paired with matching relaxed fleece jogger pants. Ultra-soft combed organic cotton fleece, gentle ribbed trims, and tagless neckline for zero irritation.",
    price: 78,
    discount: 15,
    category: "Kids",
    subcategory: "Hoodies",
    sizes: ["6Y", "8Y", "10Y", "12Y"],
    colors: ["Sunset Amber", "Charcoal Grey", "Off-White"],
    brand: "Apex Collective",
    ratings: 4.9,
    reviewsCount: 12,
    soldCount: 210,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 28,
    reviews: []
  },
  {
    name: "RETRO CARTOON ARCHIVE TEE",
    description: "Playful streetwear graphic tee with vibrant water-based retro print. Durable double-stitched hem and soft-washed organic cotton built to withstand endless playground adventures.",
    price: 38,
    discount: 0,
    category: "Kids",
    subcategory: "T Shirts",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["Chalk White", "Cyber Pink", "Matte Black"],
    brand: "Asphalt Rebel",
    ratings: 4.8,
    reviewsCount: 9,
    soldCount: 310,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1471286174243-e7a4d9ab6548?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 45,
    reviews: []
  },
  {
    name: "URBAN PLAY CARGO JOGGERS",
    description: "Rugged stretch-twill cargo joggers for active youngsters. Features an elasticized drawstring waistband, secure flap cargo pockets, and tapered ribbed ankle cuffs that showcase their kicks.",
    price: 58,
    discount: 10,
    category: "Kids",
    subcategory: "Denim",
    sizes: ["6Y", "8Y", "10Y", "12Y"],
    colors: ["Olive Drab", "Midnight Black"],
    brand: "Terrain Labs",
    ratings: 4.6,
    reviewsCount: 7,
    soldCount: 165,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 26,
    reviews: []
  },
  {
    name: "HERITAGE SHERPA FLEECE JACKET",
    description: "Cozy high-pile sherpa fleece zip jacket featuring contrast woven nylon chest pocket, smooth interior lining, and heavy-duty zipper for easy morning layering.",
    price: 85,
    discount: 0,
    category: "Kids",
    subcategory: "Jackets",
    sizes: ["6Y", "8Y", "10Y", "12Y"],
    colors: ["Desert Sand", "Carbon Grey"],
    brand: "Apex Collective",
    ratings: 4.9,
    reviewsCount: 14,
    soldCount: 190,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 18,
    reviews: []
  },
  {
    name: "ORGANIC COTTON FRENCH TERRY SET",
    description: "Minimalist two-piece crewneck and short set in lightweight breathable French terry. Gentle pigment-dyed aesthetic with elasticated waistband and discrete side pockets.",
    price: 65,
    discount: 20,
    category: "Kids",
    subcategory: "Sets",
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    colors: ["Off-White", "Sunset Amber"],
    brand: "Apex Collective",
    ratings: 4.7,
    reviewsCount: 6,
    soldCount: 140,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 22,
    reviews: []
  },
  {
    name: "JUNIOR ALL-DAY UTILITY SHORTS",
    description: "Quick-dry nylon utility shorts with reinforced seam construction, comfortable mesh lining, and secure zip pockets for outdoor playtime and beach trips.",
    price: 36,
    discount: 0,
    category: "Kids",
    subcategory: "Shorts",
    sizes: ["6Y", "8Y", "10Y", "12Y"],
    colors: ["Midnight Black", "Olive Drab"],
    brand: "Terrain Labs",
    ratings: 4.5,
    reviewsCount: 5,
    soldCount: 110,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1471286174243-e7a4d9ab6548?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 32,
    reviews: []
  },

  // ==========================================
  // SNEAKERS CATEGORY (6 Products)
  // ==========================================
  {
    name: "APEX RETRO RUNNER CHUNKY V1",
    description: "Multilayered futuristic runner featuring breathable aerodynamic mesh underlays, genuine cowhide suede overlays, sculpted chunky EVA midsole, and high-visibility TPU heel cup stabilizers.",
    price: 185,
    discount: 10,
    category: "Sneakers",
    subcategory: "Sneakers",
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["Neon White", "Triple Black"],
    brand: "Terrain Labs",
    ratings: 4.9,
    reviewsCount: 28,
    soldCount: 530,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2, sourceType: 'url' }
    ],
    stock: 24,
    reviews: []
  },
  {
    name: "TERRAIN DESERT SATELLITE HIGH-TOPS",
    description: "Padded ankle high-top sneaker built from premium oil-waxed nubuck leather. Features quick-lace speed hooks, impact-dampening OrthoLite insoles, and aggressive tread lug rubber outsoles.",
    price: 240,
    discount: 0,
    category: "Sneakers",
    subcategory: "Sneakers",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Desert Sandstone", "Obsidian Black"],
    brand: "Terrain Labs",
    ratings: 4.8,
    reviewsCount: 16,
    soldCount: 290,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 15,
    reviews: []
  },
  {
    name: "BONE-WHITE CHUNKY DAD RUNNER",
    description: "90s archival silhouette reimagined with modern ergonomic engineering. Triple-density foam midsole, reflective lace eyelets, and tonal leather-mesh panelling for clean neutral street fits.",
    price: 195,
    discount: 15,
    category: "Sneakers",
    subcategory: "Sneakers",
    sizes: ["8", "9", "10", "11"],
    colors: ["Chalk White", "Carbon Grey"],
    brand: "Apex Collective",
    ratings: 4.8,
    reviewsCount: 21,
    soldCount: 380,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 19,
    reviews: []
  },
  {
    name: "ASPHALT COURT VULCANIZED LOW",
    description: "Minimalist low-top skate shoe with heavy 12oz canvas upper, double-wrapped vulcanized rubber foxing tape, padded collar lining, and high-grip herringbone gum outsole.",
    price: 125,
    discount: 0,
    category: "Sneakers",
    subcategory: "Sneakers",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Triple Black", "Neon White"],
    brand: "Asphalt Rebel",
    ratings: 4.6,
    reviewsCount: 11,
    soldCount: 310,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 28,
    reviews: []
  },
  {
    name: "CYBER-MOLD PLATFORM LEATHER TRAINER",
    description: "Avant-garde platform trainer featuring buttery full-grain Italian leather upper, exaggerated geometric 55mm platform sole unit, and debossed serial code on the outer heel counter.",
    price: 225,
    discount: 20,
    category: "Sneakers",
    subcategory: "Platform",
    sizes: ["8", "9", "10", "11"],
    colors: ["Matte Black", "Off-White"],
    brand: "Apex Collective",
    ratings: 4.9,
    reviewsCount: 15,
    soldCount: 220,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 12,
    reviews: []
  },
  {
    name: "APEX RECOVERY ERGONOMIC FOAM SLIDES",
    description: "Single-piece injected EVA foam slides with textured footbed contours that massage pressure points. Ultra-cushioned shock-absorbing design ideal for post-workout or city recovery lounge.",
    price: 70,
    discount: 0,
    category: "Sneakers",
    subcategory: "Slides",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Desert Sand", "Slate Black", "Olive Drab"],
    brand: "Apex Collective",
    ratings: 4.8,
    reviewsCount: 34,
    soldCount: 650,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 50,
    reviews: []
  },

  // ==========================================
  // ACCESSORIES CATEGORY (2 Products)
  // ==========================================
  {
    name: "ASPHALT REBEL STRAPBACK CAP",
    description: "Unstructured 6-panel strapback cap crafted from vintage stone-washed cotton canvas. Features tonal 3D embroidered emblem at front, antique brass adjustment clasp, and breathable eyelets.",
    price: 45,
    discount: 0,
    category: "Accessories",
    subcategory: "Caps",
    sizes: ["One Size"],
    colors: ["Stone Wash Grey", "Deep Indigo Blue", "Matte Black"],
    brand: "Asphalt Rebel",
    ratings: 4.7,
    reviewsCount: 14,
    soldCount: 220,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' },
      { url: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1, sourceType: 'url' }
    ],
    stock: 60,
    reviews: []
  },
  {
    name: "MODULAR TACTICAL CHEST RIG BAG",
    description: "Hands-free tactical crossbody bag constructed from weatherproof Cordura 500D fabric. Features modular MOLLE webbing, quick-release Duraflex buckle straps, and padded water-sealed tech dividers.",
    price: 92,
    discount: 10,
    category: "Accessories",
    subcategory: "Bags",
    sizes: ["One Size"],
    colors: ["Midnight Black", "Olive Drab"],
    brand: "Terrain Labs",
    ratings: 4.9,
    reviewsCount: 11,
    soldCount: 180,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0, sourceType: 'url' }
    ],
    stock: 25,
    reviews: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/streetwear_db');
    console.log('Connected to MongoDB for seeding...');

    // Clear collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Order.deleteMany({});
    console.log('Database collections cleared.');

    // Seed Admin & standard user first to get their object IDs
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@streetwear.com",
      password: "adminpassword123",
      role: "admin",
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    });
    console.log(`Admin created: ${adminUser.email}`);

    const standardUser = await User.create({
      name: "John Doe",
      email: "john@doe.com",
      password: "password123",
      role: "user",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    });
    console.log(`User created: ${standardUser.email}`);

    // Populate reviews and createdBy for products
    const sampleReviews = [
      "The cut and heavyweight cotton drape is unreal. Feels like a $400 designer piece.",
      "Incredible quality and fit. Perfectly oversized without looking sloppy.",
      "Fast shipping and the packaging was pure luxury. Will definitely order from the next drop.",
      "The stitching and fabric weight are top tier. 10/10 recommend.",
      "Best purchase this season! Matches with all my streetwear sneakers."
    ];

    products.forEach((prod, i) => {
      prod.createdBy = adminUser._id;
      prod.reviews = [
        {
          user: standardUser._id,
          name: standardUser.name,
          rating: Math.round(prod.ratings),
          comment: sampleReviews[i % sampleReviews.length]
        }
      ];
      prod.reviewsCount = prod.reviews.length;
    });

    // Seed products
    const createdProducts = await Product.create(products);
    console.log(`${createdProducts.length} Products inserted.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
