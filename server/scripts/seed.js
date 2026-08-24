import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';

dotenv.config();

const products = [
  {
    name: "AERO-GRAVITY OVERSIZED HOODIE",
    description: "Premium heavyweight 450GSM loopback cotton hoodie. Drop shoulder fit, double layered hood, ribbed trims, and high-density screenprint branding at chest. Built to endure.",
    price: 120,
    discount: 15,
    category: "Men",
    subcategory: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Slate Black", "Off-White", "Acid Grey"],
    brand: "Apex Collective",
    ratings: 4.8,
    reviewsCount: 3,
    soldCount: 120,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1556821840-410e567df3c9?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2 },
      { url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 3 }
    ],
    stock: 25,
    reviews: []
  },
  {
    name: "UTILITY PARATROOPER CARGO PANTS",
    description: "Heavy cotton-twill cargo pants. Adjustable ankle-straps, multi-pocket tactical storage layout, detailed paneling, and knee pleats for maximum range of movement.",
    price: 140,
    discount: 0,
    category: "Men",
    subcategory: "Cargo",
    sizes: ["30", "32", "34", "36"],
    colors: ["Olive Drab", "Midnight Black", "Desert Sand"],
    brand: "Terrain Labs",
    ratings: 4.6,
    reviewsCount: 2,
    soldCount: 85,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2 }
    ],
    stock: 15,
    reviews: []
  },
  {
    name: "NEON-MATRIX EMBROIDERED T-SHIRT",
    description: "Oversized fit streetwear graphic tee. 240GSM cotton fabric with neon typography details embroidered across front chest. Bio-washed for soft feel.",
    price: 65,
    discount: 10,
    category: "Women",
    subcategory: "T Shirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cyber Pink", "Matte Black", "Chalk White"],
    brand: "Asphalt Rebel",
    ratings: 4.7,
    reviewsCount: 4,
    soldCount: 210,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2 }
    ],
    stock: 40,
    reviews: []
  },
  {
    name: "CYBER-SHELL WATERPROOF WINDBREAKER",
    description: "Technical windbreaker jacket. Fully taped seams, YKK water-repellent zippers, custom drawcords, and reflective sleeve logos. Ideal for winter and city utility.",
    price: 210,
    discount: 5,
    category: "Women",
    subcategory: "Jackets",
    sizes: ["S", "M", "L"],
    colors: ["Solar Flare Yellow", "Carbon Grey"],
    brand: "Apex Collective",
    ratings: 4.9,
    reviewsCount: 5,
    soldCount: 95,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 }
    ],
    stock: 10,
    reviews: []
  },
  {
    name: "APEX-STRETCH KIDS MINI HOODIE",
    description: "Ultra-comfy, downscaled version of our signature streetwear hoodie. Engineered for active kids with premium stretch organic cotton fabric.",
    price: 80,
    discount: 20,
    category: "Kids",
    subcategory: "Hoodies",
    sizes: ["6Y", "8Y", "10Y", "12Y"],
    colors: ["Sunset Amber", "Charcoal Grey"],
    brand: "Apex Collective",
    ratings: 4.4,
    reviewsCount: 1,
    soldCount: 45,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 }
    ],
    stock: 30,
    reviews: []
  },
  {
    name: "RETRO RUNNER SNEAKERS V1",
    description: "Futuristic multi-layered runners. Breathable mesh underlays, suede overlays, chunky custom-molded EVA midsoles, and neon TPU heels for unmatched premium aesthetic.",
    price: 180,
    discount: 0,
    category: "Sneakers",
    subcategory: "Sneakers",
    sizes: ["8", "9", "10", "11"],
    colors: ["Neon White", "Triple Black"],
    brand: "Terrain Labs",
    ratings: 4.9,
    reviewsCount: 8,
    soldCount: 340,
    isFeatured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 2 },
      { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 3 }
    ],
    stock: 20,
    reviews: []
  },
  {
    name: "TERRAIN DESERT SATELLITE KICKS",
    description: "Premium nubuck high-top sneakers. Dynamic lacing system, high traction rubber outsoles, and detailed brand identity elements. Premium comfort.",
    price: 240,
    discount: 10,
    category: "Sneakers",
    subcategory: "Sneakers",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Desert Sandstone", "Obsidian Black"],
    brand: "Terrain Labs",
    ratings: 4.7,
    reviewsCount: 3,
    soldCount: 150,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 }
    ],
    stock: 12,
    reviews: []
  },
  {
    name: "ASPHALT REBEL STRAPBACK CAP",
    description: "Unstructured 6-panel strapback cap. Vintage stone washed cotton canvas, embroidered logo at the front, and adjustable metal buckle.",
    price: 45,
    discount: 0,
    category: "Accessories",
    subcategory: "Caps",
    sizes: ["One Size"],
    colors: ["Stone Wash Grey", "Deep Indigo Blue"],
    brand: "Asphalt Rebel",
    ratings: 4.3,
    reviewsCount: 1,
    soldCount: 50,
    isFeatured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80", isPrimary: true, sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&w=800&q=80", isPrimary: false, sortOrder: 1 }
    ],
    stock: 50,
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
    products.forEach((prod) => {
      prod.createdBy = adminUser._id;
      prod.reviews = [
        {
          user: standardUser._id,
          name: standardUser.name,
          rating: Math.round(prod.ratings),
          comment: `Absolutely loved this! The quality is top-notch and exactly as described.`
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
