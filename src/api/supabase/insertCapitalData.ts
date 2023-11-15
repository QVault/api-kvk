import { Context } from 'hono';
import { CapitalInfo } from '../../models/newTypes';
import { initSupabaseClient } from './supabaseClient';

async function insertCapital(c: Context, companyId: number, capital: CapitalInfo) {
	const supabase = initSupabaseClient(c);
	const { data, error } = await supabase.from('capital').insert([
		{
			company_id: companyId,
			invested: capital.invested,
			currency_id: capital.currencyId,
			currency: capital.currency,
			start_year_capital: capital.startYearCapital,
			end_year_capital: capital.endYearCapital,
		},
	]);

	if (error) {
		console.error('Error inserting capital information:', error);
		throw new Error('Error inserting capital information');
	}
	return data;
}

export { insertCapital };
