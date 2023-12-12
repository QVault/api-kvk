import { HandelRegisterResponse } from '../../models/typesHandelRegisterAPI';
import { Dossier } from '../../models/typesBedrijfRegisterAPI';
import { Context } from 'hono';

// async function saveResponseToD1(c: Context, dossierCode: string, url: string, data: string): Promise<void> {
// 	const insertQuery = `INSERT INTO json_data (DOSSIER_CODE, URL, DATA) VALUES (?, ?, ?)`;
// 	const statement = c.env.DB.prepare(insertQuery);
// 	await statement.bind(dossierCode, url, data).all();
// }

async function saveResponseToR2(c: Context, dossierCode: string, data: any): Promise<void> {
	try {
		const dataToSave = typeof data === 'string' ? data : JSON.stringify(data);

		await c.env.R2.put(dossierCode, dataToSave);
	} catch (error) {
		console.error('Error saving to R2:', error);
		throw error;
	}
}

async function fetchDetailsForBusinesses(env: Context, searchResults: Dossier[]): Promise<any[]> {
	return await Promise.all(
		searchResults.map(async (business) => {
			const coreCode = business.dossiernummer.registratienummer;
			const branchId = business.dossiernummer.filiaalnummer;
			const dossierCode = coreCode.toString() + '.' + branchId.toString();
			const businessType = business.dossiernummer.bedrijfstype.name;
			const detailUrl = `https://api.arubachamber.com/api/v1/bedrijf/public/details/${businessType}/${coreCode}/${branchId}`;
			// console.log('Fetching details for:', detailUrl);

			const detailResponse = await fetch(detailUrl);
			const jsonResponse = await detailResponse.json();

			await saveResponseToR2(env, dossierCode, JSON.stringify(jsonResponse));
			return jsonResponse as HandelRegisterResponse;
		})
	);
}

export { fetchDetailsForBusinesses };
