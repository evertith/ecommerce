import express, { Request } from 'express';
import { supabase } from '../index';
import { ProductReview } from '../types';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

interface GetProductReviewsRequest extends Request {
  params: {
    productId: string;
  };
}

interface CreateReviewRequest extends AuthRequest {
  body: {
    product_id: string;
    rating: number;
    comment?: string;
  };
}

interface UpdateReviewRequest extends AuthRequest {
  params: {
    id: string;
  };
  body: {
    rating: number;
    comment?: string;
  };
}

interface DeleteReviewRequest extends AuthRequest {
  params: {
    id: string;
  };
}

// Get product reviews
router.get('/product/:productId', async (req: GetProductReviewsRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        user:user_profiles (
          full_name
        )
      `)
      .eq('product_id', req.params.productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticateUser, async (req: CreateReviewRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { product_id, rating, comment } = req.body;

    // Check if user has already reviewed this product
    const { data: existingReview, error: existingError } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', product_id)
      .eq('user_id', userId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Get delivered orders for this user and product
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'delivered');

    if (ordersError) throw ordersError;

    if (!orders || orders.length === 0) {
      return res.status(400).json({ error: 'You can only review products you have purchased' });
    }

    const orderIds = orders.map(order => order.id);

    // Check if user has purchased the product
    const { data: orderItems, error: orderError } = await supabase
      .from('order_items')
      .select('order_id')
      .eq('product_id', product_id)
      .in('order_id', orderIds);

    if (orderError) throw orderError;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: 'You can only review products you have purchased' });
    }

    const { data, error } = await supabase
      .from('product_reviews')
      .insert([{
        product_id,
        user_id: userId,
        rating,
        comment
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update review
router.put('/:id', authenticateUser, async (req: UpdateReviewRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { rating, comment } = req.body;

    const { data, error } = await supabase
      .from('product_reviews')
      .update({ rating, comment })
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', authenticateUser, async (req: DeleteReviewRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 