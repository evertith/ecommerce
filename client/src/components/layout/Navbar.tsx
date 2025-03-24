import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-secondary">ShopSmart</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-secondary">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-secondary">Shop</Link>
            <Link to="/products?category=electronics" className="text-gray-600 hover:text-secondary">Electronics</Link>
            <Link to="/products?category=clothing" className="text-gray-600 hover:text-secondary">Clothing</Link>
            <Link to="/products?category=home" className="text-gray-600 hover:text-secondary">Home & Living</Link>
          </nav>
          
          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* User Account */}
            <Link to="/account" className="text-gray-600 hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="text-gray-600 hover:text-secondary relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      {isSearchOpen && (
        <div className="py-3 bg-gray-50 border-t border-gray-200">
          <div className="container-custom">
            <form className="flex w-full">
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button 
                type="submit"
                className="bg-secondary text-white px-4 rounded-r-md hover:bg-opacity-90"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-3">
          <div className="container-custom flex flex-col space-y-3">
            <Link to="/" className="text-gray-600 hover:text-secondary py-2">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-secondary py-2">Shop</Link>
            <Link to="/products?category=electronics" className="text-gray-600 hover:text-secondary py-2">Electronics</Link>
            <Link to="/products?category=clothing" className="text-gray-600 hover:text-secondary py-2">Clothing</Link>
            <Link to="/products?category=home" className="text-gray-600 hover:text-secondary py-2">Home & Living</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 