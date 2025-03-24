import express, { Request } from 'express';
import { supabase } from '../index';
import { Category } from '../types';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

interface GetCategoryRequest extends Request {
  params: {
    id: string;
  };
}

interface CreateCategoryRequest extends Request {
  body: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
}

interface UpdateCategoryRequest extends Request {
  params: {
    id: string;
  };
  body: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;
}

interface DeleteCategoryRequest extends Request {
  params: {
    id: string;
  };
}

interface GetSubcategoriesRequest extends Request {
  params: {
    id: string;
  };
}

// Get all categories
router.get('/', async (req: Request, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req: GetCategoryRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create category (admin only)
router.post('/', authenticateUser, async (req: CreateCategoryRequest & AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const category = req.body;

    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update category (admin only)
router.put('/:id', authenticateUser, async (req: UpdateCategoryRequest & AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateUser, async (req: DeleteCategoryRequest & AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get subcategories
router.get('/:id/subcategories', async (req: GetSubcategoriesRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', req.params.id)
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 