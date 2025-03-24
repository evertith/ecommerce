import express from 'express';
import { supabase } from '../index';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { Order } from '../types';

const router = express.Router();

interface GetOrdersRequest extends AuthRequest {}

interface GetOrderByIdRequest extends AuthRequest {
  params: {
    id: string;
  };
}

interface CreateOrderRequest extends AuthRequest {
  body: {
    shipping_address_id: string;
    payment_method: string;
  };
}

interface UpdateOrderStatusRequest extends AuthRequest {
  params: {
    id: string;
  };
  body: {
    status: Order['status'];
  };
}

interface CancelOrderRequest extends AuthRequest {
  params: {
    id: string;
  };
}

// Get user's orders
router.get('/', authenticateUser, async (req: GetOrdersRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            name,
            price,
            image_url
          )
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

// Get order details
router.get('/:id', authenticateUser, async (req: GetOrderByIdRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            name,
            price,
            image_url
          )
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create order from cart
router.post('/', authenticateUser, async (req: CreateOrderRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { shipping_address_id, payment_method } = req.body;

    // Call the create_order_from_cart function
    const { data, error } = await supabase
      .rpc('create_order_from_cart', {
        p_user_id: userId,
        p_shipping_address_id: shipping_address_id,
        p_payment_method: payment_method
      });

    if (error) throw error;

    if (!data) {
      return res.status(400).json({ error: 'Failed to create order' });
    }

    // Get the created order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            name,
            price,
            image_url
          )
        )
      `)
      .eq('id', data)
      .single();

    if (orderError) throw orderError;

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateUser, async (req: UpdateOrderStatusRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', authenticateUser, async (req: CancelOrderRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('user_id, status')
      .eq('id', req.params.id)
      .single();

    if (orderError) throw orderError;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow cancellation if user owns the order or is admin
    if (!isAdmin && order.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Only allow cancellation if order is pending
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 