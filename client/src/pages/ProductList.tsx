import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { productApi } from '../services/api';
import { Product } from '../types';

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  sort: string;
}

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: categoryParam ? [categoryParam] : [],
    sort: 'featured'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getAll();
        setProducts(response.data || []);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting whenever products or filters change
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category if any selected
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category_id)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );
    
    // Apply sorting
    switch (filters.sort) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      // 'featured' is default, no sorting needed
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, filters]);

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      
      if (isSelected) {
        // Remove the category
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else {
        // Add the category
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };

  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  // Handle sorting change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      sort: event.target.value
    }));
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-600 hover:text-secondary">Home</Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-gray-500 md:ml-2">Products</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar - Mobile Toggle */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-center bg-white p-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Filter Sidebar */}
        <div className={`lg:w-1/4 lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            {/* Categories Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="category-electronics"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                    checked={filters.categories.includes('electronics')}
                    onChange={() => handleCategoryChange('electronics')}
                  />
                  <label htmlFor="category-electronics" className="ml-2 text-sm text-gray-700">
                    Electronics
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="category-clothing"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                    checked={filters.categories.includes('clothing')}
                    onChange={() => handleCategoryChange('clothing')}
                  />
                  <label htmlFor="category-clothing" className="ml-2 text-sm text-gray-700">
                    Clothing
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="category-home"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                    checked={filters.categories.includes('home')}
                    onChange={() => handleCategoryChange('home')}
                  />
                  <label htmlFor="category-home" className="ml-2 text-sm text-gray-700">
                    Home & Kitchen
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="category-beauty"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                    checked={filters.categories.includes('beauty')}
                    onChange={() => handleCategoryChange('beauty')}
                  />
                  <label htmlFor="category-beauty" className="ml-2 text-sm text-gray-700">
                    Beauty
                  </label>
                </div>
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePriceRangeChange(0, 50)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    filters.priceRange[0] === 0 && filters.priceRange[1] === 50
                      ? 'bg-secondary text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Under $50
                </button>
                <button
                  onClick={() => handlePriceRangeChange(50, 100)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    filters.priceRange[0] === 50 && filters.priceRange[1] === 100
                      ? 'bg-secondary text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  $50 - $100
                </button>
                <button
                  onClick={() => handlePriceRangeChange(100, 200)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    filters.priceRange[0] === 100 && filters.priceRange[1] === 200
                      ? 'bg-secondary text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  $100 - $200
                </button>
                <button
                  onClick={() => handlePriceRangeChange(200, 1000)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    filters.priceRange[0] === 200 && filters.priceRange[1] === 1000
                      ? 'bg-secondary text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  $200 & Above
                </button>
              </div>
            </div>
            
            {/* Reset Filters */}
            <button
              onClick={() => setFilters({
                priceRange: [0, 1000],
                categories: [],
                sort: 'featured'
              })}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-sm text-gray-600">
              {loading ? 'Loading products...' : `Showing ${filteredProducts.length} products`}
            </p>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-sm text-gray-700">Sort by:</label>
              <select
                id="sort"
                value={filters.sort}
                onChange={handleSortChange}
                className="rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-secondary focus:outline-none focus:ring-secondary"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
          
          {/* Products */}
          {loading ? (
            <div className="flex justify-center items-center h-72">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList; 