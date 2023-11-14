import { Dossier } from '../models/typesBedrijfRegisterAPI';
import { HandelRegisterResponse } from '../models/typesHandelRegisterAPI';
import { Business } from '../models/newTypes';

function transformBusinessData(bedrijfRegisterEntry: Dossier, handelRegisterEntry: HandelRegisterResponse): Business {
	const [code, branch] = bedrijfRegisterEntry.dossiernummerString.split('.');
	const [branchCode, branchDescription] = handelRegisterEntry.hoofdbranch.split(' - ');

	const transformedManagers: any = handelRegisterEntry.bestuur.map((manager) => {
		return {
			name: manager.naam,
			dossierNumber: manager.dossiernummer,
			title: manager.titel,
			role: manager.functie,
			birthCountry: manager.geboorteland,
			birthPlace: manager.geboorteplaats,
			startDate: manager.ingangsDatum,
			authority: manager.bevoegdheid,
		};
	});

	const transformedAddress: any = {
		streetName: bedrijfRegisterEntry.vestigingAdres.straatnaam ?? null,
		countryId: bedrijfRegisterEntry.vestigingAdres.landId,
		countryName: bedrijfRegisterEntry.vestigingAdres.landnaam,
		cityName: bedrijfRegisterEntry.vestigingAdres.plaatsnaam ?? null,
		number: bedrijfRegisterEntry.vestigingAdres.nummer ? String(bedrijfRegisterEntry.vestigingAdres.nummer) : null,
		houseNumber: bedrijfRegisterEntry.vestigingAdres.huisnummer != null ? bedrijfRegisterEntry.vestigingAdres.huisnummer : null,
		addition: bedrijfRegisterEntry.vestigingAdres.toevoeging ?? null,
		gacCode: bedrijfRegisterEntry.vestigingAdres.gacCode,
		gacStreetName: bedrijfRegisterEntry.vestigingAdres.gacStraatnaam,
		zone: bedrijfRegisterEntry.vestigingAdres.zone,
		region: bedrijfRegisterEntry.vestigingAdres.regio,
		// postalCode: bedrijfRegisterEntry.vestigingAdres.postcode ?? null,
	};

	let transformedSubBranches: any = [];

	if (handelRegisterEntry.subbranches && handelRegisterEntry.subbranches.length > 0) {
		transformedSubBranches = handelRegisterEntry.subbranches.map((subBranchEntry) => {
			const [subBranchCode, subBranchDescription] = subBranchEntry.split(' - ');
			return {
				code: subBranchCode,
				description: subBranchDescription,
			};
		});
	}

	return {
		dossier: {
			code: code,
			// branch: branch,
			type: bedrijfRegisterEntry.dossiernummer.bedrijfstype.name,
			registrationNumber: bedrijfRegisterEntry.dossiernummer.registratienummer,
			branchNumber: bedrijfRegisterEntry.dossiernummer.filiaalnummer,
		},
		name: bedrijfRegisterEntry.bedrijfsnaam,
		alternateName: bedrijfRegisterEntry.handelsnaam,
		mainBranch: {
			code: branchCode,
			description: branchDescription,
		},
		subBranch: transformedSubBranches,
		legalForm: bedrijfRegisterEntry.rechtsvorm,
		isActive: bedrijfRegisterEntry.isActief,
		address: transformedAddress,
		management: transformedManagers,
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
