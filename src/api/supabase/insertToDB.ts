import { Context } from 'hono';
import { initSupabaseClient } from './supabaseClient';

import { mapBusinessData, mapAddressData, mapCapitalData, mapManagerData } from '../../mappings';
import { Business, BusinessAddress, CapitalInfo, BusinessManager } from '../../models/newTypes';
import { updateAndLogChanges } from './insertChanges';

async function insertOrUpdateBusiness(c: Context, business: Business) {
	const supabase = initSupabaseClient(c);
	const uniqueId = business.id;

	console.log('Unique ID for check:', uniqueId);

	if (uniqueId === null || uniqueId === undefined) {
		console.error('Error: external_id is null or undefined.');
		throw new Error('Invalid external_id');
	}

	const { data: existingData, error: fetchError } = await supabase.from('company').select('*').eq('external_id', uniqueId).single();

	console.log('Query result:', existingData);

	if (fetchError && fetchError.code !== 'PGRST116') {
		console.error('Error fetching business:', fetchError);
		throw fetchError;
	}

	console.log(existingData);

	if (existingData) {
		console.log('Existing data found, updating record.');
		return await updateAndLogChanges(supabase, 'company', existingData, business, mapBusinessData);
	} else {
		console.log('No existing data, inserting new record.');
		const { data, error } = await supabase
			.from('company')
			.insert([mapBusinessData(business)])
			.select('id');

		if (error) {
			console.error('Error inserting business:', error);
			throw error;
		}
		return data;
	}
}

async function insertCapital(c: Context, companyId: number, capital: CapitalInfo) {
	const supabase = initSupabaseClient(c);
	const { data, error } = await supabase.from('capital').insert([mapCapitalData(capital, companyId)]);
	if (error) {
		console.error('Error inserting capital information:', error);
		throw new Error('Error inserting capital information');
	}
	return data;
}

async function insertAddress(c: Context, companyId: number, address: BusinessAddress) {
	const supabase = initSupabaseClient(c);
	const dbObject = mapAddressData(companyId, address);
	const { data, error } = await supabase.from('address').insert([dbObject]);

	if (error) {
		console.error('Error inserting business address:', error);
		return null;
	}
	return data;
}

async function insertBranch(c: Context, companyId: number, branches: Array<{ code: string; description: string }>) {
	const supabase = initSupabaseClient(c);

	for (let i = 0; i < branches.length; i++) {
		const branchType = i === 0 ? 'main' : 'sub';
		const branchData = {
			company_id: companyId,
			code: branches[i].code,
			description: branches[i].description,
			branch_type: branchType,
		};

		const { error } = await supabase.from('branch').insert([branchData]);
		if (error) {
			console.error('Error inserting branch:', error);
			return null; // Handle the error case by returning null or appropriate error response
		}
	}
}

async function insertManager(c: Context, companyId: number, managers: BusinessManager | BusinessManager[]) {
	const supabase = initSupabaseClient(c);

	async function findCompanyIdByDossierCode(supabase, dossierCode: string): Promise<string | number | null> {
		const { data, error } = await supabase.from('company').select('id').eq('dossier_code', dossierCode).single();

		if (error) {
			console.error('Error finding company ID:', error);
			return null;
		}

		return data ? data.id : null;
	}

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
		const { data, error } = await supabase
			.from('management')
			.insert([mapManagerData(manager, companyId, holdingCompanyIdRef, holdingCompanyDossierCode)]);

		if (error) {
			console.error('Error inserting management member:', error);
			return null; // Or consider throwing an error
		}
	}
}

export default async function addCompleteBusinessData(c: Context, businesses: Business[]) {
	for (const business of businesses) {
		try {
			const businessData = await insertOrUpdateBusiness(c, business);
			console.log(businessData);
			if (!businessData || !businessData.length) {
				throw new Error('Error retrieving company ID');
			}

			const companyId = businessData[0].id;
			console.log('Company ID:', companyId);

			await insertAddress(c, companyId, business.address);
			await insertCapital(c, companyId, business.capital);
			await insertBranch(c, companyId, business.branches);
			await insertManager(c, companyId, business.management);
		} catch (error) {
			console.error('Error processing business:', error);
		}
	}
}
