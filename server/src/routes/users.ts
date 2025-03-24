import express from 'express';
import { supabase } from '../index';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { UserProfile, Address } from '../types';

const router = express.Router();

interface GetProfileRequest extends AuthRequest {}

interface UpdateProfileRequest extends AuthRequest {
  body: Partial<UserProfile>;
}

interface GetAddressesRequest extends AuthRequest {}

interface AddAddressRequest extends AuthRequest {
  body: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
}

interface UpdateAddressRequest extends AuthRequest {
  params: {
    id: string;
  };
  body: Partial<Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
}

interface DeleteAddressRequest extends AuthRequest {
  params: {
    id: string;
  };
}

// Get user profile
router.get('/profile', authenticateUser, async (req: GetProfileRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req: UpdateProfileRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(req.body)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user addresses
router.get('/addresses', authenticateUser, async (req: GetAddressesRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add new address
router.post('/addresses', authenticateUser, async (req: AddAddressRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { is_default, ...addressData } = req.body;

    // If this is the default address, update other addresses
    if (is_default) {
      const { error: updateError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    }

    // Create new address
    const { data, error } = await supabase
      .from('addresses')
      .insert([{ ...addressData, is_default, user_id: userId }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update address
router.put('/addresses/:id', authenticateUser, async (req: UpdateAddressRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { is_default, ...addressData } = req.body;

    // If this is being set as default, update other addresses
    if (is_default) {
      const { error: updateError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    }

    const { data, error } = await supabase
      .from('addresses')
      .update({ ...addressData, is_default })
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete address
router.delete('/addresses/:id', authenticateUser, async (req: DeleteAddressRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('addresses')
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