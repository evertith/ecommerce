import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { productApi } from '../services/api';
import { Product } from '../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getById(id!);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600">{error || 'The product you\'re looking for doesn\'t exist or has been removed.'}</p>
          <Link to="/products" className="mt-4 inline-block text-secondary hover:text-secondary-dark">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-600 hover:text-secondary">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/products" className="ml-1 text-gray-600 hover:text-secondary md:ml-2">Products</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image_url || ''}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
            {product.rating && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-600">{product.description || 'No description available.'}</p>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <p className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            {product.stock_quantity > 0 && (
              <p className="text-sm text-gray-600">{product.stock_quantity} units available</p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-input w-20"
              disabled={product.stock_quantity === 0}
            >
              {[...Array(Math.min(5, product.stock_quantity))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary flex-1"
              disabled={product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.category_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">SKU</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {product.is_active ? 'Active' : 'Inactive'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 