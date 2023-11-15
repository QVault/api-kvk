import { BusinessAddress } from '../../models/newTypes';
import { initSupabaseClient } from './supabaseClient';
import { Context } from 'hono';

async function insertBusinessAddress(c: Context, companyId: number, address: BusinessAddress) {
	const supabase = initSupabaseClient(c);
	const { data, error } = await supabase.from('address').insert([
		{
			company_id: companyId,
			street_name: address.streetName,
			country_id: address.countryId,
			country_name: address.countryName,
			city_name: address.cityName,
			number: address.number,
			house_number: address.houseNumber,
			addition: address.addition,
			gac_code: address.gacCode,
			gac_street_name: address.gacStreetName,
			zone: address.zone,
			region: address.region,
		},
	]);

	if (error) {
		console.error('Error inserting business address:', error);
	}
	return data;
}

export { insertBusinessAddress };
