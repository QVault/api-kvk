import { Business } from '../../models/newTypes';
import { initSupabaseClient } from './supabaseClient';
import { Context } from 'hono';

async function insertBusiness(c: Context, business: Business) {
	const supabase = initSupabaseClient(c);
	const { data, error } = await supabase.from('company').insert([
		{
			dossier_code: business.dossier.code,
			registration_number: business.dossier.registrationNumber,
			name: business.name,
			alternate_name: business.alternateName,
			legal_form: business.legalForm,
			is_active: business.isActive,
			status: business.status,
			products_available: business.productsAvailable,
			objective: business.objective,
			external_id: business.id.toString(),
		},
	]);

	if (error) {
		console.error('Error inserting business:', error);
		throw new Error('Error inserting business');
	}
	return data;
}

export { insertBusiness };
