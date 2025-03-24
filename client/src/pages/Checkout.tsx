import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface OrderSummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Partial<FormData> = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';

    // Phone validation
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Address validation
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.zipCode) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      errors.zipCode = 'Please enter a valid ZIP code';
    }
    if (!formData.country) errors.country = 'Country is required';

    // Payment validation
    if (!formData.cardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Please enter a valid card number';
    }
    if (!formData.cardName) errors.cardName = 'Cardholder name is required';
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    if (!formData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = 'Please enter a valid CVV';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOrderComplete(true);
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 0 ? 10 : 0;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  if (orderComplete) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We'll send you a confirmation email with your order details shortly.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={formErrors.email || "Enter your email"}
                    className={`form-input ${formErrors.email ? 'border-red-500 placeholder-red-500' : ''}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder={formErrors.firstName || "Enter your first name"}
                      className={`form-input ${formErrors.firstName ? 'border-red-500 placeholder-red-500' : ''}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={formErrors.lastName || "Enter your last name"}
                      className={`form-input ${formErrors.lastName ? 'border-red-500 placeholder-red-500' : ''}`}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={formErrors.phone || "Enter your phone number"}
                    className={`form-input ${formErrors.phone ? 'border-red-500 placeholder-red-500' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={formErrors.address || "Enter your address"}
                    className={`form-input ${formErrors.address ? 'border-red-500 placeholder-red-500' : ''}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={formErrors.city || "Enter your city"}
                      className={`form-input ${formErrors.city ? 'border-red-500 placeholder-red-500' : ''}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder={formErrors.state || "Enter your state"}
                      className={`form-input ${formErrors.state ? 'border-red-500 placeholder-red-500' : ''}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder={formErrors.zipCode || "Enter your ZIP code"}
                      className={`form-input ${formErrors.zipCode ? 'border-red-500 placeholder-red-500' : ''}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.country ? 'border-red-500 text-red-500' : ''}`}
                    >
                      <option value="">{formErrors.country || "Select a country"}</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="cardNumber" className="form-label">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder={formErrors.cardNumber || "1234 5678 9012 3456"}
                    className={`form-input ${formErrors.cardNumber ? 'border-red-500 placeholder-red-500' : ''}`}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="cardName" className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder={formErrors.cardName || "Enter cardholder name"}
                    className={`form-input ${formErrors.cardName ? 'border-red-500 placeholder-red-500' : ''}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder={formErrors.expiryDate || "MM/YY"}
                      className={`form-input ${formErrors.expiryDate ? 'border-red-500 placeholder-red-500' : ''}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="cvv" className="form-label">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder={formErrors.cvv || "Enter CVV"}
                      className={`form-input ${formErrors.cvv ? 'border-red-500 placeholder-red-500' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatPrice(calculateShipping())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(calculateTax())}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 