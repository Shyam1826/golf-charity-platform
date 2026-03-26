import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getCharities = async (req: Request, res: Response) => {
  try {
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .order('name');
      
    if (error) throw error;
    res.json(charities);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
