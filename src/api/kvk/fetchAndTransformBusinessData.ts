import { BedrijfRegisterResponse } from '../../models/typesBedrijfRegisterAPI';
import { transformBusinessData } from '../../utils/transformMergedRegisterAPI';
import { fetchDetailsForBusinesses } from '../../api/kvk/fetchDetailsForBusinesses';
import { Context } from 'hono';

async function fetchAndTransformBusinessData(
	env: Context,
	searchTerm = '',
	includeActief = true,
	includeInactief = true,
	skip = 0,
	take = 5
) {
	const searchURL = `https://api.arubachamber.com/api/v1/bedrijf/public/search?searchTerm=${searchTerm}&includeActief=${includeActief}&includeInactief=${includeInactief}&skip=${skip}&take=${take}`;
	const searchResponse = await fetch(searchURL);
	const searchResponseBody: BedrijfRegisterResponse = await searchResponse.json();

	//const detailedResponses = await fetchDetailsForBusinesses(searchResponseBody.resultSet);
	const detailedResponses = await fetchDetailsForBusinesses(env, searchResponseBody.resultSet);

	return searchResponseBody.resultSet.map((business, index) => {
		return transformBusinessData(business, detailedResponses[index]);
	});
}

export { fetchAndTransformBusinessData };
