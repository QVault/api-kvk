import { Context } from 'hono';
import { initSupabaseClient } from './supabaseClient';
import { BusinessManager } from '../../models/newTypes';

async function findCompanyIdByDossierCode(c: Context, dossierCode: string): Promise<string | number | null> {
	const supabase = initSupabaseClient(c);
	const { data, error } = await supabase.from('company').select('id').eq('dossier_code', dossierCode).single();

	if (error) {
		console.error('Error finding company ID:', error);
		return null;
	}

	return data ? data.id : null;
}

async function insertManager(c: Context, companyId: number, manager: BusinessManager) {
	let holdingCompanyIdRef = null;
	if (manager.dossierNumber) {
		holdingCompanyIdRef = await findCompanyIdByDossierCode(c, manager.dossierNumber);
	}

	const supabase = initSupabaseClient(c);
	const { data, error } = await supabase.from('management').insert([
		{
			holding_company_id_ref: holdingCompanyIdRef,
			company_id: companyId,
			name: manager.name,
			role: manager.role,
			birth_country: manager.birthCountry,
			birth_place: manager.birthPlace,
			start_date: manager.startDate,
			authority: manager.authority,
			title: manager.title,
		},
	]);

	if (error) {
		console.error('Error inserting management member:', error);
		return null;
	}
	return data;
}

async function insertManagers(c: Context, companyId: number, managers: Array<BusinessManager>) {
	for (const manager of managers) {
		await insertManager(c, companyId, manager);
	}
}

export { insertManagers, findCompanyIdByDossierCode };
