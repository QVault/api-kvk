import { Context } from 'hono';
import { initSupabaseClient } from './supabaseClient';

import { mapBusinessData, mapAddressData, mapCapitalData, mapManagerData, mapBranchData } from '../../mappings';
import { Business, BusinessAddress, CapitalInfo, BusinessManager } from '../../models/newTypes';

async function upsertBusiness(c: Context, business: Business) {
	const supabase = initSupabaseClient(c);
	const uniqueId = business.id;

	if (uniqueId === null || uniqueId === undefined) {
		console.error('Error: external_id is null or undefined.');
		throw new Error('Invalid external_id');
	}

	// Upsert operation: insert if new, update if exists
	const { data, error } = await supabase.from('company').upsert(mapBusinessData(business), { onConflict: 'external_id' }).select('id');

	if (error) {
		console.error('Error in upserting business:', error);
		throw error;
	}

	return data ? data[0].id : null;
}

async function upsertCapital(c: Context, companyId: number, capital: CapitalInfo) {
	const supabase = initSupabaseClient(c);

	// Check if capital data already exists
	const { data: existingData, error: fetchError } = await supabase.from('capital').select('*').eq('company_id', companyId).single();

	if (fetchError && fetchError.code !== 'PGRST116') {
		console.error('Error fetching capital information:', fetchError);
		throw fetchError;
	}

	if (!existingData) {
		// If the data does not exist, insert it
		const { data, error } = await supabase.from('capital').insert([mapCapitalData(capital, companyId)]);

		if (error) {
			console.error('Error inserting capital information:', error);
			throw new Error('Error inserting capital information');
		}
		return data;
	} else {
		// If data already exists, update it
		const { data, error } = await supabase.from('capital').update(mapCapitalData(capital, companyId)).eq('id', existingData.id);

		if (error) {
			console.error('Error updating capital information:', error);
			throw error;
		}
		return data;
	}
}

async function upsertAddress(c: Context, companyId: number, address: BusinessAddress) {
	const supabase = initSupabaseClient(c);

	const { error } = await supabase.from('address').upsert(mapAddressData(address, companyId), { onConflict: 'company_id' }).select('id');

	if (error) {
		console.error('Error in upserting business address:', error);
		throw error;
	}
}

async function upsertBranch(c: Context, companyId: number, branches: Array<{ code: string; description: string }>) {
	const supabase = initSupabaseClient(c);

	const branchData = branches.map((branch, index) => ({
		conflict_id: `${companyId}_${branch.code}`,
		company_id: companyId,
		code: branch.code,
		description: branch.description,
		branch_type: index === 0 ? 'main' : 'sub',
	}));

	const { error } = await supabase.from('branch').upsert(branchData, { onConflict: 'conflict_id' });

	if (error) {
		console.error('Error in upserting branches:', error);
		throw error;
	}
}

async function upsertManager(c: Context, companyId: number, managers: BusinessManager | BusinessManager[]) {
	const supabase = initSupabaseClient(c);
	managers = Array.isArray(managers) ? managers : [managers];

	// Pre-fetch all relevant manager entries in a single query
	const managerNames = managers.map((manager) => manager.name);
	const { data: existingManagers } = await supabase.from('management').select('name').in('name', managerNames);
	const existingManagerNames = new Set(existingManagers.map((manager) => manager.name));
	console.log('managers', Array.from(existingManagerNames));

	for (const manager of managers) {
		const managerData = mapManagerData(manager, companyId);

		if (existingManagerNames.has(manager.name)) {
			// Update existing manager
			const { error } = await supabase.from('management').update(managerData).eq('name', manager.name).eq('company_id', companyId);

			if (error) {
				console.error('Error updating management member:', error);
			}
		} else {
			// Insert new manager
			const { error } = await supabase.from('management').insert([managerData]);

			if (error) {
				console.error('Error inserting management member:', error);
			}
		}
	}
}

export default async function addCompleteBusinessData(c: Context, businesses: Business | Business[]) {
	businesses = Array.isArray(businesses) ? businesses : [businesses];

	for (const business of businesses) {
		const businessID = await upsertBusiness(c, business);

		const upsertTasks = [
			upsertCapital(c, businessID, business.capital),
			upsertAddress(c, businessID, business.address),
			upsertBranch(c, businessID, business.branches),
			upsertManager(c, businessID, business.management),
		];

		const results = await Promise.allSettled(upsertTasks);

		for (const result of results) {
			if (result.status === 'rejected') {
				console.error('Error in an upsert operation:', result.reason);
			}
		}
	}
}
