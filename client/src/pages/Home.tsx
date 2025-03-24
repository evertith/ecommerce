import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { productApi } from '../services/api';
import { Product } from '../types';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getAll();
        // Get the first 4 products as featured products
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (err) {
        setError('Failed to fetch featured products. Please try again later.');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary-light opacity-90"></div>
        <div className="container-custom relative z-10 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl md:text-5xl font-bold leading-tight">Discover Quality Products for Every Need</h1>
            <p className="mb-8 text-lg md:text-xl text-gray-200">Shop our curated collection of premium products at competitive prices. Free shipping on orders over $50!</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn bg-secondary hover:bg-secondary-dark">
                Shop Now
              </Link>
              <Link to="/products?category=new" className="btn bg-transparent border-2 border-white hover:bg-white hover:text-primary-dark">
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/products?category=electronics" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Electronics" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-dark bg-opacity-30 group-hover:bg-opacity-20 transition-opacity"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold">Electronics</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=clothing" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Clothing" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-dark bg-opacity-30 group-hover:bg-opacity-20 transition-opacity"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold">Clothing</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=home" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Home & Kitchen" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-dark bg-opacity-30 group-hover:bg-opacity-20 transition-opacity"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold">Home & Kitchen</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=beauty" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Beauty" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-dark bg-opacity-30 group-hover:bg-opacity-20 transition-opacity"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold">Beauty</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-secondary hover:text-secondary-dark font-medium">
              View All <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-72">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-secondary-light text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Get 15% Off Your First Order</h2>
              <p className="text-lg text-blue-100">Sign up for our newsletter and receive a discount code</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-gray-900 min-w-[250px]"
                />
                <button className="btn bg-white text-secondary hover:bg-gray-100">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 