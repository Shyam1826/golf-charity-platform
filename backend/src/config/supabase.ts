import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Missing Supabase credentials in .env. Please configure them before using DB operations.");
}

// Using Service Role Key so the backend can bypass RLS, or we can use anon key if RLS is strictly defined.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
