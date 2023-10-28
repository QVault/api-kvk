export interface BedrijfRegisterResponse {
	totalRowCount: number;
	resultSet: Dossier[];
}

export interface Bedrijfstype {
	nameEN: string;
	nameES: string;
	id: number;
	name: string;
}

export interface Dossier {
	dossiernummerString: string;
	dossiernummer: {
		bedrijfstype: Bedrijfstype;
		registratienummer: number;
		filiaalnummer: number;
		value: string;
	};
	bedrijfsnaam: string;
	hoofdbranch: string;
	bedrijfstypeName: string;
	rechtsvorm: string;
	isActief: boolean;
	vestigingAdres: VestigingAdres;
	handelsnaam: string;
}

export interface VestigingAdres {
	straatnaam?: string | null;
	landId: number;
	landnaam: string;
	plaatsnaam?: string | null;
	nummer?: string | number | null;
	huisnummer?: number | null;
	toevoeging?: string;
	gacCode: number;
	gacStraatnaam?: string;
	zone?: string;
	regio: string;
	postcode?: string | null;
}
