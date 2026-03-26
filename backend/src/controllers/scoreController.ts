import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addScore = async (req: AuthRequest, res: Response) => {
  try {
    const { score } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (typeof score !== 'number' || score < 1 || score > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    // Insert new score
    const { data: newScore, error: insertError } = await supabase
      .from('scores')
      .insert({ user_id: userId, score })
      .select()
      .single();

    if (insertError) throw insertError;

    // Enforce max 5 scores: find all scores ordered by date DESC
    const { data: userScores, error: fetchError } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (fetchError) throw fetchError;

    if (userScores && userScores.length > 5) {
      // Delete the oldest ones (from index 5 onwards)
      const idsToDelete = userScores.slice(5).map(s => s.id);
      
      const { error: deleteError } = await supabase
        .from('scores')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) throw deleteError;
    }

    res.status(201).json(newScore);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getScores = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
