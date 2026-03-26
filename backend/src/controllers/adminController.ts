import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get all users (Admin)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, charity_percentage, charities(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Run monthly draw
export const runDraw = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Generate 5 random numbers (1-45) without duplicates
    const winningNumbers: number[] = [];
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) {
        winningNumbers.push(num);
      }
    }

    // 2. Fetch total active subscriptions to calculate prize pool
    const { count, error: countError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
      
    if (countError) throw countError;

    // Assuming $10 per subscription, total prize pool is 50% of revenue. Example logic:
    const baseRevenue = (count || 0) * 10;
    const currentPool = baseRevenue > 0 ? baseRevenue * 0.5 : 1000; // Mock 1000 default

    // Check for previous rollover
    const { data: previousDraw } = await supabase
      .from('draws')
      .select('jackpot_rollover')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const rollover = previousDraw?.jackpot_rollover || 0;
    const totalJackpot = currentPool + rollover;

    // Prize distribution
    const prize5 = totalJackpot * 0.40;
    const prize4 = totalJackpot * 0.35;
    const prize3 = totalJackpot * 0.25;

    // 3. Create Draw record
    const { data: newDraw, error: drawError } = await supabase
      .from('draws')
      .insert({
        winning_numbers: winningNumbers,
        status: 'completed',
        jackpot_rollover: 0 // Default 0
      })
      .select()
      .single();

    if (drawError) throw drawError;

    // 4. Find Winners by matching users' latest 5 scores
    const { data: allScores, error: scoresError } = await supabase
      .from('scores')
      .select('id, user_id, score');

    if (scoresError) throw scoresError;

    // Group scores by user
    const userScoresMap: Record<string, number[]> = {};
    allScores?.forEach(s => {
      if (!userScoresMap[s.user_id]) userScoresMap[s.user_id] = [];
      userScoresMap[s.user_id].push(s.score);
    });

    const winners: any[] = [];
    let jackpotWon = false;
    let match4Won = false;
    let match3Won = false;

    // Evaluate
    for (const [userId, scores] of Object.entries(userScoresMap)) {
      const matched = scores.filter(s => winningNumbers.includes(s)).length;
      
      if (matched >= 3) {
        let amount = 0;
        if (matched === 5) { amount = prize5; jackpotWon = true; }
        if (matched === 4) { amount = prize4; match4Won = true; }
        if (matched === 3) { amount = prize3; match3Won = true; }

        winners.push({
          draw_id: newDraw.id,
          user_id: userId,
          matched_count: matched,
          prize_amount: amount
        });
      }
    }

    // 5. Insert Winners
    if (winners.length > 0) {
      const { error: winError } = await supabase.from('winnings').insert(winners);
      if (winError) throw winError;
    }

    // 6. Handle Rollover if nobody won specific tiers
    let newRollover = 0;
    if (!jackpotWon) newRollover += prize5;
    if (!match4Won) newRollover += prize4;
    if (!match3Won) newRollover += prize3;

    if (newRollover > 0) {
      await supabase.from('draws').update({ jackpot_rollover: newRollover }).eq('id', newDraw.id);
      newDraw.jackpot_rollover = newRollover;
    }

    res.json({
      draw: newDraw,
      winners_count: winners.length,
      winners
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error', fullError: error });
  }
};
