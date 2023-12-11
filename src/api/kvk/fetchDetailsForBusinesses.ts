import { HandelRegisterResponse } from '../../models/typesHandelRegisterAPI';
import { Dossier } from '../../models/typesBedrijfRegisterAPI';

async function fetchDetailsForBusinesses(searchResults: Dossier[]): Promise<any[]> {
	return await Promise.all(
		searchResults.map(async (business) => {
			const coreCode = business.dossiernummer.registratienummer;
			const branchId = business.dossiernummer.filiaalnummer;
			const businessType = business.dossiernummer.bedrijfstype.name;
			const detailUrl = `https://api.arubachamber.com/api/v1/bedrijf/public/details/${businessType}/${coreCode}/${branchId}`;
			console.log('Fetching details for:', detailUrl);

			const detailResponse = await fetch(detailUrl);
			const jsonResponse = await detailResponse.json();
			return jsonResponse as HandelRegisterResponse;
		})
	);
}

export { fetchDetailsForBusinesses };
