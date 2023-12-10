import { Hono } from 'hono';
import { Environment } from './bindings';
import { fetchAndTransformBusinessData } from './api/kvk/fetchAndTransformBusinessData';
import { DetailedError } from './api/supabase/detailedError';

import addCompleteBusinessData from './api/supabase/insertToDB';
const app = new Hono<{ Bindings: Environment }>();

app.get('/kvk/', async (c) => {
	const params = c.req.query();

	const searchTerm = params.searchTerm || '';
	const includeActief = params.includeActief !== undefined ? params.includeActief === 'true' : true;
	const includeInactief = params.includeInactief !== undefined ? params.includeInactief === 'true' : true;
	const skip = parseInt(params.skip || '0', 10);
	const take = parseInt(params.take || '5', 10);

	const mergedResults = await fetchAndTransformBusinessData(searchTerm, includeActief, includeInactief, skip, take);

	return c.json(mergedResults);
});

app.post('/kvk/', async (c) => {
	const params = await c.req.query();

	const searchTerm = params.searchTerm || '';
	const includeActief = params.includeActief !== undefined ? params.includeActief === 'true' : true;
	const includeInactief = params.includeInactief !== undefined ? params.includeInactief === 'true' : true;
	const skip = parseInt(params.skip || '0', 10);
	const take = parseInt(params.take || '5', 10);

	const mergedResults = await fetchAndTransformBusinessData(searchTerm, includeActief, includeInactief, skip, take);

	// variable 2 store the keys
	const keys = [];

	for (const result of mergedResults) {
		const key = `${result.dossier.code}.${result.dossier.branchNumber}`;
		keys.push(key);
		await c.env.KVK_REGISTRY.put(key, JSON.stringify(result));
	}

	return c.json({ message: keys });
});

app.post('/addBusinessData/:key', async (c) => {
	try {
		const key = c.req.param('key');

		const getRouteResponse = await c.env.KVK_REGISTRY.get(key);
		if (!getRouteResponse) {
			throw new Error(`No data found for key: ${key}`);
		}
		const businessData = JSON.parse(getRouteResponse);
		console.log(`Before insertOrUpdateCapital, companyId: ${businessData.id}`);

		await addCompleteBusinessData(c, businessData);
		return c.json({ message: businessData });
	} catch (error) {
		console.error('Error adding business data:', error);
		if (error instanceof DetailedError) {
			return c.json({
				message: error.message,
				detail: error.detail,
			});
		}
		return c.json({
			message: `Failed to add business data: ${error.message}`,
		});
	}
});

export default app;
