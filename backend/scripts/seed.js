const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Sample products data
const sampleProducts = [
  {
    name: "Elegant Diamond Ring",
    description: "A stunning diamond ring crafted with precision and elegance. Perfect for engagements and special occasions.",
    price: 45000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Elegant Diamond Ring - Main View",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Elegant Diamond Ring - Side View",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Elegant Diamond Ring - Detail View",
        isPrimary: false
      }
    ],
    category: "rings",
    stockQuantity: 15,
    isActive: true,
    isFeatured: true,
    isNew: true,
    popularity: 95,
    tags: ["diamond", "engagement", "luxury", "gold"],
    specifications: {
      material: "18K Gold",
      weight: "3.2g",
      dimensions: "Size 6-8 available",
      gemstone: "1 Carat Diamond",
      purity: "18K"
    }
  },
  {
    name: "Pearl Necklace Set",
    description: "Exquisite pearl necklace with matching earrings. Timeless elegance for any occasion.",
    price: 28000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Pearl Necklace Set - Complete Set",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Pearl Necklace Set - Necklace Detail",
        isPrimary: false
      }
    ],
    category: "necklaces",
    stockQuantity: 8,
    isActive: true,
    isFeatured: true,
    isNew: false,
    popularity: 88,
    tags: ["pearl", "necklace", "set", "elegant"],
    specifications: {
      material: "Sterling Silver",
      weight: "25g",
      dimensions: "18 inch necklace",
      gemstone: "Freshwater Pearls",
      purity: "925 Silver"
    }
  },
  {
    name: "Gold Hoop Earrings",
    description: "Classic gold hoop earrings that complement any outfit. Perfect for daily wear or special occasions.",
    price: 12000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1635767582909-345fa88ada70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Gold Hoop Earrings - Pair",
        isPrimary: true
      }
    ],
    category: "earrings",
    stockQuantity: 25,
    isActive: true,
    isFeatured: false,
    isNew: true,
    popularity: 75,
    tags: ["gold", "hoops", "classic", "daily wear"],
    specifications: {
      material: "14K Gold",
      weight: "2.1g",
      dimensions: "2cm diameter",
      purity: "14K"
    }
  },
  {
    name: "Silver Chain Bracelet",
    description: "Delicate silver chain bracelet with intricate design. Perfect for layering or wearing alone.",
    price: 8500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Silver Chain Bracelet",
        isPrimary: true
      }
    ],
    category: "bracelets",
    stockQuantity: 20,
    isActive: true,
    isFeatured: true,
    isNew: false,
    popularity: 82,
    tags: ["silver", "chain", "bracelet", "delicate"],
    specifications: {
      material: "Sterling Silver",
      weight: "8.5g",
      dimensions: "7-8 inch adjustable",
      purity: "925 Silver"
    }
  },
  {
    name: "Emerald Pendant",
    description: "Beautiful emerald pendant with gold chain. A statement piece that adds elegance to any outfit.",
    price: 35000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Emerald Pendant",
        isPrimary: true
      }
    ],
    category: "pendants",
    stockQuantity: 5,
    isActive: true,
    isFeatured: true,
    isNew: true,
    popularity: 90,
    tags: ["emerald", "pendant", "gold", "statement"],
    specifications: {
      material: "18K Gold",
      weight: "4.2g",
      dimensions: "2cm x 1.5cm pendant",
      gemstone: "Natural Emerald",
      purity: "18K"
    }
  },
  {
    name: "Gold Chain Necklace",
    description: "Classic gold chain necklace suitable for pendants or wearing alone. Versatile and timeless.",
    price: 18000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Gold Chain Necklace",
        isPrimary: true
      }
    ],
    category: "chains",
    stockQuantity: 12,
    isActive: true,
    isFeatured: false,
    isNew: false,
    popularity: 70,
    tags: ["gold", "chain", "necklace", "classic"],
    specifications: {
      material: "14K Gold",
      weight: "12g",
      dimensions: "20 inch length",
      purity: "14K"
    }
  }
];

// Sample admin user
const adminUser = {
  firstName: "Admin",
  lastName: "User",
  username: "admin",
  email: process.env.ADMIN_EMAIL || "admin@zaffira.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
  role: "admin",
  phone: "+91-9999999999",
  isActive: true
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log('Created admin user:', admin.email);

    // Create products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} products`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();