import { Dossier } from '../models/typesBedrijfRegisterAPI';
import { HandelRegisterResponse } from '../models/typesHandelRegisterAPI';
import { Business, BusinessManager, BusinessAddress, BranchInfo } from '../models/newTypes';

function transformBusinessData(bedrijfRegisterEntry: Dossier, handelRegisterEntry: HandelRegisterResponse): Business {
	const code = bedrijfRegisterEntry.dossiernummerString.split('.')[0];

	const transformedManagers: BusinessManager[] = [];

	if (handelRegisterEntry.bedrijfDetailsUitgebreid && Array.isArray(handelRegisterEntry.bedrijfDetailsUitgebreid.bestuur)) {
		transformedManagers.push(
			...handelRegisterEntry.bedrijfDetailsUitgebreid.bestuur.map((manager) => ({
				name: manager.naam,
				dossierNumber: manager.dossiernummer || null,
				title: manager.titel || null,
				role: manager.functie,
				birthCountry: manager.geboorteland,
				birthPlace: manager.geboorteplaats,
				startDate: new Date(manager.ingangsDatum),
				authority: manager.bevoegdheid,
			}))
		);
	}

	const transformedAddress: BusinessAddress = {
		streetName: bedrijfRegisterEntry.vestigingAdres.straatnaam ?? null,
		countryId: bedrijfRegisterEntry.vestigingAdres.landId,
		countryName: bedrijfRegisterEntry.vestigingAdres.landnaam,
		cityName: bedrijfRegisterEntry.vestigingAdres.plaatsnaam ?? null,
		number: bedrijfRegisterEntry.vestigingAdres.nummer ? String(bedrijfRegisterEntry.vestigingAdres.nummer) : null,
		houseNumber: bedrijfRegisterEntry.vestigingAdres.huisnummer != null ? bedrijfRegisterEntry.vestigingAdres.huisnummer : null,
		addition: bedrijfRegisterEntry.vestigingAdres.toevoeging ?? null,
		gacCode: bedrijfRegisterEntry.vestigingAdres.gacCode,
		gacStreetName: bedrijfRegisterEntry.vestigingAdres.gacStraatnaam || '',
		zone: bedrijfRegisterEntry.vestigingAdres.zone || '',
		region: bedrijfRegisterEntry.vestigingAdres.regio,
		// postalCode: bedrijfRegisterEntry.vestigingAdres.postcode ?? null,
	};

	const branches: BranchInfo[] = [];

	if (handelRegisterEntry.bedrijfDetailsUitgebreid) {
		const bedrijfDetails = handelRegisterEntry.bedrijfDetailsUitgebreid;

		console.log('Hoofdbranch:', bedrijfDetails.hoofdbranch);
		console.log('Subbranches:', bedrijfDetails.subbranches);

		if (bedrijfDetails.hoofdbranch) {
			const [branchCode, branchDescription] = bedrijfDetails.hoofdbranch.split(' - ');
			branches.push({ code: branchCode, description: branchDescription });
		}

		if (bedrijfDetails.subbranches && Array.isArray(bedrijfDetails.subbranches)) {
			bedrijfDetails.subbranches.forEach((subBranchEntry) => {
				if (subBranchEntry) {
					const [subBranchCode, subBranchDescription] = subBranchEntry.split(' - ');
					branches.push({ code: subBranchCode, description: subBranchDescription });
				}
			});
		}
	}

	let transformObjective = [];

	if (handelRegisterEntry.bedrijfDetailsUitgebreid) {
		transformObjective = [
			handelRegisterEntry.bedrijfDetailsUitgebreid.doelstellingNL,
			handelRegisterEntry.bedrijfDetailsUitgebreid.doelstellingEN,
		]
			.filter(Boolean)
			.join(' ');
	}

	const capital = {
		invested: handelRegisterEntry.bedrijfDetailsUitgebreid?.financien?.invested ?? null,
		currencyId: handelRegisterEntry.bedrijfDetailsUitgebreid?.financien?.currencyId ?? null,
		currency: handelRegisterEntry.bedrijfDetailsUitgebreid?.financien?.currency ?? null,
		startYearCapital: handelRegisterEntry.bedrijfDetailsUitgebreid?.financien?.startYearCapital ?? null,
		endYearCapital: handelRegisterEntry.bedrijfDetailsUitgebreid?.financien?.endYearCapital ?? null,
	};

	let status = '';
	let grootKlein;
	let datumVestiging;
	let datumIngangStatus;
	let datumStatutenWijziging;

	if (handelRegisterEntry.bedrijfDetailsBasis) {
		status = handelRegisterEntry.bedrijfDetailsBasis.status || '';
		grootKlein = handelRegisterEntry.bedrijfDetailsBasis.grootKlein;
		datumVestiging = handelRegisterEntry.bedrijfDetailsBasis.datumVestiging || null;
		datumIngangStatus = handelRegisterEntry.bedrijfDetailsBasis.datumIngangStatus || null;
		datumStatutenWijziging = handelRegisterEntry.bedrijfDetailsBasis.datumStatutenWijziging || null;
	}

	return {
		dossier: {
			code: code,
			type: bedrijfRegisterEntry.dossiernummer.bedrijfstype.name,
			registrationNumber: bedrijfRegisterEntry.dossiernummer.registratienummer,
			branchNumber: bedrijfRegisterEntry.dossiernummer.filiaalnummer,
		},
		name: bedrijfRegisterEntry.bedrijfsnaam,
		alternateName: bedrijfRegisterEntry.handelsnaam,
		branches: branches,
		businessType: grootKlein,
		dateOfEstablishment: datumVestiging ? new Date(datumVestiging) : null,
		dateOfStatus: datumIngangStatus ? new Date(datumIngangStatus) : null,
		dateOfStatuteChange: datumStatutenWijziging ? new Date(datumStatutenWijziging) : null,
		legalForm: bedrijfRegisterEntry.rechtsvorm,
		isActive: bedrijfRegisterEntry.isActief,
		address: transformedAddress,
		management: transformedManagers,
		capital: capital,
		objective: transformObjective,
		status: status,
		productsAvailable: handelRegisterEntry.productenBeschikbaar,
		id: handelRegisterEntry.id,
	};
}

export { transformBusinessData };
