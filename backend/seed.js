import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './model/User.js';
import { Product } from './model/Product.js';
import { Category } from './model/Category.js';
import { Brand } from './model/Brand.js';
import { Order } from './model/Order.js';
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Books', value: 'books' },
    ]);

    // Create brands
    const brands = await Brand.insertMany([
      { label: 'Apple', value: 'apple' },
      { label: 'Nike', value: 'nike' },
      { label: 'Penguin', value: 'penguin' },
    ]);

    // Create users with hashed passwords
    const users = await User.insertMany([
      { email: 'admin@example.com', password: await bcrypt.hash('admin123', 10), role: 'admin', name: 'Admin User' },
      { email: 'user1@example.com', password: await bcrypt.hash('user123', 10), role: 'user', name: 'User One' },
      { email: 'user2@example.com', password: await bcrypt.hash('user123', 10), role: 'user', name: 'User Two' },
    ]);

    // Fetch products from DummyJSON
    const response = await fetch('https://dummyjson.com/products?limit=30');
    const data = await response.json();
    const dummyProducts = data.products;

    // Helper for unique titles
    const usedTitles = new Set();
    const placeholderImg = 'https://via.placeholder.com/300x300?text=No+Image';

    const mappedProducts = dummyProducts.map((p, idx) => {
      // Title uniqueness
      let title = p.title || `Product ${idx+1}`;
      if (usedTitles.has(title)) {
        title = `${title} (${idx+1})`;
      }
      usedTitles.add(title);

      // Description
      const description = p.description || 'No description';
      // Price
      const price = typeof p.price === 'number' && p.price >= 1 ? p.price : 1;
      // Discount
      const discount = typeof p.discountPercentage === 'number' && p.discountPercentage >= 1 ? p.discountPercentage : 1;
      // Rating
      let rating = typeof p.rating === 'number' ? p.rating : 0;
      if (rating < 0) rating = 0;
      if (rating > 5) rating = 5;
      // Stock
      const stock = typeof p.stock === 'number' && p.stock >= 0 ? p.stock : 0;
      // Brand
      const brand = p.brand && p.brand.trim() ? p.brand : 'Unknown';
      // Category
      const category = p.category && p.category.trim() ? p.category : 'General';
      // Images (ensure at least 4)
      let images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [];
      let thumbnail = p.thumbnail && typeof p.thumbnail === 'string' && p.thumbnail.trim() ? p.thumbnail : '';
      if (!thumbnail && images.length > 0) thumbnail = images[0];
      if (!thumbnail) thumbnail = placeholderImg;
      if (images.length === 0) images = [thumbnail];
      while (images.length < 4) images.push(images[images.length - 1] || placeholderImg);

      // Highlights (dummy)
      const highlights = [
        `Top feature of ${title}`,
        `Another highlight for ${title}`,
        `Best in ${category}`
      ];

      // Breadcrumbs (simple)
      const breadcrumbs = [
        { id: 1, name: 'Home', href: '/' },
        { id: 2, name: category, href: `/category/${category}` },
        { id: 3, name: title, href: `/product-detail/${idx+1}` }
      ];

      return {
        title,
        description,
        price,
        discountPercentage: discount,
        rating,
        stock,
        brand,
        category,
        thumbnail,
        images,
        colors: [],
        sizes: [],
        highlights,
        breadcrumbs,
        discountPrice: price - (price * (discount || 0) / 100),
      };
    });

    // Insert mapped products
    const products = await Product.insertMany(mappedProducts);

    // Create orders
    await Order.insertMany([
      {
        items: [
          { product: products[0], quantity: 1, price: products[0].discountPrice },
        ],
        totalAmount: products[0].discountPrice,
        totalItems: 1,
        user: users[1]._id,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        status: 'delivered',
        selectedAddress: { street: '123 Main St', city: 'Metropolis', zip: '12345' },
      },
      {
        items: [
          { product: products[1], quantity: 2, price: products[1].discountPrice },
        ],
        totalAmount: products[1].discountPrice * 2,
        totalItems: 2,
        user: users[2]._id,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        status: 'pending',
        selectedAddress: { street: '456 Side St', city: 'Gotham', zip: '67890' },
      },
    ]);

    console.log('Dummy data inserted!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 