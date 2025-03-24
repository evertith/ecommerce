import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container-custom py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-9xl font-bold text-secondary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn bg-secondary">
            Go to Homepage
          </Link>
          <Link to="/products" className="btn bg-gray-100 hover:bg-gray-200 text-gray-800">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 