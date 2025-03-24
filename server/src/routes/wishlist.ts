import express from 'express';
import { supabase } from '../index';
import { WishlistItem } from '../types';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

interface GetWishlistRequest extends AuthRequest {}

interface AddWishlistItemRequest extends AuthRequest {
  body: {
    product_id: string;
  };
}

interface RemoveWishlistItemRequest extends AuthRequest {
  params: {
    id: string;
  };
}

interface CheckWishlistItemRequest extends AuthRequest {
  params: {
    productId: string;
  };
}

// Get user's wishlist
router.get('/', authenticateUser, async (req: GetWishlistRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products (
          id,
          name,
          price,
          image_url,
          stock_quantity
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to wishlist
router.post('/', authenticateUser, async (req: AddWishlistItemRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { product_id } = req.body;

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single();

    if (productError) throw productError;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item is already in wishlist
    const { data: existingItem, error: existingError } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existingItem) {
      return res.status(400).json({ error: 'Item is already in wishlist' });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id: userId, product_id }])
      .select(`
        *,
        product:products (
          id,
          name,
          price,
          image_url,
          stock_quantity
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from wishlist
router.delete('/:id', authenticateUser, async (req: RemoveWishlistItemRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check if item is in wishlist
router.get('/check/:productId', authenticateUser, async (req: CheckWishlistItemRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', req.params.productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ isInWishlist: !!data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 