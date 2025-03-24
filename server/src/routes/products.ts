import express, { Request } from 'express';
import { supabase } from '../index';
import { Product } from '../types';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

interface GetProductRequest extends Request {
  params: {
    id: string;
  };
}

interface CreateProductRequest extends Request {
  body: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
}

interface UpdateProductRequest extends Request {
  params: {
    id: string;
  };
  body: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
}

interface DeleteProductRequest extends Request {
  params: {
    id: string;
  };
}

interface GetProductsByCategoryRequest extends Request {
  params: {
    categoryId: string;
  };
}

// Get all products
router.get('/', async (req: Request, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req: GetProductRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only)
router.post('/', authenticateUser, async (req: CreateProductRequest & AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const product = req.body;

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', authenticateUser, async (req: UpdateProductRequest & AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateUser, async (req: DeleteProductRequest & AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req: GetProductsByCategoryRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', req.params.categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 