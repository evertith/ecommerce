export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  stock_quantity: number;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  parent?: Category;
  subcategories?: Category[];
  products?: Product[];
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  user_id: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address_id: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping_address?: Address;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 