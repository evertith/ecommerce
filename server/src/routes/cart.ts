import express from 'express';
import { supabase } from '../index';
import { CartItem } from '../types';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user's cart
router.get('/', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .rpc('get_user_cart', { user_id: userId });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { product_id, quantity } = req.body;

    // Check if product exists and has enough stock
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', product_id)
      .single();

    if (productError) throw productError;

    if (!product || product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already exists in cart
    const { data: existingItem, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existingItem) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } else {
      // Create new cart item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id, quantity }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:id', authenticateUser, async (req: AuthRequest & { params: { id: string } }, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { quantity } = req.body;

    // Check if product has enough stock
    const { data: cartItem, error: cartError } = await supabase
      .from('cart_items')
      .select('product_id')
      .eq('id', req.params.id)
      .single();

    if (cartError) throw cartError;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', cartItem.product_id)
      .single();

    if (productError) throw productError;

    if (!product || product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:id', authenticateUser, async (req: AuthRequest & { params: { id: string } }, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 