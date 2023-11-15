import { Hono } from 'hono';
import { BedrijfRegisterResponse } from './models/typesBedrijfRegisterAPI';
import { transformBusinessData } from './utils/transformMergedRegisterAPI';
import { fetchDetailsForBusinesses } from './api/kvk/fetchDetailsForBusinesses';
import { Environment } from './bindings';

// export interface Env {
// 	// Bindings can be added here if necessary.
// }

const app = new Hono<{ Bindings: Environment }>();

app.get('/kvk/', async (c) => {
	const params = c.req.query();

	let searchTerm = params.searchTerm || '';
	let includeActief = params.includeActief !== undefined ? params.includeActief === 'true' : true;
	let includeInactief = params.includeInactief !== undefined ? params.includeInactief === 'true' : true;
	let skip = parseInt(params.skip || '0', 10);
	let take = parseInt(params.take || '5', 10);

	const searchURL = `https://api.arubachamber.com/api/v1/bedrijf/public/search?searchTerm=${searchTerm}&includeActief=${includeActief}&includeInactief=${includeInactief}&skip=${skip}&take=${take}`;
	const searchResponse = await fetch(searchURL);
	const searchResponseBody: BedrijfRegisterResponse = await searchResponse.json();

	const detailedResponses: any[] = await fetchDetailsForBusinesses(searchResponseBody.resultSet);

	const mergedResults = searchResponseBody.resultSet.map((business, index) => {
		return transformBusinessData(business, detailedResponses[index]);
	});

	return c.json(mergedResults);
});

export default app;
