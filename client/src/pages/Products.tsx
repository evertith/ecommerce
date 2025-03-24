import { useState } from 'react';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [sortBy, setSortBy] = useState('featured');

  // Simulated product data with consistent image dimensions
  const products = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80',
      description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop&q=80',
      description: 'Advanced smartwatch with health tracking and notifications.',
    },
    {
      id: '3',
      name: 'Laptop Backpack',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80',
      description: 'Durable and spacious laptop backpack with multiple compartments.',
    },
    {
      id: '4',
      name: 'Wireless Mouse',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&q=80',
      description: 'Ergonomic wireless mouse with precise tracking and long battery life.',
    },
    {
      id: '5',
      name: 'Mechanical Keyboard',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop&q=80',
      description: 'RGB mechanical keyboard with custom switches and keycaps.',
    },
    {
      id: '6',
      name: 'USB-C Hub',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop&q=80',
      description: 'Multi-port USB-C hub with HDMI, USB, and card reader support.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="h-[500px]">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 