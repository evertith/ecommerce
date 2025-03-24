import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    // Simulate API call to fetch product details
    setLoading(true);
    setTimeout(() => {
      setProduct({
        id: Number(id),
        name: "Premium Wireless Headphones",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Electronics",
        rating: 4.8,
        description: "Experience crystal-clear sound with our Premium Wireless Headphones. These lightweight and comfortable headphones feature active noise cancellation, 40-hour battery life, and premium build quality. Perfect for music lovers, gamers, and professionals alike.",
        colors: ['Black', 'White', 'Blue'],
        inStock: true
      });

      setReviews([
        {
          id: 1,
          userName: "John Smith",
          rating: 5,
          comment: "Incredible sound quality and the noise cancellation is top-notch. Very comfortable to wear for long periods.",
          date: "2023-03-15"
        },
        {
          id: 2,
          userName: "Sarah Johnson",
          rating: 4,
          comment: "Great headphones with excellent battery life. The only small issue is that the ear cups can get a bit warm after extended use.",
          date: "2023-02-28"
        },
        {
          id: 3,
          userName: "Michael Chen",
          rating: 5,
          comment: "Perfect sound, great build quality, and very comfortable. These are now my go-to headphones for everything.",
          date: "2023-01-20"
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [id]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container-custom py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn bg-secondary">
          Back to Products
        </Link>
      </div>
    );
  }

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-gradient-${product.id}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-gradient-${product.id})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-star-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="container-custom py-12">
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
              <span className="ml-1 text-gray-500 md:ml-2 line-clamp-1">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden bg-white p-4 border border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">({product.rating}) · {reviews.length} reviews</span>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-6">
            {formattedPrice(product.price)}
          </div>
          
          {/* Color Selection */}
          {product.colors && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 px-3 rounded border ${
                      selectedColor === color
                        ? 'border-secondary ring-2 ring-secondary'
                        : 'border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          {product.sizes && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-10 flex items-center justify-center rounded border ${
                      selectedSize === size
                        ? 'border-secondary bg-secondary text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex border border-gray-300 rounded w-32">
              <button
                onClick={decrementQuantity}
                className="px-3 py-1 border-r border-gray-300 text-gray-500 hover:bg-gray-100"
              >
                -
              </button>
              <div className="flex-1 text-center py-1">{quantity}</div>
              <button
                onClick={incrementQuantity}
                className="px-3 py-1 border-l border-gray-300 text-gray-500 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="flex gap-4 mb-8">
            <button className="btn bg-secondary hover:bg-secondary-dark w-full py-3">
              Add to Cart
            </button>
            <button className="p-3 border border-gray-300 rounded hover:bg-gray-50">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {/* Product Availability */}
          <div className="flex items-center mb-6">
            {product.inStock ? (
              <>
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-600 font-medium">In Stock</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs: Description and Reviews */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-b-2 border-secondary text-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-secondary text-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">{product.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>
              
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-gray-900 mr-2">{review.userName}</span>
                        <span className="text-sm text-gray-500">on {new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 