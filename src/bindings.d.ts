import { KVNamespace } from '@cloudflare/workers-types';

export type Environment = {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	KVK_REGISTRY: KVNamespace;
	DB: D1Database;
};

export interface Env extends Environment {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	KVK_REGISTRY: KVNamespace;
	DB: D1Database;
}
