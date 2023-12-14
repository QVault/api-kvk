import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Context } from 'hono';
let supabase: SupabaseClient;

function getSupabaseClient(c: Context): SupabaseClient {
	if (!supabase) {
		const SUPABASE_URL: string = c.env.SUPABASE_URL;
		const SUPABASE_KEY: string = c.env.SUPABASE_KEY;
		supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
	}
	return supabase;
}

export { getSupabaseClient };
