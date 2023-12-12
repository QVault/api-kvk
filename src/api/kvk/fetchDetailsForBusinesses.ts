import { HandelRegisterResponse } from '../../models/typesHandelRegisterAPI';
import { Dossier } from '../../models/typesBedrijfRegisterAPI';
import { Context } from 'hono';

async function saveResponseToD1(env: Context, dossierCode: string, url: string, data: string): Promise<void> {
	const insertQuery = `INSERT INTO your_table_name (DOSSIER_CODE, URL, DATA) VALUES (?, ?, ?)`;
	const statement = env.DB.prepare(insertQuery);
	await statement.bind(dossierCode, url, data).all();
}

async function fetchDetailsForBusinesses(env: Context, searchResults: Dossier[]): Promise<any[]> {
	return await Promise.all(
		searchResults.map(async (business) => {
			const coreCode = business.dossiernummer.registratienummer;
			const branchId = business.dossiernummer.filiaalnummer;
			const businessType = business.dossiernummer.bedrijfstype.name;
			const detailUrl = `https://api.arubachamber.com/api/v1/bedrijf/public/details/${businessType}/${coreCode}/${branchId}`;
			// console.log('Fetching details for:', detailUrl);

			const detailResponse = await fetch(detailUrl);
			const jsonResponse = await detailResponse.json();

			await saveResponseToD1(env, coreCode.toString(), detailUrl, JSON.stringify(jsonResponse));
			return jsonResponse as HandelRegisterResponse;
		})
	);
}

export { fetchDetailsForBusinesses };
