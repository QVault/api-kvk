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

	// Check if the data already exists
	const { data: existingData, error: fetchError } = await supabase.from('company').select('*').eq('external_id', uniqueId).single();
	if (fetchError && fetchError.code !== 'PGRST116') {
		console.error('Error fetching business:', fetchError);
		throw fetchError;
	}

	// If the data does not exist, insert it
	if (!existingData) {
		const { data, error } = await supabase
			.from('company')
			.insert([mapBusinessData(business)])
			.select('id');

		if (error) {
			console.error('Error inserting business:', error);
			throw error;
		}
		return data ? data[0].id : null; // Assuming the inserted record ID is needed
	} else {
		// If data already exists, just return its ID
		return existingData.id;
	}
}

async function upsertCapital(c: Context, companyId: number, capital: CapitalInfo) {
	const supabase = initSupabaseClient(c);

	// Check if capital data already exists
	const { data: existingData, error: fetchError } = await supabase
		.from('capital')
		.select('*')
		.eq('company_id', companyId) // Assuming 'companyId' is the field to match
		// Add other conditions as needed to identify unique capital records
		.single();

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
		const { data, error } = await supabase.from('capital').update(mapCapitalData(capital, companyId)).eq('id', existingData.id); // Assuming 'id' is the unique identifier

		if (error) {
			console.error('Error updating capital information:', error);
			throw error;
		}
		return data;
	}
}

async function upsertAddress(c: Context, companyId: number, address: BusinessAddress) {
	const supabase = initSupabaseClient(c);
	const { data: existingData, error: fetchError } = await supabase.from('address').select('*').eq('company_id', companyId).single();

	if (fetchError && fetchError.code !== 'PGRST116') {
		console.error('Error fetching address information:', fetchError);
		throw fetchError;
	}

	if (!existingData) {
		const { data, error } = await supabase.from('address').insert([mapAddressData(address, companyId)]);

		if (error) {
			console.error('Error inserting business address:', error);
			throw error;
		}
		return data;
	} else {
		const { data, error } = await supabase.from('address').update(mapAddressData(address, companyId)).eq('id', existingData.id);

		if (error) {
			console.error('Error updating business address:', error);
			throw error;
		}
		return data;
	}
}

async function upsertBranch(c: Context, companyId: number, branches: Array<{ code: string; description: string }>) {
	const supabase = initSupabaseClient(c);

	for (let i = 0; i < branches.length; i++) {
		const branchType = i === 0 ? 'main' : 'sub';
		const branchData = {
			company_id: companyId,
			code: branches[i].code,
			description: branches[i].description,
			branch_type: branchType,
		};

		// Check if the branch data already exists
		const { data: existingData, error: fetchError } = await supabase
			.from('branch')
			.select('*')
			.eq('company_id', companyId)
			.eq('code', branchData.code)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') {
			console.error('Error fetching branch information:', fetchError);
			throw fetchError;
		}

		if (!existingData) {
			// If the data does not exist, insert it
			const { error } = await supabase.from('branch').insert([branchData]);

			if (error) {
				console.error('Error inserting branch:', error);
				return null; // Handle the error case appropriately
			}
		} else {
			const { error } = await supabase.from('branch').update(branchData).eq('company_id', companyId).eq('code', branches[i].code); // Use 'company_id' and 'code' to target the correct record

			if (error) {
				console.error('Error updating branch:', error);
				return null; // Handle the error case appropriately
			}
		}
	}
}

async function upsertManager(c: Context, companyId: number, managers: BusinessManager | BusinessManager[]) {
	async function findCompanyIdByDossierCode(supabase, dossierCode: string): Promise<string | number | null> {
		const { data, error } = await supabase.from('company').select('id').eq('dossier_code', dossierCode).single();

		if (error) {
			console.error('Error finding company ID:', error);
			return null;
		}

		return data ? data.id : null;
	}

	const supabase = initSupabaseClient(c);
	managers = Array.isArray(managers) ? managers : [managers];

	for (const manager of managers) {
		let holdingCompanyIdRef = null;
		let holdingCompanyDossierCode = null;

		if (manager.dossierNumber) {
			holdingCompanyIdRef = await findCompanyIdByDossierCode(supabase, manager.dossierNumber);
			if (!holdingCompanyIdRef) {
				holdingCompanyDossierCode = manager.dossierNumber;
			}
		}

		// Check if manager already exists
		const existingManager = await supabase.from('management').select('*').eq('name', manager.name).single();

		if (existingManager.data) {
			// Update existing manager
			const { error } = await supabase
				.from('management')
				.update(mapManagerData(manager, companyId, holdingCompanyIdRef, holdingCompanyDossierCode))
				.match({ name: manager.name });

			if (error) {
				console.error('Error updating management member:', error);
			}
		} else {
			// Insert new manager
			const { error } = await supabase
				.from('management')
				.insert([mapManagerData(manager, companyId, holdingCompanyIdRef, holdingCompanyDossierCode)]);

			if (error) {
				console.error('Error inserting management member:', error);
			}
		}
	}
}

export default async function addCompleteBusinessData(c: Context, businesses: Business | Business[]) {
	// Ensure businesses is always an array
	businesses = Array.isArray(businesses) ? businesses : [businesses];

	for (const business of businesses) {
		try {
			const businessID = await upsertBusiness(c, business);
			await upsertCapital(c, businessID, business.capital);
			await upsertAddress(c, businessID, business.address);
			await upsertBranch(c, businessID, business.branches);
			await upsertManager(c, businessID, business.management);
		} catch (error) {
			console.error('Error processing business:', error);
		}
	}
}
