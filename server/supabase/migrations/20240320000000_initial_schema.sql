-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address_id UUID REFERENCES addresses(id),
    payment_status payment_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create product_reviews table
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES user_profiles(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Create wishlist table
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    product_id UUID REFERENCES products(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Products are insertable by authenticated users"
    ON products FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users"
    ON products FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    USING (true);

-- User profiles policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Addresses policies
CREATE POLICY "Users can view their own addresses"
    ON addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
    ON addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
    ON addresses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
    ON addresses FOR DELETE
    USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view their own cart items"
    ON cart_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
    ON cart_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
    ON cart_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
    ON cart_items FOR DELETE
    USING (auth.uid() = user_id);

-- Product reviews policies
CREATE POLICY "Product reviews are viewable by everyone"
    ON product_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own reviews"
    ON product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON product_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON product_reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist"
    ON wishlist FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items"
    ON wishlist FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
    ON wishlist FOR DELETE
    USING (auth.uid() = user_id);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_cart(user_id UUID)
RETURNS TABLE (
    product_id UUID,
    name VARCHAR,
    price DECIMAL,
    image_url TEXT,
    quantity INTEGER,
    subtotal DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as product_id,
        p.name,
        p.price,
        p.image_url,
        ci.quantity,
        (p.price * ci.quantity) as subtotal
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = get_user_cart.user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_order_from_cart(user_id UUID, shipping_address_id UUID)
RETURNS UUID AS $$
DECLARE
    new_order_id UUID;
    cart_total DECIMAL;
BEGIN
    -- Calculate cart total
    SELECT COALESCE(SUM(p.price * ci.quantity), 0)
    INTO cart_total
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = create_order_from_cart.user_id;

    -- Create order
    INSERT INTO orders (user_id, total_amount, shipping_address_id)
    VALUES (create_order_from_cart.user_id, cart_total, create_order_from_cart.shipping_address_id)
    RETURNING id INTO new_order_id;

    -- Create order items and update product stock
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    SELECT 
        new_order_id,
        ci.product_id,
        ci.quantity,
        p.price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = create_order_from_cart.user_id;

    -- Update product stock
    UPDATE products p
    SET stock_quantity = stock_quantity - ci.quantity
    FROM cart_items ci
    WHERE ci.product_id = p.id
    AND ci.user_id = create_order_from_cart.user_id;

    -- Clear cart
    DELETE FROM cart_items
    WHERE user_id = create_order_from_cart.user_id;

    RETURN new_order_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
CREATE INDEX idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_wishlist_product ON wishlist(product_id); 