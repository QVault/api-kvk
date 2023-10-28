import { Dossier } from '../models/typesBedrijfRegisterAPI';

export default function transformBedrijfRegisterAPI(dossierData: Dossier) {
	return {
		BusinessRegistry: {
			name: dossierData.dossiernummer.bedrijfstype.name,
		},
		Business: {
			coreCode: dossierData.dossiernummerString.split('.')[0],
			name: dossierData.bedrijfsnaam,
		},
		BusinessLocation: {
			BusinessCode: dossierData.dossiernummerString,
			businessName: dossierData.bedrijfsnaam,
			alternativeName: dossierData.handelsnaam,
			isActive: dossierData.isActief,
			locationCode: dossierData.dossiernummer.filiaalnummer,
		},
		BranchType: {
			name: dossierData.hoofdbranch,
		},
		EntityType: {
			name: dossierData.rechtsvorm,
		},
		Address: {
			BusinessCode: dossierData.dossiernummerString,
			streetName: dossierData.vestigingAdres.gacStraatnaam,
			houseNumber: `${dossierData.vestigingAdres.huisnummer}${dossierData.vestigingAdres.toevoeging || ''}`,
			gacCode: dossierData.vestigingAdres.gacCode,
		},
		Zone: {
			name: dossierData.vestigingAdres.zone,
		},
		Region: {
			name: dossierData.vestigingAdres.regio,
		},
	};
}
