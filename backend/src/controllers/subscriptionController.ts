import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { plan_type } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Calculate end date based on plan
    const endDate = new Date();
    if (plan_type === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan_type === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      return res.status(400).json({ message: 'Invalid plan type, must be monthly or yearly' });
    }

    // Deactivate previous active subscriptions for the user
    await supabase.from('subscriptions')
      .update({ status: 'inactive' })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Insert new subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type,
        status: 'active',
        end_date: endDate.toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No Data" row missing

    if (data && new Date(data.end_date) < new Date()) {
      // Auto-expire if date passed
      await supabase.from('subscriptions')
        .update({ status: 'inactive' })
        .eq('id', data.id);
      return res.json({ active: false, message: 'Subscription expired' });
    }

    res.json({ active: !!data, subscription: data || null });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
