import { transformDoelstelling, joinWithSpace } from './utility';

import { HandelRegisterResponse, Bestuurder } from '../models/typesHandelRegisterAPI';

export default function transformHandelRegisterAPI(apiData: HandelRegisterResponse) {
	return {
		Address: {
			businessCode: apiData.dossiernummerString,
			streetName: apiData.vestigingAdres.gacStraatnaam,
			houseNumber: joinWithSpace(apiData.vestigingAdres.huisnummer, apiData.vestigingAdres.toevoeging),
			gacCode: apiData.vestigingAdres.gacCode,
		},
		BoardMember: apiData.bestuur.map((bm: Bestuurder) => ({
			name: bm.naam,
			function: bm.functie,
			birthCountry: bm.geboorteland,
			birthPlace: bm.geboorteplaats,
			startDate: bm.ingangsDatum,
			authority: bm.bevoegdheid,
			businessLocationId: apiData.dossiernummerString,
			title: bm.titel || undefined,
			fileNumber: bm.dossiernummer || undefined,
		})),
		Capital: {
			authorized: apiData.kapitaalMaatschappelijk,
			businessLocationId: apiData.dossiernummerString,
			currency: apiData.kapitaalValuta,
			currencyId: apiData.kapitaalValutaId,
			endFiscalYear: apiData.kapitaalEindBoekjaar || undefined,
			issued: apiData.kapitaalGeplaatst,
			paidIn: apiData.kapitaalGestort,
			startFiscalYear: apiData.kapitaalBeginBoekjaar || undefined,
		},
		BusinessLocation: {
			externalReferenceId: apiData.id,
			establishmentDate: apiData.datumVestiging,
			statusStartDate: apiData.datumIngangStatus,
			statuteChangeDate: apiData.datumStatutenWijziging || undefined,
			currentStatus: apiData.status,
			productsAvailable: apiData.productenBeschikbaar,
			doelstellingNL: apiData.doelstellingNL,
		},
		Business: {
			coreCode: apiData.dossiernummerString,
			name: apiData.bedrijfsnaam,
			legalForm: apiData.rechtsvorm,
			statutorySeat: apiData.statutaireZetel,
		},
	};
}
