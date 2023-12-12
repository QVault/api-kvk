import { KVNamespace } from '@cloudflare/workers-types';

export type Environment = {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	KVK_REGISTRY: KVNamespace;
	DB: D1Database;
	R2: R2Bucket;
};

interface R2Bucket {
	get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<string | ArrayBuffer | ReadableStream | null>;
	put(key: string, value: string | ReadableStream | ArrayBuffer | FormData, options?: KVNamespacePutOptions): Promise<void>;
	delete(key: string): Promise<void>;
}

export interface Env extends Environment {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	KVK_REGISTRY: KVNamespace;
	DB: D1Database;
	R2: R2Bucket;
}
