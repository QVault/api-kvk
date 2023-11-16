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
	// Extract parameters from the request body
	const params = await c.req.query();

	const searchTerm = params.searchTerm || '';
	const includeActief = params.includeActief !== undefined ? params.includeActief === 'true' : true;
	const includeInactief = params.includeInactief !== undefined ? params.includeInactief === 'true' : true;
	const skip = parseInt(params.skip || '0', 10);
	const take = parseInt(params.take || '5', 10);

	// Fetch and transform the data using your function
	const mergedResults = await fetchAndTransformBusinessData(searchTerm, includeActief, includeInactief, skip, take);

	// Store the data in Cloudflare KV
	await c.env.KVK_Aruba.put('kvk_aruba_data', JSON.stringify(mergedResults));

	// Respond back
	return c.json({ message: 'Data stored successfully in Cloudflare KV' });
});

app.post('/addBusinessData', async (c) => {
	try {
		const getRouteResponse = await c.env.KVK_Aruba.get('kvk_aruba_data');
		const businessData = JSON.parse(getRouteResponse);
		await addCompleteBusinessData(c, businessData);
		return c.json({ message: 'Business data added successfully' });
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
