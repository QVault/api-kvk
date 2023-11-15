import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Context } from 'hono';

function initSupabaseClient(c: Context): SupabaseClient {
	const SUPABASE_URL: string = c.env.SUPABASE_URL;
	const SUPABASE_KEY: string = c.env.SUPABASE_KEY;

	const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
	return supabase;
}

export { initSupabaseClient };
