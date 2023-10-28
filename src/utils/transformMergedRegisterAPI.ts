import { Dossier } from '../models/typesBedrijfRegisterAPI';
import { HandelRegisterResponse } from '../models/typesHandelRegisterAPI';
import { Business } from '../models/newTypes';

function transformBusinessData(bedrijfRegisterEntry: Dossier, handelRegisterEntry: HandelRegisterResponse): Business {
	// Extract necessary info from the old structure
	const [code, branch] = bedrijfRegisterEntry.dossiernummerString.split('.');
	const [branchCode, branchDescription] = bedrijfRegisterEntry.hoofdbranch.split(' - ');

	return {
		dossier: {
			code: code,
			branch: branch,
			type: bedrijfRegisterEntry.dossiernummer.bedrijfstype,
			registrationNumber: bedrijfRegisterEntry.dossiernummer.registratienummer,
			branchNumber: bedrijfRegisterEntry.dossiernummer.filiaalnummer,
		},
		name: bedrijfRegisterEntry.bedrijfsnaam,
		alternateName: bedrijfRegisterEntry.handelsnaam,
		mainBranch: {
			code: branchCode,
			description: branchDescription,
		},
		legalForm: bedrijfRegisterEntry.rechtsvorm,
		isActive: bedrijfRegisterEntry.isActief,
		address: bedrijfRegisterEntry.vestigingAdres,
		management: handelRegisterEntry.bestuur,
		capital: {
			invested: handelRegisterEntry.kapitaalGestort,
			currencyId: handelRegisterEntry.kapitaalValutaId,
			currency: handelRegisterEntry.kapitaalValuta,
			startYearCapital: handelRegisterEntry.kapitaalBeginBoekjaar,
			endYearCapital: handelRegisterEntry.kapitaalEindBoekjaar,
		},
		objective: handelRegisterEntry.doelstellingNL,
		status: handelRegisterEntry.status,
		productsAvailable: handelRegisterEntry.productenBeschikbaar,
		id: handelRegisterEntry.id,
	};
}

export { transformBusinessData };
