import { createClient } from '@supabase/supabase-js';
import { SYNC } from '../constants';

export const supabase = createClient(SYNC.url, SYNC.anonKey);
