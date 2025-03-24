import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
  },
  {
    name: 'Clothing',
    description: 'Fashion items and accessories',
  },
  {
    name: 'Home & Kitchen',
    description: 'Home goods and kitchen appliances',
  },
  {
    name: 'Beauty',
    description: 'Beauty and personal care products',
  },
];

const products = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock_quantity: 50,
    category_id: null, // Will be updated after categories are created
    is_active: true,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitoring',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
    stock_quantity: 30,
    category_id: null,
    is_active: true,
  },
  {
    name: 'Classic T-Shirt',
    description: 'Comfortable cotton t-shirt in various colors',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stock_quantity: 100,
    category_id: null,
    is_active: true,
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1517661931470-2a9d7831f7e3?w=500',
    stock_quantity: 25,
    category_id: null,
    is_active: true,
  },
  {
    name: 'Face Moisturizer',
    description: 'Hydrating face moisturizer for all skin types',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
    stock_quantity: 75,
    category_id: null,
    is_active: true,
  },
];

async function seedDatabase() {
  try {
    // First, insert categories
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (categoryError) throw categoryError;

    // Update product category_ids based on category names
    const updatedProducts = products.map(product => {
      let categoryId = null;
      if (product.name.includes('Headphones') || product.name.includes('Watch')) {
        categoryId = categoryData.find(cat => cat.name === 'Electronics')?.id;
      } else if (product.name.includes('T-Shirt')) {
        categoryId = categoryData.find(cat => cat.name === 'Clothing')?.id;
      } else if (product.name.includes('Coffee Maker')) {
        categoryId = categoryData.find(cat => cat.name === 'Home & Kitchen')?.id;
      } else if (product.name.includes('Moisturizer')) {
        categoryId = categoryData.find(cat => cat.name === 'Beauty')?.id;
      }
      return { ...product, category_id: categoryId };
    });

    // Insert products
    const { error: productError } = await supabase
      .from('products')
      .insert(updatedProducts);

    if (productError) throw productError;

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase(); 