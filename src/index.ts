import { BedrijfRegisterResponse, Dossier } from './models/typesBedrijfRegisterAPI';
import { HandelRegisterResponse } from './models/typesHandelRegisterAPI';
import { transformBusinessData } from './utils/transformMergedRegisterAPI';

export interface Env {
	// Bindings can be added here if necessary.
}

async function fetchDetailsForBusinesses(searchResults: Dossier[]): Promise<any[]> {
	return await Promise.all(
		searchResults.map(async (business) => {
			const coreCode = business.dossiernummer.registratienummer;
			const branchId = business.dossiernummer.filiaalnummer;
			const detailUrl = `https://api.arubachamber.com/api/v1/bedrijf/public/HANDELSREGISTER/${coreCode}/${branchId}`;
			const detailResponse = await fetch(detailUrl);
			const jsonResponse = await detailResponse.json();
			return jsonResponse as HandelRegisterResponse;
		})
	);
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const params = url.searchParams;

		let searchTerm = params.get('searchTerm') || '';
		let includeActief = params.get('includeActief') !== null ? params.get('includeActief') === 'true' : true;
		let includeInactief = params.get('includeInactief') !== null ? params.get('includeInactief') === 'true' : true;
		let skip = parseInt(params.get('skip') || '0', 10);
		let take = parseInt(params.get('take') || '5', 10);

		const searchURL = `https://api.arubachamber.com/api/v1/bedrijf/public/search?searchTerm=${searchTerm}&includeActief=${includeActief}&includeInactief=${includeInactief}&skip=${skip}&take=${take}`;
		const searchResponse = await fetch(searchURL);
		const searchResponseBody: BedrijfRegisterResponse = await searchResponse.json();

		const detailedResponses: any[] = await fetchDetailsForBusinesses(searchResponseBody.resultSet);

		const mergedResults = searchResponseBody.resultSet.map((business, index) => {
			return transformBusinessData(business, detailedResponses[index]);
		});

		return new Response(JSON.stringify(mergedResults), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
