import { initSupabaseClient } from './supabaseClient';
import { Context } from 'hono';

async function insertBranch(c: Context, companyId: number, branch: { code: string; description: string; branchType: string }) {
	const supabase = initSupabaseClient(c);

	const { data, error } = await supabase.from('branch').insert([
		{
			company_id: companyId,
			code: branch.code,
			description: branch.description,
			branch_type: branch.branchType,
		},
	]);

	if (error) {
		console.error('Error inserting branch:', error);
		return null;
	}
	return data;
}

async function insertBranches(c: Context, companyId: number, branches: Array<{ code: string; description: string }>) {
	for (let i = 0; i < branches.length; i++) {
		const branchType = i === 0 ? 'main' : 'sub';
		await insertBranch(c, companyId, { ...branches[i], branchType });
	}
}

export { insertBranches };
