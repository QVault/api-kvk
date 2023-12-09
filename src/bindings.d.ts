import { KVNamespace } from '@cloudflare/workers-types';

export type Environment = {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	KVK_REGISTRY: KVNamespace;
};

export interface Env extends Environment {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	KVK_REGISTRY: KVNamespace;
}
